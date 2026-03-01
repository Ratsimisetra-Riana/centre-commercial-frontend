import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl+'/products';

  products = [
  {
    _id: 'prod_1001',
    shopId: 'shopA',
    categoryId: 'sweat',
    name: 'Women Sweatshirt',
    basePrice: 45,
    images: [
      "products/sweatshirt-woman.jpg",
      "/assets/products/sweat-2.jpg"
    ],
    variants: [
      {
        sku: 'SWT-M-F',
        attributes: { size: 'M', gender: 'female' },
        stock: 6
      }
    ]
  },
  {
    _id: 'prod_1003',
    shopId: 'shopA',
    categoryId: 'sweat',
    name: 'Men Sweatshirt',
    basePrice: 50,
    images: [
      "products/sweatshirt-men.jpg"
    ],
    variants: [
      {
        sku: 'SWT-M-M',
        attributes: { size: 'M', gender: 'male' },
        stock: 4
      }
    ]
  },
  {
    _id: 'prod_1002',
    shopId: 'shopA',
    categoryId: 'sweat',
    name: 'Unisex Hoodie',
    basePrice: 55,
    images: [
      "products/hoodie-unisex.webp",
      "/assets/products/sweat-2.jpg"
    ],      
    variants: [
      { sku: 'HD-S-U', attributes: { size: 'S', gender: 'unisex' }, stock: 3 },
      { sku: 'HD-M-U', attributes: { size: 'M', gender: 'unisex' }, stock: 0 }
    ]
  }
];

  getProducts(): Observable<any> {
    console.log(this.http.get(this.apiUrl));
    return this.http.get(this.apiUrl);
  }

  getProductsById(id): Observable<any> {
    console.log(this.apiUrl + "/" + id);
    return this.http.get(this.apiUrl + "/" + id);
  }

  // Local convenience: get products for a single shop (fallback to mock list)
  getProductsByShop(shopId: string): Observable<any> {
    // prefer backend if available
    try {
      console.log(this.apiUrl + '?shopId=' + shopId);
      return this.http.get(this.apiUrl + '?shopId=' + shopId).pipe(
        map((res: any) => res)
      );
    } catch {
      return of(this.products.filter(p => p.shopId === shopId));
    }
  }

  // Add product (client-side fallback)
  addProduct(product: any): Observable<any> {
    // if backend exists, post
    if (this.http) {
      try {
        console.log(product);
        return this.http.post(this.apiUrl, product);
      } catch {
        // fallthrough
      }
    }
    // fallback: push to local mock list and return observable
    const created = { ...product, _id: 'prod_' + Date.now() };
    this.products.push(created);
    return of(created);
  }

  // Update product
  updateProduct(id: string, product: any): Observable<any> {
    try {
      console.log(`Updating product ${id} with data:`, product);
      return this.http.put(`${this.apiUrl}/${id}`, product);
    } catch {
      // fallback: update local mock list
      const index = this.products.findIndex(p => p._id === id);
      if (index !== -1) {
        this.products[index] = { ...product, _id: id };
      }
      return of({ ...product, _id: id });
    }
  }

  // Delete product
  deleteProduct(id: string): Observable<any> {
    try {
      return this.http.delete(`${this.apiUrl}/${id}`);
    } catch {
      // fallback: remove from local mock list
      this.products = this.products.filter(p => p._id !== id);
      return of({ success: true });
    }
  }

  // Filter products by category and variant attributes
  filterProducts(filters: { categoryId?: string; shopId?: string; [key: string]: any }): Observable<any> {
    // Build query string from filters
    const params = new URLSearchParams();
    if (filters.categoryId) {
      params.set('categoryId', filters.categoryId);
    }
    if (filters.shopId) {
      params.set('shopId', filters.shopId);
    }
    // Add variant attribute filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== 'categoryId' && key !== 'shopId' && value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          // For array values, add each option as a separate param
          value.forEach(v => params.set(key, v));
        } else {
          params.set(key, value);
        }
      }
    });

    const queryString = params.toString();
    const url = queryString ? `${this.apiUrl}/filter?${queryString}` : `${this.apiUrl}/filter`;
    
    try {
      console.log('Filtering products with URL:', url);
      return this.http.get(url);
    } catch {
      // Fallback to local filtering
      return of(this.products.filter(p => {
        if (filters.categoryId && p.categoryId !== filters.categoryId) return false;
        if (filters.shopId && p.shopId !== filters.shopId) return false;
        
        // Check variant attributes
        const variantAttrs = p.variants?.map((v: any) => v.attributes ? Object.fromEntries(v.attributes) : {});
        if (!variantAttrs) return true;
        
        return variantAttrs.some((attrs: any) => {
          return Object.entries(filters).every(([key, value]) => {
            if (key === 'categoryId' || key === 'shopId' || !value) return true;
            return attrs[key] === value;
          });
        });
      }));
    }
  }

}
