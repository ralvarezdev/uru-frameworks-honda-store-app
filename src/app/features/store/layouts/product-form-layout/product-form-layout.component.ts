import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {InputComponent} from "../../../../shared/components/input/input.component";
import {HeaderLayoutComponent} from '../header-layout/header-layout.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {AppService} from '../../../firebase/services/app.service';
import {fileValidator, numericValidator} from '../../../../../validators';
import {clearFormErrors, setFormErrors} from '../../../../../control-forms';
import {TextAreaComponent} from '../../../../shared/components/text-area/text-area.component';
import {ErrorableDirective} from '../../../../shared/directives/errorable/errorable.directive';

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
    ButtonComponent,
    TextAreaComponent
  ],
  templateUrl: './product-form-layout.component.html',
  standalone: true,
  styleUrl: './product-form-layout.component.css'
})
export class ProductFormLayoutComponent implements OnInit{
  productForm!: FormGroup<{
    title: FormControl<string | null>;
    description: FormControl<string | null>;
    price: FormControl<number | null>;
    stock: FormControl<number | null>;
    brand: FormControl<string | null>;
    // tags: FormControl<string[] | null>;
    image: FormControl<string | null>;
    sku: FormControl<string | null>
  }>;
  @ViewChildren(ErrorableDirective) errorableComponents!: QueryList<ErrorableDirective>;
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @Input() title: string = '';
  @Input() initialTitle: string = '';
  @Input() initialDescription: string = '';
  @Input() initialPrice: number|null = null;
  @Input() initialStock: number|null = null;
  @Input() initialBrand: string = '';
  // @Input() initialTags: string[] = [];
  @Input() initialImage: string = '';
  @Input() initialSKU: string = '';
  @Output() submitHandler: EventEmitter<string> = new EventEmitter<string>();
  protected readonly PRICE_MIN_VALUE = PRICE_MIN_VALUE;
  protected readonly PRICE_STEP = PRICE_STEP;
  protected readonly PRICE_MAX_VALUE = PRICE_MAX_VALUE;
  protected readonly STOCK_MIN_VALUE = STOCK_MIN_VALUE;
  protected readonly STOCK_STEP = STOCK_STEP;
  protected readonly STOCK_MAX_VALUE = STOCK_MAX_VALUE;
  protected readonly String = String;

  constructor(private appService: AppService) {
  }

  // On init handler
  ngOnInit(): void {
    // Initialize the form
    this.productForm = new FormGroup({
      title: new FormControl<string>(this.initialTitle, [Validators.required]),
      description: new FormControl<string>(this.initialDescription, [Validators.required]),
      price: new FormControl<number|null>(this.initialPrice, [Validators.required, priceValidatorFn]),
      stock: new FormControl<number|null>(this.initialStock, [Validators.required, stockValidatorFn]),
      brand: new FormControl<string>(this.initialBrand, [Validators.required]),
      // tags: new FormControl<string[]>(this.initialTags, [Validators.required]),
      image: new FormControl<string>(this.initialImage, []),
      sku: new FormControl<string>(this.initialSKU, [Validators.required]),
    });
  }

  // On submit click
  async onSubmit(event: Event): Promise<void> {
    event.preventDefault()

    // Validate the image
    imageValidatorFn(this.productForm as FormGroup, this.inputs, 'image');

    if (this.productForm?.valid) {
      // Clear previous errors
      clearFormErrors(this.errorableComponents);

      // Upload the image
      const imageInput = this.errorableComponents.find(errorableComponent => errorableComponent.id === 'image') as InputComponent;
      let imageUrl

      // Check if the image input has files
      if (imageInput.getFiles()) {
        const imageFiles = imageInput.files as FileList;
        const imageFile = imageFiles[0];

        // Upload the image and get the URL
        imageUrl = await this.appService.uploadImage(imageFile)
      } else {
        // If no files, use the existing URL
        imageUrl = imageInput.getUrl()
      }

      // On submit
      this.submitHandler.emit(JSON.stringify({
        ...this.productForm.value,
        image: undefined,
        image_url: imageUrl
      }));
    } else {
      console.log('Invalid form', this.productForm)
      setFormErrors(this.errorableComponents, this.productForm as FormGroup)
    }
  }

  // Handle Reset Click
  resetHandler(event: Event): void {
    event.preventDefault()
    clearFormErrors(this.errorableComponents);
  }
}
