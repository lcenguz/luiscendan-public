import { Component, computed, signal, inject } from '@angular/core';
import { FileService } from '../../core/files/file.service';
import { FileDocument } from '../../core/files/file.models';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../core/audit/audit.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { AuthService } from '../../core/auth/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    standalone: true,
    selector: 'app-trash',
    templateUrl: './trash.html',
    styleUrls: ['./trash.scss'],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatCheckboxModule,
        FormsModule,
    ],
})
export class TrashComponent {
    public fileService = inject(FileService);
    private auditService = inject(AuditService);
    private notificationService = inject(NotificationService);
    private authService = inject(AuthService);

    private selectionSignal = signal<Set<string>>(new Set());
    selection = computed(() => this.selectionSignal());

    private filterTextSignal = signal<string>('');
    filterText = computed(() => this.filterTextSignal());

    private filterOwnerSignal = signal<string>('');
    filterOwner = computed(() => this.filterOwnerSignal());

    private filterTypeSignal = signal<string>('');
    filterType = computed(() => this.filterTypeSignal());

    deletedFiles = computed(() => {
        let files = this.fileService.files().filter(f => f.status === 'DELETED');

        const text = this.filterTextSignal().toLowerCase();
        if (text) {
            files = files.filter(f =>
                f.displayName.toLowerCase().includes(text) ||
                f.fileName.toLowerCase().includes(text)
            );
        }

        const owner = this.filterOwnerSignal();
        if (owner) {
            files = files.filter(f => f.owner === owner);
        }

        const type = this.filterTypeSignal();
        if (type) {
            files = files.filter(f => f.extension.toLowerCase() === type.toLowerCase());
        }

        return files;
    });

    uniqueOwners = computed(() => {
        const owners = new Set(
            this.fileService.files()
                .filter(f => f.status === 'DELETED')
                .map(f => f.owner)
        );
        return Array.from(owners);
    });

    uniqueTypes = computed(() => {
        const types = new Set(
            this.fileService.files()
                .filter(f => f.status === 'DELETED')
                .map(f => f.extension)
        );
        return Array.from(types).filter(t => t);
    });

    isSelected(id: string): boolean {
        return this.selectionSignal().has(id);
    }

    toggleSelection(id: string) {
        const current = new Set(this.selectionSignal());
        if (current.has(id)) {
            current.delete(id);
        } else {
            current.add(id);
        }
        this.selectionSignal.set(current);
    }

    selectAll() {
        const ids = this.deletedFiles().map(f => f.id);
        this.selectionSignal.set(new Set(ids));
    }

    clearSelection() {
        this.selectionSignal.set(new Set());
    }

    get selectedCount(): number {
        return this.selectionSignal().size;
    }

    get allSelected(): boolean {
        const total = this.deletedFiles().length;
        return total > 0 && this.selectedCount === total;
    }

    restoreSelected() {
        if (this.selectedCount === 0) return;

        if (!confirm(`¿Restaurar ${this.selectedCount} archivo(s)?`)) return;

        const count = this.selectedCount;
        this.selectionSignal().forEach(id => {
            this.fileService.changeStatus(id, 'ACTIVE');
        });

        const currentUser = this.authService.currentUser();
        if (currentUser) {
            this.auditService.logBulkRestore(currentUser.id, currentUser.displayName, count);
            this.notificationService.notifyBulkRestore(currentUser.id, count);
        }

        this.clearSelection();
    }

    deleteSelectedPermanently() {
        if (this.selectedCount === 0) return;

        if (!confirm(`¿Eliminar permanentemente ${this.selectedCount} archivo(s)? Esta acción no se puede deshacer.`)) {
            return;
        }

        const count = this.selectedCount;
        this.selectionSignal().forEach(id => {
            this.fileService.deleteFile(id, true);
        });

        const currentUser = this.authService.currentUser();
        if (currentUser) {
            this.auditService.logBulkDelete(currentUser.id, currentUser.displayName, count);
            this.notificationService.notifyBulkDelete(currentUser.id, count);
        }

        this.clearSelection();
    }

    /**
     * Restaurar archivo eliminado
     */
    restoreFile(file: FileDocument) {
        this.fileService.changeStatus(file.id, 'ACTIVE');

        const currentUser = this.authService.currentUser();
        if (currentUser) {
            this.auditService.logFileRestore(currentUser.id, currentUser.displayName, file.id, file.displayName);
            this.notificationService.notifyFileRestored(currentUser.id, file.displayName);
        }
    }

    /**
     * Eliminar permanentemente
     */
    permanentDelete(file: FileDocument) {
        if (!confirm(`¿Eliminar permanentemente "${file.displayName}"? Esta acción no se puede deshacer.`)) {
            return;
        }
        this.fileService.deleteFile(file.id, true);
    }

    /**
     * Vaciar papelera completa
     */
    emptyTrash() {
        const count = this.deletedFiles().length;
        if (count === 0) return;

        if (!confirm(`¿Eliminar permanentemente ${count} archivo(s)? Esta acción no se puede deshacer.`)) {
            return;
        }

        this.deletedFiles().forEach(file => {
            this.fileService.deleteFile(file.id, true);
        });

        const currentUser = this.authService.currentUser();
        if (currentUser) {
            this.auditService.logEmptyTrash(currentUser.id, currentUser.displayName, count);
            this.notificationService.notifyEmptyTrash(currentUser.id, count);
        }
    }

    onFilterTextChange(text: string) {
        this.filterTextSignal.set(text);
    }

    onFilterOwnerChange(owner: string) {
        this.filterOwnerSignal.set(owner);
    }

    onFilterTypeChange(type: string) {
        this.filterTypeSignal.set(type);
    }

    clearFilters() {
        this.filterTextSignal.set('');
        this.filterOwnerSignal.set('');
        this.filterTypeSignal.set('');
    }

    formatSize(bytes: number): string {
        return this.fileService.formatSize(bytes);
    }

    formatDate(iso: string): string {
        const d = new Date(iso);
        return d.toLocaleString();
    }

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

        return 'insert_drive_file';
    }

    getFileIconColor(extension: string): string {
        const ext = extension.toLowerCase();

        if (ext === 'pdf' || ext === '.pdf') return '#E53935';
        if (['doc', 'docx', '.doc', '.docx'].includes(ext)) return '#1976D2';
        if (['xls', 'xlsx', '.xls', '.xlsx'].includes(ext)) return '#388E3C';
        if (['ppt', 'pptx', '.ppt', '.pptx'].includes(ext)) return '#FF6F00';
        if (['jpg', 'jpeg', 'png', 'gif', '.jpg', '.jpeg', '.png', '.gif'].includes(ext)) return '#F57C00';
        if (['zip', 'rar', '7z', '.zip', '.rar', '.7z'].includes(ext)) return '#757575';

        return '#424242';
    }
}
