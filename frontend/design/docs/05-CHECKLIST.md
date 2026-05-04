# Pre-deploy Checklist

## 🎨 Vizual

- [ ] Login: chap brand panel ko'rinadi (>=960px), <960px'da forma to'la kenglikni egallaydi
- [ ] Sidebar active item: ink fon + teal rail + oq matn
- [ ] Topbar: search input fokus indigo border, ⌘K kbd ko'rinadi
- [ ] Hero card: dark indigo gradient + teal radial glow
- [ ] KPI kartalari: hover transform 2px yuqoriga, shadow-2
- [ ] Jadvallar: hover row surface-2 ranggi
- [ ] Buttons: primary `var(--et-ink)` fonli, accent `var(--et-primary-500)`
- [ ] Form fields: outlined, 14px radius, fokus indigo

## 🌓 Dark mode

- [ ] Toggle ishlaydi (topbar icon)
- [ ] LocalStorage'da saqlanadi (`et-theme` key)
- [ ] Sahifa qaytadan yuklanganda saqlanadi
- [ ] Login + Cabinet + Dashboard + Tables — to'rttasida ishlaydi

## 📱 Responsive

- [ ] **>= 1280px** — to'liq layout (sidebar + 2-column dashboard)
- [ ] **1024-1280px** — KPI grid 2 ustun
- [ ] **600-1024px** — sidebar yopiladi (hamburger menu)
- [ ] **< 600px** — bitta ustun, summary-row stack

## ♿ Accessibility

- [ ] Lighthouse a11y skor ≥ 95
- [ ] `:focus-visible` outline barcha interactive elementlarda
- [ ] Contrast ratio: matn 4.5:1, katta matn 3:1
- [ ] `<button>` elementlarda `aria-label` (icon-only tugmalar uchun)
- [ ] Keyboard navigation: Tab tartibi mantiqiy

## ⚡ Performance

- [ ] First Contentful Paint < 1.5s
- [ ] Bundle size: main.js < 500kb gzipped
- [ ] Google Fonts `display=swap` qo'yilgan
- [ ] Material'ning ishlatilmaydigan modullar import qilinmagan

## 🧪 Funksional

- [ ] Login ishlaydi (mavjud auth flow buzilmagan)
- [ ] Role-based redirect ishlaydi (Director / Teacher / Student)
- [ ] CRUD: create / edit / delete dialoglari ochiladi
- [ ] HTTP interceptor token qo'shadi
- [ ] 401 → logout + redirect to login

## 🚢 Deploy

- [ ] `npm run build` xatosiz
- [ ] `dist/` ichida `styles.css` mavjud, ~50-80kb gzipped
- [ ] Production'da fontlar to'g'ri yuklanadi (CORS ok)
- [ ] `environment.ts` — `apiUrl: '/api'` (relative)

---

## 🐛 Yo'l-yo'lakay duch keladigan muammolar

### "M3 themedan keyin Material rangi ko'k qolib ketdi"
- `azure-blue.css` import'ini olib tashlaganmisiz? `styles.scss` ichida `@import '@angular/material/prebuilt-themes/...'` bo'lmasligi kerak.

### "mat-form-field hali ham eski ko'rinishda"
- Component'ning `.scss`'idan `::ng-deep` selector'larni olib tashlang. Yangi M3 CSS o'zgaruvchilar global'da o'rnatilgan.

### "Dark mode ba'zi joylarda ishlamayapti"
- Hardcoded `#fff` / `#000` izlang va CSS o'zgaruvchilarga almashtiring.

### "Sidebar mobil'da chiqib ketmaydi"
- `cabinet-layout.component.ts`'da `mobileOpen()` signal va hamburger button qo'shilganmi tekshiring.

### "Fontlar yuklanmayapti"
- `index.html`'da Google Fonts link tegi bormi tekshiring + brauzer Network tab'ida 200 OK qaytayotganligini.
