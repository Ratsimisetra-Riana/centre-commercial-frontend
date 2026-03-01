import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from '../../services/user.service';
import { Shop, ShopService } from '../../services/shop.service';
import {UserDTO} from "../../dtos/user-dto";

@Component({
  selector: 'app-centre-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-edit.component.html'
})
export class CentreUserEditComponent implements OnInit {
  id: string | null = null;
  model: User = { name: '', email: '', password: '', role: 'client', shopId: null, isActive: true };
  shops: Shop[] = [];
  roles = [
    { value: 'client', label: 'Client' },
    { value: 'shop_admin', label: 'Admin Boutique' },
    { value: 'centre_admin', label: 'Admin Centre' }
  ];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private shopService: ShopService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    
    // Load shops for select
    this.shopService.list().subscribe(shops => {
      this.shops = shops || [];
    });

    if (this.id && this.id !== 'new') {
      this.userService.get(this.id).subscribe(user => {
        if (user) {
          this.model = user;
        }
      });
    }
  }

  save() {
    const payload: any = {
      name: this.model.name,
      email: this.model.email,
      role: this.model.role,
      shopId: this.model.shopId || null,
      isActive: this.model.isActive
    };

    // Only include password if it's being set
    if (this.model.password) {
      payload.password = this.model.password;
    }

    const userToSave = { ...this.model, ...payload } as UserDTO;

    if (this.id && this.id !== 'new') {
        if(this.model.role != 'shop_admin') {
          userToSave.shopId = null; // Ensure shopId is null for non-shop-admins
        }
      this.userService.update(this.id, userToSave).subscribe(() => this.router.navigate(['/centre-admin/users']));
    } else {
        console.log(userToSave);
      this.userService.create(userToSave).subscribe(() => this.router.navigate(['/centre-admin/users']));
    }
  }

  cancel() {
    this.router.navigate(['/centre-admin/users']);
  }
}
