import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { PagedResponse } from '@app/core/models/product-api.model';
import { AdminUserListItemDto } from '@app/admin/models/admin-user.model';

function toPagedResponse<T>(
  allItems: T[],
  page: number,
  size: number,
): PagedResponse<T> {
  const totalElements = allItems.length;
  const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / size);
  const start = page * size;

  return {
    content: allItems.slice(start, start + size),
    page,
    size,
    totalElements,
    totalPages,
    first: page === 0,
    last: totalPages === 0 || page >= totalPages - 1,
  };
}

const USERS: AdminUserListItemDto[] = [
  {
    id: 1,
    email: 'admin@smartcompare.com',
    type: 'ADMIN',
    preferences: [],
  },
  // ── The "Power User" ──
  {
    id: 2,
    email: 'dr.elena.vasquez.computational-biology@faculty-of-advanced-interdisciplinary-studies.university.edu',
    type: 'USER',
    preferences: [
      {
        id: 10,
        productCategoryId: 1,
        categoryName: 'Phones',
        categorySlug: 'phone',
        preferences: JSON.stringify({
          primaryUse:
            'Field research data capture, high-resolution microscopy companion imaging, secure VPN to HPC cluster, dual-SIM for international conference travel across EU and APAC regions',
          budget: '1200-1800 USD (institutional procurement card approved up to 2000 with dean sign-off)',
          cameraPriority: 'Critical — minimum 50MP main sensor, macro mode, RAW export, ProRes or equivalent',
          batteryLife: 'Minimum 14 hours mixed use; must survive full conference days without charging',
          storage: '512GB minimum, expandable via cloud sync to university OneDrive tenant',
          durability: 'IP68 required, military-grade case compatibility, screen protector pre-installed',
          osPreference: 'Latest Android or iOS with 5 years security patch guarantee',
          biometricAuth: 'Face + fingerprint, FIDO2 hardware key support mandatory for SSO',
          accessoryWishlist: '["Stylus","External battery pack","Car mount","Desktop dock"]',
          notes:
            'Previously used Pixel 7 Pro — dissatisfied with battery degradation after 18 months. Open to iPhone if Apple DEP enrollment is supported by campus IT.',
        }),
      },
      {
        id: 11,
        productCategoryId: 2,
        categoryName: 'Laptops',
        categorySlug: 'laptop',
        preferences: JSON.stringify({
          primaryUse:
            'R statistical computing, PyTorch model training (datasets up to 40GB), LaTeX manuscript authoring, Zoom lecturing with virtual whiteboard, occasional DaVinci Resolve 4K editing for grant pitch videos',
          budget: '2500-3500 USD — grant-funded, must itemize for NSF equipment supplement',
          portability: 'Under 2.0 kg strongly preferred; will carry daily between lab, lecture hall, and co-working space',
          ram: '32GB minimum, 64GB ideal for multi-VM Docker workflows',
          storage: '1TB NVMe minimum, second drive bay preferred for Time Machine / File History backup clone',
          gpu: 'Dedicated NVIDIA GPU with 8GB+ VRAM — CUDA required for lab toolchain compatibility',
          display: '15-inch minimum, 100% sRGB, anti-glare, 300+ nits for outdoor courtyard grading sessions',
          keyboard: 'Full-size with numeric pad, backlit, minimum 1.5mm key travel',
          ports: 'Minimum 2x USB-C TB4, HDMI 2.1, SD card reader for microscope SD exports',
          os: 'Windows 11 Pro or Linux dual-boot (Ubuntu 24.04 LTS) — IT must approve Secure Boot config',
          warranty: '3-year on-site with accidental damage protection',
          softwareLicenses: '["MATLAB","NVivo","EndNote","Adobe Creative Cloud edu"]',
          dealBreakers:
            'No soldered RAM, no proprietary charger-only USB-C ports, fan noise under 40dB during lecture recording',
        }),
      },
      {
        id: 12,
        productCategoryId: 3,
        categoryName: 'Tablets',
        categorySlug: 'tablet',
        preferences: JSON.stringify({
          primaryUse:
            'Annotating PDF journal articles during journal club, grading student problem sets with stylus, presenting poster-session slides at symposia, light email triage between meetings',
          budget: '600-1100 USD',
          screenSize: '12.9-inch minimum for split-screen PDF + notes workflow',
          stylus: 'Active stylus with sub-9ms latency, pressure sensitivity 4096+ levels, palm rejection',
          keyboard: 'Detachable keyboard case with trackpad — must function as laptop replacement on travel days',
          battery: '10+ hours video playback, USB-C PD charging with laptop charger interchangeability',
          ecosystem: 'Must sync annotations to Google Drive and Zotero reference manager',
          audio: 'Quad speakers for lecture hall video review without headphones',
          cellular: 'Optional 5G — Wi-Fi only acceptable if campus Eduroam roaming is reliable',
          accessibility: 'Screen reader compatibility, adjustable text scaling, high-contrast mode',
          colorPreference: 'Neutral — no glossy back that slides off lectern easel',
          priorDevices: '["iPad Air 4 (stolen 2023)","Surface Pro 8 (returned — battery issues)"]',
          annotationWorkflow:
            'Exports annotated PDFs as layered files compatible with Gradescope bulk upload pipeline used by department of 14 TAs',
        }),
      },
    ],
  },
  // ── Long Email ──
  {
    id: 3,
    email: 'this.is.a.very.long.email.address.for.testing.purposes.only@verylongdomainname-for-university-faculty-portal-testing.edu',
    type: 'USER',
    preferences: [
      {
        id: 13,
        productCategoryId: 2,
        categoryName: 'Laptops',
        categorySlug: 'laptop',
        preferences: JSON.stringify({
          primaryUse: 'Spreadsheets and email',
          budget: '800-1000',
          portability: 'High',
        }),
      },
    ],
  },
  {
    id: 4,
    email: 'prof.malik@faculty.edu',
    type: 'USER',
    preferences: [
      {
        id: 14,
        productCategoryId: 2,
        categoryName: 'Laptops',
        categorySlug: 'laptop',
        preferences: JSON.stringify({
          primaryUse: 'Data analysis & coding',
          budget: '2000+',
          portability: 'Medium',
          ram: '32GB',
          storage: '1TB SSD',
          gpu: 'Dedicated GPU preferred',
        }),
      },
    ],
  },
  {
    id: 5,
    email: 'emily.rodriguez@studentmail.edu',
    type: 'USER',
    preferences: [
      {
        id: 15,
        productCategoryId: 1,
        categoryName: 'Phones',
        categorySlug: 'phone',
        preferences: JSON.stringify({
          primaryUse: 'Social & photography',
          budget: '500-700',
          cameraPriority: 'High',
          storage: '128GB',
        }),
      },
    ],
  },
  // ── The "Ghost User" ──
  {
    id: 6,
    email: 'james.wilson@university.edu',
    type: 'USER',
    preferences: [],
  },
  {
    id: 7,
    email: 'ghost.account.no.preferences@campus.edu',
    type: 'USER',
    preferences: [],
  },
  {
    id: 8,
    email: 'tablet.reviewer@media-studies.edu',
    type: 'USER',
    preferences: [
      {
        id: 16,
        productCategoryId: 3,
        categoryName: 'Tablets',
        categorySlug: 'tablet',
        preferences: JSON.stringify({
          primaryUse: 'Video storyboarding and client pitch decks',
          budget: '900-1400',
          screenSize: '13-inch preferred',
          stylus: 'Required',
          apps: '["Procreate","LumaFusion","Notability"]',
        }),
      },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class AdminUserMockService {
  private readonly users = [...USERS];

  listUsers(page = 0, size = 20): Observable<PagedResponse<AdminUserListItemDto>> {
    const snapshot = this.users.map((u) => ({ ...u, preferences: [...u.preferences] }));
    return of(toPagedResponse(snapshot, page, size)).pipe(delay(300));
  }

  deleteUser(id: number): Observable<void> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    return of(void 0).pipe(delay(300));
  }
}
