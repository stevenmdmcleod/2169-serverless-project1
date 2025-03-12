const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: "us-east-2"});

const documentClient = DynamoDBDocumentClient.from(client);

// CRUD
// Create Read Update Delete

// Create

async function createUser(user){
    const command = new PutCommand({
        TableName: 'Users',
        Item: user
    });

    try{
        await documentClient.send(command);
        return user;
    }catch(err){
        console.error(err);
        return null;
    }
}

async function getUser(UserId){
    const command = new GetCommand({
        TableName: "Users",
        Key: {UserId}
    });

    try{
        const data = await documentClient.send(command);
        return data.Item;
    }catch(err){
        console.error(err);
        return null;
    }
}

async function deleteUser(UserId){
    const command = new DeleteCommand({
        TableName: "Users",
        Key: {UserId}
    });

    try{
        await documentClient.send(command);
        return UserId;
    }catch(err){
        console.error(err);
        return null;
    }
}


module.exports = {createUser, getUser, deleteUser};

// const getUser = new GetCommand({
//     TableName: "Users",
//     Key: { "user_id": "c2838efe-5c2a-4917-bfd3-af5dd38bcb05"}
// });

// promise
// documentClient.send(getUser)
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

// async / await

// async function fetchUser(){
//     try{
//         const data = await documentClient.send(getUser);
//         console.log(data);
//     }catch(err){
//         console.error(err);
//     }
// }

// fetchUser();