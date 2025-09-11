import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import ms from 'ms' // optional helper; if not installed, parse durations manually


import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
} from '../utils/token.js';

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

    if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error('Set ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET in environment');
    }

    const signup = async (req, res) => {
    // validation handled in route; still check
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already registered' });

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, passwordHash, role: 'user' });

        // Do not issue tokens on signup by default (optional). Here we return 201 with user id.
        return res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
    };

    const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role }, ACCESS_SECRET, ACCESS_EXPIRES);
        const refreshToken = signRefreshToken({ sub: user._id.toString() }, REFRESH_SECRET, REFRESH_EXPIRES);

        // calculate expiry date for refresh in DB
        const refreshExpiry = new Date(Date.now() + ms(REFRESH_EXPIRES || '7d'));

        await RefreshToken.create({
        token: refreshToken,
        user: user._id,
        expiresAt: refreshExpiry,
        });

        // Return both tokens. Client should store refresh token securely (e.g. httpOnly cookie).
        return res.json({
        accessToken,
        expiresIn: ACCESS_EXPIRES,
        refreshToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const refreshAccessToken = async (req, res) => {
  // Expect client to provide the refresh token in the body (or Authorization header) — we accept both.
    const supplied = req.body.refreshToken || req.headers['x-refresh-token'];

        if (!supplied) return res.status(400).json({ message: 'Refresh token required' });

        try {
        // verify signature
        const payload = verifyRefreshToken(supplied, REFRESH_SECRET);

        // check DB for token (so we can invalidate)
        const stored = await RefreshToken.findOne({ token: supplied, user: payload.sub });
        if (!stored) return res.status(401).json({ message: 'Invalid refresh token' });

        // optionally check stored.expiresAt > now
        if (new Date() > stored.expiresAt) {
            await stored.deleteOne();
            return res.status(401).json({ message: 'Refresh token expired' });
        }

        // issue new access token
        const user = await User.findById(payload.sub);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role }, ACCESS_SECRET, ACCESS_EXPIRES);

        return res.json({ accessToken, expiresIn: ACCESS_EXPIRES });
        } catch (err) {
            console.error('refresh error', err);
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
};

const logout = async (req, res) => {
    // Expect client to provide refresh token to invalidate
    const supplied = req.body.refreshToken || req.headers['x-refresh-token'];
    if (!supplied) return res.status(400).json({ message: 'Refresh token required' });

    try {
        await RefreshToken.findOneAndDelete({ token: supplied });
        return res.json({ message: 'Logged out' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export {
    signup,
    login,
    refreshAccessToken,
    logout  
};