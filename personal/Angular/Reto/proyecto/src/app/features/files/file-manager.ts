import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FileService } from '../../core/files/file.service';
import { FileDocument, FileMetadataUpdate, FileStatus } from '../../core/files/file.models';
import { PermissionService } from '../../core/permissions/permission.service';
import { AuditService } from '../../core/audit/audit.service';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { FolderService } from '../../core/folders/folder.service';
import { Folder } from '../../core/folders/folder.models';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileMetadataDialogComponent } from '../dialogs/file-metadata/file-metadata-dialog';
import { ShareDialogComponent } from '../dialogs/share-dialog.component';
import { VersionHistoryDialogComponent } from '../dialogs/version-history-dialog';
import { FolderCreateDialogComponent } from '../folders/folder-create-dialog.component';
import { FolderPermissionsDialogComponent } from '../folders/folder-permissions-dialog.component';
import { PermissionInheritanceBadgeComponent } from '../permissions/permission-inheritance-badge.component';

@Component({
  standalone: true,
  selector: 'app-file-manager',
  templateUrl: './file-manager.html',
  styleUrls: ['./file-manager.scss'],
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    PermissionInheritanceBadgeComponent,
  ],
})
export class FileManagerComponent implements OnInit {

  public fileService = inject(FileService);
  private dialog = inject(MatDialog);
  private permissionService = inject(PermissionService);
  private auditService = inject(AuditService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private folderService = inject(FolderService);
  private route = inject(ActivatedRoute);

  currentFolderId = signal<string | undefined>(undefined);

  selectedFolderId: string | undefined = undefined;

  private selectedFilesSignal = signal<File[]>([]);
  selectedFiles = computed(() => this.selectedFilesSignal());

  private isDragOverSignal = signal(false);
  isDragOver = computed(() => this.isDragOverSignal());

  private filterStatusSignal = signal<FileStatus | 'ALL'>('ALL');
  filterStatus = computed(() => this.filterStatusSignal());

  private filterStartDateSignal = signal<string>('');
  filterStartDate = computed(() => this.filterStartDateSignal());

  private filterEndDateSignal = signal<string>('');
  filterEndDate = computed(() => this.filterEndDateSignal());

  files = computed<FileDocument[]>(() => {
    let filtered = this.fileService.files();

    const status = this.filterStatusSignal();
    if (status !== 'ALL') {
      filtered = filtered.filter(f => f.status === status);
    }

    const startDate = this.filterStartDateSignal();
    if (startDate) {
      const start = new Date(startDate).getTime();
      filtered = filtered.filter(f => new Date(f.createdAt).getTime() >= start);
    }

    const endDate = this.filterEndDateSignal();
    if (endDate) {
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      filtered = filtered.filter(f => new Date(f.createdAt).getTime() <= end);
    }

    return filtered;
  });

  ngOnInit() {
    // Leer queryParams para navegación desde Command Palette
    this.route.queryParams.subscribe(params => {
      const fileId = params['fileId'];
      const folderId = params['folderId'];

      if (folderId) {
        // Navegar a la carpeta especificada
        this.currentFolderId.set(folderId);
      }

      if (fileId) {
        // Seleccionar el archivo especificado
        setTimeout(() => {
          const fileElement = document.getElementById(`file-${fileId}`);
          if (fileElement) {
            fileElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            fileElement.classList.add('highlight-file');
            setTimeout(() => fileElement.classList.remove('highlight-file'), 2000);
          }
        }, 300);
      }
    });
  }

  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFilesSignal.set([]);
      return;
    }

    const filesArray = Array.from(input.files);
    this.selectedFilesSignal.set(filesArray);
  }

  hasSelectedFiles(): boolean {
    return this.selectedFiles().length > 0;
  }

  clearSelectedFiles() {
    this.selectedFilesSignal.set([]);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.types.includes('Files')) {
      this.isDragOverSignal.set(true);
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOverSignal.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOverSignal.set(false);

    const dt = event.dataTransfer;
    if (!dt || !dt.files || dt.files.length === 0) {
      return;
    }

    const droppedFiles = Array.from(dt.files);

    const validFiles = droppedFiles.filter(f => this.fileService.validateFileSize(f));
    const invalidFiles = droppedFiles.filter(f => !this.fileService.validateFileSize(f));

    if (invalidFiles.length > 0) {
      const maxSize = this.fileService.getMaxSizeMessage();
      alert(`${invalidFiles.length} archivo(s) exceden el tamaño máximo de ${maxSize} y fueron omitidos.`);
    }

    if (validFiles.length > 0) {
      const current = this.selectedFiles();
      const combined = [...current, ...validFiles];
      this.selectedFilesSignal.set(combined);
    }
  }

  onStartUpload() {
    const files = this.selectedFiles();
    if (files.length === 0) return;

    const invalidFiles = files.filter(f => !this.fileService.validateFileSize(f));

    if (invalidFiles.length > 0) {
      const maxSize = this.fileService.getMaxSizeMessage();
      const errorMessages = invalidFiles.map(f =>
        `- ${f.name} (${this.fileService.formatSize(f.size)})`
      ).join('\n');

      alert(`Los siguientes archivos son demasiado grandes (máximo ${maxSize}):\n${errorMessages}`);

      const validFiles = files.filter(f => this.fileService.validateFileSize(f));

      if (validFiles.length === 0) {
        return; // No hay archivos válidos
      }

      this.fileService.uploadFiles(validFiles, this.selectedFolderId);
    } else {
      this.fileService.uploadFiles(files, this.selectedFolderId);
    }

    this.clearSelectedFiles();
  }

  onResetAllFiles() {
    if (confirm('¿Seguro que quieres borrar todos los documentos?')) {
      this.fileService.resetFiles();
    }
  }

  openMetadataDialog(file: FileDocument) {
    const dialogRef = this.dialog.open(FileMetadataDialogComponent, {
      width: '420px',
      data: file,
    });

    dialogRef.afterClosed().subscribe((changes: FileMetadataUpdate | undefined) => {
      if (!changes) return;
      this.fileService.updateMetadata(file.id, changes);
    });
  }

  shareFile(file: FileDocument) {
    const dialogRef = this.dialog.open(ShareDialogComponent, {
      width: '500px',
      data: {
        fileId: file.id,
        fileName: file.displayName,
      },
    });

    dialogRef.afterClosed().subscribe((permission) => {
      if (permission) {
        console.log('Archivo compartido:', permission);
      }
    });
  }

  openVersionHistory(file: FileDocument) {
    const dialogRef = this.dialog.open(VersionHistoryDialogComponent, {
      width: '800px',
      data: {
        fileId: file.id,
        fileName: file.displayName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.restored) {
        console.log('Versión restaurada:', result.version);

      }
    });
  }

  downloadFile(file: FileDocument) {

    const content = `Este es el contenido simulado del archivo: ${file.displayName}\n\nMetadatos:\n- Tamaño: ${this.formatSize(file.size)}\n- Tipo: ${file.mimeType}\n- Creado: ${this.formatDate(file.createdAt)}\n- Descripción: ${file.description || 'Sin descripción'}`;

    const blob = new Blob([content], { type: file.mimeType || 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.auditService.logDownload(currentUser.id, currentUser.displayName, file.id, file.displayName, file.size);
      this.notificationService.notifyDownload(currentUser.id, file.displayName, file.size);
    }
  }

  restoreFile(file: FileDocument) {
    this.fileService.changeStatus(file.id, 'ACTIVE');
  }

  softDeleteFile(file: FileDocument) {

    this.fileService.changeStatus(file.id, 'DELETED');
  }

  archiveFile(file: FileDocument) {
    this.fileService.changeStatus(file.id, 'ARCHIVED');

    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.auditService.logArchive(currentUser.id, currentUser.displayName, file.id, file.displayName);
      this.notificationService.notifyArchive(currentUser.id, file.displayName);
    }
  }

  unarchiveFile(file: FileDocument) {
    this.fileService.changeStatus(file.id, 'ACTIVE');

    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.auditService.logUnarchive(currentUser.id, currentUser.displayName, file.id, file.displayName);
      this.notificationService.notifyUnarchive(currentUser.id, file.displayName);
    }
  }

  hardDeleteFile(file: FileDocument) {
    if (!confirm('¿Eliminar permanentemente este documento?')) return;
    this.fileService.deleteFile(file.id, true);
  }

  formatSize(size: number): string {
    if (size < 1024) {
      return `${size} B`;
    }
    const kb = size / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }
    const mb = kb / 1024;
    if (mb < 1024) {
      return `${mb.toFixed(1)} MB`;
    }
    const gb = mb / 1024;
    return `${gb.toFixed(1)} GB`;
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString();
  }

  statusBadgeClass(status: FileDocument['status']): string {
    switch (status) {
      case 'UPLOADING':
        return 'badge bg-info';
      case 'ACTIVE':
        return 'badge bg-success';
      case 'ARCHIVED':
        return 'badge bg-warning';
      case 'DELETED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  /**
   * Retorna el icono de Material según la extensión del archivo
   */
  getFileIcon(extension: string): string {
    const ext = extension.toLowerCase();

    if (ext === 'pdf' || ext === '.pdf') return 'picture_as_pdf';
    if (['doc', 'docx', '.doc', '.docx'].includes(ext)) return 'description';
    if (['xls', 'xlsx', '.xls', '.xlsx'].includes(ext)) return 'table_chart';
    if (['ppt', 'pptx', '.ppt', '.pptx'].includes(ext)) return 'slideshow';

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext))
      return 'image';

    if (['zip', 'rar', '7z', 'tar', 'gz', '.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext))
      return 'folder_zip';

    if (['txt', 'md', '.txt', '.md'].includes(ext)) return 'text_snippet';
    if (['json', 'xml', 'html', 'css', 'js', 'ts', '.json', '.xml', '.html', '.css', '.js', '.ts'].includes(ext))
      return 'code';

    if (['mp4', 'avi', 'mov', 'mkv', '.mp4', '.avi', '.mov', '.mkv'].includes(ext)) return 'movie';
    if (['mp3', 'wav', 'ogg', 'flac', '.mp3', '.wav', '.ogg', '.flac'].includes(ext)) return 'audiotrack';

    return 'insert_drive_file';
  }

  /**
   * Retorna el color del icono según la extensión del archivo
   */
  getFileIconColor(extension: string): string {
    const ext = extension.toLowerCase();

    if (ext === 'pdf' || ext === '.pdf') return '#E53935'; // Rojo
    if (['doc', 'docx', '.doc', '.docx'].includes(ext)) return '#1976D2'; // Azul
    if (['xls', 'xlsx', '.xls', '.xlsx'].includes(ext)) return '#388E3C'; // Verde
    if (['ppt', 'pptx', '.ppt', '.pptx'].includes(ext)) return '#FF6F00'; // Naranja
    if (['jpg', 'jpeg', 'png', 'gif', '.jpg', '.jpeg', '.png', '.gif'].includes(ext)) return '#F57C00'; // Naranja
    if (['zip', 'rar', '7z', '.zip', '.rar', '.7z'].includes(ext)) return '#757575'; // Gris
    if (['json', 'xml', 'html', 'css', 'js', 'ts', '.json', '.xml', '.html', '.css', '.js', '.ts'].includes(ext))
      return '#9C27B0'; // Púrpura

    return '#424242'; // Gris oscuro por defecto
  }

  /**
   * Actualiza el filtro de estado
   */
  onStatusFilterChange(status: FileStatus | 'ALL') {
    this.filterStatusSignal.set(status);
  }

  /**
   * Actualiza el filtro de fecha de inicio
   */
  onStartDateChange(date: string) {
    this.filterStartDateSignal.set(date);
  }

  /**
   * Actualiza el filtro de fecha de fin
   */
  onEndDateChange(date: string) {
    this.filterEndDateSignal.set(date);
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters() {
    this.filterStatusSignal.set('ALL');
    this.filterStartDateSignal.set('');
    this.filterEndDateSignal.set('');
  }

  /**
   * Verifica si un archivo está compartido con otros usuarios
   */
  isFileShared(fileId: string): boolean {
    const permissions = this.permissionService.getResourcePermissions('document', fileId);
    return permissions.permissions.length > 0;
  }

  /**
   * Carpetas del usuario actual
   */
  userFolders = computed(() => {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return [];
    return this.folderService.getUserFolders(userId);
  });

  /**
   * Subcarpetas de la carpeta actual
   */
  currentFolders = computed(() => {
    return this.folderService.getSubfolders(this.currentFolderId());
  });

  /**
   * Abre el diálogo para crear una nueva carpeta
   */
  openCreateFolderDialog(): void {
    const dialogRef = this.dialog.open(FolderCreateDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((folder: Folder | undefined) => {
      if (folder) {

        console.log('Carpeta creada:', folder);
      }
    });
  }

  /**
   * Abre una carpeta (navega a ella)
   */
  openFolder(folder: Folder): void {
    this.currentFolderId.set(folder.id);
  }

  /**
   * Vuelve a la carpeta padre
   */
  goToParentFolder(): void {
    const currentFolder = this.folderService.getFolderById(this.currentFolderId() || '');
    if (currentFolder?.parentId) {
      this.currentFolderId.set(currentFolder.parentId);
    } else {
      this.currentFolderId.set(undefined); // Raíz
    }
  }

  /**
   * Abre el diálogo de permisos de carpeta
   */
  openFolderPermissions(folder: Folder): void {
    this.dialog.open(FolderPermissionsDialogComponent, {
      data: { folder },
      width: '700px'
    });
  }

  /**
   * Verifica si un archivo tiene permisos heredados
   */
  hasInheritedPermissions(file: FileDocument): boolean {
    return !this.permissionService.hasExplicitPermissions(file.id) && !!file.folderId;
  }

  /**
   * Obtiene el nombre de la carpeta de un archivo
   */
  getFolderName(folderId?: string): string {
    if (!folderId) return '';
    const folder = this.folderService.getFolderById(folderId);
    return folder?.name || '';
  }

  /**
   * Ruta de breadcrumbs de la carpeta actual
   */
  folderPath = computed(() => {
    const folderId = this.currentFolderId();
    if (!folderId) return ['Raíz'];
    return this.folderService.getFolderPath(folderId);
  });
}
