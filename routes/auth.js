const express = require('express');
const router = express.Router();
const requestIp = require('request-ip');
const admin = require('firebase-admin');
const db = admin.database();

function psswd(length) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * uppercase.length);
        password += uppercase[randomIndex];
    }
    return ('SRA-' + password);
}

router.get('/user-counts', async (req, res) => {
    const usersSnapshot = await db.ref('users').once('value');
    let freeCount = 0;
    let premiumCount = 0;
    let vipCount = 0;
    let AlCount = 0;

    usersSnapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        if (user.accountType === 'free') {
            freeCount++;
        } else if (user.accountType === 'premium') {
            premiumCount++;
        } else if (user.accountType === 'vip') {
            vipCount++;
        } else if (user.accountType === 'alifetime') {
            AlCount++;
        }
    });

    res.json({ free: freeCount, premium: premiumCount, vip: vipCount, alifetime: AlCount });
});

router.get('/my', async (req, res) => {
    const apiKey = req.query.key; // Mengambil apiKey dari query parameter

    if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
    }

    try {
        // Ambil semua data pengguna dari database
        const usersSnapshot = await db.ref('users').once('value');
        let userFound = null;

        // Iterasi melalui setiap pengguna untuk mencari yang sesuai dengan apiKey
        usersSnapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            if (user.apiKey === apiKey) {
                user.id = childSnapshot.key; // Menyimpan ID pengguna
                userFound = user; // Menyimpan pengguna yang ditemukan
            }
        });

        if (userFound) {
            // Mengembalikan detail pengguna yang ditemukan
            res.status(200).json(userFound);
        } else {
            // Jika tidak ada pengguna yang ditemukan dengan apiKey tersebut
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const userRef = db.ref('users').push();
    const apiKey = psswd(6);

    await userRef.set({
        username,
        password,
        status: 'user',
        apiKey: apiKey,
        requestLimit: 500,
        accountType: 'free'
    });

    // Ambil semua data pengguna setelah registrasi
    const usersSnapshot = await db.ref('users').once('value');
    const users = [];
    usersSnapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        user.id = childSnapshot.key; // Menyimpan ID pengguna
        users.push(user);
    });

    const newUser = {
        username,
        status: 'user',
        apiKey: apiKey,
        requestLimit: 500,
        accountType: 'free'
    };

    res.status(201).json([newUser]); // Return the new user data
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const usersRef = db.ref('users');

    usersRef.once('value', (snapshot) => {
        let userFound = false;
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            if (user.username === username && user.password === password) {
                userFound = true;

                // Ambil semua data pengguna setelah login
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    user.id = childSnapshot.key; // Menyimpan ID pengguna
                    users.push(user);
                });

                const userData = {
                    username: user.username,
                    status: user.status,
                    apiKey: user.apiKey,
                    requestLimit: user.requestLimit,
                    accountType: user.accountType
                };

                res.status(200).json([userData]); // Return user data
            }
        });
        if (!userFound) {
            res.status(401).send({ message: 'Username Tidak Ditemukan!' });
        }
    });
});

// Endpoint untuk mengubah status API key
router.post('/update-status', async (req, res) => {
    const { username, type, limit, status, apikey } = req.body; // Menerima username, status, limit, dan expired
    const usersRef = db.ref('users');

    usersRef.once('value', async (snapshot) => {
        let userFound = false;
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            if (user.username === username) {
                userFound = true;

                // Update data pengguna
                childSnapshot.ref.update({
                    accountType: type,
                    requestLimit: limit,
                    status: status,
                    apiKey: apikey,
                });

                res.status(200).send({ message: `User status updated to ${type}` });
            }
        });
        if (!userFound) {
            res.status(404).send({ message: 'User not found' });
        }
    });
});

// Endpoint untuk menghapus semua data pengguna berdasarkan username
router.delete('/delete-user/:username', async (req, res) => {
    const { username } = req.params;
    const usersRef = await db.ref('users');

    usersRef.once('value', async (snapshot) => {
        let userFound = false;
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            if (user.username === username) {
                userFound = true;
                childSnapshot.ref.remove(); // Hapus data pengguna
                res.status(200).send({ message: 'User deleted successfully' });
            }
        });
        if (!userFound) {
            res.status(404).send({ message: 'User not found' });
        }
    });
});

// Endpoint untuk mendapatkan semua data pengguna
router.get('/get-users', async (req, res) => {
    const usersSnapshot = await db.ref('users').once('value');
    const users = [];
    usersSnapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        user.id = childSnapshot.key; // Menyimpan ID pengguna
        users.push(user);
    });

    res.status(200).json(users); // Mengembalikan semua data pengguna dalam format JSON
});

module.exports = router;
