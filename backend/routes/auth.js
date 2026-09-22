const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

router.get('/login', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL, // e.g. http://localhost:3000/auth/github/callback
    scope: 'read:user'
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

  try {
    // Step 1: exchange the code for a GitHub access token
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const githubAccessToken = tokenRes.data.access_token;
    if (!githubAccessToken) return res.status(401).send('OAuth failed');

    // Step 2: use that token to fetch the GitHub user's profile
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${githubAccessToken}` },
    });

    const githubUser = userRes.data; // includes id, login, avatar_url, etc.

    // Step 3: issue YOUR OWN application JWT — this is the one the assignment grades
    const appToken = jwt.sign(
      { user_id: String(githubUser.id), username: githubUser.login },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Step 4: set it as a Secure, HttpOnly cookie named `token`
    res.cookie('token', appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in prod (HTTPS), false for local http dev
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000,
    });

    // Step 5: send them into the app
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error('OAuth callback error:', err.message);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
