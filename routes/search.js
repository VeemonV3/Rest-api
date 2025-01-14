const express = require('express');
const router = express.Router();
const config = require('../config/config');
const msg = config.messages;

const { pinterest, tiktoks } = require('../scrape/downloader');
const { sklh, searchSpotify, chord, getLibraryInfo, samehadakuSearch, detailAnime, samehadakuDL, Filmapik, scrapeDramaqu, PlayStore, searchChina, gsmSearch, apkcombo, aptoide, BukaLapak, happymod, stickersearch, webtoons, resep, gore, mangatoon, android1, wattpad, mlbb, wallpaper } = require('../scrape/search');
const { scrapeAmazonProducts } = require('../scrape/playwright');
const { requestan, requestanPage } = require('../utils/function');
const { keyy, forVip, forPrem } = require('../utils/middleware');

router.get('/mlbb', keyy, async (req, res) => {
  const userId = req.query.userId;
  const zoneId = req.query.zoneId;
  if (!userId) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: 'Parameter userId Belum Diisi!!'
    });
  }
  if (!zoneId) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: 'Parameter zoneId Belum Diisi!!'
    });
  }
  try {
    const result = await mlbb(userId, zoneId);
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
});

router.get('/sekolah-indonesia', keyy, requestan(sklh));
router.get('/playstore', keyy, requestan(PlayStore));
router.get('/bukalapak', keyy, requestan(BukaLapak));
router.get('/happymod', keyy, requestan(happymod));
router.get('/sticker', keyy, requestan(stickersearch));
router.get('/webtoons', keyy, requestan(webtoons));
router.get('/resep', keyy, requestan(resep));
router.get('/seegore', keyy, requestan(gore));
router.get('/mangatoon', keyy, requestan(mangatoon));
router.get('/wattpad', keyy, requestan(wattpad));
router.get('/android1', keyy, requestan(android1));
router.get('/apkcombo', keyy, requestan(apkcombo.search));
router.get('/aptoide', keyy, requestan(aptoide.search));
router.get('/tiktok', keyy, requestan(tiktoks));
router.get('/pinterest', keyy, requestan(pinterest));
router.get('/gsm', keyy, requestan(gsmSearch));
router.get('/china', keyy, requestan(searchChina));
router.get('/film', keyy, requestanPage(Filmapik));
router.get('/drakor', keyy, requestanPage(scrapeDramaqu));
router.get('/wallpaperhd', keyy, requestan(wallpaper, '3'));
router.get('/cdnjs', keyy, requestan(getLibraryInfo));
router.get('/amazon', keyy, requestan(scrapeAmazonProducts));
router.get('/chord', keyy, requestan(chord));
router.get('/spotify', keyy, requestan(searchSpotify));

module.exports = router;
