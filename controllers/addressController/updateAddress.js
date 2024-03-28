import catchAsyncError from "../../lib/catchAsyncError.js";
import Address from "../../models/AddressModel.js";

const updateAddress = catchAsyncError(async (req, res, next) => {
  const { id, name, mobile, address, district, state, pinCode } = req.body;

  if (!id || !name || !mobile || !address || !district || !state || !pinCode) {
    return next(new HandleGlobalError("All field must provide", 404));
  }

  const updateAdd = await Address.findOneAndUpdate(
    {
      _id: id,
    },
    {
      name,
      mobile: Number(mobile),
      address,
      state,
      district,
      pinCode: Number(pinCode),
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "Address Updated",
    data: updateAdd,
  });
});

export default updateAddress;
