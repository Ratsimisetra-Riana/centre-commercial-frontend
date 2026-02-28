import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { ShopAdminService } from '../../services/shop-admin.service';
import { CategoryService, Category } from '../../services/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-shop-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-edit.component.html'
})
export class ShopProductEditComponent implements OnInit {
  id: string | null = null;
  model: any = { name: '', categoryId: null, basePrice: 0, images: [], variants: [] };
  categories: Category[] = [];
  imageInput: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shopAdmin: ShopAdminService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    
    // Load categories
    this.categoryService.list().subscribe((cats: Category[]) => {
      this.categories = cats || [];
      
      // After categories are loaded, load product if editing
      if (this.id && this.id !== 'new') {
        this.productService.getProductsById(this.id).subscribe(
          (product: any) => {
            if (product) {
              this.model = product;
              // Ensure variants array exists and has attributes initialized
              if (!this.model.variants) {
                this.model.variants = [];
              } else if (Array.isArray(this.model.variants)) {
                this.model.variants.forEach((v: any) => {
                  if (!v.attributes) v.attributes = {};
                });
              }
              // Setup images after data is loaded
              this.setupImageInput();
            }
          }
        );
      }
    });
  }

  compareCategories(c1: any, c2: any): boolean {
    return c1?._id === c2?._id;
  }

  setupImageInput() {
    // Convert images array to comma-separated string for textarea
    if (this.model.images && Array.isArray(this.model.images)) {
      this.imageInput = this.model.images.join(', ');
    }
  }

  ngAfterViewInit() {
    // Setup images for new product if in create mode
    if (!this.id || this.id === 'new') {
      this.setupImageInput();
    }
  }

  addVariant() {
    // Ensure variants array exists
    if (!this.model.variants) {
      this.model.variants = [];
    }
    
    const attributes: any = {};
    if (this.model.categoryId?.filters && Array.isArray(this.model.categoryId.filters)) {
      this.model.categoryId.filters.forEach((filter: any) => {
        attributes[filter.key] = '';
      });
    }
    
    this.model.variants.push({ sku: '', stock: 0, attributes, price: undefined });
  }

  removeVariant(index: number) {
    this.model.variants.splice(index, 1);
  }

  save() {
    const shop = this.shopAdmin.getShop();
    /*if (shop)*/ this.model.shopId = '6988b5808102b21db9b20666';
    
    // Convert image input to array
    this.model.images = this.imageInput
      .split(',')
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0);

    if (this.id && this.id !== 'new') {
      this.productService.updateProduct(this.id, this.model).subscribe(
        () => this.router.navigate(['/shop-admin/products'])
      );
    } else {
      this.productService.addProduct(this.model).subscribe(
        () => this.router.navigate(['/shop-admin/products'])
      );
    }
  }

  delete() {
    if (this.id && this.id !== 'new' && confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(this.id).subscribe(
        () => this.router.navigate(['/shop-admin/products'])
      );
    }
  }
}
