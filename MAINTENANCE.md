# Companion maintenance

## Source and publication

campaign.json is the authoritative character-facing data source. A new fact must be established in play AND known to Zero before publication. Player-approved future plans are not character knowledge. Keep unrevealed facts and unapproved artwork outside public/ entirely, including source, comments, metadata, search data and commit messages. Null means not publicly recorded; it may already exist in private preparation. An empty collection means no records, not proof that the character owns nothing or cannot do anything.

The complete local campaign-source folder holds build.py, verify.py, the handbook and private material. Only its public/ contents listed in public-manifest.json are uploaded. Run `python build.py` then `python verify.py` from that local source folder. This generates readable summaries without advancing time or altering story state.

GitHub Pages publishes main / (root). Relative asset paths support the /Dragon-Ball-Stories/ project prefix. build.py calls release.py to derive a release ID from every public file and version the HTML, stylesheet resources and app icons. Always run build.py AFTER all public edits; verify.py rejects stale release markers. Do not manually bump query versions. Data is fetched with cache: no-store. There is deliberately no service worker, offline mode, analytics or device-local character editing.

## Character art

An explicitly approved character-creation portrait may be shown before play without asserting an event. Otherwise wait until the depicted appearance is established and character-known. Place the approved publication copy in public/ with a stable filename, such as zero-portrait.webp. Set character.portrait to that relative filename and provide a descriptive character.portraitAlt. Add the filename to both manifests. The portrait card uses the supplied 853:1280 aspect ratio with object-fit: cover, filling the box without cropping this same-ratio image. The full-art dialog uses contain. If future art has another aspect ratio, update the card ratio and check the complete composition on phone and desktop. Null displays the intentional placeholder. Only images within this site's project directory are accepted; a broken image shows a readable fallback.

Before publishing supplied character art, remove identifying metadata and use a neutral filename. Retain the original privately. Do not publish photographs, filenames, captions or metadata that disclose real-world identity or location.

## Ability artwork direction

Player-approved direction, 9 October 2026: use illustrated, cel-shaded ability icons that suit the existing Dragon Ball game interface. Pixel art is not the chosen direction. The artwork should make established techniques recognisable and give player-created abilities a consistent visual reference for later narration.

- For each technique, record its established colour, energy shape, stance or hand gesture, motion and distinctive visual effects before generating art. Use that description and the accepted image together to keep later depictions consistent. Artwork must not invent mechanics, extra powers or a new transformation.
- The player requests **“Pro 6 Image generation”** for future images. Preserve that preference verbatim. Check the actual model controls available when generating; use the requested model when selectable. If the tool does not expose or verify that model, disclose that limitation rather than claiming it was used or silently treating a different model as equivalent.
- Favour clear silhouettes, crisp ink contours, cel shading and a consistent palette and composition across the set. Check readability at actual phone icon sizes, around 96–160 pixels, as well as at full resolution. Keep technique names, frames, selection states and optional restrained glow effects in app code rather than baking them into the illustration.
- Inspect anatomy carefully before accepting an image: ordinary human hands have four fingers and a thumb, with believable joints, orientation and attachment. Account for deliberate occlusion; do not accept missing or extra digits as stylisation. Also check the intended gesture, clothing, energy direction and established character appearance.
- The Kamehameha sample was a concept demonstration only. The player identified a missing pinky on the left hand; it is not approved for use and would need remaking. Zero has not learned Kamehameha. Do not upload that mock-up, add an ability entry or imply it has been acquired.
- The Abilities screen has three initial technique slots, currently ki control, flight and the small ki blast. Each star is an artwork placeholder on a working button, with the recorded technique name beneath it. Selecting a known technique opens a compact text dialog using its existing summary, details and facts. Power readings and broad combat fundamentals stay in the main training record rather than taking technique slots.
- The slot grid grows automatically as more techniques are recorded; three is a minimum, not a maximum. If fewer than three techniques are known, remaining slots are non-interactive and labelled Undiscovered without promising a particular future ability. Keep unrevealed abilities and speculative designs out of the public app and repository.
- Introduce approved artwork by adding optional `artwork` (a relative image path) and `artworkAlt` (descriptive alternative text) to the corresponding ability record. The app accepts only images inside the site's project directory, versions their URLs with the release and falls back to the star when an image cannot load. Artwork is optional; the ability description works without it.
- Retain source artwork privately, publish an optimised image with a neutral filename and descriptive alternative text, and include approved assets in the publication manifests. Remove identifying metadata and check the complete card on phone and desktop. Record the accepted visual description and provenance with the ability/art reference so future changes have a consistent source.

The functional slots are ready for future artwork. Do not generate a full set or advance the story just to fill them. Test touch and keyboard opening, close button, Escape, focus return, narrow phone layouts and expansion beyond three techniques when changing this interface.

## Character and story fields

character: name, age, height, heightMetric, heightApproximate, portrait, portraitAlt, race, origin, appearance, personality, backstory, arrival, motivation, knowledge, limitations, battlePower, powerReading, role and condition. battlePower is the current character-known measured value; historical readings remain separate records. recordedThrough identifies the exchange/correction represented by the release.

story: era, date, location, situation, pendingChoice. Set started=true only after an enacted opening scene. Use date for elapsed story time from that opening, and era for the known local era/continuity. The private clock tracks elapsed time separately from local calendar coordinates; changing eras must not reset elapsed time. Before play begins, the clock is not started. Documentation and real-world waiting never advance it.

Use Zero as the sole character name in public files, UI, metadata, prompts and narration. Never restore the former name or describe character fields as real-world identifying facts. Keep surnames, birthdays, addresses, contact details, real-world locations, occupations and identifying background out of public records. Age 26 and height 5′6″ remain the approved character profile. Artwork and character facts come from the user; being supplied does not automatically make them publishable. Consult the local knowledge ledger and publication review before promoting private material.

## Collections

abilities, inventory, accounts, people, places, projects and events each contain records with this format:

```json
{
  "id": "unique-stable-id",
  "title": "A confirmed record title",
  "summary": "The established fact or event.",
  "status": "Optional status",
  "date": "Optional story date, not publication date",
  "facts": [{"label": "A field", "value": "A confirmed value", "note": "Optional unit or uncertainty"}],
  "details": "Optional longer text, shown in an expandable section."
}
```

IDs use lowercase letters, digits and hyphens and are unique across collections. Events remain in chronological order in campaign.json; the app renders newest first. Stable disclosure keys preserve the specific expanded record during updates, even when many summaries say Read more. World category links use reserved people/places/projects anchors; do not reuse those as record IDs. Search links directly to a record and focuses it. Text is escaped before rendering, so source text never becomes executable HTML. Separate carried and stored items, personal and other accounts, established abilities and potential. Record sums and calculations in authoritative ledgers, not only in a display string. Keep private motives and hidden outcomes out of public data.

## Release check

1. Read every document to be edited in full before editing, then again after editing; reconcile current summaries and accepted corrections. Record the event/exchange and how Zero learned each new fact in the private knowledge ledger. Review the public data and manually update the local publication-review fingerprint; builds must never approve facts automatically.
2. Run the local build and verification tools. Review the exact public file set.
3. Preview via a local HTTP server on a fresh port and under a project prefix. Avoid an old localhost origin with another project's service worker.
4. Check all six sections, search including no results, keyboard navigation, dialogs and phone layouts. Test the portrait workflow when adding art.
5. Upload only manifest-listed files, commit, verify the GitHub deployment and compare live assets with local source hashes.
6. Record the commit, deployment and limitations in the local private publication log. Never upload that log or the complete transcript.

## Game menu presentation

The illustrated backdrop is decorative; never infer geography, possessions or affiliations from it. The one-star icon is unchanged. Bangers and the backdrop are local assets listed in the manifest. Motion can be paused and the system reduced-motion preference is respected. Menu sounds require explicit opt-in and are off on a fresh visit; an automatic update preserves the current sound setting. The motion preference is stored locally and the system reduced-motion setting takes priority. Arrow keys move menu focus, Enter follows links, Escape returns to the main menu or dismisses a dialog. Standard Tab navigation remains available.

## Automatic phone updates

updates.js checks a cache-busted release.json with cache: no-store at startup, on visibility/pageshow/focus/reconnection and every 60 seconds while visible. Repeated foreground events are throttled. All public file contents contribute to the release ID, including campaign data and artwork. The new index must advertise the same release before a refresh is allowed. A versioned URL bypasses stale HTML and all referenced runtime assets have versioned paths. Character artwork uses the release ID too.

Updates preserve the current route, scroll position, expanded details and session sound preference. They wait for dialogs to close and five seconds after interaction. A short-lived session guard prevents repeated reloads of the same release. Network errors leave the working screen untouched; checks resume when the connection returns. Mobile operating systems suspend closed/backgrounded web apps, so updates apply on the next visible online session, not while fully closed. The pre-updater version needs one fresh opening to receive this mechanism.

No service worker, offline cache, analytics or remote account is added. Only a motion preference and temporary update-resume state are stored on the device. Run the update lifecycle tests in tests/updates.test.cjs and tests/test_release.py before changing update logic; these are local-only files and must not be uploaded. Read every edited document in full before and after editing, then read generated release.json before publication. Preserve original transcripts and historical snapshots; use dated correction entries. If the user explicitly withdraws a scene, retain a withdrawal marker and the exact replacement, and exclude the withdrawn actions from operative summaries. GitHub Pages remains main / (root).
