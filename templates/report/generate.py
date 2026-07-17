#!/usr/bin/env python3
"""Generate a client-facing AI Tools Assessment report from a client data JSON.

Usage:
    python3 generate.py client-data.json [-o report.html]

The template is report-template.html in this directory. See
client-data.sample.json for the expected schema.
"""

import argparse
import html
import json
import sys
from pathlib import Path

TEMPLATE = Path(__file__).parent / "report-template.html"

MIN_GUARANTEED_HOURS = 5
WEEKS_PER_MONTH = 4.33


def esc(value):
    return html.escape(str(value))


def money(value):
    return f"{round(value):,}"


def build_blocks(data):
    recs = data["recommendations"]

    pain_points = "".join(
        f"<li>{esc(p)}</li>" for p in data["executive_summary"]["pain_points"]
    )

    matrix_quickwins = "".join(f"<li><b>{esc(r['tool'])}</b> — {esc(r['pain_point'])}</li>" for r in recs)
    matrix_major = "".join(f"<li><b>{esc(p['title'])}</b></li>" for p in data.get("major_projects", []))
    if not matrix_major:
        matrix_major = "<li>None identified — your quick wins cover it.</li>"

    quick_win_rows = "".join(
        '<div class="win-row">'
        f'<div class="pain">{esc(r["pain_point"])}</div>'
        '<div class="arrow">&rarr;</div>'
        f'<div class="tool">{esc(r["tool"])}</div>'
        "</div>"
        for r in recs
    )

    rec_cards = "".join(
        '<div class="rec-card">'
        '<div class="rec-head">'
        f'<span class="name">{esc(r["tool"])}</span>'
        f'<span class="lever">{esc(r["lever"])}</span>'
        "</div>"
        f'<div class="solves"><b>Solves:</b> {esc(r["pain_point"])}. {esc(r["description"])}</div>'
        '<div class="rec-stats">'
        f'<span>Cost: <b>{"Free" if r["cost_per_month"] == 0 else "$" + money(r["cost_per_month"]) + "/mo"}</b></span>'
        f'<span>Setup: <b>{esc(r["setup_time"])}</b></span>'
        f'<span>Saves: <b>{esc(r["hours_saved_per_week"])} hrs/week</b></span>'
        "</div></div>"
        for r in recs
    )

    quick_start_days = "".join(
        '<div class="day-card">'
        f'<div class="day-num">Day {esc(d["day"])}</div>'
        f'<div class="day-tool">{esc(d["tool"])}</div>'
        f'<div class="day-action">{esc(d["action"])}</div>'
        f'<div class="day-time">{esc(d["time_required"])}</div>'
        f'<div class="day-benefit">{esc(d["benefit"])}</div>'
        "</div>"
        for d in data["quick_start_plan"]
    )

    major_project_cards = "".join(
        '<div class="proj-card">'
        f'<div class="p-title">{esc(p["title"])}</div>'
        f'<div class="p-desc">{esc(p["description"])}</div>'
        f'<div class="p-teaser">{esc(p.get("teaser", ""))}</div>'
        "</div>"
        for p in data.get("major_projects", [])
    ) or '<div class="proj-card"><div class="p-desc">Your quick wins cover everything we found — revisit in 90 days.</div></div>'

    next_steps = "".join(f"<li>{esc(s)}</li>" for s in data["next_steps"])

    return {
        "PAIN_POINT_ITEMS": pain_points,
        "MATRIX_QUICKWIN_ITEMS": matrix_quickwins,
        "MATRIX_MAJOR_ITEMS": matrix_major,
        "QUICK_WIN_ROWS": quick_win_rows,
        "RECOMMENDATION_CARDS": rec_cards,
        "QUICK_START_DAYS": quick_start_days,
        "MAJOR_PROJECT_CARDS": major_project_cards,
        "NEXT_STEP_ITEMS": next_steps,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("client_data", help="Path to the client data JSON file")
    parser.add_argument("-o", "--output", default="report.html", help="Output HTML path")
    args = parser.parse_args()

    data = json.loads(Path(args.client_data).read_text())
    recs = data["recommendations"]

    if not 3 <= len(recs) <= 7:
        print(f"warning: {len(recs)} recommendations — the offer promises 3-7", file=sys.stderr)

    hours = sum(r["hours_saved_per_week"] for r in recs)
    if hours < MIN_GUARANTEED_HOURS:
        print(
            f"warning: only {hours} hrs/week reclaimed — below the {MIN_GUARANTEED_HOURS}-hour "
            "money-back guarantee. Find more opportunity before sending this report.",
            file=sys.stderr,
        )

    tool_cost = sum(r["cost_per_month"] for r in recs)
    hourly_rate = data["hourly_rate"]
    monthly_time_value = hours * hourly_rate * WEEKS_PER_MONTH
    net_roi = monthly_time_value - tool_cost

    replacements = {
        "CLIENT_NAME": esc(data["client_name"]),
        "BUSINESS_TYPE": esc(data["business_type"]),
        "DATE": esc(data["date"]),
        "PREPARED_BY": esc(data["prepared_by"]),
        "PRIMARY_FOCUS": esc(data["primary_focus"]),
        "PRIMARY_FOCUS_DESCRIPTION": esc(data["primary_focus_description"]),
        "MAIN_OUTCOME": esc(data["executive_summary"]["main_outcome"]),
        "HOURS_PER_WEEK": esc(hours),
        "HOURLY_RATE": money(hourly_rate),
        "MONTHLY_TIME_VALUE": money(monthly_time_value),
        "MONTHLY_TOOL_COST": money(tool_cost),
        "MONTHLY_NET_ROI": money(net_roi),
        "ASSESSMENT_FEE": money(data.get("assessment_fee", 999)),
    }
    replacements.update(build_blocks(data))

    output = TEMPLATE.read_text()
    for key, value in replacements.items():
        output = output.replace("{{" + key + "}}", value)

    out_path = Path(args.output)
    out_path.write_text(output)
    print(f"Report written to {out_path}")
    print(f"  {len(recs)} tools | {hours} hrs/week | ${money(tool_cost)}/mo tools | ${money(net_roi)}/mo net ROI")


if __name__ == "__main__":
    main()
