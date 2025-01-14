const { S3Client } = require("@aws-sdk/client-s3");
require('dotenv').config();

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION, // Pastikan Anda menambahkan region jika diperlukan
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

module.exports = s3Client;
