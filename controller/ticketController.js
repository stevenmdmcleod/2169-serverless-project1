const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const jwt = require("jsonwebtoken");
const ticketService = require('../service/ticketService');
const { authenticateToken } = require("../util/jwt");

router.get("/", authenticateToken, async (req, res) => {
    return res.status(200).send("This is the root tickets route");
    //logger.info(`Get request made: ${req.body}`);
});


router.post("/", authenticateToken, async(req, res) => {
    if(req.user.is_manager){
        return res.status(403).json({message: "You do not have access to this route! Managers can not post tickets."});
    }
    id = req.user.id;
    ticket = req.body;
    console.log(id, ticket);
    if(!id || !ticket){
        return res.status(400).json({message: "Invalid request"})
    }
    result = await ticketService.createTicket(ticket, id);
    if(!result){
        return res.status(400).json({message: "Invalid request, please try again"})
    }
    return res.status(200).json(result);
    //return res.status(200).send("post tickets route");
});


router.put("/", authenticateToken, async (req, res) =>{
    if(!req.user.is_manager){
        return res.status(403).json({message: "You do not have access to this route!"});
    }
    jsonData = req.body;
    result = await ticketService.updateTicket(jsonData);
    if(!result){
        return res.status(400).json({message: "Unable to update ticket: Bad Request"})
    }
    return res.status(200).json(result);

});


router.get("/usertickets", authenticateToken, async (req, res) => {
    if(req.user.is_manager){
        return res.status(403).json({message: "You do not have access to this route!"});
    }
    id = req.user.id;
    if(!id){
        return res.status(400).json({message: "invalid request made! Please ensure the data is correct"})
    }
    const tickets = await ticketService.getTicketsByUserId(id);
    if(!tickets){
        return res.status(400).json({message: "unable to get tickets"});
    }
    return res.status(200).json(tickets);


});


router.get("/tickets", authenticateToken, async(req, res) => {
    if(!req.user.is_manager){
        return res.status(403).json({message: "You do not have access to this route!"});
    }

    const tickets = await ticketService.getPendingTickets();
    if(!tickets){
        return res.status(400).json({message: "Bad Request, please try again"});
    }
    return res.status(200).json(tickets);

});


module.exports = router;