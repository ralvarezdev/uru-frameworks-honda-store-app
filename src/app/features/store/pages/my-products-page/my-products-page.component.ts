import {Component, OnInit} from '@angular/core';
import {HeaderLayoutComponent} from '../../layouts/header-layout/header-layout.component';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {SearchBarComponent} from '../../../../shared/components/search-bar/search-bar.component';
import {Router} from '@angular/router';
import {ProductCardComponent} from '../../../../shared/components/product-card/product-card.component';
import {KeyValuePipe} from '@angular/common';
import {Product, ProductsService} from '../../services/products.service';
import {ModalComponent} from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-my-products-page',
  imports: [
    HeaderLayoutComponent,
    ButtonComponent,
    SearchBarComponent,
    ProductCardComponent,
    KeyValuePipe,
    ModalComponent
  ],
  templateUrl: './my-products-page.component.html',
  styleUrl: './my-products-page.component.css'
})
export class MyProductsPageComponent implements OnInit {
  myProducts: Record<string, Product> = {};
  myProductsTotalCount: number = 0;
  loading: boolean = false;
  isDeleteProductModalOpen: boolean = false;
  isUpdateActiveProductModalOpen: boolean = false;
  selectedProductId: string = '';
  updateActive: boolean = false;

  constructor(
    private productsService: ProductsService,
    private router: Router,
  ) {
  }

  // On init handler
  async ngOnInit() {
    // Subscribe to the products changed
    this.productsService.myProductsChanged.subscribe(({products, total_count}) => {
      this.myProducts = products;
      this.myProductsTotalCount = total_count;
    });

    // Load my products
    this.loading = true;
    await this.productsService.loadMyProducts();
    this.loading = false;
  }

  // Add product handler
  async addProductHandler(): Promise<void> {
    await this.router.navigate(['/new-product'], {skipLocationChange: false, replaceUrl: true});
  }

  // Open delete product modal handler
  async openDeleteModalHandler(productId: string): Promise<void> {
    this.selectedProductId = productId;
    this.isDeleteProductModalOpen = true;
  }

  // Close delete product modal handler
  async closeDeleteModalHandler(): Promise<void> {
    this.isDeleteProductModalOpen = false;
    this.selectedProductId = '';
  }

  // Delete product confirmation handler
  async deleteProductHandler(): Promise<void> {
    await this.productsService.deleteProduct(this.selectedProductId);
    this.isDeleteProductModalOpen = false;
    this.selectedProductId = '';
  }

  // Edit product handler
  async editHandler(productId: string): Promise<void> {
    await this.router.navigate(['/edit-product', productId], {skipLocationChange: false, replaceUrl: true});
  }

  // Open update active product modal handler
  async openUpdateActiveModalHandler([productId, active]: [string, boolean]): Promise<void> {
    this.isUpdateActiveProductModalOpen = true;
    this.selectedProductId = productId;
    this.updateActive = active;
  }

  // Close update active product modal handler
  async closeUpdateActiveModalHandler(): Promise<void> {
    this.isUpdateActiveProductModalOpen = false;
    this.selectedProductId = '';
  }

  // Update active product confirmation handler
  async updateActiveProductHandler(): Promise<void> {
    await this.productsService.updateProduct({product_id: this.selectedProductId, active: this.updateActive}, false);
    this.isUpdateActiveProductModalOpen = false;
    this.selectedProductId = '';
  }

  // On search click handler
  async searchClickHandler(title: string): Promise<void> {
    // Set limit and offset
    this.productsService.setLimit(10);
    this.productsService.setOffset(0);

    // Clear products
    this.myProducts = {};
    this.myProductsTotalCount = 0;
    this.loading = true;

    // Filter the product
    if (!title) {
      await this.productsService.loadMyProducts();
    } else {
      await this.productsService.searchMyProducts(title);
    }
    this.loading = false;
  }

  // Product click handler
  async productClickHandler(productId: string): Promise<void> {
    await this.router.navigate(['/product', productId], {skipLocationChange: false, replaceUrl: true});
  }
}
