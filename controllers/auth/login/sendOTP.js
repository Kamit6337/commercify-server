import twilio from "twilio";
import { environment } from "../../../utils/environment.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import generateSixDigitRandomNumber from "../../../utils/javaScript/generateSixDigitRandomNumber.js";
import encrypt from "../../../utils/encryption/encrypt.js";
import decrypt from "../../../utils/encryption/decrypt.js";
import User from "../../../models/UserModel.js";

const client = twilio(
  environment.TWILIO_ACCOUNT_SID,
  environment.TWILIO_AUTH_TOKEN,
  {
    lazyLoading: true,
  }
);

const sendOTP = catchAsyncError(async (req, res, next) => {
  let { mobileNumber, token } = req.body;

  if (!mobileNumber && !token) {
    return next(new HandleGlobalError("All fields is not provided", 404));
  }

  if (token) {
    const makeDecrypt = decrypt(token);
    mobileNumber = makeDecrypt.mobile;
  }

  // NOTE: CHECK IS THIS OUR ALREADY USER OR NOT

  const findUser = await User.findOne({
    mobile: mobileNumber,
  });

  if (!findUser) {
    return next(
      new HandleGlobalError("You are not signed up. Please sign up first.", 404)
    );
  }

  const randomNumber = generateSixDigitRandomNumber();

  await client.messages.create({
    to: mobileNumber,
    from: environment.TWILIO_MOBILE_NUMBER,
    body: `Your Commercify verification code is: ${randomNumber}. This code will expire in 10 minutes.`,
  });

  const obj = {
    id: String(findUser._id),
    mobile: mobileNumber,
    otp: randomNumber,
    expire: Date.now() + 10 * 60 * 1000, // 10 minutes to expire
  };

  const makeEncrypt = encrypt(obj);

  res.status(200).json({
    message: "OTP Send sucessfully",
    data: makeEncrypt,
  });
});

export default sendOTP;
