import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/auth/auth.service';
import { PermissionService } from '../../core/permissions/permission.service';
import { AuditService } from '../../core/audit/audit.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { FileService } from '../../core/files/file.service';
import { PermissionLevel } from '../../core/permissions/permission.models';

interface ShareDialogData {
    fileId: string;
    fileName: string;
}

interface UserOption {
    id: string;
    displayName: string;
    email: string;
}

@Component({
    standalone: true,
    selector: 'app-share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
    ],
})
export class ShareDialogComponent {
    private authService = inject(AuthService);
    private permissionService = inject(PermissionService);
    private auditService = inject(AuditService);
    private notificationService = inject(NotificationService);
    private fileService = inject(FileService);
    private snackBar = inject(MatSnackBar);

    selectedUserId: string = '';
    selectedPermissionLevel: PermissionLevel = 'VIEW';

    permissionLevels: { value: PermissionLevel; label: string }[] = [
        { value: 'VIEW', label: 'Solo lectura (VIEW)' },
        { value: 'EDIT', label: 'Puede editar (EDIT)' },
        { value: 'OWNER', label: 'Propietario (OWNER)' },
    ];

    availableUsers: UserOption[] = [];
    currentUser: any;

    constructor(
        public dialogRef: MatDialogRef<ShareDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ShareDialogData
    ) {
        this.currentUser = this.authService.currentUser();

        const allUsers = this.authService.getAllUsers();
        this.availableUsers = allUsers
            .filter(u => u.id !== this.currentUser?.id && u.isActive)
            .map(u => ({
                id: u.id,
                displayName: u.displayName,
                email: u.email
            }));
    }

    share(): void {
        if (!this.selectedUserId) {
            this.snackBar.open('Selecciona un usuario', 'Cerrar', { duration: 3000 });
            return;
        }

        try {

            const permission = this.permissionService.grantPermission({
                resourceType: 'document',
                resourceId: this.data.fileId,
                userId: this.selectedUserId,
                level: this.selectedPermissionLevel,
            });

            this.auditService.log(
                this.currentUser.id,
                this.currentUser.displayName,
                'SHARE',
                'document',
                this.data.fileId,
                this.data.fileName,
                {
                    sharedWith: this.selectedUserId,
                    permissionLevel: this.selectedPermissionLevel,
                }
            );

            const selectedUser = this.availableUsers.find(u => u.id === this.selectedUserId);

            this.notificationService.add(
                this.selectedUserId,
                'share',
                'Documento compartido',
                `${this.currentUser.displayName} compartió "${this.data.fileName}" contigo`,
                '/shared-with-me'
            );

            this.snackBar.open(
                `Archivo compartido con ${selectedUser?.displayName}`,
                'OK',
                { duration: 3000 }
            );

            this.dialogRef.close(permission);
        } catch (error) {
            console.error('Error al compartir:', error);
            this.snackBar.open('Error al compartir el archivo', 'Cerrar', { duration: 3000 });
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }
}

