# Developer Guide — Besswave User Context System

## What This System Does

The Besswave User Context System gives the AI a persistent understanding of each user — their role, goals, connected data systems, recurring decisions, and communication preferences. Instead of answering every query from scratch, the AI starts every conversation already knowing who it's talking to.

The integration is simple: one file (`CONTEXT_SUMMARY.md`) gets prepended to the system prompt on every query. Everything else — the individual context files — is source material for generating and maintaining that summary.

---

## The Before/After Difference

This is the product. Show this to anyone who doesn't immediately understand why the context system matters.

**Query:** "How are we doing on open IT tickets?"

**Without context:**
> I don't have access to your ticketing data. Could you tell me which system you use? And what metrics would you like to see — volume, resolution time, open count?

**With context (Sarah Chen's CONTEXT_SUMMARY.md loaded):**
> Your current open ticket SLA is 3.8 days against your Q2 target of 2.5 days — you're off track by 1.3 days. ServiceNow shows 147 open P2+ tickets, up 23% from last month. The Portland site accounts for 31 of those, which is disproportionate to its headcount ratio. Want me to break that down by category or team member?

The second answer is useful immediately. It knows the target, the current state, the anomaly, and what she might want next. That's the context system working.

---

## How to Integrate CONTEXT_SUMMARY.md Into Besswave

### Step 1: Load the context file

On each query, load the user's `CONTEXT_SUMMARY.md` and prepend it to the system prompt before the user's question arrives.

```
[System Prompt]
You are a Besswave operations intelligence assistant. The following context describes the user you are assisting:

---
{CONTEXT_SUMMARY.md contents}
---

Answer the user's question using the connected data systems listed above. When the user refers to "we" or "our," treat it as referring to their organization. Apply their stated preferences for format and tone.

[User Query]
{user's question}
```

### Step 2: Graceful degradation for incomplete context

Not all users will have completed onboarding. Handle missing context cleanly:

| Context State | Behavior |
|--------------|----------|
| Full CONTEXT_SUMMARY.md present | Load and inject — full personalization |
| Partial (stub only) | Load stub, answer what you can, prompt completion: "You can get more personalized answers by completing your onboarding setup." |
| No context file | Answer generically; prompt onboarding: "Set up your profile to get answers tailored to your role and systems." |

### Step 3: Keep the context current

Context files become stale. Build a refresh trigger:
- Quarterly prompt to re-run the onboarding interview
- Trigger on connected system changes (new integration added)
- Manual refresh available at any time from user settings

---

## File Ownership Model

Different files in the context system have different owners and update patterns:

| File | Authored By | How It's Generated | Update Frequency |
|------|-------------|-------------------|------------------|
| `USER_IDENTITY.md` | User | Onboarding interview | Once; updated when role changes |
| `OPERATIONAL_MISSION.md` | User | Onboarding interview | Annual or when strategic priorities shift |
| `GOALS.md` | User (AI-assisted) | Interview with structured prompts | Quarterly |
| `DATA_LANDSCAPE.md` | System | Populated from connected integrations; user reviews | Auto-updated on integration changes |
| `DECISION_CONTEXT.md` | User (AI-assisted) | Interview — "What are the 5 decisions you make most often?" | Annual or when role changes |
| `FRICTION_POINTS.md` | User | Onboarding — "What used to take too long before Besswave?" | Once; updated as workflows change |
| `PREFERENCES.md` | User | Preferences interview + in-session learning | Ongoing; user can edit at any time |
| `CONTEXT_SUMMARY.md` | AI (synthesized) | Auto-generated from above files | Regenerated whenever source files change |

---

## Token Budget

Every token in CONTEXT_SUMMARY.md is loaded on every query. Keep it lean.

| File | Typical Token Count | Notes |
|------|--------------------|--------------------|
| `CONTEXT_SUMMARY.md` | 350–500 tokens | The only file injected per query. Keep under 500. |
| `USER_IDENTITY.md` | 200–400 tokens | Source file — not injected directly |
| `GOALS.md` | 400–600 tokens | Source file — summarized in CONTEXT_SUMMARY |
| `DATA_LANDSCAPE.md` | 600–1000 tokens | Source file — key systems extracted to CONTEXT_SUMMARY |
| `DECISION_CONTEXT.md` | 400–700 tokens | Source file — decision patterns summarized |
| `FRICTION_POINTS.md` | 300–500 tokens | Source file — sets "what good looks like" for the AI |
| `PREFERENCES.md` | 300–500 tokens | Source file — distilled into CONTEXT_SUMMARY preference block |
| **Total source files** | **~2200–3700 tokens** | Only read during summary regeneration |

**Tip:** The AI synthesizing `CONTEXT_SUMMARY.md` should extract the most operationally useful facts from each source file, not copy them verbatim. A well-synthesized summary provides ~80% of the personalization value at 15% of the token cost.

---

## The Onboarding Interview Flow

The context files are generated by a structured onboarding conversation. Here's the recommended sequence and the key questions at each step:

### Phase 1: Identity (5 minutes)
- "What's your title and role? What does your team own?"
- "Who do you report to? Who reports to you?"
- "What are the main enterprise systems you work in every day?"

**Generates:** `USER_IDENTITY.md`

### Phase 2: Strategic Priorities (5 minutes)
- "What are the 2–4 things that matter most to your team this year?"
- "What would a great year look like for your role?"

**Generates:** `OPERATIONAL_MISSION.md`

### Phase 3: Goals and KPIs (10 minutes)
- "What are your top 3–5 goals for this year with measurable targets?"
- "For each goal: what's the target, the deadline, and where do you track it?"
- "What have you already completed or deferred?"

**Generates:** `GOALS.md`

### Phase 4: Data Landscape (5 minutes — or auto-populated from integrations)
- "Which of your connected systems do you use most for operational decisions?"
- "What questions do you most often ask about each system?"

**Generates:** `DATA_LANDSCAPE.md` — or Besswave auto-populates from the integration list and asks the user to confirm/annotate.

### Phase 5: Decisions and Friction (10 minutes)
- "What are the 5 operational decisions you make most often? What data do you use to make them?"
- "What was the most painful data-gathering workflow before Besswave? What did it take to do it, and how often?"

**Generates:** `DECISION_CONTEXT.md`, `FRICTION_POINTS.md`

### Phase 6: Preferences (5 minutes)
- "How do you prefer to get your answers — executive summary or operational detail?"
- "Do you prefer tables or prose for comparisons?"
- "Are there terms or abbreviations Besswave should use consistently?"
- "Are there things you don't want in every answer (methodology, caveats, etc.)?"

**Generates:** `PREFERENCES.md`

### Phase 7: AI generates CONTEXT_SUMMARY.md automatically from all above files.

Total onboarding time: approximately 35–40 minutes. Can be split across sessions.

---

## Extending to New Users

Each new user gets a folder under `personas/{username}/`. The onboarding interview populates their files; the AI generates their `CONTEXT_SUMMARY.md`. No code changes required — add a new folder and run the interview flow.

For users from the same organization, they share `DATA_LANDSCAPE.md` content (same systems) but differ on goals, decisions, preferences, and role. The context system handles this naturally — different summaries, same underlying integrations.

---

## What to Build Next

This demo shows the pattern. To deploy it in production, you'll want to build:

1. **Onboarding interview UI** — A guided conversation that captures the above questions and writes the context files. Can be chat-based (the AI asks questions) or form-based.
2. **CONTEXT_SUMMARY.md regenerator** — A function that reads all source files and synthesizes a fresh summary whenever a source file changes.
3. **Context file storage** — Secure per-user storage for context files. These contain sensitive operational information (goals, pain points, system names); store accordingly.
4. **Refresh triggers** — Quarterly prompts to review and update goals; automatic re-generation when integrations change.
5. **Preference learning** — In-session feedback that updates `PREFERENCES.md` when a user says "less detail please" or "give me a table instead."
