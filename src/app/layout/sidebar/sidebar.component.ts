import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import {ConfirmDialogComponent, ConfirmDialogData} from "../../shared/confirm-dialog/confirm-dialog.component";



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  usuario: string = localStorage.getItem('usuario') || '';
  fechaActual: string = '';
  horaActual: string = '';
  private authSubscription?: Subscription;
  cargandoUsuario: boolean = true;

  constructor(private auth: Auth, private firestore: Firestore, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargandoUsuario = true;

    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        try {
          const docRef = doc(this.firestore, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            this.usuario = `${data['nombre']} ${data['apellido']}`;
          } else {
            this.usuario = user.email || 'Usuario';
          }
        } catch (err) {
          console.error('Error al obtener datos del usuario:', err);
          this.usuario = user.email || 'Usuario';
        }
      }
      this.cargandoUsuario = false;
    });

    this.actualizarFechaHora();
    setInterval(() => this.actualizarFechaHora(), 1000);
  }

  private toggleHandler = (e: Event) => {
    e.preventDefault();
    const wrapper = document.getElementById('wrapper');
    wrapper?.classList.toggle('menuDisplayed');
  };

  ngAfterViewInit(): void {
    document.getElementById('menu-toggle')?.addEventListener('click', this.toggleHandler);
  }

  ngOnDestroy(): void {
    document.getElementById('menu-toggle')?.removeEventListener('click', this.toggleHandler);
  }


  actualizarFechaHora() {
    const ahora = new Date();
    this.fechaActual = ahora.toLocaleDateString();
    this.horaActual = ahora.toLocaleTimeString();
  }

  confirmarLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Cerrar sesión',
        message: '¿Estás seguro de que quieres cerrar sesión?'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.logout();
      }
    });
  }

  logout() {
    console.log("cerrada")
  }
}
