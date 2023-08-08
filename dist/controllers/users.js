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
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/users");
module.exports = {
    registerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password, userName } = req.body;
                email = email.toLowerCase();
                const hashedPassword = yield bcrypt.hash(password, 12);
                const dataToSave = {
                    email,
                    password: hashedPassword,
                    userName,
                    role: req.body.role,
                    userId: uuidv4(),
                };
                const savedData = yield User.create(dataToSave);
                res.status(200).json({
                    data: savedData,
                    status: "true",
                    message: "success",
                });
            }
            catch (error) {
                res.status(500).json({
                    status: false,
                    message: `${error}`,
                });
            }
        });
    },
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = req.body;
                email = email.toLowerCase();
                if (!password || !email) {
                    res.status(400).json({
                        status: false,
                        message: 'please provide both password and email fields',
                    });
                }
                const user = yield User.findOne({
                    email,
                });
                if (!user) {
                    res.status(404).json({
                        status: false,
                        message: 'Email does not Exist',
                    });
                }
                let AwaitedUser = yield user.comparePassword(password);
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
            }
            catch (error) {
                res.status(500).json({
                    status: false,
                    message: `${error}`,
                });
            }
        });
    },
};
