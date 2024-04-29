import { generateTokenAndSetCookies } from "../lib/utils/generateToken.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

/**
 * Controller function for user signup.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise that resolves once the signup process is complete.
 */

export const Signup = async (req, res) => {
  const { username, fullname, email, password } = req.body;

  try {
    const emailRegex = /^[$\s@]+@[^\s@]+\.[^\s@]+$/;
    //basic check for email
    if (emailRegex.test(email)) {
      return res.status(400).json({
        message: "Email is not a valid email address",
      });
    }

    //check username exists in database
    const isExistsUsername = await User.findOne({ username: username });
    if (isExistsUsername) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    //check email exists in database
    const isExistsEmail = await User.findOne({ email: email });
    if (isExistsEmail) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Make passwrod hashed
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be getter then or equal to 6 character",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPasswrod = await bcrypt.hash(password, salt);

    //new User({}) or User.create({}) to create a user
    const newUser = await User.create({
      username,
      fullname,
      email,
      password: hashPasswrod,
    });

    if (newUser) {
      //generate JWT token and set it to cookie
      generateTokenAndSetCookies(newUser._id, res);
      //save the user to mongo db
      await newUser.save();
      //response json of the newly created user
      const userObj = {
        _id: newUser._id,
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      };
      //console log could be delete
      console.log("User Created Successfully", userObj);
      return res.status(201).json(userObj);
    } else {
      return res.status(401).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in Signup Controller:", error.message);
    return res.status(500).json({
      message: `Internal Server Error in Signup Controller: ${error.message}`,
    });
  }
  //End of Signup
};

/**
 * Handles user login.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating success or failure of login attempt.
 */
export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username or password is empty
    if (!username || !password) {
      return res.status(400).json({
        message: `Please provide${!username ? " Username" : ""}${
          !username && !password ? " and" : ""
        }${!password ? " Password" : ""}`,
      });
    }

    // Find user by username
    const user = await User.findOne({ username });
    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password,
      ""
    );
    // If user or password is incorrect
    if (!user || !isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid Username or Password",
      });
    } else {
      // Generate Token for login user and set cookie
      generateTokenAndSetCookies(user._id, res);

      // Send response with logged in user data
      res.status(200).json({
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
      });
    }
  } catch (error) {
    console.log("Error in Loging Controller", error.message);
    res.status(500).json({
      message: `Internal Server Error in Login Controller: ${error.message}`,
    });
  }
};

/**
 * Handles user logout.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating success or failure of logout attempt.
 */
export const Logout = (req, res) => {
  try {
    // Clear JWT cookie
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logout Successfully",
    });
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(500).json({
      message: `Internal Server Error in Logout Controller: ${error.message}`,
    });
  }
};

export const GetMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in GetMe Controller", error.message);
    res.status(500).json({
      message: `Internal Server Error in GetMe Controller: ${error.message}`,
    });
  }
};
