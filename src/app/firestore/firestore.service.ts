import { Injectable } from '@angular/core';
import {
  doc,
  docData,
  Firestore,
  addDoc,
  collection,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private readonly firestore: Firestore) {}

  async createNewPost(title: string, body: string) {
    console.log('createNewPost');

    const docRef = await addDoc(collection(this.firestore, 'forMoms'), {
      title,
      body,
    });

    // create
    // read
    // update
    // delete

    return docRef;
  }

  async getPosts() {
    
  }
}
