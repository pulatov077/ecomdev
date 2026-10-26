# EcomDev — O'quv markazi to'lovlar hisobi

O'quv markazi uchun to'lovlarni boshqarish va oylik qarzdorlikni kuzatish tizimi (REST API + Mobile-friendly veb-interfeys).

## Texnologik stek

- **Backend:** Node.js, TypeScript, Express.js
- **Baza:** Supabase (PostgreSQL)
- **Frontend:** Vue.js 3, CSS (Mobile-first)

---

## Ishga tushirish

### 1. Baza jadvallarini yaratish
Supabase SQL Editor-da `schema.sql` fayli ichidagi SQL kodini yurgizing.

### 2. O'rnatish va muhit sozlamalari

```bash
git clone https://github.com/YOUR_USERNAME/econdev.git
cd econdev
npm install
```

Loyiha ildizida `.env` fayl yarating:
```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

### 3. Ma'lumotlarni to'ldirish (ixtiyoriy)
Real o'quvchilar va to'lovlar bilan bazani to'ldirish:
```bash
npm run seed
```

### 4. Serverni ishga tushirish

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

Brauzerda: `http://localhost:3000`

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
