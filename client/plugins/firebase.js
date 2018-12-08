import firebase from 'firebase'

const config = require('../config/code-climbling-651cc-firebase-adminsdk-8zxxo-be33d0780f')

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const fireStoreSetting = {
  timestampsInSnapshots: true
}

export default firebase
export const db = firebase.firestore()
db.settings(fireStoreSetting)
