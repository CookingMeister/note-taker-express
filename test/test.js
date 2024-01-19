let app;

beforeAll(() => {
  app = require("../app");
});

afterAll(() => {
  app.close();
});

const { getNotes } = require("../app.js");
const path = require("path");

describe("getNotes", () => {
  test("responds with notes.html", async () => {
    const req = {};
    const res = {
      sendFile: jest.fn(),
    };

    await getNotes(req, res);

    expect(res.sendFile).toHaveBeenCalledWith(
      expect.stringContaining("notes.html")
    );
  });

  test("sends 404 if path does not exist", async () => {
    const req = {};
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    jest.spyOn(path, "join").mockReturnValueOnce("invalid-path");

    await getNotes(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("File not found");
  });
});