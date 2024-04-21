import Req from "../../../utils/Req.js";

const logout = (req, res) => {
  const cookies = Req(req);

  Object.keys(cookies).forEach((cookie) => {
    res.clearCookie(cookie);
  });

  res.status(200).json({
    message: "Successfully Logout",
  });
};

export default logout;
