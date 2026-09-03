KCA Assessment Portal v0.17 — MTC Teacher Reports

Changes from v0.16:
- Adds a Year 4 MTC class-report area to the authenticated Teacher Dashboard.
- Uses the existing dashboard session token.
- Calls the secure Apps Script action: generateMtcClassReport.
- Shows a clear 'Creating MTC report…' progress state while Google builds the report.
- When complete, returns only a protected Google Doc URL to the dashboard.
- No pupil names, pupil IDs, scores or confidence-grid data are placed in GitHub.
- Existing pupil MTC practice, SLT controls, curriculum dashboard and report tools are preserved.

Deployment:
1. Redeploy the existing Apps Script web app as a NEW VERSION so the new
   generateMtcClassReport POST route is live at the existing URL.
2. Upload/replace index.html and app-v0.17.js in the GitHub site.
3. Keep the existing style.css unchanged.
4. Open Teacher Dashboard, sign in, choose a Year 4 class, and click
   Generate MTC report.

Note:
The Year 4 class selector uses the authenticated dashboard's existing aggregate
completion data to identify class names. Identifiable pupil data remains Google-side.
