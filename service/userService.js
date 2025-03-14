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

async function getUserByUsername(username){
    const result = await userDao.getUserByUsername(username);

    if(!result){
        return {message: "Failed to get user", result};
    }else{
        return {message: "Found user!", user: result.Items}
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

async function updateUser(user){
    const result = await userDao.updateUser(user);

    if(!result){
        return {message: "Failed to update user", user};
    }else{
        return {message: "Updated user", user}
    }
}

async function updateManagerStatus(UserId, isManager){
    const result = await userDao.updateManagerStatus(UserId, isManager);

    if(!result){
        return {message: "Failed to update manager status for userId: ", UserId};
    }else{
        return {message: "Updated manager status successfully! ", UserId}
    }
}

module.exports = {createUser, getUser, deleteUser, updateUser, updateManagerStatus, getUserByUsername}