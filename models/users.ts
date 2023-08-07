import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import mongoosePaginate from "mongoose-paginate";

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

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("users", schema);
