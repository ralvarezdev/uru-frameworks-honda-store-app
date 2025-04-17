import {Component, EventEmitter, Inject, Input, Output, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {LOGO_HEIGHT, LOGO_WIDTH} from '../../../../../constants';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {LinkComponent} from '../../../../shared/components/link/link.component';

@Component({
  selector: 'app-auth-layout',
  imports: [
    NgOptimizedImage,
    ButtonComponent,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    LinkComponent,
  ],
  templateUrl: './auth-layout.component.html',
  standalone: true,
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  isBrowser: boolean = false;
  @Input() title: string = '';
  @Input() link: string = '';
  @Input() linkText: string = '';
  @Input() formGroup!: FormGroup;
  @Output() submitHandler: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() resetHandler: EventEmitter<Event> = new EventEmitter<Event>();
  logoHeight: number = LOGO_HEIGHT;
  logoWidth: number = LOGO_WIDTH;
  logoLink: string = '/';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Emit submit event
  onSubmit(event: Event) {
    if (this.isBrowser) {
      event.preventDefault()
      this.submitHandler.emit(event);
    }
  }

  // Emit reset event
  onReset(event: Event): void {
    if (this.isBrowser) {
      event.preventDefault();
      this.resetHandler.emit(event);
    }
  }
}
