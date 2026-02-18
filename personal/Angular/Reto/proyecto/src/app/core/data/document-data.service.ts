import { Injectable, computed, signal } from '@angular/core';
import { DocumentItem, FolderNode, DocumentStatus } from './document.models';

@Injectable({ providedIn: 'root' })
export class DocumentDataService {

  private selectedFolderIdSignal = signal<string | null>(null);
  selectedFolderId = computed(() => this.selectedFolderIdSignal());

  private foldersSignal = signal<FolderNode[]>([
    { id: 'root', name: 'Raíz', parentId: null },
    { id: 'f1', name: 'Contratos', parentId: 'root' },
    { id: 'f2', name: 'Facturas', parentId: 'root' },
    { id: 'f3', name: 'Clientes', parentId: 'root' },
    { id: 'f4', name: '2024', parentId: 'f1' },
    { id: 'f5', name: '2025', parentId: 'f1' },
    { id: 'f6', name: 'Pendientes', parentId: 'f2' },
  ]);

  private documentsSignal = signal<DocumentItem[]>(this.generateMockDocuments());

  documents = computed(() => this.documentsSignal());
  folders = computed(() => this.foldersSignal());

  documentsInSelectedFolder = computed(() => {
    const folderId = this.selectedFolderIdSignal();
    const docs = this.documentsSignal();

    if (!folderId || folderId === 'root') {
        return docs;
    }

    return docs.filter(d => d.folderId === folderId);
  });

  constructor() {

    this.selectedFolderIdSignal.set('root');
  }

  selectFolder(folderId: string | null) {
    this.selectedFolderIdSignal.set(folderId);
  }

  getFolderById(id: string | null): FolderNode | null {
    if (!id) return null;
    return this.foldersSignal().find(f => f.id === id) ?? null;
  }

  getChildFolders(parentId: string | null): FolderNode[] {
    return this.foldersSignal().filter(f => f.parentId === parentId);
  }

  updateDocumentStatus(id: string, status: DocumentStatus) {
    const current = this.documentsSignal();
    const idx = current.findIndex(d => d.id === id);
    if (idx === -1) return;

    const updatedDoc: DocumentItem = {
      ...current[idx],
      status,
      updatedAt: new Date().toISOString(),
    };

    const newList = [...current];
    newList[idx] = updatedDoc;
    this.documentsSignal.set(newList);
  }

  bulkUpdateDocumentStatus(ids: string[], status: DocumentStatus) {
    if (!ids.length) return;

    const nowIso = new Date().toISOString();
    const idsSet = new Set(ids);

    const updated = this.documentsSignal().map(doc =>
      idsSet.has(doc.id)
        ? { ...doc, status, updatedAt: nowIso }
        : doc,
    );

    this.documentsSignal.set(updated);
  }

  private generateMockDocuments(): DocumentItem[] {
    const now = new Date();
    const baseDate = new Date(now.getFullYear(), 0, 1);

    const docs: DocumentItem[] = [];

    const pushDoc = (
      id: string,
      name: string,
      ext: string,
      folderId: string,
      owner: string,
      status: DocumentStatus = 'ACTIVE',
      sizeKBytes = 100,
      daysOffset = 0,
    ) => {
      const created = new Date(baseDate);
      created.setDate(created.getDate() + daysOffset);

      const updated = new Date(created);
      updated.setDate(updated.getDate() + Math.floor(Math.random() * 20));

      docs.push({
        id,
        name,
        extension: ext,
        size: sizeKBytes * 1024,
        owner,
        status,
        createdAt: created.toISOString(),
        updatedAt: updated.toISOString(),
        folderId,
      });
    };

    pushDoc('d1', 'Contrato ACME', 'pdf', 'f1', 'Ana', 'ACTIVE', 350, 5);
    pushDoc('d2', 'Contrato Beta', 'docx', 'f1', 'Luis', 'ARCHIVED', 220, 12);
    pushDoc('d3', 'Factura Enero 2024', 'xlsx', 'f2', 'Ana', 'ACTIVE', 80, 30);
    pushDoc('d4', 'Factura Febrero 2024', 'xlsx', 'f2', 'Ana', 'DELETED', 90, 60);
    pushDoc('d5', 'Listado clientes 2024', 'xlsx', 'f3', 'Marta', 'ACTIVE', 150, 10);
    pushDoc('d6', 'Contrato 2024 Cliente X', 'pdf', 'f4', 'Marta', 'ACTIVE', 400, 45);
    pushDoc('d7', 'Contrato 2025 Cliente Y', 'pdf', 'f5', 'Luis', 'ACTIVE', 420, 80);
    pushDoc('d8', 'Factura pendiente 123', 'pdf', 'f6', 'Ana', 'ACTIVE', 50, 15);

    return docs;
  }
}
