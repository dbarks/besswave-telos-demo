# Friction Points — Sarah Chen

> The operational pain points Besswave is replacing. Documented to help the AI understand what "good" looks like relative to the old way.

## Friction 1: Weekly SLA Reporting

**The old way:** Every Monday, I spent 90 minutes pulling the ServiceNow ticket report, exporting to Excel, cleaning the data, and comparing it to the prior week's export. The numbers were always slightly different because ServiceNow's built-in reporting doesn't have the filters I need, so I built my own spreadsheet model. One bad export would break the whole thing and I'd spend another 30 minutes troubleshooting.

**The consequence:** The Monday morning report for Linda was frequently late or skipped when the export broke. I was spending nearly 5% of my work week doing what is essentially data janitorial work.

---

## Friction 2: Cross-Site Incident Correlation

**The old way:** When a spike showed up in ticket volume, I couldn't tell from ServiceNow's default views whether it was isolated to one site or happening across all three. To find out, I had to either build a filtered report myself (30+ minutes) or ask James to run it for him — which meant it wouldn't land until later that day or the next morning.

**The consequence:** I often couldn't answer Linda's question "is this a Portland problem or a company-wide problem?" in the moment. I'd have to say "I'll check and get back to you," which signals I'm not on top of the data. The delay meant decisions got made with incomplete pictures.

---

## Friction 3: Pipeline-to-Capacity Bridge

**The old way:** When a large deal was about to close, I'd need to understand the operational implications — warehouse space, staffing, fulfillment capacity. To get the pipeline picture, I'd have to ask the VP of Sales to pull a Salesforce report and send it over. That took 24–48 hours. By the time I had the information, the window to proactively plan had often closed.

**The consequence:** Operations got surprised by large account onboardings multiple times a year. We'd scramble to staff up or find warehouse space on short notice, which cost more and stressed the team.

---

## Friction 4: Ad-Hoc Data Requests via the Data Team

**The old way:** Any question involving data across multiple systems (e.g., "do sites with older devices generate more tickets?") required me to submit a request to the data team, who would write a Snowflake query and return results in 2–3 days. I couldn't ask follow-up questions in real time because each iteration went back into the queue.

**The consequence:** I stopped asking the questions I actually had, because the cost of asking was too high. I made decisions with less information than I needed, or with information that was a week stale by the time I got it.

---
*Last updated: 2026-05-24*
