import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreatePostComponent } from '../dialog-create-post/dialog-create-post.component';
import { collectionTypes } from '../../models/collection-types.enum';
import { FirestoreService } from '../../firestore/firestore.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss',
})
export class InsightsComponent {
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
        method: collectionTypes.MomsCollection,
      },
    });
  }
  ngOnInit() {
    this.firestoreService
      .getAllPosts(collectionTypes.MomsCollection)
      .then((posts) => {
        this.postsResponse = posts;
      })
      .catch((error) => {});
  }
}
