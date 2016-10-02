/* functions for handling receiving Facebook messenger events */

'use strict';

const send = require('./send')

module.exports = {
  message(event, store) {
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
  postback(event, store) {
    const senderID = event.sender.id
    const recipientID = event.recipient.id
    const timeOfPostback = event.timestamp

    const payload = event.postback.payload

    console.log("Received postback for user %d and page %d with" +
        "payload '%s' at %d", senderID, recipientID, payload, timeOfPostback);

    switch (payload) {
      case 'make-new-poll':
        // Generate 5 digit code
        const pollCode = Math.floor(Math.random() * 90000) + 10000
        store[senderID.toString()] = pollCode
        send.textMessage(senderID, 'Your poll code is: ' + pollCode)
        break
      case 'vote-in-poll':
        // TODO prompt user for poll code
        break
      default:
        console.log('No action defined for postback payload "' + payload + '"')
    }

  }
}
