const express = require('express');

const morgan = require('morgan');

const app = express();


app.set('view engine', 'ejs');

app.listen(3000);

app.use(express.static('public'));

app.use(morgan('dev'));

app.get('/', (req, res) =>{
    const classes = [
        {title: 'Gaming', snippet: 'A class that teaches people to game.'},
        {title: 'Website Development', snippet: 'A class that teaches how to build a website.'},
        {title: 'Graphic Design', snippet: 'A class that teaches graphically centered deisgning'},
    ];
    res.render('index', { title: 'Home', classes });
});

app.get('/classes', (req, res) =>{
    res.render('classes', { title: 'Classes' });
});

app.get('/classes/create', (req, res) => {
    res.render('create', { title: 'Create a new Class' });
})

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});