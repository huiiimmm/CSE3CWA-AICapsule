const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', require('./routes/auth'));
app.use('/api/capsules', require('./routes/capsules'));

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

module.exports = app;
