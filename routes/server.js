const express = require('express');
const storages = require('node-persist');
const router = express.Router();
const app = express();
const upload = require("../config/multer");
const { uploadFile } = require("../scrape/uploader");
const { GetObjectCommand } = require('@aws-sdk/client-s3'); // Mengimpor GetObjectCommand
const { fromBuffer } = require('file-type'); // Mengimpor file-type
const s3Client = require('../config/awsConfig');

// Route untuk mengakses file
router.get('/file/:key', async (req, res) => {
  try {
    const { key } = req.params;

    // Membuat perintah untuk mendapatkan objek
    const command = new GetObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
    });

    // Mengambil objek dari DigitalOcean Spaces
    const data = await s3Client.send(command);
    
    // Mengambil body dari response
    const bodyContents = await streamToBuffer(data.Body); // Mengonversi stream ke buffer

    // Mendapatkan tipe MIME dari buffer
    const { mime } = await fromBuffer(bodyContents);
    console.log("Get content:", mime, data);

    // Mengatur tipe konten dan mengirimkan file
    res.set('Content-Type', mime);
    res.set('Content-Disposition', `inline; filename="${key}"`); // Menambahkan header untuk menampilkan file di browser
    res.send(bodyContents); // Mengirimkan body file
  } catch (e) {
    console.error("Something went wrong at /file route:", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error!",
    });
  }
});

// Fungsi untuk mengonversi stream ke buffer
const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

router.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ status: false, message: "No file uploaded." });
  }

  const result = await uploadFile({ content: file.buffer, fileName: file.originalname });
  return res.send(result);
});

// Fungsi untuk mengonversi uptime ke format yang diinginkan
function formatUptime(uptimeInSeconds) {
  const seconds = Math.floor(uptimeInSeconds % 60);
  const minutes = Math.floor((uptimeInSeconds / 60) % 60);
  const hours = Math.floor((uptimeInSeconds / (60 * 60)) % 24);
  const days = Math.floor((uptimeInSeconds / (60 * 60 * 24)) % 30);
  const months = Math.floor(uptimeInSeconds / (60 * 60 * 24 * 30));

  return `${months} month${months !== 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
}

router.get('/stats', async (req, res) => {
  const totalRequests = await storages.getItem('totalRequests') || 0;
  const uptimeInSeconds = process.uptime();
  
  const stats = {
    totalRequests: totalRequests,
    uptime: formatUptime(uptimeInSeconds),
    uptimeRaw: uptimeInSeconds,
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
  };
  
  res.json(stats);
});

module.exports = router;
