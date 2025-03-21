// const bcrypt = require("bcrypt");
// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// //signup handler
// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//     console.log("Incoming Request Body:", req.body); // 🛠 Debugging line

//     //check user already exist

//     const existinguser = await User.findOne({ email });
//     if (existinguser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     //hash the password securely
//     let hashedPassword;
//     try {
//       hashedPassword = await bcrypt.hash(password, 10);
//     } catch (err) {
//       return res.status(500).json({
//         success: false,
//         message: "Something went wrong in password",
//       });
//     }

//     //create new user
//     const newuser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     });
//     await newuser.save();

//     return res.status(200).json({
//       success: true,
//       message: "User created successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//       success: false,
//       message: "Something went wrong in signup",
//     });
//   }
// };

// //login
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "please fill all credentials",
//       });
//     }

//     // checking user is available or not
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "user is not registered",
//       });
//     }
//     //payload
//     const payload = {
//       email: user.email,
//       id: user._id,
//       role: user.role,
//     };
//     //verify the password and generate token
//     if (await bcrypt.compare(password, user.password)) {
//       let token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: "2h",
//       });

//       user.token = token;
//       user.password = undefined;

//       const options = {
//         httpOnly: true,
//         expires: new Date(Date.now() + 3600000),
//       };

//       res.cookie("token", token, options).status(200).json({
//         success: true,
//         user,
//         message: "User logged in successfully",
//         token: token,
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "password incorrect",
//       });
//     }

//     //
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//       success: false,
//       message: "Something went wrong in login",
//     });
//   }
// };

const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// Sign up route handler
exports.signup = async (req, res) => {
  try {
    // get data
    const { name, email, password, role } = req.body;

    // check if user already exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // Secured password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }

    // Create Entry for User
    let user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "User cannot be register,Please try again later",
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully",
      });
    }

    // check for register user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Verify password & generate a JWT token

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    if (await bcrypt.compare(password, user.password)) {
      // password match
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user = user.toObject();
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User logged in successfully",
      });
    } else {
      // password not match
      return res.status(403).json({
        success: false,
        message: "Password does not match",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Login false",
    });
  }
};
