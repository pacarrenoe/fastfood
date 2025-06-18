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
  onAuthStateChanged, User
} from '@angular/fire/auth';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: string | null = null;
  mostrarLogin: boolean = false;
  cargando: boolean = true;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
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
      this.cargando = false; // termina la espera
    });
  }

  async loginWithEmail() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user: User = userCredential.user;

      const cachedNombre = localStorage.getItem('usuario');
      if (!cachedNombre) {
        const docRef = doc(this.firestore, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const datos = docSnap.data();
          const nombreCompleto = `${datos['nombre']} ${datos['apellido']}`;
          localStorage.setItem('usuario', nombreCompleto);
        } else {
          localStorage.setItem('usuario', user.email || 'Usuario');
        }
      }

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
        await result.user.delete();
        this.error = 'Ups, no te encuentras registrado.';
        return;
      }

      const user = result.user;

      const cachedNombre = localStorage.getItem('usuario');
      if (!cachedNombre && user) {
        const docRef = doc(this.firestore, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const datos = docSnap.data();
          const nombreCompleto = `${datos['nombre']} ${datos['apellido']}`;
          localStorage.setItem('usuario', nombreCompleto);
        } else {
          localStorage.setItem('usuario', user.email || 'Usuario');
        }
      }

      this.router.navigateByUrl('/home');

    } catch (err: any) {
      this.error = err.message ?? 'Error al iniciar sesión con Google';
      console.error(err);
    }
  }
}
