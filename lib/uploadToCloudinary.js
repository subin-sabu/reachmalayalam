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