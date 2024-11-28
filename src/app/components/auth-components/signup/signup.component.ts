import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  signUp() {
    this.authService.signUp(this.username, this.password);
  }
}
