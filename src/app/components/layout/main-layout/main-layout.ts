import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';
import {  NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.html',
  imports: [
    Navbar,
    Sidebar,
    Footer,
    RouterOutlet,
    CommonModule,
    NgClass
  ]
})
export class MainLayout {
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
