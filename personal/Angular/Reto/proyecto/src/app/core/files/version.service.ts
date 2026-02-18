import { Injectable, signal } from '@angular/core';
import { FileVersion, VersionMetadata } from './version.models';
import { FileDocument } from './file.models';

const VERSIONS_KEY = 'luiscendan-drive-versions';

@Injectable({ providedIn: 'root' })
export class VersionService {
    private versionsSignal = signal<FileVersion[]>(this.loadVersions());

    /**
     * Crea una nueva versión de un documento
     * @param file El documento completo (lo recibe desde FileService)
     */
    createVersion(
        file: FileDocument,
        metadata: VersionMetadata,
        changeDescription: string,
        userId: string,
        userName: string
    ): FileVersion {
        const existingVersions = this.getFileVersions(file.id);
        const versionNumber = existingVersions.length + 1;

        const version: FileVersion = {
            id: crypto.randomUUID(),
            fileId: file.id,
            version: versionNumber,
            displayName: metadata.displayName || file.displayName,
            description: (metadata.description !== undefined ? metadata.description : file.description) || '',
            tags: metadata.tags || file.tags,
            createdAt: new Date().toISOString(),
            createdBy: userId,
            createdByName: userName,
            changeDescription,
            metadata: { ...metadata },
        };

        const updated = [version, ...this.versionsSignal()];
        this.versionsSignal.set(updated);
        this.saveVersions(updated);

        return version;
    }

    /**
     * Obtiene todas las versiones de un archivo
     */
    getFileVersions(fileId: string): FileVersion[] {
        return this.versionsSignal()
            .filter(v => v.fileId === fileId)
            .sort((a, b) => b.version - a.version); // Más reciente primero
    }

    /**
     * Obtiene datos de una versión para restaurar
     * Devuelve los metadatos sin actualizar directamente el archivo
     */
    getVersionData(versionId: string): VersionMetadata | null {
        const version = this.versionsSignal().find(v => v.id === versionId);
        if (!version) {
            return null;
        }

        return {
            displayName: version.displayName,
            description: version.description,
            tags: version.tags,
        };
    }

    /**
     * Elimina todas las versiones de un archivo
     */
    deleteFileVersions(fileId: string): void {
        const updated = this.versionsSignal().filter(v => v.fileId !== fileId);
        this.versionsSignal.set(updated);
        this.saveVersions(updated);
    }

    /**
     * Compara metadatos para detectar cambios importantes
     */
    hasSignificantChanges(oldMeta: VersionMetadata, newMeta: VersionMetadata): boolean {
        return (
            oldMeta.displayName !== newMeta.displayName ||
            oldMeta.description !== newMeta.description ||
            JSON.stringify(oldMeta.tags?.sort()) !== JSON.stringify(newMeta.tags?.sort())
        );
    }

    /**
     * Genera descripción automática de cambios
     */
    generateChangeDescription(oldMeta: VersionMetadata, newMeta: VersionMetadata): string {
        const changes: string[] = [];

        if (oldMeta.displayName !== newMeta.displayName) {
            changes.push(`Nombre: "${oldMeta.displayName}" → "${newMeta.displayName}"`);
        }

        if (oldMeta.description !== newMeta.description) {
            changes.push('Descripción actualizada');
        }

        if (JSON.stringify(oldMeta.tags?.sort()) !== JSON.stringify(newMeta.tags?.sort())) {
            changes.push('Etiquetas modificadas');
        }

        return changes.length > 0 ? changes.join(', ') : 'Sin cambios';
    }

    private loadVersions(): FileVersion[] {
        const raw = localStorage.getItem(VERSIONS_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    }

    private saveVersions(versions: FileVersion[]): void {

        const versionsByFile = new Map<string, FileVersion[]>();

        versions.forEach(v => {
            if (!versionsByFile.has(v.fileId)) {
                versionsByFile.set(v.fileId, []);
            }
            versionsByFile.get(v.fileId)!.push(v);
        });

        const limited: FileVersion[] = [];
        versionsByFile.forEach((fileVersions) => {
            limited.push(...fileVersions.slice(0, 50));
        });

        localStorage.setItem(VERSIONS_KEY, JSON.stringify(limited));
    }
}
