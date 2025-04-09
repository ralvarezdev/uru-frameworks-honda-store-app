import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {SliderComponent} from '../slider/slider.component';
import {TimeService} from '../../../features/clocks/services/time/time.service';
import {NgClass} from '@angular/common';
import {ButtonComponent} from '../button/button.component';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-time-slider',
  imports: [
    SliderComponent,
    NgClass,
    ButtonComponent
  ],
  templateUrl: './time-slider.component.html',
  styleUrl: './time-slider.component.css',
  encapsulation: ViewEncapsulation.None
})
export class TimeSliderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  hourSliderValue: FormControl = new FormControl(0);
  minuteSliderValue: FormControl = new FormControl(0);
  secondSliderValue: FormControl = new FormControl(0);
  @Input() id = '';

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    // Subscribe to FormControl value changes
    this.subscriptions.push(
      this.hourSliderValue.valueChanges.subscribe(value => this.timeService.hours = value),
      this.minuteSliderValue.valueChanges.subscribe(value => this.timeService.minutes = value),
      this.secondSliderValue.valueChanges.subscribe(value => this.timeService.seconds = value)
    );

    // Set the initial state
    this.setInitialState();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Set the initial state
  setInitialState(): void {
    // Update FormControl values when signals change
    this.hourSliderValue.setValue(0, { emitEvent: false });
    this.minuteSliderValue.setValue(0, { emitEvent: false });
    this.secondSliderValue.setValue(0, { emitEvent: false });
  }

  // On Reset
  onReset(event: Event) {
    this.timeService.reset()
    this.setInitialState()
  }
}
