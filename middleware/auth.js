const jwt = require('jsonwebtoken');

const config = require('config');



module.exports = (req, res, next) => {

    // check token 
    const token = req.header('x-auth-token');
    console.log("token", token)

    if (!token) {
        return res.status(401).json({ msg: "No token, Authentication denied" })
    }

    // verify tokens
    jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: 'token is not valid' })
        }
        req.user = decoded.user;
        next();
    });

}