const express = require('express');
const router = express.Router();
const config = require('../config/config');
const msg = config.messages;

const { ephoto } = require('../scrape/ephoto');
const { keyy, forVip, forPrem } = require('../utils/middleware');

const createRoute = (path, url) => {
  router.get(`/${path}`, keyy,
    async (req, res) => {
      const query = req.query.query;
      if (!query) {
        return res.status(400).json({
          status: false, code: 400, author: config.author, result: msg.query
        });
      }
      try {
        const result = await ephoto(url, query);
        res.status(200).json({
          status: true, code: 200, author: msg.author, result: result
        });
      } catch (error) {
        res.status(500).json({
          status: false, code: 500, author: config.author, result: msg.error
        });
      }
    });
};

createRoute('writetext', 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html');
createRoute('blackpinklogo', 'https://en.ephoto360.com/create-blackpink-logo-online-free-607.html');
createRoute('glitchtext', 'https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html');
createRoute('advancedglow', 'https://en.ephoto360.com/advanced-glow-effects-74.html');
createRoute('typographytext', 'https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html');
createRoute('pixelglitch', 'https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html');
createRoute('neonglitch', 'https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html');
createRoute('flag', 'https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html');
createRoute('flag2', 'https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html');
createRoute('deletingtext', 'https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html');
createRoute('blackpinkstyle', 'https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html');
createRoute('glowingtext', 'https://en.ephoto360.com/create-glowing-text-effects-online-706.html');
createRoute('underwater', 'https://en.ephoto360.com/3d-underwater-text-effect-online-682.html');
createRoute('logomaker', 'https://en.ephoto360.com/free-bear-logo-maker-online-673.html');
createRoute('cartoonstyle', 'https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html');
createRoute('papercut', 'https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html');
createRoute('watercolor', 'https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html');
createRoute('effectclouds', 'https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html');
createRoute('gradienttext', 'https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html');
createRoute('summerbeach', 'https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html');
createRoute('luxurygold', 'https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html');
createRoute('multicolored', 'https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html');
createRoute('sandsummer', 'https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html');
createRoute('galaxy', 'https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html');
createRoute('1917style', 'https://en.ephoto360.com/1917-style-text-effect-523.html');
createRoute('makingneon', 'https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html');
createRoute('royaltext', 'https://en.ephoto360.com/royal-text-effect-online-free-471.html');
createRoute('texteffect', 'https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html');
createRoute('galaxystyle', 'https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html');
createRoute('lighteffect', 'https://en.ephoto360.com/create-light-effects-green-neon-online-429.html');

module.exports = router;