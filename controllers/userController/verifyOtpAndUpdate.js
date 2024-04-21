import catchAsyncError from "../../lib/catchAsyncError.js";
import User from "../../models/UserModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import decrypt from "../../utils/encryption/decrypt.js";

const verifyOtpAndUpdate = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

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

  // NOTE: FIND ONE AND UPDATE
  await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      name,
      email,
      mobile,
    }
  );

  res.status(200).json({
    message: "User is updated",
  });
});

export default verifyOtpAndUpdate;
