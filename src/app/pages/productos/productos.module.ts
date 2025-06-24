import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosComponent } from './productos.component';
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    ProductosComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    FormsModule,
    MatIcon,
    SharedModule
  ]
})
export class ProductosModule { }
