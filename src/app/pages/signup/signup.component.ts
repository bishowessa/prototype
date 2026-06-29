import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { LandingFooterComponent } from '@app/shared/components/landing-footer/landing-footer.component';
import { FormInputComponent } from '@app/shared/components/form-input/form-input.component';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    IconComponent,
    NavbarComponent,
    LandingFooterComponent,
    FormInputComponent,
    RouterLink,
  ],
  templateUrl: './signup.component.html',
})
export class SignUpComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected email = '';
  protected password = '';
  protected confirmPassword = '';
  protected signupError = '';
  protected signupLoading = false;
  protected readonly returnUrl = this.resolveReturnUrl();

  protected onSubmit(): void {
    this.signupError = '';
    if (this.password !== this.confirmPassword) {
      this.signupError = 'Passwords do not match.';
      return;
    }

    this.signupLoading = true;
    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.signupLoading = false;
        void this.router.navigate(['/login'], {
          queryParams: { returnUrl: this.returnUrl },
        });
      },
      error: (err) => {
        this.signupError = err.error?.message || 'Registration failed. Please try again.';
        this.signupLoading = false;
      },
    });
  }

  private resolveReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      return returnUrl;
    }

    return '/onboarding';
  }
}
