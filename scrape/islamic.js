const axios = require('axios'); 
const cheerio = require('cheerio');

async function getQuranJuz(juzNumber) {
  // Memastikan juzNumber adalah antara 1 dan 30
  if (juzNumber < 1 || juzNumber > 30) {
    throw new Error('Nomor juz harus antara 1 dan 30');
  }

  const url = `https://api.quran.gading.dev/juz/${juzNumber}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    throw error;
  }
}

async function jadwalsholat(kota) {
	try {
		let { data } = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia&method=8`)
		let response = {
			  wilayah: kota,
			  subuh: data.data.timings.Fajr,
			  dhuhur: data.data.timings.Dhuhr,
			  ashar: data.data.timings.Asr,
			  maghrib: data.data.timings.Maghrib,
			  isya: data.data.timings.Isha 
			 }
		return response
	} catch (e) {
		return e
	}
}

module.exports = {
  getQuranJuz,
  jadwalsholat
}
