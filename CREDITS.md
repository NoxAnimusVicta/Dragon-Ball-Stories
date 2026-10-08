# Artwork and design credits

## App icon

Dragon ball.svg, a one-star Dragon Ball illustration by Frédéric Mahé (13 August 2009), from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dragon_ball.svg).

License: [Creative Commons Attribution 3.0 Unported](https://creativecommons.org/licenses/by/3.0/).

The SVG is retained unchanged. icon-180.png, icon-192.png and icon-512.png are resized PNG renditions of the same artwork. No endorsement is implied.

## Visual research

These references informed the design; their screenshots are not distributed with the app.

- [Official Dragon Ball: Dr. Brief](https://en.dragon-ball-official.com/news/01_2148.html) — Capsule Corporation and its inventions.
- [Capsule Corporation visual reference](https://fictionalbrandsarchive.com/item.php?id=85) — rounded cream architecture, dark labels and blue window bands.
- [Dragon Ball Z: Kakarot character menu](https://gamergen.com/actualites/24h-sur-gamergen-telechargements-stadia-video-dragon-ball-kakarot-bonus-red-dead-redemption-2-307589-1) — prominent character art and grouped information.
- [Official Dragon Ball: Sparking! ZERO menu screenshots](https://dragon-ball-official.com/news/01_4325.html) — character focus, clear selection and compact technique panels.

The interface itself is implemented in HTML, CSS and JavaScript. No game screenshots or game UI textures are bundled. zero-portrait.jpg is the fictional character artwork supplied and approved by the user. Its pixels are unchanged; identifying metadata was removed from the publication copy. The updated portrait includes Zero’s recovered red scouter. Its Capsule Corp background matches the established arrival setting, but does not establish his current location, an affiliation, a new visit or repairs to clothing. The public copy retains the supplied image pixels and dimensions; the original remains private.

Unofficial personal fan project. Dragon Ball, Capsule Corporation and related characters belong to their respective rights holders. No affiliation or endorsement. The icon's license does not claim ownership of the underlying franchise.

## Launch screen

The seven-ball ring uses original artwork with one through seven red stars and amber gradients. Canvas textures for the balls, white-gold light rays and tapered flight trails are prepared when the screen opens. Those same elements remain in place through rest, touch, charge and flight; native browser animations change their opacity and position without redrawing them or replacing the artwork on release. Inline SVG supplies a fallback ring. A soft glow responds to holding the centre symbol, and releasing starts enabled audio and the launch sequence. The removed oval and curved painted highlights are not used. The launch artwork does not reuse the Wikimedia icon. The orange screen is decorative; keyboard activation and reduced-motion settings are supported.

## Illustrated menu backdrop

menu-world.webp was generated for this project with OpenAI's built-in image generation tool, then encoded as WebP. It depicts decorative menu scenery, not an established story location. The original generated PNG is retained locally.

Prompt: Create a premium background illustration for an unofficial Dragon Ball inspired interactive story game menu. Wide 16:9 landscape, exquisite hand painted cel shaded 1990s adventure anime background. View from grassy plateau toward a sun drenched turquoise bay and huge rounded emerald limestone mountains, distant blue ocean, dramatic fluffy white clouds in a luminous cyan sky. On the right middle ground a charming retro futuristic white spherical capsule house with curved teal windows, orange roof trim, palms and a winding cream road. Foreground right windswept grass, tiny flowers and rocks. Warm summer optimism, saturated green and cyan, clean ink outlines, painterly texture with careful lighting and depth. Strong composition: horizon mid-height, spectacular scenery most detailed center and right, left third relatively open sky and distant soft mountains suitable for menu overlay. No people, no characters, no silhouettes, no text, no logos, no symbols, no UI, no border, no dragon balls. This is decorative menu scenery only, not a literal story location. Landscape should feel expansive, cinematic, joyful, magical and inviting, never photorealistic or generic corporate vector art.

## Typeface and sound

[Bangers](https://fonts.google.com/specimen/Bangers) by Vernon Adams, redistributed under the SIL Open Font License 1.1. Font and FONT-LICENSE.txt are included locally. Font source: https://github.com/google/fonts/tree/main/ofl/bangers.

Menu tones are synthesized in the browser while Sound is enabled. Background music alternates CAR_SBGM_01 and CAR_SBGM_02 from Dragon Ball Xenoverse 2 (streams 82 and 83 in CAR_BGM; listening previews 9 and 10), selected by the user from their game installation. Each plays from its beginning through its original loop endpoint (4523217 and 5184481 samples at 48000 Hz). Two-second fades soften each beginning and ending, with one second of silence between tracks, including the return to track 9. The sequence is encoded as MP3 for web playback. The music remains the property of its respective rights holders and is not covered by the font or icon licenses.

Music and menu sounds default to on. The Dragon Ball launch button provides the user interaction needed to start enabled audio. Explicit on/off choices for both, and music volume, are stored on this device. Music pauses when the app is hidden. The device also stores a motion preference and temporary update-resume state; no personal character edits are stored.
