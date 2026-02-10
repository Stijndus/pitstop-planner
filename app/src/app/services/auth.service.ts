import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'auth_user';

    private authStateSubject = new BehaviorSubject<boolean>(this.hasToken());
    public authState$: Observable<boolean> = this.authStateSubject.asObservable();

    constructor(
        private apiService: ApiService,
        private router: Router
    ) { }

    /**
     * Check if user has a token stored
     */
    private hasToken(): boolean {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Get the stored token
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Get the stored user
     */
    getUser(): any {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.hasToken();
    }

    /**
     * Login user
     */
    login(credentials: LoginCredentials) {
        return this.apiService.post<AuthResponse>('auth/login', credentials)
            .pipe(
                tap((response) => {
                    if (response.data) {
                        this.saveAuthData(response);
                    }
                })
            );
    }

    /**
     * Register new user
     */
    register(credentials: RegisterCredentials) {
        return this.apiService.post<AuthResponse>('auth/register', credentials)
            .pipe(
                tap((response) => {
                    if (response.data) {
                        this.saveAuthData(response);
                    }
                })
            );
    }

    /**
     * Save authentication data
     */
    private saveAuthData(response: any): void {
        localStorage.setItem(this.TOKEN_KEY, response.data.access_token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
        this.authStateSubject.next(true);
    }

    /**
     * Logout user
     */
    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.authStateSubject.next(false);
        this.router.navigate(['/login']);
    }
}
