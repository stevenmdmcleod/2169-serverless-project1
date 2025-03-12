const {logger} = require('./logger');
const userService = require('./service/userService');
const uuid = require('uuid');

userService.createUser(uuid.v4(), "user3@email3.com", true)
     .then(data => console.log(data))
     .catch(err => console.error(err));

// userService.getUser("f88170ab-7ec0-4713-91df-fd34fe7d902d")
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

//userService.deleteUser("f88170ab-7ec0-4713-91df-fd34fe7d902d")
  //  .then(data => console.log(data))
    //.catch(err => console.error(err));