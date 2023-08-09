import express, { NextFunction, Request, Response } from "express";
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./models/users");

const protect = async (req: any, res: Response, next: NextFunction) => {
  //////////////////////// ~ PROTECT ROUTE ~  /////////////////////////////////////
  // 1) Getting token and check if it's there
    let Mytoken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        Mytoken = req.headers.authorization.split(' ')[1];
    }
  if (!Mytoken) {
    return next(   
            res.status(401).json({
            status: false,
            message: "You are not logged in! login to gain access",
            })
        )
  }
//   if (Mytoken.startsWith('Bearer ')) {
//     Mytoken = Mytoken.slice(7, Mytoken.length);
//     if (!Mytoken || Mytoken === '') return next();
//   }
  // 2) Validate token
  const decoded = await promisify(jwt.verify)(Mytoken, process.env.JWT_SECRET);
  //const decoded = jwt.verify(Mytoken, process.env.JWT_SECRET);
  const freshUser = await User.findOne({userId:decoded.userId});
  if (!freshUser) {
    res.status(404).json({
      status: false,
      message: "The User belonging to this Token does not exist",
    });
  }
  // Get Logged In Users Here
  req.user = freshUser;
  console.log("token verification failed")
  next();
};

module.exports = { protect }
