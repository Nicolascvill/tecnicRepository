import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductServicesService } from '../../services/product-services.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-view.component.html',
  styleUrl: './products-view.component.css'
})
export class ProductsViewComponent implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  recordsToShow = 5;
  searchTerm = '';
  constructor(private productService: ProductServicesService, private router: Router) { }

  ngOnInit(): void {
    this.loadingProducts;
    console.log("Products:", this.products)

  }

  loadingProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products.data;
      this.filterProducts();

    });
  }

  filterProducts(): void {
    const filtered = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm)
    );
    this.filteredProducts = filtered.slice(0, this.recordsToShow);
  }

  add(): void {
    this.router.navigate(['/add']);
  }

  onSelectChange(event: Event): void {
    this.recordsToShow = parseInt((event.target as HTMLSelectElement).value, 10);
    this.filterProducts();
  }
}
