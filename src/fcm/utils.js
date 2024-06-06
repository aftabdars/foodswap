import { getFirestore, doc, setDoc } from "firebase/firestore";


const db = getFirestore(firebaseApp);

export async function saveTokenToFirestore(userId, token) {
  const userRef = doc(db, 'users', userId); // Create a reference in Firestore to the user's record
  await setDoc(userRef, { expoPushToken: token }, { merge: true }); // Save the push token for the user
}
