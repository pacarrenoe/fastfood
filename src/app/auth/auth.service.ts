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
    signOut(this.auth).then(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    }).catch(err => {
      console.error('Error cerrando sesión', err);
    });
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  getUser(): User | null {
    return this.auth.currentUser;
  }
}
