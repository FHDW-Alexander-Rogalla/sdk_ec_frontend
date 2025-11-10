import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Product DTO matching the backend API
export interface ProductDto {
    id: number;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly basePath = '/product';

    constructor(private apiService: ApiService) { }

    /**
     * Get all products
     */
    getAll(): Observable<ProductDto[]> {
        return this.apiService.get<ProductDto[]>(this.basePath);
    }

    /**
     * Get product by ID
     */
    getById(id: number): Observable<ProductDto> {
        return this.apiService.get<ProductDto>(`${this.basePath}/${id}`);
    }
}