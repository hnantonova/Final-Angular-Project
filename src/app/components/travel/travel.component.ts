import { Component, inject } from '@angular/core';
import { DialogCreatePostComponent } from '../dialog-create-post/dialog-create-post.component';
import { MatDialog } from '@angular/material/dialog';
import { collectionTypes } from '../../models/collection-types.enum';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../../firestore/firestore.service';


@Component({
  selector: 'app-travel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './travel.component.html',
  styleUrl: './travel.component.scss',
})
export class TravelComponent {
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
        method: collectionTypes.TravelCollection,
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
          collectionTypes.TravelCollection
        );

        console.log({ currentLikes });

        if (currentLikes.includes(userId)) {
          // dislike
          this.firestoreService
            .dislikePost(postId, userId, collectionTypes.TravelCollection)
            .then(() => {
              this.refreshPosts();
            })
            .catch((error) => {
              console.error('Error liking post:', error);
            });
        } else {
          // like
          this.firestoreService
            .likePost(postId, userId, collectionTypes.TravelCollection)
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
    this.firestoreService
      .getAllPosts(collectionTypes.TravelCollection)
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

