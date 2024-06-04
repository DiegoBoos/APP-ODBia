import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ThemeService } from '@shared/services/theme.service';
import { UsageService } from '@services/usage.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

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
  public themeService = inject(ThemeService);
  private usageService = inject(UsageService);

  public isOptAuth = signal(true);
  public currentUser = computed(() => {
    
    return this.authService.currentUser()
 
  });

  ngOnInit(): void {
    initFlowbite();
  }

  changeTheme() {
    this.themeService.updateTheme(this.themeService.isDarkMode() ? 'light' : 'dark')
  }

  logOut() {
    this.usageService.resetState();
    this.authService.logout();
  }
}
