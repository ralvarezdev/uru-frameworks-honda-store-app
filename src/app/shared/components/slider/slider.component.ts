import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewEncapsulation,} from '@angular/core';
import {LabelComponent} from '../label/label.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {isPlatformBrowser, NgClass, NgIf} from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  imports: [
    LabelComponent,
    ReactiveFormsModule,
    NgIf,
    NgClass,
  ],
  styleUrl: './slider.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SliderComponent {
  isBrowser: boolean = false;
  @Input() valueControl: FormControl = new FormControl(0);
  @Input() initialValue: number = 0;
  @Input() id: string = '';
  @Input() label: string = 'Slider';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() disabled: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}
