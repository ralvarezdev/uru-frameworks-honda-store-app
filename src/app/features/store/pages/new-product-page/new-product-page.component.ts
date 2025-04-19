import {Component} from '@angular/core';
import {ProductFormLayoutComponent} from '../../layouts/product-form-layout/product-form-layout.component';
import {Router} from '@angular/router';
import {ProductsService} from '../../services/products.service';

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
  async submitHandler(formValues: any) {
    // Get the form values
    const {title, description, price, stock, brand, tags, image_url, sku} = JSON.parse(formValues);

    // Create the product
    await this.productsService.addProduct(
      {
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        active: true,
        brand,
        tags: tags ?? [],
        image_url,
        sku
      }
    );

    // Redirect to the products page
    await this.router.navigateByUrl('/my-products', {skipLocationChange: false, replaceUrl: true});
  }
}
