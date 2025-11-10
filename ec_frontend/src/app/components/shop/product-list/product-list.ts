import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { ProductDto, ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ProductWithQuantity extends ProductDto {
  quantity: number;
}

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit, OnDestroy {
  products: ProductWithQuantity[] = [];
  loading = false;
  error: string | null = null;
  isAuthenticated = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {
    // React to auth state changes using effect
    effect(() => {
      const user = this.authService.currentUser();
      this.isAuthenticated = user !== null;
      
      if (this.isAuthenticated && this.products.length === 0) {
        this.loadProducts();
      } else if (!this.isAuthenticated) {
        this.products = [];
      }
    });
  }

  ngOnInit(): void {
    this.checkAuthentication();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  checkAuthentication(): void {
    // Check current session state
    this.authService.supabase.auth.getSession().then(({ data: { session } }) => {
      this.isAuthenticated = session !== null;
      
      if (this.isAuthenticated && session?.user) {
        // Update currentUser signal if not already set
        if (!this.authService.currentUser()) {
          this.authService.currentUser.set({
            email: session.user.email!,
            username: session.user.identities?.at(0)?.identity_data?.['username'] || session.user.email!
          });
        }
        this.loadProducts();
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products.map(p => ({
          ...p,
          quantity: 1
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  addToCart(product: ProductWithQuantity): void {
    console.log('Product added to cart:', {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      total: product.price * product.quantity
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
