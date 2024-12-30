// to use env file
require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const mainRoute = require('./server/routes/noteRoutes');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(session({
    secret: 'secretSessionId12',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended : true })); 
app.use(express.json());
app.use(methodOverride('_method'));

// Connecting to database
connectDB();

// For templating
app.use(expressLayouts);
app.set('layout','./layouts/main')
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Routing
app.use('/', require('./server/routes/authRoute'));
app.use('/', require('./server/routes/noteRoutes'));

app.get('*', (req,res) => {
    res.status(404).render('404', {title : 'Page not found'})
})

app.listen(PORT, () => {
    console.log(`Running on server port ${PORT} `);
})

