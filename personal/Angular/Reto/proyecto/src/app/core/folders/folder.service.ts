import { Injectable, signal, computed } from '@angular/core';
import { Folder, FolderTree } from './folder.models';

const FOLDERS_KEY = 'luiscendan-drive-folders';

@Injectable({ providedIn: 'root' })
export class FolderService {
    private foldersSignal = signal<Folder[]>(this.loadFolders());

    folders = computed(() => this.foldersSignal());

    /**
     * Obtiene una carpeta por ID
     */
    getFolderById(id: string): Folder | undefined {
        return this.foldersSignal().find(f => f.id === id);
    }

    /**
     * Obtiene carpetas de un usuario
     */
    getUserFolders(userId: string): Folder[] {
        return this.foldersSignal().filter(f => f.ownerId === userId);
    }

    /**
     * Obtiene subcarpetas de una carpeta
     */
    getSubfolders(parentId?: string): Folder[] {
        return this.foldersSignal().filter(f => f.parentId === parentId);
    }

    /**
     * Crea una nueva carpeta
     */
    createFolder(
        name: string,
        ownerId: string,
        description?: string,
        parentId?: string,
        color?: string,
        icon?: string
    ): Folder {
        const folder: Folder = {
            id: crypto.randomUUID(),
            name,
            description,
            parentId,
            ownerId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            color,
            icon,
        };

        const updated = [...this.foldersSignal(), folder];
        this.foldersSignal.set(updated);
        this.saveFolders(updated);

        return folder;
    }

    /**
     * Actualiza una carpeta
     */
    updateFolder(id: string, updates: Partial<Folder>): void {
        const updated = this.foldersSignal().map(f =>
            f.id === id
                ? { ...f, ...updates, updatedAt: new Date().toISOString() }
                : f
        );
        this.foldersSignal.set(updated);
        this.saveFolders(updated);
    }

    /**
     * Elimina una carpeta
     */
    deleteFolder(id: string): void {
        const updated = this.foldersSignal().filter(f => f.id !== id);
        this.foldersSignal.set(updated);
        this.saveFolders(updated);
    }

    /**
     * Construye árbol de carpetas
     */
    buildFolderTree(userId: string, filesByFolder: Map<string, string[]>): FolderTree[] {
        const userFolders = this.getUserFolders(userId);
        const rootFolders = userFolders.filter(f => !f.parentId);

        const buildTree = (folder: Folder): FolderTree => {
            const children = userFolders
                .filter(f => f.parentId === folder.id)
                .map(buildTree);

            return {
                ...folder,
                children,
                files: filesByFolder.get(folder.id) || [],
            };
        };

        return rootFolders.map(buildTree);
    }

    /**
     * Obtiene la ruta completa de una carpeta
     */
    getFolderPath(folderId: string): string[] {
        const path: string[] = [];
        let currentId: string | undefined = folderId;

        while (currentId) {
            const folder = this.getFolderById(currentId);
            if (!folder) break;
            path.unshift(folder.name);
            currentId = folder.parentId;
        }

        return path;
    }

    private loadFolders(): Folder[] {
        const raw = localStorage.getItem(FOLDERS_KEY);
        if (!raw) return this.createDefaultFolders();
        try {
            return JSON.parse(raw);
        } catch {
            return this.createDefaultFolders();
        }
    }

    private saveFolders(folders: Folder[]): void {
        localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
    }

    private createDefaultFolders(): Folder[] {

        return [];
    }
}
