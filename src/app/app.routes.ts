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

export const routes: Routes = [

    // { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '', component: DashboardComponent },  
    { path: 'contact', component: ContactComponent },
    { path: 'about', component: AboutComponent },

    { path: 'insights', component: InsightsComponent },
    { path: 'recipes', component: RecipesComponent },
    { path: 'travel', component: TravelComponent },

    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },

    { path: 'user-profile', component: UserProfileComponent, canActivate: [ProfileGuard] },
    
];
