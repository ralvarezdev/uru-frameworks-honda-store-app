import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {ProductsService} from '../../../features/firebase/services/products.service';
import {LabelComponent} from '../label/label.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [
    ButtonComponent,
    LabelComponent,
    NgClass,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() price: number | null = null;
  @Input() stock: number | null = null;
  @Input() brand: string = '';
  @Input() tags: string[] = [];
  @Input() imageUrl: string = '';
  @Input() sku: string = '';
  @Input() productId: string = '';
  @Input() active: boolean = true;
  @Input() showActions: boolean = true;
  @Input() selected: boolean = false;
  @Output() editHandler = new EventEmitter<string>();
  @Output() deleteHandler = new EventEmitter<string>();
  @Output() activeHandler = new EventEmitter<[string, boolean]>();

  constructor(private productsService: ProductsService) {
  }

  // Edit product handler
  onEdit() {
    this.editHandler.emit(this.productId);
  }

  // Delete product handler
  onDelete() {
    this.deleteHandler.emit(this.productId);
  }

  // Active product handler
  onActive() {
    this.activeHandler.emit([this.productId, !this.active]);
  }
}
