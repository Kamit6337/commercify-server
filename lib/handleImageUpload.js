import AWS from "aws-sdk";
import axios from "axios";
import { environment } from "../utils/environment.js";

const s3 = new AWS.S3({
  accessKeyId: environment.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: environment.AWS_S3_ACCESS_KEY_SECRET,
  region: environment.AWS_S3_REGION,
});

// Function to fetch image
async function fetchImage(url) {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    return response.data; // This is a readable stream of the image data
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}

// Function to upload image to S3
async function uploadToS3(imageData, imageName) {
  const params = {
    Bucket: "commercify-vercel",
    Key: `products/${imageName}`,
    Body: imageData,
    ACL: "public-read", // Make the uploaded object public
  };

  try {
    const data = await s3.upload(params).promise();
    console.log("Image uploaded to S3:", data.Location);
    return data.Location; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }
}

const handleImageUpload = async (imageUrl, imageName) => {
  try {
    const imageData = await fetchImage(imageUrl);
    const imageUrlS3 = await uploadToS3(imageData, imageName);
    return imageUrlS3;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

export default handleImageUpload;
