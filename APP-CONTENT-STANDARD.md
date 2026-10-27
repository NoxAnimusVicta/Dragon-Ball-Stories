# App content standard

Approved 20 October 2026. This document owns presentation and field placement for the companion. MAINTENANCE.md owns publication, privacy and platform behaviour. Campaign facts remain in their declared owners: campaign.json, inventory.json for current possessions, and the authorised local factual records.

## Mandatory before editing

Read this entire document before **every round of app edits**, including after compaction, then read every affected source file fully. Reread it whenever placement or formatting is uncertain. START-HERE.md and MAINTENANCE.md point here; do not build a second presentation rulebook. Verify the complete edited files and rendered result afterwards.

## Shared headings and labels

The section is named **Techniques** in the menu, navigation, search and page title. Keep the internal `abilities` collection, route, IDs and update expansion keys stable so existing links and saved positions continue to work. Technique dialogs use technique wording in accessible labels too.

Use the same Bangers heading family across all screens. Group headings (Techniques categories, Possessions, Resources, People, Places, Ongoing, Character background and reference groups) use24px desktop/21px phone lettering with a subtle trailing gold rule. Use pale gold on dark backgrounds and dark teal on pale panels. Detail section headings and disclosure labels use20px Bangers with modest spacing; record names remain more prominent. Plain summaries, context, dates and field values retain the readable body face. Preserve drawn chevrons and keyboard focus. Do not add decorative slogans or new boxed headers.

Visible section headings, field labels and disclosure labels use Title Case, including Appearance History, Stages & Power, Identity & Appearance and Read More. The renderer capitalises structured display labels without changing source keys, stored prose, proper-name spelling, acronyms, or historical journal titles. Do not use a global CSS text-transform on all content. Apply this contract to new screens and nested Places as well as the top-level categories.

### Canonical naming checks

Use **Campaign Power Reference** for the Character link, reference page title, browser title and search result. Keep its route `scale` and Character section number01. **Power Level** names the metric and its detail dialog; NPC gallery captions spell it out too. **Appearance History** names both protagonist and NPC history tabs. Artwork captions receive the same Title Case treatment as other record names. Search must use the same displayed record name as its destination, including **TL-0042-045-A0503 · Yamcha’s Home**.

Before release, audit Main Menu, Character/forms/history, Techniques/dialogs, Inventory/Resources/collection, World/People/Places/Ongoing/Completed, Story, search, the power reference and About. Check headings, field labels, captions, accessible names and fallback labels together. Run the naming regression checks as well as normal publication validation. Keep **TP-RS-647**, **Conton City Dragon Balls**, **Time Patrol Communicator Pin**, **Supreme Kai of Time**, **Conton City**, **Unknown Timelines** and the established clustered timeline catalogue labels consistent. A hub description such as “Time Patrol hub” is valid prose, not an alternative place name. Preserve dated journal titles, counterpart qualifiers, proper-name spelling, internal routes/IDs, reference calculation aliases and exact historical transcripts. Never publish an unrevealed place or form merely to standardise its label. Generated continuity uses **Technique records**.

## One home per fact

Power Level belongs on Character, not in the ability collection. Current base is `character.battlePower`; `character.forms` holds each revealed stage and its total multiplier. Ability `formIds` reference those records. Calculate stage output from the current base with exact decimal arithmetic; never copy a current total into several display strings. Historical readings retain their date, measurement conditions and original value.

Ordinary Kaioken has one technique per phase, named Kaioken x2, Kaioken x3 and so on. Keep each acquired output in `character.forms`, referenced by its corresponding technique; retain lower phases after higher ones are learned. The current legacy ID `kaioken-technique` remains Kaioken x2. Its title override in technique-progress.json is shared by list, dialog, progress accessibility and search; campaign journal wording remains historical. Kaioken remains a separate technique, not a new biological transformation. Never publish a planned form as an inactive unlock.

Forms artwork is ordered by increasing exact total multiplier across all families, with Base first and stable ordering for ties. This applies to Zero and NPCs. Current Zero order: Base, Kaioken ×2, Sealed Channel, Uncontrolled. Kaioken artwork captions identify the actual phase multiplier. Appearance History remains chronological; never infer an unlock from sorting.

## Techniques

Every established ability, including fundamentals, has exactly one compact icon-led row. Assign its `category` by how it is used, independently of energy source and mastery. The ordered groups are:

- `forms` — **Transformation & Amplification**: transformations, channel states and output-amplifying techniques such as Kaioken.
- `ki` — **Ki Techniques**: released energy attacks such as Ki Blasts, Kiai pressure releases, Spirit Bomb and a future Kamehameha.
- `physical` — **Physical Techniques**: named contact attacks, including Spirit Spear and future Wolf Fang Fist or Dragon Fist. Ki or spirit-energy use does not move a contact attack into a second group.
- `spirit-control` — **Spirit Control Techniques**: individually learned Yardrat applications: Instant Transmission, Cloning, Gigantification and Spirit Healing. Ki Control remains in Discipline, with no parent Spirit Control skill.
- `discipline` — **Discipline**: Physical Combat, sensing, suppression, ki control and flight; advanced practices such as future divine-ki handling also fit here. This category does not imply beginner difficulty or low mastery.
- `magic` — **Magical Techniques**: configured for future learned magic, hidden while empty. Do not add a spell or placeholder to reveal it.

Each nonempty group is one vertical list. Keep every ability in exactly one category; the Other Techniques fallback keeps an unclassified record visible for correction. Group headings use Title Case, the existing Bangers typeface and a restrained gold dividing rule. Omit the Techniques tagline rather than adding decorative slogan text. The whole row opens its dialog. Use small square icons (48 pixels on phone, 60 on desktop), subtle separators and no large artwork panels or individual card shadows. Detail headings also keep the icon small. The rounded dialog keeps its heading and 44-pixel close control visible while only its reading area scrolls; keyboard users can focus that area. Use restrained separators, readable line spacing and no nested section boxes. No separate training list, icon sidebar, empty future slots or second record.

At a glance: small icon, name, one short effect sentence, and a slim learning-progress bar with the current tier and next milestone. Remove power-reference/form-navigation buttons from this section; the campaign power-reference link belongs beside Character's power information. Do not display the old mixed Developing/Practised statuses as mastery ranks. Their historical data remains intact; the approved S245 starting assessments now supply tiers independently of those labels. Current capability and limits remain in the dialog.

The dialog header contains the small icon, quiet category text, ability name and one44-pixel close button. No generic ABILITY label, status badge, white inset box or extra toolbar. The header stays fixed while the body scrolls. Display a styled tier label only where an actual numerical starting assessment or earned tier exists. S245 starting assessments were authorised from recorded history; use technique-progress.json, never translate legacy Developing/Practised labels into ranks or guessed percentages. Uncontrolled is an access condition, not a level on the mastery ladder.

### Narrative techniques and learning — 26 October 2026

The mechanical combat system is retired. Remove Second Wind and all four defensive-rotation techniques from lists, details and search. Keep their artwork and past credits in the private archive. Defensive actions and rallying remain narrative possibilities, not skill cards. No new skill gains are awarded by migration.

private/PLAYER-TECHNIQUES.json is the reviewed current player projection. build.py copies it to technique-progress.json; those entries replace the older ability snapshots in campaign.json at runtime. Keep stable IDs for retained techniques. Do not run the retired combat exporter or reintroduce fields from old profiles. Historical journal entries and old dated training records remain history, not current mechanics.

Retain cumulative progress, mastery labels, compact gold/navy gauges and collapsed Path to Mastery. Learning0, Learned10, Proficient250, Advanced2500 and Mastered10000; numbers do not reset at tiers. No Credits/XP/percent units. At Mastered show the label and full bar without a numeric total. Mastered is terminal. Keep unassessed and involuntary states distinct.

Path to Mastery explains technique-specific reliability, control, handling, mobility and efficiency. Retain established output factors, charge ceilings, copy counts and growth capacities. Current Capability shows only the acquired tier; future limits belong in the collapsed path. Learning remains labelled Learning, never Learned. Biological and access gates remain private. Power multiplication is applied once and is not accompanied by a numerical damage stat.

No Endurance amounts, damage numbers, entry fees, upkeep, donation ratios, healing points, recovery charges, rotation weights, action durations, preparation timers, counter allowances or combat range-band machinery in dialogs. Allow one compact Sustained Use · Estimate row for each current form/amplification, sourced from capability.sustainEstimate. Use approximate minutes or an honest unknown for involuntary states. It is a stamina estimate for current mastery, not an activation time, guaranteed duration or countdown. Keep its rationale and historical evidence in the narrator records, not a new app tutorial. Do not duplicate current estimates in future mastery tiers. Explain meaningful qualitative limitations once. Contact/nearby/distant reach is descriptive; Flight's established Max Speed is a travel reference only.

Dialog order: Mastery and collapsed Path to Mastery; Current Capability where useful; Effect; acquired Stages & Power; Appearance; Control & Compatibility; Development and dated history. Keep compact rows, existing artwork and shared typography. No generic rules panel or tutorial text. Anonymous technique art retains obscured identifying facial features; no new art is needed for this migration.

Every update reconciles actual earned totals, current capability and path text. Read edited files fully before and after, verify all technique dialogs and search, then publish. Do not restore retired mechanical fields merely because an old test expects them.

## World

All records retain stable IDs and existing search/deep links. `sections` contains ordered `{title, text?, facts?}` groups. Keep text escaped and readable. Put substantial detail inside the disclosure. People and Ongoing use the whole record heading as the native disclosure control, matching Places; do not restore a second boxed Details button. Show one reading column with a subtle left rule inside open records. Use drawn chevrons, comfortable tap targets and keyboard focus; hover emphasis belongs only on devices with real hover. Keep nested places bounded on small screens. Existing artwork stays within the appearance section, at a comfortable portrait width; never promote private art automatically.

### Timeline browsing

Numbered timelines use the current **TL-FFFF-VVV-CNNNN** catalogue labels in titles and context labels; TL already means Timeline, so never prefix it with that word. Named hubs retain their names. Current human-readable fields are migrated before rendering/search; stable IDs and exact historical journal entries remain intact. The private TIMELINE-ID-MIGRATION.md owns aliases and catalogue assignments. A missing origin stays unknown, and no private family history is published through an abbreviation.

People and Places use native expandable timeline headings, with the shared Bangers face, Title Case, a quiet count and drawn chevron. Keep these as flat rows inside the existing reading panel, not nested cards. Multiple groups may remain open. Preserve group/record expansion while switching World filters or returning from another screen; search and deep links open every containing disclosure. Retain keyboard focus and generous tap targets. Ongoing keeps its existing grouping.

Each person has one explicit `worldGroup`: an existing root Place ID or `unknown-timelines`. Group Conton residents and Patrol staff/family under Conton City; retain their original home timeline in `context`. Native people stay under their own timeline, including native enemies. External hostile agents with unrevealed bases use **Unknown Timelines**; this does not claim a shared origin, organisation or current physical location. Captivity stays in the individual record. Never disclose an unrevealed hub through a label, source field or asset. New named groups require a reviewed root Place record; unassigned people remain visible in the Unknown fallback but must be corrected during maintenance.

Places reuse their root `parentId` hierarchy as the group itself, with no duplicate wrapper or record. The count is the number of contained places, excluding the root. Opening a group shows the locations first; the root’s summary, circumstances, access, artwork and history remain in **About Conton City** or **About This Timeline** beneath them. Omit empty groups. People counts include each person once. Group labels describe a hub or timeline; they are independent of temporary whereabouts or allegiance changes. `timeline-503` displays **TL-0042-045-A0503 · Yamcha’s Home** in both views without renaming the underlying timeline record.

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

Current possession records are owned by inventory.json, with schemaVersion, recordedThrough and records. It replaces the dated inventory snapshot in campaign.json at runtime and in generated summaries; never maintain both as current. Each item has location `carried` or `room-214`. Show **On You** and **Stored in Room 214** as two ordinary panels, then Resources alongside on desktop and below on phone. Worn items belong On You. Contents retain their own stable records and can name their container in details. The Dragon Ball tracker remains separate and shows its existing storage, without duplicating the collection in either list. Moving an item updates its location, status and any current-location prose together, preserving provenance.

Inventory and Resources use the same whole-heading native disclosure as World: status, name and a concise summary when closed; facts and provenance in one reading column when open. Preserve stable record IDs and expansion keys, storage states and every acquisition fact. The Dragon Ball collection remains one entry with its seven-ball tracker. Do not add a second Details button or a decorative capsule above Resources.

Character background, collection notes and Story's longer records use quiet full-width disclosure text with drawn chevrons, subtle dividing rules and no boxed button styling. Story calls its disclosure Read More. Search and power dialogs retain their distinct purposes. Test all sections when changing a shared disclosure rule, not just World.

## Maintenance checks

Read every edited file in full before and after editing. Back up the current publication before restructuring. Preserve unique information and historical evidence; delete only redundant presentation or superseded current facts.

Check all ability rows and dialogs, section order, stage totals, names, artwork loading, search/deep links, World filters, nested places, galleries and Completed. Test narrow phone and desktop layouts, long names, overflow, keyboard opening/Escape/focus return and pointer focus behaviour. Do not disable keyboard focus to remove iPhone tap highlights.

Keep audio, launch, portraits, reward collection and automatic updates intact. No story advancement during maintenance. Review the public data fingerprint, build and validate, publish only manifest files, verify live bytes, and record any device-testing limits.

## Retained technique distinctions

Physical Combat belongs to Discipline and covers ordinary strikes, combinations and heavy blows. Ki Blasts covers ordinary unnamed ki shots, volleys and beams. Named Physical and Ki Techniques retain their individual methods. Spirit Control Techniques groups the four Yardrat applications; Ki Control remains its own Discipline, not a fifth Spirit Control technique. Preserve all earned progress and supplied art. Forms and amplifications retain their individual factors and acquired access, with narrative strain/control rather than numerical costs.
