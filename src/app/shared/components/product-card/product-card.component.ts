import {Component, Input} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {ProductsService} from '../../../features/firebase/services/products.service';
import {LabelComponent} from '../label/label.component';

@Component({
  selector: 'app-product-card',
  imports: [
    ButtonComponent,
    LabelComponent,
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

  constructor(private productsService: ProductsService) {
  }

  // Edit product handler
  editProductHandler() {
    console.log('Edit product handler');
  }

  // Delete product handler
  async deleteProductHandler() {
    // Remove the product from the document
    const productCard = document.getElementById(this.productId);
    if (productCard) {
      productCard.remove();
    }
    await this.productsService.removeProduct(this.productId);
  }

  // Toggle active
  async toggleActiveHandler() {
    this.active = !this.active;
    await this.productsService.updateProduct({product_id: this.productId, active: this.active})
  }
}
