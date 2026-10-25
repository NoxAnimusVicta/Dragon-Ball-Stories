# Records and publication reference

Relocated 26 October 2026. Read for file organisation, app development, privacy, publication, audits or handover work; not before ordinary story dialogue. MAINTENANCE.md owns this app’s deployment and platform details; APP-CONTENT-STANDARD.md owns its presentation. Their specific instructions control over the general design guidance here. Generic new-project setup does not authorise moving or recreating this campaign.

## Records and project layout

Choose one authoritative local source folder. If a working copy is required, record which copy controls and how changes are synchronised. Avoid several editable folders silently diverging.

Suggested structure:

```text
campaign/
  START-HERE.md
  AGENTS.md
  NARRATOR-GUIDE.md
  CAMPAIGN-CONFIG.md
  CURRENT-CONTINUITY.md
  CHARACTER-REFERENCE.md
  ECONOMIC-REFERENCE.md
  RESEARCH-PROGRESSION.md
  WORLD-REFERENCE.md
  RETCONS.md
  story-transcript.md
  calendar.json
  characters.json
  accounts.json
  projects.json
  events.json
  world.json
  app/
  assets/
  build.py
  verify.py
  public-manifest.json
  dist/
  private/
    START-HERE.md
    current-checkpoint.md
    secrets.json
    rolls.jsonl
    publication-log.md
  handovers/
```

These are suggested filenames, not files that already exist for the new story. Start with fewer where appropriate. Each fact should have a clear authoritative home. The current checkpoint may summarise it and link to its source; avoid copying full histories into several competing documents.

Use UTF-8 explicitly. Stable IDs should outlive renamed people and places. Keep dates and units with numerical fields. Prefer structured source data feeding the app rather than editing generated HTML as the only record.

Builds must be deterministic transformations of recorded state. Never roll deaths, invent investments, advance time or rerun one-off world-generation scripts inside an ordinary build. Those are story decisions, recorded before generation.
## Private and public information

Decide what the companion app represents: character knowledge only, or a player-facing archive that may include selected out-of-character facts. Keep that choice explicit. Neither mode permits accidental disclosure of concealed narrator plans.

Private notes include unrevealed motives, hidden identities, future optional plot hooks, private rolls and any sensitive account information. Optional plot hooks remain optional until triggered through play; their presence in a file does not make them destiny.

Use an explicit public-file manifest. Generate or copy only approved public records and assets into the publication directory. Scan the actual output, including embedded JSON, comments, source maps, cached files and ZIPs. Hiding a panel with CSS does not keep its data secret.

A public exact transcript is appropriate only if its content has been approved for that audience. Keep the complete local archive even when a public version excludes private authorial material; label that public version as edited rather than calling it exact.

Never publish the private handover archive. An ordinary public website is not protected merely because its source repository has a different visibility setting. Verify the actual audience and hosting controls. Removing a file from the current branch does not erase earlier repository history. See GitHub's [sensitive data removal guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).
## Companion app design

The app is a read-only reference maintained by the narrator. Choose an aesthetic appropriate to the new story: journal, archive, terminal, dossier or another agreed form. Do not carry over a science-fiction data slate automatically.

Useful sections include protagonist, abilities, relationships, possessions, finances, holdings, research, world and chronicle. Add a section when its content warrants it. Give each topic one primary home, with short links or summaries elsewhere.

Use consistent expandable sections for substantial detail. Do not remove all dropdowns during a formatting cleanup or assign them randomly. Summary rows should have consistent spacing, alignment and click areas in open and closed states. Use drawn CSS or SVG indicators rather than platform-dependent emoji arrows. Include keyboard operation and appropriate accessible labels.

Test long names, narrow comparison controls, tables, empty states and realistic content lengths. Check both phone and desktop layouts. Avoid adding navigation widgets the player did not request in place of improving information structure.

Images should fit their container initially, with useful scroll-wheel and touch zoom where requested. Maps should constrain movement appropriately, wrap horizontally if they represent a globe and avoid exposed seams or decorative borders through the wrapped geography.

Keep maintenance labels, release hashes and rights notices outside the immersive reading surface where appropriate, while retaining required information in documentation. A build identifier can remain machine-readable for verification without becoming a prominent story element.

If offline caching is used, make updates reliable. Test a returning browser against a new release, not just a fresh tab. Do not add device-local character edits or import/export flows unless the player wants them; those can create conflicting versions of the campaign state.
## GitHub setup and publication

Create a separate repository for the new campaign only after its destination and intended visibility are established. Do not reuse the previous story's repository, browser tab, credentials or path merely because they appear in inherited context. Never put tokens or passwords into this handbook, story files or public assets.

The simplest match to the existing workflow is a public repository containing only approved generated files and public references. The complete source and private narrator material stay in the local project or another explicitly authorised private location. A private source repository plus a separate public deployment repository is another valid arrangement.

For a basic static site, place `index.html` and its assets in the chosen publishing source. GitHub Pages can publish from a branch's root or `/docs`, or through an Actions workflow. Configure this under the repository's Pages settings and confirm the resulting site URL. A `.nojekyll` file can disable Jekyll processing for an ordinary generated static site. Check current availability and settings against GitHub's [publishing source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and [site creation instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site). These hosting instructions were checked on 3 October 2026.

Use relative asset paths that work beneath a project repository path. A local preview at `/` does not prove that `/repository-name/` will work. Keep original art assets in the project so a future instance does not depend on someone else's Downloads folder.

Record the approved publishing method. The previous campaign preference was the signed-in GitHub website in the Codex in-app browser. Preserve that preference when requested; do not switch browsers or methods merely because another tool is convenient. A new environment must verify its available tools and authentication instead of assuming inherited access.

### Release procedure

1. Reconcile the latest enacted events and accepted corrections. Read every file to be edited in full, using search to locate related material rather than replacing full reading.
2. Update authoritative source records, then their summaries and app views. Check dated old statements rather than indiscriminately replacing historical facts.
3. Build a clean approved publication set. Validate JSON, dates, money, links, identifiers and hidden-data exclusion.
4. Inspect the affected app sections at phone and desktop sizes. Test actual interactions. Documentation-only changes need document and link checks; they do not require an unrelated visual redesign.
5. Publish the selected public files to the intended repository and branch. In the browser workflow, use Add file, Upload files, wait until every upload completes, then commit with a descriptive message.
6. Confirm the commit exists. Check the Pages deployment and inspect actual live files or their hashes. A successful upload is not proof that the live app has updated.
7. Record the commit, build identifier, deployment result, verified files and outstanding limitations. Report only what was confirmed.

If the live page is old, diagnose branch selection, deployment status, generated file contents and caching before repeatedly uploading identical files. A query parameter alone does not prove the browser received new content. Report a genuine blocker plainly; do not claim the site is updated while deployment is merely queued.
## Audits and maintenance discipline

When asked for a full audit, inventory the documents and app sections before editing. Build a list of affected domains and cross-references. Read each edited document fully. An audit of finances alone is not a full continuity audit.

Check protagonist state, chronology, powers, knowledge, relationships, NPC decisions, inventory, money, projects, politics, population, military returns, technology, travel, map behaviour and presentation as applicable. Review every app section, not just the first tab. Trace duplicated information to its correct home before removing it, and preserve unique content elsewhere when moving it out of the app.

Distinguish facts that are stale from facts that have remained unchanged. Do not fabricate events just to change every number. A completed project must not remain pending; a proposed project must not become built because a summary used careless tense.

Run proportionate checks. Useful invariants include balanced accounts, unique event IDs, valid date order, no duplicate population deductions, correct ownership, valid links and no private files in the public output. Tests should verify meaningful behaviour, not merely mirror an implementation.

Preserve unrelated edits. Do not rerun historical migration scripts without establishing their current safety. Keep backups and publication receipts. Never claim to have read files or verified screenshots that were not actually examined.
## Handover and recovery

Before a new instance continues, provide the latest handbook/configuration, current checkpoint, relevant subject references, transcript tail and private narrator package through an authorised channel. A public GitHub link alone may deliberately omit essential secrets.

The handover needs a clear date, current location, last exact exchange, pending player choice, current balances, active projects, outstanding corrections, source paths and latest publication status. Include build instructions, required dependencies, assets and known limitations. Do not include credentials.

Compaction does not advance or reset the story. Resume from the latest live checkpoint, confirm it against the transcript, and preserve fixed hidden choices. If evidence is missing, state the specific gap. Do not fill it with invented dialogue, a new roll or an older snapshot presented as current.

A handover archive is a dated snapshot, not automatic synchronisation. Refresh it after major changes. Keep it outside public deployment and check its contents before sharing.
