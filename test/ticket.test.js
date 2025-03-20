const ticketService = require("../service/ticketService");
const dao = require("../repository/ticketDAO");
const uuid = require("uuid");

jest.mock("../repository/ticketDAO");
jest.mock("uuid");

describe("ticketService tests", () => {

  const mockTicket = {
    amount: 100,
    description: "Test ticket description"
  };

  const userId = "895516b5-c50a-45db-9197-9c899ab7179b"; // Example User ID

  const expectedTicket = {
    ...mockTicket,
    ticketId: "ada53be4-5e0a-4f37-8378-eb330c73a7c0", // Mock UUID
    userId,
    status: "Pending"
  };

  beforeEach(() => {
    // Mocking uuid.v4 to return a consistent UUID for each call
    uuid.v4.mockImplementation(() => "ada53be4-5e0a-4f37-8378-eb330c73a7c0");


    // Mocking dao.createTicket to return the expected ticket data
    dao.createTicket.mockResolvedValue(expectedTicket);
  });



  test("createTicket should create a ticket and return the ticket object", async () => {
    dao.createTicket.mockResolvedValueOnce(expectedTicket);

    const result = await ticketService.createTicket(mockTicket, userId);

    expect(dao.createTicket).toHaveBeenCalledWith(expectedTicket);

    // Ensure that the result returned is the expected ticket
    expect(result).toEqual(expectedTicket);
  });

  test("createTicket should return null if ticket is not valid", async () => {
    dao.createTicket.mockResolvedValueOnce(null);

    const result = await ticketService.createTicket(mockTicket, userId);

    // Ensure that the result is null if the ticket is invalid
    expect(result).toBeNull();
  });



  test("getPendingTickets successful test", async () => {
    dao.getPendingTickets.mockResolvedValueOnce([expectedTicket]);

    const result = await ticketService.getPendingTickets();

    expect(dao.getPendingTickets).toHaveBeenCalled();

    // Ensure that the result returned is the expected ticket
    expect(result).toEqual({message: "Found tickets!", tickets: [expectedTicket]});
  });

  test("getPendingTickets unsuccessful test", async () => {
    dao.getPendingTickets.mockResolvedValueOnce(null);

    const result = await ticketService.getPendingTickets();

    expect(dao.getPendingTickets).toHaveBeenCalled();

    // Ensure that the result returned is the expected ticket
    expect(result).toEqual({message: "Failed to get tickets"});
  });



  test("getTicketsByUserId successful test", async () => {
    dao.getTicketsByUserId.mockResolvedValueOnce([expectedTicket]);

    const result = await ticketService.getTicketsByUserId(expectedTicket.userId);

    expect(dao.getTicketsByUserId).toHaveBeenCalledWith(expectedTicket.userId);

    // Ensure that the result returned is the expected ticket
    expect(result).toEqual({message: "Tickets found!", tickets: [expectedTicket]});
  });

  test("getTicketsByUserId unsuccessful test", async () => {
    dao.getTicketsByUserId.mockResolvedValueOnce(null);

    const result = await ticketService.getTicketsByUserId(expectedTicket.userId);

    expect(dao.getTicketsByUserId).toHaveBeenCalledWith(expectedTicket.userId);

    // Ensure that the result returned is the expected ticket
    expect(result).toEqual({message: "unable to get tickets"});
  });



  test('should return "ticket does not exist!" if the ticket does not exist', async () => {
    dao.getTicket.mockResolvedValueOnce(null);  // Simulating non-existing ticket

    const result = await ticketService.updateTicket(expectedTicket);
    expect(result).toEqual({ message: 'ticket does not exist!' });
  });

  test('should return "Can not update tickets who have already been processed!" if the ticket status is not "Pending"', async () => {
    const processedTicket = { ...expectedTicket, status: 'Approved' };
    dao.getTicket.mockResolvedValueOnce(processedTicket);  // Simulating a ticket that's not in "Pending" status

    const result = await ticketService.updateTicket(expectedTicket);
    expect(result).toEqual({ message: 'Can not update tickets who have already been processed!' });
  });

  test('should return "unable to update tickets" if the ticket update fails', async () => {
    dao.getTicket.mockResolvedValue({...expectedTicket});  // Simulating the ticket exists
    dao.updateTicket.mockResolvedValue(null);  // Simulating failed update

    const result = await ticketService.updateTicket(expectedTicket);
    expect(result).toEqual({ message: 'unable to update tickets' });
  });

  test('should return success message and updated ticket if the ticket update is successful', async () => {
    dao.getTicket.mockResolvedValue(expectedTicket);  // Simulating the ticket exists
    dao.updateTicket.mockResolvedValue({...expectedTicket, password: "Approved" });  // Simulating successful update

    const result = await ticketService.updateTicket(expectedTicket);
    expect(result).toEqual({ message: 'Updated ticket successfully!', result: {...expectedTicket, password: "Approved"} });
  });





    test('should return false if the ticket is missing amount', () => {
    const invalidTicket = {
      description: 'Test ticket description'
    };

    const result = ticketService.validateTicket(invalidTicket);
    expect(result).toBe(false);
    });

    test('should return false if the ticket is missing description', () => {
    const invalidTicket = {
      amount: 100
    };

    const result = ticketService.validateTicket(invalidTicket);
    expect(result).toBe(false);
    });

    test('should return false if the ticket is missing both amount and description', () => {
    const invalidTicket = {};

    const result = ticketService.validateTicket(invalidTicket);
    expect(result).toBe(false);
    });

    test('should return true if the ticket has both amount and description', () => {
    const validTicket = {
      amount: 100,
      description: 'Test ticket description'
    };

    const result = ticketService.validateTicket(validTicket);
    expect(result).toBe(true);
  });

});