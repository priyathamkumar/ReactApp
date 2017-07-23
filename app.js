var express = require('express');
var mongo = require('./Environment/mongoDatabase.js')
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));
 
app.use(express.static('./server/public/'));
app.use(express.static('./client/dist/'));

var user = require('./server/routes/user/user.js');
var product = require('./server/routes/product/product.js');

app.use('/user', user);
app.use('/product', product);

app.use(function(err, req, res, next) {
    console.log(JSON.stringify(req.body))
    res.status(err.status || 500);
    res.json({
        http_code: err.status || 500,
        message: err.message
    });
    console.log("req:- " + req.url);
    console.log("time : " + new Date());
    console.log("error triggered from app.js:- " + err.stack);
});

mongo.createMongoConn(function(err) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', JSON.stringify(err));
    } else {
        app.listen(3000, function() {
            console.log("listening on 3000")
        });
    }
});