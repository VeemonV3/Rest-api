const express = require('express');
const router = express.Router();
const config = require('../config/config');
const msg = config.messages;

const { wikipediaSearch, getZetizenJawaposNews, getVOANews, getViceNews, getTribunNews, getSuaraNews, getRepublikaNews, getOkezoneNews, getKumparanNews, getCNNNews, getCNBCNews, getAntaraNews, getTempoNews } = require('../scrape/berita');
const { requestan, noparams } = require('../utils/function');
const { keyy, forVip, forPrem } = require('../utils/middleware');

router.get('/tribun', keyy, async (req, res) => {
  const zone = req.query.zone;
  const query = req.query.query;
  if (!zone) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: 'Parameter userId Belum Diisi!!'
    });
  }
  if (!query) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: 'Parameter zoneId Belum Diisi!!'
    });
  }
  try {
    const result = await getTribunNews(zone, query);
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
});

router.get('/tempo', keyy, requestan(getTempoNews));
router.get('/antara', keyy, requestan(getAntaraNews));
router.get('/cnbc', keyy, requestan(getCNBCNews));
router.get('/cnn', keyy, requestan(getCNNNews));
router.get('/okezone', keyy, requestan(getOkezoneNews));
router.get('/republika', keyy, requestan(getRepublikaNews));
router.get('/suara', keyy, requestan(getSuaraNews));
router.get('/zetizen', keyy, requestan(getZetizenJawaposNews));
router.get('/kumparan', keyy, noparams(getKumparanNews));
router.get('/vice', keyy, noparams(getViceNews));
router.get('/voa', keyy, noparams(getVOANews));
router.get('/wikipedia', keyy, requestan(wikipediaSearch));

module.exports = router;