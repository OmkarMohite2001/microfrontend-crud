import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-reports-dashboard',
  imports: [RouterLink],
  templateUrl: './reports-dashboard.html',
  styleUrl: './reports-dashboard.scss',
})
export class ReportsDashboard {
  private readonly reportsService = inject(ReportsService);

  readonly data = this.reportsService.reports;

  refresh(): void {
    this.reportsService.refresh();
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  }

  calculatePercent(part: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.round((part / total) * 100);
  }
}
