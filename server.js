//const request = require('request')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const hbs = require('hbs')

const app = express();

app.use(express.static(__dirname + "/src"))
app.use(bodyParser.json()) //Needed for when retrieving JSON from front-end
app.set('view engine', 'hbs')
app.use(session({secret: 'tolkien', saveUninitialized: false, resave: false, cookie: {maxAge: 5*60000}}))


app.get("/",(request, response) => {

	response.sendFile(__dirname + "/front_end.html")
	//response.end('This is a test for stuff')
})

app.post("/resources", (request, response, next)=>{
	if (request.body["name"] === "Glenn" && request.body["pass"] === "slit"){
		request.session.myvar = request.body
		console.log("Log From /resources")
		console.log(request.session)
		console.log(request.sessionID)
		response.json({message: "Login Successful", url: "hub"})
	} else{
		response.json({message: "Login Failed", url: "Message Failed"})
	}
	
	//response.redirect("/hub")
})

app.get("/hub", (request, response, next) =>{
	console.log("log from /hub")

	console.log(request.session)
	console.log(request.sessionID);
	
	response.send(request.session.myvar)
})
app.listen(3000, (err) => {
	if (err) {
		console.log('Server is down');
		return false;
	}
	console.log('Server is up');
})
