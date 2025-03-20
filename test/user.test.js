const userService = require("../service/userService");
const dao = require("../repository/userDAO");
const bcrypt = require("bcrypt");
const uuid = require("uuid")
jest.mock("../repository/userDAO");
jest.mock('bcrypt');
jest.mock('uuid');



describe('user tests', () =>{

    const mockUser = {
        //email: "steven@gmail.com",
        //name: "steven",
        username: "steven1233",
        is_manager: false,
        is_employed: true,
        password: "test"
    };

    const expectedUser = {
        ...mockUser,
        UserId: '895516b5-c50a-45db-9197-9c899ab7179b', // mock UUID
        password: '$2b$10$alIlRwUgLl39afeY31wIYOuqKq4KklQdbPN6oeGH7jy1OzWHwZrlu' // mock hashed password
      };

      const expectedUserUpdated = {
        ...expectedUser,
        name: "Steven",
        email: "steven@gmail.com"
      }

    beforeEach(() => {

        // Mock bcrypt.hash to return a predefined hashed password
        bcrypt.hash.mockImplementation((password, saltRounds) =>
            Promise.resolve("$2b$10$alIlRwUgLl39afeY31wIYOuqKq4KklQdbPN6oeGH7jy1OzWHwZrlu")
        );

        // Mock uuid.v4 to return a predefined UUID
        uuid.v4.mockImplementation(() => "895516b5-c50a-45db-9197-9c899ab7179b");

        // Mock DAO's createUser method to return the created user
        dao.createUser.mockImplementation((user) => Promise.resolve(user));

        // Mock getUserByUsername to return null (indicating no existing user)
        dao.getUserByUsername.mockResolvedValue(null);

        bcrypt.compare.mockImplementation((password, hashedpassword) =>
            Promise.resolve(true));
        });
        
  


    test('testing create user: should return the created user object', async() =>{
        
      
        const result = await userService.createUser(mockUser);

        // Ensure uuid.v4 and bcrypt.hash are called
        expect(uuid.v4).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);

        // Ensure the DAO function was called with the expected user data
        expect(dao.createUser).toHaveBeenCalledWith(expectedUser);
        
        // Ensure the result matches the expected user
        expect(result).toEqual(expectedUser);
    });

   


    test("should return user without password if login is successful", async () => {
        dao.getUserByUsername.mockResolvedValueOnce(expectedUser);
        const result = await userService.validateLogin(mockUser.username, mockUser.password);
    
        // Ensure bcrypt.compare was called with the correct arguments
        expect(bcrypt.compare).toHaveBeenCalledWith(mockUser.password, expectedUser.password);
    
        // Ensure the result does not include the password field
        omitted = userService.omit(expectedUser, 'password');
        expect(result).toEqual(omitted);
      });
    
      test("should return null if password is incorrect", async () => {
        bcrypt.compare.mockImplementationOnce((password, hashedPassword) =>
          Promise.resolve(password !== "test" && hashedPassword === expectedUser.password)
        ); // Simulate a wrong password
    
        const result = await userService.validateLogin(mockUser.username, "wrongPassword");
    
        expect(result).toBeNull();
      });
    
      test("should return null if user does not exist", async () => {
        dao.getUserByUsername.mockResolvedValueOnce({ user: null }); // Simulate no user found
    
        const result = await userService.validateLogin(mockUser.username, mockUser.password);
    
        expect(result).toBeNull();
      });
    
      test("should return null if username or password is not provided", async () => {
        const resultWithNoUsername = await userService.validateLogin("", mockUser.password);
        const resultWithNoPassword = await userService.validateLogin(mockUser.username, "");
    
        expect(resultWithNoUsername).toBeNull();
        expect(resultWithNoPassword).toBeNull();
      });




      test("checking validatUser helper function successful", ()=> {
        bool = userService.validateUser({username: "test", password: "test"})
        expect(bool).toBe(true);
      });

      test("checking validatUser helper function fail username", ()=> {
        bool = userService.validateUser({username: "", password: "test"})
        expect(bool).toBe(false);
      });

      test("checking validatUser helper function fail password", ()=> {
        bool = userService.validateUser({username: "test", password: ""})
        expect(bool).toBe(false);
      });




      test("getUser successful test", async() =>{
        dao.getUser.mockResolvedValueOnce(expectedUser);
        result = await userService.getUser(expectedUser.UserId);

        expect(dao.getUser).toHaveBeenCalledWith(expectedUser.UserId);
        expect(result).toEqual({message: "Found user!", user: userService.omit(expectedUser, 'password')})
      });

      test("getUser unsuccessful test", async() =>{
        dao.getUser.mockResolvedValueOnce(null);
        result = await userService.getUser(expectedUser.UserId);

        expect(dao.getUser).toHaveBeenCalledWith(expectedUser.UserId);
        expect(result).toEqual({message: "Failed to get user", UserId: expectedUser.UserId})
      });



      test("getUserByUsername successful test", async() =>{
        dao.getUserByUsername.mockResolvedValueOnce(expectedUser);
        result = await userService.getUserByUsername(expectedUser.username);

        expect(dao.getUserByUsername).toHaveBeenCalledWith(expectedUser.username);
        expect(result).toEqual({message: "Found user!", user: expectedUser})
      });

      test("getUserByUsername unsuccessful test", async() =>{
        dao.getUserByUsername.mockResolvedValueOnce(null);
        result = await userService.getUserByUsername(expectedUser.username);

        expect(dao.getUserByUsername).toHaveBeenCalledWith(expectedUser.username);
        expect(result).toEqual({message: "Failed to get user", result: null})
      });

      test("deleteUser does not exist test", async() =>{

        dao.getUser.mockResolvedValueOnce(null);

        result = await userService.deleteUser(expectedUser.UserId);

        expect(dao.getUser).toHaveBeenCalledWith(expectedUser.UserId);

        expect(result).toStrictEqual({message: "user does not exist"});
      });

      test("deleteUser deleted successfully test", async() =>{

        dao.getUser.mockResolvedValueOnce(expectedUser);
        dao.deleteUser.mockResolvedValueOnce(expectedUser.UserId);

        result = await userService.deleteUser(expectedUser.UserId);

        
        expect(dao.getUser).toHaveBeenCalledWith(expectedUser.UserId);
        expect(dao.deleteUser).toHaveBeenCalledWith(expectedUser.UserId);

        expect(result).toEqual({message: "Deleted user", UserId: expectedUser.UserId});
      });

      test("deleteUser unsuccessfully test", async() =>{

        dao.getUser.mockResolvedValueOnce(expectedUser);
        dao.deleteUser.mockResolvedValueOnce(null);

        result = await userService.deleteUser(expectedUser.UserId);

        expect(dao.getUser).toHaveBeenCalledWith(expectedUser.UserId);
        expect(dao.deleteUser).toHaveBeenCalledWith(expectedUser.UserId);

        expect(result).toEqual({message: "Failed to delete user", UserId: expectedUser.UserId});
      });



      test("updateUser successful test", async() => {

        dao.updateUser.mockResolvedValueOnce(expectedUserUpdated);

        result = await userService.updateUser(expectedUserUpdated);

        expect(dao.updateUser).toHaveBeenCalledWith(expectedUserUpdated);
        expect(result).toEqual({message: "Updated user", user: userService.omit(expectedUserUpdated, 'password')});
      });

      test("updateUser unsuccessful test", async() => {

        dao.updateUser.mockResolvedValueOnce(null);

        result = await userService.updateUser(expectedUserUpdated);

        expect(dao.updateUser).toHaveBeenCalledWith(expectedUserUpdated);
        expect(result).toEqual({message: "Failed to update user", user: userService.omit(expectedUserUpdated, 'password')});
      });



      test("updateManagerStatus successful test", async() => {

        dao.updateManagerStatus.mockResolvedValueOnce(expectedUserUpdated.UserId);

        result = await userService.updateManagerStatus(expectedUserUpdated.UserId, true);

        expect(dao.updateManagerStatus).toHaveBeenCalledWith(expectedUserUpdated.UserId, true);
        expect(result).toEqual({message: "Updated manager status successfully! ", UserId: expectedUserUpdated.UserId});
      });

      test("updateManagerStatus unsuccessful test", async() => {

        dao.updateManagerStatus.mockResolvedValueOnce(null);

        result = await userService.updateManagerStatus(expectedUserUpdated.UserId, true);

        expect(dao.updateManagerStatus).toHaveBeenCalledWith(expectedUserUpdated.UserId, true);
        expect(result).toEqual({message: "Failed to update manager status for userId: ", UserId: expectedUserUpdated.UserId});
      });
});