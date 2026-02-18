import { Injectable, computed, signal, inject } from '@angular/core';
import { Permission, PermissionLevel, PermissionRequest, ResourcePermissions } from './permission.models';
import { AuthService } from '../auth/auth.service';
import { AuditService } from '../audit/audit.service';
import { NotificationService } from '../notifications/notification.service';

const PERMISSIONS_KEY = 'luiscendan-drive-permissions';

@Injectable({ providedIn: 'root' })
export class PermissionService {
    private permissionsSignal = signal<Permission[]>(this.loadPermissions());
    private auditService = inject(AuditService);
    private notificationService = inject(NotificationService);

    permissions = computed(() => this.permissionsSignal());

    constructor(private auth: AuthService) { }

    /**
     * Otorga un permiso a un usuario sobre un recurso
     */
    grantPermission(request: PermissionRequest): Permission {
        const currentUser = this.auth.currentUser();
        if (!currentUser) throw new Error('No authenticated user');

        const newPermission: Permission = {
            id: crypto.randomUUID(),
            resourceType: request.resourceType,
            resourceId: request.resourceId,
            userId: request.userId,
            userEmail: this.getUserEmail(request.userId),
            level: request.level,
            inherited: false,
            grantedBy: currentUser.id,
            grantedAt: new Date().toISOString(),
        };

        const updated = [...this.permissionsSignal(), newPermission];
        this.permissionsSignal.set(updated);
        this.savePermissions(updated);

        const resourceName = this.getResourceName(request.resourceType, request.resourceId);
        this.auditService.logPermissionGrant(
            currentUser.id,
            currentUser.displayName,
            request.resourceId,
            resourceName,
            newPermission.userEmail,
            request.level
        );

        this.notificationService.notifyPermissionGranted(
            request.userId,
            currentUser.displayName,
            resourceName,
            request.level
        );

        return newPermission;
    }

    /**
     * Revoca un permiso específico
     */
    revokePermission(permissionId: string): void {
        const currentUser = this.auth.currentUser();
        const permission = this.permissionsSignal().find(p => p.id === permissionId);

        const updated = this.permissionsSignal().filter(p => p.id !== permissionId);
        this.permissionsSignal.set(updated);
        this.savePermissions(updated);

        if (currentUser && permission) {
            const resourceName = this.getResourceName(permission.resourceType, permission.resourceId);
            this.auditService.logPermissionRevoke(
                currentUser.id,
                currentUser.displayName,
                permission.resourceId,
                resourceName,
                permission.userEmail
            );

            this.notificationService.notifyPermissionRevoked(
                permission.userId,
                currentUser.displayName,
                resourceName
            );
        }
    }

    /**
     * Obtiene todos los permisos de un recurso (documento o carpeta)
     */
    getResourcePermissions(resourceType: 'document' | 'folder', resourceId: string): ResourcePermissions {
        const explicit = this.permissionsSignal().filter(
            p => p.resourceType === resourceType && p.resourceId === resourceId && !p.inherited
        );

        const inherited: Permission[] = [];

        return {
            resourceId,
            resourceType,
            owner: this.getResourceOwner(resourceType, resourceId),
            permissions: explicit,
            inheritedPermissions: inherited,
        };
    }

    /**
     * Verifica si un usuario tiene al menos el nivel de permiso especificado
     */
    hasPermission(
        userId: string,
        resourceType: 'document' | 'folder',
        resourceId: string,
        requiredLevel: PermissionLevel
    ): boolean {
        const userPermissions = this.permissionsSignal().filter(
            p => p.userId === userId && p.resourceType === resourceType && p.resourceId === resourceId
        );

        if (userPermissions.length === 0) return false;

        const maxLevel = this.getMaxPermissionLevel(userPermissions.map(p => p.level));
        return this.isLevelSufficient(maxLevel, requiredLevel);
    }

    /**
     * Obtiene el nivel máximo de permiso de una lista
     */
    private getMaxPermissionLevel(levels: PermissionLevel[]): PermissionLevel {
        if (levels.includes('OWNER')) return 'OWNER';
        if (levels.includes('EDIT')) return 'EDIT';
        if (levels.includes('VIEW')) return 'VIEW';
        return 'NONE';
    }

    /**
     * Verifica si un nivel es suficiente para el requerido
     */
    private isLevelSufficient(userLevel: PermissionLevel, requiredLevel: PermissionLevel): boolean {
        const hierarchy: Record<PermissionLevel, number> = {
            'OWNER': 4,
            'EDIT': 3,
            'VIEW': 2,
            'NONE': 1,
        };

        return hierarchy[userLevel] >= hierarchy[requiredLevel];
    }

    /**
     * Obtiene el email de un usuario por su ID
     */
    private getUserEmail(userId: string): string {
        const user = this.auth.getAllUsers().find(u => u.id === userId);
        return user?.email || 'unknown@email.com';
    }

    /**
     * Obtiene el propietario de un recurso (placeholder)
     */
    private getResourceOwner(resourceType: 'document' | 'folder', resourceId: string): string {

        return this.auth.currentUser()?.id || '';
    }

    /**
     * Obtiene documentos compartidos con un usuario
     */
    getSharedWithUser(userId: string): Permission[] {
        return this.permissionsSignal().filter(
            p => p.userId === userId && p.resourceType === 'document'
        );
    }

    /**
     * Obtiene documentos compartidos POR un usuario (que él ha compartido con otros)
     */
    getSharedByUser(userId: string): Permission[] {
        return this.permissionsSignal().filter(
            p => p.grantedBy === userId && p.resourceType === 'document'
        );
    }

    /**
     * Obtiene los permisos efectivos de un documento (incluyendo herencia)
     */
    getEffectivePermissions(documentId: string, folderId?: string): Permission[] {

        const explicit = this.permissionsSignal().filter(
            p => p.resourceType === 'document' && p.resourceId === documentId && !p.inherited
        );

        if (explicit.length > 0) {
            return explicit;
        }

        if (folderId) {
            const folderPerms = this.permissionsSignal().filter(
                p => p.resourceType === 'folder' && p.resourceId === folderId && !p.inherited
            );

            return folderPerms.map(p => ({
                ...p,
                resourceType: 'document' as const,
                resourceId: documentId,
                inherited: true,
            }));
        }

        return [];
    }

    private loadPermissions(): Permission[] {
        const raw = localStorage.getItem(PERMISSIONS_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw) as Permission[];
        } catch {
            return [];
        }
    }

    private savePermissions(permissions: Permission[]): void {
        localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
    }

    /**
     * Obtiene el nombre de un recurso (documento o carpeta)
     */
    private getResourceName(resourceType: 'document' | 'folder', resourceId: string): string {

        if (resourceType === 'document') {

            const filesRaw = localStorage.getItem('reto2-files');
            if (filesRaw) {
                try {
                    const files = JSON.parse(filesRaw);
                    const file = files.find((f: any) => f.id === resourceId);
                    if (file) return file.displayName || file.fileName || 'Documento';
                } catch {

                }
            }
        }

        return resourceType === 'document' ? 'Documento' : 'Carpeta';
    }

    /**
     * Verifica si un documento tiene permisos explícitos o heredados
     */
    hasExplicitPermissions(documentId: string): boolean {
        return this.permissionsSignal().some(
            p => p.resourceType === 'document' && p.resourceId === documentId
        );
    }

    /**
     * Obtiene permisos de una carpeta
     */
    getFolderPermissions(folderId: string): Permission[] {
        return this.permissionsSignal().filter(
            p => p.resourceType === 'folder' && p.resourceId === folderId
        );
    }

    /**
     * Otorga permiso a nivel de carpeta
     */
    grantFolderPermission(folderId: string, userId: string, level: PermissionLevel): Permission {
        const currentUser = this.auth.currentUser();
        if (!currentUser) throw new Error('No authenticated user');

        const newPermission: Permission = {
            id: crypto.randomUUID(),
            resourceType: 'folder',
            resourceId: folderId,
            userId: userId,
            userEmail: this.getUserEmail(userId),
            level: level,
            inherited: false,
            grantedBy: currentUser.id,
            grantedAt: new Date().toISOString(),
        };

        const updated = [...this.permissionsSignal(), newPermission];
        this.permissionsSignal.set(updated);
        this.savePermissions(updated);

        const folderName = this.getResourceName('folder', folderId);
        this.auditService.logPermissionGrant(
            currentUser.id,
            currentUser.displayName,
            folderId,
            folderName,
            newPermission.userEmail,
            level
        );

        return newPermission;
    }

    /**
     * Revoca permiso de carpeta
     */
    revokeFolderPermission(permissionId: string): void {
        const permission = this.permissionsSignal().find(p => p.id === permissionId);
        if (!permission) return;

        const currentUser = this.auth.currentUser();
        if (!currentUser) throw new Error('No authenticated user');

        const updated = this.permissionsSignal().filter(p => p.id !== permissionId);
        this.permissionsSignal.set(updated);
        this.savePermissions(updated);

        const folderName = this.getResourceName('folder', permission.resourceId);
        this.auditService.logPermissionRevoke(
            currentUser.id,
            currentUser.displayName,
            permission.resourceId,
            folderName,
            permission.userEmail
        );
    }

    /**
     * Verifica si un usuario tiene acceso a un documento (considerando herencia)
     */
    canAccessDocument(userId: string, documentId: string, folderId?: string): boolean {
        const effectivePerms = this.getEffectivePermissions(documentId, folderId);
        return effectivePerms.some(p => p.userId === userId);
    }

    /**
     * Obtiene el nivel de permiso efectivo de un usuario sobre un documento
     */
    getEffectivePermissionLevel(userId: string, documentId: string, folderId?: string): PermissionLevel | null {
        const effectivePerms = this.getEffectivePermissions(documentId, folderId);
        const userPerm = effectivePerms.find(p => p.userId === userId);
        return userPerm?.level || null;
    }
}
