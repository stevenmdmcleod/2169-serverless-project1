const ticketDao = require("../repository/ticketDAO");
const uuid = require('uuid');



async function createTicket(ticket, userId){
    
        if(validateTicket(ticket)){
            const data = await ticketDao.createTicket({
                userId: userId,
                description: ticket.description,
                ticketId: uuid.v4(),
                amount: ticket.amount,
                status: "Pending"   
            });
            return data;
        }
        else{
            return null;
        }
}


//used by managers to get pending tickets
async function getPendingTickets(){
    
        const result = await ticketDao.getPendingTickets();
    
        if(!result){
            return {message: "Failed to get tickets"};
        }else{
            return {message: "Found tickets!", tickets: result}
        }
}


async function getTicketsByUserId(userId){
    if(!userId){
        return null;
    }

    const result = await ticketDao.getTicketsByUserId(userId);
    if(!result){
        return {message: "unable to get tickets"};
    }
    else{
        return {message: "Tickets found!", tickets: result}
    }
}

//updates ticket status if ticket is in pending status
async function updateTicket(ticket){

    if(!ticket || !ticket.status || !ticket.ticketId){
        return null;
    }
    currticket = await ticketDao.getTicket(ticket.ticketId);
    if(!currticket){
        return {message: "ticket does not exist!"}
    }
    if(currticket.status != "Pending"){
        return {message: "Can not update tickets who have already been processed!"}
    }

    const result = await ticketDao.updateTicket(ticket);
    if(!result){
        return {message: "unable to update tickets"};
    }
    else{
        return {message: "Updated ticket successfully!", result}
    }
}


//helper function for validating tickets
function validateTicket(ticket){
    if(!ticket.amount || !ticket.description){
        return false;
    }
    return true
}

module.exports = {createTicket, getPendingTickets, getTicketsByUserId, updateTicket, validateTicket}