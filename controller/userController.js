const express = require("express");
const router = express.Router();
const userService = require('../service/userService');
const logger = require("../util/logger");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../util/jwt");
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;


//route for logging in
router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    console.log(username, password);
    if(!username || !password){
        return res.status(400).json({message: "bad request, please try again"})
    }
    const data = await userService.validateLogin(username, password);
    console.log(data);
    if(data){
        
        const token = jwt.sign(
            {
                id: data.UserId,
                username: username,
                is_manager: data.is_manager
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


//root user route
router.get("/", authenticateToken, (req, res) => {
    res.status(200).send("This is the root users route");
    logger.info(`Get request made: ${req.body}`);
});


//route for getting users by UserId
router.get("/:userId", authenticateToken, async (req, res) => {
    const id = req.params.userId;
    console.log(id);
    
    const user = await userService.getUser(id);
    res.status(200).json(user);
    
    logger.info(`Get request made: id = ${id}`);
});


//route for getting user by username
router.get("/username/:username", authenticateToken, async (req, res) => {
    const username = req.params.username;
    console.log(username);
    
    const response = await userService.getUserByUsername(username);
    if(!response){
        return res.status(400).json({"message": "Invalid request"})
    }
    res.status(200).json(userService.omit(response.user, 'password'));
    
    logger.info(`Get request made: username = ${username}`);
});


//route for creating a user
router.post("/", async (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    const user = await userService.createUser({"username": jsonData.username, "password": jsonData.password});
    if(user){
        console.log(user);
        logger.info(`user: ${user} was created`);
        res.status(201).json({Message: "User successfully created!", user: userService.omit(user, 'password')});
    }
    else{
        res.status(400).json({Message: 
            "User not created, please ensure your username is unique and that you have a valid password"});
    }
      
});


//route for updating user email and name
router.put("/", authenticateToken, async (req, res) => {
    console.log(req.user.is_manager,req.user.username,req.body.username);
    if(!req.user.is_manager && !(req.user.username == req.body.username)){
        return res.status(403).json({"message": "Invalid permissions to update this account."})
    }
    const jsonData = req.body;
    
    console.log(jsonData);
    const msg = await userService.updateUser(jsonData);
    if(!msg){
        return res.status(401).json({"message": "Bad Request, please try again"})
    }
    res.status(200).json(msg);
});


//route for updating manager status of users
router.put("/managerstatus",authenticateToken, async (req, res) =>{
    console.log(req.user.is_manager);
    if(!req.user.is_manager){
        return res.status(403).json({message: "Forbidden access"});
    }
    const jsonData = req.body;
    console.log(jsonData);
    const msg = await userService.updateManagerStatus(jsonData.UserId, jsonData.is_manager);
    if(!msg){
        return res.status(400).json({"message": "Bad request, please include is_manager(boolean)"})
    }
    res.status(200).json(msg);
});



//route for deleting users
router.delete("/:userId", authenticateToken, async (req, res) => {
    if(!req.user.is_manager){
        return res.status(403).json({message: "You do not have access to this route!"});
    }
    const id = req.params.userId;
    console.log(id);
    
    const msg = await userService.deleteUser(id);
    res.status(200).json(msg);
    logger.info(`Delete request made: id = ${id}`);
});


module.exports = router;