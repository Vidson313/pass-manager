# Changelog

All notable changes to Kelidban Password Manager are documented here.

## 1.0.0 - Initial Release

- Added zero-knowledge encrypted vault storage with AES-GCM.
- Added master password based encryption with PBKDF2-SHA256.
- Added support for logins, payment cards, secure notes, folders, tags, and favorites.
- Added TOTP code generation for two-factor authentication secrets.
- Added secure password generator using WebCrypto-backed random selection.
- Added automatic clipboard clearing for copied sensitive values.
- Added encrypted JSON backup export and CSV import/export workflows.
- Added optional Google Drive sync for encrypted `vault.enc` payloads.
- Added auto-lock behavior for inactivity and hidden-tab/session changes.
- Added Windows desktop packaging with Electron and NSIS.
- Added custom Windows icon and professional release metadata.
- Added About/Version panel for release and portfolio presentation.
