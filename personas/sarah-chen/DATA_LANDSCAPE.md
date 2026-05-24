# Data Landscape — Sarah Chen

> The systems connected to Besswave for my account, what they hold, and what questions each can answer.

## ServiceNow

**What it is:** IT service management platform. The primary system of record for all IT help desk activity, incidents, and facilities work orders.

**What data it holds:**
- All IT support tickets: creation date, category, priority, assigned team, resolution time, SLA status
- Incidents: P1/P2 incidents with timeline, impacted users, resolution notes
- Facilities work orders: open maintenance requests by site, category, age, and status
- Change requests: scheduled and emergency changes to IT infrastructure

**Questions it can answer:**
- What is our current average resolution SLA by priority level?
- How many open P2+ tickets are assigned to each IT team member?
- Which ticket categories have the highest volume this month?
- How many facilities maintenance items are open at each site?
- Which sites are generating the most incidents over the last 30 days?
- Are we hitting our SLA targets this week compared to last week?

---

## Salesforce

**What it is:** CRM platform. Owned by Sales, but I read it to understand pipeline-to-capacity implications.

**What data it holds:**
- Active sales pipeline: opportunity names, stage, expected close date, deal size, account owner
- Account records: customer segment, current contract status, renewal dates
- Activity logs: last contact date, open tasks, customer issues logged by sales reps

**Questions it can answer:**
- What is the total pipeline value expected to close in Q3?
- Which opportunities have been stalled for more than 60 days?
- How many new accounts are projected to onboard in the next 90 days?
- Are there open service or operational issues logged against our top 10 accounts?
- What is the deal size distribution of deals closing in the next 30 days?

---

## Microsoft Intune

**What it is:** Mobile device management (MDM) and endpoint management platform. Tracks every company-owned device across all three sites.

**What data it holds:**
- Device inventory: device ID, site, user, hardware age, OS version, compliance status
- Compliance policies: which devices are non-compliant and why (OS out of date, missing security config, etc.)
- App deployment status: which managed apps are installed vs. pending vs. failed
- Hardware health signals: devices flagged for age, battery, or failure risk

**Questions it can answer:**
- How many devices at Chicago are over 4 years old?
- What is the compliance rate by site?
- How many non-compliant devices are in active use?
- Which users have devices with failed app deployments?
- What percentage of the device fleet has the latest OS version?

---

## NetSuite

**What it is:** Enterprise resource planning (ERP) platform. Covers financials, inventory, procurement, and vendor management.

**What data it holds:**
- Operational budgets: actual vs. planned spend by department and category
- Purchase orders: open POs, vendor, amount, expected delivery
- Inventory: warehouse stock levels, movement, reorder triggers
- Vendor contracts: active agreements, terms, renewal dates, payment history

**Questions it can answer:**
- Where are we tracking against Q2 operational budget?
- Which departments are over or under budget year-to-date?
- What open purchase orders are past their expected delivery date?
- What is our current operational spend run rate compared to last year?
- Which vendor contracts are up for renewal in the next 90 days?

---

## Snowflake (Data Warehouse)

**What it is:** Enterprise data warehouse. Aggregates data from ServiceNow, Salesforce, Intune, and NetSuite into a single queryable layer. Used for cross-system analysis.

**What data it holds:**
- Everything from the above systems, joined and historicized
- Trend data over longer periods (not just the rolling windows in source systems)
- Cross-system views: e.g., correlation between open tickets and device age by site

**Questions it can answer:**
- How has the IT ticket volume trended over the last 6 months?
- Is there a correlation between device age and ticket volume at each site?
- How do operational costs trend alongside headcount growth?
- What is the total operational risk exposure across systems at any given moment?
- Cross-system questions that no single source system can answer alone

---
*Last updated: 2026-05-24 — Snowflake, ServiceNow, Salesforce, Intune, NetSuite all active*
