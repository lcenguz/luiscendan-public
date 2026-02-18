export type DocumentStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';

export interface DocumentItem {
  id: string;
  name: string;
  extension: string;
  size: number;
  owner: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  folderId: string; // referencia a la carpeta contenedora
}

export interface FolderNode {
  id: string;
  name: string;
  parentId: string | null;

}
