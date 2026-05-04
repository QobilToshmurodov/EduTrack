# Material vs PrimeNG — Tahlil va tavsiya

## TL;DR

**Material'da qoling.** PrimeNG'ga o'tish 2-3 hafta vaqt oladi va dizayn farqi sezilarli emas.

---

## Ko'rib chiqilgan variantlar

### Variant A: Material 21 + Custom theme (TAVSIYA)

**Plyuslar:**
- Loyiha allaqachon shu stack'da (Angular 21, Standalone, Signals)
- M3 (`mat.define-theme`) bizning palitra'ni to'liq qabul qiladi
- Hech qanday yangi paket kerak emas
- Migratsiya: ~8 ish kuni

**Minuslar:**
- Material'ning ba'zi komponentlari "ko'p stylelangan" (mat-form-field outline)
- Advanced jadvallar uchun ekstra ish (mat-table → custom `<table>` switching)

**Yechim:** custom token + utility class tizimimiz Material komponentlarini "qoplaydi". Bu paketdagi `_theme.scss` shu vazifani bajaradi.

---

### Variant B: PrimeNG to'liq migratsiya

**Plyuslar:**
- Boy komponentlar bazasi (TreeTable, OrgChart, FullCalendar...)
- Themer.dev orqali tema tanlash
- Tailwind bilan yaxshi ishlaydi (loyihada Tailwind ham bor)

**Minuslar:**
- ❌ **60+ komponent qayta yozish** — 2-3 hafta
- ❌ Material Snackbar / Dialog / Sidenav bilan API farqlari
- ❌ Loyiha hozirda Material 21'ning yangi xususiyatlaridan foydalanmoqda — yo'qotamiz
- ❌ Fan / Form / Dialog ichida ham qayta yozish
- Bundle size: PrimeNG ≈ 280kb gz, Material ≈ 220kb gz

**Yechim:** kerak emas. Hozirgi UI muammosi — bu **stylelash**, kutubxona emas.

---

### Variant C: Hybrid (Material core + PrimeNG kerak bo'lgan joylarda)

PrimeNG'ni faqat quyidagilar uchun qo'shing:

| Komponent              | Material'da bormi? | PrimeNG'da nima uchun yaxshiroq?      |
| ---------------------- | ------------------ | ------------------------------------- |
| `<p-treeTable>`        | ❌ (mat-tree zaif) | Pagination + filter + sort birgalikda |
| `<p-organizationChart>`| ❌ Yo'q           | Tashkilot tuzilmasini ko'rsatish       |
| `<p-galleria>`         | ❌ Yo'q           | Document/photo gallery                 |
| `<p-fullCalendar>`     | mat-calendar bor  | Davomat uchun haftalik / oylik view   |

**Tavsiya:** agar kelajakda yuqoridagi feature'lar kerak bo'lsa, **shularni** PrimeNG'dan keltiring. To'liq migratsiya — yo'q.

---

## Material 3 tema sozlash (Variant A — bizning yo'l)

### Asosiy idea

`mat.define-theme()` M3 sxemasini yaratadi va `mat.all-component-themes($theme)` uni barcha komponentlarga qo'llaydi.

Bizning `_theme.scss`:

```scss
$et-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: $et-primary-palette,    // bizning Indigo 50-900
    tertiary: $et-accent-palette,    // bizning Teal
  ),
  typography: (
    plain-family: "Plus Jakarta Sans, ...",
    brand-family: "Fraunces, ...",
  ),
));

html { @include mat.all-component-themes($et-theme); }
```

### Component-level overrides

M3 har bir komponentga CSS o'zgaruvchilar ochadi. Ulardan to'g'ridan-to'g'ri foydalanamiz:

```scss
.mat-mdc-card {
  --mdc-elevated-card-container-color: var(--et-surface);
  --mdc-elevated-card-container-shape: var(--et-r-lg);
}

.mat-mdc-form-field {
  --mdc-outlined-text-field-container-shape: var(--et-r-md);
  --mdc-outlined-text-field-focus-outline-color: var(--et-primary-500);
}
```

Bu **`::ng-deep` siz** ishlaydi — chunki M3 CSS o'zgaruvchilar component encapsulation chegarasini kesib o'tadi.

### Dark mode

```scss
[data-theme="dark"] {
  @include mat.all-component-colors($et-theme-dark);
}
```

CSS o'zgaruvchilar `<html data-theme="dark">` qo'yilganda avtomatik almashadi. Reload kerak emas.
