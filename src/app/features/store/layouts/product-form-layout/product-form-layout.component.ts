import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {InputComponent} from "../../../../shared/components/input/input.component";
import {HeaderLayoutComponent} from '../header-layout/header-layout.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {clearFormErrors, fileValidator, setFormControlErrors} from '../../../../../utils';
import {AppService} from '../../../firebase/services/app.service';

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
    price: new FormControl<number | null>(this.initialPrice, [Validators.required]),
    stock: new FormControl<number | null>(this.initialStock, [Validators.required]),
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
    fileValidator(['image/png', 'image/jpeg'], 10, true)(this.productForm, this.inputs, 'image');

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
}
