import express from "express";
import upload from "../config/multerConfig.js";
import { uploadImageToImgBB } from "../controllers/uploadController.js";

const uploadRouter = express.Router();

uploadRouter.post("/image", upload.single("image"), uploadImageToImgBB);

export default uploadRouter;
