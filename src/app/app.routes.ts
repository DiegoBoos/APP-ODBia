import { Routes } from '@angular/router';
import { canMatchAuth } from '@guards/auth.guard';
import DashboardComponent from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component'),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./auth/forgot-password/forgot-password.component'),
      },
      {
        path: 'reset-password/:token',
        loadComponent: () =>
          import('./auth/reset-password/reset-password.component'),
      },
    ],
  },
  {
    path: 'dashboard',
    /* canMatch: [canMatchAuth], */
    component: DashboardComponent,
    children: [
      {
        path: 'landing',
        title: 'Inicio',
        loadComponent: () =>
          import('./dashboard/pages/landing/landing.component'),
      },
      {
        path: 'usage',
        title: 'Usage',
        loadComponent: () => import('./dashboard/pages/usage/usage.component'),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },

  {
    path: '**',
    loadComponent: () => import('./auth/login/login.component'),
  },
];
