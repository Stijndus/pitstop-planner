import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;
    private readonly TOKEN_KEY = 'auth_token';

    constructor(private http: HttpClient) { }

    /**
     * GET request
     */
    get<T>(endpoint: string, options?: any): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, this.getHttpOptions(options, undefined));
    }

    /**
     * POST request
     */
    post<T>(endpoint: string, body: any, options?: any): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, body, this.getHttpOptions(options, body));
    }

    /**
     * PUT request
     */
    put<T>(endpoint: string, body: any, options?: any): Observable<ApiResponse<T>> {
        return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, body, this.getHttpOptions(options, body));
    }

    /**
     * DELETE request
     */
    delete<T>(endpoint: string, options?: any): Observable<ApiResponse<T>> {
        return this.http.delete<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, this.getHttpOptions(options, undefined));
    }

    /**
     * PATCH request
     */
    patch<T>(endpoint: string, body: any, options?: any): Observable<ApiResponse<T>> {
        return this.http.patch<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, body, this.getHttpOptions(options, body));
    }

    /**
     * Get the stored token
     */
    private getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Prepare HTTP options with headers including auth token if available
     */
    private getHttpOptions(options?: any, body?: any): { headers: HttpHeaders } {
        let headers = new HttpHeaders({
            'Accept': 'application/json'
        });

        // Don't set Content-Type for FormData - let the browser set it with boundary
        if (!(body instanceof FormData)) {
            headers = headers.set('Content-Type', 'application/json');
        }

        // Automatically add bearer token if available
        const token = this.getToken();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        // Allow custom headers to override defaults if provided
        if (options?.headers) {
            Object.keys(options.headers).forEach((key: string) => {
                headers = headers.set(key, options.headers[key]);
            });
        }

        return { headers };
    }
}
