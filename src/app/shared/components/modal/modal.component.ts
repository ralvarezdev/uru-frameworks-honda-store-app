import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-modal',
  imports: [
    ButtonComponent
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() isOpen: boolean = false;
  @Output() closeHandler: EventEmitter<Event> = new EventEmitter<Event>();
  protected readonly event = event;

  // On close modal handler
  onClose(event: Event) {
    this.closeHandler.emit(event);
  }
}
