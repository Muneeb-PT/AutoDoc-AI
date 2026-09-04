# AutoDoc AI production cleanup

## Goal
Turn the current app into a reliable, polished SaaS experience by fixing the broken entry path first, then tightening the core generation, account, history, payment, and marketing experiences without adding unrelated features.

## What will change

1. **Restore the app and navigation**
   - Fix the incorrect deployment path that currently sends the home page and internal pages to a 404.
   - Make links, redirects, logo assets, and browser history work consistently in preview, the published site, and the GitHub Pages build.
   - Remove avoidable browser warnings and replace dead `#` links with working destinations or honest unavailable states.

2. **Harden document generation**
   - Validate and normalize GitHub, GitLab, Bitbucket, and GitHub Pages URLs with clear messages.
   - Reject unsupported document types and oversized/unsafe uploads cleanly.
   - Require a valid signed-in account at the API boundary, enforce ownership, and return useful errors without exposing internal details.
   - Ensure failed generation jobs are recorded correctly and generation controls cannot be submitted twice.

3. **Make the document workspace professional**
   - Reorganize the input controls for clear mobile and desktop scanning.
   - Improve loading, empty, failure, and success states; add accessible labels/tooltips and stable button sizing.
   - Make copy/share/download actions resilient and ensure exports use rendered document structure rather than plain Markdown in a fake file.
   - Keep Mermaid diagrams responsive and provide a clear fallback when a diagram is invalid.

4. **Fix account, history, admin, and payment flows**
   - Improve authentication feedback and redirect behavior.
   - Add query error handling and accurate loading/empty states in history and admin views.
   - Keep admin checks server-backed and preserve the designated owner account behavior.
   - Present bank transfer as a clear manual activation flow without implying automatic payment completion.

5. **Premium visual and content pass**
   - Tighten typography, spacing, section rhythm, responsive layouts, focus states, and motion reduction across the landing and app pages.
   - Remove unsupported product claims and align pricing/features with what is actually available.
   - Preserve the existing dark cyan AutoDoc AI identity while making the interface more restrained and consistent.

6. **Verification**
   - Run targeted checks and production compilation.
   - Exercise public routes at desktop and mobile widths, verify protected redirects, and inspect browser errors.
   - Test the live generation API with an authenticated session when one is available; otherwise verify its public rejection and report the remaining signed-in test clearly.

## Technical notes
- Keep the current React/Vite and Lovable Cloud architecture.
- Use the existing design tokens and shared controls; no new visual framework.
- Add a new backend migration only where required for secure grants or generation limits, preserving existing data.
