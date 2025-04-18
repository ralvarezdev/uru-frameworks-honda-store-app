import {EventEmitter, Injectable, Output} from '@angular/core';
import { ProductsService as FirebaseProductService} from '../../firebase/services/products.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  limit: number = 10;
  offset: number = 0;
  myProducts: any[] = [];
  myProductsTotalCount: number = 0;
  @Output() myProductsChanged: EventEmitter<{products: any[], total_count: number}> = new EventEmitter();

  constructor(private productsService: FirebaseProductService) {}

  // Set limit
  setLimit(limit: number) {
    this.limit = limit;
  }

  // Set offset
  setOffset(offset: number) {
    this.offset = offset;
  }

  // Load my products
  async loadMyProducts() {
    // Get my products from the service
    const response = await this.productsService.getMyProducts(this.limit, this.offset);
    const body = await response.json()

    this.myProducts = body.products;
    this.myProductsTotalCount = body.total_count;

    // Emit the products
    this.myProductsChanged.emit({
      products: this.myProducts,
      total_count: this.myProductsTotalCount
    });
  }

  // Add product
  async addProduct(title: string, description: string, price: number, stock: number, active:boolean, brand: string, tags: string[], image_url: string, sku: string) {
    // Create the product
    await this.productsService.createProduct(
      title,
      description,
      price,
      stock,
      active,
      brand,
      tags ?? [],
      image_url,
      sku
    );

    // Refresh the products
    await this.loadMyProducts();
  }

  // Search my products
  async searchMyProducts(title: string) {
    // Get my products from the service
    const response = await this.productsService.searchMyProducts(title, this.limit, this.offset);
    const body = await response.json()

    this.myProducts = body.products;
    this.myProductsTotalCount = body.total_count;

    // Emit the products
    this.myProductsChanged.emit({
      products: this.myProducts,
      total_count: this.myProductsTotalCount
    });
  }
}
