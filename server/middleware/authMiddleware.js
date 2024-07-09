const jwt = require("jsonwebtoken");
const User = require("../models/User");


const authMiddleware = async(req, res, next)=>{

   try {
    // Check for the authorization header or cookies
    const authHeader = req.headers.authorization;
    const tokenFromCookie = req.cookies.token;

    if (!authHeader && !tokenFromCookie) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let token;
    if (authHeader) {
      // Verify the token format
      const parts = authHeader.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
          message: "Authorization header must be in the format: Bearer <token>",
        });
      }
      token = parts[1];
    } else {
      token = tokenFromCookie;
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle session-based or token-based authentication
    if (user.resetPasswordToken) {
      return res.status(401).json({ message: "Token reset, please login again" });
    }

    if (user.isDeleted) {
      return res.status(403).json({ message: "User account is deleted" });
    }

    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error during authentication" });
  }
  }




  // try {
  //   //check for the authorization header
  //   const authHeader = req.headers.authorization;
  //   if (!authHeader) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }

  //   // verify the token format
  //   const parts = authHeader.split(" ");
  //   if (parts.length !== 2 || parts[0] !== "Bearer") {
  //     return res
  //       .status(401)
  //       .json({
  //         message: "Authorization header must be in the format: Bearer <token>",
  //       });
  //   }

  //   const token = parts[1];

  //   // verify the token
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //   if(!decoded.userId){
  //     return res.status(401).json({ message: "Invalid token structure" });
  //   }

  //   const user = await User.findById(decoded.userId);

  //   if(!user){
  //     return res.status(404).json({ message: "User not found" });
  //   }

  //   req.user = {
  //     id1: user._id,
  //     username: user.username,
  //     email: user.email,
  //     role: user.role
  //   }


  //   next();

  // } catch (error) {
  //   if (error.name === "JsonWebTokenError") {
  //     return res.status(401).json({ message: "Invalid token" });
  //   }
  //   if (error.name === "TokenExpiredError") {
  //     return res.status(401).json({ message: "Token has expired" });
  //   }
  //   console.error("Auth middleware error:", error);
  //   res
  //     .status(500)
  //     .json({ message: "Internal server error during authentication" });
  // }
  // }

module.exports = authMiddleware;
