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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/users");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
module.exports = {
    registerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, userName } = req.body;
                const hashedPassword = yield bcrypt.hash(password, 12);
                const dataToSave = {
                    email: email.toLowerCase(),
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
                const { email, password } = req.body;
                if (!password || !email) {
                    res.status(400).json({
                        status: false,
                        message: "please provide both password and email fields",
                    });
                }
                const user = yield User.findOne({
                    email: email.toLowerCase(),
                });
                if (!user) {
                    res.status(404).json({
                        status: false,
                        message: "Email does not exist",
                    });
                }
                const AwaitedUser = yield user.comparePassword(password);
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
    logoutUser(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            const user = yield User.findOne({ email: req.user.email });
            req.user = user;
            req.token = token;
            if (!req.user || !token) {
                return next(res.status(404).json({
                    status: false,
                    message: "You are not logged in",
                }));
            }
            delete req.token;
            delete req.user;
            return res.status(201).json({
                status: "success",
                message: "You have logged out successfully",
            });
        });
    },
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != 'admin') {
                return res.status(400).json({
                    status: "false",
                    message: "Only Admins are Authorized to Get Users",
                });
            }
            else {
                try {
                    const _a = req.query, { dateFrom, dateTo } = _a, rest = __rest(_a, ["dateFrom", "dateTo"]);
                    const query = Object.assign({}, rest);
                    if (req.query.userId) {
                        const user = yield User.findOne({
                            userId: req.query.userId
                        });
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
                        responseBody: yield User.find(query).sort({ _id: '-1' }),
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        message: `${error}`,
                    });
                }
            }
        });
    },
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                return next(res.status(404).json({
                    status: false,
                    message: "You are not logged in",
                }));
            }
            else {
                try {
                    const { userName } = req.body;
                    const user = yield User.findOneAndUpdate({ userId: req.user.userId }, { $set: { userName: userName } }, { upsert: true, omitUndefined: true, new: true });
                    if (!user) {
                        return next(res.status(404).json({
                            status: false,
                            message: `user with the ${req.user.userId} does not exist`,
                        }));
                    }
                    const data = { userName };
                    return res.status(201).json({
                        status: "success",
                        data,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        message: `${error}`,
                    });
                }
            }
        });
    }
};
