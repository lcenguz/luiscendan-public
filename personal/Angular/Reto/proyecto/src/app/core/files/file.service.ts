import { Injectable, computed, signal, inject } from '@angular/core';
import {
  FileDocument,
  FileStatus,
  FileMetadataUpdate,
} from './file.models';
import { AuthService } from '../auth/auth.service';
import { VersionService } from './version.service';
import { AuditService } from '../audit/audit.service';
import { NotificationService } from '../notifications/notification.service';

const FILES_KEY = 'reto2-files';

@Injectable({ providedIn: 'root' })
export class FileService {
  private auth = inject(AuthService);
  private versionService = inject(VersionService);
  private auditService = inject(AuditService);
  private notificationService = inject(NotificationService);

  private filesSignal = signal<FileDocument[]>(this.loadFiles());

  readonly files = computed(() => this.filesSignal());

  readonly MAX_FILE_SIZE = 10 * 1024 * 1024;

  private uploadTimers = new Map<string, number>();

  getAllFilesSnapshot(): FileDocument[] {
    return this.filesSignal();
  }

  getFileById(id: string): FileDocument | undefined {
    return this.filesSignal().find(f => f.id === id);
  }

  uploadFiles(files: File[], folderId?: string): void {
    const now = new Date().toISOString();
    const currentUser = this.auth.currentUser();
    const ownerId = currentUser?.id || 'unknown';

    const newDocs: FileDocument[] = files.map(file => ({
      id: crypto.randomUUID(),
      fileName: file.name,
      displayName: file.name,
      extension: this.getExtension(file.name),
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      path: `/documentos/${new Date().getFullYear()}/${file.name}`,
      owner: ownerId,
      folderId: folderId,
      sharedWith: [],
      createdAt: now,
      updatedAt: now,
      status: 'UPLOADING',
      description: '',
      tags: [],
      progress: 0,
    }));

    const updatedList = [...this.filesSignal(), ...newDocs];
    this.filesSignal.set(updatedList);
    this.saveFiles(updatedList);

    newDocs.forEach(doc => this.simulateUpload(doc.id));
  }

  updateMetadata(id: string, changes: FileMetadataUpdate): void {
    const current = this.filesSignal();
    const idx = current.findIndex(f => f.id === id);
    if (idx === -1) return;

    const oldFile = current[idx];
    const currentUser = this.auth.currentUser();

    const oldMeta = {
      displayName: oldFile.displayName,
      description: oldFile.description,
      tags: oldFile.tags,
    };

    const newMeta = {
      displayName: changes.displayName || oldFile.displayName,
      description: changes.description !== undefined ? changes.description : oldFile.description,
      tags: changes.tags || oldFile.tags,
    };

    if (currentUser && this.versionService.hasSignificantChanges(oldMeta, newMeta)) {
      const changeDesc = this.versionService.generateChangeDescription(oldMeta, newMeta);
      this.versionService.createVersion(
        oldFile,
        oldMeta,
        changeDesc,
        currentUser.id,
        currentUser.displayName
      );
    }

    const now = new Date().toISOString();
    const updatedDoc: FileDocument = {
      ...oldFile,
      ...changes,
      updatedAt: now,
    };

    const updatedList = [...current];
    updatedList[idx] = updatedDoc;

    this.filesSignal.set(updatedList);
    this.saveFiles(updatedList);
  }

  changeStatus(id: string, newStatus: FileStatus): void {
    this.updateMetadata(id, { status: newStatus });
  }

  deleteFile(id: string, hardDelete = false): void {
    const current = this.filesSignal();
    const file = current.find(f => f.id === id);
    const currentUser = this.auth.currentUser();

    if (hardDelete) {
      const updated = current.filter(f => f.id !== id);
      this.filesSignal.set(updated);
      this.saveFiles(updated);

      if (currentUser && file) {
        this.auditService.logFilePermanentDelete(
          currentUser.id,
          currentUser.displayName,
          file.id,
          file.displayName
        );
      }
      return;
    }

    this.changeStatus(id, 'DELETED');

    if (currentUser && file) {
      this.auditService.logFileTrash(
        currentUser.id,
        currentUser.displayName,
        file.id,
        file.displayName
      );

      this.notificationService.notifyFileDeleted(
        currentUser.id,
        file.displayName
      );
    }
  }

  resetFiles(): void {
    this.filesSignal.set([]);
    localStorage.removeItem(FILES_KEY);
    this.uploadTimers.forEach(timerId => window.clearInterval(timerId));
    this.uploadTimers.clear();
  }

  private simulateUpload(id: string): void {
    if (this.uploadTimers.has(id)) return;

    const intervalMs = 300;

    const timer = window.setInterval(() => {
      const current = this.filesSignal();
      const idx = current.findIndex(f => f.id === id);
      if (idx === -1) {
        window.clearInterval(timer);
        this.uploadTimers.delete(id);
        return;
      }

      const file = current[idx];
      if (file.status !== 'UPLOADING') {
        window.clearInterval(timer);
        this.uploadTimers.delete(id);
        return;
      }

      let nextProgress = file.progress + this.randomProgressStep();
      if (nextProgress >= 100) {
        nextProgress = 100;
      }

      const updatedFile: FileDocument = {
        ...file,
        progress: nextProgress,
        status: nextProgress >= 100 ? 'ACTIVE' : 'UPLOADING',
        updatedAt: new Date().toISOString(),
      };

      const updatedList = [...current];
      updatedList[idx] = updatedFile;
      this.filesSignal.set(updatedList);
      this.saveFiles(updatedList);

      if (nextProgress >= 100) {
        window.clearInterval(timer);
        this.uploadTimers.delete(id);

        const currentUser = this.auth.currentUser();
        if (currentUser) {
          this.auditService.logFileUpload(
            currentUser.id,
            currentUser.displayName,
            updatedFile.id,
            updatedFile.displayName,
            updatedFile.size
          );

          this.notificationService.notifyFileUpload(
            currentUser.id,
            updatedFile.displayName,
            updatedFile.size
          );
        }
      }
    }, intervalMs);

    this.uploadTimers.set(id, timer);
  }

  private randomProgressStep(): number {
    const min = 5;
    const max = 20;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private loadFiles(): FileDocument[] {
    const raw = localStorage.getItem(FILES_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as FileDocument[];
    } catch {
      console.error('Error parsing files from localStorage');
      return [];
    }
  }

  private saveFiles(files: FileDocument[]): void {
    localStorage.setItem(FILES_KEY, JSON.stringify(files));
  }

  validateFileSize(file: File): boolean {
    return file.size <= this.MAX_FILE_SIZE;
  }

  getMaxSizeMessage(): string {
    const mb = this.MAX_FILE_SIZE / (1024 * 1024);
    return `${mb} MB`;
  }

  getFileSizeError(fileName: string, size: number): string {
    return `"${fileName}" (${this.formatSize(size)}) supera el tamaño máximo de ${this.getMaxSizeMessage()}`;
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(1)} GB`;
  }

  private getExtension(fileName: string): string {
    const parts = fileName.split('.');
    if (parts.length < 2) return '';
    return parts[parts.length - 1].toLowerCase();
  }
}
