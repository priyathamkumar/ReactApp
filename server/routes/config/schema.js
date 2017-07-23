exports.userSchema = function() {
	this.userEntity = {
		"userId": "",
		"userName": "",
		"passwordHash": "",
		"emailId": ""
	}
};

exports.productSchema = function() {
	this.productEntity = {
		"productId": "",
		"name": "",
		"code": "",
		"qty": 0,
		"expiryDate": "",
		"createdDate": "",
		"createdBy": ""
	}
};