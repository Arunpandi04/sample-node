const jwt = require('jsonwebtoken');

// generate a JWT token for the various applications represented by the 'option' argument
const generateToken = (id, option) => {
	if (option === 'access') {
		return jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
			expiresIn: 60 * 60,
		});
	} else if(option === 'refresh') {
		return jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
			expiresIn: '1d',
		});
	} 
};

module.exports =  generateToken;