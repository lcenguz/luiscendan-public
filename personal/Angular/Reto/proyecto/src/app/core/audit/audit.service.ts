import { Injectable, signal, computed, inject } from '@angular/core';
import { AuditEvent, AuditAction, AuditTargetType, AuditFilters } from './audit.models';
import { NotificationService } from '../notifications/notification.service';

const AUDIT_KEY = 'luiscendan-drive-audit';

@Injectable({ providedIn: 'root' })
export class AuditService {
    private eventsSignal = signal<AuditEvent[]>(this.loadEvents());
    private cachedIP: string | null = null;
    private notificationService = inject(NotificationService);

    events = computed(() => this.eventsSignal());

    constructor() {
        this.fetchClientIP();
    }

    log(
        actor: string,
        actorName: string,
        action: AuditAction,
        targetType: AuditTargetType,
        targetId: string,
        targetName: string,
        metadata: Record<string, any> = {}
    ): void {
        const event: AuditEvent = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            actor,
            actorName,
            action,
            targetType,
            targetId,
            targetName,
            metadata,
            ipAddress: this.getClientIP(),
        };

        const updated = [event, ...this.eventsSignal()];
        this.eventsSignal.set(updated);
        this.saveEvents(updated);

        this.generateNotification(actor, actorName, action, targetName, metadata);
    }

    private getClientIP(): string {
        return this.cachedIP || '127.0.0.1 (local)';
    }

    private async fetchClientIP(): Promise<void> {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            this.cachedIP = data.ip;
        } catch (error) {
            this.cachedIP = '127.0.0.1 (local)';
        }
    }

    filter(filters: AuditFilters): AuditEvent[] {
        let filtered = this.eventsSignal();

        if (filters.startDate) {
            filtered = filtered.filter(e => e.timestamp >= filters.startDate!);
        }

        if (filters.endDate) {
            filtered = filtered.filter(e => e.timestamp <= filters.endDate!);
        }

        if (filters.actor) {
            filtered = filtered.filter(e => e.actor === filters.actor);
        }

        if (filters.action) {
            filtered = filtered.filter(e => e.action === filters.action);
        }

        if (filters.targetType) {
            filtered = filtered.filter(e => e.targetType === filters.targetType);
        }

        return filtered;
    }

    exportToCSV(events: AuditEvent[]): void {
        const headers = ['Timestamp', 'Actor', 'Action', 'Target Type', 'Target', 'IP'];
        const rows = events.map(e => [
            e.timestamp,
            e.actorName,
            e.action,
            e.targetType,
            e.targetName,
            e.ipAddress || 'N/A'
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-${Date.now()}.csv`;
        a.click();
    }

    exportToJSON(events: AuditEvent[]): void {
        const json = JSON.stringify(events, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-${Date.now()}.json`;
        a.click();
    }

    private loadEvents(): AuditEvent[] {
        const raw = localStorage.getItem(AUDIT_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    }

    private saveEvents(events: AuditEvent[]): void {
        const toSave = events.slice(0, 1000);
        localStorage.setItem(AUDIT_KEY, JSON.stringify(toSave));
    }

    logLogin(userId: string, userName: string): void {
        this.log(userId, userName, 'LOGIN', 'session', userId, 'Sesión iniciada', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
    }

    logLoginFailed(email: string, reason: string): void {
        this.log('system', 'Sistema', 'LOGIN_FAILED', 'session', email, 'Intento de login fallido', {
            email,
            reason,
            timestamp: new Date().toISOString()
        });
    }

    logLogout(userId: string, userName: string): void {
        this.log(userId, userName, 'LOGOUT', 'session', userId, 'Sesión cerrada', {
            timestamp: new Date().toISOString()
        });
    }

    logSessionTimeout(userId: string, userName: string): void {
        this.log(userId, userName, 'SESSION_TIMEOUT', 'session', userId, 'Sesión expirada por inactividad', {
            timestamp: new Date().toISOString()
        });
    }

    logFileUpload(userId: string, userName: string, fileId: string, fileName: string, fileSize: number): void {
        this.log(userId, userName, 'UPLOAD', 'document', fileId, fileName, {
            size: fileSize,
            timestamp: new Date().toISOString()
        });
    }

    logDownload(userId: string, userName: string, fileId: string, fileName: string, fileSize: number): void {
        this.log(userId, userName, 'DOWNLOAD', 'document', fileId, fileName, {
            size: fileSize,
            timestamp: new Date().toISOString()
        });
    }

    logFileDownload(userId: string, userName: string, fileId: string, fileName: string): void {
        this.log(userId, userName, 'DOWNLOAD', 'document', fileId, fileName, {
            timestamp: new Date().toISOString()
        });
    }

    logFileView(userId: string, userName: string, fileId: string, fileName: string): void {
        this.log(userId, userName, 'VIEW', 'document', fileId, fileName, {
            timestamp: new Date().toISOString()
        });
    }

    logFileTrash(userId: string, userName: string, fileId: string, fileName: string): void {
        this.log(userId, userName, 'TRASH', 'document', fileId, fileName, {
            previousStatus: 'ACTIVE',
            newStatus: 'DELETED',
            timestamp: new Date().toISOString()
        });
    }

    logFilePermanentDelete(userId: string, userName: string, fileId: string, fileName: string): void {
        this.log(userId, userName, 'PERMANENT_DELETE', 'document', fileId, fileName, {
            warning: 'Acción irreversible',
            timestamp: new Date().toISOString()
        });
    }

    logEmptyTrash(userId: string, userName: string, fileCount: number): void {
        this.log(userId, userName, 'EMPTY_TRASH', 'system', 'trash', 'Papelera vaciada', {
            filesDeleted: fileCount,
            timestamp: new Date().toISOString()
        });
    }

    logFileRestore(userId: string, userName: string, fileId: string, fileName: string): void {
        this.log(userId, userName, 'RESTORE', 'document', fileId, fileName, {
            previousStatus: 'DELETED',
            newStatus: 'ACTIVE',
            timestamp: new Date().toISOString()
        });
    }

    logArchive(userId: string, userName: string, fileId: string, fileName: string): void {
        this.log(userId, userName, 'ARCHIVE', 'document', fileId, fileName, {
            previousStatus: 'ACTIVE',
            newStatus: 'ARCHIVED',
            timestamp: new Date().toISOString()
        });
    }
    logUnarchive(userId: string, userName: string, fileId: string, fileName: string): void {
        this.log(userId, userName, 'UNARCHIVE', 'document', fileId, fileName, {
            previousStatus: 'ARCHIVED',
            newStatus: 'ACTIVE',
            timestamp: new Date().toISOString()
        });
    }
    logShare(userId: string, userName: string, fileId: string, fileName: string, sharedWithEmail: string, permission: string): void {
        this.log(userId, userName, 'SHARE', 'document', fileId, fileName, {
            sharedWith: sharedWithEmail,
            permissionLevel: permission,
            timestamp: new Date().toISOString()
        });
    }
    logUnshare(userId: string, userName: string, fileId: string, fileName: string, unsharedWithEmail: string): void {
        this.log(userId, userName, 'UNSHARE', 'document', fileId, fileName, {
            unsharedWith: unsharedWithEmail,
            timestamp: new Date().toISOString()
        });
    }
    logPermissionGrant(userId: string, userName: string, resourceId: string, resourceName: string, grantedToEmail: string, level: string): void {
        this.log(userId, userName, 'PERMISSION_GRANT', 'permission', resourceId, resourceName, {
            grantedTo: grantedToEmail,
            permissionLevel: level,
            timestamp: new Date().toISOString()
        });
    }
    logPermissionRevoke(userId: string, userName: string, resourceId: string, resourceName: string, revokedFromEmail: string): void {
        this.log(userId, userName, 'PERMISSION_REVOKE', 'permission', resourceId, resourceName, {
            revokedFrom: revokedFromEmail,
            timestamp: new Date().toISOString()
        });
    }

    logUserCreate(adminId: string, adminName: string, newUserId: string, newUserEmail: string, role: string): void {
        this.log(adminId, adminName, 'USER_CREATE', 'user', newUserId, newUserEmail, {
            role,
            timestamp: new Date().toISOString()
        });
    }
    logUserUpdate(adminId: string, adminName: string, userId: string, userEmail: string, changes: Record<string, any>): void {
        this.log(adminId, adminName, 'USER_UPDATE', 'user', userId, userEmail, {
            changes,
            timestamp: new Date().toISOString()
        });
    }
    logUserActivate(adminId: string, adminName: string, userId: string, userEmail: string): void {
        this.log(adminId, adminName, 'USER_ACTIVATE', 'user', userId, userEmail, {
            previousStatus: 'inactive',
            newStatus: 'active',
            timestamp: new Date().toISOString()
        });
    }
    logUserDeactivate(adminId: string, adminName: string, userId: string, userEmail: string): void {
        this.log(adminId, adminName, 'USER_DEACTIVATE', 'user', userId, userEmail, {
            previousStatus: 'active',
            newStatus: 'inactive',
            timestamp: new Date().toISOString()
        });
    }
    logVersionCreate(userId: string, userName: string, fileId: string, fileName: string, versionNumber: number): void {
        this.log(userId, userName, 'VERSION_CREATE', 'document', fileId, fileName, {
            versionNumber,
            timestamp: new Date().toISOString()
        });
    }
    logVersionRestore(userId: string, userName: string, fileId: string, fileName: string, versionNumber: number): void {
        this.log(userId, userName, 'VERSION_RESTORE', 'document', fileId, fileName, {
            restoredVersion: versionNumber,
            timestamp: new Date().toISOString()
        });
    }
    logExportCSV(userId: string, userName: string, recordCount: number): void {
        this.log(userId, userName, 'EXPORT_CSV', 'system', 'audit', 'Exportación CSV', {
            recordCount,
            timestamp: new Date().toISOString()
        });
    }
    logExportJSON(userId: string, userName: string, recordCount: number): void {
        this.log(userId, userName, 'EXPORT_JSON', 'system', 'audit', 'Exportación JSON', {
            recordCount,
            timestamp: new Date().toISOString()
        });
    }
    logBulkDelete(userId: string, userName: string, fileCount: number): void {
        this.log(userId, userName, 'BULK_DELETE', 'system', 'bulk-operation', 'Eliminación masiva', {
            filesAffected: fileCount,
            timestamp: new Date().toISOString()
        });
    }
    logBulkRestore(userId: string, userName: string, fileCount: number): void {
        this.log(userId, userName, 'BULK_RESTORE', 'system', 'bulk-operation', 'Restauración masiva', {
            filesAffected: fileCount,
            timestamp: new Date().toISOString()
        });
    }
    private generateNotification(
        userId: string,
        userName: string,
        action: AuditAction,
        targetName: string,
        metadata: Record<string, any>
    ): void {
        const notificationMap: Record<AuditAction, () => void> = {
            'UPLOAD': () => this.notificationService.notifyFileUpload(userId, targetName, metadata['size'] || 0),
            'DOWNLOAD': () => this.notificationService.notifyDownload(userId, targetName, metadata['size'] || 0),
            'ARCHIVE': () => this.notificationService.notifyArchive(userId, targetName),
            'UNARCHIVE': () => this.notificationService.notifyUnarchive(userId, targetName),
            'TRASH': () => this.notificationService.notifyFileDeleted(userId, targetName),
            'RESTORE': () => this.notificationService.notifyFileRestored(userId, targetName),
            'PERMANENT_DELETE': () => this.notificationService.notifyPermanentDelete(userId, targetName),
            'EMPTY_TRASH': () => this.notificationService.notifyEmptyTrash(userId, metadata['filesAffected'] || 0),
            'PERMISSION_GRANT': () => {
                if (metadata['grantedTo']) {
                    this.notificationService.notifyPermissionGranted(
                        metadata['grantedTo'],
                        userName,
                        targetName,
                        metadata['level'] || 'VIEW'
                    );
                }
            },
            'PERMISSION_REVOKE': () => {
                if (metadata['revokedFrom']) {
                    this.notificationService.notifyPermissionRevoked(
                        metadata['revokedFrom'],
                        userName,
                        targetName
                    );
                }
            },
            'SHARE': () => {
                if (metadata['sharedWith']) {
                    this.notificationService.notifyShare(
                        metadata['sharedWith'],
                        userName,
                        targetName,
                        metadata['permission'] || 'VIEW'
                    );
                }
            },
            'UNSHARE': () => {
                if (metadata['unsharedWith']) {
                    this.notificationService.notifyUnshare(
                        metadata['unsharedWith'],
                        userName,
                        targetName
                    );
                }
            },
            'LOGIN': () => this.notificationService.notifyLogin(userId, userName),
            'LOGOUT': () => this.notificationService.notifyLogout(userId, userName),
            'SESSION_TIMEOUT': () => this.notificationService.notifySessionTimeout(userId),
            'BULK_DELETE': () => this.notificationService.notifyBulkDelete(userId, metadata['filesAffected'] || 0),
            'BULK_RESTORE': () => this.notificationService.notifyBulkRestore(userId, metadata['filesAffected'] || 0),
            'USER_CREATE': () => this.notificationService.notifyUserCreated(userId, metadata['email'] || targetName),
            'USER_UPDATE': () => {
                if (metadata['updatedUserId']) {
                    this.notificationService.notifyUserUpdated(
                        metadata['updatedUserId'],
                        userName,
                        JSON.stringify(metadata['changes'] || {})
                    );
                }
            },
            'USER_ACTIVATE': () => {
                if (metadata['activatedUserId']) {
                    this.notificationService.notifyUserActivated(metadata['activatedUserId'], userName);
                }
            },
            'USER_DEACTIVATE': () => {
                if (metadata['deactivatedUserId']) {
                    this.notificationService.notifyUserDeactivated(metadata['deactivatedUserId'], userName);
                }
            },
            'VERSION_CREATE': () => this.notificationService.notifyVersionCreated(userId, targetName, metadata['version'] || 1),
            'VERSION_RESTORE': () => this.notificationService.notifyVersionRestored(userId, targetName, metadata['version'] || 1),
            'VIEW': () => { },
            'RENAME': () => { },
            'MOVE': () => { },
            'PERMISSION_CHANGE': () => { },
            'LOGIN_FAILED': () => { },
            'PASSWORD_CHANGE': () => { },
            'USER_DELETE': () => { },
            'EXPORT_CSV': () => { },
            'EXPORT_JSON': () => { },
            'BULK_SHARE': () => { },
            'BULK_ARCHIVE': () => { },
        };
        const notifyFn = notificationMap[action];
        if (notifyFn) {
            try {
                notifyFn();
            } catch (error) {
                console.error(`Error generating notification for action ${action}:`, error);
            }
        }
    }
}
