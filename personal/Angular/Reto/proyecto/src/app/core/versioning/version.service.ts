import { Injectable, signal } from '@angular/core';
import { FileVersion } from './version.models';

@Injectable({ providedIn: 'root' })
export class VersionService {
    private versionsSignal = signal<FileVersion[]>([]);

    createVersion(fileId: string, content: string, size: number, userId: string, comment: string): FileVersion {
        const existingVersions = this.getVersions(fileId);
        const latestVersion = existingVersions.length > 0
            ? Math.max(...existingVersions.map(v => v.version))
            : 0;

        const version: FileVersion = {
            id: crypto.randomUUID(),
            fileId,
            version: latestVersion + 1,
            content,
            size,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            comment,
        };

        this.versionsSignal.update(v => [...v, version]);
        return version;
    }

    getVersions(fileId: string): FileVersion[] {
        return this.versionsSignal()
            .filter(v => v.fileId === fileId)
            .sort((a, b) => b.version - a.version);
    }

    getVersion(versionId: string): FileVersion | undefined {
        return this.versionsSignal().find(v => v.id === versionId);
    }

    restoreVersion(versionId: string): FileVersion | undefined {
        return this.getVersion(versionId);
    }
}
