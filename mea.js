const express = require('express');
const axios = require('axios');
const qs = require('qs');
const app = express();
const PORT = 35000;

// SSO Credentials and URLs
const CLIENT_ID = 'TUVBIENvbm5leHQ';
const CLIENT_SECRET = 'jWrCUnXbAvWB9K5yVK2Y4HTSyVVnWs5hMoSq';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_URL = 'https://logindev.mea.or.th/oauth2/authorize';
const TOKEN_URL = 'https://logindev.mea.or.th/oauth2/token';
const JOTFORM_URL = 'https://form.jotform.com/243514830789465';

// Step 1: Redirect to SSO Login
app.get('/login', (req, res) => {
  const ssoUrl = `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(ssoUrl);
});

// Step 2: Handle SSO Callback
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code is missing.');
  }

  // Exchange the authorization code for an access token
  const tokenData = qs.stringify({
    grant_type: 'authorization_code',
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
  });

  try {
    const tokenResponse = await axios.post(TOKEN_URL, tokenData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = tokenResponse.data;

    // Redirect to the Jotform with user authentication completed
    res.redirect(JOTFORM_URL); // You can customize this further if needed
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('Failed to authenticate.');
  }
});

// Step 3: Start the server
app.listen(PORT, () => {
  console.log(`Gateway running at http://localhost:${PORT}`);
});