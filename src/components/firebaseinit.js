import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/firebase-auth'
import 'firebase/storage'

var config = {
    apiKey: "AIzaSyAWIx_VddvQ9yerhEOSugJGP7EZ-ocE_EE",
    authDomain: "vue2-41a3c.firebaseapp.com",
    databaseURL: "https://vue2-41a3c.firebaseio.com",
    projectId: "vue2-41a3c",
    storageBucket: "vue2-41a3c.appspot.com",
    messagingSenderId: "761197204526",
    appId: "1:761197204526:web:fcf176973bbadc2c55fbbf",
    measurementId: "G-6PBVBHE2MC"
};


const fb = firebase.initializeApp(config);

const db = firebase.firestore();


export {fb,db}