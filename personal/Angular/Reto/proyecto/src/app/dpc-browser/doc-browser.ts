import {
  AfterViewInit,
  Component,
  ViewChild,
  computed,
  effect,
} from '@angular/core';

import { DocumentDataService } from '../core/data/document-data.service';
import { FolderNode, DocumentItem, DocumentStatus } from '../core/data/document.models';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';

import { SelectionModel } from '@angular/cdk/collections';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

interface FolderTreeNode {
  id: string;
  name: string;
  children?: FolderTreeNode[];
}

interface TableFilterState {
  text: string;          // filtro de texto
  status: string;        // 'ALL' | DocumentStatus
  extension: string;     // 'ALL' | ext
  owner: string;         // 'ALL' | owner
}

@Component({
  standalone: true,
  selector: 'app-doc-browser',
  templateUrl: './doc-browser.html',
  styleUrls: ['./doc-browser.scss'],
  imports: [
    MatCardModule,
    MatIconModule,
    MatTreeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
})
export class DocBrowserComponent implements AfterViewInit {

  selectedFolderId = computed(() => this.dataService.selectedFolderId());

  currentFolderLabel = computed(() => {
    const id = this.selectedFolderId();

    if (!id) {
      return 'Ninguna carpeta seleccionada';
    }

    if (id === 'root') {
      return 'Raíz (solo carpetas, sin documentos)';
    }

    const folder = this.dataService.getFolderById(id);
    return folder ? folder.name : 'Carpeta desconocida';
  });

  get documentsCount(): number {
    return this.dataSource.data.length;
  }

  treeControl = new NestedTreeControl<FolderTreeNode>(node => node.children);
  treeDataSource = new MatTreeNestedDataSource<FolderTreeNode>();

  dataSource = new MatTableDataSource<DocumentItem>();
  displayedColumns = ['select', 'name', 'extension', 'size', 'status', 'owner', 'updatedAt'];
  selection = new SelectionModel<DocumentItem>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterText = '';
  filterStatus: 'ALL' | DocumentStatus = 'ALL';
  filterExtension: 'ALL' | string = 'ALL';
  filterOwner: 'ALL' | string = 'ALL';

  statusOptions: DocumentStatus[] = ['ACTIVE', 'ARCHIVED', 'DELETED'];
  extensionOptions: string[] = [];
  ownerOptions: string[] = [];

  constructor(private dataService: DocumentDataService) {

    const allDocs = this.dataService.documents();
    this.extensionOptions = Array.from(
      new Set(allDocs.map(d => d.extension)),
    ).sort();

    this.ownerOptions = Array.from(
      new Set(allDocs.map(d => d.owner)),
    ).sort();

    effect(() => {
      const docs = this.dataService.documentsInSelectedFolder();
      this.dataSource.data = docs;
      this.selection.clear();
      if (this.paginator) {
        this.paginator.firstPage();
      }

      this.updateTableFilter();
    });

    effect(() => {
      const folders = this.dataService.folders();
      const tree = this.buildFolderTree(folders);
      this.treeDataSource.data = tree;
      if (tree.length > 0) {
        this.treeControl.expand(tree[0]);
      }
    });

    this.dataSource.filterPredicate = (doc: DocumentItem, filterJson: string) => {
      let filter: TableFilterState = {
        text: '',
        status: 'ALL',
        extension: 'ALL',
        owner: 'ALL',
      };

      if (filterJson) {
        try {
          filter = JSON.parse(filterJson) as TableFilterState;
        } catch {

        }
      }

      const normalizedText = filter.text.trim().toLowerCase();
      if (normalizedText) {
        const composite = `${doc.name} ${doc.owner} ${doc.extension} ${doc.status}`.toLowerCase();
        if (!composite.includes(normalizedText)) {
          return false;
        }
      }

      if (filter.status !== 'ALL' && doc.status !== filter.status) {
        return false;
      }

      if (filter.extension !== 'ALL' && doc.extension !== filter.extension) {
        return false;
      }

      if (filter.owner !== 'ALL' && doc.owner !== filter.owner) {
        return false;
      }

      return true;
    };
    console.log("DEBUG - docs mock:", this.dataService.documents());
    console.log("DEBUG - carpeta seleccionada:", this.selectedFolderId());

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.updateTableFilter();
  }

  private buildFolderTree(flatFolders: FolderNode[]): FolderTreeNode[] {
    const nodesById = new Map<string, FolderTreeNode>();

    flatFolders.forEach(f => {
      nodesById.set(f.id, {
        id: f.id,
        name: f.name,
        children: [],
      });
    });

    const roots: FolderTreeNode[] = [];

    flatFolders.forEach(f => {
      const node = nodesById.get(f.id)!;
      if (f.parentId === null) {
        roots.push(node);
      } else {
        const parentNode = nodesById.get(f.parentId);
        if (parentNode) {
          parentNode.children ??= [];
          parentNode.children.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    return roots;
  }

  hasChild = (_index: number, node: FolderTreeNode) =>
    !!node.children && node.children.length > 0;

  onFolderClick(node: FolderTreeNode) {
    this.dataService.selectFolder(node.id);
  }

  isFolderSelected(node: FolderTreeNode): boolean {
    return this.selectedFolderId() === node.id;
  }

  private updateTableFilter() {
    const filterState: TableFilterState = {
      text: this.filterText.trim().toLowerCase(),
      status: this.filterStatus,
      extension: this.filterExtension,
      owner: this.filterOwner,
    };

    this.dataSource.filter = JSON.stringify(filterState);

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  onFilterTextChange(value: string) {
    this.filterText = value;
    this.updateTableFilter();
  }

  onStatusFilterChange(value: 'ALL' | DocumentStatus) {
    this.filterStatus = value;
    this.updateTableFilter();
  }

  onExtensionFilterChange(value: 'ALL' | string) {
    this.filterExtension = value;
    this.updateTableFilter();
  }

  onOwnerFilterChange(value: 'ALL' | string) {
    this.filterOwner = value;
    this.updateTableFilter();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numRows > 0 && numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
  }

  toggleRow(row: DocumentItem) {
    this.selection.toggle(row);
  }

  isRowSelected(row: DocumentItem): boolean {
    return this.selection.isSelected(row);
  }

  selectedCount(): number {
    return this.selection.selected.length;
  }

  bulkArchive() {
    const ids = this.selection.selected.map(d => d.id);
    this.dataService.bulkUpdateDocumentStatus(ids, 'ARCHIVED');
    this.selection.clear();
  }

  bulkMarkDeleted() {
    const ids = this.selection.selected.map(d => d.id);
    this.dataService.bulkUpdateDocumentStatus(ids, 'DELETED');
    this.selection.clear();
  }

  bulkMarkActive() {
    const ids = this.selection.selected.map(d => d.id);
    this.dataService.bulkUpdateDocumentStatus(ids, 'ACTIVE');
    this.selection.clear();
  }

  clearSelection() {
    this.selection.clear();
  }

  formatSize(size: number): string {
    if (size < 1024) return `${size} B`;
    const kb = size / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(1)} GB`;
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }
}
