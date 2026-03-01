import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './product-grid.html'
})
export class ProductGrid {

  @Input() products: any[] = [];
  @Input() activeFilters: Record<string, any> = {};

  // Products are now filtered by API, so we just display them
  // The activeFilters is kept for potential future use
}
