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
- The player distinguishes foundational combat skills from signature techniques and transformations. Combat fundamentals, ki control, flight and small generic ki blasts stay in the Abilities training list, with their existing progress and limitations. They do not occupy illustrated slots or open compact ability dialogs. They are ordinary skills for trained fighters in this setting, even while difficult for Zero; this UI classification does not grant mastery or change his power, training progress or field readiness.
- The three star boxes are empty, non-interactive placeholders for future signature moves and transformations. Kamehameha, Galick Gun, Solar Flare, Special Beam Cannon and Hakai illustrate the intended category; they are not promises, unlocks or entries to add to Zero's record. Player-created signature moves also qualify. The current published record contains no qualifying unlocks, so all three boxes remain empty.
- A learned, character-known signature move uses `abilityType: "signature-technique"`; an established, accessible transformation uses `abilityType: "transformation"`. These are explicit opt-ins on an ability record, not inferred from its name or from being in the abilities collection. Records without these values remain in the training list only. Keep unrevealed abilities and speculative designs out of the public app and repository.
- Publish each qualifying unlock with approved `artwork` (a relative image path) and `artworkAlt` (descriptive alternative text). Only explicitly classified records with a valid local artwork path fill a slot. A filled slot shows its illustration and name, and opens a compact text dialog using the record's summary, details and facts. Prepare the art before promoting an unlock into the illustrated grid; do not substitute a labelled star for a completed ability card. If approved artwork temporarily fails to load, the star is only an error fallback and its existing description remains available.
- Three slots is a minimum, not a cap. Qualifying illustrated unlocks fill the placeholders in record order, and the grid grows when there are more than three. Empty slots have no ability names, click actions or implied future contents. Images must be inside the site's project directory and their URLs use the current release version.
- Retain source artwork privately, publish an optimised image with a neutral filename and descriptive alternative text, and include approved assets in the publication manifests. Remove identifying metadata and check the complete card on phone and desktop. Record the accepted visual description and provenance with the ability/art reference so future changes have a consistent source.

The empty slots and compact description dialog are ready for future illustrated unlocks. Do not generate a full set or advance the story just to fill them. Test touch and keyboard opening, close button, Escape, focus return, narrow phone layouts and expansion beyond three techniques when changing this interface.

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

The illustrated backdrop is decorative; never infer geography, possessions or affiliations from it. The one-star icon is unchanged. Bangers and the backdrop are local assets listed in the manifest. Motion can be paused and the system reduced-motion preference is respected. Music and menu sounds default to on and start through the launch gesture. Separate on/off preferences and volume levels are remembered on the device; an automatic update preserves those choices. The motion preference is stored locally and the system reduced-motion setting takes priority. Arrow keys move menu focus, Enter follows links, Escape returns to the main menu or dismisses a dialog. Standard Tab navigation remains available. The five main-menu links have no hover fill, slide-out selection or preselected Character entry. Descriptions remain visible; keyboard focus uses the standard outline so navigation remains accessible.

## In-app audio

music.js owns the shared Web Audio output for both background music and synthesized menu cues. The alternating track file already contains the two-second fades and one-second gaps. It is downloaded and decoded during the launch screen using an OfflineAudioContext; playback and live context resume begin only through the launch interaction. Do not wait for a download or decode before unlocking the live context in that gesture.

There is no HTML audio element or media-player transport. Where supported, the audio session requests playback so iOS uses its media-volume output route. The previous forced ambient session was followed by the player's report that both music and cues were silent on the phone, although PC audio worked; this is a compatibility correction, not a confirmed diagnosis from on-device logs. The launch gesture also starts a one-frame silent buffer to prime the live output before asynchronous work. Priming failure must not prevent the normal resume attempt. Do not change the player-approved music/effects balance. No lock-screen metadata, seeking or background playback is registered, but system audio controls and routing ultimately belong to iOS; playback mode may interrupt other media. Actual iPhone behaviour still needs device verification; desktop WebKit is not an iPhone test. Browsers without the session API retain their default audio routing, including any Silent Mode restrictions.

Music and effects use separate gain controls. Fresh defaults are music 20% and effects 75%; the music bus applies an additional 0.45 mix factor so existing saved volumes also leave more room for cues. Existing music volume and on/off choices are preserved. Settings live in About. The sound slider previews a cue on release when Sound is on. Temporary errors never turn Sound off or overwrite the user's preferences.

When hidden or leaving the page, stop the loop, retain its position and suspend the output. On return, attempt resume; trusted touch release, pointer release, keyboard activation and click also retry immediately. A stuck resume is marked for context recreation on the next gesture. Also sample the live audio clock after startup, foreground recovery and interactions: iOS can report a running context while its render clock is frozen. If it has not advanced after 800 ms while still visible and running, retain a failed-start message and Resume audio button in About, and recreate the context on the next trusted interaction. Do not repeatedly rebuild it in the background. Cancel checks when hidden or resetting; late music readiness and misleading state-change events must not erase the failure. Clock progress is not proof of audible device output. The recovery button can rebuild the context without re-downloading a decoded track or resetting the song position. Keep exactly one active music source and invalidate pending cues when hidden or reset. Music loading errors must not prevent menu sounds.

Check first launch, slow/failed downloads, foreground return, interruptions, pending/rejected resumes, frozen clocks despite running state, context replacement, independent toggles, volume persistence and the track loop. Verify actual output with a browser audio graph, not just an On label. A physical iPhone is required to confirm its audio routing, Silent Mode and system interruption behaviour.

### iOS Home Screen audio investigation

The player confirmed the failing installation is a Safari Home Screen app on iOS 26.1, with Silent Mode off. Both cues and music can be silent; leaving and returning sometimes starts them. The playback session and primer did not resolve this report. Do not describe those prior changes as a verified phone fix.

[WebKit bug 295518](https://bugs.webkit.org/show_bug.cgi?id=295518) documents audio failing on reopening an iOS 26 Home Screen app, including a 26.1 beta report; ordinary Safari worked in the reproduction. [Safari 26.2 release notes](https://webkit.org/blog/17640/webkit-features-for-safari-26-2/) explicitly list a fix for audio elements failing when reopening Home Screen Web Apps. This app now uses Web Audio, so that release note alone does not prove its exact failure is fixed. [Related Web Audio bug 291892](https://bugs.webkit.org/show_bug.cgi?id=291892) describes silent output and hung resume in Home Screen apps; a reporter confirmed improvement on 26.2 beta 3. [Bug 263627](https://bugs.webkit.org/show_bug.cgi?id=263627) also documents a running context with a frozen currentTime on a physical iPhone, absent in the simulator.

The platform regression is a strong match, not a diagnosis established from this phone's logs. Recommend an available iOS update to 26.2 or later, or ordinary Safari as a workaround, before another speculative audio-engine rewrite. The clock check can expose one failure and allow an in-app retry; it cannot guarantee repair of an OS audio-session bug or detect every silent output route. Confirm first launch and reopening on the physical phone after updating. Do not claim the issue resolved solely from desktop tests.

## Automatic phone updates

updates.js checks a cache-busted release.json with cache: no-store at startup, on visibility/pageshow/focus/reconnection and every 60 seconds while visible. Repeated foreground events are throttled. All public file contents contribute to the release ID, including campaign data and artwork. The new index must advertise the same release before a refresh is allowed. A versioned URL bypasses stale HTML and all referenced runtime assets have versioned paths. Character artwork uses the release ID too.

Updates preserve the current route, scroll position, expanded details and session sound preference. They wait for dialogs to close and five seconds after interaction. A short-lived session guard prevents repeated reloads of the same release. Network errors leave the working screen untouched; checks resume when the connection returns. Mobile operating systems suspend closed/backgrounded web apps, so updates apply on the next visible online session, not while fully closed. The pre-updater version needs one fresh opening to receive this mechanism.

No service worker, offline cache, analytics or remote account is added. Only audio and motion preferences and temporary update-resume state are stored on the device. Run the update lifecycle tests in tests/updates.test.cjs and tests/test_release.py before changing update logic; these are local-only files and must not be uploaded. Read every edited document in full before and after editing, then read generated release.json before publication. Preserve original transcripts and historical snapshots; use dated correction entries. If the user explicitly withdraws a scene, retain a withdrawal marker and the exact replacement, and exclude the withdrawn actions from operative summaries. GitHub Pages remains main / (root).
