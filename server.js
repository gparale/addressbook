const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const hbs = require('hbs')
const fs = require('fs')

const { Pool, Client } = require('pg')

const app = express();

var dbURL = process.env.DATABASE_URL || "postgres://postgres:thegoodpass@localhost:5432/postgres"; // change this per db name

const pool = new Pool({
    connectionString: dbURL,
})

/*pool.query('SELECT username fROM USERS', (err, res) => {
    //console.log(err, res)
    //console.log(res.rows[0].username)
    pool.end()
})*/

app.use(express.static(__dirname + "/src"))

app.use((request, response, next)=>{
    profile = hbs.compile(fs.readFileSync(__dirname + "/views/radicals/profile.hbs", 'utf8'))
    next();
})


hbs.registerPartials(__dirname + "/views/partials")


app.use(bodyParser.json()) //Needed for when retrieving JSON from front-end
app.set('view engine', 'hbs')
app.use(session({ secret: 'tolkien', saveUninitialized: false, resave: false, cookie: { maxAge: 5 * 60000 } }))


app.get("/", (request, response) => {

    response.sendFile(__dirname + "/front_end.html")
    //response.end('This is a test for stuff')
})

app.post("/resources", (request, response, next) => {

    if (request.body["request-type"] === "login") {
        if (request.body["name"] === "glenn" && request.body["pass"] === "slit") {
            request.session.myvar = request.body
            response.json({ message: "Login Successful", url: "hub" })
        } else {
            response.json({ message: "Login Failed", url: "Message Failed" })
        }
    }
    /*else if (request.body["request-type"] === "signup") {

       }*/
    //response.redirect("/hub")
})

app.get("/hub", (request, response, next) => {
    sessionInfos = request.session.myvar

    response.render("hub.hbs", {
        username: sessionInfos["name"],
        sel: [{
            opt_name: "Profile",
            img_source: "https://d30y9cdsu7xlg0.cloudfront.net/png/138926-200.png",
            layout: profile({
                fname: "Romy",
                lname: "Li",
                comment: "He's Romy Li"
            })
        }, {
            opt_name: "Contacts",
            img_source: "http://www.gaby-moreno.com/administrator/public_html/css/ionicons/png/512/android-contacts.png",
            layout: profile({
                fname: "Romy",
                lname: "Li",
                comment: "He's Romy Li"
            })
        }]
    })
})

app.post("/signup", function(req, resp) {
    var username = req.body.name;
    var passcode = req.body.pass;

    pg.connect(dbURL, function(err, client, done) {
        if (err) {
            console.log(err);
            var obj = {
                status: "fail",
                msg: "CONNECTION FAIL"
            }
            resp.send(obj);
        }
    })
});

app.listen(3000, (err) => {
    if (err) {
        console.log('Server is down');
        return false;
    }
    console.log('Server is up');
})