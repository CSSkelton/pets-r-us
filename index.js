const express = require('express');
const logger = require('pino')();
const path = require('path');
const fs = require('fs');
const Customer = require('./models/customer');
const Appointment = require('./models/appointment');

//DB Connection
var mongoose = require('mongoose');
const conn = "mongodb+srv://manager-01:7JNd9SbPS0b0RyBh@cluster0.ifz0to0.mongodb.net/web340DB?retryWrites=true&w=majority"

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

app.get('/booking', (req, res) => {
    let jsonFile = fs.readFileSync('./public/data/services.json');
    let services = JSON.parse(jsonFile);

    console.log(services);

    res.render('booking', {
        title: 'Pets-R-Us Appointment Booking',
        services: services
    })
})

app.post('/booking', (req, res) => {
    const customerId = req.body.customerId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const service = req.body.service;

    console.log(`CustomerId: ${customerId}; First name: ${firstName}; Last name: ${lastName}; Email: ${email}; Service: ${service}`);

    let scheduledAppointment = new Appointment({
        customerId,
        firstName,
        lastName,
        email,
        service
    });

    Appointment.create(scheduledAppointment, function(err, appointment) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log("Your appointment has been successfully scheduled");
            console.log(appointment);
            res.redirect('/');
        }
    })
})

app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Pets-R-Us Client Registration'
    })
})

app.get('/customers', function(req, res, next) {
    Customer.find({}, function(err, customers) {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            console.log(customers);
            res.render('customer-list', {
                title: 'Pets-R-Us: Customer List',
                customers: customers
            })
        }
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

    Customer.create(newCustomer, function(err, cus) {
        if (err) {
            console.error(err);
            res.end(err);
        } else {
            res.redirect('/');
        }
    })
})

app.get('/my-appointments', (req, res) => {
    res.render('my-appointments', {
        title: 'Pets-R-Us: Appointments'
    })
})

app.get('/api/appointments/:email', async(req, res, next) => {
    Appointment.find({'email': req.params.email}, function(err, appointments) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            res.json(appointments);
        }
    })
})

app.listen(PORT, () => {
    console.info(`Listening on port ${PORT}`)
})