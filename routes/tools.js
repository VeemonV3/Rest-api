const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const msg = config.messages;

const { imgLarger, cekIp, carbon, removebg, tts, textToHex, hexToText, readQRCodeFromLink, generateAndUploadQRCode, morseToText, textToMorse, BinaryToText, TextToBinary, uuid, obfus, createPaste, generate } = require('../scrape/tools');
const { html2img, takeScreenshot } = require('../scrape/playwright');
const { requestanID, requestan, requestanUrl } = require('../utils/function');
const { keyy, forVip, forPrem } = require('../utils/middleware');

router.get('/sswebphone', keyy, (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.url
    });
  }

  takeScreenshot(url, 'mobile')
  .then((imageBuffer) => {
    const fileName = `${uuid()}.jpg`;
    const filePath = path.join(__dirname, '../tmp', fileName);

    fs.writeFile(filePath, imageBuffer, (err) => {
      if (err) {
        return res.status(500).send(`Error saving image: ${err.message}`);
      }
      return res.status(200).json({
        status: true,
        code: 200,
        author: config.author,
        result: `https://api.shannmoderz.xyz/tmp/${fileName}`
      });
    });
  })
  .catch((error) => {
    res.status(500).send(`Error: ${error.message}`);
  });
});

router.get('/sswebdesktop', keyy, (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.url
    });
  }

  takeScreenshot(url, 'desktop')
  .then((imageBuffer) => {
    const fileName = `${uuid()}.jpg`;
    const filePath = path.join(__dirname, '../tmp', fileName);

    fs.writeFile(filePath, imageBuffer, (err) => {
      if (err) {
        return res.status(500).send(`Error saving image: ${err.message}`);
      }
      return res.status(200).json({
        status: true,
        code: 200,
        author: config.author,
        result: `https://api.shannmoderz.xyz/tmp/${fileName}`
      });
    });
  })
  .catch((error) => {
    res.status(500).send(`Error: ${error.message}`);
  });
});

router.get('/sswebtab', keyy, (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.url
    });
  }

  takeScreenshot(url, 'tablet')
  .then((imageBuffer) => {
    const fileName = `${uuid()}.jpg`;
    const filePath = path.join(__dirname, '../tmp', fileName);

    fs.writeFile(filePath, imageBuffer, (err) => {
      if (err) {
        return res.status(500).send(`Error saving image: ${err.message}`);
      }
      return res.status(200).json({
        status: true,
        code: 200,
        author: config.author,
        result: `https://api.shannmoderz.xyz/tmp/${fileName}`
      });
    });
  })
  .catch((error) => {
    res.status(500).send(`Error: ${error.message}`);
  });
});

router.get('/lirik', keyy, async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.query
    });
  }

  try {
    const apiUrl = `https://widipe.com/lirik?text=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    const result = data.result;

    return res.status(200).json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    return res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
});

router.get('/pastebin', keyy, async (req, res) => {
  const title = req.query.title;
  const content = req.query.content;
  if (!title) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: 'Parameter Title Belum Diisi!!'
    });
  }
  if (!content) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: 'Parameter Content Belum Diisi!!'
    });
  }
  try {
    const result = await createPaste(title, content);
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
});

router.get('/html2img', keyy, requestan(html2img));
router.get('/carbon', keyy, requestan(carbon));
router.get('/encrypt', keyy, requestan(obfus));
router.get('/boldtext', keyy, requestan(generate));
router.get('/tts', keyy, requestan(tts));
router.get('/txt2biner', keyy, requestan(TextToBinary));
router.get('/biner2txt', keyy, requestan(BinaryToText));
router.get('/txt2morse', keyy, requestan(textToMorse));
router.get('/morse2txt', keyy, requestan(morseToText));
router.get('/link2qr', keyy, requestanUrl(generateAndUploadQRCode));
router.get('/readqr', keyy, requestanUrl(readQRCodeFromLink));
router.get('/txt2hex', keyy, requestan(textToHex));
router.get('/hex2txt', keyy, requestan(hexToText));
router.get('/removebg', keyy, requestanUrl(removebg));
router.get('/cekip', keyy, requestanID(cekIp));
router.get('/enhace', requestanUrl(imgLarger));

module.exports = router;
