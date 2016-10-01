'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const VALIDATION_TOKEN = process.env.MESSENGER_VALIDATION_TOKEN
const PAGE_ACCESS_TOKEN = process.env.MESSENGER_PAGE_ACCESS_TOKEN

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
          receivedMessage(messagingEvent)
        } else if (messagingEvent.delivery) {
          // TODO handle delivery
        } else if (messagingEvent.postback) {
          // TODO handle postback
        } else if (messagingEvent.read) {
          // TODO handle read
        } else if (messagingEvent.account_linking) {
          // TODO handle account linking
        } else {
          console.log('Webhook received unknown messagingEvent: ', messagingEvent)
        }
      })
    })

    res.sendStatus(200)
  }
})

function receivedMessage(event) {
  const senderID = event.sender.id
  const recipientID = event.recipient.id
  const timeOfMessage = event.timestamp
  const message = event.message

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage)
  console.log(JSON.stringify(message))

  const messageID = message.mid

  const messageText = message.text
  const messageAttachments = message.attachments

  if (messageText) {
    // echo back message
    sendTextMesssage(senderID, messageText)
  } else if (messageAttachments) {
    // notify user that attachment was received
    sendTextMesssage(senderID, 'Message with attachment received')
  }
}

function sendTextMesssage(recipientID, messageText) {
  callSendAPI({
    recipient: {
      id: recipientID
    },
    message: {
      text: messageText
    }
  })
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const recipientID = body.recipient_id
      const messageID = body.message_id

      console.log("Successfully sent message with id %s to recipient %s",
          messageId, recipientId)
    } else {
      console.error('Unable to send message.')
      console.error(resposne)
      console.error(error)
    }
  })
}

app.listen(app.get('port'), () => {
  console.log('App is running on port')
})
