// shop-products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { ShopService, Shop } from '../../services/shop.service';

@Component({
  selector: 'app-shop-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop-products.component.html'
})
export class ShopProductsComponent implements OnInit {
  shopId: string;
  shop: Shop | null = null;
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  selectedCategory: string | null = null;
  
  loading = {
    shop: true,
    products: true
  };
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private productService: ProductService
  ) {
    this.shopId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadShop();
    this.loadProducts();
  }

  loadShop(): void {
    this.shopService.get(this.shopId).subscribe({
      next: (data) => {
        this.shop = data;
        this.loading.shop = false;
      },
      error: (err) => {
        console.error('Error loading shop:', err);
        this.loading.shop = false;
      }
    });
  }

  loadProducts(): void {
    this.loading.products = true;
    this.productService.getProductsByShop(this.shopId).subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.extractCategories();
        this.totalItems = data.length;
        this.loading.products = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading.products = false;
      }
    });
  }

  extractCategories(): void {
    const catMap = new Map();
    this.products.forEach(product => {
      if (product.categoryId && !catMap.has(product.categoryId)) {
        catMap.set(product.categoryId, {
          id: product.categoryId,
          name: product.categoryId // You might want to map to actual category names
        });
      }
    });
    this.categories = Array.from(catMap.values());
  }

  filterByCategory(categoryId: string | null): void {
    this.selectedCategory = categoryId;
    if (!categoryId) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.categoryId === categoryId);
    }
    this.totalItems = this.filteredProducts.length;
    this.currentPage = 1;
  }

  getPaginatedProducts(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }

  getPageCount(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getFirstAvailablePrice(product: any): number {
    return product.basePrice || product.variants?.[0]?.price || 0;
  }

  getProductImage(product: any): string {
    return product.images?.[0] || '/assets/product-placeholder.jpg';
  }

  getCategoryName(categoryId: string): string {
    // You can enhance this to get actual category names from a service
    console.log('Getting category name for ID:', categoryId);
    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  }
}