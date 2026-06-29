import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { PRODUCT_CATEGORY_OPTIONS } from '@app/core/config/product-categories.config';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  protected readonly categoryLinks = PRODUCT_CATEGORY_OPTIONS;

  protected readonly teamMembers = ['Abdulrahman', 'Bishoy', 'Nadeen', 'Omar'];
}
