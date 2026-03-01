import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentreAdminService } from '../../services/centre-admin.service';

@Component({
  selector: 'app-centre-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './centre-dashboard.component.html'
})
export class CentreDashboardComponent implements OnInit {
  dashboard: any = null;
  loading = true;
  error: string | null = null;

  constructor(private centreService: CentreAdminService) {}

  ngOnInit() {
    this.centreService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.error = 'Erreur lors du chargement des données';
        this.loading = false;
      }
    });
  }
}
