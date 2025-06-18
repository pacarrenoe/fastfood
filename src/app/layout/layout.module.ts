import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutComponent } from './layout.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SidebarComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterModule
  ]
})
export class LayoutModule { }
