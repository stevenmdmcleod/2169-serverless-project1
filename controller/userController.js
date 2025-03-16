const express = require("express");
const router = express.Router();
const userService = require('../service/userService');
const logger = require("../util/logger");
const jwt = require("jsonwebtoken");
//const bcrypt = require("bcrypt");


require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

//router.use(express.json());


router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const data = await userService.validateLogin(username, password);
    
    
    if(data){
        // req.session.username = username;
        
        user = data.user;
        console.log(user.is_manager);
        console.log(user.UserId);
        console.log(user.username);
        const token = jwt.sign(
            {
                id: user.UserId,
                username: username,
                is_manager: user.is_manager
            },
                SECRET_KEY,
            {
                expiresIn: "15m"
        })
        res.status(200).json({message: "You have logged in!", token});
    }else{
        res.status(401).json({message: "Invalid login"});
    }
})


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
    res.status(200).json(response);
    //res.status(200).send("This is the root users route");
    logger.info(`Get request made: username = ${username}`);
});

router.post("/", async (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    const user = await userService.createUser({"username": jsonData.username, "password": jsonData.password});
    if(user){
        console.log(user);
        logger.info(`user: ${user} was created`);
        res.status(201).json({Message: "User successfully created!", user: user});
    }
    else{
        res.status(400).json({Message: 
            "User not created, please ensure your username is unique and that you have a valid password"});
    }
    
    
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