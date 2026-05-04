# 01 — Yondashuv (Overview)

## Maqsad

Hozirgi landing **vizual jihatdan yaxshi** (Tailwind + animatsiyalar), lekin **kabinet bilan ikki dunyo**:

| | Hozirgi landing | Cabinet (yangi) |
|---|---|---|
| Asosiy rang | Sariq (`amber-400`) + slate | Scholar Indigo + teal |
| Fon | Oq + gradient | Pergament cream `#F6F5F1` |
| Shrift | System UI | Plus Jakarta + Fraunces |
| Soya | `slate-300/40` | `rgba(14,27,61,0.06)` |

Maqsad — **ikkalasi bir mahsulot bo'lishi**.

## Yondashuv: Brand evolyutsiya, revolyutsiya emas

Landing'ning **brand kimligi** — sariq + Bo'ka Pedagogika rasmlari. Buni **olib tashlamaydigan**, balki **kuchaytiradigan** o'zgarishlar:

### 1. Sariqni *aksent* sifatida saqlash
Hozir sariq **hamma joyda** — CTA, badge, link, accent line, hover. Bu sariqni "arzonlashtiradi".

**Yangi qoida:**
- ✅ Brand momentlar (logo halqasi, eyebrow chiziq, "Floating badge" — 222+ o'quvchi)
- ✅ News date, "Batafsil o'qish" link
- ✅ CTA bo'limining yashin-chizig'i (top accent)
- ❌ Asosiy "Tizimga kirish" tugmasi → endi qora-navy (kabinet primary)
- ❌ Ikon ranglar har joyda → endi faqat keraklisi

### 2. Pergament fon
Sof oq sahifa "korporativ-soviq" his beradi. Pergament cream (`#F6F5F1`) — akademik, iliq, uzoq qarashga moslashgan. Bu kabinet bilan **bir xil bo'ladi**.

### 3. Display shrift sarlavhalar uchun
Fraunces (italic optional) — akademik, jiddiy, lekin shaxsiy. H1, H2 da ishlatiladi:

```
Bo'ka *Pedagogika* Texnikumi
```

So'z "Pedagogika" italic + amber rang — brand momenti.

### 4. Asosiy CTA — kabinet primary
"Tizimga kirish" → qora-navy fon + oq matn. Bu **xayriya emas**:
- Vizual ierarxiya — sariq fon ustida sariq tugma kuchsiz ko'rinadi
- Kabinet bilan birxil "kirish" hissi
- Sariq tugma — ikkilamchi yoki CTA bo'limida (qora fon ustida) yaxshi ishlaydi

### 5. Yumshoq soyalar (ko'k tonda)
Tailwind'ning `shadow-2xl` qora soyasi — pergament fonda agressiv ko'rinadi. Bizning soyalar `rgba(14,27,61,...)` — ko'k-binafsha tonda, yumshoq.

## Texnik strategiya

1. **Tailwind'ni saqlaymiz** — qayta yozishga vaqt ketmaydi
2. **`_landing-base.scss` orqali Tailwind class'larini override qilamiz** — `.text-slate-900 → var(--lp-ink)` va h.k.
3. **Yangi semantik class'lar** (`lp-*`) qo'shamiz — bu kelajakda Tailwind'siz ishlash uchun ham yaxshi
4. **Animatsiyalarni saqlaymiz** — ular yaxshi ishlaydi

## Natija

Foydalanuvchi sayohati:
1. **Landing** (pergament + sariq aksent + Bo'ka brand) — iliq, taklif qiluvchi
2. "Tizimga kirish" tugmasini bosadi
3. **Login** (kabinet bilan birxil dizayn) — o'tish silliq, ikkala dunyo bog'langan
4. **Cabinet** (pergament + indigo + teal) — jiddiy ish muhiti

Bir butun mahsulot, lekin har qism o'z vazifasi uchun moslashgan.
