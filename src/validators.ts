import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {QueryList} from '@angular/core';
import {InputComponent} from './app/shared/components/input/input.component';

// Control errors key
export const PASSWORD_NAME = 'password';
export const EMAIL_NAME = 'email';
export const REQUIRED_NAME = 'required';
export const FILE_NAME = 'file';
export const NUMERIC_NAME = 'numeric';

// Control field errors
export const REQUIRED_ERROR = 'Required';
export const INVALID_EMAIL_ERROR = 'Invalid email';

// Password strength validator
export function passwordValidator(minLength: number = 0, minUppercase: number = 0, minLowercase: number = 0, minNumeric: number = 0, minSpecial: number = 0): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Check if the value is less than the minimum length
    if (value.length < minLength) {
      return {[PASSWORD_NAME]: `Must be at least ${minLength} characters long`};
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
    if (uppercaseCount < minUppercase) {
      return {[PASSWORD_NAME]: `Must contain at least ${minUppercase} uppercase letter`};
    }

    // Check if the value contains at least the minimum number of lowercase characters
    if (lowercaseCount < minLowercase) {
      return {[PASSWORD_NAME]: `Must contain at least ${minLowercase} lowercase letter`};
    }

    // Check if the value contains at least the minimum number of numeric characters
    if (numericCount < minNumeric) {
      return {[PASSWORD_NAME]: `Must contain at least ${minNumeric} number`};
    }

    // Check if the value contains at least the minimum number of special characters
    if (specialCount < minSpecial) {
      return {[PASSWORD_NAME]: `Must contain at least ${minSpecial} special character`};
    }

    return null;
  }
}

// File input validator
export function fileValidator(allowedTypes: string[] = [], maxSizeMB: number, isRequired: boolean = false) {
  return (formGroup: FormGroup, inputs: QueryList<InputComponent>, id: string) => {
    const fileInputControl = formGroup.get(id);
    const fileInputComponent = inputs.find(input => input.id === id);

    // Check if the value is a URL
    if (fileInputControl?.value && fileInputControl.value.startsWith('http')) {
      fileInputControl.setErrors(null);
      formGroup.updateValueAndValidity();
      return;
    }

    // Check if the file input component is found
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

// Numeric validator
export function numericValidator(min: number, max: number, step: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = parseFloat(control.value);

    // Check if the value is a number
    if (isNaN(value)) {
      return {[NUMERIC_NAME]: REQUIRED_ERROR};
    }

    // Check if the value is less than the minimum
    if (value < min) {
      return {[NUMERIC_NAME]: `Must be at least ${min}`};
    }

    // Check if the value is greater than the maximum
    if (value > max) {
      return {[NUMERIC_NAME]: `Must be at most ${max}`};
    }

    // Check if the value is a multiple of the step
    if (value / step !== Math.floor(value / step)) {
      return {[NUMERIC_NAME]: `Must be a multiple of ${step}`};
    }

    return null;
  };
}
