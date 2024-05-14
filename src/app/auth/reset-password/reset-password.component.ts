import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { ValidatorsService } from '@shared/services/validators.service';
import { BlockUIModule, BlockUI, NgBlockUI } from 'ng-block-ui';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BlockUIModule],
  templateUrl: './reset-password.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResetPasswordComponent implements OnInit {
  @BlockUI('load-data') blockUILoadData!: NgBlockUI;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private authService = inject(AuthService);
  private validatorsService = inject(ValidatorsService);
  private token: string | null = null;

  public form: FormGroup = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(this.validatorsService.passwordPattern),
        ],
      ],
      passwordConfirm: ['', [Validators.required]],
    },
    {
      validators: [
        this.validatorsService.passwordsMatchValidator(
          'password',
          'passwordConfirm'
        ),
      ],
    }
  );

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.token = params.get('token');
    });
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  getFieldError(field: string) {
    return this.validatorsService.getFieldError(this.form, field);
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password } = this.form.value;

    // Hci80084362//-+++

    this.blockUILoadData.start('Procesando solicitud ...');
    this.authService
      .resetPassword(password, this.token!)
      .pipe(
        catchError(() => {
          this.blockUILoadData.stop();
          return of({ ok: false });
        })
      )
      .subscribe((resp) => {
        if (resp.ok) {
          Swal.fire(
            'Restaurar contraseña',
            `Contraseña restaurada satisfactoriamente.`,
            'success'
          );
          this.router.navigateByUrl('/auth/login');
        }
        this.blockUILoadData.stop();
      });

    // this.authService.passwordRestore(username, email)
    //   .subscribe({
    //     // next: () => this.router.navigateByUrl('/dashboard'),
    //     error: (message) => {

    //       Swal.fire('Error', message, 'error' )

    //     }
    //   })
  }
}
