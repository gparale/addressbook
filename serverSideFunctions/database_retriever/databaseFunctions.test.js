const databaseFun = require('./databaseFunctions')

describe('test existing user data', () => {
  test('existing username', () => {
    expect(databaseFun.getLoginData('Thamy')).toHaveProperty('password', 'LisiWoo')
    expect(databaseFun.getLoginData('Thamy')).toHaveProperty('user_id', '1')
  });
})

describe('', () => {
  test('', () => {
    expect(databaseFun.getLoginData('Thamy')).toHaveProperty('password', 'LisiWoo')
  });
})