// Ubah definisi endpoint untuk menggunakan kategori baru dan method
const apiEndpoints = [
    { category: 'Artificial Intelegenci', endpoint: '/ai/claude', description: 'Chat dengan claude-3-sonnet', params: ['key', 'query'], desc: 'Claude-3-Sonnet menawarkan peningkatan signifikan dalam kecerdasan buatan.' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/tudou', description: 'Chat dengan tudou ai', params: ['key', 'query', 'prompt'], desc: 'Tudou ai cerdas yang dapat anda costume.' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/gpt-3', description: 'Chat dengan gpt3 ai', params: ['key', 'query', 'prompt'], desc: 'gpt3, costume prilakunya dan mulai produksi!' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/goody', description: 'Chat dengan goody ai', params: ['key', 'query'], desc: 'Goody, ai implementasi ai chatgpt terbaru' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/morphic', description: 'Chat dengan morphic.sh', params: ['key', 'query'], desc: 'Morphic.sh ai serba bisa.' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/luminai', description: 'Chat dengan luminai', params: ['key', 'query'], desc: 'Luminai powered by siputzx' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/blackbox', description: 'Chat dengan blackbox ai', params: ['key', 'query'], desc: 'Blackbox, ai coding nomor satu' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/cgt', description: 'Chat dengan cgt ai', params: ['key', 'query'], desc: 'Cgt, ai dengan teknologi baru' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/simsimi', description: 'Chat dengan simi ai', params: ['key', 'query'], desc: 'Simi, ai yang kekinian' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/lepton', description: 'Chat dengan lepton ai', params: ['key', 'query'], desc: 'Lepton, ai baru dan cepat' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/yousearch', description: 'Chat dengan yousearch ai', params: ['key', 'query'], desc: 'Yousearch, ai ahli searching' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/letmegpt', description: 'Chat dengan letmegpt', params: ['key', 'query'], desc: 'Letmegpt adaptasi dari openai' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/aoyo', description: 'Chat dengan aoyo ai', params: ['key', 'query'], desc: 'Aoyo ai cepat dan cerdas' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/prod', description: 'Chat dengan prod ai', params: ['key', 'query'], desc: 'Prod, ai bertenaga ekstra' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/llama3', description: 'Chat dengan llama3', params: ['key', 'query'], desc: 'Llama3, ai cerdas 7b kata' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/wwdgpt', description: 'Chat dengan wwdgpt', params: ['key', 'query'], desc: 'Wwdgpt, ai sejenis openai' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/ragbot', description: 'Chat dengan ragbot', params: ['key', 'query'], desc: 'Ragbot ai khusus dalam pembahasan' }, 
    { category: 'Artificial Intelegenci', endpoint: '/ai/degreeguru', description: 'Chat dengan degreeguru', params: ['key', 'query'], desc: 'DegreeGuru, ai yang berfokus dalam satu hal' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/txt2img', description: 'Buat gambar dari text', params: ['key', 'prompt'], desc: 'Convert text menjadi gambar' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/stablediffusion-xl', description: 'Buat gambar dengan model xl', params: ['key', 'prompt'], desc: 'Buat gambar hd hanya dengan perintah' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/dalle3-mini', description: 'Buat gambar dengan dalle3-mini', params: ['key', 'prompt'], deac: 'Buat text menjadi gambar dengan dalle3-mini' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/pixel-art', description: 'Buat gambar dengan pixel-art', params: ['key', 'prompt'], deac: 'Buat text menjadi gambar dengan gaya pixel' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/flux-schnell', description: 'Buat gambar dengan flux-schnell', params: ['key', 'prompt'], deac: 'Buat text menjadi gambar dengan gaya flux kualitas tinggi' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/img2anime', description: 'convert photo to anime style', params: ['key', 'url'], desc: 'Ubah fotomu menjadi gaya anime' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/sdxl-anime', description: 'Buat gambar dengan model sdxl', params: ['key', 'prompt'], desc: 'Buat gambar anime menggunakan teks dengan model sdxl' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/sdxl-furry', description: 'Genrate gambar modep furry', params: ['key', 'prompt'], desc: 'buat gambar dengan teks model furry' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/sdxl-waifu', description: 'Generat waifu favoritmu', params: ['key', 'prompt'], desc: 'Hasilkan gambar waifu kesukaanmu' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/sdxl-emoji', description: 'Genrate gambar 3d emoji', params: ['key', 'prompt'], desc: 'Buat gambar sdxl dengan model 3d-emoji' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/photoleap', description: 'Genrate gambar dengan photoleap model', params: ['key', 'prompt'], desc: 'Stable photoleap image genrator' },
    { category: 'Artificial Intelegenci', endpoint: '/ai/flux-pro', description: 'Evolution ai image genrator', params: ['key', 'prompt'], desc: 'Model besar untuk txt2img model flux-pro' },
    
    { category: 'Anime', endpoint: '/anime/samehadaku', description: 'Search anime di samehadaku', params: ['key', 'page'], desc: 'masukkan nomor halaman samehadaku' },
    { category: 'Anime', endpoint: '/anime/samehadaku2', description: 'Search anime by judul anime', params: ['key', 'query'], desc: 'Search anime favoritmu dengan memasukkan judulnya.' },
    { category: 'Anime', endpoint: '/anime/samehadaku-detail', description: 'Detail dari anime pilihan', params: ['key', 'url'], desc: 'masukkan url anime favoritmu di samehadaku' },
    { category: 'Anime', endpoint: '/anime/samehadakudl', description: 'Download anime di samehadaku per-episode', params: ['key', 'url'], desc: 'maskkan url episode anime favoritmu' },
    { category: 'Anime', endpoint: '/anime/kuronime', description: 'Search anime di kuronime', params: ['key', 'page'], desc: 'masukkan nomor halaman kuronime' },
    { category: 'Anime', endpoint: '/anime/kuronime-detail', description: 'Detail anime di kuronime', params: ['key', 'url'], desc: 'masukkan url anime favoritmu di kuronime' },
    
    { category: 'Berita', endpoint: '/berita/tempo', description: 'Search berita di tempo news', params: ['key', 'query'], desc: 'masukkan genre berita yang kamu cari' },
    { category: 'Berita', endpoint: '/berita/antara', description: 'Search berita di antara news', params: ['key', 'query'], desc: 'masukkan genre berita yang kamu cari' },
    { category: 'Berita', endpoint: '/berita/cnbc', description: 'Search berita di cnbc news', params: ['key', 'query'], desc: 'masukkan genre berita yang kamu cari' },
    { category: 'Berita', endpoint: '/berita/cnn', description: 'Search berita di cnn news', params: ['key', 'query'], desc: 'masukkan genre berita yang kamu cari' },
    { category: 'Berita', endpoint: '/berita/okezone', description: 'Search berita di okezone news', params: ['key', 'query'], desc: 'masukkan genre berita yang kamu cari' },
    { category: 'Berita', endpoint: '/berita/republika', description: 'Search berita di republika news', params: ['key', 'query'], desc: 'masukkan genre berita yang kamu cari' },
    { category: 'Berita', endpoint: '/berita/suara', description: 'Search berita di suara news', params: ['key', 'query'], desc: 'masukkan genre berita yang kamu cari' },
    { category: 'Berita', endpoint: '/berita/zetizen', description: 'Search berita di zetizen news', params: ['key', 'query'], desc: 'masukkan genre berita yang kamu cari' },
    { category: 'Berita', endpoint: '/berita/wikipedia', description: 'Search berita di wikipedia', params: ['key', 'query'], desc: 'masukkan subjek berita yang kamu cari' },
    { category: 'Berita', endpoint: '/berita/kumparan', description: 'Search berita di kumparan news', params: ['key'], desc: 'search berita terbaru' },
    { category: 'Berita', endpoint: '/berita/vice', description: 'Search berita di vice news', params: ['key'], desc: 'search berita terpopuler' },
    { category: 'Berita', endpoint: '/berita/voa', description: 'Search berita di voa news', params: ['key'], desc: 'search berita terpanas' },
    { category: 'Berita', endpoint: '/berita/tribun', description: 'Search berita di tribun news', params: ['key', 'query', 'zone'], desc: 'search berita dengan zona cakup' },

    { category: 'Search', endpoint: '/search/playstore', description: 'Searching aplikasi playstore', params: ['key', 'query'], desc: 'Cari gane dan aplikasi favorit' },
    { category: 'Search', endpoint: '/search/bukalapak', description: 'Searching produk di bukalapak', params: ['key', 'query'], desc: 'Cari produk yang kamu inginkan' },
    { category: 'Search', endpoint: '/search/happymod', description: 'Searching aplikasi di happymod', params: ['key', 'query'], desc: 'Cari aplikasi favorit di happymod' },
    { category: 'Search', endpoint: '/search/sticker', description: 'Searching sticker whatsapp', params: ['key', 'query'], desc: 'Cari sticker untuk whatsapp' },
    { category: 'Search', endpoint: '/search/webtoons', description: 'Searching d webtoons', params: ['key', 'query'], desc: 'Cari komik favorit mu' },
    { category: 'Search', endpoint: '/search/resep', description: 'Searching resep masakan', params: ['key', 'query'], desc: 'Cari resep masakan kesukaan mu' },
    { category: 'Search', endpoint: '/search/seegore', description: 'Searching di seegore', params: ['key', 'query'], desc: 'Cari gore ekstime kesukaan mu' },
    { category: 'Search', endpoint: '/search/mangatoon', description: 'Searching di mangatoon', params: ['key', 'query'], desc: 'Cari manga favorit mu' },
    { category: 'Search', endpoint: '/search/wattpad', description: 'Searching di wattpad', params: ['key', 'query'], desc: 'Cari novel terpopuler' },
    { category: 'Search', endpoint: '/search/android1', description: 'Searching di android1', params: ['key', 'query'], desc: 'Cari game mod kesukaan mu' },
    { category: 'Search', endpoint: '/search/apkcombo', description: 'Searching di apkcombo', params: ['key', 'query'], desc: 'Cari game dan aplikasi terbaru' },
    { category: 'Search', endpoint: '/search/aptoide', description: 'Searching di aptoide', params: ['key', 'query'], desc: 'Cari aplikasi terbaik' },
    { category: 'Search', endpoint: '/search/tiktok', description: 'Searching di tiktok', params: ['key', 'query'], desc: 'Cari video tiktok' },
    { category: 'Search', endpoint: '/search/pinterest', description: 'Searching di pinterest', params: ['key', 'query'], desc: 'Cari foto di pinterest' },
    { category: 'Search', endpoint: '/search/gsm', description: 'Searching gsm', params: ['key', 'query'], desc: 'Cari gsm setiap device' },
    { category: 'Search', endpoint: '/search/mlbb', description: 'Searching akun mlbb', params: ['key', 'userId', 'zoneId'], desc: 'Cari status akun mobile legends mu' },
    { category: 'Search', endpoint: '/search/china', description: 'Searching berita china', params: ['key', 'query'], desc: 'Cari berita berbahasa china' },
    { category: 'Search', endpoint: '/search/film', description: 'Searching di filmapik', params: ['key', 'query'], desc: 'Cari film favorit mu' },
    { category: 'Search', endpoint: '/search/drakor', description: 'Searching di dramaqu', params: ['key', 'query'], desc: 'Cari drakor favorit mu' },
    { category: 'Search', endpoint: '/search/wallpaperhd', description: 'Searching wallpaper', params: ['key', 'query'], desc: 'Cari wallpaper hd 4k' },
    { category: 'Search', endpoint: '/search/cdnjs', description: 'Searching di cdnjs', params: ['key', 'query'], desc: 'Cari module, package, dan library javascript' },
    { category: 'Search', endpoint: '/search/amazon', description: 'Searching di amazon', params: ['key', 'query'], desc: 'Cari produk di amazon' },
    { category: 'Search', endpoint: '/search/chord', description: 'Searching di chord', params: ['key', 'query'], desc: 'Cari lirik lagu dan audio dari chord' },
    { category: 'Search', endpoint: '/search/spotify', description: 'Cari lagu di spotify', params: ['key', 'query'], desc: 'Cari lagu favoritmu di spotify music' },
    { category: 'Search', endpoint: '/search/sekolah-indonesia', description: 'Cari sekolahan yang ada di Indonesia', params: ['key', 'query'], desc: 'Cari nams sekolah di seluruh penjuru Indonesia' },
    
    { category: 'Primbon', endpoint: '/primbon/artinama', description: 'Fun ramalan arti nama', params: ['key', 'query'], desc: 'Mainkan fun ramalan arti nama kamu.' },
    { category: 'Primbon', endpoint: '/primbon/artimimpi', description: 'Fun ramalan arti mimpi', params: ['key', 'query'], desc: 'Mainkan fun ramalan arti mimpi yang kamu alami.' },
    { category: 'Primbon', endpoint: '/primbon/kecocokan-nama', description: 'Fun ramalan kecocokan nama', params: ['key', 'nama1', 'nama2'], desc: 'Mainkan fun ramalan kecocokan nama kamu dengan pasangan.' },
    { category: 'Primbon', endpoint: '/primbon/tanggal-jadian', description: 'Fun ramalan untuk tanggal jadian mu', params: ['key', 'id'], desc: 'Mainkan fun ramalan jadian, masukkan dalam format: hh-mm-yy' },
    { category: 'Primbon', endpoint: '/primbon/ramalan-rezeky', description: 'Fun ramalan rezeki sesuai tanggal mu', params: ['key', 'id'], desc: 'Mainkan fun ramalan rezeky nama kamu.' },
    { category: 'Primbon', endpoint: '/primbon/misteri-foto', description: 'Rahasia di balik foto-foto horror', params: ['key'], desc: 'Story singkat tentang foto-foto horror' },
    
    { category: 'Downloader', endpoint: '/downloader/aptoide', description: 'Downloader di aptoide ', params: ['key', 'id'], desc: 'Download aplikasi di aptoide' },
    { category: 'Downloader', endpoint: '/downloader/tiktok', description: 'Downloader di tiktok', params: ['key', 'url'], desc: 'Download video tiktok' },
    { category: 'Downloader', endpoint: '/downloader/capcut', description: 'Downloader di capcut', params: ['key', 'url'], desc: 'Download video capcut' },
    { category: 'Downloader', endpoint: '/downloader/instagram', description: 'Downloader di instagram', params: ['key', 'url'], desc: 'Download video instagram' },
    { category: 'Downloader', endpoint: '/downloader/snackvideo', description: 'Downloader di snackvideo', params: ['key', 'url'], desc: 'Download video snackvideo' },
    { category: 'Downloader', endpoint: '/downloader/facebook', description: 'Downloader di facebook', params: ['key', 'url'], desc: 'Download video facebook' }, 
    { category: 'Downloader', endpoint: '/downloader/mediafire', description: 'Downloader di mediafire', params: ['key', 'url'], desc: 'Download platform mediafire' },
    { category: 'Downloader', endpoint: '/downloader/pinterest', description: 'Downloader di pinterest', params: ['key', 'url'], desc: 'Download video dan foto pinterest' },
    { category: 'Downloader', endpoint: '/downloader/gdrive', description: 'Downloader di google drive', params: ['key', 'url'], desc: 'Download file google drive' },
    { category: 'Downloader', endpoint: '/downloader/videy', description: 'Downloader di videy', params: ['key', 'url'], desc: 'Download video videy' },
    { category: 'Downloader', endpoint: '/downloader/twitter', description: 'Downloader di twitter', params: ['key', 'url'], desc: 'Download video twitter' },
    { category: 'Downloader', endpoint: '/downloader/yt-video', description: 'Download video dari video youtube', params: ['key', 'url'], desc: 'Download video dari platform youtube' },
    { category: 'Downloader', endpoint: '/downloader/yt-audio', description: 'Download audio dari video youtube', params: ['key', 'url'], desc: 'Download audio dari platform youtube' },
    { category: 'Downloader', endpoint: '/downloader/douyin', description: 'Downloader di douyin', params: ['key', 'url'], desc: 'Download video douyin' },
    { category: 'Downloader', endpoint: '/downloader/github', description: 'Downloader di github', params: ['key', 'url'], desc: 'Download repository github' },
    { category: 'Downloader', endpoint: '/downloader/ytmp4-subtitle', description: 'Downloader video dan subtitle youtube', params: ['key', 'url'], desc: 'Download video, subtitle, ataupun thumbnail youtube' }, 
    { category: 'Downloader', endpoint: '/downloader/cobalt', description: 'All in one downloader', params: ['key', 'url'], desc: 'Download dari semua platform baik audio, gambar, ataupun video' },
    { category: 'Downloader', endpoint: '/downloader/spotify', description: 'Download musik spotify', params: ['key', 'url'], desc: 'Download music audio dari spotify' },
  
    { category: 'Islamic', endpoint: '/islamic/juz', description: 'Cari surah per-juz', params: ['key', 'id'], desc: 'Cari surah yang ada di juz al-quran' },
    { category: 'Islamic', endpoint: '/islamic/jadwalsholat', description: 'Informasi jadwal sholat', params: ['key', 'query'], desc: 'Informasi jadwal sholat di setiap kota' },
    
    { category: 'Tools', endpoint: '/tools/encrypt', description: 'Tools encrypt code', params: ['key', 'query'], desc: 'tools encrypt code javascript' },
    { category: 'Tools', endpoint: '/tools/boldtext', description: 'Tools bold text', params: ['key', 'query'], desc: 'Tools style tebal text' },
    { category: 'Tools', endpoint: '/tools/tts', description: 'Tools text to speech', params: ['key', 'query'], desc: 'Tools pengubah text menjadi audio' },
    { category: 'Tools', endpoint: '/tools/txt2biner', description: 'Tools text ke biner', params: ['key', 'query'], desc: 'Tools convert text ke code biner' },
    { category: 'Tools', endpoint: '/tools/biner2txt', description: 'Tools biner ke text', params: ['key', 'query'], desc: 'Tools convert code biner ke text' },
    { category: 'Tools', endpoint: '/tools/txt2morse', description: 'Tools text ke morse', params: ['key', 'query'], desc: 'Tools convert text ke bahasa morse' },
    { category: 'Tools', endpoint: '/tools/morse2text', description: 'Tools morse ke text', params: ['key', 'query'], desc: 'Tools convert bahasa morse ke text' },
    { category: 'Tools', endpoint: '/tools/lirik', description: 'Cari lirik lagu apa saja', params: ['key', 'query'], desc: 'Cari lirik lagu favorit mu.' },
    { category: 'Tools', endpoint: '/tools/pastebin', description: 'Publish code dan teks di pastebin', params: ['key', 'title', 'content'], desc: 'Buat code atau teks mu publish di browser.' },
    { category: 'Tools', endpoint: '/tools/readqr', description: 'Tools readqr', params: ['key', 'url'], desc: 'Tools pembaca qr code dari url' },
    { category: 'Tools', endpoint: '/tools/link2qr', description: 'Tools link ke qr', params: ['key', 'url'], desc: 'Tools convert link ke code qr' },
    { category: 'Tools', endpoint: '/tools/txt2hex', description: 'Tools text ke hexadecimal', params: ['key', 'query'], desc: 'Tools convert text ke code hexadecimal' },
    { category: 'Tools', endpoint: '/tools/hex2txt', description: 'Tools hexadecimal ke text', params: ['key', 'query'], desc: 'Tools convert code hexadecimal ke text' },
    { category: 'Tools', endpoint: '/tools/removebg', description: 'Tools remove background', params: ['key', 'url'], desc: 'Tools remove background gambar' },
    { category: 'Tools', endpoint: '/tools/carbon', description: 'Percantik code dengan carbon', params: ['key', 'query'], desc: 'Hiasan agar code mu lebih cantik' },
    { category: 'Tools', endpoint: '/tools/sswebphone', description: 'Ambil screenshot website mode handphone', params: ['key', 'url'], desc: 'Tangkap layar website dalam mode handphone' },
    { category: 'Tools', endpoint: '/tools/sswebtab', description: 'Ambil screenshot website mode tablet', params: ['key', 'url'], desc: 'Tangkap layar website dalam mode tablet' },
    { category: 'Tools', endpoint: '/tools/sswebdesktop', description: 'Ambil screenshot website mode desktop', params: ['key', 'url'], desc: 'Tangkap layar website dalam mode desktop' },
    { category: 'Tools', endpoint: '/tools/cekip', description: 'Stalk ip dengan lengkap dan detail', params: ['key', 'id'], desc: 'Cek ip dan dapatkan detail lengkap nya.' },
    { category: 'Tools', endpoint: '/tools/html2img', description: 'Convert code html menjadi gambar', params: ['key', 'query'], desc: 'Ubah dan priview code html mu menjadi gambar' },

    { category: 'Flaming Text', endpoint: '/flamingtext/fluffy', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/comics', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/crafts', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/retro', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/beehive', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/art-deco', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/jukebox', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/heavy-metal', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/big-love', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/neon', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/good-times', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/closed', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/gamezone', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/matrix', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/star-wars', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/godzilla', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/san-andreas', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/ironic-maiden', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/motormouth', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/water', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/runner', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/blackbird', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/smurfs', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/alien-glow', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/beauty', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/minions', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/crazy', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/spider-men', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/football', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    { category: 'Flaming Text', endpoint: '/flamingtext/skate', description: 'Style text ke gambar', params: ['key', 'query'], desc: 'Buat logo hanya dengan text' },
    
    { category: 'Ephoto360', endpoint: '/ephoto360/writetext', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/blackpinklogo', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/glitchtext', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/advancedglow', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/typographytext', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/pixelglitch', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/neonglitch', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/flag', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/flag2', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/deletingtext', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/blackpinkstyle', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/glowingtext', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/underwater', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/logomaker', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/cartoonstyle', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/papercut', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/watercolor', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/effectclouds', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/gradienttext', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/summerbeach', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/luxurygold', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/multicolored', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/sandsummer', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/galaxy', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/1917style', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/makingneon', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/royaltext', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/texteffect', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/galaxystyle', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    { category: 'Ephoto360', endpoint: '/ephoto360/lighteffect', description: 'Style text ke gambar 3d', params: ['key', 'query'], desc: 'Buat logo 3d hanya dengan text' },
    
    { category: 'Server', endpoint: '/server/stats', description: 'Informasi statistik server', params: [], desc: 'Melakukan cek statistik server' },
];

document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const menu = document.querySelector('nav');
            const menuItems = document.querySelectorAll('nav a');
            const notificationIcon = document.getElementById('notificationIcon');
            const popupMenu = document.getElementById('popupMenu');
            const closePopup = document.getElementById('closePopup');

            menuToggle.addEventListener('click', function() {
                menu.classList.toggle('slide');
                menuToggle.classList.toggle('active');
            });

            notificationIcon.addEventListener('click', function() {
                popupMenu.style.display = 'flex'; // Show the popup menu
            });

            closePopup.addEventListener('click', function() {
                popupMenu.style.display = 'none'; // Hide the popup menu
            });

            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    menuItems.forEach(item => {
                        item.style.color = '#fff';
                    });
                    this.style.color = 'yellow';

                    setTimeout(() => {
                        this.style.color = '#fff';
                    }, 100);
                });
            });

            menu.classList.remove('slide');
        });

document.addEventListener('DOMContentLoaded', function() {
  const loadingOverlay = document.getElementById('pageLoadingOverlay');
  
  // Sembunyikan loading overlay setelah halaman selesai dimuat
  window.addEventListener('load', function() {
    setTimeout(function() {
      loadingOverlay.style.opacity = '0';
      setTimeout(function() {
        loadingOverlay.style.display = 'none';
      }, 100);
    }, 3000);
  });
});

function showLoading() {
  document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('show');
}

// Fungsi untuk mengelompokkan endpoint berdasarkan kategori
function groupEndpointsByCategory() {
    return apiEndpoints.reduce((groups, endpoint) => {
        (groups[endpoint.category] = groups[endpoint.category] || []).push(endpoint);
        return groups;
    }, {});
}

// Fungsi untuk menghasilkan konten grup
function generateGroupContent(category, endpoints) {
    let content = `
        <div class="api-group">
            <div class="group-header" onclick="toggleGroup('${category}')">
                <h2>${category}</h2>
                <button class="expand-btn" id="expandBtn${category}">+</button>
            </div>
            <div class="group-content" id="groupContent${category}">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Endpoint</th>
                                <th>Deskripsi</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    endpoints.forEach((endpoint, index) => {
        content += `
            <tr>
                <td>${endpoint.endpoint}</td>
                <td class="api-description">${endpoint.description}</td>
                <td><button class="btn-check" onclick="checkAPI('${category}', ${index})">Cek API</button></td>
            </tr>
        `;
    });

    content += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    return content;
}

// Fungsi untuk mengisi konten dengan grup-grup API
function populateGroups() {
    const groupsContainer = document.getElementById('apiGroups');
    const groups = groupEndpointsByCategory();

    let groupsContent = '';
    for (const [category, endpoints] of Object.entries(groups)) {
        groupsContent += generateGroupContent(category, endpoints);
    }

    groupsContainer.innerHTML = groupsContent;
}

// Fungsi untuk toggle expand/collapse grup
function toggleGroup(category) {
    const content = document.getElementById(`groupContent${category}`);
    const expandBtn = document.getElementById(`expandBtn${category}`);
    const isExpanding = !content.classList.contains('expanded');
    
    content.classList.toggle('expanded');
    expandBtn.textContent = isExpanding ? '-' : '+';

    if (!isExpanding) {
        // Jika sedang menutup (minimize), atur scroll ke posisi awal
        const groupElement = content.closest('.api-group');
        if (groupElement) {
            groupElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Fungsi untuk memeriksa API
function checkAPI(category, index) {
    const groups = groupEndpointsByCategory();
    const endpoint = groups[category][index];
    showParamPopup(endpoint, 'GET', index);
}

// Fungsi untuk menampilkan popup parameter
function showParamPopup(endpoint, method, index) {
    const paramInputs = document.getElementById('paramInputs');
    paramInputs.innerHTML = '';

    endpoint.params.forEach(param => {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = param;
        input.placeholder = param;
        input.required = true;
        paramInputs.appendChild(input);
    });

    const paramForm = document.getElementById('paramForm');
    paramForm.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(paramForm);
        const params = Object.fromEntries(formData.entries());
        performAPICheck(endpoint, method, params);
    };

    // Tambahkan keterangan endpoint
    const descriptionElement = document.getElementById('endpointDescription');
    descriptionElement.innerHTML = `
        <h3>Keterangan Endpoint:</h3>
        <p>${endpoint.desc}</p>
    `;

    document.getElementById('paramPopupOverlay').style.display = 'flex';
}

// Fungsi untuk melakukan pengecekan API
function performAPICheck(endpoint, method, params) {
    let apiUrl = `https://api.shannmoderz.xyz${endpoint.endpoint}`;
    
    // Tambahkan parameter ke URL untuk method GET
    const queryParams = new URLSearchParams(params).toString();
    apiUrl += queryParams ? `?${queryParams}` : '';

    const statusElement = document.getElementById('apiStatus');
    const currentLinkElement = document.getElementById('currentLink');
    statusElement.innerHTML = '';
    statusElement.className = '';
    currentLinkElement.innerHTML = `${apiUrl}`;

    closeParamPopup();
    document.getElementById('resultPopupOverlay').style.display = 'flex';

    // Tampilkan loading
    showLoading();

    // Implementasi fetch
    fetch(apiUrl, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        hideLoading(); // Sembunyikan loading setelah data diterima
        statusElement.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        statusElement.className = 'success';
    })
    .catch(error => {
        hideLoading(); // Sembunyikan loading jika terjadi error
        statusElement.innerHTML = `<pre>Error: ${error.message}</pre>`;
        statusElement.className = 'error';
    });
}

function closeParamPopup() {
    document.getElementById('paramPopupOverlay').style.display = 'none';
}

function closeResultPopup() {
    document.getElementById('resultPopupOverlay').style.display = 'none';
}

// Fungsi untuk menutup popup
function closePopup() {
    const popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.style.display = 'none';
}

// Panggil fungsi untuk mengisi grup-grup saat halaman dimuat
document.addEventListener('DOMContentLoaded', populateGroups);

// Tambahkan event listener untuk menutup popup saat mengklik di luar konten popup
document.addEventListener('click', function(event) {
    const popupOverlay = document.getElementById('popupOverlay');
    const popupContent = document.getElementById('popupContent');
    if (event.target === popupOverlay && !popupContent.contains(event.target)) {
        closePopup();
    }
});
