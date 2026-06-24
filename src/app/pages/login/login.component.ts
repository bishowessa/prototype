import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { FormInputComponent } from '@app/shared/components/form-input/form-input.component';
import { FormCheckboxComponent } from '@app/shared/components/form-checkbox/form-checkbox.component';
import { AuthService } from '@app/core/services/auth.service';
import { StorageService, StorageType } from '@app/core/services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, IconComponent, FormInputComponent, FormCheckboxComponent, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected remember = false;
  protected loginError = false;
  protected loginLoading = false;

  protected onSubmit(): void {
    this.loginError = false;
    this.loginLoading = true;
    const storageType: StorageType = this.remember ? 'local' : 'session';
    
    this.authService.login(this.email, this.password).subscribe({
      next: (result) => {
        // Save token to correct storage type based on "Remember Me"
        if (result.token) this.storage.setItem('token', result.token, storageType);
        if (result.user) this.storage.setItem('user', JSON.stringify(result.user), storageType);
        
        this.loginLoading = false;
        this.router.navigate(['/']); // Go to home page
      },
      error: () => {
        this.loginError = true;
        this.loginLoading = false;
      },
    });
  }
}