"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const asyncHandler = require("express-async-handler");
const userController = require("../controllers/users");
const { auth } = require("../middleware");
router.post("/register", asyncHandler((req, res) => {
    return userController.registerUser(req, res);
}));
router.post("/login", asyncHandler((req, res) => {
    return userController.loginUser(req, res);
}));
router.post("/logout", auth, asyncHandler((req, res) => {
    return userController.logoutUser(req, res);
}));
router.get("/user", auth, asyncHandler((req, res) => {
    return userController.getUser(req, res);
}));
router.put("/user/details", auth, asyncHandler((req, res) => {
    return userController.updateUser(req, res);
}));
module.exports = router;
