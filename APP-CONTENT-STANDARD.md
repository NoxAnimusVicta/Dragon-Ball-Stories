# App content standard

Approved 20 October 2026. This document owns presentation and field placement for the companion. MAINTENANCE.md owns publication, privacy and platform behaviour. Campaign facts remain in campaign.json and the authorised local factual records.

## Mandatory before editing

Read this entire document before **every round of app edits**, including after compaction, then read every affected source file fully. Reread it whenever placement or formatting is uncertain. START-HERE.md and MAINTENANCE.md point here; do not build a second presentation rulebook. Verify the complete edited files and rendered result afterwards.

## Shared headings and labels

The section is named **Techniques** in the menu, navigation, search and page title. Keep the internal `abilities` collection, route, IDs and update expansion keys stable so existing links and saved positions continue to work. Technique dialogs use technique wording in accessible labels too.

Use the same Bangers heading family across all screens. Group headings (Techniques categories, Possessions, Resources, People, Places, Ongoing, Character background and reference groups) use24px desktop/21px phone lettering with a subtle trailing gold rule. Use pale gold on dark backgrounds and dark teal on pale panels. Detail section headings and disclosure labels use20px Bangers with modest spacing; record names remain more prominent. Plain summaries, context, dates and field values retain the readable body face. Preserve drawn chevrons and keyboard focus. Do not add decorative slogans or new boxed headers.

Visible section headings, field labels and disclosure labels use Title Case, including Appearance History, Stages & Power, Identity & Appearance and Read More. The renderer capitalises structured display labels without changing source keys, stored prose, proper-name spelling, acronyms, or historical journal titles. Do not use a global CSS text-transform on all content. Apply this contract to new screens and nested Places as well as the top-level categories.

### Canonical naming checks

Use **Campaign Power Reference** for the Character link, reference page title, browser title and search result. Keep its route `scale` and Character section number01. **Power Level** names the metric and its detail dialog; NPC gallery captions spell it out too. **Appearance History** names both protagonist and NPC history tabs. Artwork captions receive the same Title Case treatment as other record names. Search must use the same displayed record name as its destination, including **TL-503 · Yamcha’s Home**.

Before release, audit Main Menu, Character/forms/history, Techniques/dialogs, Inventory/Resources/collection, World/People/Places/Ongoing/Completed, Story, search, the power reference and About. Check headings, field labels, captions, accessible names and fallback labels together. Run the naming regression checks as well as normal publication validation. Keep **TP-RS-647**, **Conton City Dragon Balls**, **Time Patrol Communicator Pin**, **Supreme Kai of Time**, **Conton City**, **Unknown Timelines** and the established TL-### identifiers consistent. A hub description such as “Time Patrol hub” is valid prose, not an alternative place name. Preserve dated journal titles, counterpart qualifiers, proper-name spelling, internal routes/IDs, reference calculation aliases and exact historical transcripts. Never publish an unrevealed place or form merely to standardise its label. Generated continuity uses **Technique records**.

## One home per fact

Power Level belongs on Character, not in the ability collection. Current base is `character.battlePower`; `character.forms` holds each revealed stage and its total multiplier. Ability `formIds` reference those records. Calculate stage output from the current base with exact decimal arithmetic; never copy a current total into several display strings. Historical readings retain their date, measurement conditions and original value.

Kaioken is one ability. Keep every learned stage in `character.forms` and reference each from its ability, including lower stages after higher ones are learned. Kaioken remains a separate technique, not a new biological transformation. Never publish a planned form as an inactive unlock.

## Techniques

Every established ability, including fundamentals, has exactly one compact icon-led row. Assign its `category` by how it is used, independently of energy source and mastery. The ordered groups are:

- `forms` — **Transformation & Amplification**: transformations, channel states and output-amplifying techniques such as Kaioken.
- `ki` — **Ki Techniques**: released energy attacks such as Ki Blasts, Spirit Bomb and a future Kamehameha.
- `physical` — **Physical Techniques**: contact attacks, including Spirit Spear and future Wolf Fang Fist or Dragon Fist. Ki or spirit-energy use does not move a contact attack into a second group.
- `discipline` — **Control & Discipline**: sensing, suppression, ki control, flight and Combat Fundamentals; advanced practices such as future divine-ki handling also fit here. This category does not imply beginner difficulty or low mastery.
- `magic` — **Magical Techniques**: configured for future learned magic, hidden while empty. Do not add a spell or placeholder to reveal it.

Each nonempty group is one vertical list. Keep every ability in exactly one category; the Other Techniques fallback keeps an unclassified record visible for correction. Group headings use Title Case, the existing Bangers typeface and a restrained gold dividing rule. Omit the Techniques tagline rather than adding decorative slogan text. The whole row opens its dialog. Use small square icons (48 pixels on phone, 60 on desktop), subtle separators and no large artwork panels or individual card shadows. Detail headings also keep the icon small. The rounded dialog keeps its heading and 44-pixel close control visible while only its reading area scrolls; keyboard users can focus that area. Use restrained separators, readable line spacing and no nested section boxes. No separate training list, icon sidebar, empty future slots or second record.

At a glance: small icon, name and one short effect sentence. Remove power-reference/form-navigation buttons from this section; the campaign power-reference link belongs beside Character's power information. Do not display the old mixed Developing/Practised statuses as mastery ranks. Their historical data remains intact until the new numerical model and starting-tier migration are approved. Current capability and limits remain in the dialog.

The dialog header contains the small icon, quiet category text, ability name and one44-pixel close button. No generic ABILITY label, status badge, white inset box or extra toolbar. The header stays fixed while the body scrolls. Display a plain tier label only where an actual numerical starting assessment or earned tier exists. General ability-credit migration remains incomplete; do not translate legacy Developing/Practised labels into ranks or guessed percentages. Uncontrolled is an access condition, not a level on the mastery ladder.

Dialog order:

1. **Effect** — `effect`: what it does and how it is used.
2. **Stages & Power** — `formIds`: learned stages from the Character calculation source.
3. **Appearance** — `appearance`: body, aura, hand gesture and energy changes.
4. **Control & Compatibility** — `control`: demonstrated endurance, activation conditions and stacking.
5. **Development** — `development`: concise current focus; collapsed linked `history` events and, where needed, a dated `trainingRecord`.

Omit sections that do not apply. Do not invent an appearance, multiplier or maximum to fill a field. Both Dark Factor records receive the same appearance/control treatment.

S240 combat reference: `combat-reference.json` is the reviewed public rules projection, generated alongside `COMBAT-AND-TRAINING.md` from the local exporter. Keep one collapsed Training & Combat disclosure after the ability groups, with searchable topic disclosures and a static-reference link. Combat Fundamentals alone displays Zero's recorded defensive rotation tiers/credits and unfamiliar-opponent conditional weights. Do not create four duplicate ability rows or an active stance selector. Spirit Spear, Kaioken and Ki Sensing receive short Technique Rules sections from the same projection. Reference ceilings are not acquired stages or newly demonstrated performance. Actual opponent familiarity, hidden NPC loadouts and saved rolls remain private. These additions do not restore power-navigation buttons to Techniques.

`history` contains stable event IDs, not copied journal entries. `trainingRecord` preserves unique older observations in a collapsed dated record; it is historical, not a second current status. Update current fields when capability changes. Append a dated observation or link a new event; do not silently rewrite the old record as if it had always used the latest base.

Artwork: `artwork`, `artworkAlt`, local manifest-listed asset. Cel-shaded illustration, clear silhouette, no baked-in labels or frames. Symbolic fundamentals are not character portraits or evidence of a new power. Spirit Bomb depicts a sphere above raised hands; Spirit Spear depicts spirit energy gathering into the hand and spreading over the front of the palm and fingers for contact release; the skin remains visible rather than the whole hand glowing, not a floating orb or literal spear. Preserve originals privately and publish optimised, metadata-free copies.

## World

All records retain stable IDs and existing search/deep links. `sections` contains ordered `{title, text?, facts?}` groups. Keep text escaped and readable. Put substantial detail inside the disclosure. People and Ongoing use the whole record heading as the native disclosure control, matching Places; do not restore a second boxed Details button. Show one reading column with a subtle left rule inside open records. Use drawn chevrons, comfortable tap targets and keyboard focus; hover emphasis belongs only on devices with real hover. Keep nested places bounded on small screens. Existing artwork stays within the appearance section, at a comfortable portrait width; never promote private art automatically.

### Timeline browsing

Numbered timelines use **TL-###** in titles and context labels; TL already means Timeline, so never prefix it with that word. Named hubs retain their names.

People and Places use native expandable timeline headings, with the shared Bangers face, Title Case, a quiet count and drawn chevron. Keep these as flat rows inside the existing reading panel, not nested cards. Multiple groups may remain open. Preserve group/record expansion while switching World filters or returning from another screen; search and deep links open every containing disclosure. Retain keyboard focus and generous tap targets. Ongoing keeps its existing grouping.

Each person has one explicit `worldGroup`: an existing root Place ID or `unknown-timelines`. Group Conton residents and Patrol staff/family under Conton City; retain their original home timeline in `context`. Native people stay under their own timeline, including native enemies. External hostile agents with unrevealed bases use **Unknown Timelines**; this does not claim a shared origin, organisation or current physical location. Captivity stays in the individual record. Never disclose an unrevealed hub through a label, source field or asset. New named groups require a reviewed root Place record; unassigned people remain visible in the Unknown fallback but must be corrected during maintenance.

Places reuse their root `parentId` hierarchy as the group itself, with no duplicate wrapper or record. The count is the number of contained places, excluding the root. Opening a group shows the locations first; the root’s summary, circumstances, access, artwork and history remain in **About Conton City** or **About This Timeline** beneath them. Omit empty groups. People counts include each person once. Group labels describe a hub or timeline; they are independent of temporary whereabouts or allegiance changes. `timeline-503` displays **TL-503 · Yamcha’s Home** in both views without renaming the underlying timeline record.

**People**

- At a glance: name, `context` (timeline), role/relationship summary, status.
- Details: Identity & Appearance; Power & Known Forms; Relationship & Current Circumstances; collapsed Encounters.
- Keep approved artwork with Identity & Appearance. Do not infer race, biography or new visits from scenery.
- Preserve assessed versus scanned labels. If a timeline or age is genuinely unrecorded publicly, say so rather than inventing it.

**Places**

- At a glance: name, containing location/timeline, one-sentence purpose.
- Details: Description where recorded; Location & Access where useful; Current Circumstances where recorded; collapsed Visits. `visitRecord` preserves existing visit notes; `history` links journal entries. Omit empty sections.
- `parentId` owns the geographical hierarchy. Search opens the containing chain.
- Do not repeat Location and Position as two prominent boxes. Keep useful route/access detail once. Do not repeat boilerplate about unknown coordinates for every nested location.
- Artwork belongs with Description. Its daylight or scenery does not change the current clock.

**Ongoing**

- At a glance: name, status, `nextStep`.
- Details: Purpose; People Involved; Progress; Dependencies; collapsed Milestones when recorded.
- `completed: true` moves finished work into the collapsed Completed group. Completion of a mission does not imply completion of subsequent restoration or an associated investigation; state any remaining monitoring.
- No invented deadlines, appointments, rewards or outcomes to fill fields.

## Inventory, resources and other disclosures

Inventory and Resources use the same whole-heading native disclosure as World: status, name and a concise summary when closed; facts and provenance in one reading column when open. Preserve stable record IDs and expansion keys, storage states and every acquisition fact. The Dragon Ball collection remains one entry with its seven-ball tracker. Do not add a second Details button or a decorative capsule above Resources.

Character background, collection notes and Story's longer records use quiet full-width disclosure text with drawn chevrons, subtle dividing rules and no boxed button styling. Story calls its disclosure Read More. Search and power dialogs retain their distinct purposes. Test all sections when changing a shared disclosure rule, not just World.

## Maintenance checks

Read every edited file in full before and after editing. Back up the current publication before restructuring. Preserve unique information and historical evidence; delete only redundant presentation or superseded current facts.

Check all ability rows and dialogs, section order, stage totals, names, artwork loading, search/deep links, World filters, nested places, galleries and Completed. Test narrow phone and desktop layouts, long names, overflow, keyboard opening/Escape/focus return and pointer focus behaviour. Do not disable keyboard focus to remove iPhone tap highlights.

Keep audio, launch, portraits, reward collection and automatic updates intact. No story advancement during maintenance. Review the public data fingerprint, build and validate, publish only manifest files, verify live bytes, and record any device-testing limits.
