const path = require('path'); //new to add css **working**
const express = require('express');
const routes = require('./controllers'); //new changed file name api endpoints ARE working
const sequelize = require('./config/connection');

require('dotenv').config();


const exphbs = require('express-handlebars'); //added for handlebars to view homepage **NOT WORKING**
// const hbs = exphbs.create({}); //added for handlebars to view homepage



const app = express();
const hbs = exphbs.create({});

const PORT = process.env.PORT || 3001;

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: process.env.SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//When I moved this up here it worked not sure why
app.use(express.static(path.join(__dirname, 'public')));

//express engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//my previous location
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

//turn on routes
app.use(routes);

//links to the publice directory (location of CSS file ) **NOT WORKING**
// app.use(express.static(path.join(__dirname, 'public')));

// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');

//turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});