# Migration Guide — EduTrack Frontend v2

> Mavjud Angular 21 loyihasiga vizual tizimni xavfsiz ko'chirish bo'yicha qadam-baqadam yo'riqnoma.

---

## 0. Tayyorgarlik (15 daqiqa)

```bash
cd EduTrack/ClientApp
git checkout -b feat/ui-redesign-v2
git status   # ishchi katalog toza bo'lsin
```

Backup: hozirgi `src/styles.scss` va har bir komponent `.scss` faylini saqlab qo'ying:
```bash
mkdir _backup-v1
cp src/styles.scss _backup-v1/
cp -r src/app/features _backup-v1/
```

---

## 1-bosqich: Tokens + Theme + Global stillar (1 kun)

### 1.1 Style fayllarni nusxalash

```bash
mkdir -p src/styles
cp <handoff>/styles/_tokens.scss     src/styles/
cp <handoff>/styles/_theme.scss      src/styles/
cp <handoff>/styles/_typography.scss src/styles/
cp <handoff>/styles/_utilities.scss  src/styles/
cp <handoff>/styles/styles.scss      src/styles.scss   # ⚠️ root styles.scss'ni almashtiring
```

### 1.2 Eski Material temani olib tashlash

`src/styles.scss` (yoki `src/styles/styles.scss`) ichida bo'lsa:

```scss
// ❌ OLIB TASHLANG:
@import '@angular/material/prebuilt-themes/azure-blue.css';
```

Bizning `_theme.scss` o'zining M3 temasini chiqaradi.

### 1.3 Google Fonts — `src/index.html`

`<head>` ichiga:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,500;0,600;1,500&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
```

### 1.4 `angular.json` tekshiruvi

```json
"styles": [
  "src/styles.scss"   // bitta entrypoint kifoya
]
```

### 1.5 Sanity check

```bash
npm start
```

Login sahifasiga kiring — fon `#F6F5F1` cream rangda bo'lishi kerak. Material'ning ko'k ranglari endi indigo'ga o'zgargan bo'lishi kerak. Hech qanday TS xato chiqmasligi kerak.

---

## 2-bosqich: Login (1 kun)

### 2.1 SCSS almashtirish
```bash
cp <handoff>/components/login.component.scss \
   src/app/features/auth/login/login.component.scss
```

### 2.2 HTML — `login.component.html` ni quyidagicha qayta yozing:

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
          <input matInput formControlName="username" autocomplete="username" [disabled]="loading()">
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
                 autocomplete="current-password"
                 [disabled]="loading()">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button"
                  (click)="togglePasswordVisibility()" [disabled]="loading()">
            <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
            <mat-error>Parol talab qilinadi</mat-error>
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

### 2.3 TS — daxlsiz! Hech narsa o'zgarmaydi.

---

## 3-bosqich: Cabinet layout (2 kun)

### 3.1 SCSS almashtirish

```bash
cp <handoff>/components/cabinet-layout.component.scss \
   src/app/features/cabinet/layout/cabinet-layout.component.scss
```

### 3.2 HTML — `cabinet-layout.component.html`

`mat-sidenav` o'rniga oddiy CSS Grid ishlatamiz (yengilroq, custom-control'a oson):

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
    @for (item of navItems(); track item.path) {
      <a [routerLink]="item.path"
         routerLinkActive="active"
         class="nav-item">
        <mat-icon>{{ item.icon }}</mat-icon>
        <span>{{ item.label }}</span>
        @if (item.badge) { <span class="badge">{{ item.badge }}</span> }
      </a>
    }

    <div class="sidebar-footer">
      <div class="me-card" [matMenuTriggerFor]="userMenu">
        <div class="et-avatar" [style.background]="userColor()">{{ userInitials() }}</div>
        <div class="who">
          <div class="name">{{ user()?.username }}</div>
          <div class="role">{{ roleLabel() }}</div>
        </div>
        <mat-icon style="color:var(--et-ink-4);font-size:18px;">expand_more</mat-icon>
      </div>
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item><mat-icon>person</mat-icon>Profil</button>
        <button mat-menu-item><mat-icon>settings</mat-icon>Sozlamalar</button>
        <button mat-menu-item (click)="logout()"><mat-icon>logout</mat-icon>Chiqish</button>
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
```

### 3.3 TS — `cabinet-layout.component.ts`'ga qo'shilishi kerak:

```ts
collapsed = signal(false);
mobileOpen = signal(false);
darkMode = signal(localStorage.getItem('et-theme') === 'dark');

navItems = computed(() => {
  const role = this.authService.userRole();
  // Direktor / Teacher / Student uchun har xil ro'yxat — sizdagi mavjud logikani saqlang.
  return this.getNavForRole(role);
});

userInitials = computed(() => {
  const u = this.authService.currentUser();
  return u?.username?.slice(0, 2).toUpperCase() ?? '??';
});

userColor = computed(() => {
  // FIO'ga qarab deterministik rang
  const palette = ['#4F5DE0', '#14B89A', '#F58A3D', '#8E47C7'];
  const u = this.authService.currentUser()?.username ?? '';
  let hash = 0;
  for (const c of u) hash = (hash * 31 + c.charCodeAt(0)) & 0xfff;
  return palette[hash % palette.length];
});

roleLabel = computed(() => ({
  Admin: 'Administrator',
  Director: 'Direktor',
  Teacher: 'O\'qituvchi',
  Student: 'O\'quvchi'
}[this.authService.userRole() ?? 'Student']));

toggleTheme() {
  this.darkMode.update(v => !v);
  document.documentElement.setAttribute(
    'data-theme', this.darkMode() ? 'dark' : 'light'
  );
  localStorage.setItem('et-theme', this.darkMode() ? 'dark' : 'light');
}
```

⚠️ **Eski `mat-sidenav` o'chirilsa, `MatSidenavModule` import'ini ham olib tashlang.**

---

## 4-bosqich: Director Dashboard (1 kun)

### 4.1 SCSS
```bash
cp <handoff>/components/dashboard.component.scss \
   src/app/features/cabinet/director/dashboard/dashboard.component.scss
```

### 4.2 HTML — `dashboard.component.html`

`docs/03-COMPONENTS.md` ichida to'liq HTML namunasi bor — direktorlik dashboardini KPI grid + activity timeline ko'rinishida qayta yozasiz.

---

## 5-bosqich: CRUD jadvallar (1 kun)

Groups, Students, Teachers, Subjects — to'rttasi ham bir xil chrome'dan foydalanadi.

```bash
cp <handoff>/components/data-table.component.scss \
   src/app/features/cabinet/director/groups/groups.component.scss
cp <handoff>/components/data-table.component.scss \
   src/app/features/cabinet/director/students/students.component.scss
# ... va boshqalar
```

> 💡 **Tip:** bu SCSS'ni `src/styles/_data-table.scss` ga ko'chirib, har bir komponentdan `@use` qilish ham mumkin — DRY.

`mat-table` o'rniga oddiy `<table class="et-table">` ishlatamiz — ko'rinishi tozaroq, custom-styling osonroq. Eski `mat-table` ham ishlaydi (theme overrides _theme.scss'da).

---

## 6-bosqich: Student paneli (1 kun)

```bash
cp <handoff>/components/student-assignments.component.scss \
   src/app/features/cabinet/student/my-assignments/my-assignments.component.scss
```

`my-grades`, `my-attendance` uchun esa `data-table.component.scss`'dagi pattern'ni qaytaring.

---

## 7-bosqich: Dialog'lar (0.5 kun)

`group-dialog`, `student-dialog`, ... — Material'ning `mat-dialog`'ini saqlaymiz, faqat ichidagi forma stilini yangilaymiz:

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
```

---

## 8-bosqich: Dark mode + responsive (0.5 kun)

1. `cabinet-layout.toggleTheme()` ishlashini tekshiring.
2. Mobil (≤600px) — sidebar yopilishi, hero card bir ustunga tushishi kerak.
3. Tablet (600-1024px) — KPI grid 2 ustun, jadvallar horizontal scroll.

---

## ✅ Acceptance criteria

- [ ] Login: branded left panel + clean form
- [ ] Sidebar: indigo→ink active state, accent rail, user card pastda
- [ ] Topbar: ⌘K search, notification dot, theme toggle
- [ ] Dashboard: hero card + 4 KPI tone'lari + timeline
- [ ] Tables: sticky header, hover row, row-actions
- [ ] Student assignments: subject tags, due date countdown
- [ ] Dark mode: barcha sahifalarda ishlaydi
- [ ] Lighthouse a11y ≥ 95
- [ ] No console errors

To'liq tekshiruv ro'yxati → `05-CHECKLIST.md`
