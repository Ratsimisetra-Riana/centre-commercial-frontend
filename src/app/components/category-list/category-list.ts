import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule],
  templateUrl: './category-list.html',
  standalone: true
})
export class CategoryList implements OnInit {
  @Output() categorySelected = new EventEmitter<Category | null>();

  categories: Category[] = [];
  currentLevel: Category[] = [];
  parentsStack: Category[] = [];
  selectedCategoryId: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    // Load categories from API
    this.categoryService.hierarchisedList().subscribe(cats => {
      this.categories = cats || [];
      // Show top-level categories initially
      this.currentLevel = this.categories.filter(c => !c.parent || (c.parent && !c.parent._id));
    });
  }

  selectCategory(category: Category) {
    // Emit the category selection - this filters products immediately
    this.selectedCategoryId = category._id || null;
    this.categorySelected.emit(category);

    // If category has children, navigate into them
    if (category.children && category.children.length > 0) {
      this.parentsStack.push(category);
      this.currentLevel = category.children;
    }
    // If no children, it's a leaf category - stay on current level
  }

  // Go back to parent level
  goBack() {
    this.parentsStack.pop();
    const parent = this.parentsStack[this.parentsStack.length - 1];
    this.currentLevel = parent
      ? parent.children || []
      : this.categories.filter(c => !c.parent || (c.parent && !c.parent._id));
    
    // Update selected - go back to parent category selection
    if (parent) {
      this.selectedCategoryId = parent._id || null;
      // Emit parent as selected when going back
      this.categorySelected.emit(parent);
    } else {
      this.selectedCategoryId = null;
      // Emit null when going back to top level (all products)
      this.categorySelected.emit(null);
    }
  }
  
  // Clear selection and go back to top level
  clearSelection() {
    this.selectedCategoryId = null;
    this.parentsStack = [];
    this.currentLevel = this.categories.filter(c => !c.parent || (c.parent && !c.parent._id));
    this.categorySelected.emit(null);
  }

  // Check if category is selected
  isSelected(category: Category): boolean {
    return this.selectedCategoryId === category._id;
  }

  // Check if category has children
  hasChildren(category: Category): boolean {
    return !!(category.children && category.children.length > 0);
  }
}
