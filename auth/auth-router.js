const router = require('express').Router();
const bcrypt = require('bcrypt');

const users = require('../users/users-model.js');

// For endpoints beginning with /api/auth
router.post('/register', (req, res) => {
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

router.post('/login', (req, res) => {
	console.log("This is the session", req.session);
	let { username, password } = req.body;

	// Check if username is valid
	users
		.findBy({ username })
		.first()
		.then(user => {
						// check if password is valid
			if (user && bcrypt.compareSync(password, user.password)) {
				req.session.user = user;
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

module.exports = router;