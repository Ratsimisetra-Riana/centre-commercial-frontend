import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShopService, Shop } from '../../services/shop.service';

@Component({
  selector: 'app-shop-list-client',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './shop-list-client.component.html'
})
export class ShopListClientComponent implements OnInit {
  shops: Shop[] = [];
  filteredShops: Shop[] = [];
  loading = true;
  error: string | null = null;
  
  // Filters
  searchTerm: string = '';
  selectedFloor: number | null = null;
  minRent: number | null = null;
  maxRent: number | null = null;
  
  // Available floors for filter
  availableFloors: number[] = [];

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.loadShops();
  }

  loadShops(): void {
    this.loading = true;
    this.error = null;
    
    this.shopService.list().subscribe({
      next: (data) => {
        this.shops = data;
        this.filteredShops = data;
        this.extractAvailableFloors();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading shops:', err);
        this.error = 'Impossible de charger les boutiques. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  extractAvailableFloors(): void {
    const floors = new Set<number>();
    this.shops.forEach(shop => {
      if (shop.box?.floor !== undefined) {
        floors.add(shop.box.floor);
      }
    });
    this.availableFloors = Array.from(floors).sort((a, b) => a - b);
  }

  applyFilters(): void {
    this.filteredShops = this.shops.filter(shop => {
      // Search filter
      if (this.searchTerm && !shop.name.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Floor filter
      if (this.selectedFloor !== null && shop.box?.floor !== this.selectedFloor) {
        return false;
      }
      
      // Rent range filter
      if (this.minRent !== null && shop.rent < this.minRent) {
        return false;
      }
      if (this.maxRent !== null && shop.rent > this.maxRent) {
        return false;
      }
      
      return true;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFloorChange(): void {
    this.applyFilters();
  }

  onRentChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFloor = null;
    this.minRent = null;
    this.maxRent = null;
    this.filteredShops = this.shops;
  }

  getFloorLabel(floor: number): string {
    if (floor === -1) return 'Sous-sol';
    if (floor === 0) return 'Rez-de-chaussée';
    return `Étage ${floor}`;
  }

  viewShopDetails(shopId: string): void {
    // Navigation is handled by routerLink in the template
  }
}