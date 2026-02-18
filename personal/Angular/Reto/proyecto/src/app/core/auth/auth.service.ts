import { Injectable, computed, signal, inject } from '@angular/core';
import { AuditService } from '../audit/audit.service';

export type UserRole = 'ADMIN' | 'USER' | 'MANAGER';

export interface User {
  id: string;
  displayName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
  loginBlocked: boolean;
  lastLogin?: string;
  metadata: {
    documentsCount: number;
    storageUsed: number;
  };
}

const USERS_KEY = 'luiscendan-drive-users';
const SESSION_KEY = 'luiscendan-drive-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auditService = inject(AuditService);
  private usersSignal = signal<User[]>(this.loadUsers());
  private currentUserSignal = signal<User | null>(this.loadSession());

  users = computed(() => this.usersSignal());
  currentUserState = computed(() => this.currentUserSignal());
  isAuthenticatedState = computed(() => !!this.currentUserSignal());

  constructor() {
    this.ensureDefaultAdmin();
  }

  currentUser(): User | null {
    return this.currentUserSignal();
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSignal();
  }

  hasRole(role: UserRole): boolean {
    const u = this.currentUserSignal();
    return !!u && u.role === role;
  }

  getAllUsers(): User[] {
    return this.usersSignal();
  }

  findUserByEmail(email: string): User | undefined {
    const normalized = email.toLowerCase();
    return this.usersSignal().find(u => u.email.toLowerCase() === normalized);
  }

  register(
    displayName: string,
    email: string,
    password: string,
    role: UserRole = 'USER',
  ): User {
    const exists = this.findUserByEmail(email); //compara con el email ya existentes
    if (exists) {
      throw new Error('Ya existe un usuario con ese email');
    }

    const now = new Date().toISOString();

    const newUser: User = {
      id: crypto.randomUUID(),
      displayName,
      email,
      password,
      role,
      createdAt: now,
      isActive: true,
      loginBlocked: false,
      metadata: {
        documentsCount: 0,
        storageUsed: 0,
      },
    };

    const updated = [...this.usersSignal(), newUser];
    this.usersSignal.set(updated);
    this.saveUsers(updated);

    this.currentUserSignal.set(newUser);
    this.saveSession(newUser);

    this.auditService.logUserCreate('system', 'Sistema', newUser.id, newUser.email, newUser.role);
    this.auditService.logLogin(newUser.id, newUser.displayName);

    return newUser;
  }

  /**
   * Actualizar usuario (admin only)
   */
  updateUser(userId: string, updates: Partial<User>): boolean {
    const users = this.usersSignal();
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) return false;

    const oldUser = users[index];
    const updated = [...users];
    updated[index] = { ...updated[index], ...updates };

    this.usersSignal.set(updated);
    this.saveUsers(updated);

    const currentUser = this.currentUserSignal();
    if (currentUser) {
      this.auditService.logUserUpdate(currentUser.id, currentUser.displayName, userId, oldUser.email, updates);
    }

    return true;
  }

  /**
   * Toggle estado activo/inactivo
   */
  toggleUserActive(userId: string): boolean {
    const users = this.usersSignal();
    const user = users.find(u => u.id === userId);

    if (!user) return false;

    const newStatus = !user.isActive;
    const result = this.updateUser(userId, {
      isActive: newStatus,
      loginBlocked: !newStatus, //Si se desactiva, también se bloquea
    });

    const currentUser = this.currentUserSignal();
    if (currentUser && result) {
      if (newStatus) {
        this.auditService.logUserActivate(currentUser.id, currentUser.displayName, userId, user.email);
      } else {
        this.auditService.logUserDeactivate(currentUser.id, currentUser.displayName, userId, user.email);
      }
    }

    return result;
  }

  /**
   * Toggle bloqueo de login
   */
  toggleLoginBlocked(userId: string): boolean {
    const users = this.usersSignal();
    const user = users.find(u => u.id === userId);

    if (!user) return false;

    return this.updateUser(userId, {
      loginBlocked: !user.loginBlocked,
    });
  }

  /**
   * Eliminar usuario (admin only)
   */
  deleteUser(userId: string): boolean {
    const current = this.currentUserSignal();
    if (current?.id === userId) {
      throw new Error('No puedes eliminar tu propio usuario');
    }

    const users = this.usersSignal();
    const updated = users.filter(u => u.id !== userId);

    this.usersSignal.set(updated);
    this.saveUsers(updated);
    return true;
  }

  login(email: string, password: string): boolean {
    const user = this.findUserByEmail(email);
    if (!user) {

      this.auditService.logLoginFailed(email, 'Usuario no encontrado');
      return false;
    }
    if (user.password !== password) {

      this.auditService.logLoginFailed(email, 'Contraseña incorrecta');
      return false;
    }

    if (user.loginBlocked || !user.isActive) {
      this.auditService.logLoginFailed(email, 'Usuario bloqueado o inactivo');
      return false;
    }

    this.currentUserSignal.set(user);
    this.saveSession(user);

    this.auditService.logLogin(user.id, user.displayName);

    return true;
  }

  logout(): void {
    const user = this.currentUserSignal();
    if (user) {

      this.auditService.logLogout(user.id, user.displayName);
    }
    this.currentUserSignal.set(null);
    localStorage.removeItem(SESSION_KEY);
  }

  updateUserRole(userId: string, newRole: UserRole): void {
    const current = this.usersSignal();
    const idx = current.findIndex(u => u.id === userId);
    if (idx === -1) return;

    const updatedUser: User = {
      ...current[idx],
      role: newRole,
    };

    const updated = [...current];
    updated[idx] = updatedUser;
    this.usersSignal.set(updated);
    this.saveUsers(updated);

    const session = this.currentUserSignal();
    if (session && session.id === userId) {
      this.currentUserSignal.set(updatedUser);
      this.saveSession(updatedUser);
    }
  }

  private loadUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as User[];
    } catch {
      console.error('Error parsing users from localStorage');
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private loadSession(): User | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as User;
      const exists = this.findUserByEmail(parsed.email);
      return exists ?? null;
    } catch {
      console.error('Error parsing session from localStorage');
      return null;
    }
  }

  private saveSession(user: User): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  private ensureDefaultAdmin() {
    if (this.usersSignal().length > 0) return;

    const admin: User = {
      id: crypto.randomUUID(),
      displayName: 'Admin Demo',
      email: 'admin@corpdrive.local',
      password: 'admin',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      isActive: true,
      loginBlocked: false,
      metadata: { documentsCount: 0, storageUsed: 0 },
    };

    const manager: User = {
      id: crypto.randomUUID(),
      displayName: 'Manager Demo',
      email: 'manager@corpdrive.local',
      password: 'manager',
      role: 'MANAGER',
      createdAt: new Date().toISOString(),
      isActive: true,
      loginBlocked: false,
      metadata: { documentsCount: 0, storageUsed: 0 },
    };

    this.usersSignal.set([admin, manager]);
    this.saveUsers([admin, manager]);
  }
}
