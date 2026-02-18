import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/notifications/notification.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-notification-center',
  template: `
    <div class="notification-wrapper">
      <button 
        mat-icon-button 
        (click)="toggleMenu()"
        class="position-relative">
        <mat-icon>notifications</mat-icon>
        @if (userUnreadCount() > 0) {
          <span class="notification-badge">{{ userUnreadCount() }}</span>
        }
      </button>

      @if (isOpen()) {
        <div class="notification-panel" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="notification-header">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div class="d-flex align-items-center gap-2">
                <mat-icon>notifications_active</mat-icon>
                <h6 class="mb-0">Notificaciones</h6>
              </div>
              @if (userUnreadCount() > 0) {
                <span class="badge bg-light text-dark">{{ userUnreadCount() }}</span>
              }
            </div>
            
            @if (userNotifications().length > 0) {
              <div class="d-flex gap-2">
                @if (userUnreadCount() > 0) {
                  <button 
                    class="btn btn-sm btn-light"
                    (click)="markAllAsRead()">
                    <mat-icon class="small-icon">done_all</mat-icon>
                    Marcar todas
                  </button>
                }
                <button 
                  class="btn btn-sm btn-light"
                  (click)="clearAll()">
                  <mat-icon class="small-icon">clear_all</mat-icon>
                  Limpiar
                </button>
              </div>
            }
          </div>

          <hr class="my-0">

          <!-- List -->
          <div class="notification-list">
            @if (userNotifications().length === 0) {
              <div class="empty-state text-center py-4">
                <mat-icon class="empty-icon">notifications_off</mat-icon>
                <p class="mb-0 text-muted">No hay notificaciones</p>
              </div>
            } @else {
              @for (notification of userNotifications(); track notification.id) {
                <div 
                  class="notification-item"
                  [class.unread]="!notification.read"
                  (click)="handleNotificationClick(notification)">
                  
                  <div class="d-flex align-items-start gap-3">
                    <!-- Icon -->
                    <div [class]="'icon-wrapper ' + getNotificationTypeClass(notification.type)">
                      <mat-icon>{{ getNotificationIcon(notification.type) }}</mat-icon>
                    </div>

                    <!-- Content -->
                    <div class="flex-grow-1">
                      <div class="notification-title">{{ notification.title }}</div>
                      <div class="notification-message">{{ notification.message }}</div>
                      <small class="text-muted">
                        <mat-icon class="small-icon">schedule</mat-icon>
                        {{ formatDate(notification.timestamp) }}
                      </small>
                    </div>

                    <!-- Unread indicator -->
                    @if (!notification.read) {
                      <span class="unread-dot"></span>
                    }
                  </div>

                  <!-- Delete button -->
                  <button 
                    class="btn btn-sm btn-link delete-btn"
                    (click)="deleteNotification(notification.id, $event)">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              }
            }
          </div>
        </div>
      }

      <!-- Backdrop -->
      @if (isOpen()) {
        <div class="notification-backdrop" (click)="closeMenu()"></div>
      }
    </div>
  `,
  styles: [`
    .notification-wrapper {
      position: relative;
    }

    .notification-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #f44336;
      color: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      z-index: 10;
    }

    .notification-panel {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      width: 400px;
      max-height: 600px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      z-index: 1050;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .notification-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1040;
      background: transparent;
    }

    .notification-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      border-radius: 8px 8px 0 0;
    }

    .notification-header h6 {
      color: white;
      font-weight: 600;
    }

    .notification-header .btn {
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
    }

    .notification-header .btn:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .notification-header mat-icon {
      color: white;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .notification-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .empty-state {
      padding: 48px 24px;
    }

    .empty-icon {
      font-size: 48px !important;
      width: 48px !important;
      height: 48px !important;
      opacity: 0.3;
      color: #999;
    }

    .notification-item {
      position: relative;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background 0.2s;
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notification-item.unread {
      background: #e3f2fd;
      border-left: 3px solid #2196F3;
    }

    .notification-item:hover {
      background: #fafafa;
    }

    .notification-item:hover .delete-btn {
      opacity: 1;
    }

    .icon-wrapper {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-wrapper mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .type-success {
      background: #e8f5e9;
      color: #4caf50;
    }

    .type-info {
      background: #e3f2fd;
      color: #2196f3;
    }

    .type-warning {
      background: #fff3e0;
      color: #ff9800;
    }

    .type-error {
      background: #ffebee;
      color: #f44336;
    }

    .type-share {
      background: #f3e5f5;
      color: #9c27b0;
    }

    .notification-title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
      color: #212121;
    }

    .notification-message {
      font-size: 13px;
      color: #666;
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .small-icon {
      font-size: 14px !important;
      width: 14px !important;
      height: 14px !important;
      vertical-align: middle;
      margin-right: 4px;
    }

    .unread-dot {
      width: 8px;
      height: 8px;
      background: #2196F3;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .delete-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      opacity: 0;
      transition: opacity 0.2s;
      padding: 4px !important;
      min-width: auto !important;
    }

    .delete-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #999;
    }

    .delete-btn:hover mat-icon {
      color: #f44336;
    }
  `],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class NotificationCenterComponent {
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isOpen = signal(false);

  userNotifications = computed(() => {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return [];
    return this.notificationService.getUserNotifications(currentUser.id)();
  });

  userUnreadCount = computed(() => {
    return this.userNotifications().filter(n => !n.read).length;
  });

  toggleMenu() {
    this.isOpen.update(v => !v);
  }

  closeMenu() {
    this.isOpen.set(false);
  }

  markAllAsRead() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.notificationService.markAllAsRead(currentUser.id);
    }
  }

  clearAll() {
    if (confirm('¿Estás seguro de que quieres eliminar todas las notificaciones?')) {
      const currentUser = this.authService.currentUser();
      if (currentUser) {
        this.notificationService.clear(currentUser.id);
      }
    }
  }

  deleteNotification(id: string, event: Event) {
    event.stopPropagation();
    this.notificationService.deleteNotification(id);
  }

  handleNotificationClick(notification: any) {
    this.notificationService.markAsRead(notification.id);
    if (notification.actionUrl) {
      this.router.navigate([notification.actionUrl]);
    }
    this.closeMenu();
  }

  viewAllNotifications() {
    console.log('Ver todas las notificaciones');
    this.closeMenu();
  }

  formatDate(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      'info': 'info',
      'success': 'check_circle',
      'warning': 'warning',
      'error': 'error',
      'share': 'share',
      'file_upload': 'cloud_upload',
      'file_delete': 'delete',
      'file_restore': 'restore',
      'permission_grant': 'admin_panel_settings',
      'permission_revoke': 'block',
      'bulk_action': 'playlist_add_check',
    };
    return icons[type] || 'notifications';
  }

  getNotificationTypeClass(type: string): string {
    if (type.includes('success') || type.includes('restore') || type.includes('grant')) {
      return 'type-success';
    }
    if (type.includes('error') || type.includes('delete') || type.includes('revoke')) {
      return 'type-error';
    }
    if (type.includes('warning')) {
      return 'type-warning';
    }
    if (type.includes('share')) {
      return 'type-share';
    }
    return 'type-info';
  }
}
