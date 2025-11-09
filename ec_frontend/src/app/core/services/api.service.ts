import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;
    private supabaseService = inject(SupabaseService);

    constructor(private http: HttpClient) { }

    /**
     * Gets the current session and returns headers with authorization token
     */
    private async getHeaders(): Promise<HttpHeaders> {
        const { data: { session } } = await this.supabaseService.client.auth.getSession();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        
        if (session?.access_token) {
            headers = headers.set('Authorization', `Bearer ${session.access_token}`);
        }
        
        return headers;
    }

    /**
     * Performs a GET request
     * @param path The API endpoint path
     * @param params Optional query parameters
     * @returns Observable of the response
     */
    get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
        return from(this.getHeaders()).pipe(
            switchMap(headers => this.http.get<T>(`${this.apiUrl}${path}`, { headers, params }))
        );
    }

    /**
     * Performs a POST request
     * @param path The API endpoint path
     * @param body The request body
     * @returns Observable of the response
     */
    post<T>(path: string, body: any): Observable<T> {
        return from(this.getHeaders()).pipe(
            switchMap(headers => this.http.post<T>(`${this.apiUrl}${path}`, body, { headers }))
        );
    }

    /**
     * Performs a PUT request
     * @param path The API endpoint path
     * @param body The request body
     * @returns Observable of the response
     */
    put<T>(path: string, body: any): Observable<T> {
        return from(this.getHeaders()).pipe(
            switchMap(headers => this.http.put<T>(`${this.apiUrl}${path}`, body, { headers }))
        );
    }

    /**
     * Performs a DELETE request
     * @param path The API endpoint path
     * @returns Observable of the response
     */
    delete<T>(path: string): Observable<T> {
        return from(this.getHeaders()).pipe(
            switchMap(headers => this.http.delete<T>(`${this.apiUrl}${path}`, { headers }))
        );
    }
}