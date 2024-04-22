import catchAsyncError from "../../lib/catchAsyncError.js";
import Address from "../../models/AddressModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const createNewAddress = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { name, dial_code, mobile, address, country, state, district } =
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

  const addNewAddress = await Address.create({
    user: userId,
    name,
    dial_code,
    mobile: Number(mobile),
    address,
    country,
    state,
    district,
  });

  res.status(200).json({
    message: "Successfully create new address",
    data: addNewAddress,
  });
});

export default createNewAddress;
