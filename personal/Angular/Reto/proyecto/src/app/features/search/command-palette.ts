import { Component, HostListener, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { SearchService, SearchResult } from '../../core/search/search.service';

@Component({
    standalone: true,
    selector: 'app-command-palette',
    templateUrl: './command-palette.html',
    styleUrls: ['./command-palette.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatDialogModule,
    ],
})
export class CommandPaletteComponent {
    private querySignal = signal<string>('');
    query = computed(() => this.querySignal());

    selectedIndexSignal = signal<number>(0); // Público para el template
    selectedIndex = computed(() => this.selectedIndexSignal());

    groupedResults = computed(() => {
        const q = this.querySignal();
        if (!q || q.length < 2) {
            return new Map<string, SearchResult[]>();
        }
        return this.searchService.searchGrouped(q);
    });

    flatResults = computed(() => {
        const results: SearchResult[] = [];
        this.groupedResults().forEach(group => {
            results.push(...group);
        });
        return results;
    });

    constructor(
        private searchService: SearchService,
        private router: Router,
        private dialogRef: MatDialogRef<CommandPaletteComponent>
    ) { }

    ngAfterViewInit() {
        setTimeout(() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            input?.focus();
        }, 100);
    }

    onQueryChange(value: string) {
        this.querySignal.set(value);
        this.selectedIndexSignal.set(0);
    }

    @HostListener('document:keydown.escape')
    onEscape() {
        this.close();
    }

    @HostListener('document:keydown.arrowDown')
    onArrowDown(event?: KeyboardEvent) {
        event?.preventDefault();
        const max = this.flatResults().length - 1;
        const current = this.selectedIndexSignal();
        if (current < max) {
            this.selectedIndexSignal.set(current + 1);
        }
    }

    @HostListener('document:keydown.arrowUp')
    onArrowUp(event?: KeyboardEvent) {
        event?.preventDefault();
        const current = this.selectedIndexSignal();
        if (current > 0) {
            this.selectedIndexSignal.set(current - 1);
        }
    }

    @HostListener('document:keydown.enter')
    onEnter(event?: KeyboardEvent) {
        event?.preventDefault();
        const selected = this.flatResults()[this.selectedIndexSignal()];
        if (selected) {
            this.selectResult(selected);
        }
    }

    selectResult(result: SearchResult) {
        switch (result.type) {
            case 'document':
                // Navegar al file-manager y seleccionar el documento
                this.router.navigate(['/file-manager'], {
                    queryParams: { fileId: result.data.id }
                });
                break;
            case 'folder':
                // Navegar a la carpeta
                this.router.navigate(['/file-manager'], {
                    queryParams: { folderId: result.data.id }
                });
                break;
            case 'user':
                // Navegar al admin si es admin, sino mostrar info
                this.router.navigate(['/admin'], {
                    queryParams: { userId: result.data.id }
                });
                break;
        }
        this.close();
    }

    isSelected(result: SearchResult): boolean {
        const flat = this.flatResults();
        const index = flat.indexOf(result);
        return index === this.selectedIndexSignal();
    }

    close() {
        this.dialogRef.close();
    }

    getGroupArray(): Array<{ key: string; results: SearchResult[] }> {
        const groups = this.groupedResults();
        const array: Array<{ key: string; results: SearchResult[] }> = [];
        groups.forEach((results, key) => {
            array.push({ key, results });
        });
        return array;
    }
}
