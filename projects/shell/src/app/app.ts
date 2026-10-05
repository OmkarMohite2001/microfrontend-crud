import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly isSidebarOpen = signal<boolean>(true);
  readonly isLogoutModalOpen = signal<boolean>(false);
  readonly isLoggedOut = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update((v) => !v);
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth < 768) {
      this.isSidebarOpen.set(false);
    }
  }

  openLogoutModal(): void {
    this.isLogoutModalOpen.set(true);
  }

  cancelLogout(): void {
    this.isLogoutModalOpen.set(false);
  }

  confirmLogout(): void {
    this.isLogoutModalOpen.set(false);
    this.isLoggedOut.set(true);
  }

  reLogin(): void {
    this.isLoggedOut.set(false);
  }
}
