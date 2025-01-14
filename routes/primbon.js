const express = require('express');
const router = express.Router();
const config = require('../config/config');
const msg = config.messages;

const { getArtiNama, getTafsirMimpi, getKecocokanNama, getTanggalJadian, getRamalanRejeki, scrapeHantuImages } = require('../scrape/primbon');
const { requestan, requestanID, noparams } = require('../utils/function');
const { keyy, forVip, forPrem } = require('../utils/middleware');

router.get('/kecocokan-nama', keyy, async (req, res) => {
  const nama1 = req.query.nama1;
  const nama2 = req.query.nama2;
  if (!nama1) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: 'Parameter nama1 Belum Diisi!!'
    });
  }
  if (!nama2) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: 'Parameter nama2 Belum Diisi!!'
    });
  }
  try {
    const result = await getKecocokanNama(nama1, nama2);
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
});

router.get('/artinama', keyy, requestan(getArtiNama));
router.get('/artimimpi', keyy, requestan(getTafsirMimpi));
router.get('/tanggal-jadian', keyy, requestanID(getTanggalJadian));
router.get('/ramalan-rezeky', keyy, requestanID(getRamalanRejeki));
router.get('/misteri-foto', keyy, noparams(scrapeHantuImages));

module.exports = router;