export type NotificationType =

    | 'info' | 'success' | 'warning' | 'error'

    | 'share' | 'unshare' | 'permission' | 'permission_granted' | 'permission_revoked'

    | 'file_upload' | 'file_download' | 'file_deleted' | 'file_restored'
    | 'download' | 'archive' | 'unarchive' | 'permanent_delete' | 'empty_trash'

    | 'bulk_action' | 'bulk_delete' | 'bulk_restore'

    | 'user_created' | 'user_updated' | 'user_activated' | 'user_deactivated'

    | 'version_created' | 'version_restored'

    | 'system' | 'undo' | 'redo'

    | 'session_timeout' | 'login_failed' | 'login' | 'logout';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
    metadata?: Record<string, any>;
}
