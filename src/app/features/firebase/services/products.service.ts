import {Injectable} from '@angular/core';
import {AppService} from './app.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  createProductCloudFn: any;
  getProductByIdCloudFn: any;
  updateProductCloudFn: any;
  removeProductCloudFn: any;
  getMyProductsCloudFn: any;
  searchProductsCloudFn: any;
  searchMyProductsCloudFn: any;
  getLatestProductsCloudFn: any;

  constructor(private appService: AppService) {
    // Define the callable functions
    this.createProductCloudFn = this.appService.getFunction('create_product');
    this.getProductByIdCloudFn = this.appService.getFunction('get_product_by_id');
    this.updateProductCloudFn = this.appService.getFunction('update_product');
    this.removeProductCloudFn = this.appService.getFunction('remove_product');
    this.getMyProductsCloudFn = this.appService.getFunction('get_my_products');
    this.searchProductsCloudFn = this.appService.getFunction('search_products');
    this.searchMyProductsCloudFn = this.appService.getFunction('search_my_products');
    this.getLatestProductsCloudFn = this.appService.getFunction('get_latest_products');
  }

  // Create a new product
  async createProduct(title: string, description: string, price: number, stock: number, active: boolean, brand: string, tags: string[], image_url: string, sku: string): Promise<any> {
    return await this.createProductCloudFn({title, description, price, stock, active, brand, tags, image_url, sku});
  }

  // Get a product by ID
  async getProductById(product_id: string): Promise<any> {
    return await this.getProductByIdCloudFn({product_id});
  }

  // Update a product
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
  }): Promise<any> {
    return await this.updateProductCloudFn(product);
  }

  // Remove a product
  async removeProduct(product_id: string): Promise<any> {
    return await this.removeProductCloudFn({product_id});
  }

  // Get my products
  async getMyProducts(limit: number, offset: number): Promise<any> {
    return await this.getMyProductsCloudFn({limit, offset});
  }

  // Search products
  async searchProducts(search: {
    title: string,
    min_price?: number,
    max_price?: number,
    min_stock?: number,
    max_stock?: number,
    min_created_at?: string,
    max_created_at?: string
  }, limit: number, offset: number): Promise<any> {
    return await this.searchProductsCloudFn({...search, limit, offset});
  }

  // Search my products
  async searchMyProducts(title: string, limit: number, offset: number): Promise<any> {
    return await this.searchMyProductsCloudFn({title, limit, offset});
  }

  // Get latest products
  async getLatestProducts(limit: number, offset: number): Promise<any> {
    return await this.getLatestProductsCloudFn({limit, offset});
  }
}
