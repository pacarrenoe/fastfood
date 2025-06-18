import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  onAuthStateChanged
} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.router.navigateByUrl('/home');
      }
    });
  }

  async loginWithEmail() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;

    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigateByUrl('/home');
    } catch (err: any) {
      this.error = err.message ?? 'Correo o contraseña inválida';
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const email = result.user.email;

      if (!email) {
        this.error = 'No se pudo obtener el correo electrónico de Google.';
        return;
      }

      const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);

      if (signInMethods.length === 0) {
        await result.user.delete(); // Elimina el usuario recién creado
        this.error = 'Ups, no te encuentras registrado.';
        return;
      }

      this.router.navigateByUrl('/home');

    } catch (err: any) {
      this.error = err.message ?? 'Error al iniciar sesión con Google';
      console.error(err);
    }
  }
}
