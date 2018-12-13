import firebase from 'firebase/app'
import 'firebase/database'

const config = require('../config/config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase
export const db = firebase.database()
