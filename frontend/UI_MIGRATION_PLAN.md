# EduTrack UI Migration Plan — v2 Redesign

> **Maqsad:** `frontend/design/` papkasidagi v2 design system'ni mavjud Angular 21 loyihasiga ko'chirish.
>
> **Bu fayl yangi chat sessiyasida ishlatish uchun yozilgan — o'z-o'zicha tushunarli, kontekstsiz boshlash mumkin.**

---

## 0. Avval bilish kerak bo'lgan kontekst

### 0.1 Loyiha holati

- **Backend:** ASP.NET Core 8, SQLite, JWT auth (Admin / Teacher / Student rollari).
  Yaqinda xavfsizlik refactor'i o'tkazilgan: User Secrets, path traversal himoyasi,
  JWT claim'larida `profile_id`, FileValidator, GlobalExceptionMiddleware,
  Service layer transactions, IUserRepository typo tuzatildi, Swagger faqat dev'da.
- **Frontend:** Angular 21 standalone components, signals, control flow (`@if/@for`),
  Material 21, Tailwind utility, ngx-quill (news editor), sweetalert2 (ishlatilmaydi).
  Aliases: `@core/*`, `@shared/*`, `@features/*`, `@environments/*`.
- **Yaqinda tozalangan:** `submissions.service` da `studentId` olib tashlandi (JWT'dan keladi),
  `error.interceptor` login 401'da logout chaqirmaydi, `role.guard` `returnUrl` saqlaydi,
  `app.component` `setTimeout(300)` o'rniga `takeUntilDestroyed`. Dead kod o'chirildi:
  `common-data.service.ts`, `material/material.imports.ts`. Yangi backend endpoint
  `GET /api/Submissions/by-employee/{id}` (frontend N+1'ni yo'qotish uchun).

### 0.2 Mavjud frontend strukturasi

```
frontend/src/
├── app/
│   ├── app.component.ts        # root, progress bar
│   ├── app.config.ts           # provideRouter, interceptors
│   ├── app.routes.ts           # lazy-load: landing, auth, cabinet
│   ├── core/
│   │   ├── guards/             # auth.guard, role.guard
│   │   ├── interceptors/       # api (token + base url), error
│   │   ├── models/             # user.model, api-response.model
│   │   └── services/           # auth, storage, notification, va 11 ta resurs servicelari
│   ├── features/
│   │   ├── auth/login/         # ✅ login (templateUrl + styleUrl bor)
│   │   ├── cabinet/
│   │   │   ├── layout/         # ✅ cabinet-layout (templateUrl + styleUrl bor; mat-sidenav)
│   │   │   ├── director/       # dashboard, professions, employees, students, groups, subjects, esg, news
│   │   │   ├── teacher/        # assignments, submissions
│   │   │   └── student/        # my-assignments, my-grades
│   │   └── landing/            # home, news-detail, header, footer (✅ allaqachon Tailwind bilan dizayn)
│   └── shared/
│       ├── components/loading/
│       └── models/common.models.ts
├── environments/
│   ├── environment.ts          # production: http://edutrack.warehouse-system.uz/api
│   └── environment.development.ts  # https://localhost:7000/api
├── styles.scss                 # globalniy: scrollbar, snackbar overrides, mat-card spacing
└── index.html

frontend/design/               # ⭐ MIGRATSIYA MANBAYI
├── styles/                    # _tokens, _theme, _typography, _utilities, styles.scss
├── components/                # 5 ta komponent SCSS namunasi
└── docs/                      # 5 ta yo'riqnoma faylasi
```

### 0.3 Mavjud sahifalarning vizual holati

Aksariyat CRUD sahifalari **takrorlangan shablon**da yozilgan: inline template (60+ qator),
inline styles (15-20 qator hardcoded ranglar `#26a69a`, `#5c6bc0`, ...), `mat-table`,
`mat-card`, `mat-icon-button`. Har sahifada bir xil:
- `.page-header { display: flex; justify-content: space-between; }`
- `.page-title { display: flex; gap: 10px; }`
- `.title-icon { color: #26a69a; }`
- `.spinner-wrap`, `.empty-state`, ...

Ya'ni: **5+ sahifani bir vaqtda yangilash** uchun reusable komponent yaratish DRY uchun foydali bo'ladi.

Login va Cabinet layout — yagona `templateUrl` + `styleUrl` ishlatadi, ulardagi
HTML va SCSS to'liq qayta yozilishi kerak (design'da namuna bor).

Landing (`/home`, news-detail) — allaqachon Tailwind utility'lari bilan dizayn qilingan;
**migratsiya tegmaydi** yoki minimal o'zgartirish.

### 0.4 Asosiy "tushib qoluvchi joy"lar

1. **`angular.json` dagi `azure-blue.css` import'ini olib tashlash** —
   yangi M3 tema bilan to'qnashadi. Path: `frontend/angular.json:36`.
2. **`mat-sidenav` o'rnini CSS Grid bilan almashtirish** (cabinet-layout) —
   yangi dizayn `<aside>` + `<main>` ishlatadi. `MatSidenavModule` import'ini ham
   olib tashlash.
3. **`design/components/*.scss` ichidagi `@use '../../../../styles/tokens'`** —
   bu path mavjud loyihaga to'g'ri kelmaydi. Real path: `@use 'src/styles/tokens'`
   yoki SCSS `includePaths`'ga `src/styles` qo'shish.
4. **Hardcoded ranglar** — har bir komponent SCSS'idagi `#26a69a` kabilarni
   olib tashlab, `var(--et-...)` yoki Material M3 token'lariga o'tkazish.
5. **`index.html`'ga Google Fonts qo'shish** (Plus Jakarta Sans, Fraunces, JetBrains Mono).
6. **Login parol minLength** — 6 (backend bilan moslashgan).

---

## 1. BOSQICH — Tokens + Theme + Global stillar (1 kun)

**Maqsad:** Dizayn'ning fundamental qatlamini o'rnatish. Bu bosqichdan keyin
sahifalar to'g'ridan-to'g'ri new look olmaydi, lekin **shrift, fon, brand ranglar**
o'zgaradi va keyingi bosqichlar uchun zamin bo'ladi.

### 1.1 Style fayllarni ko'chirish

```bash
cd frontend
mkdir -p src/styles
cp design/styles/_tokens.scss      src/styles/_tokens.scss
cp design/styles/_theme.scss       src/styles/_theme.scss
cp design/styles/_typography.scss  src/styles/_typography.scss
cp design/styles/_utilities.scss   src/styles/_utilities.scss
```

`src/styles.scss` ni to'liq almashtirish:

```scss
@use './styles/tokens';
@use './styles/theme';
@use './styles/typography';
@use './styles/utilities';

// Base reset
* { box-sizing: border-box; }
html, body { height: 100%; margin: 0; padding: 0; }
body { background: var(--et-bg); color: var(--et-ink); }

// Scrollbar
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb {
  background: var(--et-line-2);
  border-radius: 999px;
  border: 2px solid var(--et-bg);
  &:hover { background: var(--et-ink-4); }
}

::selection { background: var(--et-primary-100); color: var(--et-primary-800); }

.mat-mdc-button-base { letter-spacing: -0.01em !important; }
.mat-mdc-icon-button { --mdc-icon-button-state-layer-size: 40px; }

:focus-visible {
  outline: 2px solid var(--et-primary-400);
  outline-offset: 2px;
  border-radius: 4px;
}

// Eski snackbar override'larini qoldiring (yoki _theme.scss'dagi M3 versiyasiga ishoning)
```

### 1.2 `angular.json` — azure-blue olib tashlash

`frontend/angular.json` da `architect.build.options.styles` massivini topib:
```json
"styles": [
  "@angular/material/prebuilt-themes/azure-blue.css",  ← O'CHIRING
  "src/styles.scss"
]
```
Aylantirish:
```json
"styles": [ "src/styles.scss" ]
```

### 1.3 `index.html` — Google Fonts

`frontend/src/index.html` `<head>` ichiga:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,500;0,600;1,500&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
```

### 1.4 Verifikatsiya

```bash
cd frontend
npx ng build --configuration development
```
- Build muvaffaqiyatli o'tishi kerak (0 errors).
- `npm start` qiling, login sahifasiga kiring — fon `#F6F5F1` (cream) bo'lishi kerak,
  shrift Plus Jakarta Sans, Material'ning ko'k tugmalar indigo'ga o'zgargan bo'lishi kerak.
- Hech qanday console error bo'lmasligi kerak.

### 1.5 Commit

```
git add src/styles src/styles.scss src/index.html angular.json
git commit -m "feat(ui): introduce v2 design tokens, M3 theme and global stylesheet"
```

---

## 2. BOSQICH — Login (1 kun)

### 2.1 SCSS

`frontend/design/components/login.component.scss` ichidagi
`@use '../../../../styles/tokens'` va `@use '../../../../styles/utilities'`
path'larini loyiha strukturasiga moslab qayta yozish:

```scss
@use 'styles/tokens' as *;
@use 'styles/utilities' as *;
```
(yoki SCSS `loadPaths`'ga `src` qo'shilgan bo'lsa).

So'ng faylni ko'chirish:
```bash
cp design/components/login.component.scss \
   src/app/features/auth/login/login.component.scss
```

### 2.2 HTML

`frontend/src/app/features/auth/login/login.component.html` ni quyidagicha qayta yozish:

```html
<div class="login-shell">
  <aside class="login-brand">
    <div class="brand-mark">
      <div class="logo-glyph">E</div>
      <span>EduTrack</span>
    </div>

    <div class="brand-headline">
      <h1>Texnikum hayotini <em>raqamlashtiramiz</em></h1>
      <p>Direktor, o'qituvchi va o'quvchi uchun bitta tizim. Topshiriq, davomat, baho — barchasi shu yerda.</p>
    </div>

    <div class="brand-stats">
      <div class="stat"><div class="num">1,240</div><div class="label">O'quvchilar</div></div>
      <div class="stat"><div class="num">86</div><div class="label">O'qituvchilar</div></div>
      <div class="stat"><div class="num">42</div><div class="label">Guruhlar</div></div>
    </div>
  </aside>

  <section class="login-form-wrap">
    <div class="login-card">
      <div class="eyebrow">Kabinet · Kirish</div>
      <h2>Xush kelibsiz</h2>
      <p class="subtitle">Hisobingizga kirish uchun ma'lumotlaringizni kiriting.</p>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Foydalanuvchi nomi</mat-label>
          <input matInput formControlName="username" autocomplete="username">
          <mat-icon matPrefix>person</mat-icon>
          @if (loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched) {
            <mat-error>Foydalanuvchi nomi talab qilinadi</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Parol</mat-label>
          <input matInput
                 [type]="hidePassword() ? 'password' : 'text'"
                 formControlName="password"
                 autocomplete="current-password">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button"
                  (click)="togglePasswordVisibility()" [disabled]="loading()">
            <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
            <mat-error>Parol talab qilinadi</mat-error>
          }
          @if (loginForm.get('password')?.hasError('minlength')) {
            <mat-error>Kamida 6 ta belgi</mat-error>
          }
        </mat-form-field>

        <div class="help-row">
          <label><input type="checkbox"> Meni eslab qol</label>
          <a href="#">Parolni unutdingizmi?</a>
        </div>

        <button mat-raised-button type="submit"
                class="full-width login-button"
                [disabled]="loginForm.invalid || loading()">
          @if (loading()) {
            <mat-spinner diameter="20"></mat-spinner>
            <span>Yuklanmoqda...</span>
          } @else {
            <span>Kirish</span>
          }
        </button>
      </form>

      <div class="role-hint">
        <strong>Eslatma:</strong> rolingizga qarab tizim sizni kerakli kabinetga yo'naltiradi —
        Direktor, O'qituvchi yoki O'quvchi.
      </div>
    </div>
  </section>
</div>
```

### 2.3 TS

`login.component.ts` da o'zgarmas qoladi. **Faqat tekshiruv:**
parol `Validators.minLength(6)` — ha (yaqinda 4 → 6 qilingan).

### 2.4 Statlarni real qilish (ixtiyoriy)

Brand-stats `1,240/86/42` hardcoded. Agar real qiymat kerak bo'lsa,
`DashboardService.getStats()` chaqirib, signal'larga yozish mumkin.
**Lekin login sahifa auth talab qilmaydi** — hardcoded qoldirgan ma'qul,
yoki backend'ga yangi public endpoint qo'shish.

### 2.5 Verifikatsiya

- `npm start`, login sahifasini ochib chap brand panel + dark indigo gradient + teal glow ko'rinishini tekshiring.
- Foydalanuvchi nomi/parol kiritib login bo'lishini tekshiring.
- 960px'dan kichik kenglikda chap panel yashirinishi kerak.

### 2.6 Commit

```
git commit -m "feat(ui): redesign login with brand panel and v2 form layout"
```

---

## 3. BOSQICH — Cabinet Layout (2 kun)

**Eng katta o'zgarish:** `mat-sidenav` o'rnini CSS Grid + `<aside>`/`<main>` egallaydi.

### 3.1 SCSS

`design/components/cabinet-layout.component.scss` ni
`src/app/features/cabinet/layout/cabinet-layout.component.scss`'ga ko'chirish
(path'larni 1.1'dagi kabi tuzating).

### 3.2 HTML — `cabinet-layout.component.html`

```html
<div class="cabinet-shell" [class.collapsed]="collapsed()" [class.mobile-open]="mobileOpen()">

  <aside class="sidebar">
    <div class="brand">
      <div class="logo">E</div>
      <div class="name">
        EduTrack
        <span class="domain">Texnikum #14</span>
      </div>
    </div>

    <div class="nav-section">Asosiy</div>
    @for (item of filteredMenuItems; track item.route) {
      <a [routerLink]="item.route"
         routerLinkActive="active"
         class="nav-item"
         (click)="onNavItemClick()">
        <mat-icon>{{ item.icon }}</mat-icon>
        <span>{{ item.label }}</span>
      </a>
    }

    <div class="sidebar-footer">
      <div class="me-card" [matMenuTriggerFor]="userMenu">
        <div class="et-avatar" [style.background]="userColor()">{{ userInitials() }}</div>
        <div class="who">
          <div class="name">{{ userDisplayName }}</div>
          <div class="role">{{ userRoleDisplay }}</div>
        </div>
        <mat-icon style="color:var(--et-ink-4);font-size:18px;">expand_more</mat-icon>
      </div>
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item><mat-icon>person</mat-icon>Profil</button>
        <button mat-menu-item><mat-icon>settings</mat-icon>Sozlamalar</button>
        <button mat-menu-item (click)="openLogoutModal()"><mat-icon>logout</mat-icon>Chiqish</button>
      </mat-menu>
    </div>
  </aside>

  <main class="main">
    <header class="topbar">
      <div class="search">
        <mat-icon>search</mat-icon>
        <input placeholder="Qidirish: o'quvchi, guruh, fan...">
        <kbd>⌘K</kbd>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" aria-label="Bildirishnomalar">
          <mat-icon>notifications_none</mat-icon>
          <span class="dot"></span>
        </button>
        <button class="icon-btn" aria-label="Yordam">
          <mat-icon>help_outline</mat-icon>
        </button>
        <button class="icon-btn" aria-label="Tema almashtirish" (click)="toggleTheme()">
          <mat-icon>{{ darkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
      </div>
    </header>

    <div class="content">
      <router-outlet></router-outlet>
    </div>
  </main>
</div>

<!-- Logout modal'ni hozirgi kabi qoldirish mumkin -->
@if (showLogoutModal()) { ... }
```

### 3.3 TS — `cabinet-layout.component.ts`

Mavjud `MenuItem` va `filteredMenuItems` saqlanadi. Qo'shilishi kerak:

```ts
import { computed, signal } from '@angular/core';

collapsed = signal(false);
mobileOpen = signal(false);
darkMode = signal(localStorage.getItem('et-theme') === 'dark');

userInitials = computed(() => {
  const u = this.authService.currentUser();
  return (u?.username ?? '??').slice(0, 2).toUpperCase();
});

userColor = computed(() => {
  const palette = ['#4F5DE0', '#14B89A', '#F58A3D', '#8E47C7'];
  const u = this.authService.currentUser()?.username ?? '';
  let hash = 0;
  for (const c of u) hash = (hash * 31 + c.charCodeAt(0)) & 0xfff;
  return palette[hash % palette.length];
});

toggleTheme() {
  this.darkMode.update(v => !v);
  document.documentElement.setAttribute(
    'data-theme', this.darkMode() ? 'dark' : 'light'
  );
  localStorage.setItem('et-theme', this.darkMode() ? 'dark' : 'light');
}

ngOnInit() {
  // saqlangan tema'ni qo'llash
  if (this.darkMode()) document.documentElement.setAttribute('data-theme', 'dark');
}
```

### 3.4 Import'larni tozalash

`MatSidenavModule`, `MatToolbarModule`, `MatListModule` kerak emas (CSS Grid + `<a>` ishlatamiz).
`MatMenuModule`, `MatIconModule`, `MatButtonModule` qoladi. `MatDividerModule` kerak emas.

### 3.5 Verifikatsiya

- Sidebar 264px, active item dark fill + teal rail.
- Topbar: ⌘K search, notification dot, theme toggle.
- Theme toggle ishlaydi, `<html data-theme="dark">` o'rnatiladi, hammasi tunga aylanadi.
- 900px'dan kichik kenglikda sidebar yashirinishi kerak (hamburger qo'shilishi keyin).

### 3.6 Commit

```
git commit -m "feat(ui): rebuild cabinet layout with sidebar + topbar v2 design"
```

---

## 4. BOSQICH — Director Dashboard (1 kun)

### 4.1 SCSS

`design/components/dashboard.component.scss` ni
`src/app/features/cabinet/director/dashboard/dashboard.component.scss`'ga ko'chirish.

Hozirgi `dashboard.component.ts` inline template + inline styles bilan yozilgan.
**Uni `templateUrl` + `styleUrl` ga ajratish kerak.**

### 4.2 HTML — yangi `dashboard.component.html`

`docs/03-COMPONENTS.md` ichida hero card, KPI grid, activity timeline namunasi bor.
Mavjud 6 ta stat (`professionsCount`, `studentsCount`, ...) ni 4 ta KPI grid'ga
joylashtiring (yoki 6 ta KPI saqlang). Tone klasslari:

| KPI | Tone |
|---|---|
| O'quvchilar | `tone-indigo` |
| O'qituvchilar | `tone-plum` |
| Guruhlar | `tone-teal` |
| Yo'nalishlar | `tone-warm` |
| Fanlar | `tone-indigo` (yoki ikkinchi qator) |
| Topshiriqlar | `tone-teal` |

```html
<div class="dashboard">
  <div class="hero">
    <div class="hero-card">
      <div class="greeting">Xush kelibsiz</div>
      <h1>Bugun <em>{{ today | date:'EEEE' }}</em></h1>
      <p class="sub">Tizimda jami {{ totalCount() }} ta yozuv. Boshqaruv panelidan barcha bo'limlarga kirish mumkin.</p>
    </div>
    <div class="snapshot">
      <h3>Holat</h3>
      <!-- ring optional -->
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi tone-indigo">
      <div class="kpi-head">
        <div class="ic"><mat-icon>school</mat-icon></div>
      </div>
      <div class="kpi-num">{{ stats()?.studentsCount ?? 0 }}</div>
      <div class="kpi-label">O'quvchilar</div>
    </div>
    <!-- ... boshqalar -->
  </div>

  <div class="row-2">
    <div class="panel">
      <div class="panel-head">
        <h3>So'nggi faollik</h3>
        <a href="#">Barchasini ko'rish →</a>
      </div>
      <!-- timeline placeholder -->
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Tezkor amallar</h3></div>
      <!-- buttons -->
    </div>
  </div>
</div>
```

### 4.3 TS

```ts
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // mavjud kod saqlansin
  today = new Date();
  totalCount = computed(() => {
    const s = this.stats();
    if (!s) return 0;
    return s.professionsCount + s.studentsCount + s.employeesCount +
           s.groupsCount + s.subjectsCount + s.assignmentsCount;
  });
}
```

### 4.4 Commit

```
git commit -m "feat(ui): redesign director dashboard with hero + KPI grid + activity"
```

---

## 5. BOSQICH — CRUD jadvallar (1 kun)

**Strategiya:** **Reusable `<app-data-table>` komponent yaratish DRY uchun** —
yoki har bir sahifa SCSS'ini `data-table.component.scss`'dan nusxa olib qo'llash.

### 5.1 Variant A — Shared SCSS (oddiyroq)

`design/components/data-table.component.scss` ni
`src/styles/_data-table.scss` ga ko'chirish, har bir sahifa SCSS'idan `@use` qilish.

```bash
cp design/components/data-table.component.scss src/styles/_data-table.scss
```

Har bir CRUD sahifasi (`students`, `employees`, `groups`, `subjects`, `professions`,
`esg`, `news`, teacher's `assignments`/`submissions`, student's `my-grades`) HTML'ini quyidagi shablon bo'yicha yangilash:

```html
<div class="list-page">
  <div class="list-head">
    <div class="title-block">
      <div class="crumb">Kabinet · <span class="active">O'quvchilar</span></div>
      <h1>O'quvchilar <span class="count">{{ items().length }}</span></h1>
      <p>Tizimdagi barcha o'quvchilar ro'yxati</p>
    </div>
    <div class="actions">
      <button mat-raised-button color="primary" (click)="openDialog()">
        <mat-icon>add</mat-icon> Qo'shish
      </button>
    </div>
  </div>

  <div class="toolbar">
    <div class="search">
      <mat-icon>search</mat-icon>
      <input placeholder="Qidirish..." [(ngModel)]="searchQuery">
    </div>
    <!-- filter chips agar kerak bo'lsa -->
  </div>

  <div class="table-card">
    <table class="et-table">
      <thead>
        <tr>
          <th>#</th>
          <th>To'liq ism</th>
          <th>Username</th>
          <th>Guruh</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        @for (e of filteredItems(); track e.id) {
          <tr>
            <td class="cell-id">#{{ e.id }}</td>
            <td>
              <div class="cell-primary">
                <div class="et-avatar" [style.background]="avatarColor(e.fullName)">
                  {{ initials(e.fullName) }}
                </div>
                <div class="name">{{ e.fullName }}</div>
              </div>
            </td>
            <td>{{ e.username }}</td>
            <td>{{ e.groupName }}</td>
            <td>
              <div class="row-actions">
                <button (click)="openDialog(e)" matTooltip="Tahrirlash"><mat-icon>edit</mat-icon></button>
                <button (click)="deleteItem(e.id)" class="danger" matTooltip="O'chirish"><mat-icon>delete</mat-icon></button>
              </div>
            </td>
          </tr>
        }
      </tbody>
    </table>
    @if (items().length === 0) {
      <div class="et-empty">
        <mat-icon>person_off</mat-icon>
        <h3>Ma'lumot topilmadi</h3>
        <p>Qo'shish uchun yuqoridagi tugmadan foydalaning.</p>
      </div>
    }
  </div>
</div>
```

`avatarColor` va `initials` helper'larini `src/app/shared/utils/avatar.util.ts`
faylida yaratib har joyda ishlatish:

```ts
export function avatarColor(name: string): string {
  const palette = ['#4F5DE0','#14B89A','#F58A3D','#8E47C7'];
  let h = 0;
  for (const c of name ?? '') h = (h * 31 + c.charCodeAt(0)) & 0xfff;
  return palette[h % palette.length];
}
export function initials(name: string): string {
  return (name ?? '').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}
```

### 5.2 Variant B — `<app-data-table>` komponent (kelajak uchun yaxshiroq)

DataTable input: `columns: ColumnDef[]`, `items: T[]`, `loading: boolean`,
output: `(create)`, `(edit: T)`, `(delete: id)`. Bu **5+ sahifani 1 komponent qiladi**,
lekin generik tip'lar va template projection bilan ishlash 0.5 kun qo'shadi.

**Tavsiyam:** Variant A'dan boshlang (oddiyroq). Agar keyinchalik DRY juda zarur bo'lsa,
Variant B'ga o'ting.

### 5.3 Commit

```
git commit -m "feat(ui): apply data-table v2 design across CRUD pages"
```

---

## 6. BOSQICH — Student Assignments (1 kun)

### 6.1 SCSS

```bash
cp design/components/student-assignments.component.scss \
   src/app/features/cabinet/student/my-assignments/my-assignments.component.scss
```

### 6.2 HTML

Hozirgi inline template `mat-table` bilan yozilgan. Uni assignment-card grid'ga
aylantirish kerak:

```html
<div class="assignments">
  <div class="summary-row">
    <div class="pill due-soon">
      <div class="ic"><mat-icon>schedule</mat-icon></div>
      <div class="meta">
        <div class="num">{{ dueSoonCount() }}</div>
        <div class="lbl">Tez orada</div>
      </div>
    </div>
    <div class="pill in-prog">
      <div class="ic"><mat-icon>play_circle</mat-icon></div>
      <div class="meta">
        <div class="num">{{ inProgressCount() }}</div>
        <div class="lbl">Jarayonda</div>
      </div>
    </div>
    <div class="pill done">
      <div class="ic"><mat-icon>check_circle</mat-icon></div>
      <div class="meta">
        <div class="num">{{ doneCount() }}</div>
        <div class="lbl">Bajarilgan</div>
      </div>
    </div>
  </div>

  @for (e of items(); track e.id) {
    <div class="assignment-card">
      <div class="left">
        <div class="top-row">
          <span class="subject-tag" [class]="subjectTone(e.subjectName)">{{ e.subjectName }}</span>
          @if (isSubmitted(e.id)) {
            <span class="status submitted">Topshirilgan</span>
          } @else if (isOverdue(e.dueDate)) {
            <span class="status late">Muddat o'tdi</span>
          } @else {
            <span class="status pending">Topshirilmagan</span>
          }
        </div>
        <h3>{{ e.title }}</h3>
        <p class="desc">{{ e.description }}</p>
        <div class="meta-row">
          <span class="meta"><mat-icon>person</mat-icon> {{ e.employeeName }}</span>
          <span class="meta"><mat-icon>folder</mat-icon> {{ e.groupName }}</span>
        </div>
      </div>
      <div class="right">
        <div class="due">
          <div class="lbl">Muddat</div>
          <div class="date">{{ e.dueDate | date:'dd.MM.yyyy' }}</div>
          <div class="left-time">{{ timeLeft(e.dueDate) }}</div>
        </div>
        <div class="actions">
          @if (e.filePath) {
            <a mat-button [href]="getFileUrl(e.filePath)" target="_blank">
              <mat-icon>download</mat-icon>
            </a>
          }
          @if (!isSubmitted(e.id)) {
            <button mat-raised-button class="primary" (click)="openSubmitDialog(e)">
              <mat-icon>upload_file</mat-icon> Topshirish
            </button>
          }
        </div>
      </div>
    </div>
  }
</div>
```

### 6.3 TS — yordamchi metodlar

```ts
private SUBJECT_TONE: Record<string, string> = {
  'Matematika': 'math',
  "O'zbek tili": 'lang',
  'Fizika': 'science',
  'Tarix': 'history',
};

subjectTone(name: string): string {
  return this.SUBJECT_TONE[name] ?? 'math';
}

isOverdue(dueDate: string): boolean {
  return new Date(dueDate).getTime() < Date.now();
}

timeLeft(dueDate: string): string {
  const ms = new Date(dueDate).getTime() - Date.now();
  if (ms < 0) return "Muddat o'tdi";
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  if (days > 0) return `${days} kun ${hours} soat`;
  return `${hours} soat`;
}

dueSoonCount = computed(() => this.items().filter(a =>
  !this.isSubmitted(a.id) && !this.isOverdue(a.dueDate)
).length);
```

### 6.4 Commit

```
git commit -m "feat(ui): redesign student assignments as card grid"
```

---

## 7. BOSQICH — Dialog'lar (0.5 kun)

`mat-dialog`'ni saqlang. Faqat ichidagi forma'ni unifikatsiya qiling:

`src/styles.scss`'ga qo'shing (yoki `_theme.scss`'da):

```scss
.mat-mdc-dialog-content {
  display: flex; flex-direction: column; gap: 14px;
  padding: 20px 24px !important;
}
.mat-mdc-dialog-actions {
  padding: 14px 24px !important;
  gap: 8px;
  border-top: 1px solid var(--et-line);
  background: var(--et-surface-2);
}
.mat-mdc-dialog-title {
  font-family: var(--et-font-display) !important;
  font-weight: 500 !important;
  letter-spacing: -0.02em !important;
}
```

Dialog komponentlari (`student-dialog`, `assignment-dialog`, `submission-dialog`,
`grade-dialog`) — tegmaslik mumkin, global override avtomatik qo'llaniladi.

### Commit
```
git commit -m "feat(ui): unify dialog styling via global overrides"
```

---

## 8. BOSQICH — Dark mode + responsive (0.5 kun)

### 8.1 Tema toggle tekshiruvi
3-bosqichdagi `toggleTheme()` ishlashini barcha sahifalarda tekshirish.

### 8.2 Hardcoded ranglar tozalash
`grep -r "#[0-9a-fA-F]\{6\}" src/app` natijasini ko'rib, qolgan hex ranglarni
`var(--et-...)` ga almashtirish.

### 8.3 Responsive

| Kenglik | Maket |
|---|---|
| ≥1280px | sidebar 264px + 2 ustun dashboard |
| 1024-1280px | KPI grid 2 ustun |
| 600-1024px | sidebar yopiq, hamburger button kerak (qo'shish) |
| <600px | bitta ustun, summary-row stack |

Hamburger uchun topbar'ga qo'shish:
```html
<button class="icon-btn mobile-only" (click)="mobileOpen.set(true)">
  <mat-icon>menu</mat-icon>
</button>
```
SCSS:
```scss
.mobile-only { display: none; }
@media (max-width: 900px) { .mobile-only { display: grid; } }
```

### 8.4 Commit
```
git commit -m "feat(ui): finalize dark mode and responsive breakpoints"
```

---

## 9. Yakuniy verifikatsiya (Acceptance criteria)

`design/docs/05-CHECKLIST.md` ga rioya qiling:

### Vizual
- [ ] Login: chap brand panel ko'rinadi (≥960px), <960px'da forma to'la kenglikni egallaydi
- [ ] Sidebar active item: ink fon + teal rail + oq matn
- [ ] Topbar: search input fokus indigo border, ⌘K kbd ko'rinadi
- [ ] Hero card: dark indigo gradient + teal radial glow
- [ ] KPI kartalari: hover transform 2px yuqoriga, shadow-2
- [ ] Jadvallar: hover row surface-2 ranggi
- [ ] Buttons: primary `var(--et-ink)` fonli, accent indigo
- [ ] Form fields: outlined, 14px radius, fokus indigo

### Dark mode
- [ ] Toggle ishlaydi (topbar icon)
- [ ] LocalStorage'da saqlanadi (`et-theme` key)
- [ ] Sahifa qaytadan yuklanganda saqlanadi
- [ ] Login + Cabinet + Dashboard + Tables — to'rttasida ishlaydi

### Responsive
- [ ] ≥1280px — to'liq layout
- [ ] 1024-1280px — KPI grid 2 ustun
- [ ] 600-1024px — sidebar yopiladi (hamburger menu)
- [ ] <600px — bitta ustun, summary-row stack

### Funksional (regression check)
- [ ] Login ishlaydi (yangi va eski user'lar uchun)
- [ ] Role-based redirect ishlaydi (Director / Teacher / Student)
- [ ] CRUD: create / edit / delete dialoglari ochiladi
- [ ] HTTP interceptor token qo'shadi
- [ ] 401 → logout + redirect (lekin login endpoint'da emas)
- [ ] Student topshiriq topshira oladi (StudentId JWT'dan)
- [ ] Teacher submission'larni baholay oladi (EmployeeId JWT'dan)

### Build
- [ ] `npx ng build --configuration production` xatosiz
- [ ] `dotnet build` (backend) xatosiz
- [ ] Bundle size: main.js < 500kb gzipped
- [ ] Lighthouse a11y skor ≥ 95

### Deploy oldidan
- [ ] `environment.ts` da production URL HTTPS bo'lishi (hozir HTTP — backend deploy paytida tuzatish)
- [ ] Google Fonts production'da yuklanadi (CORS OK)

---

## 10. Yo'l-yo'lakay duch keladigan muammolar

### "M3 themedan keyin Material rangi ko'k qolib ketdi"
`angular.json` va `styles.scss`'da `azure-blue.css` import'i qolgan bo'lsa kerak.
Olib tashlang.

### "mat-form-field hali ham eski ko'rinishda"
Komponent SCSS'idan `::ng-deep` selector'larni olib tashlang. Yangi M3 CSS
o'zgaruvchilar global'da o'rnatilgan.

### "Dark mode ba'zi joylarda ishlamayapti"
`grep -r "#[0-9a-fA-F]" src/app/features` orqali hardcoded `#fff`/`#000`
izlang va CSS o'zgaruvchilarga almashtiring.

### "Sidebar mobil'da chiqib ketmaydi"
`cabinet-layout.component.ts`'da `mobileOpen()` signal va hamburger button
qo'shilganmi tekshiring (8.3).

### "Fontlar yuklanmayapti"
`index.html`'da Google Fonts link tegi bor-yo'qligini tekshiring + DevTools
Network tab'ida 200 OK qaytayotganligini.

### "SCSS @use path topilmaydi"
`angular.json` da `architect.build.options.stylePreprocessorOptions.includePaths`
ga `["src", "src/styles"]` qo'shing — keyin `@use 'tokens'` qila olasiz.

---

## 11. Bajarilmaydigan / kelajakka qoldiriladigan ishlar

- **Notification dot real ma'lumotlarga ulash** — hozir static (8 bosqichdan keyin alohida feature)
- **⌘K search funksional qilish** — visual placeholder (alohida feature)
- **`et-mono` font'i jadvallardagi ID/raqamlarda ishlatilishi** — bo'sh joy bo'lsa
- **PrimeNG migratsiya** — `04-MATERIAL-THEME.md` da yozilgan: kerak emas, Material'da qoling
- **AutoMapper / generic data-table komponenti** — DRY refactor, keyin
- **Bundle optimizatsiya** — Quill 423KB lazy chunk faqat news editor'da; deferred load qilish

---

## 12. Reja qisqacha (TL;DR)

| Bosqich | Vaqt | Asosiy o'zgarish |
|---|---|---|
| **0** | 15 daq | Branch yaratish (`feat/ui-redesign-v2`) |
| **1** | 1 kun | Tokens + Theme + Global stillar — fundamental qatlam |
| **2** | 1 kun | Login redesign (brand panel + form) |
| **3** | 2 kun | Cabinet layout (CSS Grid sidebar + topbar) |
| **4** | 1 kun | Director Dashboard (hero + KPI + timeline) |
| **5** | 1 kun | CRUD jadvallar (data-table style barchasiga) |
| **6** | 1 kun | Student my-assignments (card grid) |
| **7** | 0.5 kun | Dialog'lar global override |
| **8** | 0.5 kun | Dark mode + responsive + hamburger |
| **9** | 0.5 kun | Final QA + checklist |
| **Jami** | **~8.5 kun** | |

**Boshlash:**
```bash
cd frontend
git checkout -b feat/ui-redesign-v2
git status   # toza ishchi katalog
# 1-bosqichdan boshlang
```

**Har bosqichdan keyin:**
- `npx ng build --configuration development` — build muvaffaqiyatli o'tishi shart
- `npm start` — dev server'da vizual tekshiruv
- Commit qiling, keyingi bosqichga o'ting

**Yakuniy:**
```bash
git push --set-upstream origin feat/ui-redesign-v2
gh pr create --title "feat(ui): v2 redesign migration" --body "..."
```
