# Security Policy

## Project Scope

Kelidban Password Manager is a personal/portfolio password manager by MOHAMAD AMIN SERAJ (Vidson313). It is designed around a zero-knowledge model: sensitive vault data is encrypted on the client before it is stored locally or synced to Google Drive.

This project is suitable as a professional portfolio project and for careful personal experimentation. Before organizational or high-risk production use, an independent security audit is recommended.

## Security Model

- The master password is not stored by the app.
- Vault data is serialized locally and encrypted before persistence.
- Encryption uses AES-GCM with a 256-bit derived key.
- Key derivation currently uses PBKDF2-SHA256 with per-encryption random salt.
- IV values are randomly generated for each encryption.
- Google Drive sync uploads only the encrypted `vault.enc` payload.
- Decrypted vault state lives only in application memory while the vault is unlocked.
- Clipboard values are cleared after a short delay when the copied value is still present.

## Known Limitations

- PBKDF2 is currently used instead of Argon2id. Argon2id is recommended for a future hardening release.
- Google Drive OAuth currently uses implicit flow. Authorization Code + PKCE is recommended for a future production-grade release.
- The Windows installer is not currently distributed with a commercial code-signing certificate, so Windows SmartScreen may show a warning for first-time installs.
- Decrypted CSV export intentionally produces plaintext data for migration. Users should delete exported CSV files immediately after use.
- This project has not yet undergone an independent third-party security audit.

## Safe Usage Guidance

- Use a long, unique master password.
- Keep encrypted backups in a safe place.
- Do not share decrypted CSV exports.
- Test restore/import flows before relying on any password manager as the only copy of your data.
- Prefer GitHub Releases or a trusted source when downloading installers.

## Reporting Issues

For security issues or responsible disclosure, contact the maintainer:

- Maintainer: MOHAMAD AMIN SERAJ (Vidson313)
- GitHub: https://github.com/vidson313
- Telegram: @Mhmd_seraj
