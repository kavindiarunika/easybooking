import cloudinary from "../cloudinary/cloudinary.js";

/**
 * Delete a single image from Cloudinary by public_id
 * @param {string} publicId - The Cloudinary public_id of the image to delete
 * @returns {Promise<boolean>} - True if deleted successfully, false if not found or error
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      console.log(`[Cloudinary] Deleted: ${publicId}`);
      return true;
    } else {
      console.warn(`[Cloudinary] Failed to delete: ${publicId}`, result);
      return false;
    }
  } catch (error) {
    console.error(`[Cloudinary] Error deleting ${publicId}:`, error.message);
    return false;
  }
};

/**
 * Delete multiple images from Cloudinary by public_ids array
 * @param {string[]} publicIds - Array of Cloudinary public_ids to delete
 * @returns {Promise<number>} - Number of images successfully deleted
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
  if (!Array.isArray(publicIds) || publicIds.length === 0) return 0;

  let deletedCount = 0;
  for (const publicId of publicIds) {
    const deleted = await deleteFromCloudinary(publicId);
    if (deleted) deletedCount++;
  }

  return deletedCount;
};

/**
 * Upload image to Cloudinary and return both URL and public_id
 * @param {Buffer} fileData - File buffer data
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<{secure_url: string, public_id: string}>} - URL and public_id
 */
export const uploadToCloudinary = async (fileData, folder = "products") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
      },
    );
    stream.end(fileData);
  });
};

/**
 * Upload multiple images to Cloudinary
 * @param {Buffer[]} filesData - Array of file buffer data
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<Array>} - Array of {secure_url, public_id} objects
 */
export const uploadMultipleToCloudinary = async (
  filesData,
  folder = "products",
) => {
  const results = [];
  for (const fileData of filesData) {
    try {
      const result = await uploadToCloudinary(fileData, folder);
      results.push(result);
    } catch (error) {
      console.error(`[Cloudinary] Upload error:`, error.message);
    }
  }
  return results;
};
