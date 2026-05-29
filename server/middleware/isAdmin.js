import jwt from "jsonwebtoken";

export const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Access denied." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access forbidden. Admins only." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
