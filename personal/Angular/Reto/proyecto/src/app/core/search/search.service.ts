import { Injectable } from '@angular/core';
import { FileService } from '../files/file.service';
import { AuthService } from '../auth/auth.service';

export interface SearchResult {
    type: 'document' | 'folder' | 'user';
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    data: any;
}

@Injectable({ providedIn: 'root' })
export class SearchService {

    constructor(
        private fileService: FileService,
        private authService: AuthService
    ) { }

    /**
     * Busca en todos los recursos
     */
    search(query: string): SearchResult[] {
        if (!query || query.length < 2) {
            return [];
        }

        const q = query.toLowerCase();
        const results: SearchResult[] = [];

        const documents = this.fileService.files()
            .filter(f =>
                f.status === 'ACTIVE' && (
                    f.displayName.toLowerCase().includes(q) ||
                    f.fileName.toLowerCase().includes(q) ||
                    f.tags.some(t => t.toLowerCase().includes(q)) ||
                    (f.description?.toLowerCase() || '').includes(q)
                )
            )
            .slice(0, 5);

        documents.forEach(doc => {
            results.push({
                type: 'document',
                id: doc.id,
                title: doc.displayName,
                subtitle: doc.path,
                icon: 'insert_drive_file',
                data: doc,
            });
        });

        const users = this.authService.getAllUsers()
            .filter(u =>
                u.displayName.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            )
            .slice(0, 3);

        users.forEach(user => {
            results.push({
                type: 'user',
                id: user.id,
                title: user.displayName,
                subtitle: user.email,
                icon: 'person',
                data: user,
            });
        });

        return results;
    }

    /**
     * Búsqueda agrupada por tipo
     */
    searchGrouped(query: string): Map<string, SearchResult[]> {
        const results = this.search(query);
        const grouped = new Map<string, SearchResult[]>();

        results.forEach(result => {
            const key = this.getGroupLabel(result.type);
            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key)!.push(result);
        });

        return grouped;
    }

    private getGroupLabel(type: string): string {
        const labels: Record<string, string> = {
            'document': 'Documentos',
            'folder': 'Carpetas',
            'user': 'Usuarios',
        };
        return labels[type] || type;
    }
}
