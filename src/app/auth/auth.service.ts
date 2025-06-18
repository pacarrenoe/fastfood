// auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth).then(() => this.router.navigate(['/login']));
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  getUser(): User | null {
    return this.auth.currentUser;
  }
}
