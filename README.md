# EcomDev — O'quv markazi to'lovlar hisobi

O'quv markazi uchun to'lovlarni boshqarish va oylik qarzdorlikni monitoring qilish tizimi (REST API + Mobile-friendly veb-interfeys).

## Texnologik stek

- **Backend:** Node.js, TypeScript, Express.js
- **Baza:** Supabase (PostgreSQL)
- **Frontend:** Vue.js 3, CSS (Mobile-first)

---

## Ishga tushirish (Zero-config)

Loyiha tayyor demo bulutli ma'lumotlar bazasiga ulangan. Hech qanday qo'shimcha baza o'rnatish yoki sozlash talab etilmaydi:

```bash
git clone https://github.com/pulatov077/ecomdev.git
cd ecomdev
npm install
npm run dev
```

Brauzerda oching:
```
http://localhost:3000
```

> *(Ixtiyoriy: Agar o'zingizning shaxsiy Supabase bazangizni ulamoqchi bo'lsangiz, `schema.sql` skriptini SQL Editor-da yurgizib, `.env` faylida `SUPABASE_URL` va `SUPABASE_KEY` ni ko'rsatishingiz mumkin).*

---

## API Hujjatlari

### O'quvchilar
- `GET /api/students` — Barcha o'quvchilar ro'yxati
- `POST /api/students` — Yangi o'quvchi qo'shish
- `PUT /api/students/:id` — O'quvchi ma'lumotlarini yangilash
- `DELETE /api/students/:id` — O'quvchini o'chirish (to'lovlari bilan birga)

Format:
```json
{
  "name": "Jasurbek Rahimov",
  "phone": "+998 90 123 45 67",
  "group_name": "Frontend Bootcamp - F1",
  "monthly_amount": 700000
}
```

### To'lovlar
- `POST /api/payments` — To'lov qabul qilish
- `GET /api/payments/student/:id` — O'quvchining barcha to'lovlar tarixi

Format:
```json
{
  "student_id": 1,
  "amount": 500000,
  "date": "2026-10-26"
}
```

### Qarzdorlar
- `GET /api/debtors?month=YYYY-MM` — Berilgan oy uchun oylik to'lovini to'liq yopmagan o'quvchilar ro'yxati va qarz miqdori.

---

## Yana 1 hafta vaqt bo'lsa qilinadigan ishlar

1. **Autentifikatsiya:** JWT / Supabase Auth orqali rollar (Admin, Operator) va xavfsizlik qatlamini joriy etish.
2. **Validatsiya va Schema tekshiruvi:** `zod` kutubxonasi yordamida request payload'larini qat'iy tekshirish va xatolik javoblarini standartlashtirish.
3. **Avtomatik eslatmalar:** Oylik to'lov muddati yaqinlashganda Telegram-bot yoki SMS provayder orqali o'quvchi/ota-onaga xabarnoma yuborish.
4. **Test qoplamasi:** Vitest va Supertest orqali API endpointlar uchun integration testlar yozish.
5. **Konteynerizatsiya:** Loyihani to'liq `Dockerfile` va `docker-compose` ga o'tkazib, deploy jarayonini osonlashtirish.
