var express = require('express');
var router = express.Router();
var jsend = require('jsend');
const db = require('../models');
const crypto = require('crypto');
const UserService = require('../services/UserService')
const userService = new UserService(db);
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
router.use(jsend.middleware);

// Post for new users to register / signup
router.post('/signup', async (req, res, next) => {
	// #swagger.tags = ['Signup/login']
  	// #swagger.description = 'Creates a new account, if not already exists. <br>Name, email and password is required.'
	// #swagger.produces = ['JSON']
	/* #swagger.parameters['Signup'] = { 
		in: 'body', description: 'Signup user.', type: 'object', 
		schema: { 
			$ref: '#/definitions/Signup'
		}
	} */
	// #swagger.responses[200] = { description: 'You created an account' }
    // #swagger.responses[400] = { description: 'Name/email/password is required' }
    // #swagger.responses[409] = { description: 'User already exists' }
	const { name, email, password } = req.body;
	if (name == null) {
		return res.status(400).jsend.fail({ statusCode: 400, result: "Name is required." });
	}
	if (email == null) {
		return res.status(400).jsend.fail({ statusCode: 400, result: "Email is required." });
	}
	if (password == null) {
		return res.status(400).jsend.fail({ statusCode: 400, result: "Password is required." });
	}
	var user = await userService.getOne(email);
	if (user != null) {
		return res.status(409).jsend.fail({ statusCode: 409, result: "User already exists." });
	}
	var salt = crypto.randomBytes(16);
	crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, hashedPasword) => {
		if (err) { return next(err); }
		userService.create(name, email, hashedPasword, salt);
		res.status(200).jsend.success({ statusCode: 200, result: "You created an account." });
	});
});

// Post for registered users to be able to login
router.post("/login", jsonParser, async (req, res, next) => {
	// #swagger.tags = ['Signup/login']
  	// #swagger.description = "Login in users. <br>Logging in provides a token to be used when accessing the desired application. <br>Logging in requires a valid email and password."
	// #swagger.produces = ['JSON']
	/* #swagger.parameters['Login'] =  {
		in: 'body', description: 'Login.', type: 'object',
		schema: {
			$ref: "#/definitions/Login"
		}
	} */
    // #swagger.responses[200] = { description: 'You are logged in' }
	// #swagger.responses[400] = { description: 'Email/password is required' }
    // #swagger.responses[401] = { description: 'Incorrect password' }
	// #swagger.responses[500] = { description: 'Something went wrong with creating token' }
	const { email, password } = req.body;
	if (email == null) {
		return res.status(400).jsend.fail({ statusCode: 400, result: "Email is required." });
	}
	if (password == null) {
		return res.status(400).jsend.fail({ statusCode: 400, result: "Password is required." });
	}
	userService.getOne(email).then((data) => {
		if (data == null) {
			return res.jsend.status(400).fail({ statusCode: 400, result: "Incorrect email." });
		}
	crypto.pbkdf2(password, data.salt, 310000, 32, "sha256", (err, hashedPassword) => {
		if (err) {return next(err); }
		if (!crypto.timingSafeEqual(data.encryptedPassword, hashedPassword)) {
			return res.status(401).jsend.fail({ statusCode: 401, result: "Incorrect password." });
		}
		let token;
		try {
			token = jwt.sign(
				{ id: data.id, email: data.email },
				process.env.TOKEN_SECRET,
				{ expiresIn: "1h" }
			);
		} catch (error) {
			return res.status(500).jsend.error({message: "Something went wrong with creating JWT token."});
		}
		res.status(200).jsend.success({            
			statusCode: 200, 
            result: "You are logged in", 
			id: data.id, email: data.Email, token: token});
		});
	});
});

router.get('/fail', (req, res) => {
	// #swagger.tags = ['Signup/login']
	/* #swagger.responses[401] = { 
		description: 'Unauthorized'
	}*/
	return res.status(401).jsend.error({ statusCode: 401, message: 'message', data: 'data' });
});

module.exports = router;