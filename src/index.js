import {
  doc,
  getFirestore,
  addDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

import app from './fireConfig.js';
import formControl from './form.js';
import graphController from './graph.js';

const db = getFirestore(app);
const dbName = 'expenses';

const form = document.querySelector('form');

form.addEventListener(
  'submit',
  formControl.bind(null, async data => {
    await addDoc(collection(db, dbName), data);
  })
);

let data = [];
onSnapshot(collection(db, dbName), doc => {
  doc.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      case 'modified':
        data = data.map(item => (item.id === doc.id ? doc : item));
        break;
      default:
        break;
    }
  });

  graphController(data, handleDeleteDoc);
});

const handleDeleteDoc = async (_, d) => {
  try {
    await deleteDoc(doc(db, dbName, d.data.id));
  } catch (error) {
    console.error('Something went wrong deleting data!');
    console.error(error);
  }
};
