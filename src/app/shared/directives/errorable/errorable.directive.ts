import {Directive, Input} from '@angular/core';

@Directive()
export abstract class ErrorableDirective {
  @Input() error: string = '';
  @Input() id: string = '';

  // Shared method
  hasError(): boolean {
    return !!this.error;
  }
}
