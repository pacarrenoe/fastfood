import { Component, AfterViewInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements AfterViewInit, OnDestroy {
  private toggleHandler = (e: Event) => {
    e.preventDefault();
    const wrapper = document.getElementById('wrapper');
    wrapper?.classList.toggle('menuDisplayed');
  };

  ngAfterViewInit(): void {
    document.getElementById('menu-toggle')?.addEventListener('click', this.toggleHandler);
  }

  ngOnDestroy(): void {
    document.getElementById('menu-toggle')?.removeEventListener('click', this.toggleHandler);
  }
}
