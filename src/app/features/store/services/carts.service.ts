import { Injectable } from '@angular/core';
import {CartsService as FirebaseCartsService} from '../../firebase/services/carts.service';

@Injectable({
  providedIn: 'root'
})
export class CartsService {
  constructor(private cartService: FirebaseCartsService) {
  }

  // Add to cart
  async addToCart(product_id: string, quantity: number=1): Promise<void> {
    await this.cartService.addProductToCart(product_id, quantity);
  }
}
