const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('epxress-session');
const KnexSessionStore = require('connect-session-knex')(session);


const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionOptions = {
	name: 'ERSwebsite',
	secret: 'Mums the word',
	cookie: {
		maxAge: 1000 * 60 * 60 * 2, // ms, sec, min, hour
		secure: false, // determines if cookie will be returned on by https
	},
	httpOnly: true, // cannot access site via JavaScript, only through http
	resave: false, // every time it gets a session, it will save a session, regardless of modifications
	saveUninitialized: false,

	store: new KnexSessionStore({
		knex: require('../database/dbConfig.js'),
		tablename: 'session',
		sidfieldname: 'sid',
		createtable: true,
		clearInterval: 1000 * 60 * 60
	})
}

server.use(session(sessionOptions));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	res.send("I'm working!");
});

module.exports = server;