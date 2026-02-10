import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGrid } from '../../components/product-grid/product-grid';
import { FilterService } from '../../services/filter-service';
import { ProductService } from '../../services/product-service';
@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, ProductGrid],
  templateUrl: './product-page.html'
})
export class ProductPage implements OnInit {

  products: any[] = [];
  activeFilters: Record<string, any> = {};  

  constructor(private filterService: FilterService, private productService: ProductService) {}

  ngOnInit() {
    this.filterService.filters$.subscribe(filters => {
      this.loadProducts(filters);
    });

     this.filterService.filters$.subscribe(filters => {
      this.activeFilters = filters;
    });
  }

  loadProducts(filters: any) {
    // TEMP mock (later replace with backend API)
    /*this.products = this.productService.products.filter(p =>
      !filters.categoryId || p.categoryId === filters.categoryId
    );*/

    this.productService.getProducts().subscribe(data => this.products = data);
  }
}
