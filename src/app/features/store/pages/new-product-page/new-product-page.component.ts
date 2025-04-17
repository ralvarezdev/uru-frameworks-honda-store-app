import { Component } from '@angular/core';
import {ProductFormLayoutComponent} from '../../layouts/product-form-layout/product-form-layout.component';
import {Router} from '@angular/router';
import {ProductsService} from '../../../firebase/services/products.service';

@Component({
  selector: 'app-new-product-page',
  imports: [
    ProductFormLayoutComponent
  ],
  templateUrl: './new-product-page.component.html',
  standalone: true,
  styleUrl: './new-product-page.component.css'
})
export class NewProductPageComponent {
  title: string = 'New Product';

  constructor(private router: Router, private productsService: ProductsService) {
  }

  // Submit handler
  submitHandler = async (formValues: any) => {
    // Get the form values
    console.log('Form Values', formValues)
    const {title, description, price, stock, brand, tags, image, sku} = formValues;

    // Create the product
    await this.productsService.createProduct(
      title,
      description,
      price,
      stock,
      true,
      brand,
      tags,
      image,
      sku
    );

    // Redirect to the products page
    this.router.navigateByUrl('/products', {skipLocationChange: false, replaceUrl: true});
  }
}
