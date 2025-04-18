import {
  EMAIL_NAME,
  FILE_NAME,
  INVALID_EMAIL_ERROR,
  NUMERIC_NAME,
  PASSWORD_NAME,
  REQUIRED_ERROR,
  REQUIRED_NAME
} from "./validators"
import {AbstractControl, FormGroup} from '@angular/forms';
import {QueryList} from '@angular/core';
import {ErrorableDirective} from './app/shared/directives/errorable/errorable.directive';

// Parse form control errors
export function parseFromControlErrors(errors: { [key: string]: any }): string[] {
  const parsedErrors = []
  for (const errorKey of Object.keys(errors)) {
    // Check if the field is required
    if (errorKey === REQUIRED_NAME) {
      parsedErrors.push(REQUIRED_ERROR)
    }

    // Check if the field is about email
    if (errorKey === EMAIL_NAME) {
      parsedErrors.push(INVALID_EMAIL_ERROR)
    }

    // Check if the field is about password
    if (errorKey === PASSWORD_NAME) {
      parsedErrors.push(errors[errorKey])
    }

    // Check if the field is about file
    if (errorKey === FILE_NAME) {
      parsedErrors.push(errors[errorKey])
    }

    // Check if the field is about numeric
    if (errorKey === NUMERIC_NAME) {
      parsedErrors.push(errors[errorKey])
    }
  }
  return parsedErrors
}

// Set form control errors
export function setFormControlErrors(errorableComponent: ErrorableDirective, control: AbstractControl) {
  if (control && control?.errors) {
    const parsedErrors = parseFromControlErrors(control.errors)
    errorableComponent.error = (parsedErrors.length ? parsedErrors[0] : '')
  }
}

// Set form errors
export function setFormErrors(errorableComponents: QueryList<ErrorableDirective>, form: FormGroup) {
  for (const controlKey of Object.keys(form?.controls)) {
    // Get the control and the errorable component
    const control = form.controls[controlKey]
    const errorableComponent = errorableComponents.find(errorableComponent => errorableComponent.id === controlKey)
    if (!errorableComponent) {
      console.warn(`Errorable component not found for control: ${controlKey}`)
      continue
    }

    // Set the error message or clear it
    if (control && control?.errors) {
      setFormControlErrors(errorableComponent, control)
    } else {
      errorableComponent.error = ''
    }
  }
}

// Clear form errors
export function clearFormErrors(errorableComponents: QueryList<ErrorableDirective>,) {
  errorableComponents.forEach(errorableComponent => errorableComponent.error = '')
}
