import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {  GoogleSigninButtonModule } from '@abacritt/angularx-social-login';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent implements OnInit {
  user: SocialUser | null = null;
  loggedIn: boolean | null = null;

  ngOnInit(): void {

    this.socialAuthService.authState.subscribe((user) => {

      if (user) {
        this.authService.socialRegister(user.name, user.email).subscribe();
        
        this.user = user;
        this.loggedIn = (user != null);
        
      }
      
    });
  }

  private fb = inject(FormBuilder);
  private router = inject(Router);

  private authService = inject(AuthService);
  private socialAuthService = inject(SocialAuthService);

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  public isLoading = signal(false);

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    this.isLoading.set(true);
    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigateByUrl('app');
      },
      error: (message) => {
        this.isLoading.set(false);
        Swal.fire('Error', message, 'error');
      },
    });
  }
  
}
