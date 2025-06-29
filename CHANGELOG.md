# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed
- Proper session handling during logout
  - Added explicit cookie clearing for Supabase session tokens
  - Improved sign out flow to clear local state before server-side session
  - No longer requires manual browser data clearing for re-login

### Changed
- Login page redirection logic
  - Added automatic redirect for already signed-in users
  - Improved session state management during login

### Added
- Cookie clearing utility
  - Added `clearSupabaseSession` function to properly clear Supabase session cookies
  - Added proper error handling for session management

## [0.1.0] - 2025-06-29

### Initial Setup
- Initial project setup with React, TypeScript, and Supabase
- Basic authentication system with multiple user roles
- Initial routing setup with protected routes
- Basic component structure

[Unreleased]: https://github.com/nixil/bolt-hombiz/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/nixil/bolt-hombiz/releases/tag/v0.1.0
