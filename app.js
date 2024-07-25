require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Course = require('./models/course');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, checkTeacher } = require('./middleware/authMiddleware');

// express app
const app = express();

const PORT = process.env.PORT || 3030;

// connect to mongodb
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log('server started on port ${PORT}');
});

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded( { extended: true}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// routes
app.get('*', checkUser);
app.post('*', checkUser);
app.get('/', (req, res) =>{
    res.render('index', {title: 'Home'})
});

// schedule route
app.get('/schedule', requireAuth, checkTeacher, (req, res) =>{
    const userID = req.userID;
    console.log(userID);

    // Sentinel to prevent manual access
    if (req.isTeacher === true) {
        res.redirect('/');
    }

    // Lookup user by ID and use their schedule to lookup the relevant course data from the courses collection
    User.findById(userID)
    .then((result)=> {        
        Course.find({'_id' : { $in: result.schedule }}).sort({ code: 'asc'})
        .then((result)=> {

            // Send filtered courses as a schedule along with the response
            res.render('schedule', {title: 'Your Schedule', schedule: result})
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
    }); 
});

// create route
app.get('/create', requireAuth, checkTeacher, (req, res) => { 
    if (req.isTeacher === true) {
        res.render('create', { title: 'Create New Courses' });
    } else {
        res.redirect('/');
    };
});

// update route
app.get('/update', requireAuth, checkTeacher, (req, res) => { 
    if (req.isTeacher === true) {
        Course.find().sort({ code: 'asc'})
        .then((result)=> {
            res.render('update', { title: 'Edit Existing Courses', courses: result });
        })
        .catch((err) => {
            console.log(err);
        });        
    } else {
        res.redirect('/');
    };
});

// course routes
app.use(courseRoutes);

// auth routes
app.use(authRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
}); 