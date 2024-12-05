import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { collectionTypes } from '../../models/collection-types.enum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FirestoreService } from '../../firestore/firestore.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-dialog-create-post',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-create-post.component.html',
  styleUrl: './dialog-create-post.component.scss',
})
export class DialogCreatePostComponent {
  method: any = '';
  myForm: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private fb: FormBuilder
  ) {
    this.method = inject(MAT_DIALOG_DATA);

    this.myForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    console.log(this.method);
  }

  createPost() {
    const { title, body } = this.myForm.value;


    const res = this.firestoreService.createNewPost(title, body);

    console.log({ res });

    if (this.method === collectionTypes.MomsCollection) {
      // send req to push in collection formoms
      console.log('create post');
    }
    if (this.method === collectionTypes.TravelCollection) {
      // send req to push in collection travel
    }
    if (this.method === collectionTypes.RecipesCollection) {
      // send req to push in collection recepies
    }
  }
}
