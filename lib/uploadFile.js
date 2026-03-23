// lib/uploadFile.js

import { uploadToCloudinary } from "./uploadToCloudinary";
import { uploadToFirebase } from "./uploadToFirebase";

const STORAGE_PROVIDER = process.env.NEXT_PUBLIC_STORAGE_PROVIDER; 
// now cloudinary, change to "firebase" if you want later

export const uploadFile = async (file, path) => {

  if (STORAGE_PROVIDER === "cloudinary") {
    return uploadToCloudinary(file, path);
  }

  if (STORAGE_PROVIDER === "firebase") {
    return uploadToFirebase(file, path);
  }

  throw new Error("No storage provider configured");

};