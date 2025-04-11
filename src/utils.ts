// Parse form control errors
import {AbstractControl, FormGroup} from '@angular/forms';
import {QueryList} from '@angular/core';
import {InputComponent} from './app/shared/components/input/input.component';

export function parseFromControlErrors(errors: { [key: string]: any }): string[] {
  const parsedErrors = []
  for (const errorKey of Object.keys(errors)) {
    // Check if the field is required
    if (errorKey === 'required') {
      parsedErrors.push('Required')
    }

    // Check if the field is about the length
    if (errorKey === 'minlength') {
      parsedErrors.push(`Minimum length is ${errors[errorKey]?.requiredLength}`)
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
      return
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
  console.log(1111)
  inputs.forEach(input => {
    console.log(input)
    input.error = ''
    input.showError = false
  })
}
