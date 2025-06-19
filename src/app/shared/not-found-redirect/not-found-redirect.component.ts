import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-not-found-redirect',
  templateUrl: './not-found-redirect.component.html',
  styleUrl: './not-found-redirect.component.scss'
})
export class NotFoundRedirectComponent {

  private router = inject(Router);
  private auth = inject(Auth);

  constructor() {
    setTimeout(() => {
      const user = this.auth.currentUser;
      if (user) {
        this.router.navigateByUrl('/home');
      } else {
        this.router.navigateByUrl('/login');
      }
    }, 300);
  }
}
