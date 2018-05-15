/**
 * @file This is the database module which the server will use to retrieve data from the database
 * @author Glenn Parale
 */
const { Pool, Client } = require('pg')

var dbURL = process.env.DATABASE_URL || "postgres://postgres:thegreatpass@localhost:5432/callcenter";

const pgpool = new Pool({
    connectionString: dbURL,
})

var getLoginData = (username) => {
    return new Promise((resolve, reject) => {
        pgpool.query('SELECT password, user_id FROM users WHERE username = $1', [username], (err, res) => {
            if (res.rows.length === 0) {
                reject('Not Found')
            } else {
                resolve(res.rows[0])
            }
        })
    })
}

var getUserData = (user_id) => {
    return new Promise((resolve, reject) => {
        pgpool.query('SELECT fname, lname FROM users WHERE user_id = $1', [user_id], (err, res) => {
            if (res.rows.length === 0) {
                reject('Not Found')
            } else {
                user_Data = { fname: res.rows[0].fname, lname: res.rows[0].lname }
                pgpool.query('SELECT p_number FROM user_phone WHERE user_id = $1', [user_id], (err, res) => {
                    phone_number = []
                    for (i = 0; i < res.rows.length; i++) {
                        phone_number.push(res.rows[i].p_number)
                    }
                    user_Data['phone_numbers'] = phone_number
                    pgpool.query('SELECT address FROM user_address WHERE user_id = $1', [user_id], (err, res) => {

                        addresses = []
                        for (i = 0; i < res.rows.length; i++) {
                            addresses.push(res.rows[i].address)
                        }
                        user_Data['addresses'] = addresses
                        resolve(user_Data)

                    })


                })
            }
        })
    })
}

var getContAccount = (fname, lname) => {
    return new Promise((resolve, reject) => {
        pgpool.query('SELECT user_id, fname, lname FROM users WHERE fname = $1 and lname= $2', [fname, lname], function(err, res) {
            if (res.rows.length !== 0) {
                resolve(res.rows)
            }
        })
    })
}
var getContactAddresses = (user_id, cont_id) => {
    return new Promise((resolve, reject) => {
        pgpool.query('SELECT address FROM contact_address WHERE user_id= $1 and cont_id= $2', [user_id, cont_id], function(err, res) {
            addresses = []
            for (i = 0; i < res.rows.length; i++) {
                addresses.push(res.rows[i].address)
            }
            resolve(addresses)
        })
    })
}

var getContactPhone = (user_id, cont_id) => {
    return new Promise((resolve, reject) => {
        pgpool.query('SELECT p_number FROM contact_phone WHERE user_id= $1 and cont_id= $2', [user_id, cont_id], function(err, res) {
            numbers = []
            for (i = 0; i < res.rows.length; i++) {
                numbers.push(res.rows[i].p_number)
            }
            resolve(numbers)
        })
    })
}

var getContactsInfo = (user_id) => {
    return new Promise((resolve, reject) => {
        pgpool.query('SELECT cont_id ,firstname, lastname, with_account, acct_num FROM contacts WHERE user_id = $1', [user_id], (err, res) => {
            if (res.rows.length > 0) {
                resolve(res.rows)
            } else {
                reject('No contacts')
            }
        })

    })
}

async function getContInfo(user_id) { //A way to call promises "synchronously"
    var x = await getContactsInfo(user_id) //Used the await function for stuff that needs promise pending
    contacts = []
    for (let i in x) { //Do not use the normal for loop otherwise it wouldn't work
        cont_info = { cont_id: x[i].cont_id, fname: x[i].firstname, lname: x[i].lastname }

        if (x[i].with_account === false) {
            var y = await getContactAddresses(user_id, x[i].cont_id)

            cont_info['addresses'] = y

            var z = await getContactPhone(user_id, x[i].cont_id)

            cont_info['phone_numbers'] = z

            contacts.push(cont_info)
        } else {
            var b = await getUserData(x[i].acct_num)
            cont_info['addresses'] = b.addresses
            cont_info['phone_numbers'] = b.phone_numbers
            contacts.push(cont_info)
        }

    }
    return contacts
}

var addContactPhone = (cont_id, user_id, phone_number) => {
    return new Promise((resolve, reject) => {
        if((/^[0-9]+$/.test(phone_number)) && (phone_number.length >= 10) && (phone_number.length < 14)){
            resolve('Number Has Been Added')
        } else {
            reject('Invalid Number')
        }
        /*pgpool.query('INSERT INTO contact_phone(cont_id, user_id, p_number) VALUES($1,$2,$3);', [cont_id, user_id, phone_number], (err, res) => {
            if (err) {
                reject('Phone Number Not Added')
            }
            resolve('Phone Number Added')
        })*/
    })

}

var addContactAddress = (cont_id, user_id, address) =>{
    return new Promise((resolve, reject)=>{
        resolve('Address Added')
    })
    /*pgpool.query('INSERT INTO contact_address(cont_id, user_id, address) VALUES($1,$2,$3);', [cont_id, user_id, address], (err, res) => {
            if (err) {
                reject('Address Not Added')
            }
            resolve('Address Added')
        })*/
}

var createAccount = (e_mail, password) => {
    return new Promise((resolve, reject)=>{
        resolve('Account Added')
    })
}

var addUserAddress = (address) =>{
    return new Promise((resolve, reject)=>{
        resolve('User Address Addedd')
    })
}

var addUserPhone = (phone_number) =>{
    return new Promise((resolve, reject)=>{
        resolve('User Phone Number Added')
    })
}
module.exports = { getLoginData, getUserData, getContInfo, getContAccount, addContactPhone, addContactAddress, createAccount, addUserPhone, addUserAddress}