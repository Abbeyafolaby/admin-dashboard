import jwt from 'jsonwebtoken';

const signAccessToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
}

const signRefreshToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
}

const verifyAccessToken = (token, secret) => {
    return jwt.verify(token, secret);
}

const verifyRefreshToken = (token, secret) => {
    return jwt.verify(token, secret);
}

export {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};
