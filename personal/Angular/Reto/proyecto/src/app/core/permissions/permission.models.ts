/**
 * Niveles de permisos para recursos (documentos y carpetas)
 */
export type PermissionLevel = 'OWNER' | 'EDIT' | 'VIEW' | 'NONE';

/**
 * Interfaz de permiso individual
 */
export interface Permission {
    id: string;
    resourceType: 'document' | 'folder';
    resourceId: string;
    userId: string;
    userEmail: string;
    level: PermissionLevel;
    inherited: boolean;        // Si es heredado de la carpeta padre
    grantedBy: string;         // userId que otorgó el permiso
    grantedAt: string;         // ISO timestamp
}

/**
 * Request para crear/actualizar permiso
 */
export interface PermissionRequest {
    resourceType: 'document' | 'folder';
    resourceId: string;
    userId: string;
    level: PermissionLevel;
}

/**
 * Respuesta con información de permisos de un recurso
 */
export interface ResourcePermissions {
    resourceId: string;
    resourceType: 'document' | 'folder';
    owner: string;
    permissions: Permission[];
    inheritedPermissions: Permission[];
}
