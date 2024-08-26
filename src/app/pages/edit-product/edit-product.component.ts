import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServicesService } from '../../services/product-services.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {

  @Input() product: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductServicesService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe(data => {
        this.product = data;
      });
    }
  }

  onEdit(): void {
    this.router.navigate(['/edit', this.product.id]);
  }



}
