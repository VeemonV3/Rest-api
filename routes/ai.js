const express = require('express');
const router = express.Router();
const config = require('../config/config');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const msg = config.messages;

const { photoleap, sdxlEmoji, sdxlWaifu, sdxlFurry, sdxlAnime, gipiti4, getYoutubeDownloadLink, searchPinterestImages, loadOrCreateSession, saveSession, getSessionFileSize, trimMessages, sendChatRequest, validateAiConfig, thinkany, llama3, degreeGuru, ragBot, wwdgpt, tudouai, useadrenaline, GoodyAI, luminai, blackbox, CgtAi, Simsimi, leptonAi, yousearch, LetmeGpt, AoyoAi, text2img } = require('../scrape/ai');
const { fluxPro, flux, imagine14, imagine13, generateAndDownloadImages, interactWithMorphic } = require('../scrape/playwright');
const toanime = require('../scrape/fs');
const { requestanUrl, requestan, requestanPrompt } = require('../utils/function');
const { keyy, forVip, forPrem } = require('../utils/middleware');

router.post('/v1/chat', async (req, res) => {
  const { mess } = req.body;

  if (!mess) {
    return res.status(400).json({ status: false, message: "Message content is required" });
  }

  try {
    const result = await gipiti4(mess);
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

router.get('/tudou', keyy, async (req, res) => {
  const query = req.query.query;
  const prompt = req.query.prompt;
  if (!query) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.query
    });
  }
  if (!prompt) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.prompt
    });
  }
  try {
    const result = await tudouai(query, prompt);
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
});

router.get('/gpt-3', keyy, async (req, res) => {
  const query = req.query.query;
  const prompt = req.query.prompt;
  if (!query) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.query
    });
  }
  if (!prompt) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.prompt
    });
  }
  try {
    const result = await chatew(query, prompt);
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
});

router.get('/stablediffusion-xl', keyy, async (req, res) => {
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
    
    const prompt = req.query.prompt;
    const result = await Promise.race([generateAndDownloadImages(prompt), timeoutPromise]);
    clearTimeout(timeoutId);
    
    if (!prompt) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.prompt
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

router.get('/dalle3-mini', keyy, async (req, res) => {
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
    
    const prompt = req.query.prompt;
    const result = await Promise.race([imagine13(prompt), timeoutPromise]);
    clearTimeout(timeoutId);
    
    if (!prompt) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.prompt
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

router.get('/pixel-art', keyy, async (req, res) => {
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
    
    const prompt = req.query.prompt;
    const result = await Promise.race([imagine14(prompt), timeoutPromise]);
    clearTimeout(timeoutId);
    
    if (!prompt) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.prompt
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

router.get('/flux-schnell', keyy, async (req, res) => {
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
    
    const prompt = req.query.prompt;
    const result = await Promise.race([flux(prompt), timeoutPromise]);
    clearTimeout(timeoutId);
    
    if (!prompt) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.prompt
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

router.get('/img2anime', keyy, async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({
      status: false,
      code: 400,
      author: config.author,
      result: msg.url
    });
  }

  try {
    const apiUrl = `https://api.junn4.my.id/ai/toanime?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    const result = data.result;

    // Download the image from the result URL
    const imageResponse = await axios.get(result, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    // Create a unique filename and save the image to a temporary directory
    const filename = `${uuidv4()}.jpg`;
    const tempPath = path.join(__dirname, '../tmp', filename);

    fs.writeFileSync(tempPath, imageBuffer);

    // Construct the new URL for the saved image
    const newImageUrl = `https://api.shannmoderz.xyz/tmp/${filename}`;

    return res.status(200).json({
      status: true,
      code: 200,
      author: config.author,
      result: {
        processed: 'success',
        presentation: '100%',
        convert: newImageUrl // Return the new image URL
      }
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      status: false,
      code: 500,
      author: config.author,
      result: msg.error
    });
  }
});

router.get('/flux-pro', keyy, requestanPrompt(fluxPro));
router.get('/photoleap', keyy, requestanPrompt(photoleap));
router.get('/sdxl-emoji', keyy, requestanPrompt(sdxlEmoji));
router.get('/sdxl-waifu', keyy, requestanPrompt(sdxlWaifu));
router.get('/sdxl-furry', keyy, requestanPrompt(sdxlFurry));
router.get('/sdxl-anime', keyy, requestanPrompt(sdxlAnime));
router.get('/morphic', keyy, requestan(interactWithMorphic));
router.get('/claude', keyy, requestan(thinkany));
router.get('/goody', keyy, requestan(GoodyAI));
router.get('/luminai', keyy, requestan(luminai));
router.get('/blackbox', keyy, requestan(blackbox));
router.get('/cgt', keyy, requestan(CgtAi));
router.get('/simsimi', keyy, requestan(Simsimi));
router.get('/lepton', keyy, requestan(leptonAi));
router.get('/yousearch', keyy, requestan(yousearch));
router.get('/letmegpt', keyy, requestan(LetmeGpt));
router.get('/aoyo', keyy, requestan(AoyoAi));
router.get('/prod', keyy, requestan(useadrenaline));
router.get('/txt2img', keyy, requestanPrompt(text2img));
router.get('/llama3', keyy, requestan(llama3));
router.get('/wwdgpt', keyy, requestan(wwdgpt));
router.get('/ragbot', keyy, requestan(ragBot));
router.get('/degreeguru', keyy, requestan(degreeGuru));

module.exports = router;
