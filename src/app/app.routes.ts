import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {ChooseRoleComponent} from "./pages/choose-role/choose-role.component";


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'choose_role', component: ChooseRoleComponent },
  { path: '**', redirectTo: '' }
];
