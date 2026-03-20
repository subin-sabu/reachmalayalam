import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { file, folder } = req.body;

    const result = await cloudinary.uploader.upload(file, {
      folder: folder || "news"
    });

    return res.status(200).json(result);

  } catch (error) {

    console.error("Cloudinary error:", error);

    return res.status(500).json({
      error: error.message || "Upload failed"
    });

  }

}