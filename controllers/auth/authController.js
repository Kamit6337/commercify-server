import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import generateWebToken from "../../utils/auth/generateWebToken.js";
import User from "../../models/UserModel.js";
import Req from "../../utils/Req.js";
import axios from "axios";
import path from "path";
import fs from "fs";

// NOTE: LOGIN SUCCESS
export const loginSuccess = catchAsyncError(async (req, res, next) => {
  if (!req.user)
    return next(
      new HandleGlobalError("Error in login. Please try again!", 403)
    );

  const {
    id,
    provider,
    _json: { name, email, picture },
  } = req.user;

  const findUser = await User.findOne({ OAuthId: id });

  // MARK: IF NOT FIND USER
  if (!findUser) {
    // images folder inside public already present
    const publicFolderPath = path.join("public", "images", "userProfile");

    // Make an HTTP request to the image URL
    const response = await axios.get(picture, { responseType: "arraybuffer" });

    // Generate a unique filename for the saved image
    const fileName = `image_${Date.now()}.jpeg`;

    const saveFilePath = `images/userProfile/${fileName}`;
    // Save the image to the public folder
    const filePath = path.join(publicFolderPath, fileName);

    // Use fs.writeFile with a Promise to handle it asynchronously
    await new Promise((resolve, reject) => {
      fs.writeFile(filePath, response.data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // MARK: CREATE USER
    const createUser = await User.create({
      name,
      email,
      photo: saveFilePath,
      OAuthId: id,
      OAuthProvider: provider,
    });

    if (!createUser) {
      return next(new HandleGlobalError("Issue in Signup", 404));
    }

    const token = generateWebToken({
      id: createUser._id,
      role: createUser.role,
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + environment.JWT_EXPIRES_IN),
      httpOnly: true,
      domain : ".commercify-client.onrender.com",
      secure : true
    });

    res.redirect(environment.CLIENT_URL);

    return;
  }

  // MARK: IF FIND USER
  const token = generateWebToken({
    id: findUser._id,
    role: findUser.role,
  });

  res.cookie("token", token, {
    expires: new Date(Date.now() + environment.JWT_EXPIRES_IN),
    httpOnly: true,
    domain : ".commercify-client.onrender.com",
    secure : true
  });

  res.redirect(environment.CLIENT_URL);

  return;
});

// NOTE: LOGOUT
export const logout = (req, res) => {
  const cookies = Req(req);

  Object.keys(cookies).forEach((cookie) => {
    res.clearCookie(cookie);
  });

  res.status(200).json({
    message: "Successfully Logout",
  });
};
