import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'];
  const userRole = auth.getRole();

  if (allowedRoles?.includes(userRole)) {
    return true;
  }

  router.navigate(['/not-authorized']);
  return false;
};
