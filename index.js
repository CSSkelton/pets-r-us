const express = require('express');
const logger = require('pino')();
const path = require('path');
const Customer = require('./models/customer');

//DB Connection
var mongoose = require('mongoose');
const conn = "mongodb+srv://codysskelton:K87m9B8CjIHIoVe2@cluster0.ifz0to0.mongodb.net/web340DB?retryWrites=true&w=majority"

mongoose.connect(conn).then(() => {
    console.log("Connection to the database was successful");
}).catch(err => {
    console.log("MongoDB Error: " + err.message);
})

const app = express();

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.get('/boarding', (req, res) => {
    res.render('boarding', {
        title: 'Pets-R-Us Boarding Services'
    });
})

app.get('/training', (req, res) => {
    res.render('training', {
        title: 'Pets-R-Us Training Services'
    });
})

app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Pets-R-Us Client Registration'
    })
})

app.post('/registration', async (req, res, next) => {
    console.log(req.body);
    console.log(req.body.clientName);
    console.log(req.body.clientEmail);
    const newCustomer = new Customer({
        customerId: req.body.clientName,
        email: req.body.clientEmail
    })

    console.log(newCustomer);

    // Resulting Error: MongooseError: Model.create() no longer accepts a callback
    /*Customer.create(newCustomer, function(err, customer) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            res.render('index', {
                title: 'Pets-R-Us Home'
            })
        }
    })*/
    //The following code works, but I'm unsure of how to log the results and reroute afterwards.
    await Customer.create({ customerId: req.body.clientName, email: req.body.clientEmail });
})

app.listen(PORT, () => {
    console.info(`Listening on port ${PORT}`)
})