/* Entry point for Votingbot */

'use strict';

// npm dependencies
const express = require('express')
const bodyParser = require('body-parser')

// other dependencies
const received = require('./received')

const app = express()

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const VALIDATION_TOKEN = process.env.MESSENGER_VALIDATION_TOKEN

// Server frontpage
app.get('/', (req, res) => {
    res.send('This is TestBot Server')
})

// Facebook webhook
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log('Validating webhook')
    res.status(200).send(req.query['hub.challenge'])
  } else {
    console.error("Failed validation. Make sure the validation tokens match.")
    res.status(403).send('Invalid verify token')
  }
})

app.post('/webhook', (req, res) => {
  const data = req.body

  if (data.object === 'page') {
    data.entry.forEach((pageEntry) => {
      const pageID = pageEntry.id
      const timeOfEvent = pageEntry.time
      pageEntry.messaging.forEach((messagingEvent) => {
        if (messagingEvent.optin) {
          // TODO handle optin
        } else if (messagingEvent.message) {
          received.message(messagingEvent)
        } else if (messagingEvent.delivery) {
          // TODO handle delivery
        } else if (messagingEvent.postback) {
          received.postback(messagingEvent)
        } else if (messagingEvent.read) {
          // TODO handle read
        } else {
          console.log('Webhook received unknown messagingEvent: ',
              messagingEvent)
        }
      })
    })

    res.sendStatus(200)
  }
})

app.listen(app.get('port'), () => {
  console.log('App is running on port', app.get('port'))
})
