import { Injectable } from '@angular/core';
import { getFunctions, httpsCallable, HttpsCallableResult } from "firebase/functions";
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
    // Get the functions instance from Firebase
    const functions = getFunctions();

    // Define the callable functions
    this.fireAddProductToCart = httpsCallable(functions, 'addProductToCart');
    this.fireRemoveProductFromCart = httpsCallable(functions, 'removeProductFromCart');
    this.fireUpdateProductQuantityInCart = httpsCallable(functions, 'updateProductQuantityInCart');
    this.fireGetCart = httpsCallable(functions, 'getCart');
    this.fireClearCart = httpsCallable(functions, 'clearCart');
    this.fireCheckoutCart = httpsCallable(functions, 'checkoutCart');
  }

  // Add a product to the cart
  async addProductToCart(productId: string, quantity: number): Promise<HttpsCallableResult> {
    return await this.fireAddProductToCart({ productId, quantity });
  }

  // Remove a product from the cart
  async removeProductFromCart(productId: string): Promise<HttpsCallableResult> {
    return await this.fireRemoveProductFromCart({ productId });
  }

  async updateProductQuantityInCart(productId: string, quantity: number): Promise<HttpsCallableResult> {
    return await this.fireUpdateProductQuantityInCart({ productId, quantity });
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
