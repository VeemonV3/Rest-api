const express = require('express');
const router = express.Router();
const config = require('../config/config');
const msg = config.messages;

const { aptoide } = require('../scrape/search');
const { spotifydl, cobalt, yt, Mp4, githubRepoStalk, downloadFromTwitter, Mp3, tiktok, tiktoks, douyinINS, capcut, tiktokAll, tiktokStalk, tikSlide, instagram, pinterest, snack, PinterestDL, mediafire, drive, videy } = require('../scrape/downloader');
const { scrapeFacebookVideo, getInstagramVideoAndComments } = require('../scrape/playwright');
const { requestan, requestanID, requestanUrl } = require('../utils/function');
const { keyy, forVip, forPrem } = require('../utils/middleware');

router.get('/yt-audio', keyy, async (req, res) => {
  // Tambahkan timeout untuk seluruh handler
  const TIMEOUT = 60000; // 25 detik
  let isResponseSent = false;

  const timeoutId = setTimeout(() => {
    if (!isResponseSent) {
      isResponseSent = true;
      res.status(504).json({
        status: false,
        code: 504,
        author: config.author,
        result: 'Request timeout'
      });
    }
  }, TIMEOUT);

  try {
    // Tambahkan timeout untuk operasi yang memakan waktu lama
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timeout')), TIMEOUT - 1000)
    );
    
    const url = req.query.url;
    const result = await Promise.race([Mp3(url), timeoutPromise]);
    clearTimeout(timeoutId);
    
    if (!url) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.query
    });
  }

    if (!isResponseSent) {
      isResponseSent = true;
      res.json({
        status: true,
        code: 200,
        author: config.author,
        result: result
      });
    }
  } catch (error) {
    console.error('Error:', error);

    clearTimeout(timeoutId);

    if (!isResponseSent) {
      isResponseSent = true;
      res.status(500).json({
        status: false,
        code: 500,
        author: config.author,
        result: error.message || 'Terjadi kesalahan saat memproses permintaan'
      });
    }
  } finally {
    clearTimeout(timeoutId);
  }
});

router.get('/yt-video', keyy, async (req, res) => {
  // Tambahkan timeout untuk seluruh handler
  const TIMEOUT = 60000; // 25 detik
  let isResponseSent = false;

  const timeoutId = setTimeout(() => {
    if (!isResponseSent) {
      isResponseSent = true;
      res.status(504).json({
        status: false,
        code: 504,
        author: config.author,
        result: 'Request timeout'
      });
    }
  }, TIMEOUT);

  try {
    // Tambahkan timeout untuk operasi yang memakan waktu lama
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timeout')), TIMEOUT - 1000)
    );
    
    const url = req.query.url;
    const result = await Promise.race([Mp4(url), timeoutPromise]);
    clearTimeout(timeoutId);
    
    if (!url) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.query
    });
  }

    if (!isResponseSent) {
      isResponseSent = true;
      res.json({
        status: true,
        code: 200,
        author: config.author,
        result: result
      });
    }
  } catch (error) {
    console.error('Error:', error); 

    clearTimeout(timeoutId);

    if (!isResponseSent) {
      isResponseSent = true;
      res.status(500).json({
        status: false,
        code: 500,
        author: config.author,
        result: error.message || 'Terjadi kesalahan saat memproses permintaan'
      });
    }
  } finally {
    clearTimeout(timeoutId);
  }
});

router.get('/aptoide', keyy, requestanID(aptoide.download));
router.get('/tiktok', keyy, requestanUrl(tiktok));
router.get('/ttstalk', keyy, requestan(tiktokStalk));
router.get('/capcut', keyy, requestanUrl(capcut));
router.get('/instagram', keyy, requestanUrl(getInstagramVideoAndComments));
router.get('/snackvideo', keyy, requestanUrl(snack));
router.get('/facebook', keyy, requestanUrl(scrapeFacebookVideo));
router.get('/mediafire', keyy, requestanUrl(mediafire));
router.get('/pinterest', keyy, requestanUrl(PinterestDL));
router.get('/gdrive', keyy, requestanUrl(drive));
router.get('/videy', keyy, requestanUrl(videy));
router.get('/twitter', keyy, requestanUrl(downloadFromTwitter));
router.get('/douyin', keyy, requestanUrl(douyinINS));
router.get('/github', keyy, requestanUrl(githubRepoStalk));
router.get('/ytmp4-subtitle', keyy, requestanUrl(yt));
router.get('/cobalt', keyy, requestanUrl(cobalt));
router.get('/spotify', keyy, requestanUrl(spotifydl));

module.exports = router;
