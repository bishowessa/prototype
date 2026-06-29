import { Component } from '@angular/core';
import { FooterComponent } from '@app/shared/components/footer/footer.component';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [FooterComponent],
  template: `<app-footer />`,
})
export class LandingFooterComponent {}
