import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { roleGuard } from './core/auth/role-guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'LCDrive - Iniciar Sesión',
    loadComponent: () =>
      import('./core/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    title: 'LCDrive - Registro',
    loadComponent: () =>
      import('./core/auth/register/register').then(m => m.RegisterComponent),
  },
  {
    path: 'drive',
    canActivate: [authGuard, roleGuard],
    title: 'LCDrive - Home',
    loadComponent: () =>
      import('./features/drive-home/drive-home').then(
        m => m.DriveHomeComponent,
      ),
  },
  {
    path: 'files',
    canActivate: [authGuard, roleGuard],
    title: 'LCDrive - Subir Archivos',
    loadComponent: () =>
      import('./features/files/file-manager').then(m => m.FileManagerComponent),
  },
  {
    path: 'file-manager',
    canActivate: [authGuard, roleGuard],
    title: 'LCDrive - Gestor de Archivos',
    loadComponent: () =>
      import('./features/files/file-manager').then(m => m.FileManagerComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    title: 'LCDrive - Panel de Administración',
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin-dashboard/admin-dashboard').then(
        m => m.UsersDashboardComponent,
      ),
  },
  {
    path: 'manager',
    canActivate: [authGuard, roleGuard],
    title: 'LCDrive - Panel de Manager',
    data: { roles: ['ADMIN', 'MANAGER'] },
    loadComponent: () =>
      import('./features/admin-dashboard/admin-dashboard').then(
        m => m.UsersDashboardComponent,
      ),
  },
  {
    path: 'trash',
    canActivate: [authGuard, roleGuard],
    title: 'LCDrive - Papelera',
    loadComponent: () =>
      import('./features/trash/trash').then(m => m.TrashComponent),
  },
  {
    path: 'admin/users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    title: 'LCDrive - Admin Usuarios',
    loadComponent: () =>
      import('./features/admin/user-admin').then(m => m.UserAdminComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'MANAGER'] },
    title: 'LCDrive - Dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
  },
  {
    path: 'shared',
    canActivate: [authGuard],
    title: 'LCDrive - Documentos Compartidos',
    loadComponent: () =>
      import('./features/shared/shared-by-me').then(m => m.SharedByMeComponent),
  },
  {
    path: 'shared-with-me',
    canActivate: [authGuard],
    title: 'LCDrive - Compartido Conmigo',
    loadComponent: () =>
      import('./features/shared/shared-with-me').then(m => m.SharedWithMeComponent),
  },
  {
    path: 'audit',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'MANAGER'] },
    title: 'LCDrive - Auditoría',
    loadComponent: () =>
      import('./features/audit/audit').then(m => m.AuditComponent),
  },
  {
    path: 'forbidden',
    title: 'LCDrive - 404 NOT FOUND',
    loadComponent: () =>
      import('./features/shared/forbidden/forbidden').then(
        m => m.ForbiddenComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'drive',
  },
  {
    path: '**',
    redirectTo: 'drive',
  },
];