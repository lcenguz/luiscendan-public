import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VersionService } from '../../core/files/version.service';
import { FileVersion } from '../../core/files/version.models';
import { FileService } from '../../core/files/file.service';

interface VersionDialogData {
    fileId: string;
    fileName: string;
}

@Component({
    standalone: true,
    selector: 'app-version-history-dialog',
    templateUrl: './version-history-dialog.html',
    styleUrls: ['./version-history-dialog.scss'],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatTooltipModule,
    ],
})
export class VersionHistoryDialogComponent {
    private versionService = inject(VersionService);
    private fileService = inject(FileService);
    private dialogRef = inject(MatDialogRef<VersionHistoryDialogComponent>);

    versions: FileVersion[] = [];
    displayedColumns: string[] = ['version', 'changes', 'date', 'author', 'actions'];

    constructor(@Inject(MAT_DIALOG_DATA) public data: VersionDialogData) {
        this.loadVersions();
    }

    loadVersions() {
        this.versions = this.versionService.getFileVersions(this.data.fileId);
    }

    restoreVersion(version: FileVersion) {
        if (confirm(`¿Restaurar el archivo a la versión ${version.version}?`)) {
            const versionData = this.versionService.getVersionData(version.id);
            if (versionData) {
                this.fileService.updateMetadata(this.data.fileId, versionData);
                this.dialogRef.close({ restored: true, version });
            }
        }
    }

    formatDate(iso: string): string {
        const date = new Date(iso);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    close() {
        this.dialogRef.close();
    }
}
