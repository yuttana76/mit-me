import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth/auth-data.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiURL + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {

  isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userData: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getUserData() {
    return this.userData;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    this.http
      .post<{result: any, error: any}>( BACKEND_URL + 'register', authData)
      .subscribe(response => {

        if (response.result) {
          console.log('Register success');
          this.router.navigate(['/login']);
        } else {
          console.log('Register failed!!');
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    this.http
      .post<{ token: string, expiresIn: number, userData: string }>( BACKEND_URL + 'login', authData)
      .subscribe(response => {

        const token = response.token;
        this.token = token;
        if (token) {
          this.userData = response.userData;

          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);

          this.authStatusListener.next(true);
          this.isAuthenticated = true;

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userData);

          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthuser() {
    const authInfomation = this.getAuthData();

    if (!authInfomation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInfomation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfomation.token;
      this.userData = authInfomation.userData;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.userData = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(['/']);
  }

  private setAuthTimer(expiresInDuration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userData: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userData', userData);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userData');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userData = localStorage.getItem('userData');

    if ( !token || !expirationDate ) {
      return;
    }

    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userData: userData,
    };

  }

}
