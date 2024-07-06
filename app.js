const express = require('express');

const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 3030;

//Replace with database connection in Module 6
const classes = [
    {title: 'Game Development', snippet: 'A class that teaches the process of game development.  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus orci sed purus finibus, sit amet lobortis neque laoreet. Suspendisse pretium placerat mollis. Maecenas venenatis elit vitae nunc convallis elementum. Duis euismod quis mauris id cursus. Sed euismod cursus dapibus. Mauris aliquam magna dui, ut. '},
    {title: 'Website Development', snippet: 'A class that teaches how to build a website.  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus orci sed purus finibus, sit amet lobortis neque laoreet. Suspendisse pretium placerat mollis. Maecenas venenatis elit vitae nunc convallis elementum. Duis euismod quis mauris id cursus. Sed euismod cursus dapibus. Mauris aliquam magna dui, ut. '},
    {title: 'Graphic Design', snippet: 'A class that teaches graphically centered design.  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus orci sed purus finibus, sit amet lobortis neque laoreet. Suspendisse pretium placerat mollis. Maecenas venenatis elit vitae nunc convallis elementum. Duis euismod quis mauris id cursus. Sed euismod cursus dapibus. Mauris aliquam magna dui, ut. '},
    {title: 'Calculus', snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus orci sed purus finibus, sit amet lobortis neque laoreet. Suspendisse pretium placerat mollis. Maecenas venenatis elit vitae nunc convallis elementum. Duis euismod quis mauris id cursus. Sed euismod cursus dapibus. Mauris aliquam magna dui, ut. '},
    {title: 'Data Security', snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus orci sed purus finibus, sit amet lobortis neque laoreet. Suspendisse pretium placerat mollis. Maecenas venenatis elit vitae nunc convallis elementum. Duis euismod quis mauris id cursus. Sed euismod cursus dapibus. Mauris aliquam magna dui, ut. '}
];

app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log('server started on port ${PORT}');
});

app.use(express.static('public'));

app.use(morgan('dev'));

app.get('/', (req, res) =>{
    res.render('index', { title: 'Your Courses', classes });
});

app.get('/classes', (req, res) =>{
    res.render('classes', { title: 'Course List', classes });
});

app.get('/classes/create', (req, res) => {
    res.render('create', { title: 'Edit or Create New Courses' });
})

app.get('/classes/signin', (req, res) => {
    res.render('signin', { title: 'Sign In' });
})

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});