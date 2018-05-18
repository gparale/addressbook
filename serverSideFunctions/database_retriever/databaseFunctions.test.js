const databaseFun = require('./databaseFunctions')

test('test existing username', () => {
	databaseFun.getLoginData('Thamy').then((result) => {
		expect(result).toMatchObject({password:'LisiWoo',user_id:1})
	})
})

test('test user data', () => {
	databaseFun.getUserData(1).then((result) => {
		expect(result).toEqual({
			fname:'Thaman',
			lname:'Woo',
			phone_numbers:['6044455286','6047325286'],
			addresses:['555 Seymour Street','Scott Road Station, 110th Ave, Surrey, BC']
		})
	})
})

test('test contact account by first and last name', () => {
	databaseFun.getContAccount('Thaman', 'Woo').then((result) => {
		expect(result).toMatchObject([{user_id:1,fname:'Thaman',lname:'Woo'}])
	})
})

test('test addresses of a contact', () => {
	databaseFun.getContactAddresses(1, 2).then((result) => {
		expect(result).toMatchObject(['3766 E 1st Ave, Burnaby','3766 E 1st Ave, Burnaby'])
	})
})

test('test phone of a contact', () => {
	databaseFun.getContactPhone(1, 2).then((result) => {
		expect(result).toMatchObject(['1232341232'])
	})
})

test('test contacts of a user', () => {
	databaseFun.getContactsInfo(1).then((result) => {
		expect(result).toMatchObject(
			[ { cont_id: 1,
		    firstname: 'Li',
		    lastname: 'Pho',
		    with_account: false,
		    acct_num: null },
		  { cont_id: 2,
		    firstname: 'Sam',
		    lastname: 'Pho',
		    with_account: false,
		    acct_num: null },
		  { cont_id: 3,
		    firstname: 'Turd',
		    lastname: 'Master',
		    with_account: true,
		    acct_num: 2 } ])
	})
})

test('test contacts of a user alt', () => {
	databaseFun.getContInfo(1).then((result) => {
		expect(result).toMatchObject(
			[ { cont_id: 1,
		    fname: 'Li',
		    lname: 'Pho',
		    addresses: [ '555 Seymour Street' ],
		    phone_numbers: [ '6044491231', '7341230987' ] },
		  { cont_id: 2,
		    fname: 'Sam',
		    lname: 'Pho',
		    addresses: [ '3766 E 1st Ave, Burnaby', '3766 E 1st Ave, Burnaby' ],
		    phone_numbers: [ '1232341232' ] },
		  { cont_id: 3,
		    fname: 'Turd',
		    lname: 'Master',
		    addresses: [ 'Scott Road Station, 110th Ave, Surrey, BC' ],
		    phone_numbers: [ '6341234235' ] } ])
	})
})