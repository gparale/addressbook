const request = require('request')
const express = require('express')
const app = express()

app.get("/",(request, response) => {
	//resp.sendFile("HTML file directory")
	response.end('This is a test for stuff')
})

app.listen(3000, (err) => {
	if (err) {
		console.log('Server is down');
		return false;
	}
	console.log('Server is up');
})
