import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ValidatorsService } from '@shared/services/validators.service';
import { environment } from '@environment/environment';
declare var google: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {


  private fb = inject(FormBuilder);
  private router = inject(Router);

  private authService = inject(AuthService);
  private validatorsService = inject(ValidatorsService);

  ngAfterViewInit(): void {
    // google.accounts.id.initialize({
    //   client_id: this.CLIENT_ID,
    //   callback: (resp: any) => this.loginWithGoogle(resp),
    // });
    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
    });
  }

  public form: FormGroup = this.fb.group({
    fullname: ['', [Validators.required]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validatorsService.emailPattern),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validatorsService.passwordPattern),
      ],
    ],
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

    const { fullname, email, password } = this.form.value;
    this.isLoading.set(true);
    this.authService.register(fullname, email, password).subscribe({
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

  loginWithGoogle(resp: any) {
    if (resp) {
      const payload = this.decodeToken(resp.credential);
      console.log(payload);

      /*  this.authService.loginWithGoogle().subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard');
        },
        error: (message) => {
          Swal.fire('Error', message, 'error');
        },
      }); */
    }
  }
}
