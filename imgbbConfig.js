const axios = require("axios");
const FormData = require("form-data");

async function uploadToImgBB(file) {
  if (!process.env.IMGBB_API_KEY) {
    throw new Error("❌ IMGBB_API_KEY is missing from .env");
  }

  // Convert buffer to base64
  const base64Image = file.buffer.toString("base64");

  // Create a new form and append the image data to it
  const form = new FormData();
  form.append("image", base64Image);

  try {
    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      form, // The form data is now the body of the request
      {
        headers: {
          ...form.getHeaders(), // Set the correct multipart/form-data headers
        },
        params: {
          // Pass API key as a query parameter in the URL
          key: process.env.IMGBB_API_KEY,
        },
        timeout: 25000, // Keep the increased timeout (25 seconds)
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    return response.data.data.url;
  } catch (err) {
    console.error(
      "❌ ImgBB Upload Error:",
      err.response?.data?.error?.message || err.message, // Access specific error message from ImgBB response
      "Error Code:",
      err.code // Log the error code like 'ECONNRESET'
    );
    throw err;
  }
}

module.exports = uploadToImgBB;
