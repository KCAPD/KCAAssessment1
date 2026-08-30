# KCA Curriculum Assessment Portal v0.10

## What changed
- Pupil portal remains Year Group → Big Question assessment.
- Teacher Dashboard now reads the live Apps Script endpoint.
- Dashboard displays aggregated year-group × curriculum-area RAG only.
- No pupil names or pupil IDs are requested or displayed.
- Half-term selector supports all six assessment windows.
- Year-group RAG thresholds:
  - Expected: 80%+ of pupils Secure
  - Developing: 60–79% Secure
  - Priority: 59% or below Secure
- Years/subjects with no results show —.

## Deployment
Replace the files in the existing GitHub Pages repository with these files and commit/push. The existing Apps Script `/exec` URL is already configured in `app.js`.

## Current pilot
Year 6 Autumn 1 is the only live pupil assessment. The dashboard will therefore populate Y6 Autumn 1 from the current Google Results data; other year groups/half terms remain blank until data exists.
