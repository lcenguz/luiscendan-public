import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

import { PermissionService } from '../../core/permissions/permission.service';
import { AuthService } from '../../core/auth/auth.service';
import { PermissionLevel } from '../../core/permissions/permission.models';
import { Folder } from '../../core/folders/folder.models';
import { PermissionLevelBadgeComponent } from '../permissions/permission-level-badge.component';

@Component({
  standalone: true,
  selector: 'app-folder-permissions-dialog',
  template: `
    <h2 mat-dialog-title>
      <mat-icon [style.color]="data.folder.color || '#2196F3'">folder</mat-icon>
      Permisos de "{{ data.folder.name }}"
    </h2>

    <mat-dialog-content>
      <div class="permissions-container">
        
        <!-- Info sobre herencia -->
        <div class="info-box">
          <mat-icon>info</mat-icon>
          <div>
            <strong>Herencia de permisos</strong>
            <p>Los documentos en esta carpeta heredarán estos permisos automáticamente, a menos que tengan permisos explícitos asignados.</p>
          </div>
        </div>

        <!-- Lista de permisos actuales -->
        <div class="current-permissions">
          <h3>
            <mat-icon>people</mat-icon>
            Usuarios con acceso ({{ folderPermissions().length }})
          </h3>

          @if (folderPermissions().length === 0) {
            <div class="empty-state">
              <mat-icon>lock</mat-icon>
              <p>No hay permisos compartidos para esta carpeta</p>
              <small>Solo el propietario tiene acceso</small>
            </div>
          } @else {
            <div class="permissions-list">
              @for (perm of folderPermissions(); track perm.id) {
                <div class="permission-item">
                  <div class="user-info">
                    <mat-icon>person</mat-icon>
                    <span class="user-email">{{ perm.userEmail }}</span>
                  </div>
                  <div class="permission-actions">
                    <app-permission-level-badge [level]="perm.level"></app-permission-level-badge>
                    <button 
                      mat-icon-button 
                      color="warn"
                      (click)="revokePermission(perm.id)"
                      matTooltip="Revocar acceso">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Agregar nuevo permiso -->
        <div class="add-permission">
          <h3>
            <mat-icon>person_add</mat-icon>
            Compartir con usuario
          </h3>
          
          <div class="add-form">
            <mat-form-field appearance="outline" class="user-select">
              <mat-label>Seleccionar usuario</mat-label>
              <mat-select [(ngModel)]="selectedUserId">
                <mat-option [value]="undefined">-- Selecciona un usuario --</mat-option>
                @for (user of availableUsers(); track user.id) {
                  <mat-option [value]="user.id">
                    <mat-icon>person</mat-icon>
                    {{ user.email }} ({{ user.displayName }})
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="level-select">
              <mat-label>Nivel de permiso</mat-label>
              <mat-select [(ngModel)]="selectedLevel">
                <mat-option value="VIEW">
                  <mat-icon>visibility</mat-icon>
                  Solo lectura
                </mat-option>
                <mat-option value="EDIT">
                  <mat-icon>edit</mat-icon>
                  Editar
                </mat-option>
                <mat-option value="ADMIN">
                  <mat-icon>admin_panel_settings</mat-icon>
                  Administrador
                </mat-option>
              </mat-select>
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary"
              (click)="grantPermission()"
              [disabled]="!selectedUserId || !selectedLevel">
              <mat-icon>add</mat-icon>
              Agregar
            </button>
          </div>
        </div>

        <!-- Documentos afectados -->
        <div class="affected-files">
          <h3>
            <mat-icon>description</mat-icon>
            Documentos que heredarán estos permisos
          </h3>
          <p class="info-text">
            Los cambios en los permisos de esta carpeta afectarán a todos los documentos que no tengan permisos explícitos.
          </p>
        </div>

      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .permissions-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      min-width: 600px;
      max-width: 800px;
      padding: 16px 0;
    }

    .info-box {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #e3f2fd;
      border-left: 4px solid #2196F3;
      border-radius: 4px;

      mat-icon {
        color: #2196F3;
      }

      strong {
        display: block;
        margin-bottom: 4px;
        color: #1565c0;
      }

      p {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
      }
    }

    .current-permissions, .add-permission, .affected-files {
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 16px 0;
        font-size: 1.1rem;
        color: #333;

        mat-icon {
          color: #666;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: #999;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 8px;
        opacity: 0.5;
      }

      p {
        margin: 8px 0 4px 0;
        font-size: 1rem;
      }

      small {
        font-size: 0.85rem;
      }
    }

    .permissions-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .permission-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f5f5f5;
      border-radius: 8px;
      transition: background 0.2s;

      &:hover {
        background: #eeeeee;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;

      mat-icon {
        color: #666;
      }

      .user-email {
        font-weight: 500;
      }
    }

    .permission-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .add-form {
      display: flex;
      gap: 12px;
      align-items: flex-start;

      .user-select {
        flex: 2;
      }

      .level-select {
        flex: 1;
      }

      button {
        margin-top: 8px;
      }
    }

    .info-text {
      margin: 0;
      padding: 12px;
      background: #fff3e0;
      border-radius: 4px;
      font-size: 0.9rem;
      color: #666;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 12px;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }
  `],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    PermissionLevelBadgeComponent,
  ],
})
export class FolderPermissionsDialogComponent {
  private dialogRef = inject(MatDialogRef<FolderPermissionsDialogComponent>);
  data: { folder: Folder } = inject(MAT_DIALOG_DATA);

  private permissionService = inject(PermissionService);
  private authService = inject(AuthService);

  selectedUserId?: string;
  selectedLevel: PermissionLevel = 'VIEW';

  folderPermissions = computed(() => {
    return this.permissionService.getFolderPermissions(this.data.folder.id);
  });

  availableUsers = computed(() => {
    const currentUserId = this.authService.currentUser()?.id;
    const usersWithPermission = this.folderPermissions().map(p => p.userId);

    return this.authService.getAllUsers().filter(u =>
      u.id !== currentUserId &&
      u.id !== this.data.folder.ownerId &&
      !usersWithPermission.includes(u.id)
    );
  });

  grantPermission(): void {
    if (!this.selectedUserId || !this.selectedLevel) return;

    this.permissionService.grantFolderPermission(
      this.data.folder.id,
      this.selectedUserId,
      this.selectedLevel
    );

    this.selectedUserId = undefined;
    this.selectedLevel = 'VIEW';
  }

  revokePermission(permissionId: string): void {
    if (!confirm('¿Revocar este permiso? Los documentos que heredan este permiso perderán el acceso.')) {
      return;
    }

    this.permissionService.revokeFolderPermission(permissionId);
  }

  close(): void {
    this.dialogRef.close();
  }
}
