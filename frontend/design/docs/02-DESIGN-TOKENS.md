# Design Tokens — Why & How

> EduTrack v2'ning vizual asoslari. Har bir token nima uchun shunday tanlanganligi.

---

## 🎨 Rang tizimi

### Brand: Scholar Indigo (`#4F5DE0`)
Eski `azure-blue` Material temasi juda umumiy edi — "yana bir Material app". Indigo:
- **Akademik konnotatsiyaga ega** (universitet, ilm-fan)
- **Ko'k oilasidan**, lekin "tech-blue" emas — bir oz binafshaga moyil
- Material 3 palitra generatorida 50→900 to'liq tonal scale beradi
- AA kontrast: oq fonda 7.4:1 (mukammal)

### Aksent: Teal (`#14B89A`)
Muvaffaqiyat, motivatsiya, "bajarildi" holatlari uchun. Yashildan ko'ra teal — chunki:
- Yashil → "ekologiya" / "kasallik / sog'liq" assotsiatsiyalari
- Teal akademik dizaynda neytralroq (Coursera, Khan Academy ham ishlatadi)
- Indigo bilan komplementar harmoniya

### Issiq: Warm Orange (`#F58A3D`)
"Diqqat" / "tez orada bajariladigan" / "reyting". Qizildan farqli — qizil = xatolik.

### Plum (`#8E47C7`)
Fan teglari uchun ekstra rang — Math/Science/Language farqlanishida ishlatiladi.

### Pergament (`#F6F5F1`) — fon
Bu eng muhim qaror. Sabablari:
- **Ko'z charchamaydi** — sof oq (`#FFFFFF`) ekranni yorituvchi sifatida ishlaydi, bu LMS'da soatlab ishlash uchun og'ir
- **Akademik konnotatsiya** — qog'oz, kitob, eski universitet
- **Issiq tonli** ranglar (orange, plum) bilan yaxshi suhbatlashadi
- Bu Linear, Figma, Notion'ning yangi versiyalari ishlatayotgan trend

---

## 📝 Shrift tizimi

### Plus Jakarta Sans — UI
- Inter'dan zamonaviyroq (g, a, t harflari xarakterli)
- 400/500/600/700 weight'lari mavjud
- Ko'p tilli (kirill kerakmi? — ha, mukammal)
- Tabular numerals — jadvallarda raqamlar tekis

### Fraunces — Display
- Serif, lekin "kitob" emas — variable, zamonaviy
- Page title, KPI raqamlari, hero headline'lar uchun
- Ozgina italic + slight wght variation = "akademik nashrning sarlavhasi" tuyg'usi
- ⚠️ Body uchun ishlatmang — faqat 22px+ o'lchamlarda

### JetBrains Mono — Mono
- ID, kod, tabular qiymatlar
- Tabular numerals + ligaturalar

---

## 📐 Radius scale

```
xs  =  6px  →  inputs, chips, small badges
sm  = 10px  →  small buttons, list items
md  = 14px  →  buttons, form fields, cards
lg  = 20px  →  big cards, panels
xl  = 28px  →  hero card, modal corners
pill= 999px →  status chips, avatars
```

**Qoida:** parent radius child radius'dan kattaroq. Karta = 20px bo'lsa, ichidagi tugma = 14px.

---

## 🌫 Soyalar

```
shadow-1  →  static cards (juda yumshoq)
shadow-2  →  hover state, raised buttons
shadow-3  →  modals, popovers
shadow-pop→  brand-colored glow (CTA tugmalari)
```

Hammasi `rgba(14, 27, 61, X)` — ya'ni qora emas, **ko'k tonli soya**. Bu issiq fon bilan birga xush ko'rinadi.

---

## 📏 Spacing

4px asoslangan: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40`. Material'ning 8px grid'i bilan to'liq mos.

---

## 🌓 Dark Mode

Dark mode'da:
- Fon `#0B1024` — qora emas, juda quyuq indigo (jurnalga o'xshaydi)
- Surface `#19224A` — biroz ochiqroq
- Brand 500 dark'da ham yorqin va kontrastli
- Soya'lar quyuqroq + diffuz

`<html data-theme="dark">` qo'yilsa, CSS o'zgaruvchilar avtomatik almashadi. Hech qanday SCSS qayta-kompilatsiya kerak emas.
