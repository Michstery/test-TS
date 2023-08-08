"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const schema = new mongoose_1.Schema({
    email: {
        type: String,
        index: true,
        required: [true, "Please Enter your Email"],
        unique: true,
        lowercase: true,
        //from the validator module: checks if its a valid email
        validate: [validator_1.default.isEmail, "Please provide a valid email"],
    },
    password: { type: String, required: [true, "Please Enter your Email"] },
    userName: {
        type: String,
        index: true,
    },
    userId: { type: String, index: true },
    role: {
        type: String,
        index: true,
        default: "user",
    },
}, {
    toJSON: {
        transform(ret) {
            delete ret.__v;
            delete ret._id;
        },
    },
    timestamps: true,
});
schema.methods.createJWT = function () {
    return jwt.sign({
        userId: this.userId,
        userName: this.userName,
        email: this.email,
    }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
schema.methods.comparePassword = function (canditatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcrypt.compare(canditatePassword, this.password);
        return isMatch;
    });
};
schema.plugin(mongoose_paginate_1.default);
module.exports = mongoose_1.default.model("users", schema);
