import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const storage = getStorage();

export const uploadToFirebase = async (file, path) => {
  try {
    // Generate a UUIDv4 string
    const uuid = uuidv4();

    // Construct new file name with UUIDv4 and original file name
    const newFileName = `${uuid}_${file.name}`;

    // Create a storage reference with the new file name
    const fileRef = ref(storage, `${path}/${newFileName}`);

    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);

    // Construct full Firestore path
    const fullPath = `${path}/${newFileName}`;

    // Return an object containing URL and full Firestore path
    return { url, fullPath };
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};
