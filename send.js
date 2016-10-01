/* Contains functions for sending messages */

'use strict';

const request = require('request')
const PAGE_ACCESS_TOKEN = process.env.MESSENGER_PAGE_ACCESS_TOKEN

// Calls Facebook send API. Helper for all message functions below
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
          messageID, recipientID)
    } else {
      console.error('Unable to send message.')
      console.error(resposne)
      console.error(error)
    }
  })
}

module.exports = {
  textMessage(recipientID, messageText) {
    callSendAPI({
      recipient: {
        id: recipientID
      },
      message: {
        text: messageText
      }
    })
  }
}
