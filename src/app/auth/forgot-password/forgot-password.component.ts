import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { BlockUIModule, BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BlockUIModule],
  templateUrl: './forgot-password.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ForgotPasswordComponent {
  @BlockUI('load-data') blockUILoadData!: NgBlockUI;

  private fb = inject(FormBuilder);
  private router = inject(Router);

  private authService = inject(AuthService);

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email } = this.form.value;

    this.blockUILoadData.start('Procesando solicitud ...');
    this.authService.passwordRestore(email).subscribe({
      next: (resp) => {
        const { message } = resp;
        Swal.fire('Restaurar contraseña', `${message}`, 'success');
        this.blockUILoadData.stop();
        this.router.navigateByUrl('/auth/login');
      },
      error: (message) => {
        Swal.fire('Error', message, 'error');
        this.blockUILoadData.stop();
      },
    });
  }
}
