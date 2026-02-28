import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { ShopAdminService } from '../../services/shop-admin.service';

@Component({
  selector: 'app-shop-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html'
})
export class ShopProductListComponent {
  products: any[] = [];

  constructor(private ps: ProductService, private shop: ShopAdminService) {
    const s = this.shop.getShop();
    if (s) this.ps.getProductsByShop(s.id).subscribe((p: any) => this.products = p || []);
  }

  inStock(p: any) {
    return (p.variants || []).some((v: any) => v.stock > 0);
  }

  delete(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.ps.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter(p => p._id !== id);
      });
    }
  }
}
