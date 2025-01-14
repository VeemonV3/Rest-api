const multer = require("multer");

const storage = multer.memoryStorage(); // Simpan file di memori
const upload = multer({ storage });

module.exports = upload;
