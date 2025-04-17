import {Injectable} from '@angular/core';
import {httpsCallable, HttpsCallableResult} from "firebase/functions";
import {AppService} from './app.service';

@Injectable({
  providedIn: 'root',
})
export class CartsService {
  fireAddProductToCart: any;
  fireRemoveProductFromCart: any;
  fireUpdateProductQuantityInCart: any;
  fireGetCart: any;
  fireClearCart: any;
  fireCheckoutCart: any;

  constructor(private appService: AppService) {
    // Define the callable functions
    this.fireAddProductToCart = this.appService.getFunction('add_product_to_cart');
    this.fireRemoveProductFromCart = this.appService.getFunction('remove_product_from_cart');
    this.fireUpdateProductQuantityInCart = this.appService.getFunction('update_product_quantity_in_cart');
    this.fireGetCart = this.appService.getFunction('get_cart');
    this.fireClearCart = this.appService.getFunction('clear_cart');
    this.fireCheckoutCart = this.appService.getFunction('checkout_cart');
  }

  // Add a product to the cart
  async addProductToCart(productId: string, quantity: number): Promise<HttpsCallableResult> {
    return await this.fireAddProductToCart({productId, quantity});
  }

  // Remove a product from the cart
  async removeProductFromCart(productId: string): Promise<HttpsCallableResult> {
    return await this.fireRemoveProductFromCart({productId});
  }

  async updateProductQuantityInCart(productId: string, quantity: number): Promise<HttpsCallableResult> {
    return await this.fireUpdateProductQuantityInCart({productId, quantity});
  }

  async getCart(): Promise<HttpsCallableResult> {
    return await this.fireGetCart({});
  }

  async clearCart(): Promise<HttpsCallableResult> {
    return await this.fireClearCart({});
  }

  async checkoutCart(): Promise<HttpsCallableResult> {
    return await this.fireCheckoutCart({});
  }
}
