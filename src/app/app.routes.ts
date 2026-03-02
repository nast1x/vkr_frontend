import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {ChooseRoleComponent} from "./pages/choose-role/choose-role.component";
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {MainComponent} from "./pages/main/main.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {HeaderComponent} from "./pages/header/header.component";
import {UniversitiesComponent} from "./pages/universities/universities.component";
import {TeamComponent} from "./pages/team/team.component";
import {CompetitionsComponent} from "./pages/competitions/competitions.component";
import {CompetitionDetailsComponent} from "./pages/competition-details/competition-details.component";


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'choose_role', component: ChooseRoleComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'main', component: MainComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'universities', component: UniversitiesComponent },
  { path: 'team', component: TeamComponent },
  { path: 'competitions', component: CompetitionsComponent },
  { path: 'competition-details', component: CompetitionDetailsComponent },
  { path: '**', redirectTo: '' }
];
