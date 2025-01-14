const cheerio = require("cheerio");
const axios = require('axios')
const path = require('path')
const FormData = require('form-data');

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
		            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		            step((generator = generator.apply(thisArg, _arguments || [])).next());
		        });
};
	async function spotifydl(url) {
		    return __awaiter(this, void 0, void 0, function* () {
			            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
					                try {
								                const a = cheerio.load((yield axios.get("https://spotifymate.com/en", {
											                    headers: {
														                            cookie: "session_data=o8079end5j9oslm5a7bou84rqc;",
														                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
														                        },
											                })).data);
								                const b = {
											                    name: a("form#get_video").find('input[type="hidden"]').attr("name") || "",
											                    value: a("form#get_video").find('input[type="hidden"]').attr("value") || "",
											                };
								                const d = new FormData();
								                d.append("url", url);
								                d.append(b.name, b.value);
								                let s = yield axios.post("https://spotifymate.com/action", d, {
											                    headers: Object.assign(Object.assign({ origin: "https://spotifymate.com/en" }, d.getHeaders()), { cookie: "session_data=o8079end5j9oslm5a7bou84rqc;", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36" }),
											                });
								                if (s.statusText !== "OK")
									                    return reject("Fail Fetching");
								                const c = cheerio.load(s.data);
								                const e = {
											                    title: c(".dlvideos").find('h3[itemprop="name"]').text().trim(),
											                    author: c(".dlvideos")
											                        .find(".spotifymate-downloader-middle > p > span")
											                        .text()
											                        .trim(),
											                    thumbnail: c(".dlvideos").find("img").attr("src") || "",
											                    cover: c(".dlvideos")
											                        .find(".spotifymate-downloader-right")
											                        .find("#none")
											                        .eq(1)
											                        .find("a")
											                        .attr("href") ||
											                        c(".dlvideos")
											                            .find(".spotifymate-downloader-right")
											                            .find("#pop")
											                            .eq(1)
											                            .find("a")
											                            .attr("href") ||
											                        "",
											                    music: c(".dlvideos")
											                        .find(".spotifymate-downloader-right")
											                        .find("#none")
											                        .eq(0)
											                        .find("a")
											                        .attr("href") ||
											                        c(".dlvideos")
											                            .find(".spotifymate-downloader-right")
											                            .find("#pop")
											                            .eq(0)
											                            .find("a")
											                            .attr("href") ||
											                        "",
											                    link: url,
											                };
								                resolve(e);
								            }
					                catch (e) {
								                reject(e);
								            }
					            }));
			        });
	}

async function cobalt(
  url,
  options = {
    audio: false,
    aFormat: "mp3",
    vCodec: "standar",
    vReso: "720p",
    mute: false,
  }
) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!url) return reject("Insert URL!");

      // ? OPTIONS
      let { audio, aFormat, vCodec, vReso, mute } = options;

      const prop = {};
      const data = {
        url: url,
        filenamePattern: "pretty",
      };

      // ? AUDIO
      if (audio) {
        const aFRegex = /best|mp3|ogg|wav|opus/gi;
        if (!aFormat) aFormat = "mp3";
        if (!aFRegex.test(aFormat)) aFormat = "mp3";
        data.isAudioOnly = true;
        data.aFormat = aFormat;
        prop.type = "audio";
        prop.mtype = aFormat;
      }

      // ? VIDEO
      else {
        // ? REGEXP
        const vCRegex = /standar|high|medium/gi;
        const vRRegex =
          /max|8k\+?|4k|1440p?|1080p?|720p?|480p?|360p?|240p?|144p?/gi;

        // ? IF
        if (!vReso) vReso = "720p";
        if (!vCodec) vCodec = "standar";
        if (!vCRegex.test(vCRegex)) vCodec = "standar";
        if (!vRRegex.test(vReso)) vReso = "720p";
        if (!mute) mute = false;

        // ? QUALITY
        if (vReso === "8k+") vReso = "max";

        // ? CODEC
        switch (vCodec) {
          case "standar": {
            vCodec = "h246";
            break;
          }
          case "high": {
            vCodec = "av1";
            break;
          }
          case "medium": {
            vCodec = "vp9";
            break;
          }
          default: {
            vCodec: "h246";
            break;
          }
        }

        data.vCodec = vCodec;
        data.vQuality = vReso;
        data.isAudioOnly = false;
        data.isAudioMuted = mute;
        prop.type = "video";
        prop.hd = /max|8k+?|4k|1440p?/gi.test(vReso);
        prop.quality = vReso === "max" ? "8k+" : vReso;
        prop.codec = vCodec;
        prop.isMuted = mute;
      }

      // ? FETCHING
      const BASE_URL = "https://cobalt.tools";
      const BASE_API = "https://api.cobalt.tools/api";
      await fetch(BASE_API + "/json", {
        method: "OPTIONS",
        headers: {
          "access-control-request-method": "POST",
          "access-control-request-headers": "content-type",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          origin: BASE_URL,
          referer: BASE_URL,
        },
      }).then(async () => {
        const res = await fetch(BASE_API + "/json", {
          method: "POST",
          headers: {
            origin: BASE_URL,
            referer: BASE_URL,
            "user-agent": BASE_URL,
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(data),
        }).then((v) => v.json());

        return resolve({ ...res, ...prop });
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function pinterest(text, limit= 30) {
  try {
    const url = `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(text)}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${encodeURIComponent(text)}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=${Date.now()}`;

    const { data } = await axios.get(url);
    
    const imageUrls = data.resource_response.data.results
      .map(result => result.images.orig.url)
      .slice(0, limit);

    return { images: imageUrls };
  } catch (error) {
    console.error('Error in functionPin:', error);
    throw new Error('Terjadi kesalahan saat mencari gambar Pinterest.');
  }
}

async function capcut(url) {
  try {
    const response = await axios.post("https://api.teknogram.id/v1/capcut", {
      url
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function tiktoks(query) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      },
      data: {
        keywords: query,
        count: 10,
        cursor: 0,
        HD: 1
      }
    });

    const videos = response.data.data.videos;
    if (videos.length === 0) {
      throw new Error("Tidak ada video ditemukan.");
    } else {
      const gywee = Math.floor(Math.random() * videos.length);
      const videorndm = videos[gywee];

      const result = {
        title: videorndm.title,
        cover: videorndm.cover,
        origin_cover: videorndm.origin_cover,
        no_watermark: videorndm.play,
        watermark: videorndm.wmplay,
        music: videorndm.music
      };
      return result;
    }
  } catch (error) {
    throw error;
  }
}

async function tiktok(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.set("url", query);
      encodedParams.set("hd", "1");

      const response = await axios({
        method: "POST",
        url: "https://tikwm.com/api/",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: "current_language=en",
          "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
        data: encodedParams,
      });
      const videos = response.data;
      resolve(videos);
    } catch (error) {
      reject(error);
    }
  });
}


async function tiktokStalk(user) {
  try {
    const url = await fetch(`https://tiktok.com/@${user}`, {
      headers: {
        'User-Agent': 'PostmanRuntime/7.32.2'
      }
    });
    const html = await url.text();
    const $ = cheerio.load(html);
    const data = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text();
    const result = JSON.parse(data);
    if (result['__DEFAULT_SCOPE__']['webapp.user-detail'].statusCode !== 0) {
      const ress = {
        status: 'error',
        message: 'User not found!',
      };
      console.log(ress);
      return ress;
    }
    const res = result['__DEFAULT_SCOPE__']['webapp.user-detail']['userInfo'];
    return res;
  } catch (err) {
    console.log(err);
    return String(err);
  }
}

async function snack(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(url).then((v) => v.text());
      const $ = cheerio.load(res);
      const video = $("div.video-box").find("a-video-player");
      const author = $("div.author-info");
      const attr = $("div.action");
      const data = {
        title: $(author)
        .find("div.author-desc > span")
        .children("span")
        .eq(0)
        .text()
        .trim(),
        thumbnail: $(video)
        .parent()
        .siblings("div.background-mask")
        .children("img")
        .attr("src"),
        media: $(video).attr("src"),
        author: $("div.author-name").text().trim(),
        authorImage: $(attr).find("div.avatar > img").attr("src"),
        like: $(attr).find("div.common").eq(0).text().trim(),
        comment: $(attr).find("div.common").eq(1).text().trim(),
        share: $(attr).find("div.common").eq(2).text().trim(),
      };
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

async function mediafire(url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!/mediafire\.com\/file\//gi.test(url)) return reject("Invalid URL");
      const res = await fetch(url).then((v) => v.text());
      const $ = cheerio.load(res);
      const button = $("body").find(".dl-btn-cont");
      const dlinfo = $("body").find(".dl-info");
      resolve({
        name: $(button).find("div.dl-btn-label").text().trim(),
        filename: $(button).find("div.dl-btn-label").attr("title"),
        type: path.extname($(button).find("div.dl-btn-label").attr("title")),
        size: $(dlinfo)
        .find("ul.details")
        .find("li > span")
        .eq(0)
        .text()
        .trim(),
        created:
        new Date(
          $(dlinfo).find("ul.details").find("li > span").eq(1).text().trim()
        ) - 1,
        descHeader: $(dlinfo).find("div.description > p").eq(0).text().trim(),
        desc: $(dlinfo).find("div.description > p").eq(1).text().trim(),
        media: $(button).find("a.popsok").attr("href"),
        link: url,
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function PinterestDL(pinterestUrl) {
  try {
    const response = await axios.get(`https://www.savepin.app/download.php?url=${encodeURIComponent(pinterestUrl)}&lang=en&type=redirect`);

    const $ = cheerio.load(response.data);

    const thumbUrl = $('figure.media-left img').attr('src');
    const title = $('div.media-content strong').text().trim() || 'No title available';

    const details = [];

    $('tbody tr').each((i, element) => {
      const quality = $(element).find('td').eq(0).text().trim();
      const format = $(element).find('td').eq(1).text().trim().toLowerCase();
      const url = 'https://www.savepin.app/' + $(element).find('a').attr('href');

      if (format === 'jpg' || format === 'png' || format === 'jpeg') {
        details.push({
          image: {
            url,
            quality
          }
        });
      } else if (format === 'mp4') {
        details.push({
          video: {
            url,
            quality
          }
        });
      }
    });

    if (!thumbUrl || details.length === 0) {
      throw new Error('Unable to retrieve all required data.');
    }

    return JSON.stringify({
      title,
      thumb: thumbUrl,
      details
    }, null, 2);
  } catch (error) {
    console.error('Error occurred:', error);
    return null;
  }
}

async function drive(url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!/drive\.google\.com\/file\/d\//gi.test(url))
        return reject("Invalid URL");
      const res = await fetch(url).then((v) => v.text());
      const $ = cheerio.load(res);
      const id = url.split("/")[5];
      const data = {
        name: $("head").find("title").text().split("-")[0].trim(),
        download: `https://drive.usercontent.google.com/uc?id=${id}&export=download`,
        link: url,
      };

      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

async function videy(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const videoSrc = $('source[type="video/mp4"]').attr('src');
    return videoSrc;
  } catch (error) {
    console.error(`Error fetching the URL: ${error.message}`);
  }
}

async function douyinINS(videonganu) {
  const url = 'https://tikvideo.app/api/ajaxSearch';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': '*/*',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Referer': 'https://tikvideo.app/id/download-douyin-video',
  };
  const data = new URLSearchParams();
  data.append('q',
    videonganu);
  data.append('lang',
    'id');

  try {
    const NganuINS = await axios.post(url,
      data,
      {
        headers
      });
    const NganuINSData = NganuINS.data;

    const videoNganu = NganuINSData.data.match(/href="(.*?)"/)[1];
    const audionganu = NganuINSData.data.match(/href="(.*?)"/g)[1].match(/"(.*)"/)[1];
    const description = NganuINSData.data.match(/<h3>(.*?)<\/h3>/)[1];
    const videonganu = NganuINSData.data.match(/href="(.*?)"/g)[0].match(/"(.*)"/)[1];
    const stickernganu = NganuINSData.data.match(/<img src="(.*?)"/)[1];

    const result = {
      description: description,
      "Video_HD": videoNganu,
      "Video": videonganu,
      "Audio": audionganu,
      "Sticker": stickernganu
    };

    return JSON.stringify(result,
      null,
      2);
  } catch (error) {
    throw new Error(error);
  }
}

async function tikSlide(url) {
  try {
    const response = await axios.post(
      'https://ttsave.app/download',
      {
        query: url,
        language_id: '2'
      },
      {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      }
    )

    const html = response.data
    const $ = cheerio.load(html)

    const uniqueId = $('#unique-id').val()
    const username = $('h2.font-extrabold.text-xl.text-center').text()
    const thumbnail = $('a[target="_blank"]').attr('href')
    const profile = $('img.h-24.w-34.rounded-full').attr('src')
    const description = $('p.text-gray-600.px-2.text-center.break-all.w-3/4.oneliner').text()

    const stats = {
      views: $('svg.h-5.w-5.text-gray-500 + span').text(),
      likes: $('svg.h-5.w-5.text-red-500 + span').text(),
      comments: $('svg.h-5.w-5.text-green-500 + span').text(),
      shares: $('svg.h-5.w-5.text-yellow-500 + span').text(),
      downloads: $('svg.h-5.w-5.text-blue-500 + span').text()
    }

    const download = []
    $('a[onclick="bdl(this, event)"]').each((i, elem) => {
      const link = $(elem).attr('href')
      const type = $(elem).attr('type')
      const title = $(elem).text().trim()
      download.push({
        link, type, title
      })
    })

    return {
      uniqueId,
      username,
      thumbnail,
      profile,
      description,
      stats,
      download,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function ytMusic(url_nganu) {
  try {
    const Kebakaran = `https://cdn36.savetube.me/info?url=${encodeURIComponent(url_nganu)}`;
    const ngloot = await axios.get(Kebakaran);

    if (!ngloot.data || !ngloot.data.data || !ngloot.data.data.audio_formats) {
      throw new Error('Gagal nggawe daptar format audio');
    }

    const key = ngloot.data.data.key;

    const pecel_lele = `https://cdn34.savetube.me/download/audio/128/${key}`;
    const pencuri_matiae = await axios.get(pecel_lele);

    if (!pencuri_matiae.data || !pencuri_matiae.data.data || !pencuri_matiae.data.data.downloadUrl) {
      throw new Error('Gagal nggawe daptar URL dhuwit');
    }

    return pencuri_matiae.data.data.downloadUrl;
  } catch (error) {
    console.error('Kesalahan:', error.message);
    return null;
  }
}

async function downloadFromTwitter(id) {
    try {
        const url = 'https://ssstwitter.com';
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const form = $('form.pure-form.pure-g.hide-after-request');
        const includeVals = form.attr('include-vals');
        const ttMatch = includeVals.match(/tt:'([^']+)'/);
        const tsMatch = includeVals.match(/ts:(\d+)/);

        if (!ttMatch || !tsMatch) throw new Error('Cannot find tt or ts values.');

        const tt = ttMatch[1];
        const ts = tsMatch[1];

        const postData = new URLSearchParams({
            tt: tt,
            ts: ts,
            source: 'form',
            id: id,
            locale: 'en'
        });

        const postResponse = await axios.post(url, postData.toString(), {
            headers: {
                'HX-Request': 'true',
                'HX-Target': 'target',
                'HX-Current-URL': 'https://ssstwitter.com/en',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://ssstwitter.com/result_normal'
            }
        });

        const $result = cheerio.load(postResponse.data);
        const downloads = [];
        $result('.result_overlay a.download_link').each((i, element) => {
            const text = $(element).text().trim();
            const url = $(element).attr('href');
            if (url) {
                downloads.push({ text, url });
            }
        });

        const data = {
            title: $result('.result_overlay h2').text().trim(),
            downloads: downloads
        };

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function githubRepoStalk(repoUrl) {
  try {
    // Regex untuk mengekstrak owner dan repo dari URL GitHub
    const regex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?$/;
    const match = repoUrl.match(regex);

    if (!match) {
      throw new Error('URL repositori tidak valid');
    }

    const [, owner, repo] = match;

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      name: data.name,
      stars: data.stargazers_count,
      watchers: data.watchers_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      zipUrl: `https://api.github.com/repos/${owner}/${repo}/zipball`,
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

function Mp3(url) {
  return new Promise((resolve, reject) => {
    let title, image;

    const getDownloadId = () => {
      return fetch(`https://ab.cococococ.com/ajax/download.php?copyright=0&format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`)
        .then(response => response.json());
    };

    const checkProgress = (id) => {
      return fetch(`https://p.oceansaver.in/ajax/progress.php?id=${id}`)
        .then(response => response.json());
    };

    const pollProgress = (id) => {
      checkProgress(id).then(data => {
        if (data.progress === 1000) {
          resolve({
            type: 'mp3 (128 kbps)',
            title: title,
            image: image,
            download_url: data.download_url
          });
        } else {
          setTimeout(() => pollProgress(id), 1000);
        }
      }).catch(reject);
    };

    getDownloadId()
      .then(data => {
        if (data.success && data.id) {
          title = data.info.title;
          image = data.info.image;
          pollProgress(data.id);
        } else {
          reject(new Error('Gagal mendapatkan ID unduhan'));
        }
      })
      .catch(reject);
  });
}

function Mp4(url) {
  return new Promise((resolve, reject) => {
    let title, image;

    const getDownloadId = () => {
      return fetch(`https://ab.cococococ.com/ajax/download.php?copyright=0&format=360&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`)
        .then(response => response.json());
    };

    const checkProgress = (id) => {
      return fetch(`https://p.oceansaver.in/ajax/progress.php?id=${id}`)
        .then(response => response.json());
    };

    const pollProgress = (id) => {
      checkProgress(id).then(data => {
        if (data.progress === 1000) {
          resolve({
            type: 'mp4 (360p)',
            title: title,
            image: image,
            download_url: data.download_url
          });
        } else {
          setTimeout(() => pollProgress(id), 1000);
        }
      }).catch(reject);
    };

    getDownloadId()
      .then(data => {
        if (data.success && data.id) {
          title = data.info.title;
          image = data.info.image;
          pollProgress(data.id);
        } else {
          reject(new Error('Gagal mendapatkan ID unduhan'));
        }
      })
      .catch(reject);
  });
}

const url = 'https://api.zeemo.ai/hy-caption-front/api/v1/video-download/yt-dlp-video-info';
const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'User-Agent': 'Postify/1.0.0'
};

async function yt(videoUrl) {
    return axios.post(url, { url: videoUrl, videoSource: 3 }, { headers: headers })
        .then(response => {
            const data = response.data;
            return data.success ? data : Promise.reject(`❎ Download dibatalkan karena: ${data.message}`);
        })
        .catch(error => {
            console.error('❎ Error:', error.response ? error.response.data : error.message);
            throw new Error('❎ Gagal terhubung ke API Zeemo AI.');
        });
}

module.exports = {
  tiktok,
  ytMusic,
  douyinINS,
  tiktokStalk,
  tikSlide,
  tiktoks,
  capcut,
  pinterest,
  snack,
  mediafire,
  PinterestDL,
  drive,
  videy,
  downloadFromTwitter,
  githubRepoStalk,
  Mp3,
  Mp4,
  yt,
  cobalt,
  spotifydl,
};
