// shop-detail-client.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShopService, Shop } from '../../services/shop.service';
import { ProductService } from '../../services/product-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-detail-client',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './shop-detail-client.component.html'
})
export class ShopDetailClientComponent implements OnInit {
  shop: Shop | null = null;
  products: any[] = [];
  loading = {
    shop: true,
    products: true
  };
  error: string | null = null;
  selectedImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadShopAndProducts();
  }

  loadShopAndProducts(): void {
    this.loading.shop = true;
    this.loading.products = true;
    this.error = null;
    
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Boutique non trouvée';
      this.loading.shop = false;
      this.loading.products = false;
      return;
    }

    // Load shop details
    this.shopService.get(id).subscribe({
      next: (data) => {
        this.shop = data;
        this.loading.shop = false;
      },
      error: (err) => {
        console.error('Error loading shop:', err);
        this.error = 'Impossible de charger la boutique.';
        this.loading.shop = false;
      }
    });

    // Load shop products
    this.productService.getProductsByShop(id).subscribe({
      next: (data) => {
        this.products = data;
        this.loading.products = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading.products = false;
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getFloorLabel(floor: number): string {
    if (floor === -1) return 'Sous-sol';
    if (floor === 0) return 'Rez-de-chaussée';
    return `Étage ${floor}`;
  }

  getGoogleMapsLink(): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.shop?.name || '')}+centre+commercial`;
  }

  getFirstAvailablePrice(product: any): number {
    return product.basePrice || product.variants?.[0]?.price || 0;
  }

  getProductImage(product: any): string {
    return product.images?.[0] || '/assets/product-placeholder.jpg';
  }

  hasProducts(): boolean {
    return this.products && this.products.length > 0;
  }

  getProductCount(): number {
    return this.products?.length || 0;
  }
}