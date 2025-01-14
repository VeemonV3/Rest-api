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
let startTime;
    let totalRequests;
    let memoryUsage;
    let cpuUsage;

    function formatUptime(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        seconds %= 3600 * 24;
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

   function updateUserCounts() {
    fetch('/auth/user-counts') // Ganti dengan endpoint yang sesuai
        .then(response => response.json())
        .then(data => {
            const freeCount = data.free || 0;
            const premiumCount = data.premium || 0;
            const vipCount = data.vip || 0;
            const AlCount = data.alifetime || 0;

            document.getElementById('freeCount').textContent = freeCount;
            document.getElementById('premiumCount').textContent = premiumCount;
            document.getElementById('vipCount').textContent = vipCount;
            document.getElementById('AlCount').textContent = AlCount;
        })
        .catch(error => {
            console.error('Error fetching user counts:', error);
            document.getElementById('freeCount').textContent = 'Error loading';
            document.getElementById('premiumCount').textContent = 'Error loading';
            document.getElementById('vipCount').textContent = 'Error loading';
            document.getElementById('AlCount').textContent = 'Error loading';
        });
}

// Call the function to update user counts when the page loads
document.addEventListener('DOMContentLoaded', updateUserCounts);

    function updateUptime() {
        if (startTime) {
            const currentTime = new Date().getTime();
            const uptime = (currentTime - startTime) / 1000; // in seconds
            document.getElementById('uptime').textContent = formatUptime(uptime);
        }
    }
    
    // Fungsi untuk menampilkan popup saat halaman dimuat
    window.onload = function() {
        const overlay = document.getElementById('overlay');
        const popup = document.getElementById('popup');

        overlay.style.display = 'block';
        popup.style.display = 'block';

        // Menggunakan timeout untuk memberikan efek transisi
        setTimeout(() => {
            popup.style.transform = 'translate(-50%, -50%) scale(1)'; // Skala 1 untuk muncul
            popup.style.opacity = '1'; // Opacity 1 untuk muncul
        }, 10); // Delay kecil untuk memicu transisi
    };

    function redirectPage() {
    window.location.href = "/"; // Ganti dengan URL tujuan
}

document.getElementById("href-b").addEventListener("click", redirectPage);


    function closePopup() {
        const popup = document.getElementById('popup');

        // Mengubah opacity dan skala sebelum menyembunyikan
        popup.style.transform = 'translate(-50%, -50%) scale(0)'; // Skala 0 untuk hilang
        popup.style.opacity = '0'; // Opacity 0 untuk hilang

        // Menyembunyikan overlay dan popup setelah transisi
        setTimeout(() => {
            document.getElementById('overlay').style.display = 'none';
            popup.style.display = 'none';
        }, 300); // Waktu yang sama dengan durasi transisi
    }

    function updateStats() {
        fetch('/server/stats')
            .then(response => response.json())
            .then(data => {
                if (!startTime) {
                    startTime = new Date().getTime() - (data.uptimeRaw * 1000);
                }

                if (totalRequests !== data.totalRequests) {
                    totalRequests = data.totalRequests;
                    document.getElementById('totalRequests').textContent = totalRequests.toLocaleString();
                }

                const memoryUsed = data.memoryUsage.heapUsed / 1024 / 1024;
                const memoryTotal = data.memoryUsage.heapTotal / 1024 / 1024;
                const memoryUsageText = `${memoryUsed.toFixed(2)} MB / ${memoryTotal.toFixed(2)} MB`;
                if (memoryUsage !== memoryUsageText) {
                    memoryUsage = memoryUsageText;
                    document.getElementById('memoryUsage').textContent = memoryUsage;
                    
                    const memoryPercentage = (memoryUsed / memoryTotal) * 100;
                    document.getElementById('memoryBar').style.width = `${memoryPercentage}%`;
                }

                const cpuUser = data.cpuUsage.user / 1000000;
                const cpuSystem = data.cpuUsage.system / 1000000;
                const cpuUsageText = `User: ${cpuUser.toFixed(2)}s, System: ${cpuSystem.toFixed(2)}s`;
                if (cpuUsage !== cpuUsageText) {
                    cpuUsage = cpuUsageText;
                    document.getElementById('cpuUsage').textContent = cpuUsage;
                }
            })
            .catch(error => console.error('Error fetching stats:', error));
    }

    // Update uptime every second
    setInterval(updateUptime, 1000);

    // Fetch other stats every 5 seconds
    updateStats();
    setInterval(updateStats, 5000);

function showLoading() {
  document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('show');
}

// Fungsi untuk mengupdate status baterai
function updateBatteryStatus() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            function updateAllBatteryInfo() {
                updateBatteryInfos(battery);
            }
            updateAllBatteryInfo();
            battery.addEventListener('chargingchange', updateAllBatteryInfo);
            battery.addEventListener('levelchange', updateAllBatteryInfo);
        });
    } else {
        document.getElementById('batteryStatus').textContent = 'Informasi baterai tidak tersedia';
    }
}

function updateBatteryInfos(battery) {
    const batteryLevel = Math.round(battery.level * 100);
    const chargingStatus = battery.charging ? 'Sedang mengisi' : 'Tidak mengisi';
    document.getElementById('batteryStatus').textContent = `${batteryLevel}% (${chargingStatus})`;
}

// Panggil fungsi updateBatteryStatus saat halaman dimuat
document.addEventListener('DOMContentLoaded', updateBatteryStatus);

// Update status baterai setiap 30 detik
setInterval(updateBatteryStatus, 30000);
