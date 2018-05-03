const databaseFun = require('./databaseFunctions')

databaseFun.getLoginData('Thamy').then((result) => { console.log(result) })

databaseFun.getUserData(1).then((result) => { console.log(result); })

//databaseFun.contactInfo(2)


databaseFun.getContInfo(1).then((result)=>{
	console.log(result)
})

databaseFun.getContInfo(2).then((result)=>{
	console.log(result)
}).catch((err)=>{console.log(err)})

databaseFun.getContAccount('Thaman', 'Woo').then((result)=>{
	console.log(result)
})

databaseFun.addContactPhone(4, 1, '6044455555555').then((result)=>{
	console.log(result)
})