import {Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {InputComponent} from '../input/input.component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    ButtonComponent,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Search...';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() value: string = '';
  @Output() clickHandler: EventEmitter<string> = new EventEmitter<string>();
  @Output() inputHandler: EventEmitter<Event> = new EventEmitter<Event>();

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

  // Handle input event
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();

    // Call the input handler if provided
    if (this.inputHandler)
      this.inputHandler.emit(event);
  }

  // Handle click event
  onClick(event: Event): void {
    this.clickHandler.emit(this.value)
  }

  // Handle keydown event
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onClick(event);
    }
  }

  private onChange: any = () => {
  };

  private onTouched: any = () => {
  };
}
