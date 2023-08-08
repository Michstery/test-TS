import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import mongoosePaginate from "mongoose-paginate";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema: Schema = new Schema(
  {
    email: {
      type: String,
      index: true,
      required: [true, "Please Enter your Email"],
      unique: true,
      lowercase: true,
      //from the validator module: checks if its a valid email
      validate: [validator.isEmail, "Please provide a valid email"],
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
  },
  {
    toJSON: {
      transform(ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

schema.methods.createJWT = function () {
	return jwt.sign(
		{
			userId: this.userId,
			userName: this.userName,
			email: this.email,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "30d",
		}
	);
};

schema.methods.comparePassword = async function (canditatePassword:string) {
	const isMatch = await bcrypt.compare(canditatePassword, this.password);
	return isMatch;
};

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("users", schema);
