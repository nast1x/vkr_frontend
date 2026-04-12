// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

// Публичные страницы
import { HomeComponent } from './pages/home/home.component';
import { ChooseRoleComponent } from './pages/choose-role/choose-role.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

// Защищённые страницы
import { MainComponent } from './pages/main/main.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UniversitiesComponent } from './pages/universities/universities.component';
import { UniversityDetailComponent } from './pages/university-detail/university-detail.component';
import { TeamComponent } from './pages/team/team.component';
import { CompetitionsComponent } from './pages/competitions/competitions.component';
import { CompetitionDetailsComponent } from './pages/competition-details/competition-details.component';
import { SportsFacilitiesComponent } from './pages/sports-facilities/sports-facilities.component';
import { SportsFacilitiesDetailComponent } from './pages/sports-facilities-detail/sports-facilities-detail.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import {AdminPanelComponent} from "./pages/admin-panel/admin-panel.component";
import {AchievementsComponent} from "./pages/achievements/achievements.component";


export const routes: Routes = [
  // Публичные маршруты (доступны всем)
  { path: '', component: HomeComponent },
  { path: 'choose_role', component: ChooseRoleComponent, canActivate: [guestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

  // Защищённые маршруты (только для авторизованных)
  { path: 'main', component: MainComponent, canActivate: [authGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'universities', component: UniversitiesComponent, canActivate: [authGuard] },
  { path: 'universities-details/:id', component: UniversityDetailComponent, canActivate: [authGuard] },
  { path: 'team', component: TeamComponent, canActivate: [authGuard] },
  { path: 'competitions', component: CompetitionsComponent, canActivate: [authGuard] },
  { path: 'competition-details/:id', component: CompetitionDetailsComponent, canActivate: [authGuard] },
  { path: 'sports-facilities', component: SportsFacilitiesComponent, canActivate: [authGuard] },
  { path: 'sports-facilities-detail/:id', component: SportsFacilitiesDetailComponent, canActivate: [authGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [authGuard] },
  { path: 'favorite', component: FavoriteComponent, canActivate: [authGuard] },
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [authGuard] },
  { path: 'achievements', component: AchievementsComponent, canActivate: [authGuard] },

  // Редирект для неизвестных путей
  { path: '**', redirectTo: '' }
];
