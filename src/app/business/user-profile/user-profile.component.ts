import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UserProfileService } from './user-profile.service';
import { jwtDecode } from 'jwt-decode';
import { User } from './models/user.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '@shared/services/validators.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserProfileComponent implements OnInit {
  
  public userProfileService = inject(UserProfileService);
  private validatorsService = inject(ValidatorsService);
  private fb = inject(FormBuilder);
  public user = signal<User | null>(null);

  public form: FormGroup = this.fb.group({
    id: [null],
    email: ['', [Validators.required]],
    fullName: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.getUser();
    initFlowbite();
  }

  getUser() {
    const token = localStorage.getItem('token-app-odb') || null;
    
    if (token) {
      const decoded: any = jwtDecode(token);
      const { userId } = decoded;
      if (userId) {
        this.userProfileService.findUser(userId).subscribe(user => {
          this.user.set(user);
          this.form.controls['id'].setValue(this.user()?.id);
          this.form.controls['fullName'].setValue(this.user()?.tenant.fullName);
          this.form.controls['email'].setValue(this.user()?.email);
        });
      }
    }
  }

  getFormErrors() {
    const errores: { [key: string]: any } = {};

    // Recorrer todos los controles del formulario
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);

      // Obtener los errores del control si existen
      if (control?.errors) {
        errores[controlName] = control.errors;
      }
    });

    return errores;
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  getFieldError(field: string) {
    return this.validatorsService.getFieldError(this.form, field);
  }

  onSave() {
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      const errors = this.getFormErrors();
      const errorProperties = [];

      for (const property in errors) {
        errorProperties.push(property);
      }

      Swal.fire(
        'Validation error',
        `Fields: ${errorProperties.join(', ')}`,
        'error'
      );

      console.log(errors);

      return;
    }

    const user: User = this.form.value;

    this.userProfileService.updateUser(user).subscribe((resp: any) => {

      if (resp) {
        Swal.fire('Transaction ok.','Profile updated.','success');
      }
      
    });

  }

  
}
