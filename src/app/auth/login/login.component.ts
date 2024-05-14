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
import { environment } from '@environment/environment';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
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


  /* ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: this.CLIENT_ID,
      callback: (resp: any) => this.loginWithGoogle(resp),
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
    });
  } */

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
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
        this.router.navigateByUrl('/dashboard');
        // this.isLoading.set(false);
      },
      error: (message) => {
        this.isLoading.set(false);
        Swal.fire('Error', message, 'error');
      },
    });
  }

  private decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  loginWithGoogle() {
    // window.location.href = 'http://localhost:8000/api/auth/google/login';
    // this.authService.loginWithGoogle()
    /* if (resp) {
      const payload = this.decodeToken(resp.credential);
      console.log(payload);
    } */
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      this.authService.loginWithGoogle(user.idToken).subscribe((response) => {
        console.log('Logged in', response);
      });
    });
  }

  signInWithGoogle(): void {
    // this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      console.log(user);
      
      this.authService.loginWithGoogle(user.idToken).subscribe((response) => {
        console.log('Logged in', response);
      });
    });
  }
  
}
