import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser();
  const allowedRoles = (route.data['roles'] as string[]) ?? [];

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (allowedRoles.length === 0) {
    return true;
  }

  if (!allowedRoles.includes(user.role)) {
    router.navigate(['/forbidden']);
    return false;
  }

  return true;
};

  /**
  * UrlTree
  */

