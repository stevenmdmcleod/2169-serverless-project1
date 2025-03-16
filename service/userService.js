const userDao = require("../repository/userDAO");
const bcrypt = require("bcrypt");
const uuid = require('uuid');


async function createUser(user){

    const rounds = 10;
    const password = await bcrypt.hash(user.password, rounds);

    if(validateUser(user) && !(await getUserByUsername(user.username)).user){
        const data = await userDao.createUser({
            username: user.username,
            password,
            UserId: uuid.v4(),
            is_employed: true,
            is_manager: false
        });
        return data;
    }else{
        return null;
    }
}


async function validateLogin(username, password){
    const user = await getUserByUsername(username);
    console.log(password, user.user)
    if(user && (await bcrypt.compare(password, user.user.password)) ){
        return user;
    }else{
        return null;
    }
}

function validateUser(user){
    const usernameResult = user.username.length > 0;
    const passwordResult = user.password.length > 0;
    return (usernameResult && passwordResult);
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

module.exports = {createUser, getUser, deleteUser, updateUser, updateManagerStatus, getUserByUsername, validateLogin}