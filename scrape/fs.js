// toAnime.js
const { chromium, devices } = require('playwright-chromium');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function toanime(imagePath) {
    // Definisikan perangkat Android
    const androidDevice = devices['Pixel 5'];

    // Luncurkan browser dalam mode headless
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        ...androidDevice,
        viewport: { width: 412, height: 732 }
    });
    const page = await context.newPage();

    // Navigasi ke situs web
    await page.goto('https://www.drawever.com/ai/photo-to-anime');

    // Klik tombol "Start Animating!"
    await page.click('button:has-text("Start Animating!")');

    // Tunggu hingga tombol unggah terlihat
    await page.waitForSelector('button:has-text("Choose a file to upload")');

    // Klik tombol unggah untuk memicu input file
    await page.click('button:has-text("Choose a file to upload")');

    // Tunggu hingga input file tersedia
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
        // Set file yang akan diunggah
        await fileInput.setInputFiles(imagePath);
    } else {
        console.error('Input file tidak ditemukan!');
        await browser.close();
        return { error: 'Input file tidak ditemukan!' };
    }

    // Klik tombol "Convert to Anime"
    await page.click('button:has-text("Convert to Anime")', { force: true });

    // Tunggu beberapa detik untuk memastikan gambar sudah siap
    await page.waitForTimeout(15000); // Tunggu 15 detik

    // Ambil gambar dari elemen tertentu
    const images = await page.$$eval('img', imgs => imgs.map(img => img.src));

    // Filter gambar yang valid (base64)
    const base64Images = images.filter(src => src.startsWith('data:image/jpeg;base64,'));

    // Periksa apakah ada cukup gambar valid
    if (base64Images.length < 2) {
        console.error('Tidak cukup gambar valid ditemukan setelah konversi.');
        console.log('Gambar yang ditemukan:', base64Images); // Log gambar yang ditemukan
        await browser.close();
        return { error: 'Tidak cukup gambar valid ditemukan setelah konversi.' };
    }

    // Ambil dua gambar pertama
    const base64Image1 = base64Images[0].split(',')[1]; // Ambil bagian base64
    const base64Image2 = base64Images[1].split(',')[1]; // Ambil bagian base64

    // Buat folder tmp jika belum ada
    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }

    // Buat UUID untuk nama file
    const uuid = uuidv4();
    const resultPath1 = path.join(tmpDir, `result1_${uuid}.jpg`);
    const resultPath2 = path.join(tmpDir, `result2_${uuid}.jpg`);

    // Simpan gambar sebagai result1.jpg dan result2.jpg
    fs.writeFileSync(resultPath1, base64Image1, { encoding: 'base64' });
    fs.writeFileSync(resultPath2, base64Image2, { encoding: 'base64' });

    console.log(`Gambar disimpan sebagai ${resultPath1} dan ${resultPath2}`);

    // Tutup browser
    await browser.close();

    // Kembalikan hasil dalam format JSON dengan URL yang benar
    return {
        success: true,
        images: {
            image1: `https://api.shannmoderz.xyz/tmp/result1_${uuid}.jpg`,
            image2: `https://api.shannmoderz.xyz/tmp/result2_${uuid}.jpg`
        }
    };
}

module.exports = toanime;
