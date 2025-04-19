import {Component, OnInit} from '@angular/core';
import {HeaderLayoutComponent} from '../../layouts/header-layout/header-layout.component';
import {Product, ProductsService, User} from '../../services/products.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LabelComponent} from '../../../../shared/components/label/label.component';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {CartsService} from '../../../firebase/services/carts.service';
import {AuthService} from '../../../firebase/services/auth.service';

@Component({
  selector: 'app-product-page',
  imports: [
    HeaderLayoutComponent,
    LabelComponent,
    ButtonComponent,
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {
  loading: boolean = false;
  productId: string = '';
  product: Product|null = null;
  isOwner: boolean = false;

  constructor(private productsService: ProductsService, private cartsService: CartsService, protected authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  // On init handler
  async ngOnInit() {
    // Get the product ID from the route
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') || '';
    });

    // Load the latest product
    this.loading = true;
    this.product = await this.productsService.getProductById(this.productId);

    // Check if the owner is the current user
    this.isOwner= await this.authService.getUserId() === this.getOwnerId();

    this.loading = false;
  }

  // Add to cart handler
  async addToCartHandler(event: Event): Promise<void> {
    await this.cartsService.addProductToCart(this.productId, 1);
  }

  // Get owner ID
  getOwnerId(): string {
    const product = this.product as Product;
    const owner = product.owner as User;

    if (!owner?.uid) {
      return '';
    }
    return owner.uid;
  }

  // Get owner name
  getOwnerName(): string {
    const product = this.product as Product;
    const owner = product.owner as User;

    if (!owner?.first_name || !owner?.last_name) {
      return '';
    }
    return owner.first_name + ' ' + owner.last_name;
  }

  // Edit product handler
  async editProductHandler(event: Event): Promise<void> {
    await this.router.navigate(['/edit-product', this.productId], {skipLocationChange: false, replaceUrl: true});
  }
}
