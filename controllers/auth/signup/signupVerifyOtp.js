import catchAsyncError from "../../../lib/catchAsyncError.js";
import User from "../../../models/UserModel.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import generateWebToken from "../../../utils/auth/generateWebToken.js";
import decrypt from "../../../utils/encryption/decrypt.js";

const PRODUCTION = "production";

const signupVerifyOtp = catchAsyncError(async (req, res, next) => {
  const { mobileNumber, otp, token: otpToken } = req.body;

  if (!mobileNumber || !otpToken || !otp) {
    return next(new HandleGlobalError("All field are not provided", 404));
  }

  const { mobile, otp: actualOTP, expire, name, email } = decrypt(otpToken);

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

  const profilePicUrl = `https://ui-avatars.com/api/?background=random&name=${name}&size=128&bold=true`;

  const createUser = await User.create({
    name,
    email,
    mobile,
    photo: profilePicUrl,
  });

  const token = generateWebToken({
    id: createUser._id,
    role: createUser.role,
  });

  const cookieOptions = {
    maxAge: environment.JWT_EXPIRES_IN,
    httpOnly: true,
  };

  if (environment.NODE_ENV === PRODUCTION) {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "None";
  }

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    message: "OTP Verify sucessfully",
  });
});

export default signupVerifyOtp;
