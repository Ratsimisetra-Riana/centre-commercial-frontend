import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product-service';

@Component({
  standalone: true,
  selector: 'app-product-details-page',
  imports: [CommonModule],
  templateUrl: './product-details-page.html'
})
export class ProductDetailsPage {

  product: any;
  attributeGroups : any;
  selectedAttributes: Record<string, string> = {};
 

  constructor(private route: ActivatedRoute,private productService: ProductService) {
    const productId = this.route.snapshot.paramMap.get('id');
    this.loadProduct(productId);
  }

  loadProduct(id: string | null) {
    this.productService.getProductsById(id).subscribe(data => {
      this.product = data;
      this.attributeGroups = this.getAttributeGroups();
      console.log(this.attributeGroups);
    });
  }

  getAttributeGroups() {
    const groups: Record<string, Set<string>> = {};
    this.product.variants.forEach(v => {
      Object.entries(v.attributes || {}).forEach(([key, value]) => {
        if (!groups[key]) {
          groups[key] = new Set();
        }
        groups[key].add(value as string);
      });
    });

    return Object.entries(groups).map(([key, values]) => ({
      key,
      options: Array.from(values)
    }));
  }

  
   get selectedVariants() {
    if (!this.product?.variants?.length) return null;

    return this.product.variants.filter(v =>
      Object.entries(this.selectedAttributes).every(
        ([key, value]) => v.attributes?.[key] === value
      )
    );
  }

}
