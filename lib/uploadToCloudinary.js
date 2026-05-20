// lib/uploadToCloudinary.js

/* NEW WORKFLOW */

export const uploadToCloudinary = async (file, folder = "news") => {

  // 1. Get signature from server
  const signRes = await fetch("/api/cloudinary-sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ folder })
  });

  const signData = await signRes.json();

  if (!signRes.ok) {
    throw new Error(signData.error || "Failed to get upload signature");
  }

  const {
    timestamp,
    signature,
    apiKey,
    cloudName
  } = signData;

  // 2. Upload directly to Cloudinary
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await uploadRes.json();

  if (!uploadRes.ok) {
    console.error("Cloudinary upload error:", data);

    throw new Error(data.error?.message || "Upload failed");
  }

  return {
    url: data.secure_url,
    fullPath: data.public_id
  };

};

/*
// OLD WORKFLOW 

export const uploadToCloudinary = async (file, folder) => {

  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const res = await fetch("/api/cloudinary-upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: base64,
      folder
    })
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Upload error:", data);
    throw new Error(data.error || "Cloudinary upload failed");
  }

  return {
    url: data.secure_url,
    fullPath: data.public_id
  };

};


*/


