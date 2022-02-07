# Welcome to theorize.world API

The following public API is made for projects under the perview of [theorize.world](https://theorize.world). Most projects will have a Public API associated with them. 

- The base URL of the api is [api.theorize.world](https://api.theorize.world). All endpoints go afterwards.
- You should have the generic headers for your requests. Ensure to set `Content-Type` to `application/json`.
-  Most endpoints will only require the use of `body` data in the form of a stringified JSON.
- Successful responses have a `200` status and a response key of `status: true`. Failed ones will have a response key of `status: false`.

### Are there any issues?

If you find something that is not working as it should, or you need help using the API, shoot me an email at [ali@mosallaei.com](mailto:ali@mosallaei.com).

## Daily

To use most endpoints of this API, you need an account on [Daily](https://daily.mynt.pw/).

### [POST] /daily/verify

This endpoint checks whether the user's account information is valid or not.

- Method: `POST`
- Parameters:
```json
{
	email: "Your Daily email",
	pw: "Your Daily password, as plaintext"
}
```
- Successful Response:
```json
{
	status: true,
	msg: "User's account information is valid."
}
```

### [POST] /daily/userInfo

Returns your user information. Some fields will be omitted unless you have the master override. Contact [me](mailto:ali@mosallaei.com) if you would like access to more data.

---
#### Omitted Data
- `idcard` - User's ID card URL.
- `lastseen` - ID of last seen announcement [DEPRECATED].
- `friendcode` - The unique friend code of the user.
- `avatar` - URL of user's avatar.
- `type` - Account type of the user.
- `iblocks` - List of I-blocks user has entered.
---

- Method: `Post`
- Parameters:
```json
{
	email: "Your Daily email",
	pw: "Your Daily password, as plaintext"
}
```
- Successful Response:
```json
{ 
	status: true, 
	msg: "User data has been located and returned.", 
	data: { 
		//json of User Data 
	}
}
```

### [POST] /daily/getUnparsedDay

This endpoint will return an unparsed list of blocks happening in a current day. It is an array of JSONs from the GCalendar API.

- Method: `Post`
- Parameters:
```json
{
	date: "Not required. If omitted, current time will be used. Enter an ISO string for a certain day."
}
```
- Successful response:
```json
{ 
	status:true, 
	msg:"Obtained recent calendar information.",
	data: [
		// Array of calendar info.
	]
}
```

### [POST] /daily/getParsedDay

This endpoint will return an parsed list of blocks, along with the current day number and other information.

- Method: `Post`
- Parameters:
```json
{
	date: "Not required. If omitted, current time will be used. Enter an ISO string for a certain day."
}
```
- Successful response:
```json
{ 
	status: true,
	msg: "Obtained recent calendar information, and parsed it.",
	todayJsons: [
		// Array of JSONs for each block.
	],
	todayDay: // A number corresponding to the day, 
	todayText: [
		// Array of strings for each block's name.
	], 
	otherInfo: [
		// An array of strings signifying alternate info about the day.
	]}
```