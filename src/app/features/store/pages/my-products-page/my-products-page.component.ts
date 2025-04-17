import {Component, OnInit} from '@angular/core';
import {HeaderLayoutComponent} from '../../layouts/header-layout/header-layout.component';
import {ProductsService} from '../../../firebase/services/products.service';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {SearchBarComponent} from '../../../../shared/components/search-bar/search-bar.component';
import {Router} from '@angular/router';
import {ProductCardComponent} from '../../../../shared/components/product-card/product-card.component';
import {KeyValuePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-my-products-page',
  imports: [
    HeaderLayoutComponent,
    ButtonComponent,
    SearchBarComponent,
    ProductCardComponent,
    KeyValuePipe
  ],
  templateUrl: './my-products-page.component.html',
  styleUrl: './my-products-page.component.css'
})
export class MyProductsPageComponent implements OnInit {
  limit: number = 10;
  offset: number = 0;
  myProducts: any[] = [];
  myProductsTotalCount: number = 0;

  constructor(
    private productsService: ProductsService,
    private router: Router,
  ) {}

  async ngOnInit() {
    await this.loadMyProducts()
  }

  // Load my products
  async loadMyProducts() {
    try {
      // Get my products from the service
      const response = await this.productsService.getMyProducts(this.limit, this.offset);
      const body = await response.json()

      this.myProducts = body?.products;
      this.myProductsTotalCount = body?.totalCount;
      console.log('My Products:', this.myProducts);
      console.log('My Products Total Count:', this.myProductsTotalCount);
    } catch (error) {
      console.error('Error fetching my products:', error);
    }
  }

  // On add product handler
  async addProductHandler(): Promise<void> {
    this.router.navigate(['/new-product'], {skipLocationChange: false, replaceUrl: true});
  }

  // On edit product handler
  async editProductHandler(productId: string): Promise<void> {
    console.log('Edit Product', productId);
  }

  // On input handler
  async inputHandler(event: Event): Promise<void> {
    console.log('Input Value:',event);
  }
}
