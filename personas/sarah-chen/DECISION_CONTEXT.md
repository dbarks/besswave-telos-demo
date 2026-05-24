# Decision Context — Sarah Chen

> The recurring operational decisions I make, what data drives each one, and what "good information to make this decision" looks like.

## Decision 1: Ticket Escalation

**When:** Daily, sometimes multiple times per day.
**What I'm deciding:** Whether a P2 ticket should be elevated to P1, whether an incident is isolated or systemic, and whether James Park needs to pull additional resources.
**Data that drives it:** ServiceNow — ticket category, impacted user count, site, open duration, resolution history for similar issues.
**What I need:** The current open P1/P2 ticket count, whether any single category or site is spiking, and whether any ticket has been open past SLA. I need anomalies flagged without me having to ask.

---

## Decision 2: Operational Capacity Against Sales Pipeline

**When:** Monthly, or immediately when Sales flags a significant deal closing.
**What I'm deciding:** Whether our facilities, staffing, and fulfillment capacity can absorb what the sales pipeline is about to close. If not, I need to surface the constraint to Linda before it becomes a crisis.
**Data that drives it:** Salesforce pipeline (close date, deal size, account type) + NetSuite inventory and staffing capacity.
**What I need:** A list of deals closing in the next 60 days, their operational implications (warehouse space, staffing, fulfillment capacity), and a flag if any deal's requirements exceed current operational capacity.

---

## Decision 3: Staffing Adequacy

**When:** Monthly review, or triggered when SLAs slip.
**What I'm deciding:** Whether a team is genuinely understaffed or whether work is being misrouted, misclassified, or inefficiently handled.
**Data that drives it:** ServiceNow — tickets per agent per day, resolution time distribution, ticket category breakdown. NetSuite — headcount cost vs. prior periods.
**What I need:** Workload distribution by team member, average handle time by category, and volume trend. I can diagnose from this whether the problem is capacity or process.

---

## Decision 4: Facilities Maintenance Prioritization

**When:** Weekly facilities review.
**What I'm deciding:** Which open maintenance items are safety/compliance risks vs. cosmetic/deferrable, and whether Renata's team has the contractor capacity to close the highest-priority items this week.
**Data that drives it:** ServiceNow facilities queue — item age, category (safety, compliance, comfort, cosmetic), priority, assigned contractor.
**What I need:** Open items by site and category, any items past 30 days without progress, and the current count toward the 20-item target.

---

## Decision 5: Device Lifecycle

**When:** Quarterly for planning; ad hoc when Intune surfaces a compliance failure wave.
**What I'm deciding:** Whether to repair an underperforming device, replace it now, or defer it to the next refresh cycle. For the Chicago refresh, whether we're on track for the June 30 deadline.
**Data that drives it:** Intune — device age, compliance status, ticket history for that device. NetSuite — procurement timeline and budget.
**What I need:** The count of devices by age bracket and compliance status at Chicago; how many are pending deployment vs. received; and whether the procurement timeline puts the June 30 deadline at risk.

---

## Decision 6: Vendor Contract Renewal

**When:** Triggered by NetSuite contract renewal dates, typically 90 days ahead.
**What I'm deciding:** Whether to renew, renegotiate, or replace. Informed by whether the vendor has been performing (facilities contracts) or whether the software is still meeting our needs (IT contracts).
**Data that drives it:** NetSuite contract records + ServiceNow for any vendor-related incident patterns.
**What I need:** Upcoming renewals in the next 90 days, current contract terms, and any open service issues tied to that vendor.

---
*Last updated: 2026-05-24*
