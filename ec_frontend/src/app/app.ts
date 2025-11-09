import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ExampleService } from './core/services/example.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ec_frontend');
  protected dropdownOpen = signal(false);

  constructor(
    private exampleService: ExampleService, 
    protected authService: AuthService,
    protected cartService: CartService
  ) {
    // Example usage of the ExampleService
    this.exampleService.getAll().subscribe(examples => {
      console.log('Fetched examples:', examples);
    });
  }

  ngOnInit() {
    this.authService.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.authService.currentUser.set({
          email: session?.user.email!,
          username:
            session?.user.identities?.at(0)?.identity_data?.['username'],
        });
        // Load cart when user signs in
        this.loadCart();
      } else if (event === 'SIGNED_OUT') {
        this.authService.currentUser.set(null);
        this.cartService.clearLocalCart();
      }
      console.log('Auth event:', event, 'Session:', session);
    });

    // Check if already logged in and load cart
    this.authService.supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        this.loadCart();
      }
    });
  }

  loadCart() {
    console.log('Loading cart...');
    
    // Get cart info
    this.cartService.getCart().subscribe({
      next: (cart) => {
        console.log('Cart:', cart);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      }
    });

    // Get cart items
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        console.log('Cart items:', items);
        console.log('Total items count:', this.cartService.itemCount());
        console.log('Cart is empty:', this.cartService.isEmpty());
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
      }
    });
  }  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeDropdown();
  }
}
