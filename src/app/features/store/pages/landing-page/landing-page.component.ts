import {Component, OnInit} from '@angular/core';
import {HeaderLayoutComponent} from '../../layouts/header-layout/header-layout.component';
import {KeyValuePipe} from "@angular/common";
import {ProductCardComponent} from "../../../../shared/components/product-card/product-card.component";
import {Product, ProductsService} from '../../services/products.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing-page',
    imports: [
        HeaderLayoutComponent,
        KeyValuePipe,
        ProductCardComponent,
    ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {
  loading: boolean = false;
  latestProducts: Record<string, Product> = {};
  latestProductsTotalCount: number = 0;

  constructor(private productsService: ProductsService, private router: Router) {
  }

  // On init handler
  async ngOnInit() {
    // Set the limit and offset
    this.productsService.limit = 5;
    this.productsService.offset = 0;

    // Load the latest products
    this.loading = true;
    const {products, total_count} = await this.productsService.getLatestProducts();
    this.latestProducts = products;
    this.latestProductsTotalCount = total_count;
    this.loading = false;
  }

  // Product click handler
  async productClickHandler(productId: string): Promise<void> {
    await this.router.navigate(['/product', productId], {skipLocationChange: false, replaceUrl: true});
  }
}
