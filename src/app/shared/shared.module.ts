// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {LoaderComponent} from "./loader/loader.component";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {NotFoundRedirectComponent} from "./not-found-redirect/not-found-redirect.component";
import { ProductoDialogComponent } from './producto-dialog/producto-dialog.component';
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { CategoriaDialogComponent } from './categoria-dialog/categoria-dialog.component';

@NgModule({
  declarations: [
    LoaderComponent,
    ConfirmDialogComponent,
    NotFoundRedirectComponent,
    ProductoDialogComponent,
    CategoriaDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatCheckbox,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  exports: [
    LoaderComponent,
    ConfirmDialogComponent,
    NotFoundRedirectComponent,
    ProductoDialogComponent,
    CategoriaDialogComponent
  ]
})
export class SharedModule { }
