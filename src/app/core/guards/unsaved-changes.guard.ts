import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanExitComponent {
  puedeSalir(): boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanExitComponent> {
  canDeactivate(component: CanExitComponent): boolean | Observable<boolean> {
    if (component.puedeSalir()) {
      return true;
    }

    return confirm('Tienes cambios sin guardar. ¿Estás seguro que deseas salir?');
  }
}
