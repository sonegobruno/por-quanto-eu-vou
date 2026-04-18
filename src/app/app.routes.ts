import { Routes } from '@angular/router';
import { HomeComponent } from './home/pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
