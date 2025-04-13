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
    const functions = appService.functions;

    // Define the callable functions
    this.fireAddProductToCart = httpsCallable(functions, 'add_product_to_cart');
    this.fireRemoveProductFromCart = httpsCallable(functions, 'remove_product_from_cart');
    this.fireUpdateProductQuantityInCart = httpsCallable(functions, 'update_product_quantity_in_cart');
    this.fireGetCart = httpsCallable(functions, 'get_cart');
    this.fireClearCart = httpsCallable(functions, 'clear_cart');
    this.fireCheckoutCart = httpsCallable(functions, 'checkout_cart');
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
