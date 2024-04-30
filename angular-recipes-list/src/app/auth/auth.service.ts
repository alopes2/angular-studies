import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';

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

  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

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

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiresIn: string
  ) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn);
    const user = new User(email, id, token, expirationDate);

    this.user.next(user);
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
