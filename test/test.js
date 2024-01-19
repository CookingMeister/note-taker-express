const { getNotes, getIndex } = require("../routes/routes.js");
// test notes.html route
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
});
// test index,html route
describe("getIndex", () => {
  test("responds with index.html", async () => {
    const req = {};
    const res = {
      sendFile: jest.fn(),
    };

    await getIndex(req, res);

    expect(res.sendFile).toHaveBeenCalledWith(
      expect.stringContaining("index.html")
    );
  });
});