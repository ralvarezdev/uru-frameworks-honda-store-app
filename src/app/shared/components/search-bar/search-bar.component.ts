import {Component, forwardRef, Input, ViewEncapsulation} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {NgClass} from '@angular/common';
import {InputComponent} from '../input/input.component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    ButtonComponent,
    NgClass
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  encapsulation: ViewEncapsulation.None,
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
  private onChange: any = () => {};
  private onTouched: any = () => {};

  // Click event handler
  onClick(event: Event) {
    console.log('Search button clicked', event);
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
