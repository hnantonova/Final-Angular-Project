import { Component, inject } from '@angular/core';
import { DialogCreatePostComponent } from '../dialog-create-post/dialog-create-post.component';
import { MatDialog } from '@angular/material/dialog';
import { collectionTypes } from '../../models/collection-types.enum';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../firestore/firestore.service';
import { PostComponent } from '../post/post.component';
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
    PostComponent,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent {
  isLoggedIn$: Observable<boolean>;
  postsResponse: any = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(DialogCreatePostComponent, {
      data: {
        method: collectionTypes.RecipesCollection,
      },
    });
  }

  ngOnInit() {
    this.refreshPosts();
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
          collectionTypes.MomsCollection
        );

        console.log({ currentLikes });

        if (currentLikes.includes(userId)) {
          //dislike
          this.firestoreService
            .dislikePost(postId, userId, collectionTypes.MomsCollection)
            .then(() => {
              this.refreshPosts();
            })
            .catch((error) => {
              console.error('Error liking post:', error);
            });
        } else {
          //like
          this.firestoreService
            .likePost(postId, userId, collectionTypes.MomsCollection)
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
}
