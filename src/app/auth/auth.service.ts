// auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private router: Router, private toastr: ToastrService) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    signOut(this.auth).then(() => {
      sessionStorage.clear();
      localStorage.clear();

      this.router.navigate(['/login']);
    }).catch(() => {
      this.toastr.error('Error cerrando sesion');
    });
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  getUser(): User | null {
    return this.auth.currentUser;
  }
}
