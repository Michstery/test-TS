"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./models/users");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //////////////////////// ~ PROTECT ROUTE ~  /////////////////////////////////////
    // 1) Getting token and check if it's there
    let Mytoken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        Mytoken = req.headers.authorization.split(' ')[1];
    }
    if (!Mytoken) {
        return next(res.status(401).json({
            status: false,
            message: "You are not logged in! login to gain access",
        }));
    }
    //   if (Mytoken.startsWith('Bearer ')) {
    //     Mytoken = Mytoken.slice(7, Mytoken.length);
    //     if (!Mytoken || Mytoken === '') return next();
    //   }
    // 2) Validate token
    const decoded = yield promisify(jwt.verify)(Mytoken, process.env.JWT_SECRET);
    //const decoded = jwt.verify(Mytoken, process.env.JWT_SECRET);
    const freshUser = yield User.findOne({ userId: decoded.userId });
    if (!freshUser) {
        res.status(404).json({
            status: false,
            message: "The User belonging to this Token does not exist",
        });
    }
    // Get Logged In Users Here
    req.user = freshUser;
    console.log("token verification failed");
    next();
});
module.exports = { auth };
