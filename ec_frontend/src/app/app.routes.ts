import { Routes } from '@angular/router';
import { Register } from './components/authentification/register/register';
import { Login } from './components/authentification/login/login';
import { ProductList } from './components/shop/product-list/product-list';

export const routes: Routes = [
	{ path: '', component: ProductList },
	// { path: 'products', component: ProductList },
	{ path: 'register', component: Register },
	{ path: 'login', component: Login },
];
