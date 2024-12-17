import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service'; 
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignupGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      tap((isLoggedIn) => {
        if (isLoggedIn) {
          // If user is logged in, redirect to home
          this.router.navigate(['/']);
        }
      }),
      map((isLoggedIn) => !isLoggedIn) // Allow access only if not logged in
    );
  }
}
