var mongoClient =  require('mongodb').MongoClient;

var dbConfig = {
    "type": "singleInstance",
    "user": "testUser",
    "pwd": "t357u53r",
    "mongod": "127.0.0.1:27017",
    "database": "Assignment"
};
var dbConnUrl = 'mongodb://' + dbConfig.user + ':' + dbConfig.pwd + '@' + dbConfig.mongod + '/' + dbConfig.database;

exports.createMongoConn = function(callback) {
    mongoClient.connect(dbConnUrl,function (err, database) {
        if (err) {
            callback(err);
        } else {
            console.log('Connection established to database');
            exports.mongoDbConn = database;
            callback(false);
        }
    });
}