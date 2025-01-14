const Parser = require('rss-parser');
const parser = new Parser();

// Fungsi pencarian didefinisikan terlebih dahulu
function search(data, query) {
  const lowercaseQuery = query.toLowerCase();
  return data.filter(item => 
    item.title.toLowerCase().includes(lowercaseQuery) || 
    item.content.toLowerCase().includes(lowercaseQuery)
  );
}

async function getTempoNews(type, searchParams = null) {
  try {
    const TEMPO_NEWS_RSS = `https://rss.tempo.co/${type}`;
    
    const feed = await parser.parseURL(TEMPO_NEWS_RSS);
    
    let data = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      content: item.content,
      guid: item.guid
    }));

    let responseData = {
      message: `Result of type ${type} news in Tempo News`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      responseData = {
        message: `Result of type ${type} news in Tempo News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

async function getAntaraNews(type, searchParams = null) {
  try {
    const ANTARA_NEWS_RSS = `https://www.antaranews.com/rss/${type}`;
    
    const feed = await parser.parseURL(ANTARA_NEWS_RSS);
    
    let data = feed.items.map(item => {
      const image = item.content?.match(
        /\<img.+src\=(?:\"|\')(.+?)(?:\"|\')/
      )?.[1];
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        content: item.content,
        description: item.contentSnippet?.replace("...", "").trim(),
        image: image,
        guid: item.guid
      };
    });

    let responseData = {
      message: `Result of type ${type} news in Antara News`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      responseData = {
        message: `Result of type ${type} news in Antara News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

function replaceQueryParams(url, param, value) {
  const urlObj = new URL(url);
  urlObj.searchParams.set(param, value);
  return urlObj.toString();
}

async function getCNBCNews(type, searchParams = null) {
  try {
    const CNBC_NEWS_RSS = `https://www.cnbcindonesia.com/${type}/rss`;
    
    const feed = await parser.parseURL(CNBC_NEWS_RSS);
    
    let data = feed.items.map(item => {
      const image = replaceQueryParams(
        item.enclosure?.url || '',
        "q",
        "100"
      );
      return {
        title: item.title,
        link: item.link,
        description: item.contentSnippet,
        image: {
          small: item.enclosure?.url,
          large: image,
        },
        isoDate: item.isoDate
      };
    });

    let responseData = {
      message: `Result of type ${type} news in CNBC News`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      responseData = {
        message: `Result of type ${type} news in CNBC News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

async function getCNNNews(type, searchParams = null) {
  try {
    const CNN_NEWS_RSS = `https://www.cnnindonesia.com/${type}/rss`;
    
    const feed = await parser.parseURL(CNN_NEWS_RSS);
    
    let data = feed.items.map(item => {
      const image = replaceQueryParams(
        item.enclosure?.url,
        "q",
        "100"
      );
      return {
        title: item.title,
        link: item.link,
        description: item.contentSnippet,
        image: {
          small: item.enclosure?.url,
          large: image,
        },
        isoDate: item.isoDate
      };
    });

    let responseData = {
      message: `Result of type ${type} news in CNN News`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      responseData = {
        message: `Result of type ${type} news in CNN News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

function searchi(data, query) {
  const lowercaseQuery = query.toLowerCase();
  return data.filter(item => 
    (item.title?.toLowerCase().includes(lowercaseQuery) || false) || 
    (item.description?.toLowerCase().includes(lowercaseQuery) || false)
  );
}

async function getKumparanNews(searchParams = null) {
  try {
    const KUMPARAN_NEWS_RSS = "https://lapi.kumparan.com/v2.0/rss/";
    
    const feed = await parser.parseURL(KUMPARAN_NEWS_RSS);
    
    let data = feed.items.map(item => {
      return {
        title: item.title,
        link: item.link,
        description: item.contentSnippet,
        image: {
          small: item.enclosure?.url.replace("w_480", "w_240"),
          medium: item.enclosure?.url,
          large: item.enclosure?.url.replace("w_480", "w_720"),
          extraLarge: item.enclosure?.url.replace("w_480", "w_1080"),
        },
        isoDate: item.isoDate
      };
    });

    let responseData = {
      messages: "Result of all news in Kumparan News",
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = searchi(data, searchParams);
      responseData = {
        messages: `Result of all news in Kumparan News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

async function getOkezoneNews(type, searchParams = null) {
  try {
    const OKEZONE_NEWS_RSS = {
      breaking: "https://sindikasi.okezone.com/index.php/rss/0/RSS2.0",
      news: "https://sindikasi.okezone.com/index.php/rss/1/RSS2.0",
      sport: "https://sindikasi.okezone.com/index.php/rss/2/RSS2.0",
      economy: "https://sindikasi.okezone.com/index.php/rss/11/RSS2.0",
      lifestyle: "https://sindikasi.okezone.com/index.php/rss/12/RSS2.0",
      celebrity: "https://sindikasi.okezone.com/index.php/rss/13/RSS2.0",
      bola: "https://sindikasi.okezone.com/index.php/rss/14/RSS2.0",
      techno: "https://sindikasi.okezone.com/index.php/rss/16/RSS2.0",
    };

    if (!OKEZONE_NEWS_RSS[type]) {
      throw new Error(`Invalid news type: ${type}`);
    }

    const feed = await parser.parseURL(OKEZONE_NEWS_RSS[type]);

    let data = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      content: item.content,
      guid: item.guid,
      image: item.enclosure ? {
        small: item.enclosure.url.replace(/w=\d+/, 'w=300'),
        medium: item.enclosure.url.replace(/w=\d+/, 'w=500'),
        large: item.enclosure.url.replace(/w=\d+/, 'w=800'),
      } : undefined
    }));

    let responseData = {
      message: `Result of type ${type} news in Okezone News`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      responseData = {
        message: `Result of type ${type} news in Okezone News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

async function getRepublikaNews(type, searchParams = null) {
  try {
    const REPUBLIKA_NEWS_RSS = `https://www.republika.co.id/rss/${type}`;

    const feed = await parser.parseURL(REPUBLIKA_NEWS_RSS);

    let data = feed.items.map(item => ({
      title: item.title ? item.title.trim() : '',
      link: item.link,
      description: item.contentSnippet,
      image: {
        small: item['media:content'] ? item['media:content']['$']['url'] : undefined,
      },
    }));

    let responseData = {
      message: `Result of type ${type} news in Republika News`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      responseData = {
        message: `Result of type ${type} news in Republika News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

async function getSuaraNews(type, searchParams = null) {
  try {
    const SUARA_NEWS_RSS = `https://www.suara.com/rss/${type}`;

    const feed = await parser.parseURL(SUARA_NEWS_RSS);

    let data = feed.items.map(item => {
      const image = replaceQueryParams(item?.enclosure?.url, "q", "100");
      return {
        title: item.title?.replace("...", "").trim(),
        link: item.link,
        contentSnippet: item.contentSnippet?.trim(),
        image: {
          small: item?.enclosure?.url,
          large: image,
        },
      };
    });

    let responseData = {
      message: `Result of type ${type} news in Suara News`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      responseData = {
        message: `Result of type ${type} news in Suara News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

async function getTribunNews(zone, type, searchParams = null) {
  try {
    const TRIBUN_NEWS_RSS = `https://${zone}.tribunnews.com/rss/${type}`;

    const feed = await parser.parseURL(TRIBUN_NEWS_RSS);

    let data = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      contentSnippet: item.contentSnippet,
      // some items don't have image
      image: item.enclosure ? item.enclosure.url.replace("thumbnails2", "images") : undefined,
    }));

    let responseData = {
      message: `Result of zone ${zone} and type ${type} news in Tribun News`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      responseData = {
        message: `Result of zone ${zone} news and type ${type} in Tribun News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

async function getViceNews(searchParams = null) {
  try {
    const VICE_NEWS_RSS = "https://www.vice.com/id/rss?locale=id_id";

    const feed = await parser.parseURL(VICE_NEWS_RSS);

    let data = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      description: item.contentSnippet,
      image: item.enclosure ? item.enclosure.url : undefined,
    }));

    let responseData = {
      message: "Result of all news in Vice News",
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      responseData = {
        message: `Result of all news in Vice News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

function limitString(str, limit) {
  return str.length > limit ? str.substring(0, limit) + "..." : str;
}

async function getVOANews(searchParams = null) {
  try {
    const VOA_NEWS_RSS = "https://www.voaindonesia.com/api/zmgqoe$moi";

    const feed = await parser.parseURL(VOA_NEWS_RSS);

    let data = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      description: limitString(item.contentSnippet || '', 450),
      image: item.enclosure ? item.enclosure.url : undefined,
    }));

    let responseData = {
      message: "Result of all news in VOA News",
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      responseData = {
        message: `Result of all news in VOA News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

async function getZetizenJawaposNews(type, searchParams = null) {
  let parser = new Parser({
  customFields: {
    item: ['media:content'],
  },
});
  try {
    const ZETIZEN_JAWAPOS_NEWS_RSS = `https://zetizen.jawapos.com/rss/${type}`;

    const feed = await parser.parseURL(ZETIZEN_JAWAPOS_NEWS_RSS);

    let data = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      description: item.content,
      image: item['media:content'] ? item['media:content']['$']['url'] : undefined,
    }));

    let responseData = {
      message: `Result of type ${type} news in Zetizen JawaPos News`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      responseData = {
        message: `Result of type ${type} news in Zetizen JawaPos News with title search: ${searchParams}`,
        total: searchData.length,
        data: searchData,
      };
    }

    return responseData;
  } catch (e) {
    console.error("Error:", e);
    return {
      message: "Something error",
      error: e.message
    };
  }
}

function stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

async function wikipediaSearch(searchTerm) {
    const baseUrl = 'https://id.wikipedia.org/w/api.php';
    
    const params = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: searchTerm,
        exintro: '',
        prop: 'extracts|pageimages',
        format: 'json',
        origin: '*'
    });
    
    try {
        const response = await fetch(`${baseUrl}?${params}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const searchResults = [];
        if (data.query && data.query.pages) {
            for (const pageId in data.query.pages) {
                const pageInfo = data.query.pages[pageId];
                const result = {
                    title: pageInfo.title || '',
                    extract: stripHtml(pageInfo.extract || ''),
                    pageid: pageInfo.pageid || ''
                };
                if (pageInfo.thumbnail) {
                    result.thumbnail = pageInfo.thumbnail.source || '';
                }
                searchResults.push(result);
            }
        }
        
        return {
            search_term: searchTerm,
            results: searchResults
        };
    
    } catch (error) {
        return { error: `Terjadi kesalahan saat mengakses API: ${error.message}` };
    }
}

module.exports = {
  getTempoNews,
  getAntaraNews,
  getCNBCNews,
  getCNNNews,
  getKumparanNews,
  getOkezoneNews,
  getRepublikaNews,
  getSuaraNews,
  getTribunNews,
  getViceNews,
  getVOANews,
  getZetizenJawaposNews,
  wikipediaSearch
};
