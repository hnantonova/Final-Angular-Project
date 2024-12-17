import { Component, inject } from '@angular/core';
import { DialogCreatePostComponent } from '../dialog-create-post/dialog-create-post.component';
import { MatDialog } from '@angular/material/dialog';
import { collectionTypes } from '../../models/collection-types.enum';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../firestore/firestore.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIcon, ReactiveFormsModule, MatFormField, MatLabel, MatError, MatInput,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent {
  isLoggedIn$: Observable<boolean>;
  postsResponse: any = '';

  editState: { [key: string]: boolean } = {}; // To track edit mode per post
  editForms: { [key: string]: FormGroup } = {}; // To store form data for each post

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private fb: FormBuilder // Add FormBuilder dependency
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  dialog = inject(MatDialog);
  userId: string = '';

  openDialog() {
    this.dialog.open(DialogCreatePostComponent, {
      data: {
        method: collectionTypes.RecipesCollection,
      },
    });
  }

  // ngOnInit() {
  //   this.refreshPosts();

  // }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.userId = user.uid; // Save the current user's ID
          this.refreshPosts();
        }
      },
    });
  }

  likePost(postId: string) {
    this.authService.getCurrentUser().subscribe({
      next: async (user) => {
        console.log(user?.uid);

        if (!user) {
          return;
        }

        const userId = user.uid;

        const currentLikes = await this.firestoreService.getPostLikes(
          postId,
          collectionTypes.RecipesCollection
        );

        console.log({ currentLikes });

        if (currentLikes.includes(userId)) {
          //dislike
          this.firestoreService
            .dislikePost(postId, userId, collectionTypes.RecipesCollection)
            .then(() => {
              this.refreshPosts();
            })
            .catch((error) => {
              console.error('Error liking post:', error);
            });
        } else {
          //like
          this.firestoreService
            .likePost(postId, userId, collectionTypes.RecipesCollection)
            .then(() => {
              this.refreshPosts();
            })
            .catch((error) => {
              console.error('Error liking post:', error);
            });
        }
      },
    });
  }

  refreshPosts() {
    console.log('refresh');

    this.firestoreService
      .getAllPosts(collectionTypes.RecipesCollection)
      .then((posts) => {
        this.postsResponse = posts.map((post) => ({
          ...post,
          likes: post.likes || [], // Initialize likes as an empty array if undefined
          likesLength: post.likes?.length || 0,
        }));

        console.log(this.postsResponse);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }

  openPost(postId: string) {
    console.log('Open post with ID:', postId);
    this.router.navigate(['/details', postId, collectionTypes.RecipesCollection]);
  }

  toggleEditState(postId: string, currentTitle: string, currentBody: string) {
    this.editState[postId] = !this.editState[postId];
    if (this.editState[postId] && !this.editForms[postId]) {
      this.editForms[postId] = this.fb.group({
        title: [currentTitle, [Validators.required, Validators.minLength(5)]],
        body: [currentBody, [Validators.required, Validators.minLength(10)]],
      });
    }
  }
  
  updatePost(postId: string) {
    const form = this.editForms[postId];
    if (form && form.valid) {
      const updatedData = {
        title: form.value.title,
        body: form.value.body,
      };
      this.firestoreService
        .updatePost(collectionTypes.RecipesCollection, postId, updatedData)
        .then(() => {
          this.editState[postId] = false;
          this.refreshPosts(); // Refresh posts to reflect changes
          alert('Post updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating post:', error);
          alert('Failed to update the post.');
        });
    } else {
      alert('Please fix errors before saving.');
    }
  }
  
  deletePost(postId: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.firestoreService
        .deletePost(collectionTypes.RecipesCollection, postId)
        .then(() => {
          this.refreshPosts(); // Refresh posts after deletion
          alert('Post deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting post:', error);
          alert('Failed to delete the post.');
        });
    }
  }
}
