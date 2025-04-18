import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {LabelComponent} from '../label/label.component';
import {NgStyle} from '@angular/common';

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
    }
  ],
})
export class TextAreaComponent implements ControlValueAccessor {
  value: string = '';
  disabled: boolean = false;
  @Input() placeholder: string = 'Please enter a value';
  @Input() label: string = '';
  @Input() error: string = '';
  @Input() id: string = '';
  @Input() required: boolean = false;

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Handle input event
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
      this.value = input.value;
      this.onChange(this.value);
      this.onTouched();
  }

  private onChange: (value: any) => void = () => {
  };

  private onTouched: () => void = () => {
  };
}
