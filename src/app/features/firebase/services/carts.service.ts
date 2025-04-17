import {Injectable} from '@angular/core';
import {AppService} from './app.service';

@Injectable({
  providedIn: 'root',
})
export class CartsService {
  addProductToCartCloudFn: any;
  removeProductFromCartCloudFn: any;
  pdateuProductQuantityInCartCloudFn: any;
  getCartCloudFn: any;
  clearCartCloudFn: any;
  checkoutCartCloudFn: any;

  constructor(private appService: AppService) {
    // Define the callable functions
    this.addProductToCartCloudFn = this.appService.getFunction('add_product_to_cart');
    this.removeProductFromCartCloudFn = this.appService.getFunction('remove_product_from_cart');
    this.pdateuProductQuantityInCartCloudFn = this.appService.getFunction('update_product_quantity_in_cart');
    this.getCartCloudFn = this.appService.getFunction('get_cart');
    this.clearCartCloudFn = this.appService.getFunction('clear_cart');
    this.checkoutCartCloudFn = this.appService.getFunction('checkout_cart');
  }

  // Add a product to the cart
  async addProductToCart(productId: string, quantity: number): Promise<any>{
    return await this.addProductToCartCloudFn({productId, quantity});
  }

  // Remove a product from the cart
  async removeProductFromCart(productId: string): Promise<any> {
    return await this.removeProductFromCartCloudFn({productId});
  }

  async updateProductQuantityInCart(productId: string, quantity: number): Promise<any> {
    return await this.pdateuProductQuantityInCartCloudFn({productId, quantity});
  }

  async getCart(): Promise<any> {
    return await this.getCartCloudFn({});
  }

  async clearCart(): Promise<any> {
    return await this.clearCartCloudFn({});
  }

  async checkoutCart(): Promise<any> {
    return await this.checkoutCartCloudFn({});
  }
}
