import { Component, inject } from '@angular/core';
import { DialogCreatePostComponent } from '../dialog-create-post/dialog-create-post.component';
import { MatDialog } from '@angular/material/dialog';
import { collectionTypes } from '../../models/collection-types.enum';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../firestore/firestore.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, 
    ],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss',
})
export class InsightsComponent {
  isLoggedIn$: Observable<boolean>;
  postsResponse: any = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(DialogCreatePostComponent, {
      data: {
        method: collectionTypes.MomsCollection,
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
    this.firestoreService
      .getAllPosts(collectionTypes.MomsCollection)
      .then((posts) => {
        this.postsResponse = posts.map((post) => ({
          ...post,
          likes: post.likes || [],
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
    this.router.navigate(['/details', postId, collectionTypes.MomsCollection]);
  
  }
}
