# KCA Curriculum Assessment Portal v0.11

## What's new
- Teacher Dashboard is now behind a KCA Staff Access password screen.
- The password is **not** stored in GitHub or in the website code.
- Successful login receives a temporary Google-issued session token.
- The token is stored only for the current browser tab/session and expires server-side after 8 hours.
- A Log out button clears the local session immediately.
- Dashboard data remains aggregated year-group data only; no pupil names or pupil IDs are sent to GitHub.
- Public pupil portal is unchanged.

## Important Google Apps Script requirement
This website sends the staff password to Apps Script with an HTTP POST request so it does not appear in the URL.
Your Apps Script deployment therefore needs the matching `doPost(e)` login handler in addition to the secure `doGet(e)` data handler.

Keep using the existing web app deployment URL. When backend code changes, update the existing deployment with **New version** rather than creating a new web app.
