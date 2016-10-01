/* functions for handling receiving Facebook messenger events */

'use strict';

const send = require('./send')

function getCode() {
  return Math.floor(Math.random() * 90000) + 10000
}

module.exports = {
  message(event) {
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
      switch (messageText) {
        case 'button':
          // test button
          send.buttonMessage(senderID)
          break;
        default:
          // echo back message
          send.textMessage(senderID, messageText)
      }
    } else if (messageAttachments) {
      // notify user that attachment was received
      send.textMessage(senderID, 'Message with attachment received')
    }
  },
  postback(event) {
    const senderID = event.sender.id
    const recipientID = event.recipient.id
    const timeOfMessage = event.timestamp

    const payload = event.postback.payload

    switch (payload) {
      case 'make-new-poll':

        break
      case 'vote-in-poll':

        break
      default:

    }

  }
}
