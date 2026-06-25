// utils/cropImage.ts by claude ai
export async function getCroppedImg(
  imageSrc: string,
  croppedAreaPixels: { x: number; y: number; width: number; height: number },
  mimeType = "image/jpeg",
  fileName = "cropped.jpg",
): Promise<File> {
  const image = await createImageBitmap(
    await fetch(imageSrc).then((r) => r.blob()),
  );

  const canvas = document.createElement("canvas");
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas toBlob gagal"));
      resolve(new File([blob], fileName, { type: mimeType }));
    }, mimeType);
  });
}
