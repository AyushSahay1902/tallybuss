const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'secret000';

const authenticateJwt = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            req.decoded = decoded;
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
};

module.exports = {
    authenticateJwt,
    SECRET,
};