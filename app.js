const {logger} = require('./logger');
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;
const userController = require('./controller/userController');


//console.log(`running on port ${PORT}`);


app.use("/users", userController);

app.use(loggerMiddleware);

function loggerMiddleware(req, res, next){
  logger.info(`Incoming ${req.method} : ${req.url}`);
  next();
}


/*userService.createUser(uuid.v4(), "user3@email3.com", true)
     .then(data => console.log(data))
     .catch(err => console.error(err));
*/
// userService.getUser("f88170ab-7ec0-4713-91df-fd34fe7d902d")
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

//userService.deleteUser("f88170ab-7ec0-4713-91df-fd34fe7d902d")
  //  .then(data => console.log(data))
    //.catch(err => console.error(err));

app.listen(PORT, () => {
      console.log(`Server is listening on PORT: ${PORT}`);
  });