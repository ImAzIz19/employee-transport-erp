import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '../../services/auth.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  imports: [RouterLink, CommonModule, TranslateModule, NzMenuModule],
  standalone: true,
})
export class NavBarComponent {
  isMenuOpen = false;
  activeDropdown: string | null = null;
  private router = inject(Router);

  constructor(private authService: AuthService) {
    // Close dropdowns when navigation occurs
    this.router.events.subscribe(() => {
      this.activeDropdown = null;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown(dropdownName: string) {
    this.activeDropdown = this.activeDropdown === dropdownName ? null : dropdownName;
  }

  isDropdownOpen(dropdownName: string): boolean {
    return this.activeDropdown === dropdownName;
  }

  logout() {
    this.authService.logout();
  }
}