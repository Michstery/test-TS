"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const asyncHandler = require("express-async-handler");
const userController = require("../controllers/users");
router.post("/register", asyncHandler((req, res) => {
    return userController.registerUser(req, res);
}));
module.exports = router;
