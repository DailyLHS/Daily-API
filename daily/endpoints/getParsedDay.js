const moment = require("moment-timezone")
const { google } = require('googleapis');
const calendar = google.calendar('v3');

exports.run = async (request, response) => {
	var isoString = moment().tz('America/New_York').toISOString();
	if (request.body.date) {
		if(!request.body.date.includes("T")){
			response.status(403).json({ status: false, msg: "Your date must be formatted into an ISO string, Zulu time (In EST, 12am is 0500)." });
			return;
		}
		isoString = moment(request.body.date).tz('America/New_York').toISOString()
	}
	var calendarId = 'lexingtonma.org_qud45cvitftvgc317tsd2vqctg@group.calendar.google.com';

	var userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	if (!userTimeZone) {
		userTimeZone = 'America/New_York';
	}

	console.log(isoString)
	var currentYear = moment(isoString).tz('America/New_York').format('YYYY');
	var currentMonth = moment(isoString).tz('America/New_York').format('MM');
	var currentDay = moment(isoString).tz('America/New_York').format('DD')
	
	const tomorrowMoment = moment(isoString).tz('America/New_York').clone().add(1, 'days')
	var tomorrowYear = tomorrowMoment.format("YYYY");
	var tomorrowMonth = tomorrowMoment.format("MM");
	var tomorrowDay = tomorrowMoment.format("DD");

	const auth = new google.auth.GoogleAuth({
		// Scopes can be specified either as an array or as a single, space-delimited string.
		scopes: [
			'https://www.googleapis.com/auth/calendar',
			'https://www.googleapis.com/auth/calendar.events',
			'https://www.googleapis.com/auth/calendar.events.readonly',
			'https://www.googleapis.com/auth/calendar.readonly',
		],
	});

	// Acquire an auth client, and bind it to all future calls
	const authClient = await auth.getClient();
	google.options({ auth: authClient });

	var res = await calendar.events.list({
		'calendarId': calendarId,
		'timeZone': userTimeZone,
		'singleEvents': true,
		'timeMin': `${currentYear}-${currentMonth}-${currentDay}T05:00:00.000Z`,
		'timeMax': `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}T04:59:00.000Z`,
		'maxResults': 20,
		'orderBy': 'startTime'
	})

	var todaysBlocksAlpha = res.data.items

	var todayJsons = []
	var todayText = [];
	var todayDay = ``
	var otherInfo = []

	for (var i in todaysBlocksAlpha) {
		if (todaysBlocksAlpha[i].summary.split(" ")[0] == "Day") {
			todayDay = todaysBlocksAlpha[i].summary;
			break;
		}
	}

	var trueParseDate = moment(isoString).format("MM-DD-YY")
	todayDay = todayDay.toLowerCase().split(" ");
	todayDay = parseInt(todayDay[todayDay.indexOf('day') + 1])


	for (i = 0; i < todaysBlocksAlpha.length; i++) {
		if (moment(todaysBlocksAlpha[i].start.dateTime).format('h:mm') == moment(todaysBlocksAlpha[i].end.dateTime).format('h:mm')) {
			continue;
		} else {
			todayJsons.push(todaysBlocksAlpha[i])
			todayText.push(todaysBlocksAlpha[i].summary)
		}
	}

	if (todayJsons.length > 0) {
		var checkHalfDay = moment(todayJsons[todayJsons.length - 1].end.dateTime).tz("America/New_York").format('H');

		if (checkHalfDay == "12") {
			otherInfo.push("Half day.")
		}
	} else {
		otherInfo.push("No school.")
	}

	response.status(200).json({ "status": true, "msg": "Obtained recent calendar information, and parsed it.", todayJsons, todayDay, todayText, otherInfo })
	return;
}