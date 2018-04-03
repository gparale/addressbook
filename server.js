//const request = require('request')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const hbs = require('hbs')
const { Pool, Client } = require('pg')

const app = express();

var dbURL = process.env.DATABASE_URL || "postgres://postgres:thegoodpass@localhost:5432/postgres"; // change this per db name

const pool = new Pool({
    connectionString: dbURL,
})

pool.query('SELECT username fROM USERS', (err, res) => {
    //console.log(err, res)
    console.log(res.rows[0].username)
    pool.end()
})

app.use(express.static(__dirname + "/src"))
app.use(bodyParser.json()) //Needed for when retrieving JSON from front-end
app.set('view engine', 'hbs')
app.use(session({secret: 'tolkien', saveUninitialized: false, resave: false, cookie: {maxAge: 5*60000}}))


app.get("/",(request, response) => {

	response.sendFile(__dirname + "/front_end.html")
	//response.end('This is a test for stuff')
})

app.post("/resources", (request, response, next)=>{
	/*if (request.body["name"] === "Glenn" && request.body["pass"] === "slit"){
		request.session.myvar = request.body
		console.log("Log From /resources")
		console.log(request.session)
		console.log(request.sessionID)
		response.json({message: "Login Successful", url: "hub"})
	} else{
		response.json({message: "Login Failed", url: "Message Failed"})
	}
	*/
    if (request.body["request-type"] === "login") {
                        
    }
    else if  (request.body["request-type"] === "signup") {
        
    }
	//response.redirect("/hub")
})

app.get("/hub", (request, response, next) =>{
	console.log("log from /hub")

	console.log(request.session)
	console.log(request.sessionID);
	
	response.send(request.session.myvar)
})

app.post("/signup", function(req, resp){
    var username = req.body.name;
    var passcode = req.body.pass;
    
    pg.connect(dbURL, function(err, client, done){
       if(err){
           console.log(err);
           var obj = {
               status:"fail",
               msg:"CONNECTION FAIL"
           }
           resp.send(obj);
        }
        
        client.query("INSERT INTO users (username, passcode) VALUES ($1, $2, $3)", [username, passcode], function(err, result){
            done();
            if(err){
                console.log(err);
                var obj = {
                   status:"fail",
                   msg:"Username/passcode is/are invalid"
                }
                resp.send(obj);
            }
                     
            var obj = {
                status:"success"
            }
            resp.send(obj);
        });
    });
});

app.listen(3000, (err) => {
	if (err) {
		console.log('Server is down');
		return false;
	}
	console.log('Server is up');
})
