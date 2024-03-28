import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import User from "../../models/UserModel.js";
import bcrypt from "bcryptjs";
import { environment } from "../../utils/environment.js";

const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { name, password } = req.body;

  if (!name) {
    return next(new HandleGlobalError("Fields are not provided", 404));
  }

  const obj = {
    name,
  };

  if (password) {
    const hashPassword = bcrypt.hashSync(password, environment.SALT_ROUND);
    obj.password = hashPassword;
  }

  await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      ...obj,
    }
  );

  res.status(200).json({
    message: "User Profile updated",
  });
});

export default updateUserProfile;
