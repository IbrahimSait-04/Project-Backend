import axios from "axios";
import FormData from "form-data";
import fs from "fs/promises";          
import dotenv from "dotenv";

dotenv.config();

export const uploadImageToImgBB = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ success: false, message: "IMGBB_API_KEY not set" });
    }

    const filePath = req.file.path;

    const fileBuffer = await fs.readFile(filePath);
    const base64Image = fileBuffer.toString("base64");

    const form = new FormData();
    form.append("image", base64Image);

    const imgbbRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      form,
      { headers: form.getHeaders() }
    );

    if (!imgbbRes.data.success) {
      return res.status(500).json({
        success: false,
        message: "ImgBB upload failed",
        imgbbResponse: imgbbRes.data,
      });
    }

    const imageUrl = imgbbRes.data.data.url;
    const displayUrl = imgbbRes.data.data.display_url;
    const deleteUrl = imgbbRes.data.data.delete_url;


    return res.json({
      success: true,
      imageUrl,
      displayUrl,
      deleteUrl,
    });
  } catch (err) {
    console.error("ImgBB upload error:", err?.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading image",
      error: err?.response?.data || err.message,
    });
  }
};
