import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { LandingFooterComponent } from '@app/shared/components/landing-footer/landing-footer.component';
import { FormInputComponent } from '@app/shared/components/form-input/form-input.component';
import { FormCheckboxComponent } from '@app/shared/components/form-checkbox/form-checkbox.component';
import { AuthService } from '@app/core/services/auth.service';
import { StorageService } from '@app/core/services/storage.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    IconComponent,
    NavbarComponent,
    LandingFooterComponent,
    FormCheckboxComponent,
    FormInputComponent,
    RouterLink,
  ],
  templateUrl: './signup.component.html',
})
export class SignUpComponent {
  private readonly authService = inject(AuthService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected confirmPassword = '';
  protected terms = false;
  protected signupError = '';
  protected signupLoading = false;

  protected toggleTerms(event: Event): void {
    event.preventDefault();
    this.terms = !this.terms;
  }

  protected onSubmit(): void {
    this.signupError = '';
    if (this.password !== this.confirmPassword) {
      this.signupError = 'Passwords do not match.';
      return;
    }
    if (!this.terms) {
      this.signupError = 'You must agree to the Terms of Service and Privacy Policy.';
      return;
    }
    this.signupLoading = true;
    this.authService.register(this.email, this.password).subscribe({
      next: (result) => {
        this.storage.setItem('user', result.user, 'local');
        this.storage.setItem('token', result.token, 'local');
        this.signupLoading = false;
        this.router.navigate(['/onboarding']);
      },
      error: (err: Error) => {
        this.signupError = err?.message ?? 'Registration failed. Please try again.';
        this.signupLoading = false;
      },
    });
  }
}
