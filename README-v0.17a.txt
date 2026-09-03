KCA Assessment Portal v0.17a — MTC Class List Fix

Fix:
- The MTC report class selector no longer derives Year 4 classes from wider-curriculum completion data.
- It now requests active Year 4 class names from the authenticated Apps Script API.
- No pupil names, pupil IDs, scores or report data are returned by the class-list route.
- Existing MTC report generation/progress state is preserved.

Required Apps Script change:
Add the getMtcYear4Classes authenticated POST route supplied in ChatGPT, then
redeploy the EXISTING Apps Script deployment as a new version.

Website deployment:
Replace index.html and app-v0.17a.js.
Keep style.css unchanged.
