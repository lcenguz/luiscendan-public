import { Injectable, signal, computed } from '@angular/core';
import { Notification, NotificationType } from './notification.models';

const NOTIFICATIONS_KEY = 'luiscendan-drive-notifications';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private notificationsSignal = signal<Notification[]>(this.loadNotifications());

    notifications = computed(() => this.notificationsSignal());
    unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

    /**
     * Obtiene notificaciones para un usuario específico
     */
    getUserNotifications(userId: string) {
        return computed(() =>
            this.notifications()
                .filter(n => n.userId === userId)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        );
    }

    /**
     * Método genérico para agregar notificación
     */
    add(
        userId: string,
        type: NotificationType,
        title: string,
        message: string,
        actionUrl?: string,
        metadata?: Record<string, any>
    ) {
        const notification: Notification = {
            id: crypto.randomUUID(),
            userId,
            type,
            title,
            message,
            timestamp: new Date().toISOString(),
            read: false,
            actionUrl,
            metadata,
        };

        const updated = [notification, ...this.notificationsSignal()].slice(0, 100);
        this.notificationsSignal.set(updated);
        this.saveNotifications(updated);
    }

    markAsRead(id: string) {
        const updated = this.notificationsSignal().map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        this.notificationsSignal.set(updated);
        this.saveNotifications(updated);
    }

    markAllAsRead(userId: string) {
        const updated = this.notificationsSignal().map(n =>
            n.userId === userId ? { ...n, read: true } : n
        );
        this.notificationsSignal.set(updated);
        this.saveNotifications(updated);
    }

    deleteNotification(id: string) {
        const updated = this.notificationsSignal().filter(n => n.id !== id);
        this.notificationsSignal.set(updated);
        this.saveNotifications(updated);
    }

    clear(userId: string) {
        const updated = this.notificationsSignal().filter(n => n.userId !== userId);
        this.notificationsSignal.set(updated);
        this.saveNotifications(updated);
    }

    /**
     * Notifica cuando un documento es compartido
     */
    notifyShare(recipientId: string, sharedBy: string, documentName: string, permission: string) {
        this.add(
            recipientId,
            'share',
            '📄 Documento compartido',
            `${sharedBy} ha compartido "${documentName}" contigo con permisos de ${permission}`,
            '/shared',
            { sharedBy, documentName, permission }
        );
    }

    /**
     * Notifica cuando se deja de compartir un documento
     */
    notifyUnshare(recipientId: string, unsharedBy: string, documentName: string) {
        this.add(
            recipientId,
            'unshare',
            '🚫 Acceso revocado',
            `${unsharedBy} ha dejado de compartir "${documentName}" contigo`,
            '/shared',
            { unsharedBy, documentName }
        );
    }

    /**
     * Notifica cuando se otorga un permiso
     */
    notifyPermissionGranted(recipientId: string, grantedBy: string, resourceName: string, level: string) {
        this.add(
            recipientId,
            'permission_granted',
            '✅ Permiso otorgado',
            `${grantedBy} te ha otorgado permisos de ${level} sobre "${resourceName}"`,
            '/shared',
            { grantedBy, resourceName, level }
        );
    }

    /**
     * Notifica cuando se revoca un permiso
     */
    notifyPermissionRevoked(recipientId: string, revokedBy: string, resourceName: string) {
        this.add(
            recipientId,
            'permission_revoked',
            '⛔ Permiso revocado',
            `${revokedBy} ha revocado tus permisos sobre "${resourceName}"`,
            undefined,
            { revokedBy, resourceName }
        );
    }

    /**
     * Notifica cuando se sube un archivo
     */
    notifyFileUpload(userId: string, fileName: string, size: number) {
        this.add(
            userId,
            'file_upload',
            '📤 Archivo subido',
            `"${fileName}" se ha subido correctamente (${this.formatSize(size)})`,
            '/file-manager',
            { fileName, size }
        );
    }

    /**
     * Notifica cuando se elimina un archivo
     */
    notifyFileDeleted(userId: string, fileName: string) {
        this.add(
            userId,
            'file_deleted',
            '🗑️ Archivo eliminado',
            `"${fileName}" ha sido movido a la papelera`,
            '/trash',
            { fileName }
        );
    }

    /**
     * Notifica cuando se restaura un archivo
     */
    notifyFileRestored(userId: string, fileName: string) {
        this.add(
            userId,
            'file_restored',
            '♻️ Archivo restaurado',
            `"${fileName}" ha sido restaurado desde la papelera`,
            '/file-manager',
            { fileName }
        );
    }

    /**
     * Notifica acción masiva completada
     */
    notifyBulkAction(userId: string, action: string, count: number) {
        this.add(
            userId,
            'bulk_action',
            '📦 Acción masiva completada',
            `${action} aplicado a ${count} archivo(s)`,
            undefined,
            { action, count }
        );
    }

    /**
     * Notifica eliminación masiva
     */
    notifyBulkDelete(userId: string, count: number) {
        this.add(
            userId,
            'bulk_delete',
            '🗑️ Eliminación masiva',
            `${count} archivo(s) han sido eliminados`,
            '/trash',
            { count }
        );
    }

    /**
     * Notifica restauración masiva
     */
    notifyBulkRestore(userId: string, count: number) {
        this.add(
            userId,
            'bulk_restore',
            '♻️ Restauración masiva',
            `${count} archivo(s) han sido restaurados`,
            '/file-manager',
            { count }
        );
    }

    /**
     * Notifica creación de usuario
     */
    notifyUserCreated(adminId: string, newUserEmail: string) {
        this.add(
            adminId,
            'user_created',
            '👤 Usuario creado',
            `Se ha creado el usuario ${newUserEmail}`,
            '/admin/users',
            { newUserEmail }
        );
    }

    /**
     * Notifica actualización de usuario
     */
    notifyUserUpdated(userId: string, updatedBy: string, changes: string) {
        this.add(
            userId,
            'user_updated',
            '✏️ Perfil actualizado',
            `${updatedBy} ha actualizado tu perfil: ${changes}`,
            undefined,
            { updatedBy, changes }
        );
    }

    /**
     * Notifica activación de usuario
     */
    notifyUserActivated(userId: string, activatedBy: string) {
        this.add(
            userId,
            'user_activated',
            '✅ Cuenta activada',
            `${activatedBy} ha activado tu cuenta`,
            undefined,
            { activatedBy }
        );
    }

    /**
     * Notifica desactivación de usuario
     */
    notifyUserDeactivated(userId: string, deactivatedBy: string) {
        this.add(
            userId,
            'user_deactivated',
            '⛔ Cuenta desactivada',
            `${deactivatedBy} ha desactivado tu cuenta`,
            undefined,
            { deactivatedBy }
        );
    }

    /**
     * Notifica creación de versión
     */
    notifyVersionCreated(userId: string, fileName: string, versionNumber: number) {
        this.add(
            userId,
            'version_created',
            '📝 Nueva versión',
            `Se ha creado la versión ${versionNumber} de "${fileName}"`,
            '/file-manager',
            { fileName, versionNumber }
        );
    }

    /**
     * Notifica restauración de versión
     */
    notifyVersionRestored(userId: string, fileName: string, versionNumber: number) {
        this.add(
            userId,
            'version_restored',
            '⏮️ Versión restaurada',
            `Se ha restaurado la versión ${versionNumber} de "${fileName}"`,
            '/file-manager',
            { fileName, versionNumber }
        );
    }

    /**
     * Notifica timeout de sesión
     */
    notifySessionTimeout(userId: string) {
        this.add(
            userId,
            'session_timeout',
            '⏱️ Sesión expirada',
            'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.',
            '/login',
            {}
        );
    }

    /**
     * Notifica login fallido
     */
    notifyLoginFailed(email: string, reason: string) {

        this.add(
            'system',
            'login_failed',
            '🔒 Login fallido',
            `Intento de login fallido para ${email}: ${reason}`,
            undefined,
            { email, reason }
        );
    }

    /**
     * Notifica acción de deshacer
     */
    notifyUndo(userId: string, action: string) {
        this.add(
            userId,
            'undo',
            '↩️ Acción deshecha',
            `Se ha deshecho: ${action}`,
            undefined,
            { action }
        );
    }

    /**
     * Notifica acción de rehacer
     */
    notifyRedo(userId: string, action: string) {
        this.add(
            userId,
            'redo',
            '↪️ Acción rehecha',
            `Se ha rehecho: ${action}`,
            undefined,
            { action }
        );
    }

    /**
     * Notifica login exitoso
     */
    notifyLogin(userId: string, userName: string) {
        this.add(
            userId,
            'login',
            '🔓 Sesión iniciada',
            `Bienvenido de vuelta, ${userName}`,
            undefined,
            { userName }
        );
    }

    /**
     * Notifica logout
     */
    notifyLogout(userId: string, userName: string) {
        this.add(
            userId,
            'logout',
            '🔒 Sesión cerrada',
            `Hasta pronto, ${userName}`,
            undefined,
            { userName }
        );
    }

    /**
     * Notifica descarga de archivo
     */
    notifyDownload(userId: string, fileName: string, size: number) {
        this.add(
            userId,
            'download',
            '⬇️ Archivo descargado',
            `"${fileName}" se ha descargado (${this.formatSize(size)})`,
            undefined,
            { fileName, size }
        );
    }

    /**
     * Notifica archivo archivado
     */
    notifyArchive(userId: string, fileName: string) {
        this.add(
            userId,
            'archive',
            '📦 Archivo archivado',
            `"${fileName}" ha sido archivado`,
            '/file-manager',
            { fileName }
        );
    }

    /**
     * Notifica archivo desarchivado
     */
    notifyUnarchive(userId: string, fileName: string) {
        this.add(
            userId,
            'unarchive',
            '📤 Archivo desarchivado',
            `"${fileName}" ha sido desarchivado`,
            '/file-manager',
            { fileName }
        );
    }

    /**
     * Notifica eliminación permanente
     */
    notifyPermanentDelete(userId: string, fileName: string) {
        this.add(
            userId,
            'permanent_delete',
            '🗑️ Eliminación permanente',
            `"${fileName}" ha sido eliminado permanentemente`,
            undefined,
            { fileName }
        );
    }

    /**
     * Notifica vaciado de papelera
     */
    notifyEmptyTrash(userId: string, count: number) {
        this.add(
            userId,
            'empty_trash',
            '🗑️ Papelera vaciada',
            `Se han eliminado permanentemente ${count} archivo(s)`,
            undefined,
            { count }
        );
    }

    /**
     * Notificación genérica de sistema
     */
    notifySystem(userId: string, title: string, message: string, actionUrl?: string) {
        this.add(
            userId,
            'system',
            title,
            message,
            actionUrl,
            {}
        );
    }

    private formatSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }

    private loadNotifications(): Notification[] {
        const raw = localStorage.getItem(NOTIFICATIONS_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    }

    private saveNotifications(notifications: Notification[]): void {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
}
