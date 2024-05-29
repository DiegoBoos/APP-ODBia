import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { routes } from '../../../app.routes';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidemenu.component.html',
  styles: `
      :host {
        display: block;
      }
    `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidemenuComponent implements OnInit {
  private authService = inject(AuthService);

  public currentUser = computed(() => this.authService.currentUser());

  public menuItems = routes
    .map((route) => route.children ?? [])
    .flat()
    .filter((route) => route && route.path)
    .filter(
      (route) =>
        route.path !== 'login' &&
        route.path !== 'upload-media' &&
        route.path !== 'mi-buzon' &&
        route.path !== 'mis-buzones' &&
        route.path !== 'mis-radicaciones' &&
        route.path !== 'radicar' &&
        route.path !== 'legalizacion' &&
        route.path !== 'legalizar' &&
        route.path !== 'forgot-password'
    )
    .filter((route) => !route.path?.includes(':'));

  constructor() {
    // const dashboardRoutes = routes
    // .map( route => route.children ?? [] )
    // .flat()
    // .filter( route => route && route.path )
    // .filter( route => !route.path?.includes(':'))
  }
  ngOnInit(): void {
    initFlowbite();
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    // if (
    //   localStorage.getItem('color-theme') === 'dark' ||
    //   (!('color-theme' in localStorage) &&
    //     window.matchMedia('(prefers-color-scheme: dark)').matches)
    // ) {
    //   document.documentElement.classList.add('dark');
    // } else {
    //   document.documentElement.classList.remove('dark');
    // }
    // // Change the icons inside the button based on previous settings
    // const themeToggleDarkIcon = document.getElementById(
    //   'theme-toggle-dark-icon'
    // );
    // const themeToggleLightIcon = document.getElementById(
    //   'theme-toggle-light-icon'
    // );

    // if (
    //   localStorage.getItem('color-theme') === 'dark' ||
    //   (!('color-theme' in localStorage) &&
    //     window.matchMedia('(prefers-color-scheme: dark)').matches)
    // ) {
    //   themeToggleLightIcon!.classList.remove('hidden');
    // } else {
    //   themeToggleDarkIcon!.classList.remove('hidden');
    // }

    // const themeToggleBtn = document.getElementById('theme-toggle');

    // themeToggleBtn!.addEventListener('click', () => {
    //   // Toggle icons inside button
    //   themeToggleDarkIcon!.classList.toggle('hidden');
    //   themeToggleLightIcon!.classList.toggle('hidden');

    //   // If set via local storage previously
    //   if (localStorage.getItem('color-theme')) {
    //     if (localStorage.getItem('color-theme') === 'light') {
    //       document.documentElement.classList.add('dark');
    //       localStorage.setItem('color-theme', 'dark');
    //     } else {
    //       document.documentElement.classList.remove('dark');
    //       localStorage.setItem('color-theme', 'light');
    //     }

    //     // If NOT set via local storage previously
    //   } else {
    //     if (document.documentElement.classList.contains('dark')) {
    //       document.documentElement.classList.remove('dark');
    //       localStorage.setItem('color-theme', 'light');
    //     } else {
    //       document.documentElement.classList.add('dark');
    //       localStorage.setItem('color-theme', 'dark');
    //     }
    //   }
    // });
  }

  logout() {
    this.authService.logout();
  }
}
