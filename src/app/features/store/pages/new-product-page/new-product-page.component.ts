import { Component } from '@angular/core';
import {ProductFormLayoutComponent} from '../../layouts/product-form-layout/product-form-layout.component';

@Component({
  selector: 'app-new-product-page',
  imports: [
    ProductFormLayoutComponent
  ],
  templateUrl: './new-product-page.component.html',
  styleUrl: './new-product-page.component.css'
})
export class NewProductPageComponent {
  title: string = 'New Product';
}
