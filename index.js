const express = require('express');
const logger = require('pino')();
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Pet-R-Us Home'
    });
})

app.get('/grooming', (req, res) => {
    res.render('grooming', {
        title: 'Pets-R-Us Grooming Services'
    });
})

app.listen(PORT, () => {
    console.info(`Listening on port ${PORT}`)
})