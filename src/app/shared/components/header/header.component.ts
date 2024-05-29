import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit { 
  private authService = inject(AuthService);

  public isOptAuth = signal(true);
  public currentUser = computed(() => this.authService.currentUser());

  constructor() {
    // // effect(() => {
    //   console.log(this.authService.authStatus());
      
    //   switch (this.authService.authStatus()) {
    //     case AuthStatus.checking:
    //       return;

    //     case AuthStatus.authenticated || AuthStatus.inLogin:
    //       this.router.navigateByUrl('app');
          
    //       // const route = localStorage.getItem('route') || undefined;

    //       // if (!route) this.router.navigateByUrl('/app');
    //       // else this.router.navigateByUrl(route);

    //       return;
    //   }
    // // })
  }
  ngOnInit(): void {
    initFlowbite();
  }

  logOut() {
    this.authService.logout();
  }
}
