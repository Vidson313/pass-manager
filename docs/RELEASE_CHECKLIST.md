# Release Checklist

Use this checklist before publishing a Kelidban Password Manager release.

## Version

- [ ] Update `package.json` version.
- [ ] Update `src/appMeta.ts` version.
- [ ] Update `CHANGELOG.md` with release notes.
- [ ] Confirm installer artifact name contains the expected version.

## Quality Gates

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run `npm run desktop:dist`.
- [ ] Run `npm run release:check` before final packaging.

## Smoke Test

- [ ] Install the generated Windows setup file.
- [ ] Confirm the app opens with the custom Kelidban icon.
- [ ] Create a test vault with fake data.
- [ ] Lock and unlock the vault.
- [ ] Add a login, card, secure note, and folder.
- [ ] Test copy-to-clipboard and delayed clearing.
- [ ] Test encrypted backup export.
- [ ] Test CSV import using fake data.
- [ ] Open the About page and verify version/maintainer information.

## Documentation

- [ ] README describes features, security model, setup, and build commands.
- [ ] README contains screenshots with fake data only.
- [ ] `SECURITY.md` is current.
- [ ] `CHANGELOG.md` is current.
- [ ] GitHub Release notes match the changelog.

## Distribution

- [ ] `release/` is ignored by git.
- [ ] No `.env` file or secret is committed.
- [ ] Upload installer to GitHub Releases.
- [ ] Tag the release, for example `v1.0.0`.
- [ ] Mention Windows SmartScreen/code-signing limitation if distributing publicly.
