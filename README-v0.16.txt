KCA Assessment Portal v0.16 — Visible pupil PIN

Keep the existing style.css unchanged.
Replace index.html and app-v0.15.js with the files in this package.
The new index.html loads app-v0.16.js.

Change in v0.16:
- The 5-digit MTC pupil PIN is now visible as the child types it.
- inputmode="numeric" and pattern="[0-9]*" are retained so tablets/phones use a numeric keypad where supported.
- maxlength remains 5 and autocomplete remains off.

Everything else in the approved MTC pupil flow is unchanged.
