const express = require('express');
const Mailchimp = require('mailchimp-api-v3');
const bodyParser = require('body-parser')
const cors = require('cors');
require('dotenv').config();

const api_key = process.env.MAILCHIMP_API_KEY;
const campaign_id = process.env.CAMPAIGN_ID; 

const app = express();
app.use(cors());
const mailchimp = new Mailchimp(api_key);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())

// Route
// Note -> This will do:
// 1. Replicate the existing campaign (id given in .env)
// 2. Update the content with a NAME, EMAIL, and MESSAGE given in the call
// 3. Fire off the campaign
app.post('/sendEmail', (req, res) => {
  let newCampaignID = ""
  mailchimp.post({
    path: `/campaigns/${campaign_id}/actions/replicate`
  })
    .then( result => {
      newCampaignID = result.id
      mailchimp.put({
        path: `/campaigns/${newCampaignID}/content`,
        body: {
          "html": `
            <h1> You've got mail! </h1>
            <p> From: ${req.body.name} </p>
            <p> Email: ${req.body.email} </p>
            <p> Message: ${req.body.message} </p>
          `
        }
      })
      .catch( error => {
        res.send(error)
      })
        .then( result => {
          mailchimp.post({
            path: `/campaigns/${newCampaignID}/actions/send`
          })
        })
        .catch( error => {
          res.send(error)
        })
          .then( result => {
            res.send("Success! " + result)
          })
          .catch( error => {
            res.send(error)
          })
    })
});

const port = process.env.PORT || 9001;
app.listen(port);

console.log(`express app listening on port ${port}`);