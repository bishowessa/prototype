import { Pipe, PipeTransform, PLATFORM_ID, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderMarkdownToSafeHtml } from '@app/shared/utils/markdown.util';

@Pipe({
  name: 'markdownRender',
  standalone: true,
})
export class MarkdownRenderPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);

  transform(value: string | null | undefined): SafeHtml {
    return renderMarkdownToSafeHtml(value, this.sanitizer, this.platformId);
  }
}
