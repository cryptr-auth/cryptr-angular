import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReactComponent } from './pages/react/react.component';
import { GraphqlComponent } from './pages/graphql/graphql.component';
import { GrowthHackerComponent } from './pages/growth-hacker/growth-hacker.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { AuthGuard } from 'projects/cryptr/cryptr-angular/src/lib/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'react',
    component: ReactComponent
  },
  {
    path: 'graphql',
    component: GraphqlComponent
  },
  {
    path: 'growth-hacker',
    component: GrowthHackerComponent
  },
  {
    path: 'mes-formations',
    component: MyCoursesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
