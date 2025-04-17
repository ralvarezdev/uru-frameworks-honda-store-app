import {AbstractControl, FormGroup, ValidationErrors} from '@angular/forms';
import {QueryList} from '@angular/core';
import {InputComponent} from './app/shared/components/input/input.component';

// Control errors key
const PASSWORD_NAME = 'password';
const EMAIL_NAME = 'email';
const REQUIRED_NAME = 'required';
const FILE_NAME = 'file';

// Constants for password validation
const MINIMUM_PASSWORD_LENGTH = 6;
const MINIMUM_PASSWORD_UPPERCASE_CHARACTERS = 1;
const MINIMUM_PASSWORD_LOWERCASE_CHARACTERS = 1;
const MINIMUM_PASSWORD_NUMERIC_CHARACTERS = 1;
const MINIMUM_PASSWORD_SPECIAL_CHARACTERS = 1;

// Control field errors
const REQUIRED_ERROR = 'Required';
const INVALID_EMAIL_ERROR = 'Invalid email';
const MINIMUM_PASSWORD_LENGTH_ERROR = `Minimum length is ${MINIMUM_PASSWORD_LENGTH}`;
const MINIMUM_PASSWORD_UPPERCASE_CHARACTERS_ERROR = `Must contain at least ${MINIMUM_PASSWORD_UPPERCASE_CHARACTERS} uppercase letter`;
const MINIMUM_PASSWORD_LOWERCASE_CHARACTERS_ERROR = `Must contain at least ${MINIMUM_PASSWORD_LOWERCASE_CHARACTERS} lowercase letter`;
const MINIMUM_PASSWORD_NUMERIC_CHARACTERS_ERROR = `Must contain at least ${MINIMUM_PASSWORD_NUMERIC_CHARACTERS} number`;
const MINIMUM_PASSWORD_SPECIAL_CHARACTERS_ERROR = `Must contain at least ${MINIMUM_PASSWORD_SPECIAL_CHARACTERS} special character`;

// Password strength validator
export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  // Check if the value is less than the minimum length
  if (value.length < MINIMUM_PASSWORD_LENGTH) {
    return {[PASSWORD_NAME]: MINIMUM_PASSWORD_LENGTH_ERROR};
  }

  // Counters
  let uppercaseCount = 0;
  let lowercaseCount = 0;
  let numericCount = 0;
  let specialCount = 0;

  // Iterate through the characters in the value
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (/[A-Z]/.test(char))
      uppercaseCount++;
    else if (/[a-z]/.test(char))
      lowercaseCount++;
    else if (/\d/.test(char))
      numericCount++;
    else if (/[^A-Za-z0-9]/.test(char))
      specialCount++;
  }

  // Check if the value contains at least the minimum number of uppercase characters
  if (uppercaseCount < MINIMUM_PASSWORD_UPPERCASE_CHARACTERS) {
    return {[PASSWORD_NAME]: MINIMUM_PASSWORD_UPPERCASE_CHARACTERS_ERROR};
  }

  // Check if the value contains at least the minimum number of lowercase characters
  if (lowercaseCount < MINIMUM_PASSWORD_LOWERCASE_CHARACTERS) {
    return {[PASSWORD_NAME]: MINIMUM_PASSWORD_LOWERCASE_CHARACTERS_ERROR};
  }

  // Check if the value contains at least the minimum number of numeric characters
  if (numericCount < MINIMUM_PASSWORD_NUMERIC_CHARACTERS) {
    return {[PASSWORD_NAME]: MINIMUM_PASSWORD_NUMERIC_CHARACTERS_ERROR};
  }

  // Check if the value contains at least the minimum number of special characters
  if (specialCount < MINIMUM_PASSWORD_SPECIAL_CHARACTERS) {
    return {[PASSWORD_NAME]: MINIMUM_PASSWORD_SPECIAL_CHARACTERS_ERROR};
  }

  return null
}

// File input validator
export function fileValidator(allowedTypes: string[] = [], maxSizeMB: number, isRequired: boolean = false) {
  return (formGroup: FormGroup, inputs: QueryList<InputComponent>, id: string) => {
    const fileInputControl = formGroup.get(id);
    const fileInputComponent = inputs.find(input => input.id === id);
    const file = fileInputComponent?.files?.[0];

    // Clear the errors
    fileInputControl?.setErrors(null);

    if (!file) {
      if (isRequired) {
        fileInputControl?.setErrors({[REQUIRED_NAME]: REQUIRED_ERROR});
      }
      formGroup.updateValueAndValidity();
      return
    }

    const isValidType = allowedTypes.includes(file.type);
    const isValidSize = file.size <= maxSizeMB * 1024 * 1024;

    if (!isValidType) {
      fileInputControl?.setErrors({[FILE_NAME]: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`});
    }

    if (!isValidSize) {
      fileInputControl?.setErrors({[FILE_NAME]: `File size exceeds ${maxSizeMB} MB`});
    }

    formGroup.updateValueAndValidity();
  };
}

// Parse form control errors
export function parseFromControlErrors(errors: { [key: string]: any }): string[] {
  const parsedErrors = []
  for (const errorKey of Object.keys(errors)) {
    // Check if the field is required
    if (errorKey === REQUIRED_NAME) {
      parsedErrors.push(REQUIRED_ERROR)
    }

    // Check if the field is about the email
    if (errorKey === EMAIL_NAME) {
      parsedErrors.push(INVALID_EMAIL_ERROR)
    }

    // Check if the field is about the password
    if (errorKey === PASSWORD_NAME) {
      parsedErrors.push(errors[errorKey])
    }

    // Check if the field is about the file
    if (errorKey === FILE_NAME) {
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
