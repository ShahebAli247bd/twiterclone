import { v2 as cloudinary } from "cloudinary";

export const cloudinaryUpload = async (image) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  // const imagePath = `https://res.cloudinary.com/demo/image/upload/twitter/${image}`;

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(image, options);
    // console.log(result);
    return result.secure_url;
  } catch (error) {
    return error.message;
  }
};

/**
 * cloudinaryDestroy
 */

export const cloudinaryDestroy = async (imageLink) => {
  try {
    const imgName = imageLink.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(imgName);
  } catch (error) {
    return error.message;
  }
};
