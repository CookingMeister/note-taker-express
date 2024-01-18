const fsp = require("fs").promises;
const dbFile = "./db/db.json";

// Read notes from db.json
const readNotes = async () => {
    try {
      const data = await fsp.readFile(dbFile, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error reading ${dbFile}`, err);
      throw err;
    }
  };
  
  // Write notes to db
  const writeNotes = async (notes) => {
    try {
      await fsp.writeFile(dbFile, JSON.stringify(notes, null, 2));
      console.log("Notes saved to file");
    } catch (err) {
      console.error(`Error writing ${dbFile}`, err);
      throw err;
    }
  };

  module.exports = {
    readNotes,
    writeNotes
  };