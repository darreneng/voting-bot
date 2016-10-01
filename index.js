'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Server frontpage
app.get('/', (req, res) => {
    res.send('This is TestBot Server')
})

// Facebook webhook
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === 'poop') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Invalid verify token')
  }
})

app.listen((process.env.PORT || 3000))
