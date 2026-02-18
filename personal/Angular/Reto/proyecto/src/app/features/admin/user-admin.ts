import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, User, UserRole } from '../../core/auth/auth.service';

@Component({
    standalone: true,
    selector: 'app-user-admin',
    templateUrl: './user-admin.html',
    styleUrls: ['./user-admin.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
    ],
})
export class UserAdminComponent {
    authService = inject(AuthService);
    private snackBar = inject(MatSnackBar);

    users = computed(() => this.authService.getAllUsers());
    currentUser = computed(() => this.authService.currentUser());

    newUser = {
        displayName: '',
        email: '',
        password: '',
        role: 'USER' as UserRole,
    };

    showCreateForm = false;

    createUser() {
        if (!this.newUser.displayName || !this.newUser.email || !this.newUser.password) {
            alert('Todos los campos son obligatorios');
            return;
        }

        try {
            this.authService.register(
                this.newUser.displayName,
                this.newUser.email,
                this.newUser.password,
                this.newUser.role
            );

            this.newUser = {
                displayName: '',
                email: '',
                password: '',
                role: 'USER',
            };
            this.showCreateForm = false;
        } catch (error: any) {
            alert(error.message);
        }
    }

    toggleActive(userId: string) {
        this.authService.toggleUserActive(userId);
    }

    toggleBlocked(userId: string) {
        this.authService.toggleLoginBlocked(userId);
    }

    changeRole(userId: string, newRole: UserRole) {
        const user = this.users().find(u => u.id === userId);
        this.authService.updateUserRole(userId, newRole);

        const roleLabels: Record<UserRole, string> = {
            'ADMIN': 'Administrador',
            'MANAGER': 'Manager',
            'USER': 'Usuario'
        };

        this.snackBar.open(
            `Rol de ${user?.displayName || 'usuario'} cambiado a ${roleLabels[newRole]}`,
            'Cerrar',
            { duration: 3000 }
        );
    }

    deleteUser(user: User) {
        if (!confirm(`¿Eliminar usuario "${user.displayName}"?`)) return;

        try {
            this.authService.deleteUser(user.id);
        } catch (error: any) {
            alert(error.message);
        }
    }

    getRoleBadgeClass(role: UserRole): string {
        const classes: Record<UserRole, string> = {
            'ADMIN': 'bg-danger',
            'MANAGER': 'bg-warning',
            'USER': 'bg-primary',
        };
        return classes[role];
    }

    formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString();
    }

    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}
