import {Component, forwardRef, Inject, Input, PLATFORM_ID, signal, ViewEncapsulation} from '@angular/core';
import {isPlatformBrowser, NgStyle} from '@angular/common';
import {ButtonComponent} from '../button/button.component';
import {LabelComponent} from '../label/label.component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {ErrorableDirective} from '../../directives/errorable/errorable.directive';

@Component({
  selector: 'app-input',
  imports: [
    NgStyle,
    ButtonComponent,
    LabelComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    },
    {
      provide: ErrorableDirective,
      useExisting: forwardRef(() => InputComponent)
    }
  ]
})
export class InputComponent extends ErrorableDirective implements ControlValueAccessor {
  isBrowser: boolean = false;
  imagePreview: string = '';
  passwordVisibility = signal<boolean>(false)
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = 'Please enter a value';
  @Input() required: boolean = false;
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() files: FileList | null = null;
  @Input() step: number = 1;
  @Input() min: number = 0;
  @Input() max: number = 100;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    super();
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  // Toggle password visibility
  togglePasswordVisibility(event: Event) {
    if (this.isBrowser) {
      this.passwordVisibility.update(prevPasswordVisibility => !prevPasswordVisibility)
    }
  }

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
    if (this.type !== 'file') {
      const input = event.target as HTMLInputElement;
      this.value = input.value;
      this.onChange(this.value);
      this.onTouched();
      // console.log('Input of ID', this.id, 'changed to:', this.value);
    } else {
      // Handle file input
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };

        reader.readAsDataURL(file);

        // Set the file to the component
        this.files = input.files;
      }
    }
  }

  // Handle file input click
  triggerFileInput(): void {
    const fileInput = document.getElementById(this.id) as HTMLInputElement;
    fileInput.click();
  }

  private onChange: (value: any) => void = () => {
  };

  private onTouched: () => void = () => {
  };
}
