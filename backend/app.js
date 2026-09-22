const express = require('express');

const db = require("./db");
const fs = require("fs");
const path = require('path');

const app = express();
const PORT = 3000;


app.use(express.json());
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
    res.send('<h1>AICapsule server running</h1>');
});

app.get('/capsules', (req, res) => {
  try {
    const capsules = db.prepare('SELECT * FROM capsules').all();
    res.json(capsules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/capsules/:id", async (req, res) => {
  const {id} = req.params;

  try {
    const stmt = db.prepare(
      "DELETE FROM capsules WHERE id = ?"
    );
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Capsule not found.",
      });
    }

    res.json({
      deleted: id,
    });

  } catch (error) {
    console.error("Failed to delete capsule:", error);
    res.status(500).json({
      error: "Failed to delete capsule.",
    });
  }
});

app.post("/add-capsule", (req, res) => {
  try {
    const {
      user_id,
      project_name,
      prompt_title,
      prompt_version,
      prompt_text,
      response_summary,
      category,
      usefulness,
      reviewed,
      improved,
      screenshot_url,
      notes
    } = req.body;

    const sqlQuery = `
      INSERT INTO capsules
      (user_id, project_name, prompt_title, prompt_version, prompt_text, response_summary, category, usefulness, reviewed, improved, screenshot_url, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const stmt = db.prepare(sqlQuery);

    const result = stmt.run(
      user_id,
      project_name,
      prompt_title,
      prompt_version,
      prompt_text,
      response_summary,
      category,
      usefulness,
      reviewed,
      improved,
      screenshot_url,
      notes
    );

    const insertedID = result.lastInsertRowid;

    const savedCapsule = db.prepare("SELECT * FROM capsules WHERE id = ?").get(insertedID);

    res.status(200).json({
      message: "Capsule saved successfully!", 
      record: savedCapsule,
    });
  } catch (error) {
    console.error("Database tracking failure:", error);

    res.status(500).json({
      error: "Failed to save data",
    });
  }
});

module.exports = app;
