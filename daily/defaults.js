const { MongoClient } = require("mongodb");
var atob = require('atob');
var mongoUtil = require('../mongoUtil');

module.exports = {
	getUser: async (email, pw) => {
		var c = mongoUtil.getDb();
		var found = await c.collection("users").findOne({ email: email })

		if (found && pw == atob(found.pw)) {
			return found;
		} else {
			return {}
		}
	}
}