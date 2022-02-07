const moment = require("moment-timezone")
const { google } = require('googleapis');
const calendar = google.calendar('v3');

exports.run = async (request, response) => {
	var isoString = moment().tz('America/New_York').toISOString();
	if(request.body.date){
		isoString = moment(request.body.date).tz('America/New_York').toISOString()
	}
	var calendarId = 'lexingtonma.org_qud45cvitftvgc317tsd2vqctg@group.calendar.google.com';

	var userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	if (!userTimeZone) {
		userTimeZone = 'America/New_York';
	}

	console.log()
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
  google.options({auth: authClient});

	var res = await calendar.events.list({
				'calendarId': calendarId,
				'timeZone': userTimeZone,
				'singleEvents': true,
				'timeMin': `${currentYear}-${currentMonth}-${currentDay}T04:00:00.000Z`,
				'timeMax': `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}T04:00:00.000Z`,
				'maxResults': 20,
				'orderBy': 'startTime'
	})

	response.status(200).json({ "status":true, "msg":"Obtained recent calendar information.", data: res.data.items })
		return;
}