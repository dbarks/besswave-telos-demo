# Running the Besswave Onboarding Demo

## What it does

An AI-driven CLI interview that builds a full operational context profile in ~7 minutes. It asks 10 focused questions across 6 phases, acknowledges each answer conversationally, then synthesizes all your context files automatically.

## Prerequisites

- [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
- An Anthropic API key (get one at console.anthropic.com)

## Setup (one time)

```bash
cd ~/besswave-telos-demo
bun install
```

## Run

```bash
export ANTHROPIC_API_KEY=sk-ant-...
bun run demo
```

The demo validates Anthropic access before the interview starts. If the key is missing, invalid, or network access is blocked, it exits before asking questions and prints the setup problem to fix.

## What you'll see

1. A welcome screen — press Enter to start
2. Six phases of questions, with the AI acknowledging each answer
3. A spinner while context files are synthesized (~10 seconds)
4. The completed `CONTEXT_SUMMARY.md` displayed in the terminal

## Output

Your context files are saved to:
```
besswave-telos-demo/output/{your-name}/
├── USER_IDENTITY.md
├── OPERATIONAL_MISSION.md
├── GOALS.md
├── DATA_LANDSCAPE.md
├── DECISION_CONTEXT.md
├── FRICTION_POINTS.md
├── PREFERENCES.md
└── CONTEXT_SUMMARY.md    ← this is what loads into every query
```

## Showing the demo

To walk someone through it: run it yourself first so you know the flow, then let them answer live. Total time with typing: 6–8 minutes. The `CONTEXT_SUMMARY.md` that appears at the end is the moment — it shows exactly what Besswave's AI will know about them from this point forward.

## Resetting for another person

Each run creates a new output folder named after the person (`output/sarah-chen/`, `output/alex-rivera/`, etc.). Nothing gets overwritten unless two people have the same name.

## Troubleshooting

If the demo exits with `Anthropic setup failed`, re-export a valid API key from console.anthropic.com:

```bash
export ANTHROPIC_API_KEY=sk-ant-your-real-key
bun run demo
```

The most common cause is an expired, placeholder, or copied-wrong key. The demo intentionally checks this before the first question so a live walkthrough does not fail after someone starts answering.
