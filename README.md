# Besswave User Context System

## What This Is

Besswave connects your enterprise systems and lets you ask natural-language questions about your operations. The more the AI understands about *you* — your role, your priorities, the systems you care about, how you think — the more useful every answer becomes.

This directory demonstrates a **user context system**: a small set of structured files that capture who each user is as an operator. The AI reads these files at query time, so it can respond as if it already knows you — your goals, your data landscape, your standards for a good answer.

This pattern is inspired by [Telos](https://github.com/danielmiessler/telos), a method for building rich context that helps AI systems understand the person behind the request.

---

## Why It Matters

Without context, every query starts from zero:

> **You:** How are we doing on open IT tickets?
>
> **Besswave:** I don't have access to your ticket data. Could you tell me which system you use, and what metrics you'd like to see?

With context, the AI already knows who you are and what you care about:

> **You:** How are we doing on open IT tickets?
>
> **Besswave:** Your current open ticket SLA is 3.8 days against your Q2 target of 2.5 days — you're off track. ServiceNow shows 147 open P2+ tickets, up 23% from last month. The Portland site accounts for 31 of those, which is disproportionate to its headcount. Want me to break that down by category?

The second answer is useful. The first is a dead end.

---

## File Structure

Each user has a folder under `personas/`. Inside, a set of context files captures their operational world:

| File | What It Contains | Who Authors It |
|------|-----------------|----------------|
| `USER_IDENTITY.md` | Role, company, team, reporting line, systems used | User (onboarding) |
| `OPERATIONAL_MISSION.md` | Strategic priorities — the 2–4 things that matter most this year | User (onboarding) |
| `GOALS.md` | Measurable goals with KPIs, targets, and deadlines | User (onboarding interview) |
| `DATA_LANDSCAPE.md` | Connected systems, what each holds, what questions it can answer | System-populated + user review |
| `DECISION_CONTEXT.md` | Recurring decisions the user makes and what data drives them | User (onboarding interview) |
| `FRICTION_POINTS.md` | Pre-Besswave pain points — the workflows this replaces | User (onboarding) |
| `PREFERENCES.md` | How to format answers — tables vs prose, tone, vocabulary | User (preferences interview) |
| `CONTEXT_SUMMARY.md` | **AI-synthesized 50-line summary for system-prompt injection** | Auto-generated |

The `CONTEXT_SUMMARY.md` is the integration point. All other files are source material for generating and refreshing it.

---

## How It Works

```
Onboarding interview
        ↓
User fills: IDENTITY, MISSION, GOALS, FRICTION_POINTS, PREFERENCES
        ↓
Besswave fills: DATA_LANDSCAPE (from connected integrations)
        ↓
AI synthesizes: CONTEXT_SUMMARY.md
        ↓
Every query: CONTEXT_SUMMARY.md is prepended to the system prompt
        ↓
AI answers as if it already knows the operator
```

---

## Demo Personas

This demo includes two personas:

| Persona | Role | Status |
|---------|------|--------|
| [Sarah Chen](personas/sarah-chen/) | VP of Operations, MidWest Distribution Co | Fully populated — shows a complete user |
| [Alex Rivera](personas/alex-rivera/) | IT Director, MidWest Distribution Co | Lightweight stub — shows the pattern scales to a second user |

Start with Sarah Chen to see how a fully populated context system looks and reads.

---

## Quick Start for Developers

1. Read `personas/sarah-chen/CONTEXT_SUMMARY.md` — this is what gets injected into every query for Sarah.
2. Compare it to the individual files that fed it — notice how it synthesizes without duplicating.
3. Read `DEVELOPER_GUIDE.md` to see how to include this in Besswave's system prompt and how to build the onboarding interview that generates these files.

The guide also covers token budget, refresh cadence, and how to handle users who haven't completed onboarding yet.
