const ticketService = require("../service/ticketService");
const dao = require("../repository/ticketDAO");
const uuid = require("uuid")
jest.mock("../repository/ticketDAO");
jest.mock('uuid');

test('filler', () =>{

    expect(2+2).toBe(4);
});