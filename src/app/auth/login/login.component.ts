import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { doc, getDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: string | null = null;
  mostrarLogin = false;
  cargando = true;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private firestore: Firestore,
    private toastr: ToastrService
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
      } else {
        this.mostrarLogin = true;
      }
      this.cargando = false;
    });
  }

  /* ----------------------------- Email/Password ---------------------------- */
  async loginWithEmail(): Promise<void> {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;

    try {
      const { user } = await signInWithEmailAndPassword(this.auth, email, password);
      await this.cacheNombreUsuario(user);
      this.router.navigateByUrl('/home');
    } catch (err) {
      this.toastr.error('Correo o contraseña inválida');
    }
  }

  /* ------------------------------- Google OAuth ----------------------------- */
  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const email = result.user.email;

      if (!email) {
        this.toastr.error('No se pudo obtener el correo electrónico de Google.');
        return;
      }

      // Verifica que el correo exista en tu Auth
      const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
      if (signInMethods.length === 0) {
        await result.user.delete();
        this.toastr.error('No te encuentras registrado.');
        return;
      }

      await this.cacheNombreUsuario(result.user);
      this.router.navigateByUrl('/home');
    } catch (err) {
      this.toastr.error('Error al iniciar sesión con Google.');
      console.error(err);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                           Utilidad para cachear nombre                     */
  /* -------------------------------------------------------------------------- */
  private async cacheNombreUsuario(user: User): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const datos = docSnap.data();
        const nombreCompleto = `${datos['nombre']} ${datos['apellido']}`;
        sessionStorage.setItem('usuario', nombreCompleto);
      } else {
        sessionStorage.setItem('usuario', user.email || 'Usuario');
      }
    } catch (err) {
      // Si falla la lectura de Firestore, al menos guarda el email
      sessionStorage.setItem('usuario', user.email || 'Usuario');
    }
  }
}
