import {Injectable} from '@angular/core';
import {httpsCallable, HttpsCallableResult} from "firebase/functions";
import {AppService} from './app.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  fireCreateProduct: any;
  fireGetProducts: any;
  fireGetProductById: any;
  fireUpdateProduct: any;
  fireRemoveProduct: any;

  constructor(private appService: AppService) {
    // Define the callable functions
    this.fireCreateProduct = this.appService.getFunction('create_product');
    this.fireGetProducts = this.appService.getFunction('get_products');
    this.fireGetProductById = this.appService.getFunction('get_product_by_id');
    this.fireUpdateProduct = this.appService.getFunction('update_product');
    this.fireRemoveProduct = this.appService.getFunction('remove_product');
  }

  // Create a new product
  async createProduct(title: string, description: string, price: number, stock: number, active: boolean, brand: string, tags: string[], image_url: string): Promise<HttpsCallableResult> {
    return await this.fireCreateProduct({title, description, price, stock, active, brand, tags, image_url});
  }

  // Get products with pagination
  async getProducts(limit: number, offset: number): Promise<HttpsCallableResult> {
    return await this.fireGetProducts({limit, offset});
  }

  // Get a product by ID
  async getProductById(productId: string): Promise<HttpsCallableResult> {
    return await this.fireGetProductById({productId});
  }

  // Update a product
  async updateProduct(productId: string, title: string, description: string, price: number, stock: number, active: boolean, brand: string, tags: string[], image_url: string): Promise<HttpsCallableResult> {
    return await this.fireUpdateProduct({productId, title, description, price, stock, active, brand, tags, image_url});
  }

  // Remove a product
  async removeProduct(productId: string): Promise<HttpsCallableResult> {
    return await this.fireRemoveProduct({productId});
  }
}
