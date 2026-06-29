import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Parses Markdown to sanitized HTML safe for [innerHTML] binding. */
export function renderMarkdownToSafeHtml(
  markdown: string | null | undefined,
  sanitizer: DomSanitizer,
  platformId: object,
): SafeHtml {
  if (!markdown?.trim()) {
    return sanitizer.bypassSecurityTrustHtml('');
  }

  if (!isPlatformBrowser(platformId)) {
    return sanitizer.bypassSecurityTrustHtml(`<p>${escapeHtml(markdown)}</p>`);
  }

  const rawHtml = marked.parse(markdown, { async: false }) as string;
  const clean = DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } });

  return sanitizer.bypassSecurityTrustHtml(clean);
}
