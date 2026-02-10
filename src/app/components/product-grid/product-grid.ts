import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter-service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './product-grid.html'
})
export class ProductGrid implements OnChanges {

  @Input() products: any[] = [];
  @Input() activeFilters: Record<string, any> = {};

  filteredProducts: any[] = [];

  constructor(private filterService: FilterService) {}

  ngOnChanges() {
    this.filteredProducts = this.products.filter(p =>
      this.filterService.matchProduct(p, this.activeFilters)
    );
  }
}
