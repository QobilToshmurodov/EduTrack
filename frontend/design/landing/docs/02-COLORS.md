# 02 — Rang sistemasi

## Asosiy printsip

| Rang | Maqsad | Misollar |
|------|--------|----------|
| `--lp-ink` `#0E1B3D` | Asosiy yozuv, asosiy CTA | h1/h2/h3, "Tizimga kirish" tugmasi, footer fon |
| `--lp-bg` `#F6F5F1` | Pergament fon | Sahifa fon, hero fon |
| `--lp-amber-400` `#FFC107` | Brand aksent (hamma joyda emas!) | Logo halqasi, eyebrow chiziq, "222+" badge, news date |
| `--lp-amber-700` `#8B6700` | Matn ustida o'qiladigan amber | Link, "Batafsil o'qish", overline matn |

## Palitra

### Ink (yozuv)
| Token | Hex | Foydalanish |
|-------|-----|-------------|
| `--lp-ink` | `#0E1B3D` | h1, h2, h3, asosiy paragraf |
| `--lp-ink-2` | `#2A3458` | h4, kuchli matn |
| `--lp-ink-3` | `#5C6585` | Lead paragraflar, meta matn |
| `--lp-ink-4` | `#97A0BD` | Disabled, placeholder |

### Surface (fon)
| Token | Hex | Foydalanish |
|-------|-----|-------------|
| `--lp-bg` | `#F6F5F1` | Sahifa fon (pergament) |
| `--lp-bg-2` | `#EFEEE8` | Bo'lim alternativi |
| `--lp-surface` | `#FFFFFF` | Karta, header (sticky) |
| `--lp-line` | `#E7E4DA` | Ramkalar (border) |
| `--lp-line-2` | `#D8D4C7` | Kuchliroq ramkalar |

### Brand: Amber (saqlanadi, lekin tartibga keltirilgan)
| Token | Hex | Qachon |
|-------|-----|--------|
| `--lp-amber-50` | `#FFF8E1` | Iqon fon (juda yumshoq) |
| `--lp-amber-100` | `#FFECB3` | Ramka |
| `--lp-amber-300` | `#FFD54F` | Hover holatlar |
| `--lp-amber-400` | `#FFC107` | Brand asosiy — badge, accent line |
| `--lp-amber-500` | `#F5B400` | Hover'da kuchliroq |
| `--lp-amber-600` | `#C99500` | Iqon ranggi (oq fonda) |
| `--lp-amber-700` | `#8B6700` | **Matn ranggi** (kontrast uchun) |

### Scholar Indigo (kabinet bilan birxil)
| Token | Hex | Qachon |
|-------|-----|--------|
| `--lp-indigo-700` | `#2F3699` | CTA kartochka gradient |
| `--lp-indigo-900` | `#1A2563` | Asosiy CTA hover |

## Sariq qachon ishlatiladi?

✅ **HA:**
- Logo atrofidagi halqa
- Eyebrow chiziqcha (h2 dan oldingi gorizontal chiziq)
- Hero badge "222+ O'quvchilar"
- News date ("3 MAY 2026")
- "Batafsil o'qish" linkasi
- Footer brand chizig'i (top gradient)
- CTA bo'limining yulduzli aksent
- Direction card hover bar

❌ **YO'Q:**
- Asosiy "Tizimga kirish" tugmasi (qora-navy bo'ldi)
- Hover ranglari hamma linklarda
- Ikon ranglari sukut bo'yicha (faqat brand kontekstda)

## Misol

### Hozirgi (eski)
```html
<a class="bg-amber-400 hover:bg-amber-300 text-slate-900 ...">
  Tizimga kirish
</a>
```

### Yangi
```html
<a class="lp-btn lp-btn-primary">  <!-- qora-navy -->
  Tizimga kirish
</a>
```

Sariq versiya **CTA bo'limida** (qora gradient fon ustida) ishlatiladi:
```html
<a class="lp-btn lp-btn-amber">  <!-- bu yerda sariq mukammal -->
  Kirish
</a>
```

## Dark mode (kelajakda)

`_landing-tokens.scss` ichiga qo'shish mumkin:

```scss
[data-theme="dark"] .landing-layout {
  --lp-bg:        #0B1024;
  --lp-bg-2:      #131A36;
  --lp-surface:   #19224A;
  --lp-ink:       #F2F1EC;
  --lp-ink-2:     #C9CDDF;
  --lp-line:      #2A3666;
  // amber rang kuchliroq fonga moslashadi:
  --lp-amber-700: #FFD54F;
}
```
