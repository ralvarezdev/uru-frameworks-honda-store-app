import {Component, forwardRef, Inject, Input, PLATFORM_ID, signal, ViewEncapsulation} from '@angular/core';
import {isPlatformBrowser, NgClass, NgStyle} from '@angular/common';
import {ButtonComponent} from '../button/button.component';
import {LabelComponent} from '../label/label.component';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [
    NgStyle,
    ButtonComponent,
    LabelComponent,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  isBrowser: boolean = false;
  passwordVisibility = signal<boolean>(true)
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = 'Please enter a value';
  @Input() required: boolean = false;
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() error: string = '...';
  @Input() showError: boolean = false;
  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  // Toggle password visibility
  togglePasswordVisibility(event: Event) {
    if (this.isBrowser) {
      this.passwordVisibility.update(prevPasswordVisibility => !prevPasswordVisibility)
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
