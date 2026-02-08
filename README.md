# Subscription Modal App

## Setup
\`\`\`bash
npm install
npm run dev
\`\`\`

## Running Tests
\`\`\`bash
npm test
\`\`\`

## Architecture Decisions

**Framework:** Vite + React + TypeScript
- Fast dev experience, modern tooling

**Validation:** React Hook Form + Zod
- Type-safe validation, minimal boilerplate

**Styling:** Tailwind CSS
- Rapid prototyping, responsive by default

**Testing:** Vitest + React Testing Library
- Fast tests, familiar API

## What I'd Improve With More Time
- [ ] Fix state issues - back button and refreshing pages is funky
- [ ] Update responsive design - checkout page breaks on mobile
- [ ] Update some form niceities - auto format CC input, etc
- [ ] Implement actual payment provider (Stripe Elements)
- [ ] Add loading skeleton states


## TODO Checklist:
- [x] npm run build succeeds
- [x] npm test passes
- [x] No console errors
- [x] TypeScript has no errors
- [x] Git history is clean
- [ ] Responsive on mobile
- [x] Works in Chrome/Firefox/Safari
- [x] Forms validate correctly
- [ ] Loading/error states work
- [x] README has clear instructions