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

//pool.query('SELECT username fROM USERS WHERE password= $1', ["isiWoo"], (err, res) => {
//    //console.log(err, res)
//    console.log(res)
//    //console.log(res.rows[0].username)
//    pool.end()
//})

app.use(express.static(__dirname + "/src"))

app.use((request, response, next)=>{
    profile = hbs.compile(fs.readFileSync(__dirname + "/views/radicals/profile.hbs", 'utf8'))
    contacts = hbs.compile(fs.readFileSync(__dirname + "/views/radicals/contacts.hbs", 'utf8'))
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

app.post("/login", (request, response, next) => {
    console.log(request.sessionID)
    /*if (request.body["request-type"] === "login") {
        if (request.body["name"] === "glenn" && request.body["pass"] === "slit") {
            request.session.myvar = request.body
            response.json({ message: "Login Successful", url: "hub" })
        } else {
            response.json({ message: "Login Failed", url: "Message Failed" })
        }

    } */
    
    pool.query('SELECT password, user_id FROM USERS where username= $1', [ request.body["name"] ], (err, res) => {
        console.log(res)
        if(res.rows.length === 0){
            response.json({ message: "Login Failed", url: "Message Failed" })
        }else{
            if(res.rows[0].password == request.body["pass"]){
                //---------------------------------------------------------------------
                var sess_pk_id = res.rows[0].user_id;
                //console.log(request.session)
                //console.log(request.session.cookie._expires)
                //console.log(request.session.cookie.originalMaxAge)
                //console.log(request.sessionID)
                pool.query("Insert into sessions (pk_id, s_id, sess, expire) VALUES ($1, $2, $3, $4)", [sess_pk_id, request.sessionID, request.session, request.session.cookie._expires]);
                request.session.user_id = res.rows[0].user_id
                
                //---------------------------------------------------------------------
                response.json({ message: "Login Successful", url: "hub" })
            }else{
                response.json({ message: "Login Failed", url: "Message Failed" })
            }
        }
    })
})

app.get("/hub", (request, response, next) => {
    
    console.log(request.sessionID)
    
    user_id = request.session.user_id
    
    user_id = pool.query("SELECT user_id from users where s_id = $1", [user_id], (err, res)=>{
        console.log(res.rows[0])
        return res.rows[0]
    })
    
    console.log(user_id)
    information = {}
    
    response.render("hub.hbs", {
        username: "Romy Lee",
        sel: [{
            id_name: "profile",
            opt_name: "Profile",
            img_source: "https://d30y9cdsu7xlg0.cloudfront.net/png/138926-200.png",
            layout: profile({
                fname: "Romy",
                lname: "Li",
                comment: "He's Romy Li",

                p_numbers: [
                {number: "604 600 2312"}],

                locs: [
                {location: "3322 Atelier St, Therson, Arizona, USA"}
                ]
            }),
            script: ""
        }, {
            id_name: "contacts",
            opt_name: "Contacts",
            img_source: "http://www.gaby-moreno.com/administrator/public_html/css/ionicons/png/512/android-contacts.png",
            layout: contacts({
                contact: [
                {fname: "Li", lname: "Hue Son", p_number: "604 445 6212", location: "3432 Des St, Adres, Arizona, USA"},
                {fname: "Pes", lname: "Hue Son", p_number: "604 445 3421", location: "3432 Des St, Adres, Arizona, USA"},
                {fname: "Tommy", lname: "Ma", p_number: "604 232 8873", location: "12344 Titer Ave, Les Straud, California, USA"},
                {fname: "Uder", lname: "Yeser", p_number: "212 656 5565", location: "1002 Log Drive, Preston, Wyoming, USA"}
                ]
                
            }),
            script: "/contacts.js"
        }]
    })
})

app.post("/signup", function(request, response) {
    if ((request.body["fname"] === "") || (request.body["lname"] === "") || (request.body["uname"] === "") || (request.body["pword"] === "") || (request.body["cpword"] === "")) {
        response.json({ message: "Signup failed.", url: "Message Failed" })
    }
    else if (request.body["pword"] != request.body["cpword"]) {
        response.json({ message: "Signup failed.", url: "Message Failed" })
    }
    else {
        pool.query("Insert into users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4)", [request.body["uname"], request.body["pword"], request.body["fname"], request.body["lname"]]);
    }
});

app.post("/logout", (request, response)=>{
    pool.query('DELETE FROM sessions WHERE s_id= $1', [request.session.ID]);
    request.session.destroy()
    response.json({status: "OK", message:"Log out successfully"})
})

app.listen(3000, (err) => {
    if (err) {
        console.log('Server is down');
        return false;
    }
    console.log('Server is up');
})