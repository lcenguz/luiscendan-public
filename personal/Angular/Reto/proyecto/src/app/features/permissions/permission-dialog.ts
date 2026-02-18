import { Component, Inject, computed, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { PermissionService } from '../../core/permissions/permission.service';
import { AuthService } from '../../core/auth/auth.service';
import { Permission, PermissionLevel } from '../../core/permissions/permission.models';
import { PermissionBadgeComponent } from './permission-badge.component';

export interface PermissionDialogData {
    resourceType: 'document' | 'folder';
    resourceId: string;
    resourceName: string;
}

@Component({
    standalone: true,
    selector: 'app-permission-dialog',
    templateUrl: './permission-dialog.html',
    styles: [`
    .permission-list {
      max-height: 400px;
      overflow-y: auto;
    }
  `],
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        PermissionBadgeComponent,
    ],
})
export class PermissionDialogComponent {
    private permissionsSignal = signal<Permission[]>([]);
    permissions = computed(() => this.permissionsSignal());

    availableUsers = computed(() => {
        const allUsers = this.auth.getAllUsers();
        const currentUser = this.auth.currentUser();
        const alreadyShared = new Set(this.permissions().map(p => p.userId));

        return allUsers.filter(u =>
            u.id !== currentUser?.id && !alreadyShared.has(u.id)
        );
    });

    selectedUserId: string = '';
    selectedLevel: PermissionLevel = 'VIEW';

    permissionLevels: PermissionLevel[] = ['VIEW', 'EDIT', 'OWNER'];

    constructor(
        private dialogRef: MatDialogRef<PermissionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PermissionDialogData,
        private permissionService: PermissionService,
        private auth: AuthService
    ) {
        this.loadPermissions();
    }

    private loadPermissions() {
        const resourcePerms = this.permissionService.getResourcePermissions(
            this.data.resourceType,
            this.data.resourceId
        );
        this.permissionsSignal.set(resourcePerms.permissions);
    }

    addPermission() {
        if (!this.selectedUserId) return;

        this.permissionService.grantPermission({
            resourceType: this.data.resourceType,
            resourceId: this.data.resourceId,
            userId: this.selectedUserId,
            level: this.selectedLevel,
        });

        this.loadPermissions();
        this.selectedUserId = '';
        this.selectedLevel = 'VIEW';
    }

    removePermission(permissionId: string) {
        if (!confirm('¿Revocar este permiso?')) return;

        this.permissionService.revokePermission(permissionId);
        this.loadPermissions();
    }

    getLevelLabel(level: PermissionLevel): string {
        const labels: Record<PermissionLevel, string> = {
            'OWNER': 'Propietario',
            'EDIT': 'Editar',
            'VIEW': 'Ver',
            'NONE': 'Ninguno',
        };
        return labels[level];
    }

    getLevelColor(level: PermissionLevel): string {
        const colors: Record<PermissionLevel, string> = {
            'OWNER': 'warn',
            'EDIT': 'primary',
            'VIEW': 'accent',
            'NONE': 'basic',
        };
        return colors[level];
    }

    close() {
        this.dialogRef.close();
    }
}
