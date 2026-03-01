import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopAdminService } from '../../services/shop-admin.service';

@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class ShopDashboardComponent implements OnInit {
  dashboard: any = null;
  loading = true;
  error: string | null = null;

  constructor(private shopService: ShopAdminService) {}

  ngOnInit() {
    const shop = this.shopService.getShop();
    if (shop?.id) {
      this.shopService.getDashboard(shop.id).subscribe({
        next: (data) => {
          this.dashboard = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading dashboard:', err);
          this.error = 'Erreur lors du chargement des données';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Aucune boutique trouvée';
      this.loading = false;
    }
  }
}
