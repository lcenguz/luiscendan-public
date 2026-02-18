import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

import { PermissionService } from '../../core/permissions/permission.service';
import { FileService } from '../../core/files/file.service';
import { AuthService } from '../../core/auth/auth.service';
import { PermissionLevelBadgeComponent } from '../permissions/permission-level-badge.component';
import { Permission } from '../../core/permissions/permission.models';

interface SharedDocument {
    id: string;
    displayName: string;
    extension: string;
    size: number;
    description?: string;
    sharedWith: {
        userId: string;
        userEmail: string;
        level: string;
        grantedAt: string;
        permissionId: string;
    }[];
}

@Component({
    standalone: true,
    selector: 'app-shared-by-me',
    templateUrl: './shared-by-me.html',
    styleUrls: ['./shared-by-me.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatTabsModule,
        PermissionLevelBadgeComponent,
    ],
})
export class SharedByMeComponent {
    private permissionService = inject(PermissionService);
    private fileService = inject(FileService);
    private authService = inject(AuthService);
    private router = inject(Router);

    currentUser = this.authService.currentUser();

    sharedByMeDocuments = computed(() => {
        const userId = this.currentUser?.id;
        if (!userId) return [];

        const permissions = this.permissionService.getSharedByUser(userId);

        const docMap = new Map<string, SharedDocument>();

        permissions.forEach(perm => {
            const doc = this.fileService.getFileById(perm.resourceId);
            if (!doc) return;

            if (!docMap.has(doc.id)) {
                docMap.set(doc.id, {
                    id: doc.id,
                    displayName: doc.displayName,
                    extension: doc.extension || '',
                    size: doc.size || 0,
                    description: doc.description,
                    sharedWith: [],
                });
            }

            docMap.get(doc.id)!.sharedWith.push({
                userId: perm.userId, // Usuario con quien lo compartí
                userEmail: perm.userEmail,
                level: perm.level,
                grantedAt: perm.grantedAt,
                permissionId: perm.id,
            });
        });

        return Array.from(docMap.values());
    });

    sharedWithMeDocuments = computed(() => {
        const userId = this.currentUser?.id;
        if (!userId) return [];

        const permissions = this.permissionService.getSharedWithUser(userId);

        return permissions.map(perm => {
            const doc = this.fileService.getFileById(perm.resourceId);
            if (!doc) return null;

            const sharedByUser = this.authService.getAllUsers().find(u => u.id === perm.grantedBy);

            return {
                id: doc.id,
                displayName: doc.displayName,
                extension: doc.extension || '',
                size: doc.size || 0,
                description: doc.description,
                permission: perm,
                sharedByName: sharedByUser?.displayName || 'Usuario desconocido',
                sharedByEmail: sharedByUser?.email || '',
            };
        }).filter(item => item !== null) as any[];
    });

    revokePermission(permissionId: string) {
        if (!confirm('¿Deseas revocar este permiso?')) return;
        this.permissionService.revokePermission(permissionId);
    }

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
        return new Date(iso).toLocaleString();
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
}
