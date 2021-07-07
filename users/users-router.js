const router = require('express').Router();

const users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, (req, res) => {
	users
		.find()
		.then(users => {
			res
				.json(users);
		})
		.catch(err =>
			res
				.send(err)
		);
});

module.exports = router;