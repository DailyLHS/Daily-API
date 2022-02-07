var defaults = require( '../defaults' );

exports.run = async (request, response) => {
	if (!request.body.email || !request.body.pw) {
		response.status(400).json({ status: false, msg: "One of the required body parameters was left out." })
		return;
	}
	
	var found = await defaults.getUser(request.body.email, request.body.pw)

	if (!found.email) {
		response.status(404).json({ status: false, msg: "User's account information is invalid." })
		return; 
	}

	var sendable = found
	delete sendable.pw
	delete sendable._id

	if(!request.body.override || request.body.override != process.env['OVERRIDE']){
		delete sendable.idcard
		delete sendable.lastseen
		delete sendable.friendcode
		delete sendable.avatar
		delete sendable.type
		delete sendable.iblocks
	}

	response.status(200).json({ status: true, msg: "User data has been located and returned.", data: sendable });
	return;
}