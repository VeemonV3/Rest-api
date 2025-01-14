const { randomBytes } = require("crypto");
const fileType = require("file-type");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const storage = require("../config/awsConfig"); // Pastikan konfigurasi AWS Anda benar

async function uploadFile(payload) {
  try {
    // Memeriksa apakah konten ada
    if (!payload?.content) throw new Error("undefined content payload!");
    if (!Buffer.isBuffer(payload.content)) throw new Error("invalid content!");

    // Mendapatkan tipe file dari buffer
    const ftype = await fileType.fromBuffer(payload.content);
    const string = randomBytes(12).toString("base64").replace(/[-+\\/=]/g, ""); // Menghasilkan nama file acak

    // Menentukan nama file dan payload untuk upload
    const fileName = payload.fileName
      ? (payload.fileName.split(".")[1]
          ? `${string}.${payload.fileName.split(".")[1]}`
          : (ftype?.ext ? `${string}.${ftype.ext}` : `${string}`))
      : (ftype?.ext ? `${string}.${ftype.ext}` : `${string}`);

    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileName,
      Body: payload.content,
      ContentType: ftype ? ftype.mime : 'application/octet-stream',
      ACL: "public-read", // Pastikan ACL diizinkan di DigitalOcean Spaces
    };

    // Meng-upload file ke S3
    const command = new PutObjectCommand(params);
    const data = await storage.send(command);

    return {
      status: true,
      code: 200,
      author: 'Shannz',
      result: {
        name: data.Key,
        url: `https://api.shannmoderz.xyz/server/file/${fileName}`,
        note: 'Gunakan dengan bijak dan semoga bermanfaat',
      },
    };
  } catch (e) {
    console.error(e);
    return { status: false, message: e.message || e };
  }
}

module.exports = { uploadFile };
