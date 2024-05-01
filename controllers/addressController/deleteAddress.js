import catchAsyncError from "../../lib/catchAsyncError.js";
import Address from "../../models/AddressModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const deleteAddress = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  await Address.deleteOne({
    _id: id,
  });

  res.status(200).json({
    message: "Address is deleted",
  });
});

export default deleteAddress;
