import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import { environment } from "../../../utils/environment.js";
import twilio from "twilio";
import generateSixDigitRandomNumber from "../../../utils/javaScript/generateSixDigitRandomNumber.js";
import encrypt from "../../../utils/encryption/encrypt.js";
import decrypt from "../../../utils/encryption/decrypt.js";

const client = twilio(
  environment.TWILIO_ACCOUNT_SID,
  environment.TWILIO_AUTH_TOKEN,
  {
    lazyLoading: true,
  }
);

const signupSendOTP = catchAsyncError(async (req, res, next) => {
  let { name, email, mobile, token } = req.body;

  if (!mobile && !token) {
    return next(new HandleGlobalError("All fields is not provided", 404));
  }

  if (token) {
    const makeDecrypt = decrypt(token);
    name = makeDecrypt.name;
    email = makeDecrypt.email;
    mobile = makeDecrypt.mobile;
  }

  const randomNumber = generateSixDigitRandomNumber();

  await client.messages.create({
    to: mobile,
    from: environment.TWILIO_MOBILE_NUMBER,
    body: `Your Commercify verification code is: ${randomNumber}. This code will expire in 10 minutes.`,
  });

  const obj = {
    name,
    email,
    mobile,
    otp: randomNumber,
    expire: Date.now() + 10 * 60 * 1000, // 10 minutes to expire
  };

  const makeEncrypt = encrypt(obj);

  res.status(200).json({
    message: "OTP Send sucessfully",
    data: makeEncrypt,
  });
});

export default signupSendOTP;
