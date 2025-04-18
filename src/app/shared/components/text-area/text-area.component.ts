import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {LabelComponent} from '../label/label.component';
import {NgStyle} from '@angular/common';
import {ErrorableDirective} from '../../directives/errorable/errorable.directive';

@Component({
  selector: 'app-text-area',
  imports: [
    LabelComponent,
    NgStyle
  ],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true
    },
    {
      provide: ErrorableDirective,
      useExisting: forwardRef(() => TextAreaComponent)
    }
  ],
})
export class TextAreaComponent extends ErrorableDirective implements ControlValueAccessor {
  value: string = '';
  disabled: boolean = false;
  @Input() placeholder: string = 'Please enter a value';
  @Input() label: string = '';
  @Input() required: boolean = false;

  // Write value to the component
  writeValue(value: any): void {
    this.value = value;
  }

  // Register on change method
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Register on touched method
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Set disabled state
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Handle input event
  onInput(event: Event): void {
    const textArea = event.target as HTMLTextAreaElement;
    this.value = textArea.value;
    this.onChange(this.value);
    this.onTouched();
  }

  private onChange: (value: any) => void = () => {
  };

  private onTouched: () => void = () => {
  };
}
