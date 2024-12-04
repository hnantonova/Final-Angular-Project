import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-post',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog-create-post.component.html',
  styleUrl: './dialog-create-post.component.scss',
})
export class DialogCreatePostComponent {
  method: any = '';
  ngOnInit() {
    this.method = inject(MAT_DIALOG_DATA);
    console.log(this.method);
  }

  createPost() {
    if (this.method === collectionTypes.MomsCollection) {
      // send req to push in collection formoms
    }
    if (this.method === collectionTypes.TravelCollection) {
      // send req to push in collection travel
    }
    if (this.method === collectionTypes.RecipesCollection) {
      // send req to push in collection recepies
    }
  }
}
