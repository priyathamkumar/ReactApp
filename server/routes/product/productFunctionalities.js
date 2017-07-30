var TAG = "--- Product Fuctionalities ---    ";
var dbConfig = require('../../../Environment/mongoDatabase.js');
var log = require('../../../Environment/log4js.js');
var V = require('jsonschema').Validator;
var validator = new V();
var validations = require("../config/validation.js");
var schema = require("../config/schema.js");

exports.addProduct = function(req, callback) {

    try {
        //Variable for Logging the messages to the file.
        var logger = log.logger_products;

        //Variable for Mongo DB Connection. 
        var db = dbConfig.mongoDbConn;

        logger.info(TAG + " Entering add Product.");

        //Log the request.
        logger.info(TAG + " " + JSON.stringify(req.body));

        //Declare the response
        var resJson;

        var input = {};
        input.name = req.body.name;
        input.code = req.body.code;
        input.qty = req.body.qty;
        input.expiryDate = req.body.expiryDate;

        //Validating the request
        validation_result = validator.validate(input, validations.addProductInputSchema);
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
                //check if product code already exists
                db.collection('Products').findOne({ "productEntity.code": input.code, "productEntity.createdBy": req.body.userId },function(err,result){
                    
                    if(!err && result == null){

                        generateProductId(function(errc, resultc) {
                            if (!errc) {
                                var productObj = new schema.productSchema();
                                productObj.productEntity.productId = resultc;
                                productObj.productEntity.name = input.name;
                                productObj.productEntity.code = input.code;
                                productObj.productEntity.qty = input.qty;
                                productObj.productEntity.expiryDate = new Date(input.expiryDate);
                                productObj.productEntity.createdDate = new Date();
                                productObj.productEntity.createdBy = req.body.userId;
                                db.collection('Products').insert(productObj, {w:1}, function(werr,wResult){
                                    if(!werr){
                                        var resJson = {
                                            "http_code": "200",
                                            "message": "Product added successfully"
                                        }
                                        logger.info(TAG + " Product added successfully");
                                        return callback(false, resJson);
                                    } else {
                                        var resJson = {
                                            "http_code": "500",
                                            "message": "Internal Server Error."
                                        }
                                        logger.error(TAG + "Mongo error in inserting a product doc, error :" + JSON.stringify(werr));
                                        return callback(true, resJson);
                                    }
                                });
                            } else {
                                resJson = {
                                    "http_code": "500",
                                    "message": "Generating the Product id Failed."
                                };
                                logger.error(TAG + "Generating the Product id Failed, err: " + JSON.stringify(errc));
                                return callback(false, resJson);
                            }
                        });
                    } else if(!err && result != null){
                        var resJson = {
                            "http_code": "400",
                            "message": "Product already exists with this code."
                        }
                        logger.error(TAG + " Product already exists with this code.");
                        return callback(true, resJson);
                    } else {
                        var resJson = {
                            "http_code": "500",
                            "message": "Internal Server Error."
                        }
                        logger.error(TAG + "Mongo error in fetching a product doc, error :" + JSON.stringify(err));
                        return callback(true, resJson);
                    }
                });
        }
    } catch (e) {
        var resJson = {
            "http_code": "500",
            "message": "Internal Server Error."
        }
        logger.error(TAG + "Exception in add Product, error :" + e.stack);
        return callback(true, resJson);
    }   
}

//Function to generate Product id
function generateProductId(callback){

    var db = dbConfig.mongoDbConn;
    var logger = log.logger_products;

    db.collection('counters').findAndModify({ _id: 'productId' },null, { $inc: { seq: 1 } }, {new: true}, function(err, result){
        if (err) {
            logger.error(TAG + "Fetching the counters value for Product id Failed.");
            callback(true);
        } else {
            logger.debug(TAG + "Fetching the counters value for Product id Success.");
            callback(false, result.value.seq);
        }
    });
}

exports.updateProduct = function(req, callback) {

    try {

        //Variable for Logging the messages to the file.
        var logger = log.logger_products;

        //Variable for Mongo DB Connection. 
        var db = dbConfig.mongoDbConn;

        logger.info(TAG + " Entering update Product.");

        //Log the request.
        logger.info(TAG + " " + JSON.stringify(req.body));

        //Declare the response
        var resJson;

        var input = {};
        input.productId = req.body.productId;
        input.name = req.body.name;
        input.code = req.body.code;
        input.qty = req.body.qty;
        input.expiryDate = req.body.expiryDate;

        //Validating the request
        validation_result = validator.validate(input, validations.updateProductInputSchema);
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
            //check if product id exists
            db.collection('Products').findOne({ "productEntity.productId": input.productId, "productEntity.createdBy": req.body.userId },function(err,result){

                if(!err && result != null){
                    //check if product code already exists
                    db.collection('Products').findOne({ "productEntity.code": input.code, "productEntity.createdBy": req.body.userId },function(errb,resultb){
                        
                        if(!errb && (resultb == null || resultb.productEntity.productId == input.productId)){
                            
                            db.collection('Products').update({ "productEntity.productId": input.productId }, {$set: {"productEntity.name": input.name, "productEntity.code": input.code, "productEntity.qty": input.qty, "productEntity.expiryDate": new Date(input.expiryDate)}}, function(error, resultc){

                                if(error){
                                    var resJson = {
                                        "http_code": "500",
                                        "message": "Internal Server Error."
                                    }
                                    logger.error(TAG + "Mongo error in updating a product doc, error :" + JSON.stringify(error));
                                    return callback(true, resJson);
                                } else if(!error && resultc.result.nModified > 0) {
                                    var resJson = {
                                        "http_code": "200",
                                        "message": "Product updated successfully."
                                    }
                                    logger.info(TAG + " Product updated successfully.");
                                    return callback(false, resJson);
                                } else if(!error && resultc.result.nModified == 0 && resultc.result.n > 0){
                                    resJson = {
                                        "http_code" : "400",
                                        "message" : "No changes are made to update Product Details."
                                    };
                                    logger.error(TAG + " No changes are made to update Product Details.");
                                    return callback(true, resJson);
                                } else if(!error && resultc.result.n == 0){
                                    resJson = {
                                        "http_code" : "400",
                                        "message" : "Product Details not found."
                                    };
                                    logger.error(TAG + " Product Details not found.");
                                    return callback(true, resJson);
                                }
                            });
                        } else if(!errb && (resultb != null && resultb.productEntity.productId !==input.productId)){
                            var resJson = {
                                "http_code": "400",
                                "message": "Product already exists with this code."
                            }
                            logger.error(TAG + " Product already exists with this code.");
                            return callback(true, resJson);
                        } else {
                            var resJson = {
                                "http_code": "500",
                                "message": "Internal Server Error."
                            }
                            logger.error(TAG + "Mongo error in fetching a product doc, error :" + JSON.stringify(errb));
                            return callback(true, resJson);
                        }
                    });
                } else if(!err && result == null){
                    var resJson = {
                        "http_code": "400",
                        "message": "Product details not found."
                    }
                    logger.error(TAG + " Product details not found.");
                    return callback(true, resJson);
                } else {
                    var resJson = {
                        "http_code": "500",
                        "message": "Internal Server Error."
                    }
                    logger.error(TAG + "Mongo error in fetching a product doc, error :" + JSON.stringify(err));
                    return callback(true, resJson);
                }
            });
        }
    } catch (e) {
        var resJson = {
            "http_code": "500",
            "message": "Internal Server Error."
        }
        logger.error(TAG + "Exception in update Product, error :" + e.stack);
        return callback(true, resJson);
    }   
}

exports.fetchProducts = function(req, callback) {

    try {

        //Variable for Logging the messages to the file.
        var logger = log.logger_products;

        //Variable for Mongo DB Connection. 
        var db = dbConfig.mongoDbConn;

        logger.info(TAG + " Entering fetch Products.");

        //Log the request.
        logger.info(TAG + " " + JSON.stringify(req.body));

        //Declare the response
        var resJson;

        db.collection('Products').find({ "productEntity.createdBy": req.body.userId }).sort({"productEntity.createdDate": -1}).toArray(function(err,result){
                
            if(!err){
                var finalResult = result;
                var products = [];
                finalResult.forEach(function(entry){
                    var qtyColor = '';
                    if(entry.productEntity.qty < 10){
                        qtyColor = 'red';
                    } else if(entry.productEntity.qty >= 10 && entry.productEntity.qty < 30){
                        qtyColor = '#ffa500';
                    } else {
                        qtyColor = 'green';
                    }
                    products.push({
                        "productId": entry.productEntity.productId,
                        "name": entry.productEntity.name,
                        "code": entry.productEntity.code,
                        "qty": entry.productEntity.qty,
                        "qtyColor": qtyColor,
                        "expiryDate": (new Date(entry.productEntity.expiryDate).getFullYear()) +'-'+ ('0' + (new Date(entry.productEntity.expiryDate).getMonth() + 1)).slice(-2) +'-'+ ('0' + new Date(entry.productEntity.expiryDate).getDate()).slice(-2),
                        "createdDate": (new Date(entry.productEntity.createdDate).getFullYear()) +'-'+ ('0' + (new Date(entry.productEntity.createdDate).getMonth() + 1)).slice(-2) +'-'+ ('0' + new Date(entry.productEntity.createdDate).getDate()).slice(-2)                                              
                    });
                });
                var resJson = {
                    "http_code": "200",
                    "message": "Products fetched successfully",
                    "products": products
                }
                logger.info(TAG + " Products fetched successfully");
                return callback(false, resJson);                    
            } else {
                var resJson = {
                    "http_code": "500",
                    "message": "Internal Server Error."
                }
                logger.error(TAG + "Mongo error in fetching Products, error :" + JSON.stringify(err));
                return callback(true, resJson);
            }
        });
    } catch (e) {
        var resJson = {
            "http_code": "500",
            "message": "Internal Server Error."
        }
        logger.error(TAG + "Exception in fetch Products, error :" + e.stack);
        return callback(true, resJson);
    }   
}

exports.deleteProducts = function(req, callback) {

    try {

        //Variable for Logging the messages to the file.
        var logger = log.logger_products;

        //Variable for Mongo DB Connection. 
        var db = dbConfig.mongoDbConn;

        logger.info(TAG + " Entering delete Product.");

        //Log the request.
        logger.info(TAG + " " + JSON.stringify(req.body));

        //Declare the response
        var resJson;

        db.collection('Products').deleteMany({ "productEntity.productId": { $in: req.body.productIds }, "productEntity.createdBy" : req.body.userId },function(err,response){
            
            if(!err && response.result.n > 0){
                var resJson = {
                    "http_code": "200",
                    "message": "Product deleted successfully."
                }
                logger.info(TAG + " Product deleted successfully.");
                return callback(false, resJson);
            } else if(!err && response.result.n == 0){
                var resJson = {
                    "http_code": "400",
                    "message": "Product Details not found."
                }
                logger.error(TAG + " Product Details not found.");
                return callback(true, resJson);
            } else {
                var resJson = {
                    "http_code": "500",
                    "message": "Internal Server Error."
                }
                logger.error(TAG + "Mongo error in deleting a Product doc, error :" + JSON.stringify(err));
                return callback(true, resJson);
            }
        });
    } catch (e) {
        var resJson = {
            "http_code": "500",
            "message": "Internal Server Error."
        }
        logger.error(TAG + "Exception in delete Products, error :" + e.stack);
        return callback(true, resJson);
    }    
}