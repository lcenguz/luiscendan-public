import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../core/dashboard/dashboard.service';

@Component({
    standalone: true,
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss'],
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
})
export class DashboardComponent {
    dashboardService = inject(DashboardService);

    private timeRangeSignal = signal<number | null>(30);
    timeRange = computed(() => this.timeRangeSignal());

    metrics = computed(() => {
        const range = this.timeRange();
        if (range === null) {
            return this.dashboardService.metrics();
        }
        return this.dashboardService.getMetricsForPeriod(range);
    });

    setTimeRange(days: number | null) {
        this.timeRangeSignal.set(days);
    }

    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }

    getPercentage(value: number, total: number): number {
        return total > 0 ? Math.round((value / total) * 100) : 0;
    }
}
