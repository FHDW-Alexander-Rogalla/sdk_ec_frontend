import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Example interface for your data model
interface ExampleDto {
    id: number;
    name: string;
    // Add more properties as needed
}

@Injectable({
    providedIn: 'root'
})
export class ExampleService {
    private readonly basePath = '/weatherforecast'; // Adjust this to match your API endpoint

    constructor(private apiService: ApiService) { }

    /**
     * Get all examples
     */
    getAll(): Observable<ExampleDto[]> {
        return this.apiService.get<ExampleDto[]>(this.basePath);
    }

    /**
     * Get example by ID
     */
    getById(id: number): Observable<ExampleDto> {
        return this.apiService.get<ExampleDto>(`${this.basePath}/${id}`);
    }

    /**
     * Create new example
     */
    create(example: Omit<ExampleDto, 'id'>): Observable<ExampleDto> {
        return this.apiService.post<ExampleDto>(this.basePath, example);
    }

    /**
     * Update existing example
     */
    update(id: number, example: ExampleDto): Observable<ExampleDto> {
        return this.apiService.put<ExampleDto>(`${this.basePath}/${id}`, example);
    }

    /**
     * Delete example
     */
    delete(id: number): Observable<void> {
        return this.apiService.delete<void>(`${this.basePath}/${id}`);
    }
}