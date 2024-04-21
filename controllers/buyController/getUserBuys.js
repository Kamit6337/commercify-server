import catchAsyncError from "../../lib/catchAsyncError.js";
import Buy from "../../models/BuyModel.js";

const getUserBuys = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const findAllBuys = await Buy.find({
    user: userId,
  })
    .populate("product")
    .populate("address")
    .lean();

  const updateDeleievered = await Promise.all(
    findAllBuys.map(async (buy) => {
      const { _id, delieveredDate, isCancelled, isReturned, isDelievered } =
        buy;

      if (
        !isCancelled &&
        !isReturned &&
        !isDelievered &&
        new Date(delieveredDate).getTime() <= Date.now()
      ) {
        const updateBuy = await Buy.findOneAndUpdate(
          {
            _id: String(_id),
          },
          {
            isDelievered: true,
          },
          {
            new: true,
          }
        );

        return updateBuy;
      }
      return buy;
    })
  );

  updateDeleievered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.status(200).json({
    message: "All buy products of user",
    data: updateDeleievered,
  });
});

export default getUserBuys;
