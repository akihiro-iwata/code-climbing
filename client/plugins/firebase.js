import firebase from 'firebase'

let config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  messagingSenderId: process.env.messagingSenderId,
  storageBucket: process.env.storageBucket
}

if (!firebase.apps.length) {
  console.log(config)
  firebase.initializeApp(config)
}

export default firebase
export const db = firebase.database()
