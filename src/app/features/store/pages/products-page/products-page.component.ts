import {Component, OnInit} from '@angular/core';
import {HeaderLayoutComponent} from '../../layouts/header-layout/header-layout.component';
import {KeyValuePipe} from '@angular/common';
import {ProductCardComponent} from '../../../../shared/components/product-card/product-card.component';
import {Product, ProductsService} from '../../services/products.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-products-page',
  imports: [
    HeaderLayoutComponent,
    KeyValuePipe,
    ProductCardComponent
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent implements OnInit {
  loading: boolean = false;
  searchProducts: Record<string, Product> = {};
  searchProductsTotalCount: number = 0;

  constructor(private productsService: ProductsService, private router: Router) {
  }

  // On init handler
  async ngOnInit() {
    await this.searchBarClickHandler(this.productsService.searchTerm)
  }

  // Search bar click handler
  async searchBarClickHandler(searchValue: string): Promise<void> {
    // Set the limit and offset
    this.productsService.limit = 10;
    this.productsService.offset = 0;

    // Load the latest products
    this.loading = true;
    if (!searchValue) {
      const latestProducts = await this.productsService.getLatestProducts();
      this.searchProducts = latestProducts.products;
      this.searchProductsTotalCount = latestProducts.total_count;
    } else{
      const searchProducts = await this.productsService.searchProducts({title: searchValue});
      this.searchProducts = searchProducts.products;
      this.searchProductsTotalCount = searchProducts.total_count;
    }
    this.loading = false;
  }

  // Product click handler
  async productClickHandler(productId: string): Promise<void> {
    await this.router.navigate(['/product', productId], {skipLocationChange: false, replaceUrl: true});
  }
}
