const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const SESSION_DIRECTORY = 'chatsession';
const API_KEY = 'sk-9jL26pavtzAHk9mdF0A5AeAfFcE1480b9b06737d9eC62c1e';
const MAX_MESSAGES = 10;
const MESSAGES_TO_KEEP = 5;

async function getYoutubeDownloadLink(url) {
  try {
    const apiUrl = `https://api.shannmoderz.xyz/downloader/yt-audio?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Asumsikan struktur respons API mirip dengan hasil scraping sebelumnya
    return data;
  } catch (error) {
    console.error('Error saat mengunduh audio YouTube:', error);
    throw error;
  }
}

async function searchPinterestImages(query) {
  try {
    const apiUrl = `https://api.shannmoderz.xyz/search/pinterest?query=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status && data.result && Array.isArray(data.result.images)) {
      return data.result.images;
    } else {
      throw new Error('Format respons API tidak sesuai yang diharapkan');
    }
  } catch (error) {
    console.error('Error saat mencari gambar Pinterest:', error);
    throw error;
  }
}

async function loadOrCreateSession(sessionName) {
  await fs.mkdir(SESSION_DIRECTORY, { recursive: true });
  const sessionFile = path.join(SESSION_DIRECTORY, `${sessionName}.json`);

  try {
    const data = await fs.readFile(sessionFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { messages: [], aiConfig: {} };
  }
}

async function saveSession(sessionName, session) {
  const sessionFile = path.join(SESSION_DIRECTORY, `${sessionName}.json`);
  await fs.writeFile(sessionFile, JSON.stringify(session, null, 2));
}

async function getSessionFileSize(sessionName) {
  const sessionFile = path.join(SESSION_DIRECTORY, `${sessionName}.json`);
  try {
    const stats = await fs.stat(sessionFile);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function trimMessages(messages) {
  if (messages.length > MAX_MESSAGES) {
    // Pertahankan pesan sistem jika ada
    const systemMessage = messages[0].role === 'system' ? [messages[0]] : [];
    // Ambil MESSAGES_TO_KEEP pesan terakhir, tidak termasuk pesan sistem
    const latestMessages = messages.slice(-MESSAGES_TO_KEEP);
    // Gabungkan pesan sistem (jika ada) dengan pesan-pesan terakhir
    return [...systemMessage, ...latestMessages];
  }
  return messages;
}

async function sendChatRequest(message, sessionName = 'default_session', aiConfig = {}) {
  const url = 'https://api.acloudapp.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  };

  let session = await loadOrCreateSession(sessionName);

  if (Object.keys(aiConfig).length > 0) {
    session.aiConfig = { ...session.aiConfig, ...aiConfig };
  }

  if (Object.keys(session.aiConfig).length > 0) {
    const systemMessage = `Anda adalah asisten AI dengan nama ${session.aiConfig.name || 'Asisten'}. 
    Bahasa yang Anda gunakan adalah ${session.aiConfig.language || 'Indonesia'}. 
    ${session.aiConfig.actions ? `Tindakan yang dapat Anda lakukan: ${session.aiConfig.actions.join(', ')}.` : ''}
    ${session.aiConfig.personality || ''}`;

    if (session.messages.length === 0 || session.messages[0].role !== 'system') {
      session.messages.unshift({ role: 'system', content: systemMessage });
    } else {
      session.messages[0].content = systemMessage;
    }
  }
  
  // Deteksi permintaan unduhan YouTube
  const youtubeRegex = /https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/;
  const youtubeMatch = message.match(youtubeRegex);

  if (youtubeMatch) {
    try {
      const downloadInfo = await getYoutubeDownloadLink(youtubeMatch[0]);
      const aiResponse = `Saya telah memproses permintaan unduhan Anda untuk audio YouTube dengan judul "${downloadInfo.result.title}". Silakan gunakan tautan yang disediakan untuk mengunduh audio. Jika Anda memerlukan bantuan lebih lanjut, jangan ragu untuk bertanya.`;
      
      session.messages.push({ role: "user", content: message });
      session.messages.push({ role: "assistant", content: aiResponse });
      session.messages = trimMessages(session.messages);
      await saveSession(sessionName, session);

      return {
        role: "assistant",
        message: aiResponse,
        ytmp3_url: downloadInfo.result.download_url,
        session: sessionName,
        session_size: await getSessionFileSize(sessionName)
      };
    } catch (error) {
      console.error('Error saat mengunduh audio YouTube:', error);
      return sendChatRequest(`Maaf, terjadi kesalahan saat mencoba mengunduh audio YouTube. Error: ${error.message}`, sessionName, aiConfig);
    }
  }

  // Deteksi permintaan pencarian gambar
  const imageSearchRegex = /^(cari gambar|cari foto|carikan image|cari photo|carikan gambar|carikan foto|berikan foto|berikan gambar)\s+(.+)$/i;
  const imageSearchMatch = message.match(imageSearchRegex);

  if (imageSearchMatch) {
    try {
      const query = imageSearchMatch[2].trim();
      const imageUrls = await searchPinterestImages(query);
      const aiResponse = `Saya telah mencari gambar untuk "${query}". Berikut adalah beberapa hasil yang saya temukan dari Pinterest.`;
      
      session.messages.push({ role: "user", content: message });
      session.messages.push({ role: "assistant", content: aiResponse });
      session.messages = trimMessages(session.messages);
      await saveSession(sessionName, session);

      return {
        role: "assistant",
        message: aiResponse,
        pin_url: imageUrls,
        session: sessionName,
        session_size: await getSessionFileSize(sessionName)
      };
    } catch (error) {
      console.error('Error saat mencari gambar Pinterest:', error);
      return sendChatRequest(`Maaf, terjadi kesalahan saat mencoba mencari gambar. Error: ${error.message}`, sessionName, aiConfig);
    }
  }

  session.messages.push({ role: "user", content: message });
  session.messages = trimMessages(session.messages);

  const body = JSON.stringify({
    model: "gemini-pro",
    messages: session.messages,
    temperature: 0.7,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["\n"]
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      const aiMessage = data.choices[0].message;
      session.messages.push(aiMessage);
      session.messages = trimMessages(session.messages);
      await saveSession(sessionName, session);

      const sessionSize = await getSessionFileSize(sessionName);

      return {
        role: aiMessage.role,
        message: aiMessage.content,
        session: sessionName,
        session_size: sessionSize
      };
    } else {
      throw new Error('Tidak ada pesan dalam respons');
    }
  } catch (error) {
    console.error('Ada masalah dengan permintaan Fetch:', error);
    throw error;
  }
}

function validateAiConfig(config) {
  const allowedKeys = ['name', 'language', 'actions', 'personality'];
  const validConfig = {};

  for (const key of allowedKeys) {
    if (config.hasOwnProperty(key)) {
      if (key === 'actions' && Array.isArray(config[key])) {
        validConfig[key] = config[key].filter(action => typeof action === 'string');
      } else if (typeof config[key] === 'string') {
        validConfig[key] = config[key];
      }
    }
  }

  return validConfig;
}

function uuid() {
  let d = new Date().getTime();
  let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
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

function generateRandomString(length) {
  const characters = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateRandomNumberString(length) {
  const characters = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function getSearchResults(query) {
  const url = 'https://aoyo.ai/Api/AISearch/Source';
  const requestData = {
    q: query,
    num: 20,
    hl: 'id-ID'
  };

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json, text/plain, */*'
  };

  try {
    const response = await axios.post(url, qs.stringify(requestData), {
      headers
    });
    return response.data.organic;
  } catch (error) {
    return [];
  }
}

async function hatAi(question) {
  const url = 'https://hat.baby/api/getSources';
  const requestData = {
    question: question
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const sources = response.data.map(source => `${source.name}: ${source.url}`).join('\n');
    return `${sources}`;
  } catch (error) {
    console.error(error.message);
    return 'duar';
  }
}

async function gptpicture(query) {
  const playod = {
    captionInput: query,
    captionModel: 'default',
  };
  try {
    const response = await axios.post('https://chat-gpt.pictures/api/generateImage', playod, {
      headers: {
        Accept: '*/*', 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36'
      }});
    const data = response.data;
    const result = {
      data: data,
    };
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

async function AoyoAi(content) {
  const searchQuery = content;
  const searchResults = await getSearchResults(searchQuery);

  const engineContent = searchResults.map((result, index) => ({
    title: result.title,
    link: result.link,
    snippet: result.snippet,
    sitelinks: result.sitelinks ? result.sitelinks.map(link => ({
      title: link.title,
      link: link.link
    })): [],
    position: index + 1
  }));

  const url = 'https://aoyo.ai/Api/AISearch/AISearch';
  const requestData = {
    content: content,
    id: generateRandomString(32),
    language: 'id-ID',
    engineContent: JSON.stringify(engineContent),
    randomNumber: generateRandomNumberString(17)
  };

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://aoyo.ai/search/?q=' + encodeURIComponent(content)
  };

  try {
    const response = await axios.post(url, qs.stringify(requestData), {
      headers
    });
    return response.data.replace(/\[START\][\s\S]*$/g, '').trim();

  } catch (error) {
    return {
      error: error.message
    };
  }
}

async function tudouai(q, p) {
  try {
    const authResponse = await axios.post('https://tudouai.chat/api/auth/nick_login', {
      fingerprint: crypto.randomBytes(16).toString('hex')
    }, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://tudouai.chat/chat'
      }
    });

    const chatResponse = await axios.post('https://tudouai.chat/api/v1/chat/completions', {
      model: "gpt-3.5-turbo-0125",
      messages: [{
        role: "system", content: p
      },
        {
          role: "user", content: q
        }],
      stream: true
    }, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': authResponse.data.token
      },
      responseType: 'stream'
    });
    let content = '';
    return new Promise((resolve, reject) => {
      chatResponse.data.on('data', chunk => {
        const lines = chunk.toString().split('\n').filter(line => line.trim());
        for (const line of lines) {
          if (line === 'data: [DONE]') {
            resolve(content);
          } else {
            try {
              const parsed = JSON.parse(line.replace(/^data: /, ''));
              const delta = parsed.choices[0].delta;
              if (delta && delta.content) {
                content += delta.content;
              }
            } catch (error) {
              reject(error);
            }
          }
        }
      });
      chatResponse.data.on('end',
        () => resolve(content));
      chatResponse.data.on('error',
        error => reject(error));
    });

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

const axiosInstance = axios.create({
  baseURL: 'https://gke-prod-api.useadrenaline.com/',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'x-instance': 'adrenaline'
  }
});

async function useadrenaline(q) {
  try {
    const data = {
      title: q,
      body: "",
      snippets: [],
      is_rush_enabled: false,
      is_public: false,
      files: []
    };
    const {
      data: postResponseData
    } = await axiosInstance.post('question', data);
    const {
      data: threadResponseData
    } = await axiosInstance.get(`thread/${postResponseData.question_id}?page=1&per_page=10`);
    let jobStatus = 'IN_PROGRESS';
    let dataHasil = null;
    while (jobStatus === 'IN_PROGRESS') {
      const {
        data: answersResponseData
      } = await axiosInstance.get(`question/${threadResponseData.list[0].question.id}/answers`);
      jobStatus = answersResponseData[0].job_status;
      dataHasil = answersResponseData[0].content;

      if (jobStatus === 'IN_PROGRESS') {
        console.log('Job is still in progress...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return dataHasil;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function LetmeGpt(query) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://letmegpt.com/search?q=${encodedQuery}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return $('#gptans').text();
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
}

const website = axios.create({
  baseURL: 'https://app.yoursearch.ai',
  headers: {
    'Content-Type': 'application/json'
  }
});

const yousearch = async (searchTerm) => {
  const requestData = {
    searchTerm: searchTerm,
    promptTemplate: `Search term: "{searchTerm}"

    Make your language less formal and use emoticons.
    I want you to always use Indonesian slang from Jakarta where the words "you" and "anda" are replaced with "lu" and the word I is replaced with "gw".
    Create a summary of the search results in three paragraphs with reference numbers, which you then list numbered at the bottom.
    Include emojis in the summary.
    Be sure to include the reference numbers in the summary.
    Both in the text of the summary and in the reference list, the reference numbers should look like this: "(1)".
    Formulate simple sentences.
    Include blank lines between the paragraphs.
    Do not reply with an introduction, but start directly with the summary.
    Include emojis in the summary.
    At the end write a hint text where I can find search results as comparison with the above search term with a link to Google search in this format \`See Google results: \` and append the link.
    Below write a tip how I can optimize the search results for my search query.
    I show you in which format this should be structured:

    \`\`\`
    <Summary of search results with reference numbers>

    Sources:
    (1) <URL of the first reference>
    (2) <URL of the second reference>

    <Hint text for further search results with Google link>
    <Tip>
    \`\`\`

    Here are the search results:
    {searchResults}`,
    searchParameters: "{}",
    searchResultTemplate: `[{order}] "{snippet}"
    URL: {link}`
  };

  try {
    const response = await website.post('/api', requestData);
    return response.data.response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

function generateRandomID(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomID = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomID += characters.charAt(randomIndex);
  }
  return randomID;
}

const api = axios.create({
  baseURL: 'https://search.lepton.run/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

async function leptonAi(query) {
  try {
    const rid = generateRandomID(10);
    const postData = {
      query,
      rid
    };
    const response = await api.post('query', postData);

    const llmResponseRegex = /__LLM_RESPONSE__([\s\S]*?)__RELATED_QUESTIONS__/;
    const llmResponseMatch = response.data.match(llmResponseRegex);

    if (llmResponseMatch && llmResponseMatch[1]) {
      let llmResponse = llmResponseMatch[1].trim();
      llmResponse = llmResponse.replace(/__LLM_RESPONSE__|__RELATED_QUESTIONS__/g, '').trim();
      return llmResponse;
    } else {
      throw new Error("No LLM response found.");
    }
  } catch (error) {
    throw new Error('Error fetching LLM response: ' + error.message);
  }
}

async function Simsimi(text) {
  const url = 'https://simsimi.vn/web/simtalk';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
    Referer: 'https://simsimi.vn/'
  };

  try {
    const response = await axios.post(url, `text=${encodeURIComponent(text)}&lc=id`, {
      headers
    });
    return response.data.success;
  } catch (error) {
    console.error('Error asking SimSimi:', error);
    throw error;
  }
}

async function CgtAi(text) {
  try {
    const conversation_uuid = uuid();

    const requestData = {
      conversation_uuid: conversation_uuid,
      text: text,
      sent_messages: 1
    };

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    const response = await axios.post('https://www.timospecht.de/wp-json/cgt/v1/chat', qs.stringify(requestData), config);
    return response.data;
  } catch (error) {
    throw new Error('Terjadi kesalahan:', error);
  }
}

async function blackbox(message) {
  try {
    const response = await axios.post('https://www.blackbox.ai/api/chat', {
      messages: [{
        id: null, content: message, role: 'user'
      }],
      id: null,
      previewToken: null,
      userId: null,
      codeModelMode: true,
      agentMode: {},
      trendingAgentMode: {},
      isMicMode: false,
      isChromeExt: false,
      githubToken: null
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

async function luminai(q) {
  try {
    const response = await axios.post("https://lumin-ai.xyz", {
      content: q
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}

luminai("question")
.then(result => {
  return('Result:', result);
})
.catch(error => {
  return('Error:', error);
});

async function GoodyAI(q) {
  try {
    const headers = {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,af;q=0.6',
      'Content-Type': 'application/json',
      'Origin': 'https://www.goody2.ai',
      'Referer': 'https://www.goody2.ai/chat',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    };

    const params = {
      message: q,
      debugParams: null
    };

    const response = await axios.post("https://www.goody2.ai/send", params, {
      headers,
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      let fullText = '';

      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n');
        for (let line of lines) {
          if (line.startsWith('data: {"content":')) {
            try {
              const content = JSON.parse(line.slice(6)).content;
              fullText += content;
            } catch (err) {
              console.error('Error parsing JSON:', err);
            }
          }
        }
      });

      response.data.on('end',
        () => {
          resolve(fullText);
        });

      response.data.on('error',
        (err) => {
          reject(err);
        });
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function thinkany(prompt) {
  try {
    const response = await axios.post('https://thinkany.ai/api/chat',
      {
        role: 'user',
        content: prompt,
        conv_uuid: uuid(),
        mode: 'search',
        is_new: true,
        model: 'claude-3-haiku'
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function text2img(prompt) {
  try {
    const url = await fetch("https://tti.photoleapapp.com/api/v1/generate?prompt=" + prompt)
    const data = await url.json()
    const res = {
      url: data.result_url
    }
    return res
  } catch (err) {
    const res = {
      message: String(err)
    }
    console.log(res)
    return res
  }
}

async function llama3(query) {
  try {
    const BASE_URL = 'https://llama3-enggan-ngoding.vercel.app/api/llama'; //@Irulll
    const payload = {
      messages: [{
        role: "system",
        content: "you are llama3 which is based on Indonesian"
      },
        {
          role: "user",
          content: query
        }],
      model: "70b"
    };
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Mobile/15E148',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function wwdgpt(prompt) {
  try {
    const response = await fetch('https://wewordle.org/gptapi/v1/web/turbo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Mobile/15E148',
      },
      body: JSON.stringify({
        messages: [{
          content: "You are an AI assistant who uses Indonesian.",
          role: "assistant"
        },
          {
            content: prompt,
            role: "user"
          }]
      }),
    });
    const data = await response.text();
    const res = ({
      data
    })
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function ragBot(message) {
  try {
    const response = await axios.post('https://ragbot-starter.vercel.app/api/chat', {
      messages: [{
        role: 'user', content: message
      }],
      useRag: true,
      llm: 'gpt-3.5-turbo',
      similarityMetric: 'cosine'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function degreeGuru(message, prompt) {
  try {
    const response = await axios.post('https://degreeguru.vercel.app/api/guru', {
      messages: [{
        role: 'user', content: message
      }]
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function gipiti4(mess) {
  try {
    let prompt = "sekarang lu berperan sebagai asep garong, temen gaul bahasa Indonesia, gaya bicara nya loe atau gue"
    let messages = [
      {
        role: "user",
        content: mess
      },
    ];
    
    return await new Promise(async (resolve, reject) => {
      if(!messages) return reject("undefined reading meessages input");
      if(!Array.isArray(messages)) return reject("invalid array input at messages!");
      axios.post("https://chatbot-gpt4.vercel.app/api/chat", {
        model: {
          id: "gpt-4o",
          name: "GPT-4o",
          maxLength: 24000,
          tokenLimit: 8000
        },
        messages: messages,
        prompt: prompt,
        temperature: 0.5,
        top_p: 0.9,
        top_k: 60
      }).then(res => {
        const data = res.data;
        if(data === "Error") return reject("internal server error!");
        resolve({
          status: true,
          data: {
            answer: data
          }
        })
      })
    })
  } catch (e) {
    return { status: false, message: e };
  }
}

async function sdxlAnime(prompt) {
  try {
    return await new Promise(async(resolve, reject) => {
      if(!prompt) return reject("failed reading undefined prompt!");
      axios.post("https://aiimagegenerator.io/api/model/predict-peach", {
        prompt,
        negativePrompt: "nsfw, nude, uncensored, cleavage, nipples",
        key: "Soft-Anime",
        width: 512,
        height: 768,
        quantity: 1,
        size: "512x768"
      }).then(res => {
        const data = res.data;
        if(data.code !== 0) return reject(data.message);
        if(data.data.safetyState === "RISKY") return reject("nsfw image was generated, you try create other image again!")
        if(!data.data?.url) return reject("failed generating image!")
        return resolve({
          image: data.data.url
        })
      }).catch(reject)
    })
  } catch (e) {
    return {
      status: false,
      message: e
    }
  }
}

async function sdxlFurry(prompt) {
  try {
    return await new Promise(async(resolve, reject) => {
      if(!prompt) return reject("failed reading undefined prompt!");
      axios.post("https://aiimagegenerator.io/api/model/predict-peach", {
        prompt,
        negativePrompt: "nsfw, nude, uncensored, cleavage, nipples",
        key: "Furry-Drawn",
        width: 512,
        height: 768,
        quantity: 1,
        size: "512x768"
      }).then(res => {
        const data = res.data;
        if(data.code !== 0) return reject(data.message);
        if(data.data.safetyState === "RISKY") return reject("nsfw image was generated, you try create other image again!")
        if(!data.data?.url) return reject("failed generating image!")
        return resolve({
          image: data.data.url
        })
      }).catch(reject)
    })
  } catch (e) {
    return {
      status: false,
      message: e
    }
  }
}

async function sdxlWaifu(prompt) {
  try {
    return await new Promise(async(resolve, reject) => {
      if(!prompt) return reject("failed reading undefined prompt!");
      axios.post("https://aiimagegenerator.io/api/model/predict-peach", {
        prompt,
        negativePrompt: "nsfw, nude, uncensored, cleavage, nipples",
        key: "Waifu",
        width: 512,
        height: 768,
        quantity: 1,
        size: "512x768"
      }).then(res => {
        const data = res.data;
        if(data.code !== 0) return reject(data.message);
        if(data.data.safetyState === "RISKY") return reject("nsfw image was generated, you try create other image again!")
        if(!data.data?.url) return reject("failed generating image!")
        return resolve({
          image: data.data.url
        })
      }).catch(reject)
    })
  } catch (e) {
    return {
      status: false,
      message: e
    }
  }
}

async function sdxlEmoji(prompt) {
  try {
    return await new Promise(async(resolve, reject) => {
      if(!prompt) return reject("failed reading undefined prompt!");
      axios.post("https://aiimagegenerator.io/api/model/predict-peach", {
        prompt,
        negativePrompt: "nsfw, nude, uncensored, cleavage, nipples",
        key: "3D-Emoji",
        width: 1024,
        height: 1024,
        quantity: 1,
        size: "512x768"
      }).then(res => {
        const data = res.data;
        if(data.code !== 0) return reject(data.message);
        if(data.data.safetyState === "RISKY") return reject("nsfw image was generated, you try create other image again!")
        if(!data.data?.url) return reject("failed generating image!")
        return resolve({
          image: data.data.url
        })
      }).catch(reject)
    })
  } catch (e) {
    return {
      status: false,
      message: e
    }
  }
}

async function photoleap(text) {
    try {
      const { data } = await axios.get("https://tti.photoleapapp.com/api/v1/generate?prompt=" + encodeURIComponent(text));
      return data;
    } catch (err) {
      return null;
    }
  }

module.exports = {
  thinkany,
  wwdgpt,
  degreeGuru,
  ragBot,
  llama3,
  tudouai,
  useadrenaline,
  GoodyAI,
  luminai,
  blackbox,
  CgtAi,
  Simsimi,
  leptonAi,
  yousearch,
  LetmeGpt,
  AoyoAi,
  gptpicture,
  text2img,
  getYoutubeDownloadLink,
  searchPinterestImages,
  loadOrCreateSession,
  saveSession,
  getSessionFileSize,
  trimMessages,
  sendChatRequest,
  validateAiConfig,
  gipiti4,
  sdxlAnime,
  sdxlFurry,
  sdxlWaifu,
  sdxlEmoji,
  photoleap,
};
