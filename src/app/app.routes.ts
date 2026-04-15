import {Routes} from '@angular/router';
import {authGuard, guestGuard} from './guards/auth.guard';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {MainComponent} from './pages/main/main.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {UniversitiesComponent} from './pages/universities/universities.component';
import {UniversityDetailComponent} from './pages/university-detail/university-detail.component';
import {TeamComponent} from './pages/team/team.component';
import {CompetitionsComponent} from './pages/competitions/competitions.component';
import {CompetitionDetailsComponent} from './pages/competition-details/competition-details.component';
import {SportsFacilitiesComponent} from './pages/sports-facilities/sports-facilities.component';
import {SportsFacilitiesDetailComponent} from './pages/sports-facilities-detail/sports-facilities-detail.component';
import {StatisticsComponent} from './pages/statistics/statistics.component';
import {FavoriteComponent} from './pages/favorite/favorite.component';
import {AdminPanelComponent} from "./pages/admin-panel/admin-panel.component";
import {AchievementsComponent} from "./pages/achievements/achievements.component";


export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate: [guestGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [guestGuard]},
  {path: 'main', component: MainComponent, canActivate: [authGuard]},
  {path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard]},
  {path: 'universities', component: UniversitiesComponent, canActivate: [authGuard]},
  {path: 'universities-details/:id', component: UniversityDetailComponent, canActivate: [authGuard]},
  {path: 'team', component: TeamComponent, canActivate: [authGuard]},
  {path: 'competitions', component: CompetitionsComponent, canActivate: [authGuard]},
  {path: 'competition-details/:id', component: CompetitionDetailsComponent, canActivate: [authGuard]},
  {path: 'sports-facilities', component: SportsFacilitiesComponent, canActivate: [authGuard]},
  {path: 'sports-facilities-detail/:id', component: SportsFacilitiesDetailComponent, canActivate: [authGuard]},
  {path: 'statistics', component: StatisticsComponent, canActivate: [authGuard]},
  {path: 'favorite', component: FavoriteComponent, canActivate: [authGuard]},
  {path: 'admin-panel', component: AdminPanelComponent, canActivate: [authGuard]},
  {path: 'achievements', component: AchievementsComponent, canActivate: [authGuard]},
  {path: '**', redirectTo: ''}
];
