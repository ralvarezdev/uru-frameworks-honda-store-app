import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {InputComponent} from "../../../../shared/components/input/input.component";
import {HeaderLayoutComponent} from '../header-layout/header-layout.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {AppService} from '../../../firebase/services/app.service';
import {fileValidator, numericValidator} from '../../../../../validators';
import {clearFormErrors, setFormControlErrors} from '../../../../../control-forms';

// File validator constants
const IMAGE_ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg'];
const IMAGE_MAX_FILE_SIZE = 10;
const IMAGE_FILE_REQUIRED = true;
const imageValidatorFn = fileValidator(IMAGE_ALLOWED_FILE_TYPES, IMAGE_MAX_FILE_SIZE, IMAGE_FILE_REQUIRED)

// Stock validator constants
const STOCK_MIN_VALUE = 0;
const STOCK_MAX_VALUE = 10000;
const STOCK_STEP = 1;
const stockValidatorFn = numericValidator(STOCK_MIN_VALUE, STOCK_MAX_VALUE, STOCK_STEP)

// Price validator constants
const PRICE_MIN_VALUE = 0;
const PRICE_MAX_VALUE = 10000;
const PRICE_STEP = 0.01;
const priceValidatorFn = numericValidator(PRICE_MIN_VALUE, PRICE_MAX_VALUE, PRICE_STEP)

@Component({
  selector: 'app-product-form-layout',
  imports: [
    InputComponent,
    HeaderLayoutComponent,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './product-form-layout.component.html',
  standalone: true,
  styleUrl: './product-form-layout.component.css'
})
export class ProductFormLayoutComponent {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @Input() title: string = '';
  @Input() initialTitle: string = '';
  @Input() initialDescription: string = '';
  @Input() initialPrice: number | null = null;
  @Input() initialStock: number | null = null;
  @Input() initialBrand: string = '';
  @Input() initialTags: string[] = [];
  @Input() initialImage: string = '';
  @Input() initialSKU: string = '';
  @Input() productForm = new FormGroup({
    title: new FormControl<string>(this.initialTitle, [Validators.required]),
    description: new FormControl<string>(this.initialDescription, [Validators.required]),
    price: new FormControl<number | null>(this.initialPrice, [Validators.required, priceValidatorFn]),
    stock: new FormControl<number | null>(this.initialStock, [Validators.required, stockValidatorFn]),
    brand: new FormControl<string>(this.initialBrand, [Validators.required]),
    // tags: new FormControl<string[]>(this.initialTags, [Validators.required]),
    image: new FormControl<string>(this.initialImage),
    sku: new FormControl<string>(this.initialSKU, [Validators.required]),
  });
  @Output() submitHandler: EventEmitter<string> = new EventEmitter<string>();

  constructor(private appService: AppService) {
  }

  // On submit click
  async onSubmit(event: Event): Promise<void> {
    event.preventDefault()

    // Validate the image
    imageValidatorFn(this.productForm, this.inputs, 'image');

    if (this.productForm?.valid) {
      // Clear previous errors
      clearFormErrors(this.inputs);

      // Upload the image
      const imageInput = this.inputs.find(input => input.id === 'image') as InputComponent;
      const imageFiles = imageInput.files as FileList;
      const imageFile = imageFiles[0];
      const imageUrl = await this.appService.uploadImage(imageFile)

      // On submit
      this.submitHandler.emit(JSON.stringify({
        ...this.productForm.value,
        image: undefined,
        image_url: imageUrl
      }));
    } else {
      console.log('Invalid form', this.productForm)
      setFormControlErrors(this.inputs, this.productForm)
    }
  }

  // Handle Reset Click
  resetHandler(event: Event): void {
    event.preventDefault()
    clearFormErrors(this.inputs);
  }

  protected readonly PRICE_MIN_VALUE = PRICE_MIN_VALUE;
  protected readonly PRICE_STEP = PRICE_STEP;
  protected readonly PRICE_MAX_VALUE = PRICE_MAX_VALUE;
  protected readonly STOCK_MIN_VALUE = STOCK_MIN_VALUE;
  protected readonly STOCK_STEP = STOCK_STEP;
  protected readonly STOCK_MAX_VALUE = STOCK_MAX_VALUE;
}
