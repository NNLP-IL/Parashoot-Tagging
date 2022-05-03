import firebase from 'firebase'



const config ={
        apiKey: "AIzaSyB70IFdsSJ056tK0OWqEJMEnzhRQuAHuPI",
        authDomain: "parashot-88db8.firebaseapp.com",
        projectId: "parashot-88db8",
        storageBucket: "parashot-88db8.appspot.com",
        messagingSenderId: "754346365422",
        appId: "1:754346365422:web:3a3c5096fed773e4237eff",
        measurementId: "G-8Q98XS0NPJ"
}
const firebaseApp = firebase.initializeApp(config)

const db = firebaseApp.firestore()
const userCollection = db.collection('users')

export const addAnnotation = tag => {
    return userCollection.add(tag)
}