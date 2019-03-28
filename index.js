const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = require('./database/dbConfig.js');
const users = require('./users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
	res.send("I'm working!");
});

server.post('/api/register', (req, res) => {
	let user = req.body;

	// Hash password using bcrypt
	const hash = bcrypt.hashSync(user.password, 10);

	// Replace plain text password with hash
	user.password = hash;

	users
		.add(user)
		.then(saved => {
			res
				.status(201)
				.json(saved);
		})
		.catch(err => {
			res
				.status(500)
				.json(err);
		});

});

server.post('/api/login', (req, res) => {
	let { username, password } = req.body;

	// Check if username is valid
	users
		.findBy({ username })
		.first()
		.then(user => {
						// check if password is valid
			if (user && bcrypt.compareSync(password, user.password)) {
				res
					.status(200)
					.json({ message: `Welcome ${user.username}!` });
			}
			else {
				res
					.ststus(401)
					.json({ message: 'Invalid credentials!' });
			}
		})
		.catch(err => {
			res
				.status(500)
				.json(err);
		});
});

server.get('/api/users', (req, res) => {
	users
		.find()
		.then(users => {
			res.json(users);
		})
		.catch(err => {
			res.send(err);
		});
});

const port = process.env.PORT || 9090;
server.listen(port, () => console.log(`\n *** Running on port ${port} ***\n`));
