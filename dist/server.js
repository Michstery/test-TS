"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
dotenv_1.default.config();
// --------- Mongoose Setup --------- //
const defaultConfig = process.env.MONGO_URI;
const port = process.env.PORT;
mongoose_1.default.connect(defaultConfig, {}).catch((err) => console.log(err));
mongoose_1.default.Promise = global.Promise;
const db = mongoose_1.default.connection;
db.on("connected", () => {
    app.listen(port, () => {
        console.log(`app is running at port ${port}......`);
    });
    console.log("Database connection established");
});
db.on("error", (error) => {
    console.log("An error has occurred preventing the database connection from being established", JSON.stringify(error));
    console.log(error.message);
});
// ///------------------------------------------------------------------------------------------/// //
