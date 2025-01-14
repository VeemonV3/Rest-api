const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const QRCode = require('qrcode');
const path = require('path');
const BodyForm = require('form-data');
const Jimp = require('jimp');
const QrCodeReader = require('qrcode-reader');
const { v4: uuidv4 } = require('uuid');
const jsobfus = require('javascript-obfuscator');
const FormData = require('form-data');

async function imgLarger(input, scaleRadio = 2, isLogin = 0) {
  const baseURL = 'https://get1.imglarger.com/api/Upscaler';
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Origin': 'https://imgupscaler.com',
    'Referer': 'https://imgupscaler.com/',
    'User-Agent': 'Postify/1.0.0',
    'X-Forwarded-For': Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.'),
  };
  async function uploadImage(input) {
    const formData = new FormData();
    if (typeof input === 'string') {
      if (input.startsWith('http')) {
        try {
          const response = await axios.get(input, { responseType: 'arraybuffer' });
          const bf = Buffer.from(response.data);
          formData.append('myfile', bf, { filename: 'uploaded_image.jpg' });
        } catch (error) {
          console.error(error.message);
          throw new Error('Link gambar tidak dapat diunduh. Silakan coba lagi.');
        }
      } else {
        try {
          const bf = fs.readFileSync(input);
          const fileName = path.basename(input);
          formData.append('myfile', bf, { filename: fileName });
        } catch (error) {
          console.error(error.message);
          throw new Error('Tidak dapat membaca Path File yang diInputkan. Silakan periksa path file nyaa...');
        }
      }
    } else if (Buffer.isBuffer(input)) {
      formData.append('myfile', input, { filename: 'uploaded_image.jpg' });
    } else {
      throw new Error('Input tidak valid. Harap berikan path file, link gambar, atau buffer yang benar.');
    }
    formData.append('scaleRadio', scaleRadio);
    formData.append('isLogin', isLogin);
    try {
      console.log('Sedang mengupload gambar, mohon ditunggu...');
      const response = await axios.post(`${baseURL}/Upload`, formData, {
        headers: {
          ...headers,
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: progressEvent => {
          showProgress(progressEvent.loaded, progressEvent.total);
        }
      });

      if (response.data.code === 999) {
        console.error('Error: ', response.data.msg);
        throw new Error('Authorization nya ditolak oyy � soalnya limit lu nya udah habis �');
      }
      return response.data;
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      throw new Error('Upload gambar gagal. Silakan periksa response API.');
    }
  }
  function showProgress(loaded, total) {
    const percentage = Math.round((loaded / total) * 100);
    process.stdout.write(`\rUploading : ${percentage}%\n`);
  }
  async function checkStatus(code) {
    const payload = { code, scaleRadio, isLogin };
    try {
      const response = await axios.post(`${baseURL}/CheckStatus`, payload, {
        headers: headers,
      });
      return response.data; 
    } catch (error) {
      console.error(error.message);
      throw new Error('Pemeriksaan status task gagal.');
    }
  }
  async function processImage() {
    const { data: { code } } = await uploadImage(input);
    let status;
    do {
      status = await checkStatus(code);
      console.log(`\nStatus task: ${status.data.status}`);

      if (status.data.status === 'waiting') {
        console.log('Upscale image nya masih diproses, sabar yakk...');
        await delay(5000);
      }
    } while (status.data.status === 'waiting');

    console.log('Proses selesai.');
    return status;
  }
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  return await processImage();
}

async function cekIp(ip) {
    try {
        const response = await fetch(`https://ipinfo.io/${ip}/json`);
        if (!response.ok) {
            throw new Error(`Error fetching data for IP: ${ip}`);
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error("Error:", error.message);
    }
}

async function carbon(text) {
  let Blobs = await fetch("https://carbonara.solopov.dev/api/cook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: text,
    }),
  }).then((response) => response.blob());

  let arrayBuffer = await Blobs.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);

  // Define the path to the temporary folder
  const tmpFolder = path.join(__dirname, '../tmp');
  
  // Ensure the temporary folder exists
  if (!fs.existsSync(tmpFolder)) {
    fs.mkdirSync(tmpFolder);
  }

  // Define the file path where the blob will be saved
  const file = `${uuidv4()}.png`;
  const filePath = path.join(tmpFolder, file); // Change the file extension as needed

  // Write the buffer to a file
  fs.writeFileSync(filePath, buffer);

  return ('https://api.shannmoderz.xyz/tmp/' + file);
}

async function createPaste(title = '', content) {
  const data = new URLSearchParams({
    api_dev_key: "_L_ZkBp7K3aZMY7z4ombPIztLxITOOpD",
    api_paste_name: title,
    api_paste_code: content,
    api_paste_format: "text",
    api_paste_expire_date: "N",
    api_option: "paste"
  });

  try {
    const response = await axios.post("https://pastebin.com/api/api_post.php", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const result = response.data;
    const rawUrl = result.replace(/^(https:\/\/pastebin\.com\/)([a-zA-Z0-9]+)$/, "$1raw/$2");
    if (result) {
      return {
        status: 0,
        original: result,
        raw: rawUrl
      };
    } else {
      return {
        status: 1,
        original: null,
        raw: null
      };
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function uuid() {
  let d = new Date().getTime();
  let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r: (r & 0x3) | 0x8).toString(16);
  });
}

async function obfus(query) {
  return new Promise((resolve, reject) => {
    try {
      const jsobfus = require('javascript-obfuscator')
      const obfuscationResult = jsobfus.obfuscate(query, {
        compact: false,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1
      });
      const result = {
        data: obfuscationResult.getObfuscatedCode()
      }
      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

async function generate(text) {

  var xstr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

  var xput = ['𝗮', '𝗯', '𝗰', '𝗱', '𝗲', '𝗳', '𝗴', '𝗵', '𝗶', '𝗷', '𝗸', '𝗹', '𝗺', '𝗻', '𝗼', '𝗽', '𝗾', '𝗿', '𝘀', '𝘁', '𝘂', '𝘃', '𝘄', '𝘅', '𝘆', '𝘇', '𝟭', '𝟮', '𝟯', '𝟰', '𝟱', '𝟲', '𝟳', '𝟴', '𝟵', '𝟬']

  var replacer = []
  xstr.map((a, b) => replacer.push({
    aseli: a,
    result: xput[b]
  }))
  var str = text.toLowerCase().split('')
  var output = []
  str.map(v => {
    const find = replacer.find(x => x.aseli == v)
    find ? output.push(find.result): output.push(v)
  })
  return output.join('')
}

const models = {
  miku: {
    voice_id: "67aee909-5d4b-11ee-a861-00163e2ac61b", voice_name: "Hatsune Miku"
  },
  nahida: {
    voice_id: "67ae0979-5d4b-11ee-a861-00163e2ac61b", voice_name: "Nahida (Exclusive)"
  },
  nami: {
    voice_id: "67ad95a0-5d4b-11ee-a861-00163e2ac61b", voice_name: "Nami"
  },
  ana: {
    voice_id: "f2ec72cc-110c-11ef-811c-00163e0255ec", voice_name: "Ana(Female)"
  },
  optimus_prime: {
    voice_id: "67ae0f40-5d4b-11ee-a861-00163e2ac61b", voice_name: "Optimus Prime"
  },
  goku: {
    voice_id: "67aed50c-5d4b-11ee-a861-00163e2ac61b", voice_name: "Goku"
  },
  taylor_swift: {
    voice_id: "67ae4751-5d4b-11ee-a861-00163e2ac61b", voice_name: "Taylor Swift"
  },
  elon_musk: {
    voice_id: "67ada61f-5d4b-11ee-a861-00163e2ac61b", voice_name: "Elon Musk"
  },
  mickey_mouse: {
    voice_id: "67ae7d37-5d4b-11ee-a861-00163e2ac61b", voice_name: "Mickey Mouse"
  },
  kendrick_lamar: {
    voice_id: "67add638-5d4b-11ee-a861-00163e2ac61b", voice_name: "Kendrick Lamar"
  },
  angela_adkinsh: {
    voice_id: "d23f2adb-5d1b-11ee-a861-00163e2ac61b", voice_name: "Angela Adkinsh"
  },
  eminem: {
    voice_id: "c82964b9-d093-11ee-bfb7-e86f38d7ec1a", voice_name: "Eminem"
  }
};

async function tts(text) {
  function getInspepek() {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  }

  const InsAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.1.2 Safari/602.3.12",
    "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36"
  ];
  const randomInsAgent = InsAgents[Math.floor(Math.random() * InsAgents.length)];

  const requests = Object.entries(models).map(async ([modelName, {
    voice_id, voice_name
  }]) => {
    const ngeloot = {
      raw_text: text,
      url: "https://filme.imyfone.com/text-to-speech/anime-text-to-speech/",
      product_id: "200054",
      convert_data: [{
        voice_id,
        speed: "1",
        // maksimal 100 wak normal 1
        volume: "50",
        // maksimal 100 normal 50
        text,
        pos: 0
      }]
    };

    const rekuesanu = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'X-Forwarded-For': getInspepek(),
        'User-Agent': randomInsAgent
      },
    };

    try {
      const useanu = await axios.post('https://voxbox-tts-api.imyfone.com/pc/v1/voice/tts', JSON.stringify(ngeloot), rekuesanu);
      const tobrut_milik_ins = useanu.data;
      const {
        channel_id,
        oss_url
      } = tobrut_milik_ins.data.convert_result[0];
      return {
        modelName,
        channel_id,
        oss_url,
        voice_id,
        voice_name
      };
    } catch (error) {
      console.error(`Yah, ada yang salah nih pas nyobain untuk model ${modelName}:`, error);
      return {
        modelName,
        error: `Waduh, kayaknya ada yang gak beres nih untuk model ${modelName}`
      };
    }
  });

  const ceker_babat_punya_ins = await Promise.all(requests);

  const data = ceker_babat_punya_ins.map(({
    modelName, channel_id, oss_url, voice_id, voice_name, error
  }) => {
    if (error) {
      return {
        modelName,
        error
      };
    }
    return {
      channel_id,
      voice_name,
      [modelName]: oss_url,
      voice_id
    };
  });

  return JSON.stringify({
    data
  },
    null,
    2);
}

function TextToBinary(textnya) {
  let burungKuntul = '';

  for (let i = 0; i < textnya.length; i++) {
    let shannz = textnya.charCodeAt(i);
    let sangek = shannz.toString(2);

    while (sangek.length < 8) {
      sangek = '0' + sangek;
    }

    burungKuntul += sangek;
  }

  return burungKuntul;
}

function BinaryToText(codenya) {
  let shannz = '';
  let kontil = [];

  for (let i = 0; i < codenya.length; i += 8) {
    let pepeq = codenya.substring(i, i + 8);
    kontil.push(pepeq);
  }

  for (let i = 0; i < kontil.length; i++) {
    let kiukiu = 0;
    let ewePaksa = 0;

    for (let j = kontil[i].length - 1; j >= 0; j--) {
      if (kontil[i][j] === '1') {
        kiukiu += Math.pow(2, ewePaksa);
      }
      ewePaksa++;
    }

    let char = String.fromCharCode(kiukiu);
    shannz += char;
  }

  return shannz;
}

const siAnjing = {
  'A': '.-',
  'B': '-...',
  'C': '-.-.',
  'D': '-..',
  'E': '.',
  'F': '..-.',
  'G': '--.',
  'H': '....',
  'I': '..',
  'J': '.---',
  'K': '-.-',
  'L': '.-..',
  'M': '--',
  'N': '-.',
  'O': '---',
  'P': '.--.',
  'Q': '--.-',
  'R': '.-.',
  'S': '...',
  'T': '-',
  'U': '..-',
  'V': '...-',
  'W': '.--',
  'X': '-..-',
  'Y': '-.--',
  'Z': '--..',
  'a': '.-',
  'b': '-...',
  'c': '-.-.',
  'd': '-..',
  'e': '.',
  'f': '..-.',
  'g': '--.',
  'h': '....',
  'i': '..',
  'j': '.---',
  'k': '-.-',
  'l': '.-..',
  'm': '--',
  'n': '-.',
  'o': '---',
  'p': '.--.',
  'q': '--.-',
  'r': '.-.',
  's': '...',
  't': '-',
  'u': '..-',
  'v': '...-',
  'w': '.--',
  'x': '-..-',
  'y': '-.--',
  'z': '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  ' ': '/'
};

function textToMorse(text) {
  return text.split('').map(char => siAnjing[char] || '').join(' ');
}

const siKintol = {
  '.-': 'A',
  '-...': 'B',
  '-.-.': 'C',
  '-..': 'D',
  '.': 'E',
  '..-.': 'F',
  '--.': 'G',
  '....': 'H',
  '..': 'I',
  '.---': 'J',
  '-.-': 'K',
  '.-..': 'L',
  '--': 'M',
  '-.': 'N',
  '---': 'O',
  '.--.': 'P',
  '--.-': 'Q',
  '.-.': 'R',
  '...': 'S',
  '-': 'T',
  '..-': 'U',
  '...-': 'V',
  '.--': 'W',
  '-..-': 'X',
  '-.--': 'Y',
  '--..': 'Z',
  '-----': '0',
  '.----': '1',
  '..---': '2',
  '...--': '3',
  '....-': '4',
  '.....': '5',
  '-....': '6',
  '--...': '7',
  '---..': '8',
  '----.': '9',
  '/': ' '
};

function morseToText(morse, hurufGede = false) {
  const puqimakk = morse.split(' ').map(code => siKintol[code] || '').join('');
  return hurufGede ? puqimakk: puqimakk.toLowerCase();
}

async function generateQRCode(link) {
  try {
    const url = await QRCode.toDataURL(link);
    return url;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function base64ToImage(base64String, outputPath) {
  const base64Data = base64String.replace(/^data:image\/png;base64,/, "");

  fs.writeFileSync(outputPath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Gagal menyimpan gambar:', err);
      return null;
    }
  });

  return outputPath;
}

const TelegraPH = async (Path) =>
new Promise(async (resolve, reject) => {
  if (!fs.existsSync(Path)) return reject(new Error("File not Found"));
  try {
    const form = new BodyForm();
    form.append("file", fs.createReadStream(Path));
    const data = await axios({
      url: "https://telegra.ph/upload",
      method: "POST",
      headers: {
        ...form.getHeaders(),
      },
      data: form,
    });
    return resolve("https://telegra.ph" + data.data[0].src);
  } catch (err) {
    return reject(new Error(String(err)));
  }
});

async function generateAndUploadQRCode(link) {
  const qrCodeBase64 = await generateQRCode(link);
  if (qrCodeBase64) {
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }
    const outputPath = path.join(tmpDir, 'qrcode.png');
    const savedImagePath = base64ToImage(qrCodeBase64, outputPath);
    if (savedImagePath) {
      try {
        const telegraLink = await TelegraPH(savedImagePath);
        fs.unlinkSync(savedImagePath);
        return telegraLink;
      } catch (err) {
        console.error('Gagal mengunggah gambar ke Telegra.ph:', err);
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

async function readQRCodeFromLink(imageUrl) {
  try {
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'arraybuffer'
    });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const image = await Jimp.read(imageBuffer);
    const qr = new QrCodeReader();

    return new Promise((resolve, reject) => {
      qr.callback = (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value.result);
        }
      };
      qr.decode(image.bitmap);
    });
  } catch (err) {
    console.error('Gagal membaca QR Code dari link gambar:',
      err);
    return null;
  }
}

function textToHex(text) {
  return text.split('').map(char => char.charCodeAt(0).toString(16)).join(' ');
}

function hexToText(hex) { 
  return hex.split(' ').map(hexChar => String.fromCharCode(parseInt(hexChar, 16))).join('');
}

async function removebg(imageUrl) {
  try {
    if (!imageUrl) return { status: false, message: "URL gambar tidak diberikan" };

    // Mengunduh gambar dari URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const image = buffer.toString("base64");

    return await new Promise((resolve, reject) => {
      axios.post("https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto", {
        image: `data:image/png;base64,${image}`,
        model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003"
      }).then(res => {
        const data = res.data?.replace(`"`, "");
        console.log(res.status, data);
        if (!data) return reject("failed removebg image");
        resolve({
          status: true,
          image: data
        });
      }).catch(reject);
    });
  } catch (e) {
    return { status: false, message: e.toString() };
  }
}

module.exports = {
  imgLarger, cekIp, carbon, removebg, tts, textToHex, hexToText, readQRCodeFromLink, generateAndUploadQRCode, morseToText, textToMorse, BinaryToText, TextToBinary, uuid, obfus, createPaste, generate
};
