import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { AuthResponse, createClient } from "@supabase/supabase-js";
import { from, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Auth service implementation goes here
    supabase = createClient(
        environment.supabaseUrl, 
        environment.supabaseKey
    );
    currentUser = signal<{ email: string; username: string } | null>(null);

    register(email: string, username: string, password: string): Observable<AuthResponse> {
        const promise = this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                username,
                },
            },
        });
        return from(promise);
    }

    login(email: string, password: string): Observable<AuthResponse> {
        const promise = this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        return from(promise);
    }

    logout(): void {
        this.supabase.auth.signOut();
    }
}