const logger = require("./util/logger");
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;
const userController = require('./controller/userController');

const ticketController = require('./controller/ticketController');

const { authenticateToken } = require('./util/jwt');

//console.log(`running on port ${PORT}`);


app.use("/users", userController);



app.use(loggerMiddleware);

app.use("/tickets", authenticateToken, ticketController);

function loggerMiddleware(req, res, next){
  logger.info(`Incoming ${req.method} : ${req.url}`);
  next();
}


app.get("/protected", authenticateToken, (req, res) => {
  return res.json({message: "Accessed Protected Route", user: req.user});
})




app.listen(PORT, () => {
      console.log(`Server is listening on PORT: ${PORT}`);
  });