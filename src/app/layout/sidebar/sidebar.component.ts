import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  usuario: string = sessionStorage.getItem('usuario') || 'Usuario';
  fechaActual: string = '';
  horaActual: string = '';
  cargandoUsuario: boolean = true;
  menuAbierto = true;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private dialog: MatDialog,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    if (this.usuario !== '') {
      this.cargandoUsuario = false;
    }
    this.actualizarFechaHora();
    setInterval(() => this.actualizarFechaHora(), 1000);
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  actualizarFechaHora() {
    const ahora = new Date();
    this.fechaActual = ahora.toLocaleDateString();
    this.horaActual = ahora.toLocaleTimeString();
  }

  confirmarLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cerrar sesión',
        message: '¿Estás seguro de que deseas cerrar sesión?',
        confirmText: 'Cerrar sesión',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        sessionStorage.clear();
        localStorage.clear();
        this.authService.logout();
      }
    });
  }
}
