import { getR2Bucket } from "@/lib/db/cloudflare-client";

export async function uploadImageToR2(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const key = `images/${Date.now()}-${file.name}`;

  const r2 = getR2Bucket();

  await r2.put(key, buffer, {
    httpMetadata: {
      contentType: file.type,
    },
  });

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

export async function deleteImageFromR2(imageUrl: string): Promise<void> {
  const key = imageUrl.replace(`${process.env.R2_PUBLIC_URL}/`, "");

  const r2 = getR2Bucket();
  await r2.delete(key);
}
