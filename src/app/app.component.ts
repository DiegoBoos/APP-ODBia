import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { BlockUI, BlockUIModule, NgBlockUI } from 'ng-block-ui';
import { AuthStatus } from './core/auth/interfaces/auth-status.enum';
import { AuthService } from './core/auth/services/auth.service';

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
      console.log(this.authService.authStatus());
      switch (this.authService.authStatus()) {

        case AuthStatus.authenticated: 
        case AuthStatus.inLogin:

          this.router.navigateByUrl('/app');
          
          return;
          
        default:

          this.router.navigateByUrl('');
          return;

      }
    });
  }
}
