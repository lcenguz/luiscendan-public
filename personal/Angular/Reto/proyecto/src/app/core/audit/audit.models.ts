export type AuditAction =

    | 'UPLOAD' | 'DOWNLOAD' | 'VIEW' | 'RENAME' | 'MOVE'

    | 'ARCHIVE' | 'UNARCHIVE' | 'TRASH' | 'RESTORE' | 'PERMANENT_DELETE' | 'EMPTY_TRASH'

    | 'SHARE' | 'UNSHARE' | 'PERMISSION_CHANGE' | 'PERMISSION_GRANT' | 'PERMISSION_REVOKE'

    | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'SESSION_TIMEOUT' | 'PASSWORD_CHANGE'

    | 'USER_CREATE' | 'USER_UPDATE' | 'USER_DELETE' | 'USER_ACTIVATE' | 'USER_DEACTIVATE'

    | 'VERSION_CREATE' | 'VERSION_RESTORE'

    | 'EXPORT_CSV' | 'EXPORT_JSON'

    | 'BULK_DELETE' | 'BULK_RESTORE' | 'BULK_SHARE' | 'BULK_ARCHIVE';

export type AuditTargetType = 'document' | 'folder' | 'user' | 'permission' | 'notification' | 'system' | 'session';

export interface AuditEvent {
    id: string;
    timestamp: string;
    actor: string;
    actorName: string;
    action: AuditAction;
    targetType: AuditTargetType;
    targetId: string;
    targetName: string;
    metadata: Record<string, any>;
    ipAddress?: string;
}

export interface AuditFilters {
    startDate?: string;
    endDate?: string;
    actor?: string;
    action?: AuditAction;
    targetType?: AuditTargetType;
}
