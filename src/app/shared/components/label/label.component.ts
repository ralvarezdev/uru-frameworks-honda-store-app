import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-label',
  imports: [],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LabelComponent {
  @Input() label: string = '';
  @Input() for: string = '';
}
