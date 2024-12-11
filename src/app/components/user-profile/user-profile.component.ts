import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../firestore/firestore.service';
import { AuthService } from '../../auth/auth.service';
import { collectionTypes } from '../../models/collection-types.enum';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'], // Corrected from `styleUrl` to `styleUrls`
})
export class UserProfileComponent {
  userId: string = '';
  posts$: Observable<any[]> = new Observable<any[]>(); // Correct type for `posts$`
  editState: { [key: string]: boolean } = {}; // Track edit state per post
  editForms: { [key: string]: FormGroup } = {}; // Track edit forms per post

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.posts$ = this.firestoreService.getAllPostsByUser(
          collectionTypes.MomsCollection,
          this.userId
        );
      }
    });
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
        .updatePost(collectionTypes.MomsCollection, postId, updatedData)
        .then(() => {
          this.editState[postId] = false;
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
        .deletePost(collectionTypes.MomsCollection, postId)
        .then(() => {
          alert('Post deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting post:', error);
          alert('Failed to delete the post.');
        });
    }
  }
  
}