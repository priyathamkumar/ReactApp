exports.registerUserInputSchema = {
	"type": "object",
	"required": true,
	"properties": {
		"userName" :{
			"type": "string",
			"required": true,
			"minLength": 1,
			"pattern": /^[a-zA-Z0-9-,.:#&()!@$%^*_{}\\\/\s]*$/
		},
		"password" :{
			"type": "string",
			"required": true,
			"minLength": 1,
			"pattern": /^[a-zA-Z0-9-,.:#&()!@$%^*_{}\\\/\s]*$/
		},
		"emailId" :{
			"type": "string",
			"required": true,
			"minLength": 0,
			"pattern": /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
		}
	}
}

exports.addProductInputSchema = {
	"type": "object",
	"required": true,
	"properties": {
		"name" :{
			"type": "string",
			"required": true,
			"minLength": 1,
			"pattern": /^[a-zA-Z0-9-,.:#&()!@$%^*_{}\\\/\s]*$/
		},
		"code" :{
			"type": "string",
			"required": true,
			"minLength": 1,
			"pattern": /^[a-zA-Z0-9-,.:#&()!@$%^*_{}\\\/\s]*$/
		},
		"qty" :{
			"type": "number",
			"required": true,
			"minLength": 1
		},
		"expiryDate" : {
			"type": "string",
			"required": true,
			"pattern": /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
		}
	}
}

exports.updateProductInputSchema = {
	"type": "object",
	"required": true,
	"properties": {
		"productId" :{
			"type": "number",
			"required": true,
			"minLength": 1
		},
		"name" :{
			"type": "string",
			"required": true,
			"minLength": 1,
			"pattern": /^[a-zA-Z0-9-,.:#&()!@$%^*_{}\\\/\s]*$/
		},
		"code" :{
			"type": "string",
			"required": true,
			"minLength": 1,
			"pattern": /^[a-zA-Z0-9-,.:#&()!@$%^*_{}\\\/\s]*$/
		},
		"qty" :{
			"type": "number",
			"required": true,
			"minLength": 1
		},
		"expiryDate" : {
			"type": "string",
			"required": true,
			"pattern": /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
		}
	}
}