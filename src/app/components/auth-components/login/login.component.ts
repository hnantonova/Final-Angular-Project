import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  logInForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(this.emailRegex),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(private authService: AuthService) {}

  onSubmit() {
    console.log(this.logInForm.value); // Log the form values for debugging
    const { email, password } = this.logInForm.value;
    if (email && password) {
      this.authService.signIn(email, password);
    } else {
      console.log('Please fill in both email and password.');
    }
  }
}
