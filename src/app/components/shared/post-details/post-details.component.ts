import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../firestore/firestore.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCardModule, MatButtonModule],
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
    private authService: AuthService,
    private router: Router
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
  
        try {
          // Fetch the current likes for the post
          const currentLikes = await this.firestoreService.getPostLikes(postId);
  
          if (currentLikes.includes(userId)) {
            // User already liked the post, so unlike it
            await this.firestoreService.dislikePost(postId, userId);
            console.log('Post unliked');
            this.post.likesLength--; // Update the local likes count
          } else {
            // User hasn't liked the post yet
            await this.firestoreService.likePost(postId, userId);
            console.log('Post liked');
            this.post.likesLength++; // Update the local likes count
          }
        } catch (error) {
          console.error('Error updating likes:', error);
        }
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
      },
    });
  }

  

  closePost() {
    console.log('Post closed!');
    this.router.navigate([history.back()]);
  }
}
