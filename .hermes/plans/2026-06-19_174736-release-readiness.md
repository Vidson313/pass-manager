# Kelidban Professional Release Readiness Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** آماده‌سازی حرفه‌ای Kelidban Password Manager برای انتشار عمومی، نمونه‌کار رزومه، و ارائه قابل اعتماد به کارفرما/مخاطب فنی.

**Architecture:** پروژه یک React/Vite app است که با Electron و electron-builder به نرم‌افزار ویندوزی NSIS تبدیل شده. آماده‌سازی انتشار باید هم UI/UX محصول، هم امنیت، هم metadata، هم packaging، هم مستندات و هم مسیر توزیع/آپدیت را پوشش دهد.

**Tech Stack:** React 19, Vite 6, TypeScript, Tailwind CSS v4, Electron 42, electron-builder, WebCrypto, Google Drive REST API.

---

## Current Context / Assumptions

- مسیر پروژه: `C:\Users\vidson313\Desktop\pass-manager`
- installer فعلی ساخته می‌شود: `release/Kelidban Password Manager Setup 1.0.0.exe`
- آیکون multi-size موجود است: `kelidban.ico`
- Electron entry: `electron/main.cjs`
- config انتشار: `package.json` در بخش `build`
- وضعیت فعلی خوب است، اما برای رزومه حرفه‌ای باید چند لایه release polish اضافه شود.

---

## Phase 1: Product Identity و Metadata

### Task 1: تکمیل metadata پکیج

**Objective:** برنامه هنگام build، installer و معرفی پروژه اطلاعات حرفه‌ای داشته باشد.

**Files:**
- Modify: `package.json`

**Changes:**
- افزودن `author`
- افزودن `license`
- افزودن `homepage` اگر GitHub repo ساخته شد
- افزودن `repository` اگر GitHub repo ساخته شد
- اصلاح `description` به متن حرفه‌ای‌تر

**Suggested package fields:**

```json
{
  "description": "A zero-knowledge desktop password manager built with React, Electron, and WebCrypto.",
  "author": "Vidson313",
  "license": "MIT"
}
```

**Verify:**

```bash
npm run lint
npm run desktop:dist
```

Expected: build succeeds and electron-builder no longer warns about missing author.

---

### Task 2: اضافه‌کردن صفحه About / Version

**Objective:** برنامه مثل نرم‌افزار واقعی صفحه «درباره برنامه» داشته باشد؛ مناسب دمو و رزومه.

**Files:**
- Modify: `src/App.tsx`
- Optional Modify: `src/components/SettingsPanel.tsx`
- Optional Create: `src/components/AboutPanel.tsx`

**Content to show:**
- نام برنامه: Kelidban Password Manager
- نسخه: از `package.json` یا یک ثابت مثل `1.0.0`
- تکنولوژی‌ها: React, Electron, WebCrypto, AES-GCM, PBKDF2
- مدل امنیتی کوتاه: Zero-knowledge, local encryption
- مسیر داده‌ها/backup توضیح مختصر
- لینک GitHub/Portfolio اگر آماده شد

**Verification:**
- About از settings قابل باز شدن باشد.
- UI با theme فعلی هماهنگ باشد.
- هیچ داده حساس نمایش ندهد.

---

## Phase 2: Release Packaging حرفه‌ای

### Task 3: اضافه‌کردن App ID، shortcut name و artifact name استاندارد

**Objective:** فایل خروجی و installer نام مرتب و قابل ارائه داشته باشند.

**Files:**
- Modify: `package.json`

**Suggested config:**

```json
"build": {
  "appId": "ir.kelidban.passwordmanager",
  "productName": "Kelidban Password Manager",
  "artifactName": "Kelidban-Password-Manager-Setup-${version}.${ext}",
  "directories": {
    "output": "release"
  }
}
```

**Verify:**

```bash
npm run desktop:dist
```

Expected output:
- `release/Kelidban-Password-Manager-Setup-1.0.0.exe`

---

### Task 4: ساخت فایل‌های release notes و changelog

**Objective:** انتشار برنامه برای رزومه و GitHub حرفه‌ای به نظر برسد.

**Files:**
- Create: `CHANGELOG.md`
- Create: `docs/RELEASE_CHECKLIST.md`

**CHANGELOG initial content:**

```markdown
# Changelog

## 1.0.0 - Initial Release

- Added zero-knowledge encrypted vault with AES-GCM.
- Added master password based encryption with PBKDF2.
- Added login, card, secure note, folder, favorite and tag support.
- Added TOTP code generation.
- Added password generator with secure random generation.
- Added encrypted backup export and CSV import/export.
- Added optional Google Drive encrypted sync.
- Added Windows desktop packaging with Electron.
```

**Release checklist sections:**
- Version bumped
- `npm run lint` passed
- `npm run build` passed
- `npm run desktop:dist` passed
- installer smoke-tested
- icon verified
- README screenshots updated
- GitHub release notes written

---

## Phase 3: Security Hardening برای رزومه

### Task 5: اضافه‌کردن Security Notes واضح

**Objective:** چون password manager است، باید شفاف و حرفه‌ای درباره امنیت توضیح دهد.

**Files:**
- Create: `SECURITY.md`
- Modify: `README.md`

**SECURITY.md should include:**
- این پروژه برای نمونه‌کار و استفاده شخصی است.
- رمز مستر هیچ‌وقت ذخیره نمی‌شود.
- vault قبل از sync رمزنگاری می‌شود.
- CSV decrypted export خطرناک است.
- Google Drive فقط ciphertext دریافت می‌کند.
- محدودیت فعلی: PBKDF2 به جای Argon2id، OAuth implicit flow.
- نحوه گزارش آسیب‌پذیری.

**Verification:**
- متن ادعای بیش از حد نکند.
- با implementation فعلی تناقض نداشته باشد.

---

### Task 6: سخت‌سازی Electron security headers

**Objective:** کاهش ریسک‌های رایج Electron و نمایش بلوغ فنی.

**Files:**
- Modify: `electron/main.cjs`

**Ideas:**
- حفظ `contextIsolation: true`
- حفظ `nodeIntegration: false`
- حفظ `sandbox: true`
- اضافه‌کردن محدودیت `will-navigate`
- اضافه‌کردن `setWindowOpenHandler` که الان انجام شده
- بررسی CSP در `index.html` یا meta CSP در صورت سازگاری با Vite assets

**Warning:** CSP ممکن است Google Fonts یا inline styles را بشکند؛ با احتیاط و تست انجام شود.

**Verification:**

```bash
npm run build
npm run desktop:dist
```

Then smoke test app open, navigation, external links.

---

## Phase 4: Testing و Quality Gates

### Task 7: اضافه‌کردن تست برای utilityهای حساس

**Objective:** پروژه رزومه‌ای بدون تست برای password manager ناقص به نظر می‌رسد.

**Files:**
- Modify: `package.json`
- Create: `src/utils/*.test.ts` or `tests/*.test.ts`

**Suggested dependency:**
- `vitest`

**Test targets:**
- `src/utils/random.ts`: secure id format and uniqueness sanity
- `src/utils/totp.ts`: known TOTP vectors if possible
- `src/utils/crypto.ts`: encrypt/decrypt roundtrip and wrong password failure
- CSV parser/import behavior if accessible

**Commands:**

```bash
npm install --save-dev vitest jsdom
npm run test
```

**Verification:**
- tests pass locally
- README documents `npm run test`

---

### Task 8: pre-release quality script

**Objective:** یک دستور واحد برای آماده‌سازی انتشار داشته باشیم.

**Files:**
- Modify: `package.json`

**Suggested script:**

```json
"release:check": "npm run lint && npm run build && npm run desktop:dist"
```

If tests are added:

```json
"release:check": "npm run lint && npm run test && npm run build && npm run desktop:dist"
```

**Verify:**

```bash
npm run release:check
```

---

## Phase 5: Portfolio / Resume Presentation

### Task 9: README را به README رزومه‌ای تبدیل کن

**Objective:** README باید برای GitHub recruiter-friendly باشد، نه فقط راهنمای داخلی.

**Files:**
- Modify: `README.md`

**Recommended sections:**
- Hero title + short tagline
- Screenshots / GIF demo
- Key features
- Security model
- Tech stack
- Desktop release download
- Local development
- Build Windows installer
- Limitations / roadmap
- License

**Important:** حتماً screenshot از unlock screen، dashboard، item details و settings بگذار.

---

### Task 10: اضافه‌کردن screenshots

**Objective:** برای رزومه و GitHub، تصویر خیلی مهم‌تر از توضیح طولانی است.

**Files:**
- Create directory: `docs/screenshots/`
- Add images:
  - `unlock.png`
  - `dashboard.png`
  - `settings.png`
  - `generator.png`

**Verification:**
- تصاویر در README نمایش داده شوند.
- هیچ رمز واقعی یا داده حساس در screenshot نباشد.
- داده‌های نمایشی fake باشند.

---

## Phase 6: Auto Update Strategy

### Task 11: تصمیم‌گیری درباره auto-update

**Objective:** auto-update فقط وقتی ارزش دارد که کانال توزیع مشخص باشد.

**Options:**

1. **GitHub Releases + electron-updater**
   - مناسب‌ترین گزینه برای رزومه و انتشار عمومی.
   - نیاز به GitHub repo و release artifacts دارد.

2. **بدون auto-update در نسخه 1.0.0**
   - ساده‌تر و کم‌ریسک‌تر.
   - در README بنویسید update از GitHub Releases انجام می‌شود.

**Recommendation:**
برای نسخه 1.0.0 اول GitHub Release دستی منتشر شود. بعد از اینکه repo و release flow پایدار شد، auto-update اضافه شود.

---

### Task 12: اگر auto-update خواستی، electron-updater اضافه کن

**Objective:** برنامه بتواند نسخه جدید را از GitHub Releases چک کند.

**Files:**
- Modify: `package.json`
- Modify: `electron/main.cjs`
- Optional Create: `electron/updater.cjs`
- Optional Modify: UI to show update status

**Dependencies:**

```bash
npm install electron-updater
```

**Build config sample:**

```json
"publish": [
  {
    "provider": "github",
    "owner": "YOUR_GITHUB_USERNAME",
    "repo": "pass-manager"
  }
]
```

**Risk:**
- نیاز به GitHub release درست دارد.
- اگر signing و release flow کامل نباشد، تجربه کاربر بد می‌شود.

---

## Phase 7: Distribution Checklist

### Task 13: GitHub repository آماده کن

**Objective:** پروژه برای رزومه قابل نمایش و قابل دانلود باشد.

**Checklist:**
- `.env` و secrets در repo نباشند.
- `release/`, `dist/`, `node_modules/` در `.gitignore` باشند.
- README حرفه‌ای باشد.
- screenshots اضافه شده باشند.
- `LICENSE` موجود باشد.
- `SECURITY.md` و `CHANGELOG.md` موجود باشند.
- release artifact در GitHub Releases آپلود شود.

---

### Task 14: ساخت نسخه 1.0.0 release

**Objective:** یک نسخه قابل ارجاع برای رزومه داشته باشیم.

**Commands:**

```bash
npm run release:check
```

Then manually upload:
- `release/Kelidban-Password-Manager-Setup-1.0.0.exe`
- `CHANGELOG.md` content as release notes

**Recommended Git tag:**

```bash
git tag v1.0.0
git push origin v1.0.0
```

Only do this after reviewing git status and committing intended changes.

---

## Risks / Tradeoffs

- **Code signing:** بدون certificate، ویندوز ممکن است SmartScreen warning نشان دهد. برای رزومه قابل قبول است، ولی برای انتشار عمومی بزرگ بهتر است certificate تهیه شود.
- **Auto-update:** بدون release process پایدار، auto-update زودهنگام می‌تواند پیچیدگی و خطا اضافه کند.
- **Password manager security:** نباید ادعا شود که محصول کاملاً audited یا enterprise-grade است مگر audit واقعی انجام شده باشد.
- **OAuth implicit flow:** برای production حرفه‌ای بهتر است به Authorization Code + PKCE مهاجرت کند.
- **Decrypted CSV export:** قابلیت مفید است ولی باید هشدار امنیتی واضح داشته باشد.

---

## Recommended Immediate Next Steps

1. Add `author`, `artifactName`, `release:check`, `CHANGELOG.md`, `SECURITY.md`.
2. Add About / Version panel.
3. Add screenshots with fake data.
4. Polish README for GitHub portfolio.
5. Publish GitHub Release v1.0.0 manually.
6. Add tests and auto-update in v1.1.0.
