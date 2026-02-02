import { Component, inject } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [IconComponent, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly router = inject(Router);

  protected navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
