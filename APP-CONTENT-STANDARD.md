# App content standard

Approved 20 October 2026. This document owns presentation and field placement for the companion. MAINTENANCE.md owns publication, privacy and platform behaviour. Campaign facts remain in campaign.json and the authorised local factual records.

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

- `forms` — **Transformation & Amplification**: transformations, channel states and output-amplifying techniques such as Kaioken and Kiai.
- `ki` — **Ki Techniques**: released energy attacks such as Ki Blasts, Spirit Bomb and a future Kamehameha.
- `physical` — **Physical Techniques**: contact attacks, including Physical Combat, Spirit Spear and future Wolf Fang Fist or Dragon Fist. Ki or spirit-energy use does not move a contact attack into a second group.
- `discipline` — **Discipline**: sensing, suppression, ki control and flight; advanced practices such as future divine-ki handling also fit here. This category does not imply beginner difficulty or low mastery.
- `magic` — **Magical Techniques**: configured for future learned magic, hidden while empty. Do not add a spell or placeholder to reveal it.

Each nonempty group is one vertical list. Keep every ability in exactly one category; the Other Techniques fallback keeps an unclassified record visible for correction. Group headings use Title Case, the existing Bangers typeface and a restrained gold dividing rule. Omit the Techniques tagline rather than adding decorative slogan text. The whole row opens its dialog. Use small square icons (48 pixels on phone, 60 on desktop), subtle separators and no large artwork panels or individual card shadows. Detail headings also keep the icon small. The rounded dialog keeps its heading and 44-pixel close control visible while only its reading area scrolls; keyboard users can focus that area. Use restrained separators, readable line spacing and no nested section boxes. No separate training list, icon sidebar, empty future slots or second record.

At a glance: small icon, name, one short effect sentence, and a slim learning-progress bar with the current tier and next milestone. Remove power-reference/form-navigation buttons from this section; the campaign power-reference link belongs beside Character's power information. Do not display the old mixed Developing/Practised statuses as mastery ranks. Their historical data remains intact; the approved S245 starting assessments now supply tiers independently of those labels. Current capability and limits remain in the dialog.

The dialog header contains the small icon, quiet category text, ability name and one44-pixel close button. No generic ABILITY label, status badge, white inset box or extra toolbar. The header stays fixed while the body scrolls. Display a styled tier label only where an actual numerical starting assessment or earned tier exists. S245 starting assessments were authorised from recorded history; use technique-progress.json, never translate legacy Developing/Practised labels into ranks or guessed percentages. Uncontrolled is an access condition, not a level on the mastery ladder.

### Learning progress — 23 October 2026

The app is designed for its single owner, not onboarding a public audience. Show the existing numeric progress as **650 / 2,500**, with no Credits, XP, EXP, units, displayed percentages or explanatory assessment prose. Keep numerical credit accounting and provenance in the source records. Use a compact gold energy gauge on a deep blue track at every rank; do not map low/high learning to green/red or a danger scale. Bangers rank labels, tabular numeric values, angled segmented tracks and a quiet Next rank label fit the established game UI. Maintain the compact icon-led rows, no extra cards or second training list. The fill measures the interval between the current tier and next threshold; displayed numbers retain cumulative values. Mastery details use the same gauge and a collapsed **Path to Mastery** list of technique-specific benefits, with a subtle gold marker for the current rank. No numeric tier thresholds or credit units in that ladder. Do not disclose hidden future techniques or prerequisites. The header displays the character name alone; remove Player 01 everywhere and do not add a character switcher.

`technique-progress.json` owns the public credit assessment keyed by the existing ability ID. `combat-reference.json.tiers` remains the single threshold source. Null credits mean unassessed, never zero or a guessed percentage: show Not Yet Assessed without a numeric track and preserve all demonstrated capabilities. An involuntary manifestation uses Involuntary with no numeric mastery bar. Each ordinary Kaioken phase has its own cumulative progress on the normal mastery ladder. Mastery of the predecessor gates successor attempts; no duplicate conditioning bar or parent credit award. Starting estimates require explicit assessment provenance and approval; no legacy Developing/Practised conversion. After mastery retain the Mastered label, full meter and cumulative total; do not invent another tier or promise an unapproved refinement benefit. Failed optional progress loading must leave technique browsing usable and report unavailable assessment rather than fabricated progress.

#### Uniform phase and rotation progress

Each ordinary Kaioken phase and each defensive rotation is its own technique. Evasive, Bulwark, Deflection and Riposte belong to Discipline, each with distinct art, the shared overall progress gauge and its own Path to Mastery. Retain existing cumulative totals; do not award progress for reorganising the app. Remove the nested rotation bars from Physical Combat so there is exactly one progress owner/display per technique. No stance selector is needed.

The existing progress record may contain an explicit public `entry` for an acquired technique absent from the historical campaign snapshot. Build and app merge these by stable ID exactly once; search/deep links use the same merged list. This avoids rewriting historical story data to add an already-established technique. The progress file owns totals; the combat reference derives its rotation summary from those records. Private mastery profiles own numerical capabilities. Optional progress loading failure must not fabricate entries or ranks.

For every update reconcile owner → calculator → public projection → rendered details in one pass. Verify numerical cost, activation, total charge, fixed damage, capacity and zero-cost recovery before release. Remove stale current descriptions, while retaining dated observations in history. Background combat learning and donor bookkeeping remain out of dialogs. Never use a demonstrated duration in place of expenditure, or call activation “Cold Activation”. Forms show one Endurance Drain rate. Uncontrolled has explicit zero; controlled Channel has a regulation cost, derived from its8/4/2/1 per-minute mastery anchors. Never render an unresolved rate as zero. Recovery shows its fixed per-use amount, reserves and recharge, without an Endurance Cost row or random recovery range. Never add activation expenditure or an exertion surcharge. A negative or missing field is a defect to resolve, not a fallback attack cost.

Every training update reconciles the public credit record with its private evidence, earned session allocation and current capability before building. New abilities receive reviewed milestone benefits and an explicit credit state. Preserve hidden NPC profiles and plot information. Test tier boundaries, zero versus unknown, mastery overflow, Kaioken phase mastery gates, involuntary states and narrow-screen/focus behaviour.

Dialog order:

0. **Mastery** — rank and sole numeric progress bar; collapsed Path to Mastery last within this section.
1. **Current Capability** — prominent regular output and current charge ceiling for chargeable techniques; useful per-use impact/expenditure, Kiai boost/buildup/upkeep or recovery allowance where applicable. Derive the current row from cumulative progress and the acquired method profile. Spirit Bomb shows its finite tier containment multiplier, fixed base damage, costs and collection/preparation times, constrained by actual supply. Below Learned, title the section Learning Capability and show only the current Learning stats, including actual preparation and failure risk. Do not display Learned or Mastered stats beside them, or label Learning experimental. Hide Path to Mastery until Learned. Below10 label the release and preparation Learning Release and Learning Preparation, never Regular or Learned. At10 these become Regular Release and Regular Preparation and the heading switches to Current Capability and the Learning failure-risk row disappears. Explicitly mark unsettled damage/cost calibration; never present an unapproved proposal as an acquired statistic.
2. **Effect** — `effect`: what it does and how it is used.
3. **Stages & Power** — `formIds`: learned stages from the Character calculation source.
4. **Appearance** — `appearance`: body, aura, hand gesture and energy changes.
5. **Control & Compatibility** — `control`: demonstrated endurance, activation conditions and stacking.
6. **Development** — `development`: concise current focus; collapsed linked `history` events and, where needed, a dated `trainingRecord`.

For every numerical attack, Current Capability uses the same field order: Regular Release/Attack Output; Current Charge Limit when applicable; **Base Endurance Damage**; Endurance Cost; Regular Preparation; Full Charge · Total; then, for Learned or higher attacks where useful, the acquired technique’s Mastered Charge Limit. Learning shows only the current tier. Base Endurance Damage is the fixed intrinsic value before power-gap scaling, never a regular-to-charged range. Charge temporarily raises the user’s Power Level for that technique; final damage is calculated against an actual defender through the combat owner's scaling rule. Show the cost range from regular to the current accessible ceiling separately. Do not calculate damage as damage×charge/regular, show Damage · Equal Power, or reuse an already-scaled historical result as the intrinsic stat. Spirit Spear's migrated intrinsic value is9.5; the former19 already included its regular×2 output against equal bodies.

Full-charge time includes setup, never only additional gathering. Derive interpolated timers from cumulative mastery progress only. Movement-speed scaling must never shorten charge or transformation preparation. Store and interpolate regular and total full preparation independently; additional charge is their difference. Ordinary damage can develop through its recorded mastery table; that is distinct from charge amplification. Keep actual supply, contact and movement requirements concise. Ordinary combinations have no invented charge timer. Forms show multiplier, Activation Time and one ongoing Endurance Drain; Kiai shows boost/buildup/upkeep, recovery its allowance/recharge; do not force irrelevant attack fields into these methods.

All applicable acquired-profile fields must be allowlisted together by build.py. Tests must cover tier boundaries, intermediate progress, costs, damage, total time, power scaling and missing assessment. An omitted field is a presentation defect, not permission to invent a value. Explicitly unresolved coefficients remain labelled pending; proposals are never silently installed. On every training update regenerate capabilities and verify the displayed numbers against the full private owner. A phase-specific title must match row, dialog, search and progress labels. Preserve artwork until a new phase is actually introduced.

Keep current capability near the top, after mastery and before Effect. Use flat aligned figures with the same heading family; no rules appendix or nested cards. Unassessed ranks must not receive guessed numbers. Current multipliers/charge ceilings update from the recorded tier automatically; distinguish a learned ceiling from the acquired method’s mastered potential. Keep individual form factors in character.forms.

The private mastery profile is the detailed stage owner; build.py projects only explicitly allowlisted fields for acquired player methods. Before changing progression, reconcile that profile, the current progress record and public milestone text together. NPC records and future prerequisites stay private. Detailed stage descriptions must state handling, supply, timing, costs and any genuine unresolved calibration explicitly. Never silently convert a proposal to a settled number.

Describe what techniques do in positive, concrete language. Retain material safety, compatibility, supply and reliability limits once where they help a decision; remove obvious denials and duplicate negative boilerplate. Potential release increases overall fighting capacity, including endurance, while technique mastery is separately trained.

Use anti-aliased angled separators on untransformed progress tracks; avoid skewing the entire rasterised bar. The dark outer silhouette and separately inset inner silhouette must preserve both slanted end outlines at zero, partial and full fill; clipping a rectangular border alone loses the diagonal edges. Check both 9px and 12px gauges on narrow and desktop layouts. Preserve gold/navy colour and raw numeric progress.

Omit sections that do not apply. Do not invent an appearance, multiplier or maximum to fill a field. Both Dark Factor records receive the same appearance/control treatment.

Signature presentation: keep any published default in the existing technique details, never a duplicate ability row or mandatory selector. The working convention is one signature attack per active form/loadout, Physical or Ki only; Discipline and Transformation & Amplification are excluded. Form overrides reference already acquired techniques; absent overrides inherit the default. Private NPC preferences remain private. The category label is Discipline; internal discipline IDs remain stable.

S240 combat reference: `combat-reference.json` is the reviewed public rules projection, generated alongside `COMBAT-AND-TRAINING.md` from the local exporter. General combat and training explanations belong in the GitHub documentation only. Do not render a Training & Combat panel, index its rules topics in app search or link to removed rule disclosures. Keep actual technique capabilities, development and earned progress in their existing detail views. Defensive rotations have their own Discipline technique rows and art. Physical Combat contains no duplicate rotation bars. Detailed probability tables and assessment provenance stay in the reference documentation; the technique may state its preferred response and trained preference weight. No active stance selector. Never append Technique Rules sections to any technique dialog. Their background mechanics remain in the reference documentation; retain actual learned effects, control and development in the normal fields. Reference ceilings are not acquired stages or newly demonstrated performance. Actual opponent familiarity, hidden NPC loadouts and saved rolls remain private. These additions do not restore power-navigation buttons to Techniques.

`history` contains stable event IDs, not copied journal entries. `trainingRecord` preserves unique older observations in a collapsed dated record; it is historical, not a second current status. Update current fields when capability changes. Append a dated observation or link a new event; do not silently rewrite the old record as if it had always used the latest base.

**Reusable technique illustration contract:** all technique art uses anonymous figures with identifying facial details fully shadowed or omitted, including eyes, distinctive facial lines and recognisable character-specific hair silhouettes. This is reusable technique art, not Goku or another named fighter. Evasive shows a readable evasion; Riposte a clear immediate physical reply. Bulwark shows an actual braced limb/body guard receiving a strike, without an energy shield. Deflection shows one incoming attack changing direction at the visible contact point, with coherent incoming/outgoing paths; no return-to-origin counter masquerading as parry. Inspect both full-size originals and small app icons. Preserve superseded originals privately, not as alternate current assets.

Artwork: `artwork`, `artworkAlt`, local manifest-listed asset. A technique-progress record may supply its reviewed technique-specific artwork override; both list and dialog use the shared techniqueArt resolver, falling back to campaign artwork if the optional progress file is unavailable. Kiai and Second Wind have distinct symbolic icons, not portraits or new forms. Cel-shaded illustration, clear silhouette, no baked-in labels or frames. Symbolic fundamentals are not character portraits or evidence of a new power. Spirit Bomb depicts a sphere above raised hands; Spirit Spear depicts spirit energy gathering into the hand and spreading over the front of the palm and fingers for contact release; the skin remains visible rather than the whole hand glowing, not a floating orb or literal spear. Preserve originals privately and publish optimised, metadata-free copies.

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

Inventory and Resources use the same whole-heading native disclosure as World: status, name and a concise summary when closed; facts and provenance in one reading column when open. Preserve stable record IDs and expansion keys, storage states and every acquisition fact. The Dragon Ball collection remains one entry with its seven-ball tracker. Do not add a second Details button or a decorative capsule above Resources.

Character background, collection notes and Story's longer records use quiet full-width disclosure text with drawn chevrons, subtle dividing rules and no boxed button styling. Story calls its disclosure Read More. Search and power dialogs retain their distinct purposes. Test all sections when changing a shared disclosure rule, not just World.

## Maintenance checks

Read every edited file in full before and after editing. Back up the current publication before restructuring. Preserve unique information and historical evidence; delete only redundant presentation or superseded current facts.

Check all ability rows and dialogs, section order, stage totals, names, artwork loading, search/deep links, World filters, nested places, galleries and Completed. Test narrow phone and desktop layouts, long names, overflow, keyboard opening/Escape/focus return and pointer focus behaviour. Do not disable keyboard focus to remove iPhone tap highlights.

Keep audio, launch, portraits, reward collection and automatic updates intact. No story advancement during maintenance. Review the public data fingerprint, build and validate, publish only manifest files, verify live bytes, and record any device-testing limits.

## 24 October presentation correction

Keep multiplier arithmetic and cost-accounting explanations in background rules. Ordinary attack descriptions are technique-specific: Physical Combat describes ordinary strikes, combinations and heavy blows; Ki Blasts describes ordinary unnamed shots, volleys, concentrated blasts and beams. These are narrative variations of the same bounded attack, not new charge or damage modes. Never reuse a description naming both in both dialogs. Kaioken must have positive activation below Mastered, independent of movement speed. One state drain per active interval; attack costs are not multiplied by an extra exertion surcharge. Retain bodily injury as a separate consequence. Verify these conditions in rendered dialogs, not merely source text.

Current ordinary technique labels are Physical Combat and Ki Blasts; retain stable IDs combat-basics and ki-blast and all existing progress/art. Physical Combat belongs to Physical Techniques. A reviewed progress record may override title, category, summary, effect and control for current presentation; app rows, details and search must use those same values. Keep historical training/journal wording intact. Show one per-attack damage/cost profile, without a heavy-attack selector or duplicate stats. Mouth delivery requires existing handling; a named distinct method keeps its own profile. The45-second engagement and character hesitation rules stay in background documentation, not technique dialogs.

Recovery presentation: show the fixed amount,45-second Recovery Time and per-slot recharge; omit a zero Endurance Cost row. State concisely that a100-plus hit bypasses Second Wind. Forms/Kaioken show immediate reactivation within15minutes of leaving that same state, including exhaustion. Detailed terminal ordering, overflow, interruption and pending-slot bookkeeping belong in the background combat reference. Generate these numbers from the mastery profiles, never duplicate handwritten values.
