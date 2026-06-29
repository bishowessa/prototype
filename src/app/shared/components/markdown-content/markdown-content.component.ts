import { Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { renderMarkdownToSafeHtml } from '@app/shared/utils/markdown.util';

@Component({
  selector: 'app-markdown-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="app-markdown text-[#4c669a] dark:text-gray-300 leading-relaxed"
      [class.text-sm]="size() === 'sm'"
      [class.text-base]="size() === 'md'"
      [innerHTML]="html()"
    ></div>
  `,
  styles: [
    `
      .app-markdown > :first-child {
        margin-top: 0;
      }

      .app-markdown > :last-child {
        margin-bottom: 0;
      }

      .app-markdown h1,
      .app-markdown h2,
      .app-markdown h3,
      .app-markdown h4 {
        color: inherit;
        font-weight: 800;
        line-height: 1.3;
        margin: 1.25rem 0 0.5rem;
      }

      .app-markdown h1 {
        font-size: 1.25rem;
      }

      .app-markdown h2 {
        font-size: 1.125rem;
      }

      .app-markdown h3 {
        font-size: 1rem;
      }

      .app-markdown h4 {
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .app-markdown p {
        margin: 0.5rem 0;
      }

      .app-markdown strong {
        color: #0d121b;
        font-weight: 700;
      }

      :is(.dark) .app-markdown strong {
        color: #f8fafc;
      }

      .app-markdown ul,
      .app-markdown ol {
        margin: 0.5rem 0 0.75rem;
        padding-left: 1.25rem;
      }

      .app-markdown ul {
        list-style-type: disc;
      }

      .app-markdown ol {
        list-style-type: decimal;
      }

      .app-markdown li {
        margin: 0.25rem 0;
      }

      .app-markdown li::marker {
        color: #135bec;
      }

      .app-markdown blockquote {
        border-left: 3px solid #135bec;
        margin: 0.75rem 0;
        padding: 0.25rem 0 0.25rem 0.875rem;
        color: #64748b;
      }

      :is(.dark) .app-markdown blockquote {
        color: #94a3b8;
      }

      .app-markdown code {
        background: #e7ebf3;
        border-radius: 0.25rem;
        font-size: 0.85em;
        padding: 0.1rem 0.35rem;
      }

      :is(.dark) .app-markdown code {
        background: #1e293b;
      }

      .app-markdown pre {
        background: #e7ebf3;
        border-radius: 0.5rem;
        margin: 0.75rem 0;
        overflow-x: auto;
        padding: 0.75rem 1rem;
      }

      :is(.dark) .app-markdown pre {
        background: #1e293b;
      }

      .app-markdown pre code {
        background: transparent;
        padding: 0;
      }

      .app-markdown table {
        border-collapse: collapse;
        display: block;
        margin: 0.75rem 0;
        overflow-x: auto;
        width: 100%;
      }

      .app-markdown th,
      .app-markdown td {
        border: 1px solid #cfd7e7;
        padding: 0.5rem 0.75rem;
        text-align: left;
        vertical-align: top;
      }

      :is(.dark) .app-markdown th,
      :is(.dark) .app-markdown td {
        border-color: #334155;
      }

      .app-markdown th {
        background: #f8fafc;
        color: #0d121b;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      :is(.dark) .app-markdown th {
        background: #0f172a;
        color: #f8fafc;
      }

      .app-markdown tr:nth-child(even) td {
        background: rgb(19 91 236 / 0.03);
      }

      :is(.dark) .app-markdown tr:nth-child(even) td {
        background: rgb(19 91 236 / 0.08);
      }

      .app-markdown hr {
        border: none;
        border-top: 1px solid #cfd7e7;
        margin: 1rem 0;
      }

      :is(.dark) .app-markdown hr {
        border-top-color: #334155;
      }

      .app-markdown a {
        color: #135bec;
        font-weight: 600;
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      .app-markdown a:hover {
        opacity: 0.85;
      }
    `,
  ],
})
export class MarkdownContentComponent {
  readonly content = input<string>('');
  readonly size = input<'sm' | 'md'>('md');

  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly html = computed(() =>
    renderMarkdownToSafeHtml(this.content(), this.sanitizer, this.platformId),
  );
}
