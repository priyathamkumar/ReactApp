var TAG = "--- User Fuctionalities ---    ";
var dbConfig = require('../../../Environment/mongoDatabase.js');
var log = require('../../../Environment/log4js.js');
var crypto = require("crypto");
var V = require('jsonschema').Validator;
var validator = new V();
var validations = require("../config/validation.js");
var schema = require("../config/schema.js");

exports.register = function(req, callback) {

    try {

        //Variable for Logging the messages to the file.
        var logger = log.logger_users;

        //Variable for Mongo DB Connection. 
        var db = dbConfig.mongoDbConn;

        logger.info(TAG + " Entering register user.");

        //Log the request.
        logger.info(TAG + " " + JSON.stringify(req.body));

        //Declare the response
        var resJson;

        var input = {};
        input.userName = req.body.userName;
        input.password = req.body.password;
        input.emailId = req.body.emailId;

        //Validating the request
        validation_result = validator.validate(input, validations.registerUserInputSchema);
        var errors = [];

        if (validation_result.errors.length > 0 || errors.length > 0) {

            if (validation_result.errors.length > 0) {
                for (error in validation_result.errors){
                  errors.push(validation_result.errors[error].stack);
                }
            }

            var errorMessage = {
                "errorMessage" : "Bad or ill-formed request.",
                "errors" : errors
            };

            resJson = {
                "http_code": 400,
                "message": errorMessage
            };
            logger.error(TAG + "Bad or ill-formed request. \n" + JSON.stringify(errors));
            return callback(true, resJson);
        } else {
            //check if user email id already exists
            db.collection('Users').findOne({ "userEntity.emailId": input.emailId },function(err,result){
                
                if(!err && result == null){

                    generateUserId(function(errc, resultc) {
                        if (!errc) {
                            var userObj = new schema.userSchema();
                            userObj.userEntity.userId = resultc;
                            userObj.userEntity.userName = input.userName.toLowerCase();
                            userObj.userEntity.passwordHash = crypto.createHash('md5').update(input.password).digest('hex');
                            userObj.userEntity.emailId = input.emailId;
                            db.collection('Users').insert(userObj, {w:1}, function(werr,wResult){
                                if(!werr){
                                    var resJson = {
                                        "http_code": "200",
                                        "message": "User Registered successfully"
                                    }
                                    logger.info(TAG + "User Registered successfully");
                                    return callback(false, resJson);
                                } else {
                                    var resJson = {
                                        "http_code": "500",
                                        "message": "Internal Server Error."
                                    }
                                    logger.error(TAG + "Mongo error in inserting a user doc, error :" + JSON.stringify(werr));
                                    return callback(true, resJson);
                                }
                            });
                        } else {
                            resJson = {
                                "http_code": "500",
                                "message": "Generating the User id Failed."
                            };
                            logger.error(TAG + "Generating the User id Failed, err: " + JSON.stringify(errc));
                            return callback(false, resJson);
                        }
                    });
                } else if(!err && result != null){
                    var resJson = {
                        "http_code": "400",
                        "message": "User already exists with this Email Id."
                    }
                    logger.error(TAG + " User already exists with this email id.");
                    return callback(true, resJson);
                } else {
                    var resJson = {
                        "http_code": "500",
                        "message": "Internal Server Error."
                    }
                    logger.error(TAG + "Mongo error in fetching a user doc, error :" + JSON.stringify(err));
                    return callback(true, resJson);
                }
            });
        }
    } catch (e) {
        var resJson = {
            "http_code": "500",
            "message": "Internal Server Error."
        }
        logger.error(TAG + "Exception in register, error :" + e.stack);
        return callback(true, resJson);
    }    
}

//Function to generate User id
function generateUserId(callback){

    var db = dbConfig.mongoDbConn;
    var logger = log.logger_users;

    db.collection('counters').findAndModify({ _id: 'userId' },null, { $inc: { seq: 1 } }, {new: true}, function(err, result){
        if (err) {
            logger.error(TAG + "Fetching the counters value for User id Failed.");
            callback(true);
        } else {
            logger.debug(TAG + "Fetching the counters value for User id Success.");
            callback(false, result.value.seq);
        }
    });
}

//Function for the Validating the userName.
exports.validateUserName = function(req, callback){
    
    //Variable for Mongo DB Connection. 
    var db = dbConfig.mongoDbConn;
    
    //Variable for Logging the messages to the file.
    var logger = log.logger_users;
    
    logger.info(TAG + " Entering Validate User ID.");
    
    //Log the request.
    logger.info(TAG  + " " + JSON.stringify(req.params));
    
    //Declare the response
    var resJson;
    
    //Validate the request.
    if ( !( req === null || 
            req.params.userName === undefined || 
            req.params.userName === null || 
            req.params.userName.toString().trim().length === 0)) {
        
        var userName = req.params.userName;
        
        var caseUserName = userName.toLowerCase();
        
        db.collection('Users').findOne({"userEntity.userName": caseUserName}, {"_id": 0 }, function(err, result) {
            if(!err && (result !== null)){
                resJson = {
                    "http_code" : "400",
                    "message" : "UserName is already used. Please choose different UserName."
                };
                logger.debug(TAG + " UserName is already used. Please choose different UserName.");
                return callback(true, resJson);
            } else if(!err && (result === null)) {
                resJson = {
                    "http_code" : "200",
                    "message" : "UserName is valid."
                };
                logger.error(TAG + " UserName is valid.");
                return callback(false, resJson);
            }else {
                resJson = {
                    "http_code" : "500",
                    "message" : "Internal Server Error."
                };
                logger.error(TAG + " Validate UserName Failed : " + err);
                return callback(true, resJson);
            }
        });     
    }else {
        resJson = {
            "http_code" : "400",
            "message" : "Bad or ill-formed request.."
        };
        logger.error(TAG + " " + JSON.stringify(resJson));
        return callback(true,resJson);
    }
};

exports.login = function(req, callback) {

    try {

        //Variable for Logging the messages to the file.
        var logger = log.logger_users;

        //Variable for Mongo DB Connection. 
        var db = dbConfig.mongoDbConn;

        logger.info(TAG + " Entering Login user.");

        //Log the request.
        logger.info(TAG + " " + JSON.stringify(req.body));

        //Declare the response
        var resJson;

        if(req.body.userName && req.body.password){

            db.collection('Users').findOne({ "userEntity.userName": (req.body.userName).toLowerCase() }, {"_id":0}, function(err,result){
                
                if(!err && result != null){
                    
                    if(result.userEntity.passwordHash === crypto.createHash('md5').update(req.body.password).digest('hex')){
                        var resJson = {
                            "http_code": "200",
                            "message": "User Logged in successfully",
                            "userId": result.userEntity.userId
                        }
                        logger.info(TAG + " User Logged in successfully");
                        return callback(false, resJson);  
                    } else {
                        var resJson = {
                            "http_code": "400",
                            "message": "Password entered is wrong."
                        }
                        logger.error(TAG + " Password mismatch.");
                        return callback(true, resJson);
                    }
                } else if(!err && result == null){
                    var resJson = {
                        "http_code": "404",
                        "message": "User Name is invalid"
                    }
                    logger.error(TAG + "User Details Not Found");
                    return callback(true, resJson);
                } else {
                    var resJson = {
                        "http_code": "500",
                        "message": "Internal Server Error."
                    }
                    logger.error(TAG + "Mongo error in fetching a user doc, error :" + JSON.stringify(err));
                    return callback(true, resJson);
                }
            });
        } else {
            resJson = {
                "http_code": 400,
                "message": "Bad or ill-formed request."
            };
            logger.error(TAG + " Bad or ill-formed request." + JSON.stringify(resJson));
            return callback(true, resJson);
        }
    } catch (e) {
        var resJson = {
            "http_code": "500",
            "message": "Internal Server Error."
        }
        logger.error(TAG + " Exception in login, error :" + e.stack);
        return callback(true, resJson);
    }
}

exports.logout = function(input, callback) {

    try {

        //Variable for Logging the messages to the file.
        var logger = log.logger_users;

        //Variable for Mongo DB Connection. 
        var db = dbConfig.mongoDbConn;

        logger.info(TAG + " Entering logout user.");

        //Log the request.
        logger.info(TAG + " " + JSON.stringify(input));

        //Declare the response
        var resJson;

        db.collection('userTokens').deleteOne({ "userId": input.userId, "token" : input.token },function(err,response){
                
            if(!err && response.result.n == 1){
                var resJson = {
                    "http_code": "200",
                    "message": "User logged out successfully"
                }
                logger.info(TAG + "User logged out successfully");
                return callback(false, resJson);
            } else if(!err && response.result.n == 0){
                var resJson = {
                    "http_code": "400",
                    "message": "Token Details not found."
                }
                logger.error(TAG + " Token Details not found.");
                return callback(true, resJson);
            } else {
                var resJson = {
                    "http_code": "500",
                    "message": "Internal Server Error."
                }
                logger.error(TAG + "Mongo error in deleting a user tocken doc, error :" + JSON.stringify(err));
                return callback(true, resJson);
            }
        });
    } catch (e) {
        var resJson = {
            "http_code": "500",
            "message": "Internal Server Error."
        }
        logger.error(TAG + "Exception in logout, error :" + e.stack);
        return callback(true, resJson);
    }    
}