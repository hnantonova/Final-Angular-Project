import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InsightsComponent } from './components/insights/insights.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { TravelComponent } from './components/travel/travel.component';
import { LoginComponent } from './components/auth-components/login/login.component';
import { SignupComponent } from './components/auth-components/signup/signup.component';
import { ContactComponent } from './navbar/contact-link/contact/contact.component';
import { AboutComponent } from './navbar/contact-link/about/about.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfileGuard } from './guards/profile.guard';
import { PostsComponent } from './navbar/contact-link/posts/posts.component';
import { PostDetailsComponent } from './components/shared/post-details/post-details.component';
import { LoginGuard } from './guards/login.guard';
import { SignupGuard } from './guards/signup.guars';
import { PageNotFoundComponent } from './components/page.not.found/page.not.found.component'; 

export const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component: DashboardComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },

  { path: 'insights', component: InsightsComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'travel', component: TravelComponent },

  { path: 'login', component: LoginComponent, canActivate: [LoginGuard], },
  { path: 'signup', component: SignupComponent, canActivate: [SignupGuard], },
  {
    path: 'details/:id/:collectionType',
    component: PostDetailsComponent,
  },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [ProfileGuard],
  },
];
