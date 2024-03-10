import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import Category from "../../models/CategoryModel.js";
import Product from "../../models/ProductModel.js";

const getProducts = catchAsyncError(async (req, res, next) => {
  const { id, categoryId } = req.query;

  // NOTE: IF ID IS AN ARRAY OF IDs THEN DATA OF ALL THAT ID
  if (id && Array.isArray(id)) {
    const products = await Product.find({
      _id: { $in: id },
    })
      .populate({
        path: "category",
        model: "Category",
      })
      .lean();

    if (!products || products.length === 0) {
      return next(new HandleGlobalError("No product available", 403));
    }

    res.status(200).json({
      message: "Products from array of IDs",
      data: products,
    });

    return;
  }

  // NOTE: IF ID IS PROVIDED THEN SEND PRODUCT OF THAT ID
  if (id) {
    // WORK: FIND PRODUCT WITH THAT ID
    const product = await Product.findOne({
      _id: id,
    })
      .populate({
        path: "category",
        model: "Category",
      })
      .lean();

    if (!product) {
      return next(new HandleGlobalError("No product available", 403));
    }

    res.status(200).json({
      message: "Product related to ID",
      data: product,
    });

    return;
  }

  // NOTE: IF CATEGORY NAME IS PROVIDED THEN SEND PRODUCT OF THAT CATEGORY
  if (categoryId) {
    try {
      const products = await Product.find({
        category: categoryId,
      })
        .populate({
          path: "category",
          model: "Category",
        })
        .lean();

      if (!products) {
        return next(
          new HandleGlobalError("error in getting products by category", 404)
        );
      }

      res.status(200).json({
        message: "All products related to category",
        length: products.length,
        data: products,
      });

      return;
    } catch (error) {
      console.log(error);
    }
  }

  // NOTE: IF CATEGORY NAME OR ID IS NOT PROVIDED THEN SEND ALL PRODUCTS
  const products = await Product.find()
    .populate({
      path: "category",
      model: "Category",
    })
    .lean();

  if (!products) {
    return next(new HandleGlobalError("Error in getting products", 404));
  }

  res.status(200).json({
    message: "All products",
    length: products.length,
    data: products,
  });
  return;
});

export default getProducts;
