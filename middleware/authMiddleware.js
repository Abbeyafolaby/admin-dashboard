import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET not set');
}

const authMiddleware = (requiredRoles = []) => {
    return (req, res, next) => {
        const header = req.headers['authorization'];
        if (!header) return res.status(401).json({ message: 'Authorization header required' });

        const parts = header.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Malformed Authorization header' });

        const token = parts[1];

        try {
        const payload = jwt.verify(token, ACCESS_SECRET);
        req.user = { id: payload.sub, role: payload.role || payload?.r }; // preserve role
        if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient role' });
        }
        next();
        } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
}

export default authMiddleware;
