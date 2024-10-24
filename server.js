const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: '3dfh7Ks!@#F4pNl$x8bTqZ&^92Ue7P%G',
    resave: false,
    saveUninitialized: true
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ticketBooking')
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });


// User schema for login/register
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Ticket schema
const ticketSchema = new mongoose.Schema({
    name: String,
    email: String,
    place: String,
    date: String,
    persons: Number
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// Serve static files
app.use(express.static('public'));

// Register Route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    req.session.userId = newUser._id; // Save the session
    res.redirect('/');
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id; // Save user ID in session
        res.redirect('/');
        console.log("Logged In Successfully...");

    } else {
        res.send('Invalid credentials');
    }
});

app.use(express.urlencoded({ extended: true }));

// Ticket booking route 
app.post('/submit-ticket', (req, res) => {
    const { name, email, place, date, persons } = req.body;
    const newTicket = new Ticket({ name, email, place, date, persons });

    newTicket.save()
        .then(() => {
            // Redirect to the payment page after booking the ticket
            res.redirect('/payment'); // Redirect to your payment page
        })
        .catch(err => {
            res.status(500).send('Error booking ticket');
        });
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/payment.html')); // Update the path to your actual payment page
});


// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Start the server
app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
