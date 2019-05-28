import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyBnzlJgclO56x01BSy8xfydKals-UVqpXQ",
    authDomain: "albiziapp-e2b67.firebaseapp.com",
    databaseURL: "https://albiziapp-e2b67.firebaseio.com",
    projectId: "albiziapp-e2b67",
    storageBucket: "albiziapp-e2b67.appspot.com",
    messagingSenderId: "99590398062"
  };
  
let db=firebase.initializeApp(config)
export const auth=db.auth()
export const firestore=db.firestore()
