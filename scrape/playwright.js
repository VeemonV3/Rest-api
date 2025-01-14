const { chromium, devices } = require('playwright-chromium');
const path = require('path');
const fs = require('fs').promises;

// Fungsi untuk menghasilkan UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function fluxPro(promptText) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://deepdreamgenerator.com/generate');

    await page.fill('textarea#text-prompt', promptText);

    await page.click('.settings-image img[src="https://ddg-assets.b-cdn.net/web/imgs/generate_thumbs/186.jpg"]');

    await page.click('button.submit.generator-submit');

    const imageUrl = await page.getAttribute('.generating-image img.temp-image', 'src');
    await browser.close();

    return imageUrl;
}

async function html2img(html) {
    // Menentukan jalur untuk menyimpan gambar
    const file = generateUUID()
    const fileName = `${file}.png`
    const outputPath = path.join(__dirname, `../tmp/${fileName}`);
    // Meluncurkan browser dalam mode headless
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Mengatur konten halaman dengan HTML yang diberikan
    await page.setContent(html);

    // Mengambil screenshot dan menyimpannya
    await page.screenshot({ path: outputPath });

    // Menutup browser
    await browser.close();

    // Mengembalikan objek JSON dengan jalur gambar
    return { priview: `https://api.shannmoderz.xyz/tmp/${fileName}` };
}

async function imagine14(prompt) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigasi ke website
    await page.goto('https://aryahcr.cc/chat/en');

    await page.waitForTimeout(5000);
    
    // Tunggu elemen input muncul
    await page.waitForSelector('#prompt-text');
    
    // Masukkan teks ke dalam input
    await page.fill('#prompt-text', `/imagine14 ${prompt}`);
    
    // Cek apakah tombol masih disabled
    const isDisabled = await page.$eval('#send-button', button => button.disabled);
    
    if (isDisabled) {
      console.log('Tombol kirim masih disabled. Mencoba metode alternatif...');
      // Jika tombol masih disabled, coba tekan Enter pada input
      await page.press('#prompt-text', 'Enter');
    } else {
      // Jika tombol sudah aktif, klik tombol
      await page.click('#send-button');
    }
    
    // Tunggu gambar muncul
    await page.waitForTimeout(24000); 

    // Gunakan XPath untuk menemukan semua elemen img
    const images = await page.$$('article.imagesbot img');
    
    // Array untuk menyimpan URL gambar
    const downloadedFiles = [];

    // Download setiap gambar
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageBuffer = await image.screenshot();
      const uuid = generateUUID();
      const fileName = `${uuid}.png`;
      const imagePath = path.join(__dirname, '../tmp', fileName); 
      await fs.writeFile(imagePath, imageBuffer);
      const imageUrl = `https://api.shannmoderz.xyz/tmp/${fileName}`;
      downloadedFiles.push(imageUrl);
      console.log(`Gambar ${i + 1} disimpan di: ${imagePath}`);
      console.log(`URL gambar: ${imageUrl}`);
    }

    console.log('Semua gambar telah diunduh dan disimpan.');
    
    return downloadedFiles;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return [];
  } finally {
    await browser.close();
  }
}

async function imagine13(prompt) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigasi ke website
    await page.goto('https://aryahcr.cc/chat/en');

    await page.waitForTimeout(5000);
    
    // Tunggu elemen input muncul
    await page.waitForSelector('#prompt-text');
    
    // Masukkan teks ke dalam input
    await page.fill('#prompt-text', `/imagine13 ${prompt}`);
    
    // Cek apakah tombol masih disabled
    const isDisabled = await page.$eval('#send-button', button => button.disabled);
    
    if (isDisabled) {
      console.log('Tombol kirim masih disabled. Mencoba metode alternatif...');
      // Jika tombol masih disabled, coba tekan Enter pada input
      await page.press('#prompt-text', 'Enter');
    } else {
      // Jika tombol sudah aktif, klik tombol
      await page.click('#send-button');
    }
    
    // Tunggu gambar muncul
    await page.waitForTimeout(20000);

    // Gunakan XPath untuk menemukan semua elemen img
    const images = await page.$$('article.imagesbot img');
    
    // Array untuk menyimpan URL gambar
    const downloadedFiles = [];

    // Download setiap gambar
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageBuffer = await image.screenshot();
      const uuid = generateUUID();
      const fileName = `${uuid}.png`;
      const imagePath = path.join(__dirname, '../tmp', fileName); 
      await fs.writeFile(imagePath, imageBuffer);
      const imageUrl = `https://api.shannmoderz.xyz/tmp/${fileName}`;
      downloadedFiles.push(imageUrl);
      console.log(`Gambar ${i + 1} disimpan di: ${imagePath}`);
      console.log(`URL gambar: ${imageUrl}`);
    }

    console.log('Semua gambar telah diunduh dan disimpan.');
    
    return downloadedFiles;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return [];
  } finally {
    await browser.close();
  }
}

async function generateAndDownloadImages(prompt) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigasi ke website
    await page.goto('https://aryahcr.cc/chat/en');

    await page.waitForTimeout(5000);
    
    // Tunggu elemen input muncul
    await page.waitForSelector('#prompt-text');
    
    // Masukkan teks ke dalam input
    await page.fill('#prompt-text', `/imagine9 ${prompt}`);
    
    // Cek apakah tombol masih disabled
    const isDisabled = await page.$eval('#send-button', button => button.disabled);
    
    if (isDisabled) {
      console.log('Tombol kirim masih disabled. Mencoba metode alternatif...');
      // Jika tombol masih disabled, coba tekan Enter pada input
      await page.press('#prompt-text', 'Enter');
    } else {
      // Jika tombol sudah aktif, klik tombol
      await page.click('#send-button');
    }
    
    // Tunggu gambar muncul
    await page.waitForTimeout(10000);

    // Ambil semua elemen gambar
    const images = await page.$$('.imagesbot img');
    
    // Array untuk menyimpan URL gambar
    const downloadedFiles = [];

    // Download setiap gambar
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageBuffer = await image.screenshot();
      const uuid = generateUUID();
      const fileName = `${uuid}.png`;
      const imagePath = path.join(__dirname, '../tmp', fileName); 
      await fs.writeFile(imagePath, imageBuffer);
      const imageUrl = `https://api.shannmoderz.xyz/tmp/${fileName}`;
      downloadedFiles.push(imageUrl);
      console.log(`Gambar ${i + 1} disimpan di: ${imagePath}`);
      console.log(`URL gambar: ${imageUrl}`);
    }

    console.log('Semua gambar telah diunduh dan disimpan.');
    
    return downloadedFiles;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return [];
  } finally {
    await browser.close();
  }
}

async function takeScreenshot(url, deviceType) {
  const browser = await chromium.launch({
    chromiumSandbox: false
  });
  
  const deviceTypes = {
    mobile: devices['iPhone 12'],
    tablet: devices['iPad (gen 7)'],
    desktop: {
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  };

  if (!deviceTypes[deviceType]) {
    throw new Error('Invalid device type. Choose from: mobile, tablet, or desktop');
  }

  try {
    const context = await browser.newContext({
      ...deviceTypes[deviceType],
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    const screenshotBuffer = await page.screenshot({ fullPage: true, type: 'jpeg' });

    await context.close();
    return screenshotBuffer;
  } catch (error) {
    console.error('Error taking screenshot:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function scrapeKuronimePage(page = 1) {
  try {
    // Membuka browser
    const browser = await chromium.launch({ args: ["--no-sandbox"] });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    const newPage = await context.newPage();

    // Navigasi ke halaman
    await newPage.goto(`https://kuronime.me/anime/page/${page}/?title&status&type&order=title`, {
      waitUntil: 'networkidle'
    });

    // Scraping data
    const animeList = await newPage.evaluate(() => {
      const results = [];
      document.querySelectorAll('.listupd .bs').forEach((element) => {
        const title = element.querySelector('.tt h4')?.textContent.trim();
        const url = element.querySelector('a')?.href;
        const imageUrl = element.querySelector('.limit img')?.src || element.querySelector('.limit img')?.dataset.src;
        const type = element.querySelector('.bt span')?.textContent.trim();
        const rating = parseFloat(element.querySelector('.rating i')?.textContent.trim());

        if (title) {
          results.push({ title, url, imageUrl, type, rating });
        }
      });
      return results;
    });

    // Menutup browser
    await browser.close();

    return animeList;
  } catch (error) {
    console.error('Terjadi kesalahan saat melakukan scraping:', error);
    return error;
  }
}

async function scrapeAnimeInfo(url) {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url);

  const result = await page.evaluate(() => {
    // Mengambil gambar
    const imageUrl = document.querySelector('.l img').getAttribute('src');

    // Mengambil sinopsis
    const synopsis = document.querySelector('.conx p').innerText;

    // Mengambil semua link episode
    const episodeLinks = [];
    const episodes = document.querySelectorAll('.bixbox.bxcl ul li');
    episodes.forEach((episode) => {
      const link = episode.querySelector('a').getAttribute('href');
      const episodeNumber = link.match(/episode-(\d+)/)[1];
      episodeLinks.push({
        episode: episodeNumber,
        link: link
      });
    });

    return {
      imageUrl,
      synopsis,
      episodes: episodeLinks
    };
  });

  await browser.close();

  return result;
}

async function interactWithMorphic(question) {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigasi ke website Morphic
    await page.goto('https://www.morphic.sh');

    // Tunggu hingga textarea input muncul
    await page.waitForSelector('textarea[name="input"]');

    // Masukkan pertanyaan ke textarea
    await page.fill('textarea[name="input"]', question);

    // Klik tombol submit
    await page.click('button[type="submit"][aria-label="Send message"]');

    // Tunggu jawaban muncul
    await page.waitForSelector('.prose-sm.prose-neutral.prose-a\\:text-subaccent', { timeout: 60000 }); // Tunggu maksimal 60 detik

    // Ekstrak jawaban
    const answer = await page.evaluate(() => {
      const div = document.querySelector('.prose-sm.prose-neutral.prose-a\\:text-subaccent');
      if (!div) return '';

      // Ambil semua teks dari div, termasuk elemen anak
      return Array.from(div.childNodes).map(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'P' || node.tagName === 'H3') {
            return node.textContent.trim();
          } else if (node.tagName === 'IMG') {
            return `![${node.alt}](${node.src})`; // Format gambar dalam Markdown
          } else if (node.tagName === 'A') {
            return `${node.textContent.trim()} [${node.getAttribute('href')}]`;
          }
          return '';
        }
        return '';
      }).join('\n\n'); // Gabungkan semua teks dengan dua baris baru
    });

    console.log('Jawaban dari Morphic AI:', answer);

    return answer;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  } finally {
    // Tutup browser
    await browser.close();
  }
}

async function getInstagramVideoAndComments(pp) {
    // Membuat browser baru dengan mode headless
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Mengunjungi situs web
    await page.goto('https://fastdl.app/id');

    // Memasukkan tautan Instagram
    await page.fill('#search-form-input', pp);

    // Mengklik tombol "Unduh"
    await page.click('.search-form__button');

    // Menunggu beberapa detik untuk hasil muncul
    await page.waitForTimeout(8000); // Tunggu 5 detik

    // Mengambil semua detail hasil
    const results = await page.evaluate(() => {
        const outputList = document.querySelector('.output-list');
        const videoUrl = outputList.querySelector('.button--filled.button__download').href;
        const imageElement = outputList.querySelector('.media-content__image');
        const imageUrl = imageElement.src;

        const comments = Array.from(outputList.querySelectorAll('.output-list__comments li')).map(comment => {
            return {
                username: comment.querySelector('span').innerText,
                text: comment.querySelector('p').innerText
            };
        });

        return {
            videoUrl,
            imageUrl, // Kembalikan URL gambar untuk diproses lebih lanjut
            comments
        };
    });

    // Memproses gambar
    let imagePath = null;
    if (results.imageUrl.startsWith('data:image/')) {
        // Jika gambar adalah buffer, simpan ke file sementara
        const base64Data = results.imageUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `${generateUUID()}.png`; // Menggunakan UUID untuk nama file
        const filePath = path.join(__dirname, '../tmp', fileName); // Pastikan folder 'tmp' ada
        
        // Simpan buffer ke file
        await fs.writeFile(filePath, buffer);
        imagePath = `https://api.shannmoderz.xyz/tmp/${fileName}`; // Kembalikan URL yang sesuai
    } else {
        imagePath = results.imageUrl; // Gunakan URL asli
    }

    // Menutup browser
    await browser.close();

    // Kembalikan hasil akhir
    return {
        videoUrl: results.videoUrl,
        imagePath,
        comments: results.comments
    };
}

async function scrapeFacebookVideo(url) {
  const browser = await chromium.launch({ chromiumSandbox: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://snapsave.app/id');

    // Memasukkan URL video Facebook
    await page.fill('input#url', url);

    // Mengklik tombol Download
    await page.click('button#send');

    // Menunggu hasil rendering
    await page.waitForSelector('table.table.is-fullwidth', { timeout: 35000 });

    // Mengambil informasi video
    const videoInfo = await page.evaluate(() => {
      const rows = document.querySelectorAll('table.table.is-fullwidth tbody tr');
      return Array.from(rows).map(row => {
        const quality = row.querySelector('.video-quality').textContent.trim();
        const downloadLink = row.querySelector('a.button.is-success.is-small').href;
        return { quality, downloadLink };
      });
    });

    await browser.close();
    return videoInfo;

  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    await browser.close();
    return null;
  }
}

async function scrapeTerradownloader(url) {
  const browser = await chromium.launch({ chromiumSandbox: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigasi ke halaman
    await page.goto('https://teradownloader.com/download?link=' + url);
    
    // Tunggu selama 10 detik
    await page.waitForTimeout(7000);
    
    // Tunggu sampai elemen yang diinginkan muncul
    await page.waitForSelector('.rounded-lg .grid.gap-8');
    
    // Ekstrak informasi yang dibutuhkan
    const results = await page.evaluate(() => {
      const items = document.querySelectorAll('.rounded-lg .grid.gap-8 .bg-white');
      return Array.from(items).map(item => {
        const titleElement = item.querySelector('h5');
        const title = titleElement ? titleElement.textContent.trim() : 'Tidak ada judul';
        
        const fileSizeElement = item.querySelector('p:nth-of-type(1)');
        const fileSize = fileSizeElement ? fileSizeElement.textContent.trim() : 'Ukuran file tidak tersedia';
        
        const uploadTimeElement = item.querySelector('p:nth-of-type(2)');
        const uploadTime = uploadTimeElement ? uploadTimeElement.textContent.trim() : 'Waktu unggah tidak tersedia';
        
        const downloadLinks = Array.from(item.querySelectorAll('a[href^="https://"]'))
          .filter(a => !a.textContent.includes('Download App'))
          .map(a => ({
            text: a.textContent.trim(),
            url: a.href
          }));
        
        return {
          title,
          fileSize,
          uploadTime,
          downloadLinks
        };
      });
    });
    
    return results;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return null;
  } finally {
    await browser.close();
  }
}

async function scrapeAmazonProducts(searchQuery) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigasi ke halaman pencarian Amazon
    await page.goto(`https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&ref=nb_sb_noss`);

    // Tunggu hingga elemen produk dimuat
    await page.waitForSelector('.s-result-item');

    // Ekstrak informasi produk
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.s-result-item[data-component-type="s-search-result"]');
      
      return Array.from(productElements).map(el => {
        const titleElement = el.querySelector('h2 a.a-link-normal');
        const priceElement = el.querySelector('.a-price-whole');
        const ratingElement = el.querySelector('.a-icon-star-small .a-icon-alt');
        const imageElement = el.querySelector('.s-image');

        return {
          title: titleElement ? titleElement.textContent.trim() : 'N/A',
          price: priceElement ? priceElement.textContent.trim() : 'N/A',
          rating: ratingElement ? ratingElement.textContent.trim() : 'N/A',
          imageUrl: imageElement ? imageElement.getAttribute('src') : 'N/A',
          productUrl: titleElement ? 'https://www.amazon.com' + titleElement.getAttribute('href') : 'N/A'
        };
      });
    });

    return products;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return [];
  } finally {
    await browser.close();
  }
}

async function flux(pp) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://black-forest-labs-flux-1-schnell.hf.space/');

console.log('awaiting..')
await page.waitForTimeout(5000)

  // Masukkan teks ke input
  await page.fill('input[data-testid="textbox"]', pp);

  // Klik tombol 
  await page.click('button[id="component-5"]');
 
console.log('awaiting v2...')
await page.waitForTimeout(15000)

  // Tunggu gambar tergenerate
  console.log('screenshoting...')
  await page.waitForSelector('img.svelte-1pijsyv');
const uuid = generateUUID()
const imageElement = await page.$('img.svelte-1pijsyv');
  const boundingBox = await imageElement.boundingBox();
  const file = uuid + '.png'
  const screenshotPath = path.join('tmp', file);
  await page.screenshot({
    path: screenshotPath,
    clip: {
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: boundingBox.height,
    },
  });
 
  
  console.log(`Screenshot telah disimpan di ${screenshotPath}`);
  return [ 'https://api.shannmoderz.xyz/tmp/' + file ]
   
  await browser.close();
}

async function toanime(buffer) {
    // Define the Android device
    const androidDevice = devices['Pixel 5'];

    // Launch the browser in headless mode
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        ...androidDevice,
        viewport: { width: 412, height: 732 }
    });
    const page = await context.newPage();

    // Navigate to the website
    await page.goto('https://www.drawever.com/ai/photo-to-anime');

    // Click the "Start Animating!" button
    await page.click('button:has-text("Start Animating!")');

    // Wait for the upload button to be visible
    await page.waitForSelector('button:has-text("Choose a file to upload")');

    // Click the upload button to trigger the file input
    await page.click('button:has-text("Choose a file to upload")');

    // Wait for the file input to be available
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
        // Set the file to upload from the buffer
        const filePath = path.join(__dirname, 'temp_image.jpg');
        await fs.writeFile(filePath, buffer); // Use fs.promises to write the file
        await fileInput.setInputFiles(filePath);
    } else {
        console.error('File input not found!');
        await browser.close();
        return;
    }

    // Take a screenshot before clicking the convert button
    await page.screenshot({ path: 'p.jpg' });

    // Click the "Convert to Anime" button
    await page.click('button:has-text("Convert to Anime")', { force: true });

    // Wait a few seconds to ensure the image is ready
    await page.waitForTimeout(15000); // Wait 15 seconds

    // Get images from the page
    const images = await page.$$eval('img', imgs => imgs.map(img => img.src));

    // Filter valid base64 images
    const base64Images = images.filter(src => src.startsWith('data:image/jpeg;base64,'));

    // Check if there are enough valid images
    if (base64Images.length < 2) {
        console.error('Not enough valid images found after conversion.');
        console.log('Images found:', base64Images); // Log found images
        await browser.close();
        return;
    }

    // Get the first two images
    const base64Image1 = base64Images[0].split(',')[1]; // Get base64 part
    const base64Image2 = base64Images[1].split(',')[1]; // Get base64 part

    // Define the output directory (outside the current file)
    const outputDir = path.join(__dirname, '../tmp'); // Adjust path to go one level up
    await fs.mkdir(outputDir, { recursive: true }); // Create the directory if it doesn't exist

    // Generate unique filenames
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();

    // Save images as UUID.jpg in the tmp directory
    await fs.writeFile(path.join(outputDir, `${uuid1}.jpg`), base64Image1, { encoding: 'base64' });
    await fs.writeFile(path.join(outputDir, `${uuid2}.jpg`), base64Image2, { encoding: 'base64' });

    console.log('Images saved in tmp directory with unique names.');

    // Close the browser
    await browser.close();

    // Return the structured response with URLs
    return {
        process: 'success',
        beforeAfter: `https://api.shannmoderz.xyz/tmp/${uuid1}.jpg`,
        convert: `https://api.shannmoderz.xyz/tmp/${uuid2}.jpg`
    };
}

module.exports = { 
  scrapeKuronimePage,
  scrapeAnimeInfo,
  interactWithMorphic,
  getInstagramVideoAndComments,
  scrapeFacebookVideo,
  scrapeTerradownloader,
  takeScreenshot,
  scrapeAmazonProducts,
  generateAndDownloadImages,
  imagine13,
  imagine14,
  flux,
  toanime,
  html2img,
  fluxPro,
};
