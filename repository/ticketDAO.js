const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient,GetCommand, PutCommand, UpdateCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: "us-east-2"});

const documentClient = DynamoDBDocumentClient.from(client);


async function createTicket(ticket){
    const command = new PutCommand({
        TableName: 'Tickets',
        Item: ticket
    });

    try{
        await documentClient.send(command);
        return ticket;
    }catch(err){
        console.error(err);
        return null;
    }
}



async function getTicket(ticketId){
    const command = new GetCommand({
        TableName: "Tickets",
        Key: {ticketId}
    });

    try{
        const data = await documentClient.send(command);
        return data.Item;
    }catch(err){
        console.error(err);
        return null;
    }
}


async function getPendingTickets(){
    const params = {
        TableName: "Tickets",
        FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ':status': "Pending"
      },
    };
        try {
            const data = await client.send(new ScanCommand(params));
            
            return data.Items;
          } 
          catch (err) {
            console.log("Error", err);
          }    
}


async function getTicketsByUserId(userId){
    const params = {
            TableName: "Tickets",
            FilterExpression: '#userId = :userId',
          ExpressionAttributeNames: {
            "#userId": "userId"
          },
          ExpressionAttributeValues: {
            ':userId': userId
          },
        };
            try {
                const data = await client.send(new ScanCommand(params));
                
                return data.Items;
              } 
              catch (err) {
                console.log("Error", err);
              }     
}



async function updateTicket(ticket){
    
    const command = new UpdateCommand({
        TableName: "Tickets",
        Key: {ticketId : ticket.ticketId},
        
        UpdateExpression : "SET #status = :status",
        ExpressionAttributeNames: {
            '#status' : 'status'
        },
        ExpressionAttributeValues: {':status' : ticket.status       
        }
    });

    try {
        await documentClient.send(command);
        return ticket;
        
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {updateTicket, createTicket, getPendingTickets, getTicketsByUserId, getTicket}