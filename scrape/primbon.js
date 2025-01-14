const primbon = require('primbon-scraper');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeHantuImages() {
    const baseUrl = 'https://www.primbon.com/hantu.php?page=';
    const urll = 'https://www.primbon.com/';
    const results = [];

    for (let page = 1; page <= 26; page++) {
        try {
            const response = await axios.get(`${baseUrl}${page}`);
            const html = response.data;
            const $ = cheerio.load(html);

            const galleryItems = $('.gallery tbody tr td a');

            galleryItems.each((index, element) => {
                const imgSrc = $(element).attr('href');
                const caption = $(element).data('caption');
                const thumbnailSrc = $(element).find('img').attr('src');

                results.push({
                    image: urll + imgSrc,
                    description: caption
                });
            });
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error.message);
        }
    }

    return results;
}

async function getArtiNama(nama) {
    const res = await primbon.artiNama(nama);
    const cleanedResult = res.replace('(adsbygoogle = window.adsbygoogle || []).push({});', '').trim();
    return (cleanedResult);
}

async function getTafsirMimpi(mimpi) {
    const res = await primbon.tafsirMimpi(mimpi);
    return (res);
}

async function getKecocokanNama(nama1, nama2) {
    const res = await primbon.Jodoh(nama1, nama2);
    return (res);
}

async function getTanggalJadian(tanggal) {
    const res = await primbon.tanggaljadi(tanggal);
    const cleanedResult = res.replace('(adsbygoogle = window.adsbygoogle || []).push({});', '').trim();
    return (cleanedResult);
}

async function getRamalanRejeki(tanggalLahir) {
    const res = await primbon.rejekiweton(tanggalLahir);
    let cleanedResult;
    if (res && typeof res.penjelasan === 'string') {
        cleanedResult = res.penjelasan.replace('(adsbygoogle = window.adsbygoogle || []).push({});', '').trim();
    } else {
        cleanedResult = 'Hasil tidak ditemukan atau format tidak dikenali.';
    }
    return cleanedResult;
}

module.exports = { getArtiNama, getTafsirMimpi, getKecocokanNama, getTanggalJadian, getRamalanRejeki, scrapeHantuImages }