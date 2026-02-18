import { Injectable, computed } from '@angular/core';
import { FileService } from '../files/file.service';
import { AuthService } from '../auth/auth.service';

export interface DashboardMetrics {
    files: {
        total: number;
        active: number;
        deleted: number;
    };
    users: {
        total: number;
        admins: number;
        managers: number;
        users: number;
        active: number;
        blocked: number;
    };
    storage: {
        totalBytes: number;
        avgPerUser: number;
    };
    topOwners: Array<{ userId: string; userName: string; count: number; bytes: number }>;
    recentActivity: Array<{ date: string; count: number }>;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

    constructor(
        private fileService: FileService,
        private authService: AuthService
    ) { }

    metrics = computed<DashboardMetrics>(() => {
        const files = this.fileService.files();
        const users = this.authService.getAllUsers();

        const fileMetrics = {
            total: files.length,
            active: files.filter(f => f.status === 'ACTIVE').length,
            deleted: files.filter(f => f.status === 'DELETED').length,
        };

        const userMetrics = {
            total: users.length,
            admins: users.filter(u => u.role === 'ADMIN').length,
            managers: users.filter(u => u.role === 'MANAGER').length,
            users: users.filter(u => u.role === 'USER').length,
            active: users.filter(u => u.isActive).length,
            blocked: users.filter(u => u.loginBlocked).length,
        };

        const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
        const storageMetrics = {
            totalBytes,
            avgPerUser: users.length > 0 ? totalBytes / users.length : 0,
        };

        const ownerCounts = new Map<string, { count: number; bytes: number; name: string }>();
        files.forEach(f => {
            if (!ownerCounts.has(f.owner)) {
                const user = users.find(u => u.id === f.owner);
                ownerCounts.set(f.owner, {
                    count: 0,
                    bytes: 0,
                    name: user?.displayName || 'Desconocido',
                });
            }
            const data = ownerCounts.get(f.owner)!;
            data.count++;
            data.bytes += f.size;
        });

        const topOwners = Array.from(ownerCounts.entries())
            .map(([userId, data]) => ({
                userId,
                userName: data.name,
                count: data.count,
                bytes: data.bytes,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const recentActivity = this.getRecentActivity(files);

        return {
            files: fileMetrics,
            users: userMetrics,
            storage: storageMetrics,
            topOwners,
            recentActivity,
        };
    });

    private getRecentActivity(files: any[]): Array<{ date: string; count: number }> {
        const today = new Date();
        const activity: Array<{ date: string; count: number }> = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const count = files.filter(f => {
                const createdDate = new Date(f.createdAt).toISOString().split('T')[0];
                return createdDate === dateStr;
            }).length;

            activity.push({ date: dateStr, count });
        }

        return activity;
    }

    /**
     * Retorna métricas filtradas por período (días)
     */
    getMetricsForPeriod(days: number): DashboardMetrics {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoff = cutoffDate.toISOString();

        const allFiles = this.fileService.files();
        const files = allFiles.filter(f => f.createdAt >= cutoff);
        const users = this.authService.getAllUsers();

        const fileMetrics = {
            total: files.length,
            active: files.filter(f => f.status === 'ACTIVE').length,
            deleted: files.filter(f => f.status === 'DELETED').length,
        };

        const userMetrics = {
            total: users.length,
            admins: users.filter(u => u.role === 'ADMIN').length,
            managers: users.filter(u => u.role === 'MANAGER').length,
            users: users.filter(u => u.role === 'USER').length,
            active: users.filter(u => u.isActive).length,
            blocked: users.filter(u => u.loginBlocked).length,
        };

        const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
        const storageMetrics = {
            totalBytes,
            avgPerUser: users.length > 0 ? totalBytes / users.length : 0,
        };

        const ownerCounts = new Map<string, { count: number; bytes: number; name: string }>();
        files.forEach(f => {
            const existing = ownerCounts.get(f.owner) || { count: 0, bytes: 0, name: '' };
            existing.count++;
            existing.bytes += f.size;
            if (!existing.name) {
                const user = users.find(u => u.id === f.owner);
                existing.name = user?.displayName || 'Desconocido';
            }
            ownerCounts.set(f.owner, existing);
        });

        const topOwners = Array.from(ownerCounts.entries())
            .map(([userId, data]) => ({ userId, userName: data.name, count: data.count, bytes: data.bytes }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const activity: Array<{ date: string; count: number }> = [];
        const today = new Date();
        for (let i = Math.min(days - 1, 6); i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const count = files.filter(f => {
                const createdDate = new Date(f.createdAt).toISOString().split('T')[0];
                return createdDate === dateStr;
            }).length;

            activity.push({ date: dateStr, count });
        }

        return {
            files: fileMetrics,
            users: userMetrics,
            storage: storageMetrics,
            topOwners,
            recentActivity: activity,
        };
    }
}
