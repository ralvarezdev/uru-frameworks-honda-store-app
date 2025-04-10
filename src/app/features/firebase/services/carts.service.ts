import { Injectable } from '@angular/core';
import { getFunctions, httpsCallable, HttpsCallableResult } from "firebase/functions";

// Get the functions instance from Firebase
const functions = getFunctions();

// Define the callable functions
const fireAddProductToCart = httpsCallable(functions, 'addProductToCart');
const fireRemoveProductFromCart = httpsCallable(functions, 'removeProductFromCart');
const fireUpdateProductQuantityInCart = httpsCallable(functions, 'updateProductQuantityInCart');
const fireGetCart = httpsCallable(functions, 'getCart');
const fireClearCart = httpsCallable(functions, 'clearCart');
const fireCheckoutCart = httpsCallable(functions, 'checkoutCart');

@Injectable({
  providedIn: 'root',
})
export class CartsService {
  constructor() {}

  // Add a product to the cart
  async addProductToCart(productId: string, quantity: number): Promise<HttpsCallableResult> {
    return await fireAddProductToCart({ productId, quantity });
  }

  // Remove a product from the cart
  async removeProductFromCart(productId: string): Promise<HttpsCallableResult> {
    return await fireRemoveProductFromCart({ productId });
  }

  async updateProductQuantityInCart(productId: string, quantity: number): Promise<HttpsCallableResult> {
    return await fireUpdateProductQuantityInCart({ productId, quantity });
  }

  async getCart(): Promise<HttpsCallableResult> {
    return await fireGetCart({});
  }

  async clearCart(): Promise<HttpsCallableResult> {
    return await fireClearCart({});
  }

  async checkoutCart(): Promise<HttpsCallableResult> {
    return await fireCheckoutCart({});
  }
}
