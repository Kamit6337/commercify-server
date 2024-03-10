import mongoose from "mongoose";
import validation from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return validation.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
    },
    OAuth: {
      type: Boolean,
      default: false,
    },
    OAuthId: {
      type: String,
    },
    OAuthProvider: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: [
      {
        localAdd: String,
        district: String,
        state: String,
        nation: {
          type: String,
          default: "India",
        },
        PIN: {
          type: String,
          required: true,
        },
        mobile: {
          type: Number,
          required: true,
        },
      },
    ],
    loginCount: {
      type: Number,
      default: 1,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    doubleVerify: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
