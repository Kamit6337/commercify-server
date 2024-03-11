import catchAsyncError from "../../lib/catchAsyncError.js";
import Address from "../../models/AddressModel.js";

const getUserAddress = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const userAddrress = await Address.find({
    user: userId,
  });

  res.status(200).json({
    message: "user all addresses",
    data: userAddrress,
  });
});

export default getUserAddress;
