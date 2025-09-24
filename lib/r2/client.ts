import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";

// Configuration pour R2 Cloudflare
export function getR2Client() {
  if (
    !process.env.CLOUDFLARE_ACCOUNT_ID ||
    !process.env.R2_ACCESS_KEY_ID ||
    !process.env.R2_SECRET_ACCESS_KEY
  ) {
    throw new Error("R2 credentials not configured");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function uploadImageToR2(file: File): Promise<string> {
  const r2Client = getR2Client();
  const bucketName = process.env.R2_BUCKET_NAME || "product-images";

  // Générer un nom de fichier unique
  const fileExtension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    },
  });

  await upload.done();

  // Construire l'URL publique de l'image
  const publicUrl = `https://${bucketName}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${fileName}`;

  return publicUrl;
}

export async function deleteImageFromR2(imageUrl: string): Promise<void> {
  const r2Client = getR2Client();
  const bucketName = process.env.R2_BUCKET_NAME || "product-images";

  // Extraire le nom du fichier de l'URL
  const fileName = imageUrl.split("/").pop();

  if (!fileName) {
    throw new Error("Invalid image URL");
  }

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    }),
  );
}
