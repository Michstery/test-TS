import express, { NextFunction, Request, Response } from "express";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/users");

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
      let { email, password, userName } = req.body as Body;
      email = email.toLowerCase();
      const hashedPassword = await bcrypt.hash(password, 12);
      const dataToSave: Data = {
        email,
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
        let { email, password } = req.body as Body;   
        email = email.toLowerCase();
        if (!password || !email) {
            res.status(400).json({
                status: false,
                message: 'please provide both password and email fields',
              });
        }
        const user = await User.findOne({
			email,
		});
        if (!user) {
            res.status(404).json({
                status: false,
                message: 'Email does not Exist',
            });
		}
        let AwaitedUser = await user.comparePassword(password);
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

};
