import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule],
  templateUrl: './category-list.html',
  standalone: true
})
export class CategoryList {
  @Output() categorySelected = new EventEmitter<any>();

 categories: any[] = [
  {
    _id: 'electronics',
    name: 'Electronics',
    parent: null,
    filters: [
      { key: 'brand', type: 'select', options: ['Apple', 'Samsung', 'Sony'] }
    ],
    children: [
      {
        _id: 'smartphones',
        name: 'Smartphones',
        parent: 'electronics',
        filters: [
          { key: 'os', type: 'select', options: ['iOS', 'Android'] }
        ],
        children: [
          {
            _id: 'gaming-phones',
            name: 'Gaming Phones',
            parent: 'smartphones',
            filters: [
              { key: 'ram', type: 'select', options: ['6GB', '8GB', '12GB'] }
            ]
          }
        ]
      },
      {
        _id: 'laptops',
        name: 'Laptops',
        parent: 'electronics',
        filters: [
          { key: 'processor', type: 'select', options: ['i5', 'i7', 'i9'] }
        ]
      }
    ]
  },
  {
    _id: 'clothing',
    name: 'Clothing',
    parent: null,
    filters: [
      { key: 'size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'] }
    ],
    children: [
      {
        _id: 'men',
        name: 'Men',
        parent: 'clothing',
        filters: [
          { key: 'style', type: 'select', options: ['casual', 'formal'] }
        ]
      },
      {
        _id: 'women',
        name: 'Women',
        parent: 'clothing',
        filters: [
          { key: 'style', type: 'select', options: ['casual', 'party'] }
        ]
      }
    ]
  }
];


  currentLevel: any[] = [];
  parentsStack: any[] = [];

  

  ngOnInit() {
    // show top-level categories initially
    this.currentLevel = this.categories.filter(c => c.parent === null);
  }

  selectCategory(category: any) {
    // emit selected category
    this.categorySelected.emit(category);

    // push to stack if it has children
    if (category.children && category.children.length > 0) {
      this.parentsStack.push(category);
      this.currentLevel = category.children;
    } else {
      // leaf node selected, no further children
      this.currentLevel = [];
    }
  }

  // optional: go back to parent level
  goBack() {
    this.parentsStack.pop();
    const parent = this.parentsStack[this.parentsStack.length - 1];
    this.currentLevel = parent
      ? parent.children || []
      : this.categories.filter(c => c.parent === null);
  }
}
