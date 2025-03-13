const express = require("express");
const router = express.Router();
const userService = require('../service/userService');
const {logger} = require('../logger');
//const app = express();
const uuid = require('uuid');
//app.use(express.json());
router.use(express.json());


router.get("/", (req, res) => {
    res.status(200).send("This is the root users route");
    logger.info(`Get request made: ${req.body}`);
});


router.get("/:userId", async (req, res) => {
    const id = req.params.userId;
    console.log(id);
    //console.log(userService.getUser(id));
    const user = await userService.getUser(id);
    res.status(200).json(user);
    //res.status(200).send("This is the root users route");
    logger.info(`Get request made: id = ${id}`);
});


router.post("/", (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    
    res.status(201).json(
    userService.createUser(id = uuid.v4(), jsonData.email, true)
    .then(data => {console.log(data), logger.info(`id: ${id}, email: ${jsonData.email}`)})
    .catch(err => console.error(err))
    );

    //res.status(201).json({message: "Item Created!", item: jsonData});
});

router.delete("/:userId", async (req, res) => {
    const id = req.params.userId;
    console.log(id);
    //console.log(userService.getUser(id));
    const msg = await userService.deleteUser(id);
    res.status(200).json(msg);
    //res.status(200).send("This is the root users route");
    logger.info(`Delete request made: id = ${id}`);
});

  function validateItemMiddleware(req, res, next){
    // check if there is a valid name and price
    const jsonBody = req.body;

    if(validateItem(jsonBody)){
        next();
    }else{
        res.status(400).json({
            message: "Invalid Name or Price"
        });
    }
};

module.exports = router;