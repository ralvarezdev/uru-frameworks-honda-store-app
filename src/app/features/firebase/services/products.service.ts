// File: src/app/features/firebase/services/products.service.ts
import { Injectable } from '@angular/core';
import { getFunctions, httpsCallable, HttpsCallableResult } from "firebase/functions";

// Get the functions instance from Firebase
const functions = getFunctions();

// Define the callable functions
const fireCreateProduct = httpsCallable(functions, 'createProduct');
const fireGetProducts = httpsCallable(functions, 'getProducts');
const fireGetProductById = httpsCallable(functions, 'getProductById');
const fireUpdateProduct = httpsCallable(functions, 'updateProduct');
const fireRemoveProduct = httpsCallable(functions, 'removeProduct');

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor() {}

  // Create a new product
  async createProduct(title: string, description: string, price: number, stock: number, active: boolean, brand: string, tags: string[]): Promise<HttpsCallableResult> {
    return await fireCreateProduct({ title, description, price, stock, active, brand, tags });
  }

  // Get products with pagination
  async getProducts(limit: number, offset: number): Promise<HttpsCallableResult> {
    return await fireGetProducts({ limit, offset });
  }

  // Get a product by ID
  async getProductById(productId: string): Promise<HttpsCallableResult> {
    return await fireGetProductById({ productId });
  }

  // Update a product
  async updateProduct(productId: string, updates: any): Promise<HttpsCallableResult> {
    return await fireUpdateProduct({ productId, updates });
  }

  // Remove a product
  async removeProduct(productId: string): Promise<HttpsCallableResult> {
    return await fireRemoveProduct({ productId });
  }
}
