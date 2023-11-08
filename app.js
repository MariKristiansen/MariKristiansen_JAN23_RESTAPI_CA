const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const bodyParser = require('body-parser')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jsend = require('jsend');

//var usersRouter = require('./routes/users');
require('dotenv').config();
var db = require('./models');
db.sequelize.sync({ force: true });	//set to true when testing, this will empty the db (NB!! Also in services/readJSON.js)
require('./services/readJSON');

const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const todosRouter = require('./routes/todos');
const statusRouter = require('./routes/status');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(jsend.middleware);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/users', usersRouter);
app.use('/', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/todos', todosRouter);
app.use('/', statusRouter);

app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;