const userDao = require("../repository/userDAO");
const bcrypt = require("bcrypt");
const uuid = require('uuid');


async function createUser(user){

    if(!user.username || !user.password){
        return null;
    }
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
    if(!username || !password){
        return null;
    }
    const user = await getUserByUsername(username);
    if(!user.user){
        return null;
    }
    //console.log(user);
    //console.log(password, user.user)
    if(user && (await bcrypt.compare(password, user.user.password)) ){
        return omit(user.user, 'password');
    }
    else{
        return null;
    }
}

function validateUser(user){
    //helper function for createUser
    const usernameResult = user.username.length > 0;
    const passwordResult = user.password.length > 0;
    return (usernameResult && passwordResult);
}


async function getUser(UserId){
    if(!UserId){
        return null;
    }
    const result = await userDao.getUser(UserId);

    if(!result){
        return {message: "Failed to get user", UserId};
    }else{
        return {message: "Found user!", user: omit(result, 'password')}
    }
}

async function getUserByUsername(username){
    if(!username){
        return null;
    }
    const result = await userDao.getUserByUsername(username);
    //console.log(result);
    if(!result){
        return {message: "Failed to get user", result};
    }else{
        return {message: "Found user!", user: result}
    }
}

async function deleteUser(UserId){
    if(!UserId){
        return null;
    }
    user = await getUser(UserId);
    
    if(!user.user){
        return {message: "user does not exist"};
    }
    const result = await userDao.deleteUser(UserId);

    if(!result){
        return {message: "Failed to delete user", UserId};
    }else{
        return {message: "Deleted user", UserId}
    }
}

async function updateUser(user){
    if(!user){
        return null;
    }
    const result = await userDao.updateUser(user);

    if(!result){
        return {message: "Failed to update user", user: omit(user, 'password')};
    }else{
        return {message: "Updated user", user: omit(user, 'password')}
    }
}

async function updateManagerStatus(UserId, isManager){
    if(!UserId || !isManager){
        return null;
    }
    const result = await userDao.updateManagerStatus(UserId, isManager);

    if(!result){
        return {message: "Failed to update manager status for userId: ", UserId};
    }else{
        return {message: "Updated manager status successfully! ", UserId}
    }
}

function omit(obj, keyToOmit) {
    const { [keyToOmit]: omitted, ...rest } = obj;
    return rest;
  }

module.exports = {createUser, getUser, deleteUser, updateUser, updateManagerStatus, getUserByUsername, validateLogin, omit, validateUser}