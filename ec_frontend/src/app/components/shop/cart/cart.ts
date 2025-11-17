import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { CartItemWithProduct } from '../../../core/models/cart.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: CartItemWithProduct[] = [];
  loading = false;
  error: string | null = null;
  submittingOrder = false;
  // Track locally edited quantities without immediately persisting
  private editedQuantities: Record<number, number> = {};

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.loading = true;
    this.error = null;
    this.cartService.getCartItems().subscribe({
      next: items => {
        this.cartItems = items;
        this.loading = false;
      },
      error: err => {
        this.error = 'Fehler beim Laden des Warenkorbs.';
        this.loading = false;
      }
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  }

  getItemTotal(item: CartItemWithProduct): number {
    return (item.product?.price || 0) * item.quantity;
  }

  updateQuantity(item: CartItemWithProduct, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateQuantity(item.id, quantity).subscribe({
      next: () => this.loadCartItems()
    });
  }

  // Called on local input change; does not persist yet
  onLocalQuantityChange(item: CartItemWithProduct, value: number) {
    if (value < 1) return;
    this.editedQuantities[item.id] = value;
  }

  isQuantityDirty(item: CartItemWithProduct): boolean {
    return this.editedQuantities[item.id] !== undefined && this.editedQuantities[item.id] !== item.quantity;
  }

  applyQuantityChange(item: CartItemWithProduct) {
    const newQty = this.editedQuantities[item.id];
    if (newQty && newQty > 0 && newQty !== item.quantity) {
      this.updateQuantity(item, newQty);
      delete this.editedQuantities[item.id];
    }
  }

  removeItem(item: CartItemWithProduct): void {
    this.cartService.removeItem(item.id).subscribe({
      next: () => this.loadCartItems()
    });
  }

  clearCart(): void {
    // Remove all items sequentially (simple approach). Could be optimized with backend batch endpoint.
    const items = [...this.cartItems];
    if (items.length === 0) return;
    let remaining = items.length;
    items.forEach(it => {
      this.cartService.removeItem(it.id).subscribe({
        next: () => {
          remaining--;
          if (remaining === 0) {
            this.loadCartItems();
          }
        },
        error: () => {
          remaining--;
          if (remaining === 0) {
            this.loadCartItems();
          }
        }
      });
    });
  }

  submitOrder(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Confirm order before submitting
    const confirmMessage = `You are about to place an order for ${this.cartItems.length} item(s) with a total of ${this.getTotal().toFixed(2)} EUR. Continue?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    this.submittingOrder = true;
    this.error = null;

    this.orderService.checkoutCart().subscribe({
      next: order => {
        this.submittingOrder = false;
        console.log('Order successfully created:', order);
        alert(`Order #${order.id} successfully placed! Thank you for your purchase.`);
        
        // Clear local cart state (already done in service, but ensure UI updates)
        this.cartItems = [];
        
        // Optionally navigate to order confirmation or orders page
        // this.router.navigate(['/orders', order.id]);
      },
      error: err => {
        this.submittingOrder = false;
        console.error('Error creating order:', err);
        this.error = 'Failed to place order. Please try again.';
        alert('Error placing order. Please try again.');
      }
    });
  }
}
