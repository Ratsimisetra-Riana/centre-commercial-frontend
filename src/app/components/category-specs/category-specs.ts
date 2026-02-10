import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-specs',
  standalone: true,
  templateUrl: './category-specs.html',
  imports: [CommonModule]
})
export class CategorySpecs {

  @Input() category!: any;
  @Output() filtersChanged = new EventEmitter<Record<string, any>>();

  selectedFilters: Record<string, any> = {};

  onSelectChange(key: string, value: string) {
    this.selectedFilters[key] = value;
    this.emitFilters();
  }

  onCheckboxChange(key: string, option: string, checked: boolean) {
    const current = this.selectedFilters[key] || [];
    this.selectedFilters[key] = checked ? [...current, option] : current.filter((o: string) => o !== option);
    this.emitFilters();
  }

  onRangeChange(key: string, value: number) {
    this.selectedFilters[key] = value;
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChanged.emit(this.selectedFilters);
  }
}
