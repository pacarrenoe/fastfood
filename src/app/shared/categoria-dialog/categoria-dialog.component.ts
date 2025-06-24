import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Categoria} from "../../core/models/interfaces.model";
import {ProductosService} from "../../core/services/productos.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-categoria-dialog',
  templateUrl: './categoria-dialog.component.html',
  styleUrls: ['./categoria-dialog.component.scss']
})
export class CategoriaDialogComponent {
  form: FormGroup;
  categorias: Categoria[] = [];

  constructor(
    public dialogRef: MatDialogRef<CategoriaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string },
    private fb: FormBuilder,
    private productosService: ProductosService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  agregar(): void {
    if (this.form.invalid) return;

    const nombre = this.form.value.nombre.trim();
    if (this.categorias.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
      this.toastr.warning('Ya agregaste una categoría con ese nombre');
      return;
    }

    const nueva: Categoria = {
      id: this.productosService.generarId(),
      nombre
    };

    this.categorias.push(nueva);
    this.toastr.success('Categoría agregada');
    this.form.reset();
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  continuar(): void {
    this.dialogRef.close(this.categorias);
  }
}
