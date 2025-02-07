const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log('Token recibido:', req.header('Authorization')); // Verificar el token recibido

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Contenido del token verificado:', verified); // Verificar el contenido del token
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token inválido' });
    }
};

module.exports = { verifyToken };
