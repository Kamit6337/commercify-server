import HandleGlobalError from "../utils/HandleGlobalError.js";
import catchAsyncError from "../lib/catchAsyncError.js";
import Req from "../utils/Req.js";
import User from "../models/UserModel.js";

const protectAdminRoutes = catchAsyncError(async (req, res, next) => {
  const { token } = Req(req);

  if (!token) {
    return next(new HandleGlobalError("UnAuthorised Access", 403));
  }

  const decodedId = verifyWebToken(token);

  const findUser = await User.findOne({
    _id: decodedId.id,
  });

  if (!findUser) {
    return next(new HandleGlobalError("UnAuthorised Access", 403));
  }

  if (!(findUser.role === "admin" && decodedId.role === "admin")) {
    return next(new HandleGlobalError("UnAuthorised Access", 403));
  }

  req.userId = String(findUser._id);
  req.user = findUser;

  next();
});

export default protectAdminRoutes;
