export interface CartDto {
    id: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CartItemDto {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
}

export interface AddCartItemRequest {
    productId: number;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}
