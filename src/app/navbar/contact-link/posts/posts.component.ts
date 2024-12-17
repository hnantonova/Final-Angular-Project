import { Component, inject } from '@angular/core';
import { DialogCreatePostComponent } from '../../../components/dialog-create-post/dialog-create-post.component';
import { MatDialog } from '@angular/material/dialog';
import { collectionTypes } from '../../../models/collection-types.enum';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../../firestore/firestore.service'; 
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIcon,
    
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent {
  isLoggedIn$: Observable<boolean>;
  postsResponse: any[] = [];

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

 

  ngOnInit() {
    this.refreshPosts();
  }

  async refreshPosts() {
    console.log('Fetching posts from all collections...');
    const allPosts = [];

    // Loop through all collections in collectionTypes
    for (const collection of Object.values(collectionTypes)) {
      try {
        const posts = await this.firestoreService.getAllPosts(collection);
        allPosts.push(
          ...posts.map((post) => ({
            ...post,
            collection, // Add the collection name to the post for reference
          }))
        );
      } catch (error) {
        console.error(`Error fetching posts from ${collection}:`, error);
      }
    }

    this.postsResponse = allPosts;
    console.log('All posts:', this.postsResponse);
  }
}