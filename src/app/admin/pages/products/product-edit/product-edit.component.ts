import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminProductService } from '@app/admin/services/admin-product.service';
import { DynamicFieldEntry, UpdateProductRequest } from '@app/admin/models/admin-product.model';
import { buildSpecsFromFields, parseSpecsToFields } from '@app/admin/utils/json-field.util';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  templateUrl: './product-edit.component.html',
})
export class ProductEditComponent implements OnInit {
  private readonly productService = inject(AdminProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly productId = signal<number | null>(null);
  protected readonly categoryName = signal('');
  protected readonly categorySlug = signal('');
  protected readonly image = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  protected readonly name = signal('');
  protected readonly brand = signal('');
  protected readonly releaseDate = signal('');
  protected readonly sourceUrl = signal('');
  protected readonly hasVariants = signal(false);

  protected readonly dynamicFields = signal<DynamicFieldEntry[]>([]);
  protected readonly newFieldKey = signal('');
  protected readonly newFieldValue = signal('');

  protected readonly activeFields = computed(() =>
    this.dynamicFields().filter((f) => !f.markedForRemoval),
  );

  protected readonly specsPreview = computed(() =>
    buildSpecsFromFields(this.dynamicFields()),
  );

  protected readonly duplicateKeys = computed(() => {
    const keys = this.activeFields().map((f) => f.key.trim().toLowerCase()).filter(Boolean);
    return keys.length !== new Set(keys).size;
  });

  protected readonly canSave = computed(
    () =>
      this.name().trim().length > 0 &&
      this.brand().trim().length > 0 &&
      !this.duplicateKeys() &&
      !this.saving(),
  );

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || Number.isNaN(id)) {
      this.error.set('Invalid product ID.');
      this.loading.set(false);
      return;
    }

    this.productId.set(id);
    this.loadProduct(id);
  }

  protected updateFieldKey(index: number, key: string): void {
    this.dynamicFields.update((fields) =>
      fields.map((f, i) => (i === index ? { ...f, key } : f)),
    );
  }

  protected updateFieldValue(index: number, value: string): void {
    this.dynamicFields.update((fields) =>
      fields.map((f, i) => (i === index ? { ...f, value } : f)),
    );
  }

  protected removeField(index: number): void {
    this.dynamicFields.update((fields) => {
      const field = fields[index];
      if (field?.isNew) {
        return fields.filter((_, i) => i !== index);
      }
      return fields.map((f, i) => (i === index ? { ...f, markedForRemoval: true } : f));
    });
  }

  protected addField(): void {
    const key = this.newFieldKey().trim();
    const value = this.newFieldValue().trim();

    if (!key) {
      this.error.set('New field key cannot be empty.');
      return;
    }

    const exists = this.activeFields().some(
      (f) => f.key.trim().toLowerCase() === key.toLowerCase(),
    );
    if (exists) {
      this.error.set(`Field "${key}" already exists.`);
      return;
    }

    this.dynamicFields.update((fields) => [...fields, { key, value, isNew: true }]);
    this.newFieldKey.set('');
    this.newFieldValue.set('');
    this.error.set('');
  }

  protected save(): void {
    const id = this.productId();
    if (!id || !this.canSave()) return;

    this.saving.set(true);
    this.error.set('');

    const payload = this.buildUpdatePayload();
    console.log('Product Edit Payload:', payload);

    this.productService.updateProduct(id, payload).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/admin/products'], {
          state: { productSaved: true },
        });
      },
      error: (err: Error) => {
        this.saving.set(false);
        this.error.set(err.message);
      },
    });
  }

  private buildUpdatePayload(): UpdateProductRequest {
    const specs = this.specsPreview();

    return {
      name: this.name().trim(),
      brand: this.brand().trim(),
      categorySlug: this.categorySlug().trim(),
      releaseDate: this.formatReleaseDate(this.releaseDate()),
      image: this.image(),
      sourceUrl: this.sourceUrl().trim() || null,
      hasVariants: this.hasVariants(),
      specs: typeof specs === 'string' ? specs : JSON.stringify(specs),
    };
  }

  /** Backend expects LocalDate as strict YYYY-MM-DD or null. */
  private formatReleaseDate(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed.toISOString().slice(0, 10);
  }

  protected cancel(): void {
    void this.router.navigate(['/admin/products']);
  }

  private loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.name.set(product.name);
        this.brand.set(product.brand);
        this.releaseDate.set(product.releaseDate ?? '');
        this.sourceUrl.set(product.sourceUrl ?? '');
        this.hasVariants.set(product.hasVariants);
        this.categoryName.set(product.categoryName);
        this.categorySlug.set(product.categorySlug);
        this.image.set(product.image);
        this.dynamicFields.set(
          parseSpecsToFields(product.specs).map((f) => ({ ...f, isNew: false })),
        );
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
