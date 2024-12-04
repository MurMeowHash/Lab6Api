const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const express = require("express");
var cors = require("cors");

(async () => {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
  await db.exec(
    `CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, image_link TEXT, description TEXT)`
  );

  const app = express();

  app.use(cors());
  app.use(express.json());

  const port = 3000;

  app.get("/", (req, res) => {
    res.send("I'm working :)");
  });

  app.post("/images", async (req, res) => {
    const { image_link, description } = req.body;
    const result = await db.run(
      `INSERT INTO images (image_link, description) VALUES (?, ?)`,
      [image_link, description]
    );
    res.status(201).json({ id: result.lastID });
  });

  app.get("/images", async (req, res) => {
    const images = await db.all(`SELECT * FROM images`);
    res.json(images);
  });

  app.delete("/flush-all", async (req, res) => {
    await db.run(`DELETE FROM images`);
    res.send("All images deleted");
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();
