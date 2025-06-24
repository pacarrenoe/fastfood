import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Producto} from "../../core/models/interfaces.model";


export interface ProductoDialogData {
  modo: 'nuevo' | 'editar';
  producto?: Producto;
  categorias: string[];
}

@Component({
  selector: 'app-producto-dialog',
  templateUrl: './producto-dialog.component.html',
  styleUrls: ['./producto-dialog.component.scss']
})
export class ProductoDialogComponent {
  form: FormGroup;
  modo: 'nuevo' | 'editar';

  constructor(
    public dialogRef: MatDialogRef<ProductoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoDialogData,
    private fb: FormBuilder
  ) {
    this.modo = data.modo;
    const p = data.producto;

    this.form = this.fb.group({
      nombre: [p?.nombre || '', Validators.required],
      precio: [p?.precio || 0, [Validators.required, Validators.min(100)]],
      categoriaId: [p?.categoriaId || '', Validators.required],
      vigente: [p?.vigente ?? true]
    });
  }

  guardar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
