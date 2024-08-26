import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ProductServicesService } from '../../services/product-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddProductComponent {
  productForm: FormGroup;
  isEditMode: boolean = false;
  productId!: string;

  constructor(
    private fb: FormBuilder,
    private productService: ProductServicesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [this.uniqueIdValidator(this.productService)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    },{ validators: this.releaseAndRevisionDateValidator() });
  }


  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') ?? ''; 
    if (this.productId) {
      this.isEditMode = true;
      this.productService.getProductById(this.productId).subscribe(data => {
        this.productForm.patchValue(data);
        this.productForm.controls['id'].disable();
      });
    }
  }
  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.getRawValue();
      if (this.isEditMode) {
        this.productService.updateProduct(this.productId, formValue).subscribe({
          next: () => {
            alert('Producto actualizado correctamente');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            this.handleError(err, 'Error al actualizar el producto. Inténtalo nuevamente.');
          }
        });
      } else {
        this.productService.addProduct(formValue).subscribe({
          next: () => {
            alert('Producto agregado correctamente');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            this.handleError(err, 'Error al agregar el producto. Inténtalo nuevamente.');
          }
        });
      }
    } else {
      this.validateAllFormFields(this.productForm);
    }
  }

  private handleError(error: any, userMessage: string): void {
    console.error('Ocurrió un error:', error); 
    alert(userMessage);
  }

  reset(): void {
    this.productForm.reset();
    if (this.isEditMode) {
      this.productService.getProductById(this.productId).subscribe(data => {
        this.productForm.patchValue(data);
      });
    }
    }
  
  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  } 

  releaseAndRevisionDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateRelease = control.get('date_release')?.value;
      const dateRevision = control.get('date_revision')?.value;
  
      if (!dateRelease || !dateRevision) {
        return null;
      }
  
      const releaseDate = new Date(dateRelease);
      const revisionDate = new Date(dateRevision);
  
      // Sumar un año a la fecha de liberación
      const expectedRevisionDate = new Date(releaseDate);
      expectedRevisionDate.setFullYear(releaseDate.getFullYear() + 1);
  
      if (revisionDate.getTime() !== expectedRevisionDate.getTime()) {
        return { revisionDateInvalid: true };
      }
  
      return null;
    };
  }
  uniqueIdValidator(productService: ProductServicesService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const id = control.value;
      if (!id) {
        return of(null);
      }
  
      return productService.verifyProductId(id).pipe(
        map(exists => (exists ? { idExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
