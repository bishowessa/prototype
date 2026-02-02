import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <span
      class="material-symbols-outlined"
      [class]="sizeClass() + (customClass() ? ' ' + customClass() : '') + (filled() ? ' fill-current' : '')"
    >{{ name() }}</span>
  `,
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly customClass = input<string>('');
  readonly filled = input<boolean>(false);

  protected sizeClass(): string {
    switch (this.size()) {
      case 'sm':
        return '!text-sm';
      case 'lg':
        return '!text-lg';
      case 'xl':
        return '!text-[32px]';
      default:
        return '';
    }
  }
}
