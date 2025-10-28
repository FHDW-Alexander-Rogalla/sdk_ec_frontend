import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Performs a GET request
     * @param path The API endpoint path
     * @param params Optional query parameters
     * @returns Observable of the response
     */
    get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}${path}`, { params });
    }

    /**
     * Performs a POST request
     * @param path The API endpoint path
     * @param body The request body
     * @returns Observable of the response
     */
    post<T>(path: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}${path}`, body);
    }

    /**
     * Performs a PUT request
     * @param path The API endpoint path
     * @param body The request body
     * @returns Observable of the response
     */
    put<T>(path: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}${path}`, body);
    }

    /**
     * Performs a DELETE request
     * @param path The API endpoint path
     * @returns Observable of the response
     */
    delete<T>(path: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}${path}`);
    }
}