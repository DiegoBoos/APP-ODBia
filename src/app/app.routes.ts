import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./business/landing/landing.component'),
    children: [
      {
        path: 'landing',
        loadComponent: () => import('./business/landing/landing.component'),
      },
      {
        path: 'info',
        loadComponent: () =>
          import('./business/landing/pages/info/info.component'),
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./business/landing/pages/pricing/pricing.component'),
      },
      {
        path: 'login',
        loadComponent: () => import('./core/auth/login/login.component'),
      },
      {
        path: 'register',
        loadComponent: () => import('./core/auth/register/register.component'),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./core/auth/forgot-password/forgot-password.component'),
      },
      {
        path: 'reset-password/:token',
        loadComponent: () =>
          import('./core/auth/reset-password/reset-password.component'),
      },
      // {
      //   path: 'app',
      //   /* canMatch: [canMatchAuth], */
      //   loadComponent: () => import('./shared/components/layout/layout.component'),
      //   children: [
      //     {
      //       path: 'dashboard',
      //       title: 'Inicio',
      //       loadComponent: () =>
      //         import('./business/dashboard/dashboard.component'),
      //       data: {
      //         icon: 'fa-solid fa-spell-check',
      //         title: 'Dashboard',
      //         description: 'Tablero',
      //       },
      //     },
      //     // {
      //     //   path: 'usage',
      //     //   title: 'Usage',
      //     //   loadComponent: () => import('./dashboard/pages/usage/usage.component'),
      //     // },
      //   ],
      // },
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full',
      },
    ],
  },
  
  {
    path: 'app',
    /* canMatch: [canMatchAuth], */
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'dashboard',
        title: 'Inicio',
        loadComponent: () =>
          import('./business/dashboard/dashboard.component'),
        data: {
          icon: 'fa-solid fa-spell-check',
          title: 'Dashboard',
          description: 'Tablero',
        },
      },
      // {
      //   path: 'usage',
      //   title: 'Usage',
      //   loadComponent: () => import('./dashboard/pages/usage/usage.component'),
      // },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./business/landing/landing.component'),
  },
];
