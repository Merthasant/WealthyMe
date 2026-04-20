import "dotenv/config";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { de } from "zod/locales";
import { NotFoundError } from "./error.utils";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const cloudinaryUtils = {
  // upload to cloudinary
  uploadToCloudinary(
    buffer: Buffer,
    folder: string = "uploads",
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            {
              quality: "auto:good",
              fetch_format: "auto",
              width: 1280,
              crop: "limit",
            },
          ],
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      );
      stream.end(buffer);
    });
  },
  // delete from cloudinary
  async deleteFromCloudinary(publicId: string): Promise<UploadApiResponse> {
    return await cloudinary.uploader.destroy(publicId);
  },
};

export { cloudinary };
export default cloudinaryUtils;
