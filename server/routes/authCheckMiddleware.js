var jwt = require('jsonwebtoken');
var secretToken = 'Au7H53cr3tK3y';
var util = require('./config/util.js');
var dbConfig = require('../../Environment/mongoDatabase.js');

module.exports = function(req, res, next) {
    if (!req.headers.authorization) {
        res.statusCode = 400;
        var errResp = {
            "http_code": 400,
            "message": "Authentication token not found."
        };
        res.json(errResp);
    } else {
        var token = util.getToken(req);

        return jwt.verify(token, secretToken, function(err, decoded){
            if (err) { 
                res.statusCode = 401;
                var errResp = {
                    "http_code": 401,
                    "message": "Invalid Signature."
                };
                res.json(errResp);
            } else {
                var userId = decoded.userId;  
                var db = dbConfig.mongoDbConn;

                db.collection('Users').findOne({ 'userEntity.userId' : userId }, {'_id':0}, function(errc, result){
                    if (errc) {
                        res.statusCode = 500;
                        var errResp = {
                            "http_code": 500,
                            "message": "Internal Server Error."
                        };
                        res.json(errResp);
                    } else {
                        if (result) {
                            db.collection('userTokens').find({ 'userId' : userId }, {'_id':0}).toArray(function(errd, resultd){
                                if (errd) {
                                    res.statusCode = 500;
                                    var errResp = {
                                        "http_code": 500,
                                        "message": "Internal Server Error."
                                    };
                                    res.json(errResp);
                                } else {
                                    if (resultd.length) {
                                        var tokenFound = [];
                                        resultd.forEach(function(entry){
                                            if(entry.token == token){
                                               tokenFound.push(true);
                                            } else {
                                               tokenFound.push(false);
                                            }
                                        });
                                        if(tokenFound.indexOf(true) != -1){
                                            return next();
                                        } else {
                                            res.statusCode = 401;
                                            var errResp = {
                                                "http_code": 401,
                                                "message": "Token not found. User Session Expired."
                                            };
                                            res.json(errResp);
                                        }
                                    } else {
                                        res.statusCode = 401;
                                        var errResp = {
                                            "http_code": 401,
                                            "message": "User Session Expired."
                                        };
                                        res.json(errResp);
                                    }
                                }
                            }); 
                        } else {
                            res.statusCode = 401;
                            var errResp = {
                                "http_code": 401,
                                "message": "Invalid token."
                            };
                            res.json(errResp);
                        }
                    }
                }); 
            }
        });
    }    
};