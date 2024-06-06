import Req from "../../../utils/Req.js";
import { environment } from "../../../utils/environment.js";
const PRODUCTION = "production";

const logout = (req, res) => {
  const cookies = Req(req);

  const cookieOptions = {
    httpOnly: true,
    secure: environment.NODE_ENV === PRODUCTION,
    sameSite: environment.NODE_ENV === PRODUCTION ? "None" : "Lax",
  };

  res.clearCookie("token", cookieOptions);

  res.status(200).json({
    message: "Successfully Logout",
  });
};

export default logout;
