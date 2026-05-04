# 05 — Tekshiruv ro'yxati (Checklist)

## Pre-flight

- [ ] Eski `landing/` papkasini backup qildim (`landing.bak`)
- [ ] `git checkout -b feature/landing-redesign` — alohida branch
- [ ] Cabinet sahifasi hali ham ishlayapti

## Tokenlar

- [ ] `_landing-tokens.scss` `frontend/src/styles/` ichida
- [ ] `_landing-base.scss` `frontend/src/styles/` ichida
- [ ] `styles.scss` ga import qilindi
- [ ] Plus Jakarta + Fraunces shriftlari `index.html` ga ulandi
- [ ] DevTools'da `--lp-bg`, `--lp-ink`, `--lp-amber-400` o'zgaruvchilari ko'rinadi

## Layout

- [ ] `landing-layout.component.html` da root `.landing-layout` class oladi
- [ ] Cabinet sahifasi pergament fonga o'zgarmagan (faqat landing'da o'zgarish)

## Home component

- [ ] Hero — pergament fon, navy h1, sariq italic "Pedagogika"
- [ ] Hero "Tizimga kirish" — **qora-navy** (sariq emas)
- [ ] Hero floating badge "2005" — oq fon, "222+" — sariq fon
- [ ] About — oq fon, ikon ramkalari amber
- [ ] About telefon tugmasi — qora-navy
- [ ] Infrastructure — pergament fon, kartalar oq, hover yuqoriga
- [ ] Directions — kartalar oq, hover'da chap chiziq amber paydo bo'ladi
- [ ] News — sarlavhalar Fraunces, hover'da rasm zoom
- [ ] News date — `lp-amber-700` rang
- [ ] CTA — qora gradient + sariq tugma + amber yulduz chizig'i

## Header

- [ ] Sticky + blur
- [ ] Logo halqasi amber
- [ ] Nav linklar — Plus Jakarta, hover'da pergament fon
- [ ] "Kirish" tugmasi — qora-navy
- [ ] Mobile menyu ishlayapti

## Footer

- [ ] Qora-navy fon
- [ ] Yuqori amber gradient chiziq
- [ ] Logo halqasi amber
- [ ] Linklar amber'ga hover bo'ladi
- [ ] Kontakt iconlari amber

## News detail

- [ ] Sahifa pergament fon
- [ ] Sarlavha Fraunces
- [ ] Body Plus Jakarta, kichik o'qish chizig'i
- [ ] Blockquote amber chap ramka
- [ ] Linklar amber, underline

## Responsive

- [ ] Mobile (375px) — Hero stack, nav menyu yashirin
- [ ] Tablet (768px) — Grid 2-column
- [ ] Desktop (1280px+) — to'liq layout
- [ ] Floating badge'lar mobile'da o'lchamiga moslashadi

## Performance

- [ ] Hero rasm `loading="eager"` (LCP)
- [ ] Boshqa rasmlar `loading="lazy"`
- [ ] Shrift `display=swap` (FOUT'dan saqlanadi)
- [ ] Animatsiyalar `prefers-reduced-motion` ni hurmat qiladi

## Browser

- [ ] Chrome — yaxshi
- [ ] Safari — backdrop-filter ishlayapti
- [ ] Firefox — gradient'lar to'g'ri
- [ ] Mobile Safari (iOS) — sticky header silliq

## A11y

- [ ] Keyboard navigation — Tab tartibi mantiqli
- [ ] Focus indicator ko'rinadi (qoraytirilmagan)
- [ ] Sariq matn ranglari WCAG AA o'tadi (kerakli joyda `lp-amber-700` ishlatilgan)
- [ ] Mat-icon'larga `aria-hidden="true"` (matnli iconlar uchun)
- [ ] Alt matnlar barcha rasmlarda

## Final

- [ ] Build error yo'q (`ng build`)
- [ ] Console warning'lar yo'q
- [ ] Cabinet stillariga ta'sir yo'q (regress yo'q)
- [ ] Deploy preview — to'g'ri ko'rinadi
- [ ] PR ga screenshotlar qo'shildi
