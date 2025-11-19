import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ProductDto } from './product.service';

/**
 * Request models for creating/updating products
 */
export interface CreateProductRequest {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
}

export interface UpdateProductRequest {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminProductService {
    private readonly basePath = '/admin/product';
    
    // Reactive state management
    private products = signal<ProductDto[]>([]);
    
    // Computed signals
    readonly allProducts = this.products.asReadonly();

    constructor(private apiService: ApiService) { }

    /**
     * POST /api/admin/product - Creates a new product (Admin only)
     */
    createProduct(request: CreateProductRequest): Observable<ProductDto> {
        return this.apiService.post<ProductDto>(this.basePath, request).pipe(
            tap(() => this.refreshProducts())
        );
    }

    /**
     * PUT /api/admin/product/{id} - Updates an existing product (Admin only)
     */
    updateProduct(id: number, request: UpdateProductRequest): Observable<ProductDto> {
        return this.apiService.put<ProductDto>(`${this.basePath}/${id}`, request).pipe(
            tap(() => this.refreshProducts())
        );
    }

    /**
     * DELETE /api/admin/product/{id} - Deletes a product (Admin only)
     * Note: Currently disabled due to referential integrity considerations
     */
    deleteProduct(id: number): Observable<void> {
        return this.apiService.delete<void>(`${this.basePath}/${id}`).pipe(
            tap(() => this.refreshProducts())
        );
    }

    /**
     * Refreshes the products from the public endpoint
     * (Uses ProductService internally to avoid duplication)
     */
    refreshProducts(): void {
        // We'll use the public product endpoint since GET methods were removed
        this.apiService.get<ProductDto[]>('/product').pipe(
            tap(products => this.products.set(products))
        ).subscribe();
    }

    /**
     * Clears the local products state
     */
    clearLocalProducts(): void {
        this.products.set([]);
    }
}
