import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Shop, ShopService, Contact } from '../../services/shop.service';
import { Box, BoxService } from '../../services/box.service';

@Component({
  selector: 'app-centre-shop-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-edit.component.html'
})
export class CentreShopEditComponent implements OnInit {
  id: string | null = null;
  model: Shop = { name: '', box: null, rent: 0, contact: { phone: '', email: '' }, images: [], description: '' };
  boxes: Box[] = [];

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private boxService: BoxService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    
    // Load boxes for select
    this.boxService.list().subscribe(boxes => {
      this.boxes = boxes || [];
    });

    if (this.id && this.id !== 'new') {
      this.shopService.get(this.id).subscribe(shop => {
        if (shop) {
          this.model = shop;
          if (!this.model.contact) this.model.contact = { phone: '', email: '' };
          console.log("subscribed to shop with id", this.model.box);
        }
      });
    } else {
      this.model.contact = { phone: '', email: '' };
    }
  }

  addImage() {
    this.model.images = this.model.images || [];
    this.model.images.push('');
  }

  removeImage(index: number) {
    this.model.images?.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  compareBoxes(b1: any, b2: any): boolean {
    return b1?._id === b2?._id;
  }

  save() {
    // Ensure contact exists
    if (!this.model.contact) {
      this.model.contact = { phone: '', email: '' };
    }
    
    // Filter out empty images
    this.model.images = (this.model.images || []).filter(img => img.trim());

    if (this.id && this.id !== 'new') {
      this.shopService.update(this.id, this.model).subscribe(() => this.router.navigate(['/centre-admin/shops']));
    } else {
      this.shopService.create(this.model).subscribe(() => this.router.navigate(['/centre-admin/shops']));
    }
  }

  cancel() {
    this.router.navigate(['/centre-admin/shops']);
  }
}
