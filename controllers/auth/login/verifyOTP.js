import catchAsyncError from "../../../lib/catchAsyncError.js";
import User from "../../../models/UserModel.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import generateWebToken from "../../../utils/auth/generateWebToken.js";
import decrypt from "../../../utils/encryption/decrypt.js";
import { environment } from "../../../utils/environment.js";

const PRODUCTION = "production";

const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { mobileNumber, otp, token: otpToken } = req.body;

  if (!mobileNumber || !otpToken || !otp) {
    return next(new HandleGlobalError("All field are not provided", 404));
  }

  const { id, mobile, otp: actualOTP, expire } = decrypt(otpToken);

  const findUser = await User.findOne({
    _id: id,
  });

  // NOTE: CHECK EXPIRE
  const currentTime = Date.now();
  if (currentTime > expire) {
    return next(
      new HandleGlobalError(
        "Time has passed to verify. Click on Resend OTP to verify again..."
      )
    );
  }

  // NOTE: VERIFY MOBILE NUMBER
  if (mobile !== mobileNumber) {
    return next(
      new HandleGlobalError("Issue in verify Mobile Number. Please try later")
    );
  }

  // NOTE: VERIFY OTP NUMBER
  if (actualOTP !== Number(otp)) {
    return next(
      new HandleGlobalError(
        "Your OTP is incorrect. Please provide a valid OTP."
      )
    );
  }

  const token = generateWebToken({
    id: findUser._id,
    role: findUser.role,
  });

  const cookieOptions = {
    maxAge: environment.JWT_EXPIRES_IN,
    httpOnly: true,
    secure: environment.NODE_ENV === PRODUCTION,
    sameSite: environment.NODE_ENV === PRODUCTION ? "None" : "Lax",
  };

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    message: "OTP Verify sucessfully",
  });
});

export default verifyOTP;
