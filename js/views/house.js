/* Charliyah's Dream Farm — the farmhouse: tap-to-place decorating, walls & floors, front garden, Dream Home mode */
(function () {
  'use strict';
  const DF = window.DF, UI = DF.UI, S = DF.S, A = DF.Art;

  let room = 'inside';   // 'inside' | 'yard'
  let dream = false;     // creative mode: everything free
  let sel = null;        // { key } from tray, or { move: index }
  let trayTheme = 'all';

  const ROWS = { inside: 5, yard: 4 };
  const cols = () => {
    const up = DF.state.house.upgrades;
    if (dream) return 8;
    return room === 'inside' ? (up.room_big ? 8 : 6) : (up.yard_big ? 8 : 6);
  };
  const layout = () => (dream ? DF.state.dream : DF.state.house)[room];
  const zonesFor = () => room === 'inside' ? ['wall', 'floor'] : ['yard'];
  const zoneOfRow = (y) => room === 'yard' ? 'yard' : y === 0 ? 'wall' : 'floor';

  function occupied(lay, ignoreIdx) {
    const occ = {};
    lay.items.forEach((it, i) => {
      if (i === ignoreIdx) return;
      const w = DF.FURNITURE[it.k].w;
      for (let dx = 0; dx < w; dx++) occ[(it.x + dx) + ',' + it.y] = i;
    });
    return occ;
  }
  function canPlace(key, x, y, ignoreIdx) {
    const f = DF.FURNITURE[key], lay = layout();
    if (zoneOfRow(y) !== f.zone) return false;
    if (x < 0 || x + f.w > cols() || y < 0 || y >= ROWS[room]) return false;
    const occ = occupied(lay, ignoreIdx);
    for (let dx = 0; dx < f.w; dx++) if (occ[(x + dx) + ',' + y] != null) return false;
    return true;
  }
  const themeUnlocked = (t) => dream || DF.state.level >= DF.THEMES[t].lvl;

  function trayItems() {
    const zs = zonesFor();
    return Object.keys(DF.FURNITURE).filter(k => {
      const f = DF.FURNITURE[k];
      if (!zs.includes(f.zone)) return false;
      if (trayTheme !== 'all' && f.theme !== trayTheme) return false;
      return dream ? true : S.has(k);
    });
  }

  function roomHTML() {
    const lay = layout(), c = cols(), r = ROWS[room];
    const wall = DF.WALLS.find(w => w.id === lay.wall) || DF.WALLS[0];
    const floor = DF.FLOORS.find(f => f.id === lay.floor) || DF.FLOORS[0];
    const ground = DF.GROUNDS.find(g => g.id === lay.ground) || DF.GROUNDS[0];
    const selKey = sel ? (sel.key || lay.items[sel.move].k) : null;
    let cells = '';
    for (let y = 0; y < r; y++) for (let x = 0; x < c; x++) {
      const valid = selKey && canPlace(selKey, x, y, sel && sel.move != null ? sel.move : undefined);
      cells += `<button class="cell ${valid ? 'valid' : ''} z-${zoneOfRow(y)}" style="grid-column:${x + 1};grid-row:${y + 1}" data-cell="${x},${y}" aria-label="${zoneOfRow(y)} spot ${x + 1}, row ${y + 1}${valid ? ' — tap to place here' : ''}"></button>`;
    }
    const items = lay.items.map((it, i) => {
      const f = DF.FURNITURE[it.k];
      return `<button class="placed ${sel && sel.move === i ? 'moving' : ''} z-${f.zone}" data-placed="${i}" style="grid-column:${it.x + 1} / span ${f.w};grid-row:${it.y + 1}" aria-label="${f.name} — tap for options">${A.furniture(it.k)}</button>`;
    }).join('');
    const bg = room === 'inside'
      ? `--wall:${wall.c};--floor:${floor.c};--floor2:${floor.c2}`
      : `--grass:${ground.c};--grass2:${ground.c2}`;
    return `<div class="room room-${room} ${sel ? 'selecting' : ''}" style="${bg};--cols:${c};--rows:${r}">
      ${room === 'yard' ? `<div class="yard-house" aria-hidden="true"><span class="yh-roof"></span><span class="yh-wall"><span class="yh-door"></span><span class="yh-sign">${UI.name()}'s Farm</span></span></div>` : ''}
      <div class="room-grid">${cells}${items}</div></div>`;
  }

  function trayHTML() {
    const items = trayItems();
    const themes = Object.keys(DF.THEMES);
    return `<div class="tray">
      <div class="chip-tabs small">${['all'].concat(themes).map(t => `<button class="chip ${trayTheme === t ? 'on' : ''}" data-ttheme="${t}">${t === 'all' ? 'All' : DF.THEMES[t].name}${t !== 'all' && !themeUnlocked(t) ? ' 🔒' : ''}</button>`).join('')}</div>
      ${items.length ? `<div class="tray-items">${items.map(k => {
        const f = DF.FURNITURE[k];
        return `<button class="tray-item ${sel && sel.key === k ? 'on' : ''} w${f.w}" data-tray="${k}" aria-pressed="${!!(sel && sel.key === k)}" aria-label="${f.name}${dream ? '' : ', you have ' + S.count(k)}">${A.furniture(k)}<span class="nm">${f.name}</span>${dream ? '' : `<span class="cnt">${S.count(k)}</span>`}</button>`;
      }).join('')}</div>`
        : `<p class="empty-note">${dream ? 'Nothing in this collection for this room.' : `No ${room === 'yard' ? 'garden' : 'room'} decorations in your bag${trayTheme !== 'all' ? ' from this collection' : ''}. Buy more at the Market or craft some in the Crafting Corner!`}</p>`}
    </div>`;
  }

  function paletteHTML() {
    const lay = layout();
    if (room === 'inside') {
      return `<div class="palettes"><div><span class="pl">Walls</span>${DF.WALLS.map(w => { const ok = themeUnlocked(w.theme); return `<button class="swatch ${lay.wall === w.id ? 'on' : ''} ${ok ? '' : 'locked'}" style="--c:${w.c}" data-wall="${w.id}" aria-label="${w.name} wall${ok ? '' : ', locked'}" title="${w.name}"></button>`; }).join('')}</div>
        <div><span class="pl">Floor</span>${DF.FLOORS.map(f => { const ok = themeUnlocked(f.theme); return `<button class="swatch floor ${lay.floor === f.id ? 'on' : ''} ${ok ? '' : 'locked'}" style="--c:${f.c};--c2:${f.c2}" data-floor="${f.id}" aria-label="${f.name} floor${ok ? '' : ', locked'}" title="${f.name}"></button>`; }).join('')}</div></div>`;
    }
    return `<div class="palettes"><div><span class="pl">Ground</span>${DF.GROUNDS.map(g => { const ok = themeUnlocked(g.theme); return `<button class="swatch floor ${lay.ground === g.id ? 'on' : ''} ${ok ? '' : 'locked'}" style="--c:${g.c};--c2:${g.c2}" data-ground="${g.id}" aria-label="${g.name}${ok ? '' : ', locked'}" title="${g.name}"></button>`; }).join('')}</div></div>`;
  }

  function placedMenu(i) {
    const lay = layout(), it = lay.items[i], f = DF.FURNITURE[it.k];
    UI.modal({
      title: f.name, cls: 'small',
      body: `<div class="center big-icon">${A.furniture(it.k)}</div><p class="center muted">${DF.THEMES[f.theme].name} collection</p>`,
      buttons: [
        { label: 'Move it ↔', cls: 'primary', onClick: () => { sel = { move: i }; UI.refresh(); UI.toast('Tap a glowing spot to move it there.'); } },
        { label: dream ? 'Remove' : 'Put back in bag', cls: 'ghost', onClick: () => { lay.items.splice(i, 1); if (!dream) S.add(it.k, 1); sel = null; DF.Audio.play('place'); S.commit(); UI.refresh(); } },
        { label: 'Cancel', cls: 'ghost' }
      ]
    });
  }

  function collectionsPanel() {
    const rows = Object.entries(DF.THEMES).map(([t, th]) => {
      const keys = Object.keys(DF.FURNITURE).filter(k => DF.FURNITURE[k].theme === t && !DF.FURNITURE[k].crafted);
      const placed = new Set();
      ['inside', 'yard'].forEach(r => DF.state.house[r].items.forEach(it => placed.add(it.k)));
      const owned = keys.filter(k => S.has(k) || placed.has(k));
      const pct = Math.round((owned.length / keys.length) * 100);
      return `<div class="coll-row ${themeUnlocked(t) ? '' : 'locked'}"><span class="coll-sw" style="background:${th.color}"></span><div><b>${th.name}</b>${themeUnlocked(t) ? '' : ` <small>🔒 Level ${th.lvl}</small>`}<div class="progress"><span style="width:${pct}%"></span></div><small>${owned.length} / ${keys.length} pieces</small></div><div class="coll-items">${keys.map(k => `<span class="ci ${owned.includes(k) ? 'have' : ''}" title="${DF.FURNITURE[k].name}">${A.furniture(k)}</span>`).join('')}</div></div>`;
    }).join('');
    UI.modal({ title: '🎨 Decoration Collections', cls: 'wide', body: `<p class="muted">Collect every piece in a theme! Shop items are sold at the Market.</p><div class="coll-list">${rows}</div>` });
  }

  function upgradePanel() {
    const s = DF.state, up = s.house.upgrades;
    const rows = Object.entries(DF.HOUSE_UPGRADES).map(([k, u]) => {
      const owned = !!up[k], locked = s.level < u.lvl;
      return `<div class="shop-row"><span class="shop-ic">${A.icon(k)}</span><div class="shop-txt"><b>${u.name}</b><small>${u.desc}</small></div>${owned ? '<span class="owned">✓ Done</span>' : locked ? `<span class="owned">🔒 Lv ${u.lvl}</span>` : `<button class="btn primary" data-up="${k}">${UI.coin(u.price)}</button>`}</div>`;
    }).join('');
    const m = UI.modal({ title: '🔨 Upgrade the House', cls: 'small', body: rows });
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-up]'); if (!b) return;
      const u = DF.HOUSE_UPGRADES[b.dataset.up];
      if (s.coins < u.price) { UI.toast(`You need ${u.price - s.coins} more coins. Saving up is smart budgeting! 🪙`); S.learn('m_save'); return; }
      S.spend(u.price); up[b.dataset.up] = true; S.stat('upgrades');
      DF.Audio.play('quest'); UI.confetti(); S.commit(); m.close(); UI.refresh();
      UI.clover(`Wow! The ${u.name.toLowerCase()} is ready. More room for your dreams! 🏡`, { hearts: true });
    });
  }

  DF.Views.house = {
    render(host, opts) {
      if (opts && opts.zone) { room = opts.zone; dream = false; if (opts.select && S.has(opts.select)) sel = { key: opts.select }; UI.viewOpts = {}; }
      const s = DF.state;
      host.innerHTML = `<div class="page house-page ${dream ? 'dream' : ''}">
        <div class="page-head"><h1>${dream ? '✨ My Dream Home' : `${UI.name()}'s Farmhouse`}</h1>
          <div class="tabs-inline"><button class="chip ${room === 'inside' ? 'on' : ''}" data-room="inside">🛏 Bedroom</button><button class="chip ${room === 'yard' ? 'on' : ''}" data-room="yard">🌷 Front Garden</button></div></div>
        <div class="mode-switch" role="group" aria-label="Decorating mode">
          <button class="seg ${dream ? '' : 'on'}" data-dream="0" aria-pressed="${!dream}">🏡 My Real Home</button>
          <button class="seg ${dream ? 'on' : ''}" data-dream="1" aria-pressed="${dream}">✨ Dream Home (free creative mode)</button>
        </div>
        <p class="lead small-t">${dream ? 'Everything is free here — decorate however you like! This is a separate dream space, so your real home stays just as it is.' : sel ? (sel.move != null ? 'Tap a glowing spot to move it. ' : 'Tap a glowing spot to place it. ') + '<button class="link-btn" data-cancel>Cancel</button>' : 'Pick a decoration below, then tap a glowing spot in the room. Tap anything you’ve placed to move it or put it away.'}</p>
        ${roomHTML()}
        ${paletteHTML()}
        ${trayHTML()}
        <div class="tool-row">${dream ? '<button class="btn ghost" data-clear>Clear dream room</button>' : '<button class="btn" data-coll>🎨 Collections</button><button class="btn" data-upgrade>🔨 Upgrade house</button><button class="btn" data-go="market" data-opts=\'{"tab":"decor"}\'>🛒 Buy decor</button>'}</div>
      </div>`;
      host.onclick = (e) => {
        const t = e.target;
        const rm = t.closest('[data-room]'); if (rm) { room = rm.dataset.room; sel = null; UI.refresh(); return; }
        const dm = t.closest('[data-dream]'); if (dm) { dream = dm.dataset.dream === '1'; sel = null; if (dream) S.stat('dream_visits'); UI.refresh(); return; }
        if (t.closest('[data-cancel]')) { sel = null; UI.refresh(); return; }
        if (t.closest('[data-coll]')) { collectionsPanel(); return; }
        if (t.closest('[data-upgrade]')) { upgradePanel(); return; }
        if (t.closest('[data-clear]')) { UI.confirm('Clear the dream room?', 'Everything in this dream room will be removed. (Your real home isn’t affected.)', 'Clear', () => { layout().items = []; S.commit(); UI.refresh(); }); return; }
        const tt = t.closest('[data-ttheme]'); if (tt) { trayTheme = tt.dataset.ttheme; UI.refresh(); return; }
        const tr = t.closest('[data-tray]');
        if (tr) { const k = tr.dataset.tray; sel = sel && sel.key === k ? null : { key: k }; DF.Audio.play('tap'); UI.refresh(); return; }
        const w = t.closest('[data-wall]'), f = t.closest('[data-floor]'), g = t.closest('[data-ground]');
        if (w || f || g) {
          const id = (w || f || g).dataset[w ? 'wall' : f ? 'floor' : 'ground'];
          const list = w ? DF.WALLS : f ? DF.FLOORS : DF.GROUNDS;
          const it = list.find(x => x.id === id);
          if (!themeUnlocked(it.theme)) { UI.toast(`🔒 ${it.name} unlocks at level ${DF.THEMES[it.theme].lvl} with the ${DF.THEMES[it.theme].name} collection.`); return; }
          layout()[w ? 'wall' : f ? 'floor' : 'ground'] = id;
          DF.Audio.play('place'); S.stat('repaint'); S.commit(); UI.refresh();
          return;
        }
        const pl = t.closest('[data-placed]');
        if (pl && !sel) { placedMenu(+pl.dataset.placed); return; }
        const cell = t.closest('[data-cell]') || (pl && sel ? null : null);
        let x, y;
        if (cell) { [x, y] = cell.dataset.cell.split(',').map(Number); }
        else if (pl && sel) { const it = layout().items[+pl.dataset.placed]; x = it.x; y = it.y; }
        else return;
        if (!sel) { UI.toast('Choose a decoration from the tray below first. 🛋'); return; }
        const lay = layout();
        if (sel.move != null) {
          const it = lay.items[sel.move];
          if (!canPlace(it.k, x, y, sel.move)) { UI.toast(spotHint(it.k, y)); return; }
          it.x = x; it.y = y; sel = null;
          DF.Audio.play('place'); S.commit(); UI.refresh();
          return;
        }
        const k = sel.key;
        if (!canPlace(k, x, y)) { UI.toast(spotHint(k, y)); return; }
        if (!dream && !S.take(k)) { sel = null; UI.refresh(); return; }
        lay.items.push({ k, x, y });
        S.stat('place_any');
        if (room === 'inside') S.stat('place_inside');
        if (!dream) S.addXP(1);
        if (!dream && !S.has(k)) sel = null;
        DF.Audio.play('place');
        S.commit(); UI.refresh();
        UI.pop(`[data-placed="${lay.items.length - 1}"]`);
      };
    },
    leave() { sel = null; }
  };
  function spotHint(k, y) {
    const f = DF.FURNITURE[k];
    if (f.zone === 'wall' && zoneOfRow(y) !== 'wall') return `${f.name} goes on the wall (the top row).`;
    if (f.zone === 'floor' && zoneOfRow(y) === 'wall') return `${f.name} goes on the floor, not the wall!`;
    return f.w > 1 ? `${f.name} needs ${f.w} empty spots side by side.` : 'That spot is taken — try a glowing one!';
  }
})();
