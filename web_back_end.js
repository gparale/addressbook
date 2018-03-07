const request = require('request')
const express = require('express')
const app = express()

app.use(express.static(__dirname + "/src"))
app.get("/",(request, response) => {
	response.sendFile(__dirname + "/web_front_end.html")
	//response.end('This is a test for stuff')
})

app.get("/resources", (request, response)=>{
	console.log(request.body);
	response.send("yo dawg")
})
app.listen(3000, (err) => {
	if (err) {
		console.log('Server is down');
		return false;
	}
	console.log('Server is up');
})
