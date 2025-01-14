const express = require('express');
const router = express.Router();

const { samehadakuS, samehadakuSearch, detailAnime, samehadakuDL } = require('../scrape/search');
const { scrapeAnimeInfo, scrapeKuronimePage } = require('../scrape/playwright');
const { requestan, requestanPage, requestanUrl } = require('../utils/function');
const { keyy, forVip, forPrem } = require('../utils/middleware');

router.get('/samehadaku2', keyy, requestan(samehadakuS));
router.get('/samehadaku', keyy, requestanPage(samehadakuSearch));
router.get('/samehadaku-detail', keyy, requestanUrl(detailAnime));
router.get('/kuronime', keyy, requestanPage(scrapeKuronimePage));
router.get('/kuronime-detail', keyy, requestanUrl(scrapeAnimeInfo));
router.get('/samehadakudl', keyy, requestanUrl(samehadakuDL));

module.exports = router;
