export type FileStatus = 'UPLOADING' | 'ACTIVE' | 'ARCHIVED' | 'DELETED';

export interface FileDocument {
  id: string;
  fileName: string;      // nombre real (del sistema)
  displayName: string;   // nombre visible (editable)
  extension: string;
  mimeType: string;
  size: number;
  path: string;          // ruta completa del archivo
  owner: string;         // userId del propietario
  folderId?: string;     // ID de la carpeta padre (para herencia)
  sharedWith: string[];  // IDs de usuarios con quienes se compartió
  createdAt: string;     // ISO string
  updatedAt: string;     // ISO string
  status: FileStatus;
  description?: string;
  tags: string[];
  progress: number;      // 0-100 (para UPLOADING)
}

export interface FileMetadataUpdate {
  displayName?: string;
  description?: string;
  tags?: string[];
  status?: FileStatus;
}
