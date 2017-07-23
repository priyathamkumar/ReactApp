var log4js = require('log4js');
var fs = require('fs');

var logger_users;
var logger_products;

var log4jsEnvParams = {
	"logDir": "/usr/NodeJslogs",
	"logLevel" : "DEBUG",
	"maxLogSize": 10048576, //10MB
	"backups": 5
};
var logDir = log4jsEnvParams.logDir;
var maxLogSize = log4jsEnvParams.maxLogSize;
var backups = log4jsEnvParams.backups;
var logLevel = log4jsEnvParams.logLevel;

var log4jsConfig = {
	"appenders": {
		"users" : {
			"type": "file",
			"filename": logDir + "/" + "users.log",
			"maxLogSize": maxLogSize,
			"backups": backups
		},
		"products" : {
			"type": "file",
			"filename": logDir + "/" + "products.log",
			"maxLogSize": maxLogSize,
			"backups": backups
		}
	},
  	categories: { default: { appenders: ['users','products'], level: logLevel } }
};

function createLogDir (callback) {
	fs.exists(logDir, function(exists) {
		if (!(exists)) {
			fs.mkdir(logDir, function(err) {
				if (err) {
					console.log("Log Directory Cannot be Created: " + logDir + "." +err);
					throw new Error();
				} else {
					callback(true, "Log Directory created: " + logDir);
				}
			});
		} else {
			callback(true, "Log Directory Exists: " + logDir);
		}
	});
}

createLogDir(function(success,result) {
	if (success) {
		log4js.configure(log4jsConfig,{});

		//Log for users
		logger_users = log4js.getLogger("users");
		exports.logger_users = logger_users;

		//Log for products.
		logger_products = log4js.getLogger("products");
		exports.logger_products = logger_products;
	}
});