#!/usr/bin/env bun
/**
 * Besswave Onboarding Demo
 * An AI-driven interview that builds operational context in ~7 minutes.
 * Usage: bun run demo.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import { createInterface, type Interface } from "readline";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// ── ANSI colors ────────────────────────────────────────────────────────────────

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  blue: "\x1b[94m",
  cyan: "\x1b[96m",
  green: "\x1b[92m",
  yellow: "\x1b[93m",
  magenta: "\x1b[95m",
  white: "\x1b[97m",
  red: "\x1b[91m",
} as const;

// ── Interview phases ───────────────────────────────────────────────────────────

const PHASES = [
  {
    name: "IDENTITY",
    icon: "◈",
    questions: [
      {
        key: "identity_role",
        q: "What's your name, title, and company?",
        hint: 'e.g. "Sarah Chen, VP of Operations at MidWest Distribution Co"',
      },
      {
        key: "identity_team",
        q: "Who do you report to, and who are your direct reports?",
        hint: 'e.g. "I report to the COO. I manage an IT Manager, Facilities Manager, and Process Lead"',
      },
      {
        key: "identity_systems",
        q: "What enterprise systems do you work in daily? Name them.",
        hint: 'e.g. "ServiceNow for tickets, Salesforce for pipeline, Intune for devices, NetSuite for financials"',
      },
    ],
  },
  {
    name: "PRIORITIES",
    icon: "◉",
    questions: [
      {
        key: "priorities",
        q: "What are the 2–3 big-picture priorities for your team this year?",
        hint: 'e.g. "SLA reduction, Chicago device refresh, taking 8% out of operational costs"',
      },
    ],
  },
  {
    name: "GOALS",
    icon: "◎",
    questions: [
      {
        key: "goal_1",
        q: "Your most important measurable goal right now — what's the target and deadline?",
        hint: 'e.g. "Reduce ticket resolution SLA from 4.2 to 2.5 days by September 30"',
      },
      {
        key: "goal_2",
        q: "One more active goal you're tracking?",
        hint: 'e.g. "Complete Chicago device refresh — 85 devices — by June 30"',
      },
      {
        key: "goals_done",
        q: "Any wins you've already completed this year worth noting?",
        hint: 'e.g. "Migrated to ServiceNow in March, renewed facilities contract at 6% savings"',
      },
    ],
  },
  {
    name: "DECISIONS",
    icon: "◇",
    questions: [
      {
        key: "decisions",
        q: "What are the 2–3 operational decisions you make most often? What data drives each one?",
        hint: 'e.g. "Ticket escalation — I check category, site, and SLA age in ServiceNow. Capacity planning — I read the Salesforce pipeline to see what\'s about to close"',
      },
    ],
  },
  {
    name: "FRICTION",
    icon: "◐",
    questions: [
      {
        key: "friction",
        q: "What was the most painful data-gathering workflow before Besswave? Describe the old process and what it cost you.",
        hint: 'e.g. "Weekly SLA report: export from ServiceNow, clean in Excel, compare manually — 90 minutes every Monday, frequently wrong"',
      },
    ],
  },
  {
    name: "PREFERENCES",
    icon: "◑",
    questions: [
      {
        key: "preferences",
        q: "How do you want answers delivered? What should Besswave always or never do?",
        hint: 'e.g. "Lead with the number, flag anomalies first, use system names, skip methodology unless I ask"',
      },
    ],
  },
] as const;

type QuestionKey = (typeof PHASES)[number]["questions"][number]["key"];

// ── Helpers ────────────────────────────────────────────────────────────────────

function prompt(rl: Interface, text: string): Promise<string> {
  return new Promise((resolve) => rl.question(text, resolve));
}

function spinner(message: string): () => void {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  const id = setInterval(() => {
    process.stdout.write(
      `\r  ${C.cyan}${frames[i++ % frames.length]}${C.reset}  ${C.dim}${message}${C.reset}   `
    );
  }, 80);
  return () => {
    clearInterval(id);
    process.stdout.write("\r" + " ".repeat(message.length + 12) + "\r");
  };
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

function extractName(identityAnswer: string): { full: string; dir: string } {
  const match = identityAnswer.match(/^([A-Za-z][\w'-]*)(?:\s+([A-Za-z][\w'-]*))?/);
  const full = match
    ? [match[1], match[2]].filter(Boolean).join(" ")
    : "Your Profile";
  return { full, dir: slugify(full) };
}

// ── Interview step ─────────────────────────────────────────────────────────────

async function askQuestion(
  client: Anthropic,
  rl: Interface,
  question: string,
  hint: string
): Promise<string> {
  console.log(`\n  ${C.blue}${C.bold}${question}${C.reset}`);
  console.log(`  ${C.dim}${hint}${C.reset}\n`);

  const answer = await prompt(rl, `  ${C.cyan}▸ ${C.reset}`);
  if (!answer.trim()) return answer;

  // Stream a one-sentence acknowledgment (haiku — fast)
  process.stdout.write(`\n  ${C.dim}`);
  const stream = client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 65,
    system:
      "You're conducting a Besswave product onboarding. The user just answered one question. Reply with exactly ONE sentence that shows you heard them specifically — no filler openings like 'Great!' or 'Got it!' or 'That makes sense'. Be concrete. End naturally.",
    messages: [{ role: "user", content: `They answered: "${answer}"` }],
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      process.stdout.write(event.delta.text);
    }
  }
  await stream.finalMessage();

  process.stdout.write(`${C.reset}\n`);
  return answer;
}

// ── Synthesis ──────────────────────────────────────────────────────────────────

async function synthesize(
  client: Anthropic,
  answers: Record<string, string>
): Promise<Record<string, string>> {
  const answersBlock = Object.entries(answers)
    .map(([k, v]) => `[${k}]: ${v}`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 6000,
    messages: [
      {
        role: "user",
        content: `You are building a Besswave user context system from an onboarding interview.

Interview answers:
${answersBlock}

Generate 8 markdown files. Use first-person voice as if the user wrote them. Be specific — use actual names, numbers, and systems mentioned. Do not invent details not in the answers; infer reasonable specifics only where the answer implies them.

Return ONLY a JSON object (no markdown fences, no preamble) with filename as key and full markdown content as value:

{
  "USER_IDENTITY.md": "# User Identity...",
  "OPERATIONAL_MISSION.md": "# Operational Mission...",
  "GOALS.md": "# Goals...",
  "DATA_LANDSCAPE.md": "# Data Landscape...",
  "DECISION_CONTEXT.md": "# Decision Context...",
  "FRICTION_POINTS.md": "# Friction Points...",
  "PREFERENCES.md": "# Preferences...",
  "CONTEXT_SUMMARY.md": "..."
}

File requirements:
- USER_IDENTITY.md: Role, company details, team, reporting line, systems table
- OPERATIONAL_MISSION.md: 2-4 strategic priorities as named sections with explanatory prose
- GOALS.md: Active goals labeled G0/G1/etc with targets, KPIs, current status. Include Deferred and Completed sections
- DATA_LANDSCAPE.md: Each connected system as its own section — what it is, what data it holds, what questions it can answer
- DECISION_CONTEXT.md: Each recurring decision as a numbered section — when, what I'm deciding, what data drives it, what I need to see
- FRICTION_POINTS.md: Pre-Besswave pain points — the old workflow and its cost
- PREFERENCES.md: Output format rules, language rules, alert preferences, detail level guidance
- CONTEXT_SUMMARY.md: CRITICAL — 25-35 lines ONLY. Must start exactly with: "You are assisting [Full Name], [Title] at [Company]." Then: current goals with KPI numbers, connected systems list, how to answer. This is injected into every Besswave query — make it dense and actionable.`,
      },
    ],
  });

  const raw =
    response.content[0].type === "text" ? response.content[0].text.trim() : "";

  // Strip markdown code fences if present
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Find the JSON object even if wrapped in text
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      "Synthesis output was not valid JSON.\n\nRaw response:\n" + raw.slice(0, 400)
    );
  }

  return JSON.parse(jsonMatch[0]) as Record<string, string>;
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      `\n  ${C.red}${C.bold}Missing ANTHROPIC_API_KEY${C.reset}\n` +
        `  ${C.dim}Set it with:${C.reset}  export ANTHROPIC_API_KEY=sk-ant-...\n`
    );
    process.exit(1);
  }

  const client = new Anthropic();
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  // Banner
  console.clear();
  console.log(`
  ${C.blue}${C.bold}┌──────────────────────────────────────────────────────┐
  │                                                      │
  │   ◈ BESSWAVE   Operational Context Setup             │
  │                                                      │
  └──────────────────────────────────────────────────────┘${C.reset}

  ${C.white}I'll ask you ${C.bold}10 focused questions${C.reset}${C.white}.${C.reset}
  ${C.white}In about ${C.bold}7 minutes${C.reset}${C.white}, I'll build an operational profile that makes${C.reset}
  ${C.white}every Besswave answer feel like it already knows you.${C.reset}

  ${C.dim}Press Enter to begin.${C.reset}
`);

  await prompt(rl, "");

  const answers: Record<string, string> = {};
  const totalPhases = PHASES.length;

  for (let pi = 0; pi < PHASES.length; pi++) {
    const phase = PHASES[pi];
    const bar = "▓".repeat(pi) + "░".repeat(totalPhases - pi);

    console.log(
      `\n  ${C.dim}${bar}${C.reset}  ${C.yellow}${C.bold}${phase.icon}  ${phase.name}${C.reset}`
    );

    for (const q of phase.questions) {
      answers[q.key] = await askQuestion(client, rl, q.q, q.hint);
    }
  }

  // Synthesis
  console.log(
    `\n\n  ${C.dim}${"▓".repeat(totalPhases)}${C.reset}  ${C.green}${C.bold}◈  COMPLETE${C.reset}\n`
  );

  const stopSpinner = spinner(
    "Analyzing your answers and building context files…"
  );
  let files: Record<string, string>;

  try {
    files = await synthesize(client, answers);
  } catch (err) {
    stopSpinner();
    console.error(
      `\n  ${C.red}Synthesis failed: ${(err as Error).message}${C.reset}\n`
    );
    rl.close();
    process.exit(1);
  }

  stopSpinner();

  // Write output files
  const { full: userName, dir: dirName } = extractName(
    answers.identity_role ?? "Profile"
  );
  const outputDir = join(import.meta.dir, "output", dirName);
  mkdirSync(outputDir, { recursive: true });

  const today = new Date().toISOString().split("T")[0];
  for (const [filename, content] of Object.entries(files)) {
    writeFileSync(
      join(outputDir, filename),
      content + `\n\n---\n*Generated by Besswave onboarding · ${today}*\n`
    );
  }

  // Show result
  console.log(
    `  ${C.green}${C.bold}✓  Context files built for ${userName}${C.reset}`
  );
  console.log(
    `  ${C.dim}Saved to: output/${dirName}/  (${Object.keys(files).length} files)${C.reset}\n`
  );

  // Show what was written
  for (const filename of Object.keys(files)) {
    const lineCount = files[filename].split("\n").length;
    console.log(
      `  ${C.dim}  ${filename.padEnd(28)} ${lineCount} lines${C.reset}`
    );
  }

  // Money shot: display the context summary
  console.log(`
  ${C.yellow}${C.bold}┌────────────────────────────────────────────────────┐
  │   CONTEXT SUMMARY — loaded into every query       │
  └────────────────────────────────────────────────────┘${C.reset}
`);

  const summary = files["CONTEXT_SUMMARY.md"] ?? "(not generated)";
  for (const line of summary.split("\n")) {
    console.log(`  ${line}`);
  }

  console.log(`
  ${C.dim}──────────────────────────────────────────────────────${C.reset}
  ${C.dim}This summary (~400 tokens) prepends every Besswave query.${C.reset}
  ${C.dim}Full context files: ${C.reset}${C.cyan}output/${dirName}/${C.reset}
  ${C.dim}Edit any file to refine, then re-run to regenerate the summary.${C.reset}
`);

  rl.close();
}

main().catch((err: Error) => {
  console.error(`\n  ${C.red}${err.message}${C.reset}\n`);
  process.exit(1);
});
