import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
   imports: [CommonModule,RouterLink], 
  standalone: true,
  templateUrl: './product-card.html'
})
export class ProductCard {
  @Input() product!: any;

  get inStock(): boolean {
    return this.product.variants.some(v => v.stock > 0);
  }

  /**
   * Collect all variant attributes dynamically
   * Excludes sku & stock
   */
  get variantAttributes(): Record<string, string[]> {
    const result: Record<string, Set<string>> = {};

    this.product.variants.forEach(variant => {
      Object.entries(variant).forEach(([key, value]) => {
        if (['sku', 'stock'].includes(key)) return;
        if (value == null) return;

        if (!result[key]) {
          result[key] = new Set();
        }
        result[key].add(String(value));
      });
    });

    // convert Set → array
    return Object.fromEntries(
      Object.entries(result).map(([k, v]) => [k, [...v]])
    );
  }
}
