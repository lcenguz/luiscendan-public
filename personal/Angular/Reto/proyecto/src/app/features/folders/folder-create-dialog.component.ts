import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FolderService } from '../../core/folders/folder.service';
import { AuthService } from '../../core/auth/auth.service';
import { Folder } from '../../core/folders/folder.models';

@Component({
    standalone: true,
    selector: 'app-folder-create-dialog',
    template: `
    <h2 mat-dialog-title>
      <mat-icon>create_new_folder</mat-icon>
      Nueva Carpeta
    </h2>
    
    <mat-dialog-content>
      <div class="folder-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre de la carpeta</mat-label>
          <input matInput [(ngModel)]="folderName" placeholder="Ej: Documentos 2024" required>
          <mat-icon matPrefix>folder</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción (opcional)</mat-label>
          <textarea matInput [(ngModel)]="description" rows="3" placeholder="Descripción de la carpeta"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Carpeta padre (opcional)</mat-label>
          <mat-select [(ngModel)]="parentId">
            <mat-option [value]="undefined">Raíz (sin carpeta padre)</mat-option>
            @for (folder of userFolders(); track folder.id) {
              <mat-option [value]="folder.id">
                <mat-icon>folder</mat-icon>
                {{ folder.name }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="color-picker">
          <label>Color de la carpeta:</label>
          <div class="color-options">
            @for (color of folderColors; track color.value) {
              <button 
                type="button"
                class="color-btn"
                [class.selected]="selectedColor === color.value"
                [style.background]="color.value"
                (click)="selectedColor = color.value"
                [title]="color.name">
              </button>
            }
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="create()" [disabled]="!folderName.trim()">
        <mat-icon>add</mat-icon>
        Crear Carpeta
      </button>
    </mat-dialog-actions>
  `,
    styles: [`
    .folder-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
      padding: 16px 0;
    }

    .full-width {
      width: 100%;
    }

    .color-picker {
      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #666;
      }
    }

    .color-options {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .color-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 3px solid transparent;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: scale(1.1);
        border-color: #333;
      }

      &.selected {
        border-color: #1976d2;
        box-shadow: 0 0 0 2px white, 0 0 0 4px #1976d2;
      }
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      
      mat-icon {
        color: #1976d2;
      }
    }
  `],
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
})
export class FolderCreateDialogComponent {
    private dialogRef = inject(MatDialogRef<FolderCreateDialogComponent>);
    private folderService = inject(FolderService);
    private authService = inject(AuthService);

    folderName = '';
    description = '';
    parentId?: string;
    selectedColor = '#2196F3';

    folderColors = [
        { name: 'Azul', value: '#2196F3' },
        { name: 'Verde', value: '#4CAF50' },
        { name: 'Naranja', value: '#FF9800' },
        { name: 'Rojo', value: '#F44336' },
        { name: 'Morado', value: '#9C27B0' },
        { name: 'Cyan', value: '#00BCD4' },
        { name: 'Rosa', value: '#E91E63' },
        { name: 'Gris', value: '#607D8B' },
    ];

    userFolders = signal<Folder[]>([]);

    constructor() {
        const userId = this.authService.currentUser()?.id;
        if (userId) {
            this.userFolders.set(this.folderService.getUserFolders(userId));
        }
    }

    create(): void {
        const userId = this.authService.currentUser()?.id;
        if (!userId || !this.folderName.trim()) return;

        const folder = this.folderService.createFolder(
            this.folderName.trim(),
            userId,
            this.description.trim() || undefined,
            this.parentId,
            this.selectedColor,
            'folder'
        );

        this.dialogRef.close(folder);
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
