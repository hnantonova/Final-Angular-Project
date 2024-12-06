import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  collectionData,
} from '@angular/fire/firestore';
import { collectionTypes } from '../models/collection-types.enum';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private readonly firestore: Firestore) {}

  async createNewPost(
    title: string,
    body: string,
    collectionType: string,
    userId: string
  ) {
    const docRef = await addDoc(collection(this.firestore, collectionType), {
      title,
      body,
      userId,
    });
    // create, read, update, delete
    return docRef;
  }

  async getAllPosts(collectionType: string): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(
        collection(this.firestore, collectionType)
      );
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return posts; // Return the array of posts
    } catch (error) {
      console.error(`Error fetching posts from ${collectionType}:`, error);
      throw error; // Re-throw the error for handling in the calling function
    }
  }

  getAllPostsByUser(collectionType: string, userId: string): Observable<any[]> {
    // Reference to the collection
    const collectionRef = collection(this.firestore, collectionType);

    // Firestore query to filter by userId
    const userQuery = query(collectionRef, where('userId', '==', userId));

    // Return an Observable that emits the data in real-time
    return collectionData(userQuery, { idField: 'id' }) as Observable<any[]>;
  }

  // async deleteOnePost(id: string) {}

  // async updateOnePost(id: string) {}
}
