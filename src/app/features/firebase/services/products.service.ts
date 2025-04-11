// File: src/app/features/firebase/services/products.service.ts
import { Injectable } from '@angular/core';
import { getFunctions, httpsCallable, HttpsCallableResult } from "firebase/functions";
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
    // Get the functions instance from Firebase
    const functions = getFunctions();

    // Define the callable functions
    this.fireCreateProduct = httpsCallable(functions, 'createProduct');
    this.fireGetProducts = httpsCallable(functions, 'getProducts');
    this.fireGetProductById = httpsCallable(functions, 'getProductById');
    this.fireUpdateProduct = httpsCallable(functions, 'updateProduct');
    this.fireRemoveProduct = httpsCallable(functions, 'removeProduct');
  }

  // Create a new product
  async createProduct(title: string, description: string, price: number, stock: number, active: boolean, brand: string, tags: string[]): Promise<HttpsCallableResult> {
    return await this.fireCreateProduct({ title, description, price, stock, active, brand, tags });
  }

  // Get products with pagination
  async getProducts(limit: number, offset: number): Promise<HttpsCallableResult> {
    return await this.fireGetProducts({ limit, offset });
  }

  // Get a product by ID
  async getProductById(productId: string): Promise<HttpsCallableResult> {
    return await this.fireGetProductById({ productId });
  }

  // Update a product
  async updateProduct(productId: string, updates: any): Promise<HttpsCallableResult> {
    return await this.fireUpdateProduct({ productId, updates });
  }

  // Remove a product
  async removeProduct(productId: string): Promise<HttpsCallableResult> {
    return await this.fireRemoveProduct({ productId });
  }
}
