var defaults = require( '../defaults' );

exports.run = async (request, response) => {
	if (!request.body.email || !request.body.pw) {
		response.status(400).json({ status: false, msg: "One of the required body parameters was left out." })
		return;
	}
	
	var found = await defaults.getUser(request.body.email, request.body.pw)

	console.log(found);
	if (found.email) {
		response.status(200).json({ status: true, msg: "User's account information is valid." })
		return; 
	} else {
		response.status(404).json({ status: false, msg: "User's account information is invalid." })
		return; 
	}
}