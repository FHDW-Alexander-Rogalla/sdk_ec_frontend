import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { 
    CartDto, 
    CartItemDto, 
    AddCartItemRequest, 
    UpdateCartItemRequest 
} from '../models/cart.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly basePath = '/cart';
    
    // Reactive state management
    private cartItems = signal<CartItemDto[]>([]);
    
    // Computed signals
    readonly items = this.cartItems.asReadonly();
    readonly itemCount = computed(() => 
        this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
    );
    readonly isEmpty = computed(() => this.cartItems().length === 0);

    constructor(private apiService: ApiService) { }

    /**
     * GET /api/cart - Gets the current user's cart
     */
    getCart(): Observable<CartDto> {
        return this.apiService.get<CartDto>(this.basePath);
    }

    /**
     * GET /api/cart/items - Gets all items in the current user's cart
     * Also updates local state
     */
    getCartItems(): Observable<CartItemDto[]> {
        return this.apiService.get<CartItemDto[]>(`${this.basePath}/items`).pipe(
            tap(items => this.cartItems.set(items))
        );
    }

    /**
     * POST /api/cart/items - Adds an item to the cart or updates quantity if exists
     */
    addCartItem(request: AddCartItemRequest): Observable<CartItemDto> {
        return this.apiService.post<CartItemDto>(`${this.basePath}/items`, request).pipe(
            tap(() => this.refreshCartItems())
        );
    }

    /**
     * Convenience method to add a single product with quantity 1
     */
    addProduct(productId: number, quantity: number = 1): Observable<CartItemDto> {
        return this.addCartItem({ productId, quantity });
    }

    /**
     * PUT /api/cart/items/{id} - Updates the quantity of a cart item
     */
    updateCartItem(id: number, request: UpdateCartItemRequest): Observable<CartItemDto> {
        return this.apiService.put<CartItemDto>(`${this.basePath}/items/${id}`, request).pipe(
            tap(() => this.refreshCartItems())
        );
    }

    /**
     * Convenience method to update quantity by item id
     */
    updateQuantity(itemId: number, quantity: number): Observable<CartItemDto> {
        return this.updateCartItem(itemId, { quantity });
    }

    /**
     * DELETE /api/cart/items/{id} - Removes an item from the cart
     */
    deleteCartItem(id: number): Observable<void> {
        return this.apiService.delete<void>(`${this.basePath}/items/${id}`).pipe(
            tap(() => this.refreshCartItems())
        );
    }

    /**
     * Removes an item from the cart (alias for deleteCartItem)
     */
    removeItem(itemId: number): Observable<void> {
        return this.deleteCartItem(itemId);
    }

    /**
     * Increments the quantity of a cart item by 1
     */
    incrementQuantity(item: CartItemDto): Observable<CartItemDto> {
        return this.updateQuantity(item.id, item.quantity + 1);
    }

    /**
     * Decrements the quantity of a cart item by 1
     * If quantity becomes 0, removes the item
     */
    decrementQuantity(item: CartItemDto): Observable<CartItemDto | void> {
        if (item.quantity <= 1) {
            return this.removeItem(item.id);
        }
        return this.updateQuantity(item.id, item.quantity - 1);
    }

    /**
     * Refreshes the cart items from the server
     */
    private refreshCartItems(): void {
        this.getCartItems().subscribe();
    }

    /**
     * Clears the local cart state (useful after logout)
     */
    clearLocalCart(): void {
        this.cartItems.set([]);
    }

    /**
     * Gets a cart item by product ID
     */
    getItemByProductId(productId: number): CartItemDto | undefined {
        return this.cartItems().find(item => item.productId === productId);
    }

    /**
     * Checks if a product is already in the cart
     */
    hasProduct(productId: number): boolean {
        return this.cartItems().some(item => item.productId === productId);
    }
}
