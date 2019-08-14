const config = require('./config')

var firebase = require('firebase')
firebase.initializeApp(config.firebaseConfig)

module.exports = firebase