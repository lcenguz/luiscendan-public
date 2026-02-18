import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AuditService } from '../../core/audit/audit.service';
import { AuditFilters } from '../../core/audit/audit.models';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    standalone: true,
    selector: 'app-audit',
    templateUrl: './audit.html',
    styleUrls: ['./audit.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
})
export class AuditComponent {
    auditService = inject(AuditService);
    authService = inject(AuthService);

    filters = signal<AuditFilters>({});

    filteredEvents = computed(() => {
        const f = this.filters();
        return Object.keys(f).length > 0
            ? this.auditService.filter(f)
            : this.auditService.events();
    });

    applyFilter(key: keyof AuditFilters, value: any) {
        this.filters.update(f => ({ ...f, [key]: value || undefined }));
    }

    clearFilters() {
        this.filters.set({});
    }

    exportCSV() {
        const events = this.filteredEvents();
        this.auditService.exportToCSV(events);

        const user = this.authService.currentUser();
        if (user) {
            this.auditService.logExportCSV(user.id, user.displayName, events.length);
        }
    }

    exportJSON() {
        const events = this.filteredEvents();
        this.auditService.exportToJSON(events);

        const user = this.authService.currentUser();
        if (user) {
            this.auditService.logExportJSON(user.id, user.displayName, events.length);
        }
    }

    formatDate(iso: string): string {
        return new Date(iso).toLocaleString();
    }

    getActionIcon(action: string): string {
        const icons: Record<string, string> = {

            'CREATE': 'add_circle',
            'UPDATE': 'edit',
            'DELETE': 'delete',
            'RESTORE': 'restore',

            'UPLOAD': 'cloud_upload',
            'DOWNLOAD': 'cloud_download',
            'VIEW': 'visibility',
            'RENAME': 'drive_file_rename_outline',
            'MOVE': 'drive_file_move',

            'ARCHIVE': 'archive',
            'UNARCHIVE': 'unarchive',
            'TRASH': 'delete_outline',
            'PERMANENT_DELETE': 'delete_forever',
            'EMPTY_TRASH': 'delete_sweep',

            'SHARE': 'share',
            'UNSHARE': 'remove_circle',
            'PERMISSION_CHANGE': 'admin_panel_settings',
            'PERMISSION_GRANT': 'how_to_reg',
            'PERMISSION_REVOKE': 'person_remove',

            'LOGIN': 'login',
            'LOGOUT': 'logout',
            'LOGIN_FAILED': 'error',
            'SESSION_TIMEOUT': 'timer_off',
            'PASSWORD_CHANGE': 'vpn_key',

            'USER_CREATE': 'person_add',
            'USER_UPDATE': 'person',
            'USER_DELETE': 'person_remove',
            'USER_ACTIVATE': 'check_circle',
            'USER_DEACTIVATE': 'block',

            'VERSION_CREATE': 'history',
            'VERSION_RESTORE': 'restore_page',

            'SEARCH': 'search',
            'NAVIGATE': 'explore',

            'EXPORT_CSV': 'table_chart',
            'EXPORT_JSON': 'code',

            'NOTIFICATION_SEND': 'notifications',
            'NOTIFICATION_READ': 'mark_email_read',
            'NOTIFICATION_DELETE': 'notifications_off',

            'BULK_DELETE': 'delete_sweep',
            'BULK_RESTORE': 'restore_from_trash',
            'BULK_SHARE': 'group_add',
            'BULK_ARCHIVE': 'inventory_2',
        };
        return icons[action] || 'info';
    }

    getActionColor(action: string): string {
        const colors: Record<string, string> = {

            'CREATE': 'text-success',
            'UPDATE': 'text-primary',
            'DELETE': 'text-danger',
            'RESTORE': 'text-success',

            'UPLOAD': 'text-info',
            'DOWNLOAD': 'text-primary',
            'VIEW': 'text-secondary',
            'RENAME': 'text-warning',
            'MOVE': 'text-info',

            'ARCHIVE': 'text-warning',
            'UNARCHIVE': 'text-success',
            'TRASH': 'text-warning',
            'PERMANENT_DELETE': 'text-danger',
            'EMPTY_TRASH': 'text-danger',

            'SHARE': 'text-info',
            'UNSHARE': 'text-warning',
            'PERMISSION_CHANGE': 'text-primary',
            'PERMISSION_GRANT': 'text-success',
            'PERMISSION_REVOKE': 'text-danger',

            'LOGIN': 'text-success',
            'LOGOUT': 'text-secondary',
            'LOGIN_FAILED': 'text-danger',
            'SESSION_TIMEOUT': 'text-warning',
            'PASSWORD_CHANGE': 'text-primary',

            'USER_CREATE': 'text-success',
            'USER_UPDATE': 'text-primary',
            'USER_DELETE': 'text-danger',
            'USER_ACTIVATE': 'text-success',
            'USER_DEACTIVATE': 'text-warning',

            'VERSION_CREATE': 'text-info',
            'VERSION_RESTORE': 'text-primary',

            'SEARCH': 'text-primary',
            'NAVIGATE': 'text-secondary',

            'EXPORT_CSV': 'text-success',
            'EXPORT_JSON': 'text-info',

            'NOTIFICATION_SEND': 'text-info',
            'NOTIFICATION_READ': 'text-secondary',
            'NOTIFICATION_DELETE': 'text-warning',

            'BULK_DELETE': 'text-danger',
            'BULK_RESTORE': 'text-success',
            'BULK_SHARE': 'text-info',
            'BULK_ARCHIVE': 'text-warning',
        };
        return colors[action] || 'text-muted';
    }
}
