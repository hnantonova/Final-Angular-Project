import { Component } from '@angular/core';
import { FirestoreService } from '../../firestore/firestore.service';
import { AuthService } from '../../auth/auth.service';
import { collectionTypes } from '../../models/collection-types.enum';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'], // Corrected from `styleUrl` to `styleUrls`
})
export class UserProfileComponent {
  userId: string = '';
  posts$: Observable<any[]> = new Observable<any[]>(); // Correct type for `posts$`

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
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
}
