import {Component} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-text-area',
  imports: [],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.css'
})
export class TextAreaComponent implements ControlValueAccessor {
  // ControlValueAccessor methods
  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
  }

}
