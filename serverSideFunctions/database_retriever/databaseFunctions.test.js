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
		expect(result).toMatchObject([ { user_id: 1, fname: 'Thaman', lname: 'Woo' } ])
	})
})

test('test addresses of a contact', () => {
	databaseFun.getContactAddresses(1, 2).then((result) => {
		expect(result).toMatchObject([ '3766 E 1st Ave, Burnaby', '3766 E 1st Ave, Burnaby' ])
	})
})

