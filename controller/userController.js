const express = require("express");
const router = express.Router();
const userService = require('../service/userService');
const {logger} = require('../logger');

const uuid = require('uuid');

//router.use(express.json());


router.post("/login", async (req, res) =>{
    res.status(200).send("login endpoint reached!");
    logger.info(`POST request made: ${req.body}`)
});


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


router.get("/username/:username", async (req, res) => {
    const username = req.params.username;
    console.log(username);
    //console.log(userService.getUser(id));
    const response = await userService.getUserByUsername(username);
    res.status(200).json(response.user[0]);
    //res.status(200).send("This is the root users route");
    logger.info(`Get request made: username = ${username}`);
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

router.put("/", async (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    const msg = await userService.updateUser(jsonData);
    res.status(200).json(msg);
});


router.put("/managerstatus", async (req, res) =>{
    const jsonData = req.body;
    console.log(jsonData);
    const msg = await userService.updateManagerStatus(jsonData.UserId, jsonData.is_manager);
    res.status(200).json(msg);
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