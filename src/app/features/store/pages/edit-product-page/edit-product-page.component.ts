import {Component, OnInit} from '@angular/core';
import {ProductFormLayoutComponent} from '../../layouts/product-form-layout/product-form-layout.component';
import {Product, ProductsService} from '../../services/products.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-product-page',
  imports: [
    ProductFormLayoutComponent
  ],
  templateUrl: './edit-product-page.component.html',
  styleUrl: './edit-product-page.component.css'
})
export class EditProductPageComponent implements OnInit {
  title: string = 'Edit Product';
  productId!: string;
  product: Product | null = null;
  loading: boolean = false;

  constructor(private productsService: ProductsService,private route: ActivatedRoute, private router: Router) {
  }

  // On init handler
  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') || '';
    });

    // Check if the product is loaded
    if (this.productsService.myProducts[this.productId]) {
      this.product = this.productsService.myProducts[this.productId];
      return;
    }

    // Load the product
    this.loading = true;
    this.product = (await this.productsService.getProductById(this.productId)).product;
    this.loading = false;
  }

  // Submit handler
  async submitHandler(formValues: any) {
    // Get the form values
    const {title, description, price, stock, brand, image_url, sku} = JSON.parse(formValues);
    // const {title, description, price, stock, brand, tags, image_url, sku} = JSON.parse(formValues);

    // Compare the form values with the product values
    const compareMapping = {
      title: [this.product?.title, title],
      description: [this.product?.description, description],
      price: [this.product?.price, parseFloat(price)],
      stock: [this.product?.stock, parseInt(stock)],
      brand: [this.product?.brand, brand],
      // tags: [this.product?.tags, tags],
      image_url: [this.product?.image_url, image_url],
      sku: [this.product?.sku, sku]
    }
    const update: Record<string, any> ={}
    for (const key in compareMapping) {
      if (compareMapping[key as keyof typeof compareMapping][0] !== compareMapping[key as keyof typeof compareMapping][1]) {
        update[key] = compareMapping[key as keyof typeof compareMapping][1];
      }
    }

    // Check if there's something to update
    if (Object.keys(update).length === 0) {
      console.log('No changes detected');
    } else {
      // Update the product
      await this.productsService.updateProduct({
        product_id: this.productId,
        ...update
      });
    }

    // Redirect to the products page
    await this.router.navigateByUrl('/my-products', {skipLocationChange: false, replaceUrl: true});
  }
}
