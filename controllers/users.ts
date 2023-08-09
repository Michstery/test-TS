import express, { NextFunction, Request, Response } from "express";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/users");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

interface Body {
  email: string;
  password: string;
  userName?: string;
}

interface Data extends Body {
  userId: string;
  role?: string;
}

module.exports = {
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, userName } = req.body as Body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const dataToSave: Data = {
        email: email.toLowerCase(),
        password: hashedPassword,
        userName,
        role: req.body.role,
        userId: uuidv4(),
      };
      const savedData = await User.create(dataToSave);
      res.status(200).json({
        data: savedData,
        status: "true",
        message: "success",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: `${error}`,
      });
    }
  },

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as Body;
      if (!password || !email) {
        res.status(400).json({
          status: false,
          message: "please provide both password and email fields",
        });
      }
      const user = await User.findOne({
        email: email.toLowerCase(),
      });
      if (!user) {
        res.status(404).json({
          status: false,
          message: "Email does not exist",
        });
      }
      const AwaitedUser = await user.comparePassword(password);
      if (user && !AwaitedUser) {
        res.status(404).json({
          status: false,
          message: "Invalid password",
        });
      }
      const token = user.createJWT();

      return res.status(201).json({
        status: "success",
        user: user,
        token,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: `${error}`,
      });
    }
  },

  async logoutUser(req: any, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    const user = await User.findOne({ email: req.user.email });
    req.user = user;
    req.token = token;
    if (!req.user || !token) {
        return next(   
            res.status(404).json({
                status: false,
                message: "You are not logged in",
            })
        )
    }
    delete req.token;
    delete req.user;
    return res.status(201).json({
      status: "success",
      message: "You have logged out successfully",
    });
  },

  async getUser(req: any, res: Response, next: NextFunction) { 
    if (req.user.role != 'admin') {
        return res.status(400).json({
            status: "false",
            message: "Only Admins are Authorized to Get Users",
        });
    } else{
        try {
            const { dateFrom, dateTo, ...rest } = req.query
            const query = {
                ...rest,
            }
            if (req.query.userId) {
                const user = await User.findOne({
                    userId: req.query.userId
                })
                if (!user) {
                    return res.status(404).json({
                        status: "false",
                        message: "We are currently unable to get this user details.",
                    });
                }
                return res.status(201).json({
                    status: "success",
                    user: user.toJSON(),
                });
            }
            return res.status(201).json({
                status: "success",
                responseBody: await User.find(query).sort({ _id: '-1' }),
            });
        } catch (error) {
            res.status(500).json({
              status: false,
              message: `${error}`,
            });
        }
    }

   
  },

  async updateUser(req: any, res: Response, next: NextFunction) {
    if (!req.user) {
        return next(   
            res.status(404).json({
                status: false,
                message: "You are not logged in",
            })
        )
    } else {
        try{
            const { userName } = req.body;
            const user = await User.findOneAndUpdate({userId: req.user.userId},{$set: {userName: userName}},{ upsert: true, omitUndefined: true, new: true } );
            if (!user) {
                return next(   
                    res.status(404).json({
                        status: false,
                        message: `user with the ${req.user.userId} does not exist`,
                    })
                )
            }
            const data = { userName };
            return res.status(201).json({
                status: "success",
                data,
              });
        } catch (error) {
            res.status(500).json({
              status: false,
              message: `${error}`,
            });
          }
    }
  }

};
