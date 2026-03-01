import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User, UserService } from '../../services/user.service';
import { Shop, ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-centre-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html'
})
export class CentreUserListComponent implements OnInit {
  users: User[] = [];
  shops: { [key: string]: Shop } = {};
  loading = true;

  constructor(private userService: UserService, private shopService: ShopService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.shopService.list().subscribe(shops => {
      shops?.forEach(s => { if (s._id) this.shops[s._id] = s; });
      this.userService.list().subscribe(users => {
        this.users = users || [];
        this.loading = false;
      });
    });
  }

  getShopName(shopId: string | null | undefined): string {
    if (!shopId) return '—';
    const shop = this.shops[shopId];
    return shop ? shop.name : shopId;
  }

  getRoleLabel(role: string): string {
    const roles: { [key: string]: string } = {
      'client': 'Client',
      'shop-admin': 'Admin Boutique',
      'centre-admin': 'Admin Centre'
    };
    return roles[role] || role;
  }

  delete(id: string | undefined) {
    if (!id) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.delete(id).subscribe(() => this.loadData());
    }
  }
}
