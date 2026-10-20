# App content standard

Approved 20 October 2026. This document owns presentation and field placement for the companion. MAINTENANCE.md owns publication, privacy and platform behaviour. Campaign facts remain in campaign.json and the authorised local factual records.

## Mandatory before editing

Read this entire document before **every round of app edits**, including after compaction, then read every affected source file fully. Reread it whenever placement or formatting is uncertain. START-HERE.md and MAINTENANCE.md point here; do not build a second presentation rulebook. Verify the complete edited files and rendered result afterwards.

## One home per fact

Power Level belongs on Character, not in the ability collection. Current base is `character.battlePower`; `character.forms` holds each revealed stage and its total multiplier. Ability `formIds` reference those records. Calculate stage output from the current base with exact decimal arithmetic; never copy a current total into several display strings. Historical readings retain their date, measurement conditions and original value.

Kaioken is one ability. Keep every learned stage in `character.forms` and reference each from its ability, including lower stages after higher ones are learned. Kaioken remains a separate technique, not a new biological transformation. Never publish a planned form as an inactive unlock.

## Abilities

Every established ability, including fundamentals, has exactly one compact icon-led row in four ordered groups: Forms & amplification; Ki attacks; Ki control; Movement & combat. Each group is a single vertical list. Spirit Spear is a ki attack delivered by contact; do not duplicate it under physical combat. New abilities must be assigned deliberately; an Other techniques fallback prevents an unclassified record disappearing. The whole row opens its dialog. Use small square icons (48 pixels on phone, 60 on desktop), subtle separators and no large artwork panels or individual card shadows. Detail headings also keep the icon small. The rounded dialog keeps its heading and 44-pixel close control visible while only its reading area scrolls; keyboard users can focus that area. Use restrained separators, readable line spacing and no nested section boxes. No separate training list, icon sidebar, empty future slots or second record.

At a glance: small icon, name and one short effect sentence. Remove power-reference/form-navigation buttons from this section; the campaign power-reference link belongs beside Character's power information. Do not display the old mixed Developing/Practised statuses as mastery ranks. Their historical data remains intact until the new numerical model and starting-tier migration are approved. Current capability and limits remain in the dialog.

The dialog header contains the small icon, quiet category text, ability name and one44-pixel close button. No generic ABILITY label, status badge, white inset box or extra toolbar. The header stays fixed while the body scrolls. Once the mastery proposal is adopted, display one restrained plain tier label and a Mastery section with demonstrated benefits/next focus. Never publish draft coefficients or guessed progression percentages. Uncontrolled is an access condition, not a level on the mastery ladder.

Dialog order:

1. **Effect** — `effect`: what it does and how it is used.
2. **Stages & power** — `formIds`: learned stages from the Character calculation source.
3. **Appearance** — `appearance`: body, aura, hand gesture and energy changes.
4. **Control & compatibility** — `control`: demonstrated endurance, activation conditions and stacking.
5. **Development** — `development`: concise current focus; collapsed linked `history` events and, where needed, a dated `trainingRecord`.

Omit sections that do not apply. Do not invent an appearance, multiplier or maximum to fill a field. Both Dark Factor records receive the same appearance/control treatment.

`history` contains stable event IDs, not copied journal entries. `trainingRecord` preserves unique older observations in a collapsed dated record; it is historical, not a second current status. Update current fields when capability changes. Append a dated observation or link a new event; do not silently rewrite the old record as if it had always used the latest base.

Artwork: `artwork`, `artworkAlt`, local manifest-listed asset. Cel-shaded illustration, clear silhouette, no baked-in labels or frames. Symbolic fundamentals are not character portraits or evidence of a new power. Spirit Bomb depicts a sphere above raised hands; Spirit Spear depicts spirit energy gathering into the hand and spreading over the front of the palm and fingers for contact release; the skin remains visible rather than the whole hand glowing, not a floating orb or literal spear. Preserve originals privately and publish optimised, metadata-free copies.

## World

All records retain stable IDs and existing search/deep links. `sections` contains ordered `{title, text?, facts?}` groups. Keep text escaped and readable. Put substantial detail inside the disclosure. People and Ongoing use the whole record heading as the native disclosure control, matching Places; do not restore a second boxed Details button. Show one reading column with a subtle left rule inside open records. Use drawn chevrons, comfortable tap targets and keyboard focus; hover emphasis belongs only on devices with real hover. Keep nested places bounded on small screens. Existing artwork stays within the appearance section, at a comfortable portrait width; never promote private art automatically.

**People**

- At a glance: name, `context` (timeline), role/relationship summary, status.
- Details: Identity & appearance; Power & known forms; Relationship & current circumstances; collapsed Encounters.
- Keep approved artwork with Identity & appearance. Do not infer race, biography or new visits from scenery.
- Preserve assessed versus scanned labels. If a timeline or age is genuinely unrecorded publicly, say so rather than inventing it.

**Places**

- At a glance: name, containing location/timeline, one-sentence purpose.
- Details: Description where recorded; Location & access where useful; Current circumstances where recorded; collapsed Visits. `visitRecord` preserves existing visit notes; `history` links journal entries. Omit empty sections.
- `parentId` owns the geographical hierarchy. Search opens the containing chain.
- Do not repeat Location and Position as two prominent boxes. Keep useful route/access detail once. Do not repeat boilerplate about unknown coordinates for every nested location.
- Artwork belongs with Description. Its daylight or scenery does not change the current clock.

**Ongoing**

- At a glance: name, status, `nextStep`.
- Details: Purpose; People involved; Progress; Dependencies; collapsed Milestones when recorded.
- `completed: true` moves finished work into the collapsed Completed group. Completion of a mission does not imply completion of subsequent restoration or an associated investigation; state any remaining monitoring.
- No invented deadlines, appointments, rewards or outcomes to fill fields.

## Inventory, resources and other disclosures

Inventory and Resources use the same whole-heading native disclosure as World: status, name and a concise summary when closed; facts and provenance in one reading column when open. Preserve stable record IDs and expansion keys, storage states and every acquisition fact. The Dragon Ball collection remains one entry with its seven-ball tracker. Do not add a second Details button or a decorative capsule above Resources.

Character background, collection notes and Story's longer records use quiet full-width disclosure text with drawn chevrons, subtle dividing rules and no boxed button styling. Story calls its disclosure Read more. Search and power dialogs retain their distinct purposes. Test all sections when changing a shared disclosure rule, not just World.

## Maintenance checks

Read every edited file in full before and after editing. Back up the current publication before restructuring. Preserve unique information and historical evidence; delete only redundant presentation or superseded current facts.

Check all ability rows and dialogs, section order, stage totals, names, artwork loading, search/deep links, World filters, nested places, galleries and Completed. Test narrow phone and desktop layouts, long names, overflow, keyboard opening/Escape/focus return and pointer focus behaviour. Do not disable keyboard focus to remove iPhone tap highlights.

Keep audio, launch, portraits, reward collection and automatic updates intact. No story advancement during maintenance. Review the public data fingerprint, build and validate, publish only manifest files, verify live bytes, and record any device-testing limits.
