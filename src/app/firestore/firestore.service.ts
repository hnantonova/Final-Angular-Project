import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  collectionData,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
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
      likes: [],
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

  async getPostLikesforDetails(postId: string, collectionType: string): Promise<string[]> {
    const postDocRef = doc(this.firestore, `${collectionType}/${postId}`);
    const postSnapshot = await getDoc(postDocRef);
  
    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      return postData['likes'] || []; // Return likes array or empty array
    }
  
    throw new Error('Post not found');
  }

  async likePost(postId: string, uid: string, collectionType: string) {
    const postRef = doc(this.firestore, `${collectionType}/${postId}`);

    try {
      await updateDoc(postRef, {
        likes: arrayUnion(uid),
      });
      console.log('Post liked');
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async dislikePost(postId: string, uid: string, collectionType: string) {
    const postRef = doc(this.firestore, `${collectionType}/${postId}`);

    try {
      await updateDoc(postRef, {
        likes: arrayRemove(uid),
      });
      console.log('Post disliked');
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async getPostLikes(
    postId: string,
    collectionType: string
  ): Promise<string[]> {
    const docRef = doc(this.firestore, collectionType, postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const postData = docSnap.data();
      return postData['likes'] || [];
    } else {
      console.error(`Post with ID ${postId} not found.`);
      return [];
    }
  }

  async updatePost(
    collectionType: string,
    postId: string,
    updatedData: any
  ): Promise<void> {
    const postRef = doc(this.firestore, `${collectionType}/${postId}`);
    try {
      await updateDoc(postRef, updatedData);
      console.log('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async deletePost(collectionType: string, postId: string): Promise<void> {
    const postRef = doc(this.firestore, `${collectionType}/${postId}`);
    try {
      await deleteDoc(postRef);
      console.log('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  async getPostByUserId(collectionType: string, postId: string): Promise<any> {
    try {
      const docRef = doc(this.firestore, collectionType, postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        return postData || null;
      } else {
        console.error(`Post with ID ${postId} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching post by user ID:', error);
      return null;
    }
  }
}
