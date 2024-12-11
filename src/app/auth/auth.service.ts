import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from '@angular/fire/auth';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.currentUser$ = authState(this.auth);
  }

  signUp(email: string, password: string): Observable<void> {
    const observable: Observable<void> = from(
      createUserWithEmailAndPassword(this.auth, email, password).then(
        (userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log(user);
        }
      )
    );

    return observable;
  }

  signIn(email: string, password: string): Observable<void> {
    const observable: Observable<void> = from(
      signInWithEmailAndPassword(this.auth, email, password).then(
        (userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          
        }
      )
    );
    return observable;
  }

  isLoggedIn(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => !!user));
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
  }
}
