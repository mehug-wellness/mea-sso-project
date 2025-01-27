const express = require('express');
const axios = require('axios');
const qs = require('qs');
const app = express();

const PORT = process.env.PORT || 35000;

// SSO Configuration
const CLIENT_ID = 'YjQXsBGqmNcPl0RqnNNVf2L0wblQa79u'; // already replace with actual Client ID
const CLIENT_SECRET = '5BLpDIAkttwNCy4KubzJp1h8QYMdtvOnFM1FG08ACK8qa1KdvSVWJqiRO9fQPIH7'; // already replace with actual Client Secret
const REDIRECT_URI = 'http://localhost:3000/callback'; // Replace with your registered Redirect URI
const AUTH_URL = 'https://login.mea.or.th/oauth2/authorize'; // Production
const TOKEN_URL = 'https://login.mea.or.th/oauth2/token'; // Production
const PROFILE_URL = 'https://login.mea.or.th/profile'; // Production
const JOTFORM_URL = 'https://www.jotform.com/form/243514830789465'; // Jotform URL

// Step 1: Redirect User to SSO Login
app.get('/login', (req, res) => {
  const ssoUrl = `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(ssoUrl);
});

// Step 2: Handle SSO Callback and Fetch Access Token
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code is missing.');
  }

  // Exchange authorization code for access token
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

    // Fetch user profile using the access token
    const profileResponse = await axios.get(PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log('User Profile:', profileResponse.data); // Log user profile for debugging

    // Redirect to Jotform
    res.redirect(JOTFORM_URL);
  } catch (error) {
    console.error('Error during callback process:', error.response?.data || error.message);
    res.status(500).send('An error occurred while processing the request.');
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
