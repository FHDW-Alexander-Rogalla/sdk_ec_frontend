export interface OrderDto {
    id: number;
    userId?: string;
    orderDate: string;
    status: string;
    updatedAt: string;
    items: OrderItemDto[];
}

export interface OrderItemDto {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    priceAtPurchase: number;
}

export interface UpdateOrderStatusRequest {
    status: string;
}

// Extended order item with product details (for frontend use)
export interface OrderItemWithProduct extends OrderItemDto {
    product?: {
        id: number;
        name: string;
        description?: string;
        imageUrl?: string;
    };
}

// Extended order with product details in items
export interface OrderWithProducts extends Omit<OrderDto, 'items'> {
    items: OrderItemWithProduct[];
}
