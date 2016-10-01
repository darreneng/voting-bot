'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN

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

app.listen((process.env.PORT || 3000))
