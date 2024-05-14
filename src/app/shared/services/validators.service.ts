import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {
  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public passwordPattern: string = '^(?=.*[A-Z])(?=.*\\d)(?=.*\\W).{8,}$';

  // Validatin Forms

  isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;
    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'min':
          return 'Valor NO Válido ';
        case 'max':
          return 'Valor NO Válido ';
        case 'required':
          return 'Requerido *';
        case 'notValidDate':
          return 'Fecha No Válida';
        case 'notValidPay':
          return 'Valor No Válido';
        case 'email':
          return 'Correo no válido *';
        case 'passwordsMatchValidator':
          return 'Contraseñas NO Coinciden *';
        case 'pattern':
          return 'NO Válido debe tener al menos 6 caracteres un número y una mayúscula';
      }
    }

    return null;
  }

  public dateRangeValidator(dateFrom: string, dateTo: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const dateFromValue = formGroup.get(dateFrom)?.value;
      const dateToValue = formGroup.get(dateTo)?.value;

      if (new Date(dateFromValue) > new Date(dateToValue)) {
        formGroup.get(dateTo)?.setErrors({ notValidDate: true });

        return { notValidDate: true };
      }

      formGroup.get(dateTo)?.setErrors(null);

      return null;
    };
  }

  public operationTypeValidator(
    operationType: string,
    discrepancyResponse: string
  ) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const operationTypeValue = formGroup.get(operationType)?.value;
      const discrepancyResponseValue =
        formGroup.get(discrepancyResponse)?.value;

      if (
        operationTypeValue !== '22' &&
        operationTypeValue !== '32' &&
        !discrepancyResponseValue
      ) {
        formGroup.get(discrepancyResponse)?.setErrors({ required: true });

        return { required: true };
      }

      formGroup.get(discrepancyResponse)?.setErrors(null);

      return null;
    };
  }

  public tipoPersonaValidator(
    tipoPersonaId: string,
    apellido1: string,
    nombre1: string,
    tributaryIdentificationName: string
  ) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const tipoPersonaIdValue = +formGroup.get(tipoPersonaId)?.value;
      const nombre1Value = formGroup.get(nombre1)?.value;
      const apellido1Value = formGroup.get(apellido1)?.value;
      const tributaryIdentificationNameValue = formGroup.get(
        tributaryIdentificationName
      )?.value;

      if (tipoPersonaIdValue === 2 && apellido1Value.trim() === '') {
        formGroup.get(apellido1)?.setErrors({ required: true });
      }
      if (tipoPersonaIdValue === 2 && nombre1Value.trim() === '') {
        formGroup.get(nombre1)?.setErrors({ required: true });
      }
      if (
        tipoPersonaIdValue === 1 &&
        tributaryIdentificationNameValue.trim() === ''
      ) {
        formGroup
          .get(tributaryIdentificationName)
          ?.setErrors({ required: true });
      }

      return null;
    };
  }

  public contratoValidator(
    asignaContratoId: string,
    conceptoSinContratoId: string
  ) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const asignaContratoIdValue = formGroup.get(asignaContratoId)?.value;
      const conceptoSinContratoIdValue = formGroup.get(
        conceptoSinContratoId
      )?.value;

      if (asignaContratoIdValue && !conceptoSinContratoIdValue) {
        formGroup.get(conceptoSinContratoId)?.setErrors(null);
        return null;
      }

      if (!asignaContratoIdValue && conceptoSinContratoIdValue) {
        formGroup.get(asignaContratoId)?.setErrors(null);
        return null;
      }

      if (!asignaContratoIdValue && !conceptoSinContratoIdValue) {
        formGroup.get(asignaContratoId)?.setErrors({ required: true });
        formGroup.get(conceptoSinContratoId)?.setErrors({ required: true });
        return { required: true };
      }

      return null;
    };
  }

  public passwordsMatchValidator(password: string, passwordConfirm: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordValue = formGroup.get(password)?.value;
      const passwordConfirmValue = formGroup.get(passwordConfirm)?.value;

      if (passwordValue !== passwordConfirmValue) {
        formGroup
          .get(passwordConfirm)
          ?.setErrors({ passwordsMatchValidator: true });
        return null;
      }

      formGroup.get(passwordConfirm)?.setErrors(null);
      return null;
    };
  }
}
