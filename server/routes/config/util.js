exports.secretToken = 'Au7H53cr3tK3y';
exports.expMins = 30;

//Function to get token from a request
exports.getToken = function (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}