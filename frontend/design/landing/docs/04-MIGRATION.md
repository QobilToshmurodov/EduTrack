# 04 — Migratsiya: qadam-baqadam

> Vaqt: ~3-4 soat. Aniq tartibda yuriladi.

## Bosqich 1 — Tokenlar va shriftlar (30 daq)

### 1.1 Shriftlarni `index.html` ga ulang
```html
<!-- frontend/src/index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,500;1,500&display=swap" rel="stylesheet"/>
```

### 1.2 Token va base SCSS'ni qo'shing
```bash
# Bu paketdan ko'chiring:
mkdir -p frontend/src/styles
cp handoff-landing/styles/_landing-tokens.scss frontend/src/styles/
cp handoff-landing/styles/_landing-base.scss frontend/src/styles/
```

### 1.3 Global `styles.scss` ga import
```scss
// frontend/src/styles.scss (mavjud import'lardan keyin)

@use 'styles/landing-tokens' as *;
@use 'styles/landing-base' as *;
```

### 1.4 (Ixtiyoriy) Tailwind config'ni yangilang
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      colors: {
        'lp-ink': '#0E1B3D',
        'lp-bg': '#F6F5F1',
        // ...
      },
    },
  },
};
```

**Tekshiruv:** loyihani ishga tushuring → home sahifasi ochilganda fon pergament cream ko'rinadi, matn navy ko'rinadi.

---

## Bosqich 2 — Landing layout o'rab oling (10 daq)

`landing-layout.component.html` da root element'ga class qo'shing:

```html
<!-- frontend/src/app/features/landing/landing-layout/landing-layout.component.html -->
<div class="landing-layout">
  <app-landing-header></app-landing-header>
  <main>
    <router-outlet></router-outlet>
  </main>
  <app-landing-footer></app-landing-footer>
</div>
```

`_landing-base.scss` faqat `.landing-layout` ichida ishlaydi — cabinet stillariga ta'sir qilmaydi.

**Tekshiruv:** cabinet sahifasi avvalgidek qoladi.

---

## Bosqich 3 — Home component (60 daq)

### 3.1 SCSS'ni almashtirib qo'ying
```bash
cp handoff-landing/components/home.component.scss \
   frontend/src/app/features/landing/home/home.component.scss
```

### 3.2 HTML'ni almashtirib qo'ying
```bash
cp handoff-landing/components/home.component.html \
   frontend/src/app/features/landing/home/home.component.html
```

> **Eslatma:** HTML'da `stats`, `aboutFeatures`, `infrastructure`, `institutions`, `latestNews()` kabi component property'lari ishlatilgan. `home.component.ts` o'zgarmaydi — tegmang.

### 3.3 Tekshiring
- Hero — pergament fon, navy matn, sariq italic "Pedagogika"
- "Tizimga kirish" tugmasi — qora-navy
- Floating badge'lar — biri oq (2005), ikkinchisi sariq (222+)
- About bo'limi — oq fon, ikon ramkalari amber
- Infrastructure — kartalar pergament fon, hover'da yuqoriga ko'tariladi
- Directions — hover'da chap chiziqcha amber paydo bo'ladi
- News — kart hoverda rasm zoom, sarlavha amber'ga o'zgaradi
- CTA — qora gradient fon, sariq tugma

---

## Bosqich 4 — Header (20 daq)

```bash
cp handoff-landing/components/landing-header.component.scss \
   frontend/src/app/features/landing/landing-header/landing-header.component.scss
```

`landing-header.component.html` ham yangilanishi kerak — class'larni `lp-*` ga o'zgartiring:

```html
<header class="lp-header">
  <div class="lp-header-inner">
    <a routerLink="/home" class="lp-logo">
      <div class="ring"><img src="img/logo.png" alt=""/></div>
      <div class="text">
        <div class="name">Bo'ka Pedagogika</div>
        <div class="sub">Texnikumi</div>
      </div>
    </a>

    <nav class="lp-nav">
      <a routerLink="/home" class="lp-nav-link">
        <mat-icon>home</mat-icon> Bosh sahifa
      </a>
      <!-- qolganlari shu pattern bilan -->
    </nav>

    <div class="lp-actions">
      <a href="tel:+998939253433" class="lp-phone">
        <mat-icon>phone</mat-icon> +998 93 925-34-33
      </a>
      @if (authService.isAuthenticated()) {
        <button class="lp-user-pill" (click)="authService.navigateToDefaultRoute()">
          <span class="avatar">{{ authService.currentUser()?.username?.charAt(0) }}</span>
          <span class="uname">{{ authService.currentUser()?.username }}</span>
        </button>
        <button class="lp-logout-btn" (click)="logout()">
          <mat-icon>logout</mat-icon> Chiqish
        </button>
      } @else {
        <a routerLink="/auth/login" class="lp-login-btn">
          <mat-icon>login</mat-icon> Kirish
        </a>
      }
      <button class="lp-mobile-toggle" (click)="toggleMenu()">
        <mat-icon>{{ menuOpen() ? 'close' : 'menu' }}</mat-icon>
      </button>
    </div>
  </div>

  @if (menuOpen()) {
    <div class="lp-mobile-menu">
      <!-- mobile linklar -->
    </div>
  }
</header>
```

---

## Bosqich 5 — Footer (15 daq)

```bash
cp handoff-landing/components/landing-footer.component.scss \
   frontend/src/app/features/landing/landing-footer/landing-footer.component.scss
```

`landing-footer.component.html` da class'larni yangilang:

```html
<footer class="lp-footer">
  <div class="lp-footer-inner">
    <div class="lp-footer-grid">
      <div class="lp-brand-block">
        <div class="lp-brand-row">
          <div class="ring"><img src="img/logo.png" alt=""/></div>
          <div>
            <div class="brand-name">Bo'ka Pedagogika</div>
            <div class="brand-sub">Texnikumi</div>
          </div>
        </div>
        <p>2005-yildan buyon kelajak avlod ustozlarini tayyorlab kelmoqda...</p>
      </div>

      <div>
        <h3 class="lp-col-title">Havolalar</h3>
        <ul class="lp-link-list">
          <li><a routerLink="/home"><mat-icon>home</mat-icon> Bosh sahifa</a></li>
          <!-- ... -->
        </ul>
      </div>

      <div>
        <h3 class="lp-col-title">Aloqa</h3>
        <ul class="lp-contact-list">
          <li>
            <span class="ico-circle"><mat-icon>location_on</mat-icon></span>
            <span>Toshkent viloyati, Bo'ka tumani...</span>
          </li>
          <!-- ... -->
        </ul>
      </div>
    </div>

    <div class="lp-copy-row">
      <span>© {{ currentYear }} Bo'ka Pedagogika Texnikumi. Barcha huquqlar himoyalangan.</span>
      <span>Toshkent viloyati, O'zbekiston Respublikasi</span>
    </div>
  </div>
</footer>
```

---

## Bosqich 6 — News detail (15 daq)

```bash
cp handoff-landing/components/news-detail.component.scss \
   frontend/src/app/features/landing/news-detail/news-detail.component.scss
```

`news-detail.component.html` da root'ga `lp-news-detail` class qo'shing va body matn'ni `lp-news-body` bilan o'rang.

---

## Bosqich 7 — Polish (30 daq)

- [ ] Mobile responsive tekshirish
- [ ] Dark mode (ixtiyoriy)
- [ ] News empty state — yaxshi rasmga
- [ ] Hero rasmga `loading="eager"`, qolganlariga `loading="lazy"`
- [ ] Iconlarni Material'dan boshqasiga (Lucide) o'zgartirish (ixtiyoriy)

---

## Eski faylni saqlab qoling

```bash
# Avval backup oling
cp -r frontend/src/app/features/landing frontend/src/app/features/landing.bak
```

Migratsiya tugagandan keyin `landing.bak`'ni o'chiring.
