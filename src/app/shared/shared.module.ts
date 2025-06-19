// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {LoaderComponent} from "./loader/loader.component";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {NotFoundRedirectComponent} from "./not-found-redirect/not-found-redirect.component";

@NgModule({
  declarations: [
    LoaderComponent,
    ConfirmDialogComponent,
    NotFoundRedirectComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    LoaderComponent,
    ConfirmDialogComponent,
    NotFoundRedirectComponent
  ]
})
export class SharedModule { }
