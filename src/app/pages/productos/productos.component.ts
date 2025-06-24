import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import {ProductosService} from '../../core/services/productos.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriaDialogComponent } from "../../shared/categoria-dialog/categoria-dialog.component";
import { ProductoDialogComponent } from "../../shared/producto-dialog/producto-dialog.component";
import {Categoria, Producto} from "../../core/models/interfaces.model";
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  categorias: Categoria[] = [];
  productos: Producto[] = [];
  categoriaSeleccionada = '';
  cambiosPendientes = false;
  cargando = false;

  constructor(
    private productosService: ProductosService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const catData = sessionStorage.getItem('categorias');
    const prodData = sessionStorage.getItem('productos');

    this.categorias = catData ? JSON.parse(catData) : [];
    this.productos = prodData ? JSON.parse(prodData) : [];

    this.productosService.getCategoriasLocales(); // opcional si deseas mantener sincronizado
    this.productosService.getProductosLocales();
  }

  @HostListener('window:beforeunload', ['$event'])
  confirmarSalida($event: any): void {
    if (this.cambiosPendientes) {
      $event.returnValue = true;
    }
  }

  guardarCambios(): void {
    this.cargando = true;
    this.toastr.info('Guardando cambios...');

    this.productosService.guardarCambios()
      .then(() => {
        this.toastr.success('Cambios guardados correctamente');
        this.cambiosPendientes = false;

        this.productosService.getCategoriasLocales();
        this.productosService.getProductosLocales();

        setTimeout(() => {
          sessionStorage.setItem('categorias', JSON.stringify(this.categorias));
          sessionStorage.setItem('productos', JSON.stringify(this.productos));
          this.cargando = false;
        }, 500);
      })
      .catch(() => {
        this.toastr.error('Error al guardar los cambios');
        this.cargando = false;
      });
  }

  // -------------------- CATEGORÍAS --------------------

  agregarCategoria(): void {
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      data: { title: 'Nueva categoría' }
    });

    dialogRef.afterClosed().subscribe((nuevasCategorias: Categoria[] | undefined) => {
      if (!nuevasCategorias || nuevasCategorias.length === 0) return;

      nuevasCategorias.forEach(cat => {
        const existe = this.categorias.some(c => c.nombre.toLowerCase() === cat.nombre.toLowerCase());
        if (!existe) this.categorias.push(cat);
      });

      this.cambiosPendientes = true;
      this.toastr.info('Recuerda guardar los cambios');
    });
  }


  editarCategoria(cat: Categoria): void {

  }


  eliminarCategoria(cat: Categoria): void {

  }

  // -------------------- PRODUCTOS --------------------














}
