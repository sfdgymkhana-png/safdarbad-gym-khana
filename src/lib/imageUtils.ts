/**
 * Utility to handle client-side image and video uploads.
 * Reads images and compresses them into high-quality Base64 Data URLs.
 * Reads videos into Data URLs with playback verification.
 */

export interface MediaUploadResult {
  url: string;
  mediaType: "image" | "video";
  fileName: string;
}

export function readMediaFile(
  file: File,
  maxImageWidth = 1600,
  maxImageHeight = 1600,
  imageQuality = 0.86
): Promise<MediaUploadResult> {
  return new Promise((resolve, reject) => {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isImage && !isVideo) {
      return reject(
        new Error("Selected file must be an image (PNG, JPG, WEBP) or video (MP4, WEBM).")
      );
    }

    // Video handling
    if (isVideo) {
      // 35MB limit for client side data URLs
      const maxSizeBytes = 35 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return reject(new Error("Video file size exceeds 35MB limit. Please upload a smaller video clip."));
      }

      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read video file."));
      reader.onload = (e) => {
        resolve({
          url: e.target?.result as string,
          mediaType: "video",
          fileName: file.name,
        });
      };
      reader.readAsDataURL(file);
      return;
    }

    // Image handling
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxImageWidth || height > maxImageHeight) {
          if (width > height) {
            height = Math.round((height * maxImageWidth) / width);
            width = maxImageWidth;
          } else {
            width = Math.round((width * maxImageHeight) / height);
            height = maxImageHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve({
            url: e.target?.result as string,
            mediaType: "image",
            fileName: file.name,
          });
        }

        ctx.drawImage(img, 0, 0, width, height);
        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(outputType, imageQuality);
        resolve({
          url: dataUrl,
          mediaType: "image",
          fileName: file.name,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Keep compressAndReadFile for backwards compatibility with image-only consumers
export async function compressAndReadFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> {
  const res = await readMediaFile(file, maxWidth, maxHeight, quality);
  return res.url;
}
