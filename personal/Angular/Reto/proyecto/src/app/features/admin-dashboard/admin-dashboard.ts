import { Component, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService, User } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-users-dashboard',
  templateUrl: './admin-dashboard.html',
  imports: [DatePipe],
})
export class UsersDashboardComponent {
  private auth = inject(AuthService);

  currentUser = this.auth.currentUserState;

  users = computed(() => {
    const current = this.currentUser();
    const allUsers = this.auth.getAllUsers();

    if (current?.role === 'ADMIN') {
      return allUsers;
    }

    if (current?.role === 'MANAGER' && current) {
      return [current];
    }

    return [];
  });

  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
}
