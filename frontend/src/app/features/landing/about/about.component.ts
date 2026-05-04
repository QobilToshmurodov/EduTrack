import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

interface Stat {
  icon: string;
  value: string;
  label: string;
}

interface BuildingCard {
  title: string;
  status: 'available' | 'missing';
  rows: { label: string; value: string }[];
}

interface Partner {
  name: string;
  field: string;
  staff?: string;
  founded?: string;
}

interface Program {
  name: string;
  badge?: string;
  stage1?: number;
  stage2?: number;
  stage3?: number;
  isNew?: boolean;
}

interface ComputerRow {
  name: string;
  count: number;
  good: number;
  broken: number;
  unusable: number;
  needName?: string;
  needCount?: string;
}

interface TerritoryRow {
  label: string;
  value: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  // ============ Header summary stats ============
  summaryStats: Stat[] = [
    { icon: '📐', value: '3.70 ga', label: 'Umumiy yer maydoni' },
    { icon: '🏛️', value: '4590.9 m²', label: 'Bino umumiy maydoni' },
    { icon: '🏗️', value: '2229.92 m²', label: 'Qurilish osti maydoni' },
    { icon: '🏢', value: '1 ta', label: 'Bino va inshootlar soni' }
  ];

  // ============ Buildings ============
  buildings: BuildingCard[] = [
    {
      title: "O'quv binosi",
      status: 'available',
      rows: [
        { label: 'Soni', value: '1 ta' },
        { label: 'Qurilgan yili', value: '2005-yil' },
        { label: "Oxirgi ta'mirlash", value: "Ta'mirlanmagan" },
        { label: "O'quv xonalari", value: '14 ta' },
        { label: 'Loyihaviy quvvati', value: "330 o'rin" },
        { label: 'Umumiy maydoni', value: '2193.08 m²' },
        { label: 'Foydali maydoni', value: '2193.08 m²' },
        { label: 'Texnik holati', value: 'Yaroqli' }
      ]
    },
    {
      title: "Sport zali",
      status: 'available',
      rows: [
        { label: "O'lcham", value: '18×39 m' },
        { label: 'Maydoni', value: '702 m²' },
        { label: 'Texnik holati', value: 'Yaroqli' }
      ]
    },
    {
      title: "O'quvchilar yotoqxonasi",
      status: 'missing',
      rows: [
        { label: 'Soni', value: 'Mavjud emas' }
      ]
    },
    {
      title: "Ustaxona binosi",
      status: 'missing',
      rows: [
        { label: 'Soni', value: 'Mavjud emas' }
      ]
    },
    {
      title: "Oshxona / bufet",
      status: 'missing',
      rows: [
        { label: "O'rinlar soni", value: 'Mavjud emas' }
      ]
    }
  ];

  // ============ Programs / Yo'nalishlar ============
  existingPrograms: Program[] = [
    { name: "Maktabgacha ta'lim tashkiloti tarbiyachisi (sirtqi, dual)", stage2: 99, stage3: 97 },
    { name: 'Kutubxonashunoslik (dual, sirtqi)', stage1: 12, stage2: 17 }
  ];

  newPrograms: Program[] = [
    { name: 'Kompyuter grafikasi va dizayn operatori', stage1: 60, isNew: true },
    { name: 'Yakka tartibdagi kiyim tikuvchilik (dual)', stage1: 21, isNew: true },
    { name: "Maktabgacha ta'lim tashkiloti uslubchisi (dual)", stage1: 17, isNew: true }
  ];

  // ============ Partners ============
  partners: Partner[] = [
    { name: '"Aziza Bo\'ka texstil" MChJ', field: 'Tikuvchilik', staff: '—', founded: '2023' },
    { name: "Bo'ka tumani MMTBga qarashli DMTT, ONMT", field: "Ta'lim", staff: '450', founded: '2018' },
    { name: 'Bekobod tumani MMTBga qarashli DMTT, ONMT', field: "Ta'lim", staff: '400', founded: '—' },
    { name: 'Piskent tumani MMTBga qarashli DMTT, ONMT "Fanat sanatoriyasi" MChJ', field: "Ta'lim", staff: '550', founded: '—' },
    { name: "Oqqo'rg'on tumani MMTBga qarashli DMTT, ONMT", field: "Ta'lim", staff: '350', founded: '—' }
  ];

  // ============ Required equipment ============
  workshopNeeds = [
    { profession: 'Tikuvchilik', need: "Tikuv mashinasi (1 to'plam)" }
  ];

  labNeeds = [
    { name: 'Lingafon xonasi', need: 'Mavjud emas' },
    { name: 'Kimyo laboratoriyasi', need: 'Mavjud emas' },
    { name: 'Fizika laboratoriyasi', need: 'Mavjud emas' },
    { name: 'Biologiya laboratoriyasi', need: 'Mavjud emas' }
  ];

  practiceNeeds = [
    { profession: 'Kompyuter grafikasi va dizayn operatori', need: "Kompyuter (1 to'plam)" }
  ];

  // ============ Computers ============
  computers: ComputerRow[] = [
    { name: 'Monoblok',         count: 19, good: 19, broken: 0,  unusable: 0, needName: 'Monoblok',         needCount: "1 to'plam" },
    { name: 'Kompyuter',        count: 21, good: 0,  broken: 21, unusable: 0 },
    { name: 'Noutbuk',          count: 2,  good: 0,  broken: 2,  unusable: 0, needName: 'Noutbuk',          needCount: '2 ta' },
    { name: 'Interaktiv doska', count: 3,  good: 3,  broken: 0,  unusable: 0, needName: 'Interaktiv doska', needCount: '5 ta' }
  ];

  // ============ Territory ============
  territory: TerritoryRow[] = [
    { label: 'Asfaltlangan hudud',     value: '2553 m²' },
    { label: 'Beton qoplamali yo\'laklar', value: '0 m²' },
    { label: 'Yashil hudud (obodonlashtiriladigan)', value: '2153.1 m²' },
    { label: 'Gulzorlar',               value: '40 m²' }
  ];

  greenery = [
    { icon: '🌳', value: '3275 ta', label: "Daraxtlar (umumiy)" },
    { icon: '🌲', value: '55 ta',   label: 'Manzarali daraxtlar' },
    { icon: '🍎', value: '220 ta',  label: 'Mevali daraxtlar' },
    { icon: '🆔', value: '110 ta',  label: 'yashilmakon.eco platformasida' }
  ];

  facilities = [
    { icon: '💡', value: '1200 ta', label: 'Yoritish chiroqlari' },
    { icon: '🪑', value: '0 ta',    label: 'Dam olish o\'rindiqlari' },
    { icon: '🕐', value: '1 smena', label: "O'qish smenasi" }
  ];
}
