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
  textMessage(id, text) {
    callSendAPI({
      recipient: { id },
      message: { text }
    })
  },

  buttonMessage(id) {
    callSendAPI({
      recipient: { id },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'What would you like to do?',
            buttons: [
              {
                type: 'postback',
                title: 'Make a new poll',
                payload: 'make-new-poll'
              },
              {
                type: 'postback',
                title: 'Vote in a poll',
                payload: 'vote-in-poll'
              }
            ]
          }
        }
      }
    })
  }
} // end module.exports
