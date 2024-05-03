import {
  HttpInterceptorFn,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return authService.user.pipe(
    take(1), // Take is for unsubscribing from the previous subscription
    exhaustMap((user) => {
      if (!user) return next(req);

      const modifiedReq = req.clone({
        params: req.params.set('auth', user?.token || ''),
      });
      return next(modifiedReq);
    })
  );
};
