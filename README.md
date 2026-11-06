# 🌸 Charliyah's Dream Farm 🐑

*A little world of your own, where dreams grow.*

A cozy, educational farming game made especially for Charliyah. It runs entirely in the browser: no server, no accounts, no ads, no purchases, no tracking. Progress saves automatically on the device she plays on.

---

## 🚀 Publish it on GitHub Pages (about 5 minutes)

### Option A: through the GitHub website (no tools needed)

1. Sign in at **https://github.com** and click **New repository** (the **+** at the top right).
2. Name it, for example `charliyah-dream-farm`. Choose **Public** and click **Create repository**.
3. On the new repository page, click **uploading an existing file**.
4. Unzip `charliyah-dream-farm.zip` on your computer. Open the unzipped folder and drag **everything inside it** into the upload area, including the `css`, `js` and `fonts` folders.
   - `index.html` must sit at the top level of the repository, not inside another folder.
5. Click **Commit changes**.
6. Go to **Settings → Pages**. Under *Build and deployment*:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main`, folder **`/ (root)`** → **Save**
7. Wait about 1–2 minutes and refresh the Pages settings page. Your link appears at the top:
   **`https://YOUR-USERNAME.github.io/charliyah-dream-farm/`**

Send that link to Charliyah. On her tablet she can tap **Share → Add to Home Screen** so it opens like an app.

### Option B: with git on the command line

```bash
cd charliyah-dream-farm          # the unzipped folder
git init
git add .
git commit -m "Charliyah's Dream Farm 🌸"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/charliyah-dream-farm.git
git push -u origin main
```

Then do step 6 above (Settings → Pages → `main` / `/ (root)`).

### Updating the game later

Upload or push the changed files to the same repository. GitHub Pages republishes automatically within a minute or two. Charliyah's progress is kept, because saves live on her tablet, not on GitHub.

---

## 📁 What goes in the repository

```
index.html               ← the page (must be at the top level)
.nojekyll                ← tells GitHub Pages to serve files as-is
manifest.webmanifest     ← "Add to Home Screen" support
sw.js                    ← optional offline support (service worker)
icon.svg, icon-192.png, icon-512.png
README.md
css/style.css            ← all styles
fonts/                   ← self-hosted Fredoka & Patrick Hand fonts (+ licences)
js/data.js               ← crops, animals, items, quests, badges, facts, stories, quiz content
js/art.js                ← every illustration, drawn as inline SVG
js/state.js              ← game state, rules, save/load & repair
js/audio.js              ← gentle synthesized sounds (off by default)
js/ui.js                 ← screen switching, HUD, modals, toasts, Clover's speech bubble
js/panels.js             ← quest board, bag, wardrobe, settings, level-up pop-ups
js/main.js               ← title screen, avatar creation, welcome & tutorial, start-up
js/views/farm.js         ← farm map, Clover's tips, the Pond
js/views/garden.js       ← Garden & Orchard
js/views/animals.js      ← Animal Meadow & adoption
js/views/house.js        ← house decorating & Dream Home mode
js/views/market.js       ← Market & Crafting Corner (incl. bouquet table)
js/views/learn.js        ← Learning Treehouse + 6 mini-games
js/views/journal.js      ← Little Discoveries journal, badges & certificates
```

There is no build step and no framework. All paths are relative, so it works inside a GitHub Pages project folder (`/charliyah-dream-farm/`) as well as at a domain root.

**Test it locally first (optional):** from the folder, run `python3 -m http.server 8000` and open `http://localhost:8000`. You can also double-click `index.html`; everything works except offline mode, which needs a web server.

---

## 🎮 What's in the game

| Area | What she can do |
|---|---|
| **Title & welcome** | Animated farmhouse and animals. Clover gives a first-visit welcome and a different "you're back!" welcome on return. Start / Continue / Settings. |
| **Avatar** | Hairstyle, hair colour, skin tone, outfit & colour, accessories (some unlock with levels). Nickname option. Change anytime by tapping her picture. |
| **Tutorial** | 8 short interactive steps (plant → water → rest → harvest → feed). Skippable and replayable from Settings. |
| **Farm map** | Tappable areas, the wooden **"Charliyah's Farm"** sign, Clover (tap for tips and fun facts), butterflies (tap to learn about them), day/night, seasons, rain, falling leaves. |
| **Garden** | 9 crops with growth stages and water needs, compost bonus, expandable plots, time-saving tools. |
| **Orchard** | 4 fruit trees that regrow fruit and drop twigs for crafting. |
| **Animals** | Lamb, chicken and rabbit to start, plus duck, cow, cat, dog and pony to adopt. Feed, groom, treats, gifts, friendship hearts, renaming, accessories, care guides with a care-check question. |
| **House** | Tap-to-place decorating, walls & floors, bedroom + front garden, 6 themed collections, house upgrades, and a free **Dream Home** creative mode. |
| **Market** | Buy and sell with the maths shown ("3 × 4 = 12 coins, 20 − 12 = 8 left"). Explains how many coins are missing when she can't afford something. |
| **Crafting** | 14 recipes discovered by collecting ingredients, a bouquet table (4 bouquet types) and recycled-litter crafts. |
| **Pond** | Discover pond life and the water cycle. Pick up litter that drifts in each farm day. |
| **Learning Treehouse** | Bee's Flower Adventure · Market Math (5 difficulty levels) · Animal Habitat Match · Garden Genius · Word Sprouts · Story Nook. A rotating daily-style challenge based on farm days, never real dates. |
| **Journal** | 76 illustrated discoveries in 11 chapters, 19 badges with printable certificates, collection book, harvest bar chart, word garden. |
| **Progress** | XP & levels with unlocks, 28 quests with progress bars and rewards, coins. |

**Kind by design:** nothing ever dies, wilts or is lost while she's away. Friendship never goes down. Wrong answers get a hint and another try. There's no time pressure, no streaks, no loot boxes and no real money.

**Saving:** progress saves to the tablet's browser (localStorage) after every action, and a "✓ Saved" badge flashes. Damaged or older saves are repaired automatically. Clearing the browser's website data, or playing in a private/incognito tab, will erase the farm.

**Accessibility:** large touch targets, everything works by tapping (no dragging), keyboard support on desktop, and sound off by default with a mute button. A "Calm" animation setting is available, and the device's reduced-motion preference is respected. There are no flashing effects.
