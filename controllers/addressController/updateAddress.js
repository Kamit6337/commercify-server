import catchAsyncError from "../../lib/catchAsyncError.js";
import Address from "../../models/AddressModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const updateAddress = catchAsyncError(async (req, res, next) => {
  const { id, name, dial_code, mobile, address, country, state, district } =
    req.body;

  if (
    !id ||
    !name ||
    !dial_code ||
    !mobile ||
    !address ||
    !country ||
    !state ||
    !district
  ) {
    return next(new HandleGlobalError("All field must provide", 404));
  }

  const updateAdd = await Address.findOneAndUpdate(
    {
      _id: id,
    },
    {
      name,
      dial_code,
      mobile: Number(mobile),
      address,
      country,
      state,
      district,
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
