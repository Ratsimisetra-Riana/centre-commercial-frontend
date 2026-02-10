import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filtersSubject = new BehaviorSubject<any>({});
  filters$ = this.filtersSubject.asObservable();

  updateFilters(filters: any) {
    this.filtersSubject.next(filters);
  }

  matchProduct(product: any, filters: Record<string, any>): boolean {

    // no filters → match everything
    if (!filters || Object.keys(filters).length === 0) {
      return true;
    }

    // ONE variant must satisfy ALL filters
    return product.variants.some((variant: any) => {

      return Object.entries(filters).every(([key, filterValue]) => {

        // product-level price
        if (key === 'price') {
          const { min, max } = filterValue;
          if (min != null && product.price < min) return false;
          if (max != null && product.price > max) return false;
          return true;
        }

        const variantValue = variant[key];

        // variant missing attribute
        if (variantValue == null) return false;

        // multi-select (checkbox / select)
        if (Array.isArray(filterValue)) {
          return filterValue.includes(variantValue);
        }

        // range filter
        if (typeof filterValue === 'object') {
          const { min, max } = filterValue;
          if (min != null && variantValue < min) return false;
          if (max != null && variantValue > max) return false;
          return true;
        }

        // single value
        return variantValue === filterValue;
      });

    });
  }
}