//const jsend = require('jsend');
const jwt = require('jsonwebtoken');
const db = require('../models');
const UserService = require('../services/UserService');
const userService = new UserService(db);

// Middleware function to determine if the API endpoint request is from an authenticated user
const isAuth = async function (req, res, next) {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		return res.status(401).jsend.fail({
			statusCode: 401,
			result: 'No token provided.'
		});
	}
	try {
		const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
		const user = await userService.getById(decodedToken.id);
		if (!user) {
			return res.status(404).jsend.fail({
				statusCode: 404,
				result: 'User not found.'
			});
		}
		req.user = user;
		next();
	} catch (error) {
		return res.status(500).jsend.error({
            message: 'Invalid token.'
        });
	}
}

module.exports = isAuth;