import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export type AuthResponseData = {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private queryParams = new HttpParams().set(
    'key',
    'AIzaSyBfNqpo0Zf6xcTWXKkNF3SMzKOt4Oeunxs'
  );
  private tokenExpirationTimer: any;

  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.authUrl}:signUp`,
        { email, password, returnSecureToken: true },
        { params: this.queryParams }
      )
      .pipe(
        catchError(this.handleError),
        tap((data) => {
          this.handleAuthentication(
            data.email,
            data.localId,
            data.idToken,
            data.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.authUrl}:signInWithPassword`,
        { email, password, returnSecureToken: true },
        { params: this.queryParams }
      )
      .pipe(
        catchError(this.handleError),
        tap((data) => {
          this.handleAuthentication(
            data.email,
            data.localId,
            data.idToken,
            data.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return;
    }

    const user: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(userData);

    const loggedUser = new User(
      user.email,
      user.id,
      user._token,
      user._tokenExpirationDate
    );

    if (loggedUser.token) {
      this.user.next(loggedUser);

      const expirationDuration =
        new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = undefined;
    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiresIn: string
  ) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);

    this.user.next(user);

    localStorage.setItem('userData', JSON.stringify(user));

    this.autoLogout(+expiresIn * 1000);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let message = 'An unknown error occurred';
    if (errorResponse.error && errorResponse.error.error) {
      switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
          message = 'This email already exists';
          break;
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_PASSWORD':
          message = 'Email or password invalid';
          break;
        case 'USER_DISABLED':
          message = 'This user was disabled';
          break;
      }
    }
    return throwError(() => message);
  }
}
