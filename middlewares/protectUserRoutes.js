import HandleGlobalError from "../utils/HandleGlobalError.js";
import catchAsyncError from "../lib/catchAsyncError.js";
import verifyWebToken from "../utils/auth/verifyWebToken.js";
import Req from "../utils/Req.js";
import User from "../models/UserModel.js";

const protectUserRoute = catchAsyncError(async (req, res, next) => {
  const { token } = Req(req);

  if (!token) {
    return next(new HandleGlobalError("UnAuthorized Access", 403, "Failed"));
  }

  const decodedId = verifyWebToken(token);

  const findUser = await User.findById(decodedId.id);

  if (!findUser) {
    return next(
      new HandleGlobalError(
        "UnAuthorized Access. You are not our User",
        403,
        "Failed"
      )
    );
  }

  req.userId = String(findUser._id);
  req.user = findUser;

  next();
});

export default protectUserRoute;
