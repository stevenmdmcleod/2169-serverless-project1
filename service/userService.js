const userDao = require("../repository/userDAO");

async function createUser(UserId, email, is_employed){
    const result = await userDao.createUser({UserId, email, is_employed});

    if(!result){
        return {message: "Failed to create user"};
    }else{
        return {message: "Created user", user: result}
    }
}

async function getUser(UserId){
    const result = await userDao.getUser(UserId);

    if(!result){
        return {message: "Failed to get user", UserId};
    }else{
        return {message: "Found user!", user: result}
    }
}

async function deleteUser(UserId){
    const result = await userDao.deleteUser(UserId);

    if(!result){
        return {message: "Failed to delete user", UserId};
    }else{
        return {message: "Deleted user", UserId}
    }
}

module.exports = {createUser, getUser, deleteUser}