const express = require('express');
const router = express.Router();
const db = require('../db');
const requireAuth = require('../middleware/auth');

router.use(requireAuth); // applies to all routes below in this file

router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM capsules WHERE user_id = ?').all(req.user.user_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch capsules' });
  }
});

router.post('/', (req, res) => {
  const {
    project_name, prompt_title, prompt_version, prompt_text,
    response_summary, category, usefulness, reviewed, improved,
    screenshot_url, notes
  } = req.body;

  if (!project_name || !prompt_title || !prompt_text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const insert = db.prepare(`
      INSERT INTO capsules
        (user_id, project_name, prompt_title, prompt_version, prompt_text,
         response_summary, category, usefulness, reviewed, improved, screenshot_url, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      req.user.user_id, // owner comes from the verified JWT, never req.body
      project_name, prompt_title, prompt_version, prompt_text,
      response_summary, category, usefulness,
      reviewed ? 1 : 0, improved ? 1 : 0,
      screenshot_url, notes
    );

    const created = db.prepare('SELECT * FROM capsules WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create capsule' });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    project_name, prompt_title, prompt_version, prompt_text,
    response_summary, category, usefulness, reviewed, improved,
    screenshot_url, notes
  } = req.body;

  try {
    const result = db.prepare(`
      UPDATE capsules SET
        project_name = ?, prompt_title = ?, prompt_version = ?, prompt_text = ?,
        response_summary = ?, category = ?, usefulness = ?,
        reviewed = ?, improved = ?, screenshot_url = ?, notes = ?
      WHERE id = ? AND user_id = ?
    `).run(
      project_name, prompt_title, prompt_version, prompt_text,
      response_summary, category, usefulness,
      reviewed ? 1 : 0, improved ? 1 : 0,
      screenshot_url, notes,
      id, req.user.user_id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Capsule not found' });
    }

    const updated = db.prepare('SELECT * FROM capsules WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update capsule' });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const result = db
      .prepare('DELETE FROM capsules WHERE id = ? AND user_id = ?')
      .run(id, req.user.user_id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Capsule not found' });
    }

    res.json({ deleted: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete capsule' });
  }
});

module.exports = router;
