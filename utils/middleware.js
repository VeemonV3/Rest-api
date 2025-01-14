const config = require('../config/config');
const msg = config.messages;
const admin = require('firebase-admin');
const db = admin.database();

const forPrem = async (req, res, next) => {
    const apiKey = req.query.key;

    if (!apiKey) {
        return res.status(400).json({ status: false, code: 400, author: config.author, result: msg.key });
    }

    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('apiKey').equalTo(username).once('value');

    if (!snapshot.exists()) {
        return res.status(404).json({ status: false, code: 404, author: config.author, result: 'ApiKey not found' });
    }

    let userStatus;
    snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        userType = user.accountType;
    });

    if (userType === 'premium') {
        next();
    } else {
        return res.status(403).json({ status: false, code: 403, author: config.author, result: 'Access Denied : Kamu bukan user Premium' });
    }
};

const forVip = async (req, res, next) => {
    const apiKey = req.query.key;

    if (!apiKey) {
        return res.status(400).json({ status: false, code: 400, author: config.author, result: msg.key });
    }

    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('apiKey').equalTo(username).once('value');

    if (!snapshot.exists()) {
        return res.status(404).json({ status: false, code: 404, author: config.author, result: 'ApiKey not found' });
    }

    let userStatus;
    snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        userType = user.accountType;
    });

    if (userType === 'vip') {
        next();
    } else {
        return res.status(403).json({ status: false, code: 403, author: config.author, result: 'Access Denied : Kamu bukan user VIP' });
    }
};

const forAdmin = async (req, res, next) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');

    if (!snapshot.exists()) {
        return res.status(404).json({ message: 'User not found' });
    }

    let userStatus;
    snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        userStatus = user.status;
    });

    if (userStatus === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied: You are not an admin' });
    }
};

const keyy = async (req, res, next) => {
    const apiKey = req.query.key;

    if (!apiKey) {
        return res.status(400).json({ status: false, code: 400, author: config.author, result: msg.key });
    }

    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('apiKey').equalTo(apiKey).once('value');

    if (!snapshot.exists()) {
        return res.status(401).json({ status: false, code: 403, author: config.author, result: 'ApiKey not found' });
    }

    let user;
    snapshot.forEach((childSnapshot) => {
        user = childSnapshot.val();
        user.id = childSnapshot.key;
    });

    if (user.requestLimit <= 0) {
        return res.status(403).json({ status: false, code: 403, author: config.author, result: msg.limit });
    }

    await db.ref(`users/${user.id}`).update({
        requestLimit: user.requestLimit - 1,
    });

    next();
};

module.exports = { forAdmin, keyy, forVip, forPrem }
