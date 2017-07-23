var express = require('express');
var app = express();
var dbConfig = require('../../../Environment/mongoDatabase.js');
var log = require('../../../Environment/log4js.js');
var userFunctionalities = require('./userFunctionalities.js');
var authCheckMiddleware = require('../authCheckMiddleware.js');
var util = require('../config/util.js');
var jwt = require('jsonwebtoken');

app.use('/api', authCheckMiddleware);

//Function to insert token in db
function insertTokenDB(userId, token, callback){
    var db = dbConfig.mongoDbConn;
    var logger = log.logger_users;
    var tokenObj = {
        userId : userId,
        token : token,
        createdAt : new Date()
    };
    db.collection('userTokens').insert(tokenObj, function(err, result){
        if (err) {
            callback(err);
            logger.error("Error inserting token to DB. Error : " + JSON.stringify(err));
        } else {
            callback(false);
        }
    });
}

//Post request for registering the user.
app.post('/register', function(req, res){
	userFunctionalities.register(req, function(err, regres){
		res.statusCode =  regres.http_code;
		res.json(regres);
	});
});

//Post request for logging in a user.
app.post('/login', function(req, res){
	var callback = function(err, regres){
		if (err) {
			res.statusCode =  regres.http_code;
			res.json(regres);
		} else {
			var token = jwt.sign({ userId : regres.userId }, util.secretToken, { expiresIn: 60 * util.expMins });
			insertTokenDB(regres.userId, token, function(errc){
				if (errc) {
					res.statusCode =  500;
					var errResp = {
						"http_code": 500,
						"message": "Error inserting token."
					};
					logger.error("Error inserting token. Error : " + JSON.stringify(errc));
					res.json(errResp);
				} else {
					res.statusCode =  regres.http_code;
					res.json({ http_code: regres.http_code, message: regres.message, token: token});
				}
			});
		}
	};
	userFunctionalities.login(req, callback);
});

//Post request for logging out a user.
app.get('/api/logout', function(req, res){
	var token = util.getToken(req);
	jwt.verify(token, util.secretToken, function(errc, decoded){
		if(!errc){
			var input = {};
			input.userId = decoded.userId;
			input.token = token;	
			userFunctionalities.logout(input, function(err, regres){
				res.statusCode =  regres.http_code;
				res.json(regres);
			});
		} else {
			res.statusCode =  401;
			var errResp = {
				"http_code": 401,
				"message": "Error decoding token."
			};
			logger.error("Error decoding token. Error : " + JSON.stringify(errc));
			res.json(errResp);
		}
	});
});

//Get request for validating the user name for registration.
app.get('/validateUserName/:userName', function(req, res){
	userFunctionalities.validateUserName(req, function(err, regres){
		res.statusCode =  regres.http_code;
		res.json(regres);
	});
});

module.exports = app;