import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PermissionService } from '../../core/permissions/permission.service';
import { FileService } from '../../core/files/file.service';
import { AuthService } from '../../core/auth/auth.service';
import { PermissionBadgeComponent } from '../permissions/permission-badge.component';

@Component({
    standalone: true,
    selector: 'app-shared-with-me',
    templateUrl: './shared-with-me.html',
    styleUrls: ['./shared-with-me.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        PermissionBadgeComponent,
    ],
})
export class SharedWithMeComponent {
    private permissionService = inject(PermissionService);
    private fileService = inject(FileService);
    private authService = inject(AuthService);
    private router = inject(Router);

    currentUser = this.authService.currentUser();

    sharedDocuments = computed(() => {
        const userId = this.currentUser?.id;
        if (!userId) return [];

        const permissions = this.permissionService.getSharedWithUser(userId);

        return permissions.map(perm => {
            const doc = this.fileService.getFileById(perm.resourceId);
            if (!doc) return null;

            return {
                id: doc.id,
                displayName: doc.displayName,
                extension: doc.extension || '',
                size: doc.size || 0,
                description: doc.description,
                permission: perm,
            };
        }).filter(item => item !== null) as any[];
    });

    canEdit(doc: any): boolean {
        return doc.permission.level === 'EDIT' || doc.permission.level === 'OWNER';
    }

    canView(doc: any): boolean {
        return doc.permission.level === 'VIEW' || this.canEdit(doc);
    }

    openDocument(doc: any) {
        if (this.canView(doc)) {
            this.router.navigate(['/file-manager']);
        }
    }

    formatSize(bytes: number): string {
        return this.fileService.formatSize(bytes);
    }

    formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString();
    }

    getFileIcon(extension: string): string {
        const ext = extension.toLowerCase();
        if (ext === 'pdf') return 'picture_as_pdf';
        if (['doc', 'docx'].includes(ext)) return 'description';
        if (['xls', 'xlsx'].includes(ext)) return 'table_chart';
        if (['ppt', 'pptx'].includes(ext)) return 'slideshow';
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
        return 'insert_drive_file';
    }

    getIconColor(extension: string): string {
        const ext = extension.toLowerCase();
        if (ext === 'pdf') return '#E53935';
        if (['doc', 'docx'].includes(ext)) return '#1976D2';
        if (['xls', 'xlsx'].includes(ext)) return '#388E3C';
        if (['ppt', 'pptx'].includes(ext)) return '#FF6F00';
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '#F57C00';
        return '#424242';
    }

    getLevelBadge(level: string): string {
        const badges: Record<string, string> = {
            'OWNER': 'bg-danger',
            'EDIT': 'bg-primary',
            'VIEW': 'bg-secondary',
            'NONE': 'bg-light',
        };
        return badges[level] || 'bg-light';
    }

    getLevelText(level: string): string {
        const texts: Record<string, string> = {
            'OWNER': 'Propietario',
            'EDIT': 'Puede editar',
            'VIEW': 'Solo lectura',
            'NONE': 'Sin acceso',
        };
        return texts[level] || level;
    }
}
