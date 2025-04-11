import {Component, Input, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-link',
  imports: [
    RouterLink
  ],
  templateUrl: './link.component.html',
  styleUrl: './link.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LinkComponent {
  @Input() link: string = '';
}
