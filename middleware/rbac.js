
// usage: rbac(['admin','manager']) or rbac(['admin'])
const rbac = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Authentication required' });
        const userRole = req.user.role;
        if (!allowedRoles || allowedRoles.length === 0) return next();
        if (!allowedRoles.includes(userRole)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
        next();
    };
};

export default rbac;