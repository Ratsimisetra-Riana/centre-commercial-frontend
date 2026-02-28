import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { ShopAdminService } from '../../services/shop-admin.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-shop-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html'
})
export class ShopAddProductComponent {
  model: any = { name: '', categoryId: null, basePrice: 0, images: [], variants: [] };
  imageInput: string = '';
  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private shopAdmin: ShopAdminService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    // Load categories on init
    this.categoryService.list().subscribe((cats: Category[]) => {
      this.categories = cats || [];
    });
  }

  compareCategories(c1: any, c2: any): boolean {
    return c1?._id === c2?._id;
  }

  addVariant() {
    const attributes: any = {};
    if (this.model.categoryId?.filters) {
      this.model.categoryId.filters.forEach(filter => {
        attributes[filter.key] = '';
      });
    }
    this.model.variants.push({ sku: '', stock: 0, attributes, price: undefined });
  }

  removeVariant(index: number) {
    this.model.variants.splice(index, 1);
  }

  submit() {
    const shop = this.shopAdmin.getShop();
    if (shop) this.model.shopId = shop.id;
    
    // Convert image input to array
    this.model.images = this.imageInput
      .split(',')
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0);
    
    this.productService.addProduct(this.model).subscribe(() => this.router.navigate(['/shop-admin/products']));
  }
}
