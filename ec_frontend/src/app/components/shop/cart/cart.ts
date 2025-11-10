import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CartItemWithProduct } from '../../../core/models/cart.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  // Track locally edited quantities without immediately persisting
  private editedQuantities: Record<number, number> = {};

  constructor(private cartService: CartService) {}

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
    // Platzhalter: Cart-Produkte in der Konsole ausgeben
    console.log('Order submitted:', this.cartItems);
    alert('Bestellung als Platzhalter ausgeführt. Siehe Konsole.');
  }
}
