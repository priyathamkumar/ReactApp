var express = require('express');
var app = express();
var productFunctionalities = require('./productFunctionalities.js');
var authCheckMiddleware = require('../authCheckMiddleware.js');
var util = require('../config/util.js');
var jwt = require('jsonwebtoken');

app.use('/api', authCheckMiddleware);

//Post request for add a product.
app.post('/api/addProduct', function(req, res){
	var token = util.getToken(req);
	jwt.verify(token, util.secretToken, function(errc, decoded){
		if(!errc){
			req.body.userId = decoded.userId;
			productFunctionalities.addProduct(req, function(err, regres){
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

//Put request for updating a product.
app.put('/api/updateProduct', function(req, res){
	var token = util.getToken(req);
	jwt.verify(token, util.secretToken, function(errc, decoded){
		if(!errc){
			req.body.userId = decoded.userId;
			productFunctionalities.updateProduct(req, function(err, regres){
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

//Get request for fetching products for a particular user.
app.get('/api/fetchProducts', function(req, res){
	var token = util.getToken(req);
	jwt.verify(token, util.secretToken, function(errc, decoded){
		if(!errc){
			req.body.userId = decoded.userId;
			productFunctionalities.fetchProducts(req, function(err, regres){
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

//Delete request for deleting a product.
app.delete('/api/deleteProducts', function(req, res){
	var token = util.getToken(req);
	jwt.verify(token, util.secretToken, function(errc, decoded){
		if(!errc){
			req.body.userId = decoded.userId;
			productFunctionalities.deleteProducts(req, function(err, regres){
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

module.exports = app;