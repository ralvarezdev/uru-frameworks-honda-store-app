import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductFormLayoutComponent} from './product-form-layout.component';

describe('ProductLayoutComponent', () => {
  let component: ProductFormLayoutComponent;
  let fixture: ComponentFixture<ProductFormLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormLayoutComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductFormLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
