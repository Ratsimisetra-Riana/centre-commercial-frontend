import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Shop, ShopService } from '../../services/shop.service';
import { Box, BoxService } from '../../services/box.service';

@Component({
  selector: 'app-centre-shop-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop-list.component.html'
})
export class CentreShopListComponent implements OnInit {
  shops: Shop[] = [];
  boxes: { [key: string]: Box } = {};
  loading = true;

  constructor(private shopService: ShopService, private boxService: BoxService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.boxService.list().subscribe(boxes => {
      boxes?.forEach(b => { if (b._id) this.boxes[b._id] = b; });
      this.shopService.list().subscribe(shops => {
        this.shops = shops || [];
        this.loading = false;
      });
    });
  }

  getBoxInfo(boxId: string | null | undefined): string {
    if (!boxId) return '—';
    const box = this.boxes[boxId];
    return box ? `${box.code} (Étage ${box.floor})` : boxId;
  }

  delete(id: string | undefined) {
    if (!id) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette boutique ?')) {
      this.shopService.delete(id).subscribe(() => this.loadData());
    }
  }
}
