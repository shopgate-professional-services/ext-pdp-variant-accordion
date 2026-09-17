# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-09-17
### Changed
- adopted the new engage theme
- migrated all styling from glamor to `@shopgate/engage/styles` (`makeStyles`/`useStyles`)
- `@shopgate/engage` is now a `7.32.0-beta.20` peer dependency (drops PWA 6 support)
- modernized the frontend toolchain (removed the legacy `.babelrc`, glamor and `classnames`; `react-transition-group` is now a direct dependency)

## 1.6.0 - 2025-07-17
### Added
- Added placeholder that's visible till variant data is fetched. Can be configured via `placeholderLines` setting. When set to `0` the placeholder will never be shown.

## 1.5.1 - 2025-06-05
### Fixed
- Fixed an issue that allowed horizontal scrolling on PDP beyond the screen’s width limit

## [1.5.0] - 2025-04-10
### Added
- Improved accessibility for screen readers
