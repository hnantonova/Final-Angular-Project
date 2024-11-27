import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InsightsComponent } from './components/insights/insights.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { TravelComponent } from './components/travel/travel.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'insights', component: InsightsComponent },
    { path: 'recipes', component: RecipesComponent },
    { path: 'travel', component: TravelComponent },
];
