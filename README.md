# کلیدبان — Password Manager

**Kelidban** یک نرم‌افزار دسکتاپ مدیریت رمز عبور برای ویندوز است که با React، Electron و WebCrypto ساخته شده و برای ارائه حرفه‌ای در رزومه و GitHub آماده‌سازی شده است.

- برنامه‌نویس: **MOHAMAD AMIN SERAJ**
- لقب/برند: **Vidson313**
- GitHub: <https://github.com/vidson313>
- Telegram: `@Mhmd_seraj`

کلیدبان یک password manager کلاینت‌ساید با رابط React/Vite است. داده‌های کاربر قبل از ذخیره‌سازی با رمز مستر کاربر رمزنگاری می‌شوند و برنامه برای دسترسی بین مرورگرها از فایل رمزنگاری‌شده روی Google Drive استفاده می‌کند.

## قابلیت‌های کلیدی

- رمزنگاری zero-knowledge با AES-GCM و کلید مشتق‌شده از رمز مستر
- پشتیبانی از حساب‌های کاربری، کارت‌های بانکی، یادداشت‌های امن، پوشه‌ها، تگ‌ها و علاقه‌مندی‌ها
- تولید رمز عبور امن با WebCrypto-backed randomness
- تولید کد TOTP برای احراز هویت دومرحله‌ای
- خروجی پشتیبان رمزنگاری‌شده و import/export CSV با هشدار امنیتی
- همگام‌سازی اختیاری Google Drive فقط برای payload رمزنگاری‌شده
- نسخه دسکتاپ ویندوزی با Electron، installer NSIS، آیکون اختصاصی و صفحه About/Version

## آماده‌سازی انتشار

- دستور بررسی کامل انتشار: `npm run release:check`
- changelog: `CHANGELOG.md`
- سیاست امنیتی: `SECURITY.md`
- چک‌لیست انتشار: `docs/RELEASE_CHECKLIST.md`

## وضعیت ذخیره‌سازی و معماری

برنامه از مدل **encrypted cloud-first** استفاده می‌کند:

1. کاربر یک رمز مستر تعیین می‌کند.
2. داده‌های vault شامل حساب‌ها، کارت‌ها، یادداشت‌ها و پوشه‌ها در مرورگر به JSON تبدیل می‌شوند.
3. JSON با کلیدی که از رمز مستر مشتق می‌شود رمزنگاری می‌شود.
4. خروجی رمزنگاری‌شده به‌صورت `vault_payload` در مرورگر cache می‌شود.
5. اگر Google Drive وصل باشد، همان payload رمزنگاری‌شده با نام `vault.enc` روی Drive کاربر sync می‌شود.

نکته مهم: Google Drive فقط ciphertext را دریافت می‌کند. رمز مستر و plaintext رمزهای کاربر به Google Drive یا سرور دیگری ارسال نمی‌شوند.

## دسترسی از مرورگر یا دستگاه جدید

برای اینکه اطلاعات به مرورگر خاص وابسته نباشد، کاربر باید Google Drive sync را فعال کند.

جریان پیشنهادی در مرورگر جدید:

1. برنامه را باز کنید.
2. در صفحه ورود روی `اتصال به Google Drive` کلیک کنید.
3. بعد از برگشت از Google، روی `بارگیری vault ابری` کلیک کنید.
4. برنامه فایل `vault.enc` را دریافت و به‌صورت local cache ذخیره می‌کند.
5. رمز مستر قبلی را وارد کنید.
6. vault رمزگشایی و اطلاعات نمایش داده می‌شود.

اگر Google Drive sync قبلاً فعال نشده باشد یا فایل `vault.enc` در Drive وجود نداشته باشد، مرورگر جدید vault خالی خواهد داشت.

## راه‌اندازی اولیه

در اولین اجرا، اگر هیچ vault محلی وجود نداشته باشد، صفحه ورود در حالت setup نمایش داده می‌شود.

مراحل:

1. یک رمز مستر قوی وارد کنید.
2. رمز را تأیید کنید.
3. برنامه vault خالی را رمزنگاری و در مرورگر ذخیره می‌کند.
4. اگر Google Drive از قبل وصل باشد، vault رمزنگاری‌شده بلافاصله روی Drive sync می‌شود.

برای دسترسی بین مرورگرها، بهتر است همان ابتدا Google Drive را وصل کنید.

## ریست کامل و کاربر جدید

در صفحه ورود دکمه `کاربر جدید / ریست کامل و راه‌اندازی از نو` وجود دارد.

این عملیات:

- `vault_payload` محلی را حذف می‌کند.
- تنظیمات محلی برنامه را حذف می‌کند.
- توکن Google Drive ذخیره‌شده در session را حذف می‌کند.
- state رمزگشایی‌شده داخل برنامه را پاک می‌کند.
- اگر Google Drive وصل باشد، فایل `vault.enc` ابری را هم حذف می‌کند.

بعد از reset، برنامه دوباره در حالت setup باز می‌شود و کاربر می‌تواند رمز مستر جدید بسازد.

هشدار: اگر فایل ابری حذف شود و backup دیگری وجود نداشته باشد، بازیابی اطلاعات قبلی ممکن نیست.

## مدل امنیتی

### رمزنگاری vault

- الگوریتم رمزنگاری: `AES-GCM` با کلید ۲۵۶ بیتی
- مشتق‌سازی کلید: `PBKDF2` با `SHA-256`
- salt تصادفی برای هر encryption
- IV تصادفی برای هر encryption
- payload ذخیره‌شده شامل `salt`، `iv`، `ciphertext` و `iterations` است

فایل‌های مرتبط:

- `src/utils/crypto.ts`
- `src/types/index.ts`

### تولید رمز و شناسه‌ها

مولد رمز و IDهای داخلی از WebCrypto استفاده می‌کنند، نه `Math.random()`.

فایل‌های مرتبط:

- `src/utils/random.ts`
- `src/components/PasswordGenerator.tsx`
- `src/components/ItemForm.tsx`
- `src/components/CsvImporter.tsx`

### clipboard

وقتی کاربر رمز یا مقدار حساس را کپی می‌کند، برنامه بعد از مدت کوتاه clipboard را پاک می‌کند؛ البته فقط اگر مقدار clipboard هنوز همان مقدار کپی‌شده باشد.

فایل مرتبط:

- `src/utils/clipboard.ts`

### قفل خودکار

برنامه بعد از inactivity یا hidden شدن tab، vault را lock می‌کند و state حساس شامل رمز مستر، آیتم‌های رمزگشایی‌شده و TOTP را از حافظه React پاک می‌کند.

فایل مرتبط:

- `src/App.tsx`

## Google Drive Sync

برنامه از OAuth سمت کلاینت برای اتصال به Google Drive استفاده می‌کند. بعد از اتصال، فایل `vault.enc` در Drive کاربر ایجاد یا به‌روزرسانی می‌شود.

قابلیت‌ها:

- upload خودکار بعد از تغییرات vault
- sync دستی از بخش تنظیمات
- download vault از صفحه ورود یا تنظیمات
- حذف فایل ابری هنگام reset کامل، اگر Google Drive وصل باشد

محدودیت فعلی: برنامه همچنان از OAuth implicit flow استفاده می‌کند. برای نسخه production بهتر است Authorization Code + PKCE پیاده‌سازی شود.

## Import و Export

### Import CSV

از صفحه تنظیمات می‌توان فایل CSV را import کرد. برنامه ستون‌هایی مثل title/name، username، password، url، notes و totp را تشخیص می‌دهد.

فایل مرتبط:

- `src/components/CsvImporter.tsx`

### Export

دو نوع خروجی وجود دارد:

- `Encrypted JSON`: نسخه پشتیبان رمزنگاری‌شده از payload فعلی
- `Decrypted CSV`: خروجی plaintext برای انتقال دستی، با هشدار امنیتی

هشدار: فایل CSV رمزگشایی‌شده امن نیست و باید فقط روی سیستم امن و برای مدت کوتاه نگه داشته شود.

## اجرای پروژه

نیازمندی‌ها:

- Node.js
- npm

نصب وابستگی‌ها:

```bash
npm install
```

اجرای محیط توسعه:

```bash
npm run dev
```

بررسی TypeScript:

```bash
npm run lint
```

ساخت production وب:

```bash
npm run build
```

اجرای نسخه دسکتاپ در محیط توسعه:

```bash
npm run desktop:dev
```

ساخت نسخه قابل نصب ویندوز:

```bash
npm run desktop:dist
```

بررسی کامل قبل از انتشار:

```bash
npm run release:check
```

خروجی installer داخل پوشه `release` ساخته می‌شود. برای ساخت نسخه unpacked بدون installer هم می‌توانید اجرا کنید:

```bash
npm run desktop:pack
```

پیش‌نمایش build وب:

```bash
npm run preview
```

## نسخه ویندوزی

این پروژه با Electron به نرم‌افزار ویندوزی تبدیل شده است. فایل ورودی Electron در `electron/main.cjs` قرار دارد و خروجی React/Vite را از پوشه `dist` داخل یک پنجره دسکتاپ لود می‌کند.

خروجی installer استاندارد نسخه فعلی پس از build در این مسیر ساخته می‌شود:

```text
release/Kelidban-Password-Manager-Setup-1.0.0.exe
```

نسخه دسکتاپ شامل آیکون اختصاصی `kelidban.ico`، صفحه About/Version، shortcut ویندوز و تنظیمات NSIS برای نصب تعاملی است.

نکته Google Drive: چون نسخه فعلی sync هنوز از OAuth implicit flow استفاده می‌کند، برای نسخه دسکتاپ ممکن است لازم باشد در Google Cloud Console مقدار redirect مجاز را برای محیط اجرای برنامه تنظیم کنید. مسیر پیشنهادی production همچنان مهاجرت به Authorization Code + PKCE است.

## وضعیت اعتبارسنجی فعلی

آخرین بررسی انجام‌شده:

```bash
npm run lint
npm run build
npm run desktop:dist
```

همه دستورها موفق اجرا شدند و installer نسخه `1.0.0` ساخته شد.

## محدودیت‌ها و کارهای پیشنهادی بعدی

- جایگزینی PBKDF2 با Argon2id یا افزایش/کالیبره‌کردن iterationها برای امنیت بهتر
- مهاجرت OAuth به Authorization Code + PKCE
- افزودن import مستقیم برای backup رمزنگاری‌شده JSON
- بهبود parser CSV برای پشتیبانی کامل از multiline quoted fields
- افزودن تست‌های automated برای crypto، TOTP، CSV import و cloud sync
