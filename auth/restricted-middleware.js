const bcrypt = require('bcrypt');

const users = require('../users/users-model.js');

module.exports = (req, res, next) => {
	if (req.session && req.session.user) {
    next()
  }
  else {
    res
      .status(401)
      .json({ message: "You shall not pass!" });
  }
};