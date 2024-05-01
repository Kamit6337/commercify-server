import catchAsyncError from "../../lib/catchAsyncError.js";
import Address from "../../models/AddressModel.js";

const getUserAddress = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const userAddress = await Address.find({
    user: userId,
  }).lean();

  res.status(200).json({
    message: "user all addresses",
    data: userAddress,
  });
});

export default getUserAddress;
