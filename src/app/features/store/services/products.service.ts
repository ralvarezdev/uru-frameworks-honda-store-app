import {EventEmitter, Injectable, Output} from '@angular/core';
import {ProductsService as FirebaseProductService} from '../../firebase/services/products.service';

// Product type
export type Product = {
  title: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  brand: string;
  tags: string[];
  image_url: string;
  sku: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  limit: number = 10;
  offset: number = 0;
  myProducts: Record<string, Product> = {};
  myProductsTotalCount: number = 0;
  @Output() myProductsChanged: EventEmitter<{
    products: Record<string, Product>,
    total_count: number
  }> = new EventEmitter();

  constructor(private productsService: FirebaseProductService) {
  }

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

  async getProductById(productId:string) {
    // Get my products from the service
    const response = await this.productsService.getProductById(productId)
    return await response.json()
  }

  // Add product
  async addProduct(product: Product) {
    // Create the product
    await this.productsService.createProduct(
      product.title,
      product.description,
      product.price,
      product.stock,
      product.active,
      product.brand,
      product.tags ?? [],
      product.image_url,
      product.sku
    );

    // Refresh the products
    await this.loadMyProducts();
  }

  // Update product
  async updateProduct(product: {
    product_id: string,
    title?: string,
    description?: string,
    price?: number,
    stock?: number,
    active?: boolean,
    brand?: string,
    tags?: string[],
    image_url?: string,
    sku?: string
  }, refresh: boolean = true) {
    // Update the product
    await this.productsService.updateProduct(product);

    // Refresh the products
    if (refresh) {
      await this.loadMyProducts();
      return
    }

    // Update the product in the list
    if (this.myProducts?.[product.product_id]) {
      const updateKeys = Object.keys(product).filter(key => key !== 'product_id');
      const update: Record<string, any> = {};
      updateKeys.forEach(key => {
        update[key] = product[key as keyof typeof product];
      })

      this.myProducts[product.product_id] = {...this.myProducts[product.product_id], ...update};
      this.myProductsChanged.emit({
        products: this.myProducts,
        total_count: this.myProductsTotalCount
      });
    }
  }

  // Delete product
  async deleteProduct(product_id: string) {
    // Delete the product
    await this.productsService.removeProduct(product_id);

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
