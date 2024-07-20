const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token existed * is verified
    if (token) {
        jwt.verify(token, 'Team 2 Secret', (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/');
            }
            else {
                console.log(decodedToken);
                next();
            }
        })
    }
    else {
        res.redirect('/');
    }
}
module.exports = { requireAuth };