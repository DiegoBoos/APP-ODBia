import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response.interface';
import { CheckTokenResponse } from '../interfaces/check-token.response';
import Swal from 'sweetalert2';
import { environment } from '@environment/environment';
import { SocialAuthService } from '@abacritt/angularx-social-login';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private socialAuthService = inject(SocialAuthService);

  // private websocketService = inject(WebsocketService);

  #currentUser = signal<User | null>(null);
  #authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this.#currentUser());
  public authStatus = computed(() => this.#authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();

  }


  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  

  private setAuthentication(user: User, token: string): boolean {

    this.#currentUser.set(user);

    this.#authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token-app-odb', token);
    localStorage.setItem('user-app-odb', JSON.stringify(user));

    // this.websocketService.emit(EventSocket.LOGGED, token);

    return true;
  }

  register(
    fullName: string,
    email: string,
    password?: string
  ): Observable<boolean> {
    const url = `${this.baseUrl}/auth/register`;
    const body = { fullName, email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  socialRegister(
    fullName: string,
    email: string,
  ): Observable<boolean> {
    const url = `${this.baseUrl}/auth/social-register`;
    const body = { fullName, email };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }



  passwordRestore(email: string): Observable<any> {
    const url = `${this.baseUrl}/auth/password-restore`;
    const body = { email };

    return this.http.post<any>(url, body).pipe(
      // map(({ resetPasswordUrln }) => this.setAuthentication(user, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  checkRole(route: any): boolean {
    const { path, title } = route;
    const userLocalStorage = localStorage.getItem('user-app-odb');

    const user: User = JSON.parse(userLocalStorage!);

    if (!user) {
      return false;
    }

    let status: boolean = true;
    let nameRole: string = '';

    // Manejo de Rutas con Roles

    // switch (path) {
    //   case 'accounts-receivable':
    //   case 'customers':
    //   case 'documents':
    //   case 'documents-query':
    //   case 'emit-document':
    //   case 'discounts':
    //     status = user!.userRoles!.findIndex(i=>i.role.name === 'cxc') > 0;
    //     nameRole = 'Cuentas por Cobrar';
    //     break;
    //   case 'discounts':
    //   case 'messengers-query':
    //   case 'events-query':
    //     status = user!.userRoles!.findIndex(i=>i.role.name === 'Administración') > 0;
    //     nameRole = 'Administrador';
    //     break;
    //   case 'pedidos-query':
    //     status = user!.userRoles!.findIndex(i=>i.role.name === 'Pedidos') > 0;
    //     nameRole = 'Pedidos';
    //     break;
    //   case 'pedidos-separacion':
    //     status = user!.userRoles!.findIndex(i=>i.role.name === 'verifica') > 0;
    //     nameRole = 'Verificar';
    //     break;
    // }

    if (!status) {
      this.logout();
      Swal.fire(
        'Acceso No Autorizado',
        `No tiene permisos para acceder. Necesita rol de ${nameRole}`,
        'error'
      );
    }

    return status;
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-status`;
    const token = localStorage.getItem('token-app-odb') || null;
    const userLocalStorage = localStorage.getItem('user-app-odb');

    if (!token) {
      this.logout();
      return of(false);
    }

    if (this.router.url !== '/') {
      return this.http.get<CheckTokenResponse>(url).pipe(
        map(({ user, token }) => this.setAuthentication(user, token)),
        catchError((err) => {
          this.#authStatus.set(AuthStatus.notAuthenticated);
          // this.websocketService.emit(EventSocket.LOGGED, token);
          return of(false);
        })
      );
    } else {
      this.#authStatus.set(AuthStatus.inLogin);
      const user = JSON.parse(userLocalStorage!);
      this.#currentUser.set(user);
    }
    return of(true);
  }

  resetPassword(password: string, token: string): Observable<any> {
    const url = `${this.baseUrl}/reset-password`;
    const body = { password, token };

    return this.http.post<any>(url, body).pipe(
      // map(({ resetPasswordUrln }) => this.setAuthentication(user, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  logout(): void {
    // const token = localStorage.getItem('token-app-odb');
    if (this.router.url !== '/login') {
      localStorage.setItem('route-app-plataforma-odb', this.router.url);
    }
    localStorage.removeItem('token-app-odb');
    localStorage.removeItem('user-app-odb');
    this.socialAuthService.signOut();
    this.#currentUser.set(null);
    this.#authStatus.set(AuthStatus.notAuthenticated);
    // this.websocketService.emit(EventSocket.LOGOUT, token);
  }

}
