import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../firestore/firestore.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';


@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, MatIcon, MatButton],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
})

export class PostDetailsComponent {
  isLoggedIn$: Observable<boolean>;
  post!: any;
  firestoreService: any;
  
  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirestoreService,
    private authService: AuthService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.populatePost();
  }

  async populatePost() {
    const heroId = this.route.snapshot.paramMap.get('id');
    const collectionType = this.route.snapshot.paramMap.get('collectionType');
    if (heroId && collectionType) {
      await this.firebaseService
        .getPostByUserId(collectionType, heroId)
        .then((post) => {
          console.log('Post:', post);

          this.post = post;
        })
        .catch((error: any) => {
          console.error('Error fetching post:', error);
        });
    } else {
      // Handle the case where heroId or collectionType is null
      console.error('Invalid heroId or collectionType');
    }
  }
  likePost(postId: string) {
    this.authService.getCurrentUser().subscribe({
      next: async (user) => {
        if (!user) {
          console.error('User not logged in');
          return;
        }

        const userId = user.uid;

        // Get current likes for the post
        const currentLikes = await this.firestoreService.getPostLikes(postId, this.collectionType);

        if (currentLikes.includes(userId)) {
          // Unlike the post
          this.firestoreService
            .dislikePost(postId, userId, this.collectionType)
            .then(() => {
              console.log('Post unliked');
              this.post.likesLength--; // Update likes count locally
            })
            .catch((error: any) => {
              console.error('Error unliking post:', error);
            });
        } else {
          // Like the post
          this.firestoreService
            .likePost(postId, userId, this.collectionType)
            .then(() => {
              console.log('Post liked');
              this.post.likesLength++; // Update likes count locally
            })
            .catch((error: any) => {
              console.error('Error liking post:', error);
            });
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }
  collectionType(postId: string, collectionType: any) {
    throw new Error('Method not implemented.');
  }
}
