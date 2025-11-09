import { Routes } from '@angular/router';
import { Register } from './components/authentification/register/register';
import { Login } from './components/authentification/login/login';

export const routes: Routes = [
	{ path: 'register', component: Register },
	{ path: 'login', component: Login },
];
