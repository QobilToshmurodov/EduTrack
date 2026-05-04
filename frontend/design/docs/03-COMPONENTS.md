# Components Guide

Har bir asosiy ekran uchun **DO / DON'T** va kichik kod namunalari.

---

## Login

### ✅ DO
- Chap panel — brand identity (logo + tagline + 3 stat raqami)
- O'ng panel — toza forma, 420px max-width
- Display shrift sarlavhada (Fraunces)
- "Eyebrow" label tepada (`Kabinet · Kirish`)

### ❌ DON'T
- Markazda yolg'iz card — "yana bir Material login"
- Background gradient yashil/ko'k aralashma — eski v1 muammo

---

## Cabinet Layout (Sidebar + Topbar)

### Sidebar
- 264px keng (collapsed: 76px, faqat icon)
- Active item: **dark fill** (`var(--et-ink)`) + chap rail (teal)
- "Asosiy" / "Boshqaruv" kabi section header'lar 10px uppercase
- Pastda user card (avatar + ism + role) — bosilsa menu

### Topbar
- 64px balandlik
- Chap: `⌘K` search (oddiy ko'rinishda emas — kbd hint bilan)
- O'ng: notification (warm dot), help, theme toggle
- Backdrop blur — content scroll qilganda yoqimli

### Role-based nav

```ts
const NAV_BY_ROLE = {
  Director: [
    { path: 'dashboard',  icon: 'dashboard',     label: 'Boshqaruv paneli' },
    { path: 'students',   icon: 'school',        label: 'O\'quvchilar', badge: '1.2k' },
    { path: 'teachers',   icon: 'person',        label: 'O\'qituvchilar' },
    { path: 'groups',     icon: 'groups',        label: 'Guruhlar' },
    { path: 'subjects',   icon: 'menu_book',     label: 'Fanlar' },
    { path: 'statistics', icon: 'insights',      label: 'Statistika' },
  ],
  Teacher: [
    { path: 'assignments', icon: 'assignment',   label: 'Topshiriqlar', badge: '3' },
    { path: 'attendance',  icon: 'fact_check',   label: 'Davomat' },
    { path: 'grades',      icon: 'grade',        label: 'Baholar' },
  ],
  Student: [
    { path: 'my-assignments', icon: 'assignment', label: 'Topshiriqlar' },
    { path: 'my-grades',      icon: 'grade',      label: 'Baholar' },
    { path: 'my-attendance',  icon: 'event',      label: 'Davomat' },
  ],
};
```

---

## Director Dashboard

### Tuzilma (yuqoridan pastga)

1. **Hero card** (2/3 width) + **Snapshot ring** (1/3 width)
2. **KPI grid** — 4 ta KPI karta, har biri o'z `tone-*` klassi
3. **2-column row** — chapda activity timeline (2/3), o'ngda quick actions (1/3)

### KPI tonalari

| KPI            | Tone klass    | Sabab                              |
| -------------- | ------------- | ---------------------------------- |
| O'quvchilar    | `tone-indigo` | Brand — eng asosiy resurs          |
| O'qituvchilar  | `tone-plum`   | Akademik aksent                    |
| Guruhlar       | `tone-teal`   | "tirik" / harakatdagi              |
| Fanlar         | `tone-warm`   | Issiq, kataloglovchi               |

### Activity timeline namunasi

```html
<div class="panel">
  <div class="panel-head">
    <h3>So'nggi faollik</h3>
    <a href="#">Barchasini ko'rish →</a>
  </div>
  <div class="timeline">
    <div class="item">
      <div class="ic"><mat-icon>person_add</mat-icon></div>
      <div class="content">
        <div class="title">Yangi o'quvchi qo'shildi: <strong>Aliyev Doston</strong></div>
        <div class="meta">IT-21 guruhi · Direktor tomonidan</div>
      </div>
      <div class="time">12 daq oldin</div>
    </div>
    <!-- ... -->
  </div>
</div>
```

---

## CRUD jadvallar (Students / Teachers / Groups / Subjects)

### Tuzilma

1. **list-head** — breadcrumb + page title (count chip bilan) + birlamchi action button
2. **toolbar** — search + filter chiplar
3. **table-card** — sticky header, hover row, row actions
4. **pager** — paginatsiya

### Chip pattern

Status chip'lar uchun `et-chip` utility klassdan foydalaning:

```html
<span class="et-chip et-chip-success">Faol</span>
<span class="et-chip et-chip-warning">Kutmoqda</span>
<span class="et-chip et-chip-danger">Bloklangan</span>
```

### Avatar pattern

Ism o'rniga **deterministik rang** generatsiya qilish:

```ts
avatarColor(name: string): string {
  const palette = ['#4F5DE0','#14B89A','#F58A3D','#8E47C7'];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xfff;
  return palette[h % palette.length];
}

initials(name: string): string {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}
```

---

## Student — My Assignments

### Tuzilma

1. **summary-row** — 3 ta pill: "Tez orada" / "Jarayonda" / "Bajarilgan"
2. **assignment-card** — har bir topshiriq uchun karta (subject tag + title + meta + due + status + actions)

### Subject tag rang xaritasi

```ts
const SUBJECT_TONE: Record<string, string> = {
  'Matematika':   'math',     // indigo
  'O\'zbek tili': 'lang',     // plum
  'Fizika':       'science',  // teal
  'Tarix':        'history',  // warm
  // default: 'neutral'
};
```

### Due date hisoblagich

```ts
timeLeft(deadline: Date): string {
  const ms = deadline.getTime() - Date.now();
  if (ms < 0) return 'Muddat o\'tdi';
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  if (days > 0) return `${days} kun ${hours} soat`;
  return `${hours} soat`;
}
```

---

## Dialoglar (Group / Student / Teacher / Subject)

`mat-dialog`'ni saqlang, lekin ichida:

- Sarlavha **Fraunces** display shrift
- Forma fieldlar 14px gap bilan
- Pastda `mat-dialog-actions` — chapda "Bekor qilish" (ghost), o'ngda "Saqlash" (primary)
- Surface-2 fonli action bar yuqori chiziq bilan

```html
<h2 mat-dialog-title style="font-family:var(--et-font-display);font-weight:500;
                            letter-spacing:-0.02em;">
  Yangi guruh qo'shish
</h2>

<mat-dialog-content>
  <mat-form-field appearance="outline" class="full-width">
    <mat-label>Guruh nomi</mat-label>
    <input matInput formControlName="name">
  </mat-form-field>
  <!-- ... -->
</mat-dialog-content>

<mat-dialog-actions>
  <button mat-button mat-dialog-close>Bekor qilish</button>
  <button mat-raised-button color="primary" [disabled]="form.invalid"
          (click)="save()">Saqlash</button>
</mat-dialog-actions>
```
