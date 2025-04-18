import {
  EMAIL_NAME,
  FILE_NAME,
  INVALID_EMAIL_ERROR,
  NUMERIC_NAME,
  PASSWORD_NAME,
  REQUIRED_ERROR,
  REQUIRED_NAME
} from "./validators"
import {InputComponent} from './app/shared/components/input/input.component';
import {AbstractControl, FormGroup} from '@angular/forms';
import {QueryList} from '@angular/core';

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

// Set form input errors
export function setFormInputErrors(inputComponent: InputComponent, control: AbstractControl) {
  if (control && control?.errors) {
    const parsedErrors = parseFromControlErrors(control.errors)
    inputComponent.error = (parsedErrors.length ? parsedErrors[0] : '')
    inputComponent.showError = true
  }
}

// Set form control errors
export function setFormControlErrors(inputs: QueryList<InputComponent>, form: FormGroup) {
  for (const controlKey of Object.keys(form?.controls)) {
    // Get the control and input component
    const control = form.controls[controlKey]
    const inputComponent = inputs.find(input => input.id === controlKey)
    if (!inputComponent) {
      console.warn(`Input component with ID ${controlKey} not found`)
      continue
    }

    // Set the error message or clear it
    if (control && control?.errors) {
      setFormInputErrors(inputComponent, control)
    } else {
      inputComponent.error = ''
      inputComponent.showError = false
    }
  }
}

// Clear form errors
export function clearFormErrors(inputs: QueryList<InputComponent>) {
  inputs.forEach(input => {
    input.error = ''
    input.showError = false
  })
}
