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

app.get('/sendEmail', (req, res) => {
  mailchimp.post({
    path: `/campaigns/${campaign_id}/actions/replicate`
  })
    .then( result => {
      const newCampaignID = result.id
      mailchimp.put({
        path: `/campaigns/${newCampaignID}/content`,
        body: {
          "html": `
            <h1> You've got mail! </h1>
            <p> From: ${req.params.name} </p>
            <p> Email: ${req.params.email} </p>
            <p> Message>: ${req.params.message} </p>
          `
        }
      })
        .then( result => {
          mailchimp.post({
            path: `/campaigns/${newCampaignID}/send`
          })
        })
    })
});

const port = process.env.PORT || 9001;
app.listen(port);

console.log(`express app listening on port ${port}`);