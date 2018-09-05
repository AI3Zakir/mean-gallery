import { Injectable } from '@angular/core';
import { User } from './model/user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const USER_API_URL = environment.apiUrl + '/api/users';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
}

export interface AuthData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isAuthenticated = false;
  private token: string;
  private user: User;
  private authStatusListener = new Subject<boolean>();
  private currentUserListener = new Subject<User>();
  private tokenTimer: any;

  constructor(private httpClinet: HttpClient, private router: Router) {
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getCurrentUserListener() {
    return this.currentUserListener.asObservable();
  }

  getAuthenticationStatus() {
    return this.isAuthenticated;
  }

  getCurrentUser() {
    return this.user;
  }

  createUser(email: string, password: string, firstName: string, lastName: string, birthDate: Date) {
    const registerData: RegisterData = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate
    };
    return this.httpClinet.post<{ message: string, token: string, expiresIn: number, user: User }>(USER_API_URL + '/signup', registerData)
      .subscribe((response) => {
        this.authenticate(response);
      }, (error) => {
        this.authStatusListener.next(false);
      });
  }


  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.httpClinet.post<{ token: string, expiresIn: number, user: User }>(USER_API_URL + '/login', authData)
      .subscribe((response) => {
        this.authenticate(response);
      }, (error) => {
        this.authStatusListener.next(false);
      });
  }

  logout() {
    clearTimeout(this.tokenTimer);
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.currentUserListener.next(null);
    this.clearAuthData();
    this.router.navigate(['/']);
    this.user = null;
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.user = authData.user;
      this.token = authData.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private authenticate(response) {
    this.token = response.token;
    if (this.token) {
      const expiresInDuration = response.expiresIn;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.user = response.user;
      this.currentUserListener.next(this.user);
      this.setAuthTimer(expiresInDuration);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(this.token, expirationDate, this.user);
      this.router.navigate(['/']);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userData');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userData = localStorage.getItem('userData');
    if (!token || !expirationDate || !userData) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      user: JSON.parse(userData)
    };
  }
}
