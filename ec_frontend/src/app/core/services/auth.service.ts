import { Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { AuthResponse, createClient } from "@supabase/supabase-js";
import { from, Observable, of, throwError } from "rxjs";
import { mergeMap } from 'rxjs/operators';

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
        const cleanedEmail = email.trim();
        const cleanedUsername = username.trim();
        const promise = this.supabase.auth.signUp({
            email: cleanedEmail,
            password,
            options: { data: { username: cleanedUsername } },
        });
        return from(promise).pipe(
            mergeMap(resp => resp.error ? throwError(() => resp.error) : of(resp))
        );
    }

    login(email: string, password: string): Observable<AuthResponse> {
        const cleanedEmail = email.trim();
        const promise = this.supabase.auth.signInWithPassword({
            email: cleanedEmail,
            password,
        });
        return from(promise).pipe(
            mergeMap(resp => resp.error ? throwError(() => resp.error) : of(resp))
        );
    }

    logout(): void {
        this.supabase.auth.signOut();
    }
}