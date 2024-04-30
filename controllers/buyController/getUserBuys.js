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

  const updateDelivered = await Promise.all(
    findAllBuys.map(async (buy) => {
      const { _id, deliveredDate, isCancelled, isReturned, isDelivered } = buy;

      if (
        !isCancelled &&
        !isReturned &&
        !isDelivered &&
        new Date(deliveredDate).getTime() <= Date.now()
      ) {
        console.log("entered here");
        const updateBuy = await Buy.findOneAndUpdate(
          {
            _id: String(_id),
          },
          {
            isDelivered: true,
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

  updateDelivered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.status(200).json({
    message: "All buy products of user",
    data: updateDelivered,
  });
});

export default getUserBuys;
