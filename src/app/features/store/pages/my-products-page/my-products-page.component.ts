import {Component, OnInit} from '@angular/core';
import {HeaderLayoutComponent} from '../../layouts/header-layout/header-layout.component';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {SearchBarComponent} from '../../../../shared/components/search-bar/search-bar.component';
import {Router} from '@angular/router';
import {ProductCardComponent} from '../../../../shared/components/product-card/product-card.component';
import {KeyValuePipe} from '@angular/common';
import {ProductsService} from '../../services/products.service';

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
  myProducts: any[] = [];
  myProductsTotalCount: number = 0;

  constructor(
    private productsService: ProductsService,
    private router: Router,
  ) {}

  // On init handler
  async ngOnInit() {
    // Subscribe to the products changed
    this.productsService.myProductsChanged.subscribe(({products, total_count}) => {
      this.myProducts = products;
      this.myProductsTotalCount = total_count;
    });

    // Load my products
    await this.productsService.loadMyProducts();
  }

  // On add product handler
  async addProductHandler(): Promise<void> {
    this.router.navigate(['/new-product'], {skipLocationChange: false, replaceUrl: true});
  }

  // On edit product handler
  async editProductHandler(productId: string): Promise<void> {
    console.log('Edit Product', productId);
  }

  // On search click handler
  async searchClickHandler(title:string): Promise<void> {
    // Set limit and offset
    this.productsService.setLimit(10);
    this.productsService.setOffset(0);

    // Filter the product
    if (!title) {
      await this.productsService.loadMyProducts();
      return;
    }
    await this.productsService.searchMyProducts(title);
  }
}
