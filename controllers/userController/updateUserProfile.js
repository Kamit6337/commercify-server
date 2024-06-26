import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import generateSixDigitRandomNumber from "../../utils/javaScript/generateSixDigitRandomNumber.js";
import { environment } from "../../utils/environment.js";
import encrypt from "../../utils/encryption/encrypt.js";
import twilio from "twilio";
import User from "../../models/UserModel.js";
import decrypt from "../../utils/encryption/decrypt.js";

const client = twilio(
  environment.TWILIO_ACCOUNT_SID,
  environment.TWILIO_AUTH_TOKEN,
  {
    lazyLoading: true,
  }
);

const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  let { name, email, mobile, token } = req.body;

  if (!mobile && !token) {
    return next(new HandleGlobalError("Fields are not provided", 404));
  }

  if (token) {
    const makeDecrypt = decrypt(token);
    name = makeDecrypt.name;
    email = makeDecrypt.email;
    mobile = makeDecrypt.mobile;
  }

  const findUser = await User.findOne({
    _id: { $ne: userId },
    $or: [{ email }, { mobile }],
  });

  if (findUser) {
    return next(
      new HandleGlobalError(
        "Email and Mobile should be unique. Either of them is already in use."
      )
    );
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

export default updateUserProfile;
