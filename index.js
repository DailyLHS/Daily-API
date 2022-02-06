const express = require("express");
const app = express();
const port = 3000;

const slowDown = require("express-slow-down");

const speedLimiter = slowDown({
	windowMs: 15 * 60 * 1000, // 15 minutes
	delayAfter: 100, // allow 100 requests per 15 minutes, then...
	delayMs: 500 // begin adding 500ms of delay per request above 100:
});

var cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
var mongoUtil = require( './mongoUtil' );

mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
} );


app.use(cors());
app.use(speedLimiter);
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.use(bodyParser.json());

app.use(express.static("public"));

app.post("/:loc/:end", async (req, res) => {
	console.log(req.body)
	try {
		var endpoint = `./${req.params.loc}/endpoints/${req.params.end}.js`
		let commandFile = require(endpoint);
		var commit = await commandFile.run(req, res);
		if(!res.headersSent){
			res.status(400).json({ msg: "The API failed. Try again and check your parameters." })
		}
	} catch (err) {
		console.log(err);
		if (err.code === "MODULE_NOT_FOUND") {
			return;
		}
	}
})

app.listen(port, () => console.log(`TheorizeAPI is now live on port 3000!`));
