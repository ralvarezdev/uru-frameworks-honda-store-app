import {Injectable} from '@angular/core';
import {AppService} from './app.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  createProductCloudFn: any;
  getProductsCloudFn: any;
  getProductByIdCloudFn: any;
  updateProductCloudFn: any;
  removeProductCloudFn: any;
  getMyProductsCloudFn: any;

  constructor(private appService: AppService) {
    // Define the callable functions
    this.createProductCloudFn = this.appService.getFunction('create_product');
    this.getProductsCloudFn = this.appService.getFunction('get_products');
    this.getProductByIdCloudFn = this.appService.getFunction('get_product_by_id');
    this.updateProductCloudFn = this.appService.getFunction('update_product');
    this.removeProductCloudFn = this.appService.getFunction('remove_product');
    this.getMyProductsCloudFn = this.appService.getFunction('get_my_products');
  }

  // Create a new product
  async createProduct(title: string, description: string, price: number, stock: number, active: boolean, brand: string, tags: string[], image_url: string, sku: string): Promise<any> {
    return await this.createProductCloudFn({title, description, price, stock, active, brand, tags, image_url, sku});
  }

  // Get products with pagination
  async getProducts(limit: number, offset: number): Promise<any> {
    return await this.getProductsCloudFn({limit, offset});
  }

  // Get a product by ID
  async getProductById(productId: string): Promise<any> {
    return await this.getProductByIdCloudFn({productId});
  }

  // Update a product
  async updateProduct(productId: string, title: string, description: string, price: number, stock: number, active: boolean, brand: string, tags: string[], image_url: string, sku:string): Promise<any> {
    return await this.updateProductCloudFn({productId, title, description, price, stock, active, brand, tags, image_url, sku});
  }

  // Remove a product
  async removeProduct(productId: string): Promise<any> {
    return await this.removeProductCloudFn({productId});
  }

  // Get my products
  async getMyProducts(limit: number, offset: number): Promise<any> {
    return await this.getMyProductsCloudFn({limit, offset});
  }
}
