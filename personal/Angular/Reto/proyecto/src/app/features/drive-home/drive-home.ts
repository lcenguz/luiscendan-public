import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

import { AuthService } from '../../core/auth/auth.service';
import { FileService } from '../../core/files/file.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { NotificationCenterComponent } from '../notifications/notification-center.component';

interface NavigationCard {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  route: string;
  roles?: string[];
  badge?: number;
}

@Component({
  standalone: true,
  selector: 'app-drive-home',
  templateUrl: './drive-home.html',
  styleUrls: ['./drive-home.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    NotificationCenterComponent,
  ],
})
export class DriveHomeComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fileService = inject(FileService);
  private notificationService = inject(NotificationService);

  user = this.auth.currentUser();

  activeFilesCount = computed(() => {
    return this.fileService.files().filter(f => f.status === 'ACTIVE').length;
  });

  trashCount = computed(() => {
    return this.fileService.files().filter(f => f.status === 'DELETED').length;
  });

  unreadNotifications = computed(() => {
    return this.notificationService.unreadCount();
  });

  navigationCards = computed<NavigationCard[]>(() => {
    const cards: NavigationCard[] = [
      {
        title: 'Gestor de Archivos',
        description: 'Sube, gestiona y organiza tus documentos',
        icon: 'folder_open',
        iconColor: '#1976d2',
        route: '/file-manager',
        badge: this.activeFilesCount(),
      },
      {
        title: 'Compartido Conmigo',
        description: 'Documentos que otros han compartido contigo',
        icon: 'group',
        iconColor: '#388e3c',
        route: '/shared',
      },
      {
        title: 'Papelera',
        description: 'Restaura o elimina archivos definitivamente',
        icon: 'delete',
        iconColor: '#d32f2f',
        route: '/trash',
        badge: this.trashCount(),
      },
    ];

    if (this.hasRole(['ADMIN', 'MANAGER'])) {
      cards.push({
        title: 'Dashboard',
        description: 'Métricas y estadísticas del sistema',
        icon: 'dashboard',
        iconColor: '#f57c00',
        route: '/dashboard',
        roles: ['ADMIN', 'MANAGER'],
      });

      cards.push({
        title: 'Auditoría',
        description: 'Registro completo de actividad del sistema',
        icon: 'fact_check',
        iconColor: '#7b1fa2',
        route: '/audit',
        roles: ['ADMIN', 'MANAGER'],
      });
    }

    if (this.hasRole(['ADMIN'])) {
      cards.push({
        title: 'Administración',
        description: 'Gestión completa de usuarios del sistema',
        icon: 'admin_panel_settings',
        iconColor: '#2894c6ff',
        route: '/admin/users',
        roles: ['ADMIN'],
      });
    }

    return cards;
  });

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  hasRole(roles: string[]): boolean {
    return roles.includes(this.user?.role || '');
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
