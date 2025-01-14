const express = require('express');
const router = express.Router();
const config = require('../config/config');
const msg = config.messages;

const { keyy, forVip, forPrem } = require('../utils/middleware');

const createLogoRoute = (style) => {
  router.get(`/${style}`, keyy, async (req, res) => {
    try {
      const query = req.query.query;

      if (!query) {
        return res.status(400).json({
          status: false, code: 400, author: config.author, result: 'Parameter query Belum Diisi!!'
        });
      };
      
      const fileName = `${style}_${text}_${Date.now()}.png`;
      const filePath = path.join(tmpDir, fileName);
      
      const flamingTextUrl = `https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=${style}-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=${encodeURIComponent(query)}`;
      const response = await axios.get(flamingTextUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, response.data);
      const imageUrl = `https://api.shannmoderz.xyz/tmp/${fileName}`;
      return res.status(200).json({
        status: true,
        code: 200,
        author: config.author,
        result: imageUrl
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({
          status: false, code: 500, author: config.author, result: msg.error
      });
    };
  });
};

createLogoRoute('fluffy');
createLogoRoute('comics');
createLogoRoute('crafts');
createLogoRoute('retro');
createLogoRoute('beehive');
createLogoRoute('art-deco');
createLogoRoute('jukebox');
createLogoRoute('heavy-metal');
createLogoRoute('big-love');
createLogoRoute('neon');
createLogoRoute('good-times');
createLogoRoute('closed');
createLogoRoute('gamezone');
createLogoRoute('matrix');
createLogoRoute('star-wars');
createLogoRoute('godzilla');
createLogoRoute('san-andreas');
createLogoRoute('ironic-maiden');
createLogoRoute('motormouth');
createLogoRoute('water');
createLogoRoute('runner');
createLogoRoute('blackbird');
createLogoRoute('smurfs');
createLogoRoute('alien-glow');
createLogoRoute('beauty');
createLogoRoute('minions');
createLogoRoute('crazy');
createLogoRoute('spider-men');
createLogoRoute('football');
createLogoRoute('skate');

module.exports = router;