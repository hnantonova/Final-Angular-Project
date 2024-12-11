import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Post } from '../../models/postModel';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../firestore/firestore.service';
import { collectionTypes } from '../../models/collection-types.enum';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  @Input() post!: Post;
  @Input() collectionType!: string;
  @Output() refreshPosts = new EventEmitter<void>();
  isLoggedIn$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
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
          this.collectionType
        );

        console.log({ currentLikes });

        if (currentLikes.includes(userId)) {
          // unlike
          this.firestoreService
            .dislikePost(postId, userId, this.collectionType)
            .then(() => {
              this.refreshPosts.emit();
            })
            .catch((error) => {
              console.error('Error liking post:', error);
            });
        } else {
          // like
          this.firestoreService
            .likePost(postId, userId, this.collectionType)
            .then(() => {
              this.refreshPosts.emit();
            })
            .catch((error) => {
              console.error('Error liking post:', error);
            });
        }
      },
    });
  }
}
