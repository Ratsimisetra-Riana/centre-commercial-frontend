import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGrid } from '../../components/product-grid/product-grid';
import { FilterService } from '../../services/filter-service';
import { ProductService } from '../../services/product-service';
import { CategoryService, Category } from '../../services/category.service';
import { CategorySpecs } from '../category-specs/category-specs';
import { CategoryList } from '../category-list/category-list';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, ProductGrid, CategorySpecs, CategoryList],
  templateUrl: './product-page.html'
})
export class ProductPage implements OnInit {

  products: any[] = [];
  activeFilters: Record<string, any> = {};  
  selectedCategory: Category | null = null;
  categories: Category[] = [];

  constructor(
    private filterService: FilterService, 
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    // Load categories
    this.categoryService.list().subscribe(cats => {
      console.log(cats);
      this.categories = cats || [];
    });

    // Subscribe to filter changes
    this.filterService.filters$.subscribe(filters => {
      this.activeFilters = filters;
      this.loadProducts();
    });

    // Initial load
    this.loadProducts();
  }

  loadProducts() {
    // Build filters object from activeFilters
    const filters: any = {};
    
    if (this.activeFilters['categoryId']) {
      filters['categoryId'] = this.activeFilters['categoryId'];
    }
    
    // Add variant attribute filters (excluding categoryId)
    Object.entries(this.activeFilters).forEach(([key, value]) => {
      if (key !== 'categoryId' && value !== undefined && value !== null && value !== '') {
        filters[key] = value;
      }
    });

    // Use filter API if there are filters, otherwise get all products
    if (Object.keys(filters).length > 0) {
      this.productService.filterProducts(filters).subscribe(data => {
        this.products = data || [];
      });
    } else {
      this.productService.getProducts().subscribe(data => this.products = data || []);
    }
  }

  onCategorySelected(category: any) {
    this.selectedCategory = category;
    
    // Update categoryId in filters
    const newFilters = { ...this.activeFilters, categoryId: category?._id };
    this.filterService.updateFilters(newFilters);
  }

  onFiltersChanged(filters: Record<string, any>) {
    // Keep the categoryId and add/update variant filters
    const newFilters = { 
      ...this.activeFilters,
      ...filters 
    };
    this.filterService.updateFilters(newFilters);
  }

  clearFilters() {
    this.selectedCategory = null;
    this.filterService.updateFilters({});
  }

  hasVariantFilters(): boolean {
    // Check if there are any filters besides categoryId
    return Object.keys(this.activeFilters).some(key => key !== 'categoryId' && this.activeFilters[key]);
  }
}
