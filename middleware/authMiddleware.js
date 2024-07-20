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
                let user = await User.findById(decodedToken.id)
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
const checkTeacher = (req, res) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'Team 2 Secret', async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
            }
            else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                
            }
        });
        console.log(user);
        return false;
    }
    else {
        console.log('checkTeacher no token');
    }


}

module.exports = { requireAuth, checkUser, checkTeacher };

// if (user.isTeacher === true) {
    //console.log('this is a teacher')
   // return true;
//}
//else {
 //   return false;
//}