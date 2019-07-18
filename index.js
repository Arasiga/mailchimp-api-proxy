const express = require('express');
const Mailchimp = require('mailchimp-api-v3');
require('dotenv').config();

const api_key = process.env.MAILCHIMP_API_KEY;
const campaign_id = process.env.CAMPAIGN_ID; 

const app = express();
const mailchimp = new Mailchimp(api_key);

// Route
// Note -> This will do:
// 1. Replicate the existing campaign (id given in .env)
// 2. Update the content with a NAME, EMAIL, and MESSAGE given in the call
// 3. Fire off the campaign

app.get('/test', (req, res) => {
  mailchimp.get({
    path: `/campaigns/${campaign_id}/content`
  })
    .then( result => res.send(result))
});

const port = process.env.PORT || 9001;
app.listen(port);

console.log(`express app listening on port ${port}`);