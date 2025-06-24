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
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      data: {
        title: 'Editar categoría',
        nombre: cat.nombre
      }
    });

    dialogRef.afterClosed().subscribe((nuevoNombre: string) => {
      if (!nuevoNombre?.trim()) return;

      const duplicada = this.categorias.some(
        c => c.nombre.toLowerCase() === nuevoNombre.toLowerCase() && c.id !== cat.id
      );
      if (duplicada) {
        this.toastr.warning('Ya existe una categoría con ese nombre');
        return;
      }

      const actualizada = { ...cat, nombre: nuevoNombre };
      this.productosService.editarCategoria(actualizada);
      const index = this.categorias.findIndex(c => c.id === cat.id);
      if (index !== -1) this.categorias[index] = actualizada;
      this.cambiosPendientes = true;
    });
  }


  eliminarCategoria(cat: Categoria): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar categoría',
        message: `¿Eliminar "${cat.nombre}" y todos sus productos asociados?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.productosService.eliminarCategoria(cat);
        this.categorias = this.categorias.filter(c => c.id !== cat.id);
        this.productos = this.productos.filter(p => p.categoriaId !== cat.nombre);
        this.cambiosPendientes = true;
      }
    });
  }

  // -------------------- PRODUCTOS --------------------

  get productosFiltrados(): Producto[] {
    if (!this.categoriaSeleccionada) return this.productos;
    return this.productos.filter(p => p.categoriaId === this.categoriaSeleccionada);
  }

  abrirFormulario(): void {
    const dialogRef = this.dialog.open(ProductoDialogComponent, {
      data: {
        title: 'Nuevo producto',
        producto: null,
        categorias: this.categorias
      }
    });

    dialogRef.afterClosed().subscribe((nuevo: Producto | undefined) => {
      if (!nuevo) return;

      this.productosService.agregarProducto(nuevo);
      this.productos.push(nuevo);
      this.cambiosPendientes = true;
    });
  }

  editar(producto: Producto): void {
    const nombre = prompt('Editar nombre', producto.nombre);
    const precio = parseInt(prompt('Editar precio', producto.precio.toString()) || '', 10);
    if (!nombre || isNaN(precio)) return;

    const actualizado = { ...producto, nombre, precio };
    this.productosService.editarProducto(actualizado);
    const idx = this.productos.findIndex(p => p.id === producto.id);
    if (idx !== -1) this.productos[idx] = actualizado;
    this.cambiosPendientes = true;
  }

  eliminar(producto: Producto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar producto',
        message: `¿Eliminar "${producto.nombre}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.productosService.eliminarProducto(producto);
        this.productos = this.productos.filter(p => p.id !== producto.id);
        this.cambiosPendientes = true;
      }
    });
  }

  cambiarVigencia(producto: Producto): void {
    this.productosService.cambiarVigencia(producto.id!);
    producto.vigente = !producto.vigente;
    this.cambiosPendientes = true;
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

  puedeSalir(): boolean {
    return !this.cambiosPendientes;
  }







}
