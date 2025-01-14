const config = require('../config/config');
const msg = config.messages;

const requestan = (aiFunction) => async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.query
    });
  }
  try {
    const result = await aiFunction(query);
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
};

const noparams = (aiFunction) => async (req, res) => {
  try {
    const result = await aiFunction();
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
};

const requestanID = (aiFunction) => async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.id
    });
  }
  try {
    const result = await aiFunction(id);
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
};

const requestanUrl = (aiFunction) => async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.url
    });
  }
  try {
    const result = await aiFunction(url);
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
};

const requestanPage = (aiFunction) => async (req, res) => {
  const page = req.query.page;
  if (!page) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: 'Parameter Page Belum Diisi!'
    });
  }
  try {
    const result = await aiFunction(page);
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
};

const requestanPrompt = (aiFunction) => async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) {
    return res.status(400).json({
      status: false, code: 400, author: config.author, result: msg.prompt
    });
  }
  try {
    const result = await aiFunction(prompt);
    res.json({
      status: true, code: 200, author: config.author, result: result
    });
  } catch (error) {
    res.status(500).json({
      status: false, code: 500, author: config.author, result: msg.error
    });
  }
};

module.exports = { requestan, requestanUrl, requestanPrompt, requestanID, requestanPage, noparams }