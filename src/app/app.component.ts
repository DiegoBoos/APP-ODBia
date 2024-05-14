import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { BlockUI, BlockUIModule, NgBlockUI } from 'ng-block-ui';
import { AuthStatus } from './auth/interfaces/auth-status.enum';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BlockUIModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'app-plataforma-radicacion';

  @BlockUI() blockUI?: NgBlockUI;

  private authService = inject(AuthService);
  private router = inject(Router);

  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }

    return true;
  });

  constructor() {
    effect(() => {
      switch (this.authService.authStatus()) {
        case AuthStatus.checking:
          return;

        case AuthStatus.authenticated:
          const route = localStorage.getItem('route') || undefined;

          if (!route) this.router.navigateByUrl('/dashboard');
          else this.router.navigateByUrl(route);

          return;

        case AuthStatus.notAuthenticated:
          if (
            this.router.getCurrentNavigation()?.extractedUrl.root.children[
              'primary'
            ]
          ) {
            if (
              this.router.getCurrentNavigation()?.extractedUrl.root.children[
                'primary'
              ].segments[1]
            ) {
              const subPath =
                this.router.getCurrentNavigation()?.extractedUrl.root.children[
                  'primary'
                ].segments[1].path;
              if (subPath !== 'reset-password') {
                this.router.navigateByUrl('/auth/login');
              }
            } else {
              this.router.navigateByUrl('/auth/login');
            }
          } else {
            this.router.navigateByUrl('/auth/login');
          }

          return;
      }
    });
  }
}
