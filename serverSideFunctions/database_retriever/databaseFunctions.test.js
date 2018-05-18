const databaseFun = require('./databaseFunctions')

test('test existing username', () => {
	databaseFun.getLoginData('Thamy').then((result) => {
		expect(result).toMatchObject({password:'LisiWoo',user_id:1})
	})
})

test('test user data', () => {
	databaseFun.getUserData(1).then((result) => {
		expect(result).toMatchObject({user_id:1,fname:'Thaman',lname:'Woo'})
	})
})
