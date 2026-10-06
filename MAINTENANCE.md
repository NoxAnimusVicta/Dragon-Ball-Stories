# Companion maintenance

## Source and publication

campaign.json is the authoritative public data source. Edit confirmed facts there; never invent missing values to fill a panel. Null means unknown. An empty collection means no records, not proof that the character owns nothing or cannot do anything.

The complete local campaign-source folder holds build.py, verify.py, the handbook and private material. Only its public/ contents listed in public-manifest.json are uploaded. Run `python build.py` then `python verify.py` from that local source folder. This generates readable summaries without advancing time or altering story state.

GitHub Pages publishes main / (root). Relative asset paths support the /Dragon-Ball-Stories/ project prefix. When changing CSS or JavaScript, increment their query versions in index.html. Data is fetched with cache: no-store. There is deliberately no service worker, offline mode, analytics or device-local character editing.

## Character art

Place the supplied, approved image directly in public/ with a stable filename, such as jake-portrait.webp. Set character.portrait to that relative filename and provide a descriptive character.portraitAlt. Add the filename to both manifests. The image is displayed with object-fit: contain and can be opened in a full-art dialog. Null displays the intentional placeholder. Only images within this site's project directory are accepted; a broken image shows a readable fallback.

## Character and story fields

character: name, age, height, heightMetric, heightApproximate, portrait, portraitAlt, race, origin, appearance, personality, backstory, arrival, motivation, knowledge, limitations.

story: era, date, location, situation, pendingChoice. Set started=true only after an enacted opening scene, and update phase to the actual story phase. Do not use real-world time as a story date.

Only Jake's first name, age and approximate height are authorized real-world carryover. Do not include surname, birthday, address, contact information, real-world location, occupation or other personal details. Artwork and remaining character facts come from the user.

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

IDs use lowercase letters, digits and hyphens and are unique across collections. Search links directly to a record and focuses it. Text is escaped before rendering, so source text never becomes executable HTML. Separate carried and stored items, personal and other accounts, established abilities and potential. Record sums and calculations in authoritative ledgers, not only in a display string. Keep private motives and hidden outcomes out of public data.

## Release check

1. Read changed records fully; reconcile current summaries and accepted corrections.
2. Run the local build and verification tools. Review the exact public file set.
3. Preview via a local HTTP server on a fresh port and under a project prefix. Avoid an old localhost origin with another project's service worker.
4. Check all six sections, search including no results, character briefing, keyboard navigation, dialogs and phone layouts. Test the portrait workflow when adding art.
5. Upload only manifest-listed files, commit, verify the GitHub deployment and compare live assets with local source hashes.
6. Record the commit, deployment and limitations in the local private publication log. Never upload that log or the complete transcript.

## Game menu presentation

The illustrated backdrop is decorative; never infer geography, possessions or affiliations from it. The one-star icon is unchanged. Bangers and the backdrop are local assets listed in the manifest. Motion can be paused and the system reduced-motion preference is respected. Menu sounds require explicit opt-in and are off on every fresh load. Arrow keys move menu focus, Enter follows links, Escape returns to the main menu or dismisses a dialog. Standard Tab navigation remains available. The world radar's numbered links correspond to menu destinations, not story coordinates.
