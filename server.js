<<<<<<< HEAD
const request = require('request')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()
=======
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
>>>>>>> fc3f8a38b28124f6289119963417172ef751a42d

app.use(express.static(__dirname + "/src"))
app.use(bodyParser.json()) //Needed for when retrieving JSON from front-end
app.set('view engine', 'ejs')
app.use(session({secret: 'tolkien', saveUninitialized: false, resave: false, cookie: {maxAge: 5*60000}}))


app.get("/",(request, response) => {

	response.sendFile(__dirname + "/front_end.html")
	//response.end('This is a test for stuff')
})

app.post("/resources", (request, response, next)=>{
	request.session.myvar = request.body
	console.log("Log From /resources")
	console.log(request.session)
	console.log(request.sessionID)
	response.json({message: "Success", url: "hub"})
	//response.redirect("/hub")
})

app.get("/hub", (request, response, next) =>{
	console.log("log from /hub")

	console.log(request.session)
	console.log(request.sessionID);
	console.log(request.cookies)
	
	response.send("stuff")
})
app.listen(3000, (err) => {
	if (err) {
		console.log('Server is down');
		return false;
	}
	console.log('Server is up');
})
