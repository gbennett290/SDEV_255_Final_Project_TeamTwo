const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'Team 2 Secret', async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                req.userID = decodedToken.id;
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

// check teacher
const checkTeacher = (req, res, next) => {
    const token = req.cookies.jwt;
    req.isTeacher = false;

    if (token) {
        jwt.verify(token, 'Team 2 Secret', async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                next();
            }
            else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);                       
                req.isTeacher = user.isTeacher;
                next();
            }
        });
    }
    else {
        console.log('checkTeacher no token');
        next();
    }
}

module.exports = { requireAuth, checkUser, checkTeacher };