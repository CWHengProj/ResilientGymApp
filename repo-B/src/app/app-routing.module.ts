import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { BuilderComponent } from './components/builder/builder.component';
import { WorkoutComponent } from './components/workout/workout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './auth.guard';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

const routes: Routes = [
  {path:'home' ,component:LandingPageComponent},
  // {path:'tutorial' ,component:TutorialComponent},
  {path:'more', component:DashBoardComponent, canActivate:[AuthGuard]},
  {path: 'builder', component:BuilderComponent, canActivate:[AuthGuard]},
  {path:'workout',component:WorkoutComponent, canActivate:[AuthGuard]},
  {path: 'login', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: '', redirectTo:'home', pathMatch:'full'},
  {path: '**', redirectTo:'home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
