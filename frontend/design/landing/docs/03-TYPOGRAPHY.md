# 03 — Tipografiya

## Shriftlar

| Familiya | Vazn | Maqsad |
|----------|------|--------|
| **Plus Jakarta Sans** | 400, 500, 600, 700 | UI matn (paragraf, tugma, link, meta) |
| **Fraunces** | 400, 500 (regular + italic) | Display sarlavhalar (h1, h2, hero CTA) |
| **JetBrains Mono** | 500, 600 | Raqam, ID, telefon (ixtiyoriy) |

### Index.html ga qo'shing

```html
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,500;1,500&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet"/>
```

## Shriftni qachon ishlatish

### Fraunces (display)
- `h1` — hero sarlavha
- `h2` — bo'lim sarlavhalari
- `h3` — kichik sarlavhalar (news title, direction name esa Plus Jakarta — chunki ular UI element)
- Katta raqamlar (`222+`, `2005`, `3.7 ga`)
- "italic" stil — emfaza uchun (masalan: *Pedagogika*)

### Plus Jakarta Sans (UI)
- Paragraf matn (lead, body, meta)
- Tugmalar
- Linklar
- Kichik UI elementlari (badge, tag, eyebrow)

### JetBrains Mono (data)
- Telefon raqami: `+998 93 925-34-33`
- ID: `ST-2401` (kabinet'da)
- Statistik raqamlar (ixtiyoriy)

## O'lchamlar

```scss
// Hero h1
font-family: var(--lp-font-display);
font-weight: 500;
font-size: clamp(40px, 5vw, 64px);
line-height: 1.05;
letter-spacing: -0.03em;

// Section h2
font-family: var(--lp-font-display);
font-weight: 500;
font-size: clamp(28px, 3.5vw, 44px);
line-height: 1.1;
letter-spacing: -0.025em;

// h3 (UI element, masalan direction name)
font-family: var(--lp-font-sans);
font-weight: 700;
font-size: 15-19px;
letter-spacing: -0.01em;

// Lead paragraph
font-family: var(--lp-font-sans);
font-weight: 500;
font-size: 17-18px;
line-height: 1.6;

// Body paragraph
font-family: var(--lp-font-sans);
font-weight: 500;
font-size: 14-15px;
line-height: 1.55-1.65;

// Eyebrow / overline
font-weight: 700;
font-size: 11-12px;
text-transform: uppercase;
letter-spacing: 0.18em;
```

## Letter-spacing prinsipi

- Display sarlavhalar — `-0.025em` dan `-0.03em` (zich, ammo o'qiladigan)
- UI matn — `-0.005em` dan `-0.01em` (juda kichik zichlash)
- Eyebrow / uppercase — `0.1em` dan `0.18em` (ochish)
- Mono — sukut bo'yicha (`0`)

## Misol

### Eski
```html
<h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] mb-6 text-slate-900">
  Bo'ka <span class="text-amber-500">Pedagogika</span> Texnikumi
</h1>
```

### Yangi
```html
<h1 class="lp-h1 animate-fade-in-up">
  Bo'ka <em>Pedagogika</em><br>Texnikumi
</h1>
```

`em` taglari Fraunces italic'ni ishlatadi, amber rang beradi — minimal markup, maksimal niyat.

## Tailwind bilan birlashtirish

Tailwind'ning `font-extrabold` (800) → bizning Plus Jakarta'da yo'q (max 700). Buni `_landing-base.scss` ichida override qilish mumkin:

```scss
.landing-layout {
  .font-extrabold { font-weight: 700 !important; }
  .font-bold { font-weight: 700 !important; }
}
```

Yoki `tailwind.config.js` da:

```js
fontFamily: {
  sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
  display: ['Fraunces', 'serif'],
}
```
