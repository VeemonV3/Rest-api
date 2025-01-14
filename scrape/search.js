const axios = require('axios');
const cheerio = require('cheerio');

const APIs = {
  1: "https://apkcombo.com",
  5: "http://ws75.aptoide.com/api/7",
};
const Proxy = (url) =>
url
? `https://translate.google.com/translate?sl=en&tl=fr&hl=en&u=${encodeURIComponent(url)}&client=webapp`: "";
const api = (ID, path = "/", query = {}) =>
(ID in APIs ? APIs[ID]: ID) +
path +
(query
  ? "?" +
  new URLSearchParams(
    Object.entries({
      ...query,
    }),
  ): "");

const tools = {
  APIs,
  Proxy,
  api,
};

let apkcombo = {
  search: async function (args) {
    let res = await fetch(
      tools.Proxy(
        tools.api(1, "/search/" + encodeURIComponent(args.replace(" ", "-"))),
      ),
    );
    let ress = [];
    res = await res.text();
    let $ = cheerio.load(res);
    let link = [];
    let name = [];
    $("div.content-apps > a").each(function (a, b) {
      let nem = $(b).attr("title");
      name.push(nem);
      link.push(
        $(b)
        .attr("href")
        .replace(
          "https://apkcombo-com.translate.goog/",
          "https://apkcombo.com/",
        )
        .replace("/?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp", ""),
      );
    });
    for (var i = 0; i < (name.length || link.length); i++) {
      ress.push({
        name: name[i],
        link: link[i],
      });
    }
    return ress;
  },
}

let aptoide = {
  search: async function (args) {
    let res = await fetch(
      tools.api(5, "/apps/search", {
        query: args,
        limit: 1000,
      }),
    );

    let ress = {};
    res = await res.json();
    ress = res.datalist.list.map((v) => {
      return {
        name: v.name,
        id: v.package,
      };
    });
    return ress;
  },
  download: async function (id) {
    let res = await fetch(
      tools.api(5, "/apps/search", {
        query: id,
        limit: 1,
      }),
    );

    res = await res.json();
    return {
      img: res.datalist.list[0].icon,
      developer: res.datalist.list[0].store.name,
      appname: res.datalist.list[0].name,
      link: res.datalist.list[0].file.path,
    };
  },
};

async function sklh(q) {
  const url = 'https://api-sekolah-indonesia.vercel.app/sekolah/s?sekolah='
  let c = await axios.get(url + q)
  let b = c.data
  return b
}

function PlayStore(search) {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        data, status
      } = await axios.get(`https://play.google.com/store/search?q=${search}&c=apps`)
      const hasil = []
      const $ = cheerio.load(data)
      $('.ULeU3b > .VfPpkd-WsjYwc.VfPpkd-WsjYwc-OWXEXe-INsAgc.KC1dQ.Usd1Ac.AaN0Dd.Y8RQXd > .VfPpkd-aGsRMb > .VfPpkd-EScbFb-JIbuQc.TAQqTe > a').each((i, u) => {
        const linkk = $(u).attr('href')
        const nama = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .DdYX5').text()
        const developer = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .wMUdtb').text()
        const img = $(u).find('.j2FCNc > img').attr('src')
        const rate = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div').attr('aria-label')
        const rate2 = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div > span.w2kbF').text()
        const link = `https://play.google.com${linkk}`

        hasil.push({
          link: link,
          nama: nama ? nama: 'No name',
          developer: developer ? developer: 'No Developer',
          img: img ? img: 'https://i.ibb.co/G7CrCwN/404.png',
          rate: rate ? rate: 'No Rate',
          rate2: rate2 ? rate2: 'No Rate',
          link_dev: `https://play.google.com/store/apps/developer?id=${developer.split(" ").join('+')}`
        })
      })
      if (hasil.every(x => x === undefined)) return resolve({
        message: 'Tidak ada result!'
      })
      resolve(hasil)
    } catch (err) {
      console.error(err)
    }
  })
}

function BukaLapak(search) {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        data
      } = await axios.get(`https://www.bukalapak.com/products?from=omnisearch&from_keyword_history=false&search[keywords]=${search}&search_source=omnisearch_keyword&source=navbar`, {
          headers: {
            "user-agent": 'Mozilla/ 5.0(Windows NT 10.0; Win64; x64; rv: 108.0) Gecko / 20100101 Firefox / 108.0'
          }
        })
      const $ = cheerio.load(data);
      const dat = [];
      const b = $('a.slide > img').attr('src');
      $('div.bl-flex-item.mb-8').each((i, u) => {
        const a = $(u).find('observer-tracker > div > div');
        const img = $(a).find('div > a > img').attr('src');
        if (typeof img === 'undefined') return

        const link = $(a).find('.bl-thumbnail--slider > div > a').attr('href');
        const title = $(a).find('.bl-product-card__description-name > p > a').text().trim();
        const harga = $(a).find('div.bl-product-card__description-price > p').text().trim();
        const rating = $(a).find('div.bl-product-card__description-rating > p').text().trim();
        const terjual = $(a).find('div.bl-product-card__description-rating-and-sold > p').text().trim();

        const dari = $(a).find('div.bl-product-card__description-store > span:nth-child(1)').text().trim();
        const seller = $(a).find('div.bl-product-card__description-store > span > a').text().trim();
        const link_sel = $(a).find('div.bl-product-card__description-store > span > a').attr('href');

        const res_ = {
          title: title,
          rating: rating ? rating: 'No rating yet',
          terjual: terjual ? terjual: 'Not yet bought',
          harga: harga,
          image: img,
          link: link,
          store: {
            lokasi: dari,
            nama: seller,
            link: link_sel
          }
        };

        dat.push(res_);
      })
      if (dat.every(x => x === undefined)) return resolve({
        message: 'Tidak ada result!'
      })
      resolve(dat)
    } catch (err) {
      console.error(err)
    }
  })
}

async function happymod(query) {
  try {
    const res = await axios.get("https://unduh.happymod.com/search.html?q=" + query);
    const html = res.data;
    const $ = cheerio.load(html);
    const data = [];
    $('article.flex-item').each((index, element) => {
      const appName = $(element).find('h2.has-normal-font-size.no-margin.no-padding.truncate').text().trim();
      const appVersion = $(element).find('div.has-small-font-size.truncate').first().text().trim();
      const appUrl = $(element).find('a.app.clickable').attr('href');

      if (appName && appVersion && appUrl) {
        data.push({
          name: appName,
          version: appVersion,
          url: "https://unduh.happymod.com/"+appUrl
        });
      }
    });
    return {
      status: true,
      data
    }
  } catch (error) {
    return {
      status: false,
      message: "permintaan tidak dapat diproses!!"
    }
  }
}

async function stickersearch(query) {
  return new Promise((resolve) => {
    axios.get(`https://getstickerpack.com/stickers?query=${query}`).then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const link = [];
      $('#stickerPacks > div > div:nth-child(3) > div > a').each(function(a, b) {
        link.push($(b).attr('href'))
      })
      let rand = link[Math.floor(Math.random() * link.length)]
      axios.get(rand).then(({
        data
      }) => {
        const $$ = cheerio.load(data)
        const url = [];
        $$('#stickerPack > div > div.row > div > img').each(function(a, b) {
          url.push($$(b).attr('src').split('&d=')[0])
        })
        resolve({
          title: $$('#intro > div > div > h1').text(),
          author: $$('#intro > div > div > h5 > a').text(),
          author_link: $$('#intro > div > div > h5 > a').attr('href'),
          sticker: url
        })
      })
    })
  })
}

async function webtoons(query) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.webtoons.com/id/search?keyword=${query}`)
    .then((data) => {
      const $ = cheerio.load(data.data)
      const judul = [];
      const genre = [];
      const author = [];
      const link = [];
      const likes = [];
      const format = [];
      $('#content > div > ul > li > a > div > p.subj').each(function(a, b) {
        deta = $(b).text();
        judul.push(deta)
      })
      $('div > ul > li > a > span').each(function(a, b) {
        deta = $(b).text();
        genre.push(deta)
      })
      $('div > ul > li > a > div > p.author').each(function(a, b) {
        deta = $(b).text();
        author.push(deta)
      })
      $('div > ul > li > a > div > p.grade_area > em').each(function(a, b) {
        deta = $(b).text();
        likes.push(deta)
      })
      $('#content > div > ul > li > a').each(function(a, b) {
        link.push($(b).attr('href'))
      })
      for (let i = 0; i < judul.length; i++) {
        format.push({
          judul: judul[i],
          genre: genre[i],
          author: author[i],
          likes: likes[i],
          link: link[i]
        })
      }
      if (likes == '') {
        resolve({
          status: `${query} tidak dapat ditemukan/error`
        })
      } else {
        resolve(format)
      }
    })
    .catch(reject)
  })
}

async function resep(query) {
  return new Promise(async (resolve,
    reject) => {
    axios.get('https://resepkoki.id/?s=' + query)
    .then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const link = [];
      const judul = [];
      const upload_date = [];
      const format = [];
      const thumb = [];
      $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-media > a').each(function(a, b) {
        link.push($(b).attr('href'))
      })
      $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-content > header > h3 > a').each(function(c, d) {
        jud = $(d).text();
        judul.push(jud)
      })
      for (let i = 0; i < link.length; i++) {
        format.push({
          judul: judul[i],
          link: link[i]
        })
      }
      const result = {
        data: format
      }
      resolve(result)
    })
    .catch(reject)
  })
}

async function gore(query) {
  return new Promise(async (resolve,
    reject) => {
    axios.get('https://seegore.com/?s=' + query).then(dataa => {
      const $$$ = cheerio.load(dataa)
      pagina = $$$('#main > div.container.main-container > div > div.bb-col.col-content > div > div > div > div > nav > ul > li:nth-child(4) > a').text();
      rand = Math.floor(Math.random() * pagina) + 1
      if (rand === 1) {
        slink = 'https://seegore.com/?s=' + query
      } else {
        slink = `https://seegore.com/page/${rand}/?s=${query}`
      }
      axios.get(slink)
      .then(({
        data
      }) => {
        const $ = cheerio.load(data)
        const link = [];
        const judul = [];
        const uploader = [];
        const format = [];
        const thumb = [];
        $('#post-items > li > article > div.content > header > h2 > a').each(function(a, b) {
          link.push($(b).attr('href'))
        })
        $('#post-items > li > article > div.content > header > h2 > a').each(function(c, d) {
          jud = $(d).text();
          judul.push(jud)
        })
        $('#post-items > li > article > div.content > header > div > div.bb-cat-links > a').each(function(e, f) {
          upl = $(f).text();
          uploader.push(upl)
        })
        $('#post-items > li > article > div.post-thumbnail > a > div > img').each(function(g, h) {
          thumb.push($(h).attr('src'))
        })
        for (let i = 0; i < link.length; i++) {
          format.push({
            judul: judul[i],
            uploader: uploader[i],
            thumb: thumb[i],
            link: link[i]
          })
        }
        const result = {
          data: format
        }
        resolve(result)
      })
      .catch(reject)
    })
  })
}

async function mangatoon(search) {
  if (!search) return "No Querry Input! Bakaa >\/\/<";
  try {
    const res = await axios.get(`https://mangatoon.mobi/en/search?word=${search}`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36"
      }
    });
    const hasil = [];
    const $ = cheerio.load(res.data);
    $('div.recommend-item').each(function(a, b) {
      let comic_name = $(b).find('div.recommend-comics-title > span').text();
      let comic_type = $(b).find('div.comics-type > span').text().slice(1).split(/ /g).join("");
      let comic_url = $(b).find('a').attr('href');
      const result = {
        comic_name,
        comic_type,
        comic_url: 'https://mangatoon.mobi' + comic_url
      };
      hasil.push(result);
    });
    let filt = hasil.filter(v => v.comic_name !== undefined && v.comic_type !== undefined);
    return filt;
  } catch (eror404) {
    return "=> Error =>" + eror404;
  }
}

function android1(query) {
  return new Promise((resolve, reject) => {
    axios.get('https://an1.com/tags/MOD/?story=' + query + '&do=search&subaction=search')
    .then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const nama = [];
      const link = [];
      const rating = [];
      const thumb = [];
      const developer = [];
      const format = [];
      $('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.name > a > span').each(function(a, b) {
        nem = $(b).text();
        nama.push(nem)
      })
      $('div > ul > li.current-rating').each(function(c, d) {
        rat = $(d).text();
        rating.push(rat)
      })
      $('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.developer.xsmf.muted').each(function(e, f) {
        dev = $(f).text();
        developer.push(dev)
      })
      $('body > div.page > div > div > div.app_list > div > div > div.img > img').each(function(g, h) {
        thumb.push($(h).attr('src'))
      })
      $('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.name > a').each(function(i, j) {
        link.push($(j).attr('href'))
      })
      for (let i = 0; i < link.length; i++) {
        format.push({
          judul: nama[i],
          dev: developer[i],
          rating: rating[i],
          thumb: thumb[i],
          link: link[i]
        })
      }
      const result = {
        data: format
      }
      resolve(result)
    })
    .catch(reject)
  })
}

function wattpad(query) {
  return new Promise((resolve,
    reject) => {
    axios.get('https://www.wattpad.com/search/' + query)
    .then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const result = [];
      const linkk = [];
      const judull = [];
      const thumb = [];
      const dibaca = [];
      const vote = [];
      const bab = [];
      $('ul.list-group > li.list-group-item').each(function(a, b) {
        linkk.push('https://www.wattpad.com' + $(b).find('a').attr('href'))
        thumb.push($(b).find('img').attr('src'))
      })
      $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(1) > div.icon-container > div > span.stats-value').each(function(e, f) {
        baca = $(f).text();
        dibaca.push(baca)
      })
      $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(2) > div.icon-container > div > span.stats-value').each(function(g, h) {
        vot = $(h).text();
        vote.push(vot)
      })
      $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(3) > div.icon-container > div > span.stats-value').each(function(i, j) {
        bb = $(j).text();
        bab.push(bb)
      })
      $('div.story-card-data.hidden-xxs > div.story-info > div.title').each(function(c, d) {
        titel = $(d).text();
        judull.push(titel)
      })
      for (let i = 0; i < linkk.length; i++) {
        if (!judull[i] == '') {
          result.push({
            judul: judull[i],
            dibaca: dibaca[i],
            divote: vote[i],
            thumb: thumb[i],
            link: linkk[i]
          })
        }
      }
      resolve(result)
    })
    .catch(reject)
  })
}

async function mlbb(userId, zoneId) {
  try {
    const response = await axios.post('https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store', {
      productId: 1,
      itemId: 66,
      product_ref: 'REG',
      product_ref_denom: 'REG',
      catalogId: 121,
      paymentId: 6361,
      gameId: userId,
      zoneId: zoneId
    }, {
      'Accept-Language': 'id',
      'x-device': 'c8ddbfa5-1e57-4cf3-9450-0b39fa3eb4f2',
      'Ciam-Type': 'FR',
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
      'Referer': 'https://duniagames.co.id/top-up/item/mobile-legends'
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

function wallpaper(query, page = '1') {
  return new Promise(function(resolve,
    reject) {
    let linknya = `https://www.besthdwallpaper.com/search?${page === '1'? 'CurrentPage=1&q=': 'q='}${query}${page !== '1'? '&CurrentPage='+page: ''}`
    fetch(linknya)
    .then(function(res) {
      return Promise.resolve(res.text())
    })
    .then(function(data) {
      let $ = cheerio.load(data)
      let results = []
      $('div.grid-item').each(function (a, b) {
        results.push({
          type: $(b).find('div.info > a:nth-child(2)').text(),
          source: `https://www.besthdwallpaper.com/${$(b).find('div > a:nth-child(3)').attr('href')}`,
          image: [
            $(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'),
            $(b).find('picture > source:nth-child(1)').attr('srcset'),
            $(b).find('picture > source:nth-child(2)').attr('srcset')
          ]
        })
      })
      return Promise.resolve(results)
    })
    .then(function(data) {
      setTimeout(function() {
        resolve(data)
      }, Math.floor(Math.random() * 1000))
    })
  })
}

async function gsmSearch(query) {
  try {
    const response = await axios({
      method: "get",
      url: `https://gsmarena.com/results.php3?sQuickSearch=yes&sName=${query}`
    })
    const $ = cheerio.load(response.data)
    const result = []

    const device = $(".makers").find("li")
    device.each((i,
      e) => {
      const img = $(e).find("img")
      result.push({
        id: $(e).find("a").attr("href").replace(".php", ""),
        name: $(e).find("span").html().split("<br>").join(" "),
        thumbnail: img.attr("src"),
        description: img.attr("title")
      })
    })
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function searchChina(keyword) {
  const url = 'https://api.thepaper.cn/search/web/news';
  const requestData = {
    word: keyword,
    orderType: 3,
    pageNum: 1,
    pageSize: 30,
    searchType: 1
  };

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Client-Type': '1',
    'User-Agent': 'Mozilla/6.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    'Referer': 'https://www.thepaper.cn/searchResult?id=%E7%A0%B4%E4%BA%A7'
  };

  try {
    const loot = await axios.post(url, JSON.stringify(requestData), {
      headers
    });
    if (loot.status !== 200) {
      throw new Error(`HTTP error! Status: ${loot.status}`);
    }
    const daftarAnu = loot.data.data.list;
    const Ins = daftarAnu.map(item => ({
      id: item.contId,
      title: item.name,
      summary: item.summary.replace(/<\/?[^>]+(>|$)/g, ""),
      publishTime: new Date(item.pubTimeNew).toISOString().slice(0, 10),
      imageUrl: item.pic
    }));
    return Ins;
  } catch (error) {
    return {
      error: error.message
    };
  }
}

async function samehadakuSearch(page = 1) {
  const baseUrl = 'https://samehadaku.email/daftar-anime-2';
  let url = page === 1 
    ? `${baseUrl}/?title=&status=&type=&order=title`
    : `${baseUrl}/page/${page}/?title&status&type&order=title`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const animeList = [];

    $('.animpost').each((index, element) => {
      const anime = {
        image: $(element).find('.content-thumb img').attr('src'),
        title: $(element).find('.data .title h2').text().trim(),
        rating: $(element).find('.score').text().replace('i', '').trim(),
        description: $(element).find('.stooltip .ttls').text().trim(),
        type: $(element).find('.type').first().text().trim(),
        status: $(element).find('.data .type').text().trim(),
        genres: $(element).find('.stooltip .genres .mta a').map((i, el) => $(el).text().trim()).get(),
        link: $(element).find('.animposx a').attr('href')
      };

      animeList.push(anime);
    });

    return animeList;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function detailAnime(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const title = $('h1.entry-title').text().trim();
    const image = $('.thumb img').attr('src');
    const rating = $('.rtg span[itemprop="ratingValue"]').text().trim();
    const description = $('.entry-content-single').text().trim();
    
    const genres = [];
    $('.genre-info a').each((i, el) => {
      genres.push($(el).text().trim());
    });

    const episodes = [];
    $('.lstepsiode.listeps li').each((i, el) => {
      const episodeNumber = $(el).find('.epsright .eps a').text().trim();
      const episodeTitle = $(el).find('.epsleft .lchx a').text().trim();
      const episodeUrl = $(el).find('.epsleft .lchx a').attr('href');
      const episodeDate = $(el).find('.epsleft .date').text().trim();
      
      episodes.push({
        number: episodeNumber,
        title: episodeTitle,
        url: episodeUrl,
        date: episodeDate
      });
    });

    return {
      title,
      image,
      rating,
      description,
      genres,
      episodes
    };
  } catch (error) {
    console.error('Error scraping anime:', error);
    return null;
  }
}

async function samehadakuDL(url) {
  if (!url.includes('samehadaku.email')) {
    throw new Error('URL tidak valid');
  }

  try {
    const response = await axios.get(url);

    const $ = cheerio.load(response.data);
    
    const result = {
      judul: $('h1.entry-title').text().trim(),
      url: url,
      unduhan: []
    };

    const serverList = $('div#server > ul > li');
    
    for (let i = 0; i < serverList.length; i++) {
      const server = $(serverList[i]);
      const serverInfo = {
        nama: server.find('span').text().trim(),
        tipeServer: server.find('div').attr('data-type'),
        nomorServer: server.find('div').attr('data-nume'),
        postId: server.find('div').attr('data-post')
      };

      const formData = new URLSearchParams();
      formData.append('action', 'player_ajax');
      formData.append('post', serverInfo.postId);
      formData.append('nume', serverInfo.nomorServer);
      formData.append('type', serverInfo.tipeServer);

      const linkResponse = await axios.post('https://samehadaku.email/wp-admin/admin-ajax.php', formData, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Origin': 'https://samehadaku.email',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const $link = cheerio.load(linkResponse.data);
      serverInfo.tautan = $link('iframe').attr('src');

      result.unduhan.push(serverInfo);
    }

    return result;
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    throw error;
  }
}

async function scrapeDramaqu(page = 1) {
  try {
    if (page < 1 || page > 40) {
      throw new Error('Halaman harus antara 1 dan 40');
    }

    const url = `https://dramaqu.hair/drama/page/${page}/`;
    
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    const dramas = [];
    $('.items .item.tvshows').each((index, element) => {
      const $element = $(element);
      const drama = {
        title: $element.find('.serie-title').text().trim(),
        image: $element.find('.poster img').attr('src'),
        type: $element.find('.features-type b').text(),
        year: $element.find('.features-status b').text(),
        link: $element.find('a').attr('href')
      };
      dramas.push(drama);
    });

    const result = {
      page: page,
      data: dramas
    };

    return(JSON.stringify(result, null, 2));

  } catch (error) {
    const errorResult = {
      status: 'error',
      message: 'Terjadi kesalahan saat scraping',
      page: page,
      error: error.message
    };

    return(JSON.stringify(errorResult, null, 2));
  }
}

async function Filmapik(page = 1) {
  if (page > 2239) {
    throw new Error('Nomor halaman tidak valid. Halaman maksimum adalah 2239.');
  }

  const baseUrl = 'https://filmapik.pet/trending-2';
  const url = page === 1 ? baseUrl : `${baseUrl}/page/${page}`;
  
  console.log(`Scraping halaman ${page}...`);

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const movies = [];

    $('.items.normal article').each((index, element) => {
      const $element = $(element);
      const movie = {
        title: $element.find('.data h3 a').attr('title'),
        poster: $element.find('.poster img').attr('src'),
        rating: $element.find('.rating').text(),
        quality: $element.find('.quality').text(),
        type: $element.hasClass('tvshows') ? 'TV Show' : 'Movie',
        link: $element.find('.data h3 a').attr('href')
      };
      movies.push(movie);
    });

    return movies;

  } catch (error) {
    return(`Error saat scraping halaman ${page}:`, error.message);
    return [];
  }
}

async function getLibraryInfo(libraryName) {
  try {
    const response = await fetch(`https://api.cdnjs.com/libraries?search=${encodeURIComponent(libraryName)}&fields=name,description,version,author,license,homepage,repository`);
    if (!response.ok) {
      throw new Error('Respons jaringan tidak berhasil');
    }
    const data = await response.json();
    
    const libraryInfo = data.results.find(lib => lib.name.toLowerCase() === libraryName.toLowerCase());
    
    if (libraryInfo) {
      return JSON.stringify({
        nama: libraryInfo.name,
        deskripsi: libraryInfo.description,
        versiTerbaru: libraryInfo.version,
        lisensi: libraryInfo.license,
        author: libraryInfo.author,
        urlRepository: libraryInfo.repository?.url || 'Tidak tersedia',
        urlHomepage: libraryInfo.homepage
      }, null, 2);
    } else {
      return JSON.stringify({
        error: `Informasi untuk library '${libraryName}' tidak ditemukan`
      }, null, 2);
    }
  } catch (error) {
    return JSON.stringify({
      error: `Error saat mengambil informasi untuk library '${libraryName}': ${error.message}`
    }, null, 2);
  }
}

async function chord(query) {
  const search = await axios.get(
    `https://www.gitagram.com/?s=${encodeURIComponent(query).replace(
      /%20/g,
      "+"
    )}`
  );
  const $ = await cheerio.load(search.data);
  const $url = $("table.table > tbody > tr")
    .eq(0)
    .find("td")
    .eq(0)
    .find("a")
    .eq(0);

if ($url.length === 0) {
    return ("Lagu tidak ditemukan, coba lagu lain.");
  }

  const url = $url.attr("href");
  const song = await axios.get(url);
  const $song = await cheerio.load(song.data);
  const $hcontent = $song("div.hcontent");
  const artist = $hcontent.find("div > a > span.subtitle").text().trim();
  const artistUrl = $hcontent.find("div > a").attr("href");
  const title = $hcontent.find("h1.title").text().trim();
  const chord = $song("div.content > pre").text().trim();
  const lyrics = chord
    .replace(/\[(.+?)\]/g, "")
    .replace(/[A-G][#b]?[mM]?[7]?/g, "")
    .replace(/\n+/g, "\n")
    .trim();
  const res = {
    url: url,
    artist,
    artistUrl,
    title,
    lyrics,
  };
  return res;
}

async function searchSpotify(query) {
    try {
        const access_token = await getAccessToken();
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const data = response.data;
        const tracks = data.tracks.items.map(item => ({
            name: item.name,
            artists: item.artists.map(artist => artist.name).join(', '),
            popularity: item.popularity,
            link: item.external_urls.spotify,
            image: item.album.images[0].url,
            duration_ms: item.duration_ms,
        }));
        return tracks;
    } catch (error) {
        console.error('Error searching Spotify:', error);
        throw 'An error occurred while searching for songs on Spotify.';
    }
}

async function getAccessToken() {
    try {
        const client_id = 'acc6302297e040aeb6e4ac1fbdfd62c3';
        const client_secret = '0e8439a1280a43aba9a5bc0a16f3f009';
        const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
        const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const data = response.data;
        return data.access_token;
    } catch (error) {
        console.error('Error getting Spotify access token:', error);
        throw 'An error occurred while obtaining Spotify access token.';
    }
}

async function samehadakuS(q) {
  const url = 'https://samehadaku.email/?s=' + q;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const animeList = [];

    $('.animpost').each((index, element) => {
      const anime = {
        image: $(element).find('.content-thumb img').attr('src'),
        title: $(element).find('.data .title h2').text().trim(),
        rating: $(element).find('.score').text().replace('i', '').trim(),
        description: $(element).find('.stooltip .ttls').text().trim(),
        type: $(element).find('.type').first().text().trim(),
        status: $(element).find('.data .type').text().trim(),
        genres: $(element).find('.stooltip .genres .mta a').map((i, el) => $(el).text().trim()).get(),
        link: $(element).find('.animposx a').attr('href')
      };

      animeList.push(anime);
    });

    return animeList;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

module.exports = {
  PlayStore,
  searchChina,
  gsmSearch,
  apkcombo,
  aptoide,
  BukaLapak,
  happymod,
  stickersearch,
  webtoons,
  resep,
  gore,
  mangatoon,
  android1,
  wattpad,
  mlbb,
  wallpaper,
  samehadakuSearch,
  detailAnime,
  samehadakuDL,
  scrapeDramaqu,
  Filmapik,
  getLibraryInfo,
  chord,
  searchSpotify,
  samehadakuS,
  sklh,
}
