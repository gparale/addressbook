const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const hbs = require('hbs')
const fs = require('fs')

const { Pool, Client } = require('pg')

const pgSession = require('connect-pg-simple')(session)

const app = express();

var dbURL = process.env.DATABASE_URL || "postgres://postgres:thegreatpass@localhost:5432/callcenter"; // change this per db name

const pgpool = new Pool({
    connectionString: dbURL,
})

/*pgpool.query('SELECT username fROM USERS WHERE password= $1', ["LisiWoo"], (err, res) => {
    //console.log(err, res)
    console.log(res.rows[0].username)
    //console.log(res.rows[0].username)
    pool.end()
})*/

app.use(express.static(__dirname + "/src"))

app.use((request, response, next) => {
    profile = hbs.compile(fs.readFileSync(__dirname + "/views/radicals/profile.hbs", 'utf8'))
    contacts = hbs.compile(fs.readFileSync(__dirname + "/views/radicals/contacts.hbs", 'utf8'))
    next();
})


hbs.registerPartials(__dirname + "/views/partials")


app.use(bodyParser.json()) //Needed for when retrieving JSON from front-end

app.set('view engine', 'hbs')

app.use(session({
    secret: 'tolkien',
    store: new pgSession({
        pool: pgpool,
        tableName: 'session'
    }),
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60 * 60000 }
}))


app.get("/", (request, response) => {

    response.sendFile(__dirname + "/front_end.html")
    //response.end('This is a test for stuff')
})

app.post("/login", (request, response) => {
    pgpool.query('SELECT password, user_id FROM users WHERE username = $1', [request.body["user"]], (err, res) => {
        if (res.rows.length === 0) {
            response.json({ message: "Login Failed", url: "Message Failed" })
        } else {
            if (res.rows[0].password == request.body["pass"]) {
                request.session.user_id = res.rows[0].user_id
                response.json({ message: "Login Successful", url: "hub" })
            } else {
                response.json({ message: "Login Failed", url: "Message Failed" })
            }
        }
    })
})

//---------------------------------------------------------------------------------------------------------------
/* From this line, look at the additions for the hub and the logout button*/
//FRONT END CALL CENTRE HUB
app.get("/hub", (request, response, next) => {
    sessionInfos = request.session.user_id
    pgpool.query('insert into sess_user(sid, user_id) values ( $1, $2)', [request.sessionID, sessionInfos])
    pgpool.query('select username, fname, lname, p_numbers, locate, firstname, lastname, address, phone from (select * from users where user_id = $1) n1 left join (select * from contacts) n2 on (n1.user_id =n2.user_id)', [sessionInfos], (err, res) => {
        if (err || res.rows.length === 0) {
            response.json({ message: "NOK" })
        } else {
            profile_info = { fname: res.rows[0].fname, lname: res.rows[0].lname, p_numbers: [{ number: res.rows[0].p_numbers }], locs: [{ location: res.rows[0].locate }] }
            contactees = []

            for (i = 0; i < res.rows.length; i++) {
                cont_info = { fname: res.rows[i].firstname, lname: res.rows[i].lastname, p_number: res.rows[i].phone, location: res.rows[i].address }
                contactees.push(cont_info)
            }
            response.render("hub.hbs", {
                username: res.rows[0].username,
                sel: [{
                    id_name: "profile",
                    opt_name: "Profile",
                    img_source: "https://d30y9cdsu7xlg0.cloudfront.net/png/138926-200.png",
                    layout: profile(profile_info),
                    script: ""
                }, {
                    id_name: "contacts",
                    opt_name: "Contacts",
                    img_source: "http://www.gaby-moreno.com/administrator/public_html/css/ionicons/png/512/android-contacts.png",
                    layout: contacts({
                        contact: contactees

                    }),
                    script: "/contacts.js"
                }]
            })
        }

    })

})

//LOGOUT FUNCTION
app.post("/logout", (request, response) => {
    request.session.destroy()
    response.json({ status: "OK", message: "Log out successfully" })

})

app.post("/update", (request, response) => {
    sessionInfos = request.session.user_id
    new_phone = request.body["phone"]
    new_address = request.body["address"]
    pgpool.query('update users set p_numbers = $2, locate = $3 where user_id = $1', [sessionInfos, new_phone, new_address], (err, res) => {
        if (err) {
            response.json({ status: "NOK", message: "Update Not Added" })
        } else {
            response.json({ status: "OK", message: "Update Added" })
        }
    })
})

app.post("/addcontact", (request, response) => {
    if (!(request.body["fname"] === "") && !(request.body["lname"] === "")) {
        sessionInfos = request.session.user_id
        new_fname = request.body["fname"]
        new_lname = request.body["lname"]
        new_phone = request.body["phone"]
        new_address = request.body["address"]
        pgpool.query('insert into contacts(user_id, firstname, lastname, address, phone) values ($1, $2, $3, $4, $5)', [sessionInfos, new_fname, new_lname, new_address, new_phone], (err, res) => {
            if (err) {
                console.log(err);
                response.json({ status: "NOK", message: "Contact Not Added" })
            } else {
                response.json({ status: "OK", message: "Contact Added" })
            }
        })
    } else {
        response.json({ status: "NOK", message: "Required fields not filled" })
    }
})
//Code copy ends here
//--------------------------------------------------------------------------------------------------------------------------

app.post("/signup", function(req, resp) {
    if (!(req.body["fname"] === "") && !(req.body["lname"] === "") && !(req.body["user"] === "") && !(req.body["pass"] === "")) {
        pgpool.query('insert into users(username, password, fname, lname) values($1, $2, $3, $4)', [req.body["user"], req.body["pass"], req.body["fname"], req.body["lname"]], (err, res) => {
            if (err) {
                resp.json({ status: "NOK", message: "Signup Failed: Username or Password already in use" })
            } else {
                pgpool.query('SELECT user_id FROM users WHERE username = $1', [req.body["user"]], (err, res) => {
                    req.session.user_id = res.rows[0].user_id
                    resp.json({ status: "OK", url: "hub" })
                })
            }

        })

    } else {
        resp.json({ status: "NOK", message: "Signup Failed: Failed to fill required fields" })
    }
});

app.listen(3000, (err) => {
    if (err) {
        console.log('Server is down');
        return false;
    }
    console.log('Server is up');
})