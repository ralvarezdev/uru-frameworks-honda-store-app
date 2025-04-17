import {ErrorHandler, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  error = signal<Error | null>(null);

  handleError(error: Error): void {
    // Handle the error here
    console.error('An error occurred:', error.message);
    // You can also log the error to an external service or show a user-friendly message
  }
}
