import { Schema, model } from "mongoose";

const addressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: Number,
      validate: {
        validator: function (value) {
          return /^\d{10}$/.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit mobile number!`,
      },
      required: true,
    },
    pinCode: {
      type: Number,
      validate: {
        validator: function (value) {
          return /^\d{6}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid 6-digit pin-code`,
      },
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address = model("Address", addressSchema);

export default Address;
