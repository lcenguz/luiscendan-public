import { Component, computed, inject, effect, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './core/auth/auth.service';
import { SessionTimeoutService } from './core/session/session-timeout.service';
import { filter } from 'rxjs/operators';
import { CommandPaletteComponent } from './features/search/command-palette';
import { NotificationCenterComponent } from './features/notifications/notification-center.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NotificationCenterComponent],
  templateUrl: './app.html',
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private sessionTimeout = inject(SessionTimeoutService);
  private dialog = inject(MatDialog);

  isAuthenticated = computed(() => this.auth.isAuthenticated());
  currentUser = computed(() => this.auth.currentUser());
  currentPageTitle = 'LuisCendanDrive';
  isHomePage = false; // Para condicionar el container

  constructor() {
    effect(() => {
      if (this.isAuthenticated()) {
        this.sessionTimeout.startMonitoring();
      } else {
        this.sessionTimeout.stopMonitoring();
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
      this.isHomePage = this.router.url === '/drive';
    });
  }

  private updatePageTitle(): void {
    const url = this.router.url;

    if (url.includes('/login')) {
      this.currentPageTitle = 'Iniciar Sesión';
    } else if (url.includes('/register')) {
      this.currentPageTitle = 'Registro';
    } else if (url.includes('/users')) {
      this.currentPageTitle = 'Gestion de Usuarios';
    } else if (url.includes('/users')) {
      this.currentPageTitle = 'Gestion de Usuarios';
    } else if (url.includes('/files')) {
      this.currentPageTitle = 'Subir Archivos';
    } else if (url.includes('/drive')) {
      this.currentPageTitle = 'Home';
    } else if (url.includes('/forbidden')) {
      this.currentPageTitle = '404 - No Encontrado';
    } else if (url.includes('/file-manager')) {
      this.currentPageTitle = 'Gestor de Archivos';
    } else if (url.includes('/trash')) {
      this.currentPageTitle = 'Papelera';
    } else if (url.includes('/admin/users')) {
      this.currentPageTitle = 'Admin Usuarios';
    } else if (url.includes('/dashboard')) {
      this.currentPageTitle = 'Dashboard';
    } else if (url.includes('/shared')) {
      this.currentPageTitle = 'Compartido Conmigo';
    } else if (url.includes('/audit')) {
      this.currentPageTitle = 'Auditoría';
    } else {
      this.currentPageTitle = 'LuisCendanDrive';
    }
  }

  @HostListener('document:keydown.control.k')
  @HostListener('document:keydown.meta.k')
  openCommandPalette(event?: KeyboardEvent) {
    if (!this.isAuthenticated()) return;

    event?.preventDefault();

    this.dialog.open(CommandPaletteComponent, {
      width: '640px',
      maxWidth: '90vw',
      panelClass: 'command-palette-dialog',
      hasBackdrop: false,
    });
  }

  onLogout() {
    this.sessionTimeout.stopMonitoring();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
