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
declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private readonly CLIENT_ID: string = environment.CLIENT_ID;

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

  private fb = inject(FormBuilder);
  private router = inject(Router);

  private authService = inject(AuthService);

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
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error: (message) => {
        Swal.fire('Error', message, 'error');
      },
    });
    /* if (resp) {
      const payload = this.decodeToken(resp.credential);
      console.log(payload);
    } */
  }
}
