import { inject } from '@angular/core';
import {
  ActivatedRoute,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.user.pipe(
    take(1), // Only take one value and unsubscribe
    map((user) => {
      const isAuth = !!user;

      if (isAuth) return true;

      return router.createUrlTree(['/auth']);
    })
  );
};
