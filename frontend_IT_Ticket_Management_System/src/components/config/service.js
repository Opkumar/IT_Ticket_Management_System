// Service.js
import { getDatabase, ref, set, update, get, child } from "firebase/database"; // Import Realtime Database methods


const database = getDatabase(); // Initialize Realtime Database

// Function to get documents from a Realtime Database collection
export const getDocuments = async (collectionPath) => {
  try {
    const dbRef = ref(database, collectionPath);
    const snapshot = await get(dbRef); // Get the snapshot of the data

    if (snapshot.exists()) {
      const documents = [];
      snapshot.forEach((childSnapshot) => {
        documents.push({ id: childSnapshot.key, ...childSnapshot.val() }); // Push each document with its ID
      });
      return documents; // Return fetched documents
    } else {
      console.error("No data available");
      return []; // Return an empty array if no data exists
    }
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

// Function to get a single document from a Realtime Database collection
export const getDocument = async (collectionPath, docId) => {
  try {
    const documentRef = ref(database, `${collectionPath}/${docId}`); // Construct the reference for the specific document
    const documentSnapshot = await get(documentRef);

    if (documentSnapshot.exists()) {
      return { id: documentSnapshot.key, ...documentSnapshot.val() }; // Return the document with its ID
    } else {
      console.error("No such document!");
      return null; // Return null if document does not exist
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};

// Function to update a Realtime Database document
export const updateDocument = async (collectionPath, docId, updatedData) => {
  try {
    const docRef = ref(database, `${collectionPath}/${docId}`); // Construct the reference for the specific document
    await update(docRef, updatedData); // Update the document with new data
    console.log(`Document ${docId} successfully updated.`);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Function to set a new Realtime Database document
export const setDocument = async (collectionPath, docId, data) => {
  try {
    const docRef = ref(database, `${collectionPath}/${docId}`); // Construct the reference for the specific document
    await set(docRef, data); // Set the data for the document
    console.log(`Document ${docId} successfully created/updated.`);
  } catch (error) {
    console.error("Error setting document: ", error);
    throw error;
  }
};
