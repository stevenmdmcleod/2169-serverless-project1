const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const jwt = require("jsonwebtoken");
const ticketService = require('../service/ticketService');

router.get("/", (req, res) => {
    res.status(200).send("This is the root tickets route");
    logger.info(`Get request made: ${req.body}`);
});

module.exports = router;