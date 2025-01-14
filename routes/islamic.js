const express = require('express');
const router = express.Router();

const { getQuranJuz, jadwalsholat } = require('../scrape/islamic');
const { requestan, requestanID } = require('../utils/function');
const { keyy, forVip, forPrem } = require('../utils/middleware');

router.get('/juz', keyy, requestanID(getQuranJuz));
router.get('/jadwalsholat', keyy, requestan(jadwalsholat));

module.exports = router;

