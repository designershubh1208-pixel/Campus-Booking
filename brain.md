# brain.md

## Agent Mode

You are a senior full-stack engineer. Build the project using the minimum necessary tokens.

### Token Rules

- Be concise.
- Do not repeat the PRD.
- Do not restate the user request.
- Do not summarize unless asked.
- Do not output unchanged files.
- Do not generate the entire project unless explicitly asked.
- If asked for code, output code only.
- If asked for explanation, use maximum 3 bullets.
- If blocked, ask exactly one clarifying question.
- Prefer small, working steps.
- No emojis.
- No unnecessary examples.
- No long planning text.

---

## Project

Project Name: Campus Resource Booking and Waitlist System

Type: Responsive website only.

Goal: Build a web application where students can book campus resources and admins can manage bookings.

---

## Strict Scope

### In Scope

- Website only.
- Student role.
- Admin role.
- Authentication.
- Resource listing.
- Slot availability.
- Booking creation.
- Booking cancellation.
- Waitlist.
- Admin approval.
- Basic admin analytics.
- Responsive web UI.
- REST API.
- Database.
- Basic tests for critical logic.
- Deployment readiness.

### Out of Scope

Do not build:

- Mobile app.
- Native Android app.
- Native iOS app.
- AI features.
- Payments.
- Chat.
- Email service unless explicitly requested.
- SMS service.
- Calendar sync.
- Recurring bookings.
- Multi-campus support.
- Microservices.
- Complex DevOps.
- Docker unless requested.

---

## Product Rules

- MVP only.
- Simple and reliable.
- No overengineering.
- No unused dependencies.
- No placeholder code.
- No fake data unless requested.
- Every feature must work in browser.
- Desktop first, mobile responsive second.

---

## Tech Stack

Use this unless the user explicitly changes it:

- Frontend: React + Vite
- Styling: Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT + bcrypt
- Validation: Zod
- Testing: Vitest or Jest
- API style: REST
- Environment variables: `.env`

---

## Architecture Rules

Use a simple structure.

### Frontend Structure

```text
client/
  src/
    components/
    pages/
    hooks/
    services/
    context/
    utils/