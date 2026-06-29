import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { FormInputComponent } from '@app/shared/components/form-input/form-input.component';
import { AuthService } from '@app/core/services/auth.service';
import { AuthStateService } from '@app/core/services/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, IconComponent, FormInputComponent, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected email = '';
  protected password = '';
  protected readonly loginError = signal(false);
  protected readonly loginLoading = signal(false);
  protected readonly returnUrl = this.resolveReturnUrl();

  protected onSubmit(): void {
    this.loginError.set(false);
    this.loginLoading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: (result) => {
        this.authState.establishSessionFromLogin(result, this.email);
        this.loginLoading.set(false);

        if (result.role === 'ADMIN') {
          void this.router.navigate(['/admin/dashboard']);
          return;
        }

        void this.router.navigateByUrl(this.returnUrl);
      },
      error: () => {
        this.loginError.set(true);
        queueMicrotask(() => this.loginLoading.set(false));
      },
    });
  }

  private resolveReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      return returnUrl;
    }

    return '/';
  }
}
