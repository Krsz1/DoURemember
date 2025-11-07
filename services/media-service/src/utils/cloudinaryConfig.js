import { v2 as cloudinary } from "cloudinary";

// Cloudinary will read credentials from CLOUDINARY_URL env var if set.
// Example: CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

const configured = (() => {
  try {
    if (process.env.CLOUDINARY_URL) {
      cloudinary.config({ secure: true });
      return true;
    }
    // allow explicit env vars if desired
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
      return true;
    }
    return false;
  } catch (e) {
    console.warn("Cloudinary config failed:", e.message);
    return false;
  }
})();

async function uploadBufferToCloudinary(buffer, originalName, mimetype) {
  if (!configured) throw new Error("Cloudinary not configured");

  // convert buffer to base64 data URI
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimetype};base64,${base64}`;

  // upload and return result
  const res = await cloudinary.uploader.upload(dataUri, {
    resource_type: "image",
    folder: "media",
    use_filename: false,
    unique_filename: true,
    overwrite: false,
  });

  // res.secure_url is preferred
  return {
    publicUrl: res.secure_url,
    providerId: res.public_id,
    raw: res,
  };
}

export { uploadBufferToCloudinary, configured as cloudinaryConfigured };
