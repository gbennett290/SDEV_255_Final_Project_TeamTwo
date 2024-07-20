require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Course = require('./models/course');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

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
app.get('/', (req, res) =>{
    Course.find().sort({ code: 'asc'})
    .then((result)=> {
        res.render('index', {title: 'Your Courses', courses: result})
    })
    .catch((err) => {
        console.log(err);
    }); 
});

// course routes
app.get('/courses', (req, res) =>{
    Course.find().sort({ code: 'asc'})
    .then((result)=> {
        res.render('courses', {title: 'Course Index', courses: result})
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post('/courses', (req,res) => {
    const course = new Course(req.body);
    course.save()
        .then((result) => {
            res.redirect('/courses');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/courses/create', (req, res) => {
    res.render('create', { title: 'Edit or Create New Courses' });
})

app.get('/courses/:id', (req, res) => {
    const id = req.params.id;

    Course.findById(id)
        .then((result) => {
            res.render('details', { course: result, title: 'Course Details'})
        })
        .catch((err) => {
            console.log(err);
        });
});

app.delete('/courses/:id', (req, res) => {
    const id = req.params.id;

    Course.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/courses'})
        })
        .catch(err => {
            console.log(err);
        });
});

// auth routes
app.use(authRoutes);

// signin routes
app.get('/signin', (req, res) => {
    res.render('signin', { title: 'Sign In' });
})

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});




// I think we need to make the log in page the index or main, then once they login they should be able to (using requireAuth funciton) access the your courses page and course index  and add course pages. Video number 15 about 9 minutes in is location to follow requireAuth paths.
 
// check line 36, this is what we need to do for student/teachers validation to make each page accessible by just their respective parts (video 18)