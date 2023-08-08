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
      const { email, password, userName } = req.body as Body;
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
};
