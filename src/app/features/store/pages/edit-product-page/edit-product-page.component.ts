import {Component} from '@angular/core';
import {ProductFormLayoutComponent} from '../../layouts/product-form-layout/product-form-layout.component';

@Component({
  selector: 'app-edit-product-page',
  imports: [
    ProductFormLayoutComponent
  ],
  templateUrl: './edit-product-page.component.html',
  styleUrl: './edit-product-page.component.css'
})
export class EditProductPageComponent {
  title: string = 'Edit Product';
}
