import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {ProductsService} from '../../../features/firebase/services/products.service';
import {LabelComponent} from '../label/label.component';
import {NgClass} from '@angular/common';
import {Product, User} from '../../../features/store/services/products.service';

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
  @Input() productId: string = '';
  @Input() product: Product | null = null;
  @Input() showEditActions: boolean = true;
  @Input() selected: boolean = false;
  @Input() type: 'edit' | 'preview' = 'preview';
  @Output() editHandler = new EventEmitter<string>();
  @Output() deleteHandler = new EventEmitter<string>();
  @Output() activeHandler = new EventEmitter<[string, boolean]>();
  @Output() clickHandler = new EventEmitter<string>();

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
    this.activeHandler.emit([this.productId, !this.product?.active]);
  }

  // Click product handler
  onClick() {
    this.clickHandler.emit(this.productId);
  }

  // Get owner name
  get ownerName() {
    const product = this.product as Product
    const owner = product?.owner as User

    if(!owner?.first_name && !owner?.last_name) {
      return '';
    }
    return owner?.first_name + ' ' + owner.last_name;
  }
}
