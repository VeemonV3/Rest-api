const express = require('express');
const path = require('path');
const fs = require('fs');
const storage = require('node-persist');
const bodyParser = require('body-parser');
const requestIp = require('request-ip');

const app = express();
app.use(requestIp.mw());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/tmp', express.static(path.join(__dirname, 'tmp')));
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.set('json spaces', 2);

const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://shannz-restfull-api-default-rtdb.firebaseio.com"
});

const db = admin.database();

console.log('C> Database Connected ✅');

const statsDir = path.join(__dirname, 'stats');
if (!fs.existsSync(statsDir)){
    fs.mkdirSync(statsDir);
    console.log(`C> Folder ${statsDir} Created ✅`);
}

const tmpDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tmpDir)){
    fs.mkdirSync(tmpDir);
}
console.log('C> Root Directory In', process.cwd());

const countRequests = async (req, res, next) => {
  let totalRequests = await storage.getItem('totalRequests') || 0;
  totalRequests++;
  await storage.setItem('totalRequests', totalRequests);
  next();
};

storage.init({
    dir: statsDir,
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: false,
    ttl: false,
    expiredInterval: 2 * 60 * 1000,
    forgiveParseErrors: true
}).then(() => {
    console.log('C> Completed 🔥');
});

app.use((req, res, next) => {
  if (req.path !== '/server/stats') {
    return countRequests(req, res, next);
  }
  next();
});

app.use((req, res, next) => {
  if (req.path !== '/dashboard') {
    return countRequests(req, res, next);
  }
  next();
});

app.use((req, res, next) => {
  if (req.path !== '/docs') {
    return countRequests(req, res, next);
  }
  next();
});

app.use((req, res, next) => {
  if (req.path !== '/') {
    return countRequests(req, res, next);
  }
  next();
});

app.use((req, res, next) => {
  if (req.path !== '/login') {
    return countRequests(req, res, next);
  }
  next();
});

app.use((req, res, next) => {
  if (req.path !== '/register') {
    return countRequests(req, res, next);
  }
  next();
});

app.use((req, res, next) => {
  if (req.path !== '/admin') {
    return countRequests(req, res, next);
  }
  next();
});

// Import Routers
const indexR = require('./routes/index');
const aiR = require('./routes/ai');
const toolsR = require('./routes/tools');
const serverR = require('./routes/server');
const searchR = require('./routes/search');
const animeR = require('./routes/anime');
const islamicR = require('./routes/islamic');
const downloaderR = require('./routes/downloader');
const ephotoR = require('./routes/ephoto360');
const flamingtextR = require('./routes/flamingtext');
const beritaR = require('./routes/berita');
const primbonR = require('./routes/primbon');
const authR = require('./routes/auth');

// Use Routers
app.use('/', indexR);
app.use('/ai', aiR);
app.use('/tools', toolsR);
app.use('/server', serverR);
app.use('/search', searchR);
app.use('/anime', animeR);
app.use('/islamic', islamicR);
app.use('/downloader', downloaderR);
app.use('/ephoto360', ephotoR);
app.use('/flamingtext', flamingtextR);
app.use('/berita', beritaR);
app.use('/primbon', primbonR);
app.use('/auth', authR);

const PORT = process.env.PORT || 1001;
app.listen(PORT, () => {
    console.log(`C> The server is running on port ${PORT}`);
});
