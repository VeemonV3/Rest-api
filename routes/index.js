const express = require('express');
const router = express.Router();
const path = require('path');

const { forAdmin } = require('../utils/middleware');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'view', 'home.html'));
});

router.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'view', 'list.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'view', 'dashboard.html'));
});

router.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "src", "view", "diskusi.html"));
});

router.get('/admin', forAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'view', 'admin.html'));
});

router.get('/register', forAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'view', 'register.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'view', 'login.html'));
});

const films = [
    {
        id: 1,
        title: "The Conjuring - 2013",
        genre: "Horror, Thriller",
        description: "Inception adalah film yang mengisahkan tentang seorang pencuri yang memiliki kemampuan untuk memasuki mimpi orang lain.",
        thumbnail: "https://api.shannmoderz.xyz/server/file/vMZgcyM1nmtce9wC.jpg",
        category: "Sci-Fi"
    },
    {
        id: 2,
        title: "The Conjuring 2 - 2016",
        genre: "Horror, Thriller",
        description: "The Shawshank Redemption menceritakan kisah Andy Dufresne, seorang bankir yang dijatuhi hukuman penjara seumur hidup.",
        thumbnail: "https://api.shannmoderz.xyz/server/file/splNbCSjj5Ysa3z.jpg",
        category: "Drama"
    },
    {
        id: 3,
        title: "The Dark Knight",
        genre: "Aksi, Kriminal",
        description: "Dalam The Dark Knight, Batman berjuang melawan Joker, seorang penjahat yang ingin menimbulkan kekacauan di Gotham City.",
        thumbnail: "https://via.placeholder.com/150x225?text=Dark+Knight",
        category: "Aksi"
    },
    {
        id: 4,
        title: "The Conjuring",
        genre: "Horror",
        description: "The Conjuring adalah film horor yang berdasarkan kisah nyata penyelidikan paranormal.",
        thumbnail: "https://via.placeholder.com/150x225?text=The+Conjuring",
        category: "Horror"
    },
    {
        id: 5,
        title: "Jumanji: Welcome to the Jungle",
        genre: "Adventure, Comedy",
        description: "Empat remaja menemukan konsol video game yang membawa mereka ke dunia Jumanji.",
        thumbnail: "https://via.placeholder.com/150x225?text=Jumanji",
        category: "Adventure"
    }
];

router.get('/api/films', (req, res) => {
    res.json(films);
});

router.get('/api/films/:category', (req, res) => {
    const category = req.params.category;
    const filteredFilms = films.filter(film => film.category.toLowerCase() === category.toLowerCase());
    res.json(filteredFilms);
});

module.exports = router;
