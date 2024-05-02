import {
  cloudinaryDestroy,
  cloudinaryUpload,
} from "../lib/utils/cloudinary.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcript from "bcrypt";

/**
 * Get User Profile by Username
 *
 * @param {Object} req - the request Object
 * @param {Object} res - the response Object
 * @returns {Object} JSON response with the requested username params
 */
export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile Controller");
    res.status(500).json({
      message: `Internal Server Error in getUserProfile Controller: ${error.message}`,
    });
  }
};

/**
 * Get Suggested random user
 *
 * @param {Object} req - the request Object
 * @param {Object} res - the response Object
 * @returns {Object} JSON response with the suggested user
 */
export const getSuggestedUser = async (req, res) => {};

/**
 * Follow or Unfollow User
 *
 * @param {Object} req - the request Object
 * @param {Object} res - the response Object
 * @returns {Object} JSON response with the Follow or Unfollow user
 */
export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;
  const userToModify = await User.findById(id).select("-password");
  const currentUser = await User.findById(req.user._id).select("-password");

  // console.log(userToModify, currentUser);
  //Check current user is not follow or unfollow him self
  if (id === req.user._id.toString()) {
    return res
      .status(400)
      .json({ message: "You can't follow/Unfollow yourself" });
  }
  if (!userToModify._id || !currentUser._id) {
    return res.status(400).json({ message: "User not found" });
  }
  const isFollowing = currentUser.following.includes(id);
  if (isFollowing) {
    //unfollow
    await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
    await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
    return res.status(200).json({
      message: `You unfollowed ${userToModify.username}`,
    });
  } else {
    //follow
    await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
    await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
    const newNotification = new Notification({
      type: "follow",
      from: currentUser._id,
      to: userToModify._id,
    });

    await newNotification.save();
    //TODO: need to send notification to the user

    return res.status(200).json({
      message: `You are following ${userToModify.username}`,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  const { username, fullname, email, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  let user = await User.findById(req.user._id);

  //Check Both field are filled
  if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
    return res
      .status(400)
      .json({ message: "Current password and new password both are required" });
  }
  //Check new password filled not less then 6

  if (newPassword && newPassword.length < 6) {
    return res.status(400).json({
      message: "Password length must be geter then or equal 6 Cherecter",
    });
  }
  // Check Current Password and new Password is filled and current password is match with encripted password
  if (currentPassword && newPassword) {
    const isMatch = await bcript.compare(currentPassword, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is not matched" });
    }

    const salt = await bcript.genSalt(10);
    user.password = await bcript.hash(newPassword, salt);
  }
  //If profile image exist then delete it first then reupload
  if (profileImg) {
    if (user.profileImg) {
      await cloudinaryDestroy(user.profileImg);
    }
    //overwrite profile image
    profileImg = await cloudinaryUpload(profileImg);
    // console.log("File Uploaded", profileImg);
  }

  if (coverImg) {
    //if cover image is exists then delete it first by image name
    if (user.coverImg) {
      await cloudinaryDestroy(user.coverImg);
    }

    //overwrite profile image
    coverImg = await cloudinaryUpload(coverImg);
  }

  user.username = username || user.username;
  user.fullname = fullname || user.fullname;
  user.email = email || user.email;
  user.profileImg = profileImg || user.profileImg;
  user.coverImg = coverImg || user.coverImg;
  user.bio = bio || user.bio;
  user.link = link || user.link;

  await user.save();

  user.password = null;

  res.status(200).json({
    message: "User successfully updated",
    user,
  });
};
