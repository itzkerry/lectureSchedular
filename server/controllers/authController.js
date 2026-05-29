import jwt from "jsonwebtoken";
import User from "../models/user.js";

const signin = async (req, res) => {
  const { userName, password, role } = req.body;

  try {
    const user = await User.findOne({ userName, role });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    const cookieOption = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    res
      .status(200)
      .cookie("token", token, cookieOption)
      .json({
        message: "logged in successfully",
        user: { name: user.name, role: user.role },
      });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ loggedIn: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      loggedIn: true,
      user: { id: decoded.id, role: decoded.role },
    });
  } catch (err) {
    return res.status(401).json({ loggedIn: false });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Controller Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { signin, getMe, logout };
