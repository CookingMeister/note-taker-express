const fsp = require("fs").promises;
const { getNotes, getIndex } = require("../routes/routes.js");
const { readNotes } = require("../utils/read-write.js");

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
// test read db.json file
describe("readNotes", () => {
  test("reads notes from db.json", async () => {
    const mockNotes = [
      {
        id: "1",
        title: "Some title here",
        text: "Some text here"
      }
    ];

    jest.spyOn(fsp, "readFile").mockResolvedValueOnce(
      JSON.stringify(mockNotes)
    );

    const notes = await readNotes();

    expect(notes).toEqual(mockNotes);
  });
});