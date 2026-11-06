/* Charliyah's Dream Farm — the Market (buy & sell, with visible maths) and the Crafting Corner */
(function () {
  'use strict';
  const DF = window.DF, UI = DF.UI, S = DF.S, A = DF.Art;

  let tab = 'sell';
  let decorTheme = 'cottage';

  /* ---------------- shop catalogue ---------------- */
  function catalogue(t) {
    const s = DF.state, out = [];
    if (t === 'seeds') {
      Object.entries(DF.CROPS).forEach(([k, c]) => out.push({ key: k + '_seed', name: c.name + ' Seeds', price: c.seed, lvl: c.lvl, desc: `Grows in ${c.water} waterings. Sells for ${c.sell} coins — a profit of ${c.sell - c.seed}!`, fact: c.fact }));
      Object.entries(DF.TREES).forEach(([k, tr]) => out.push({ key: k + '_sapling', name: tr.name + ' Sapling', price: tr.cost, lvl: tr.lvl, desc: `Grows in ${tr.water} waterings, then gives ${tr.yield} ${tr.fruitName.toLowerCase()} again and again.`, fact: tr.fact }));
    }
    if (t === 'decor') {
      Object.entries(DF.FURNITURE).forEach(([k, f]) => { if (!f.crafted && f.theme === decorTheme) out.push({ key: k, name: f.name, price: f.price, lvl: DF.THEMES[f.theme].lvl, desc: `For the ${f.zone === 'yard' ? 'front garden' : f.zone}. ${f.w > 1 ? 'Takes 2 spaces.' : ''}`, furn: true }); });
    }
    if (t === 'animals') {
      ['acc_bow', 'acc_bell', 'acc_bandana', 'acc_hat'].forEach(k => out.push({ key: k, name: DF.GOODS[k].name, price: DF.GOODS[k].price, lvl: 1, desc: DF.GOODS[k].desc }));
    }
    if (t === 'tools') {
      Object.entries(DF.TOOLS).forEach(([k, tl]) => out.push({ key: k, name: tl.name, price: tl.price, lvl: tl.lvl, desc: tl.desc, tool: true, owned: !!s.tools[k], fact: tl.fact }));
    }
    return out;
  }

  function sellables() {
    return Object.keys(DF.state.inv).filter(k => {
      const c = UI.itemCategory(k);
      return (c === 'harvest' || c === 'animal' || c === 'crafted' || c === 'other') && UI.sellPrice(k) > 0 && S.count(k) > 0;
    }).sort((a, b) => UI.itemCategory(a).localeCompare(UI.itemCategory(b)) || UI.itemName(a).localeCompare(UI.itemName(b)));
  }

  /* ---------------- buy / sell sheets with a quantity stepper ---------------- */
  function buySheet(it) {
    const s = DF.state;
    let q = 1;
    const m = UI.modal({
      title: `Buy ${it.name}`, cls: 'small',
      body: `<div class="trade"><div class="big-icon">${A.icon(it.key)}</div><p>${it.desc}</p>
        ${it.fact ? `<div class="fact-mini">💡 ${DF.FACTS[it.fact].title}: ${DF.FACTS[it.fact].text}</div>` : ''}
        ${it.tool ? '' : `<div class="stepper" role="group" aria-label="How many"><button class="btn round" data-q="-1" aria-label="One fewer">−</button><output id="qOut">1</output><button class="btn round" data-q="1" aria-label="One more">+</button></div>`}
        <div class="math-line" id="mathLine" aria-live="polite"></div></div>`,
      buttons: [{ label: 'Cancel', cls: 'ghost' }, {
        label: 'Buy 🛒', cls: 'primary', onClick: () => {
          const total = q * it.price;
          if (s.coins < total) { UI.toast(`Not enough coins: you need ${total - s.coins} more.`); return false; }
          S.spend(total);
          if (it.tool) s.tools[it.key] = true; else S.add(it.key, q);
          S.stat('bought', q); S.stat('spent', total);
          if (S.statValue('bought') === q) S.learn('m_budget');
          if (it.tool && it.fact) S.learn(it.fact);
          DF.Audio.play('coin'); S.commit(1); UI.refresh();
          UI.toast(`🛍 Bought ${q} × ${it.name}! You have ${s.coins} coins left.`);
        }
      }]
    });
    const draw = () => {
      const total = q * it.price, left = s.coins - total;
      m.el.querySelector('#qOut') && (m.el.querySelector('#qOut').textContent = q);
      m.el.querySelector('#mathLine').innerHTML = `<span>${q} × ${it.price} = <b>${total}</b> coins</span><span>${s.coins} − ${total} = <b class="${left < 0 ? 'neg' : ''}">${left}</b> left</span>${left < 0 ? `<em>You need ${-left} more coins.</em>` : ''}`;
    };
    m.el.addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (!b) return; q = Math.max(1, Math.min(it.tool ? 1 : 99, q + +b.dataset.q)); draw(); });
    draw();
  }
  function sellSheet(k) {
    const s = DF.state, price = UI.sellPrice(k);
    let q = 1;
    const m = UI.modal({
      title: `Sell ${UI.itemName(k)}`, cls: 'small',
      body: `<div class="trade"><div class="big-icon">${A.icon(k)}</div><p class="muted">You have <b>${S.count(k)}</b>. Each sells for <b>${price}</b> coins.</p>
        <div class="stepper" role="group" aria-label="How many to sell"><button class="btn round" data-q="-1" aria-label="One fewer">−</button><output id="qOut">1</output><button class="btn round" data-q="1" aria-label="One more">+</button><button class="btn small ghost" data-q="all">All</button></div>
        <div class="math-line" id="mathLine" aria-live="polite"></div></div>`,
      buttons: [{ label: 'Keep it', cls: 'ghost' }, {
        label: 'Sell 🪙', cls: 'primary', onClick: () => {
          if (!S.take(k, q)) return false;
          const total = q * price;
          S.addCoins(total, true); S.stat('sold', q);
          if (S.statValue('sold') === q) S.learn('m_profit');
          S.addXP(Math.max(1, Math.floor(q / 2)));
          DF.Audio.play('coin'); S.commit(1); UI.refresh();
          UI.toast(`🪙 +${total} coins! (${q} × ${price} = ${total})`);
        }
      }]
    });
    const draw = () => {
      m.el.querySelector('#qOut').textContent = q;
      m.el.querySelector('#mathLine').innerHTML = `<span>${q} × ${price} = <b>${q * price}</b> coins</span><span>${s.coins} + ${q * price} = <b>${s.coins + q * price}</b> coins after</span>`;
    };
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-q]'); if (!b) return;
      q = b.dataset.q === 'all' ? S.count(k) : Math.max(1, Math.min(S.count(k), q + +b.dataset.q));
      draw();
    });
    draw();
  }

  DF.Views.market = {
    render(host, opts) {
      if (opts && opts.tab) { tab = opts.tab; UI.viewOpts = {}; }
      const s = DF.state;
      const tabs = [['sell', '🧺 Sell'], ['seeds', '🌱 Seeds & Trees'], ['decor', '🛋 Decor'], ['animals', '🎀 Animal Accessories'], ['tools', '🧰 Tools']];
      let body = '';
      if (tab === 'sell') {
        const list = sellables();
        const total = list.reduce((t, k) => t + S.count(k) * UI.sellPrice(k), 0);
        body = list.length ? `<p class="lead small-t">Tap something to sell it. Your whole basket is worth <b>${total}</b> coins.</p>
          <div class="shop-list">${list.map(k => `<button class="shop-row" data-sell="${k}"><span class="shop-ic">${A.icon(k)}</span><span class="shop-txt"><b>${UI.itemName(k)}</b><small>You have ${S.count(k)} · ${S.count(k)} × ${UI.sellPrice(k)} = ${S.count(k) * UI.sellPrice(k)} coins</small></span><span class="price">${UI.coin(UI.sellPrice(k))}<small>each</small></span></button>`).join('')}</div>`
          : `<div class="empty-note">Your basket is empty! Harvest crops, collect gifts from your animals, or craft goodies to sell here. 🧺</div>`;
      } else {
        const items = catalogue(tab);
        body = `${tab === 'decor' ? `<div class="chip-tabs small">${Object.entries(DF.THEMES).map(([t, th]) => `<button class="chip ${decorTheme === t ? 'on' : ''}" data-dtheme="${t}">${th.name}${s.level < th.lvl ? ' 🔒' : ''}</button>`).join('')}</div>` : ''}
          <div class="shop-list">${items.map(it => {
            const locked = s.level < it.lvl;
            const owned = it.tool && it.owned;
            return `<button class="shop-row ${locked ? 'locked' : ''} ${owned ? 'owned-row' : ''}" data-buy="${it.key}" ${owned ? 'aria-disabled="true"' : ''}><span class="shop-ic ${it.furn ? 'furn' : ''}">${it.furn ? A.furniture(it.key) : A.icon(it.key)}</span><span class="shop-txt"><b>${it.name}</b><small>${it.desc}</small>${!it.tool && !locked && S.count(it.key) ? `<small class="have">You have ${S.count(it.key)}</small>` : ''}</span><span class="price">${owned ? '✓ Owned' : locked ? `🔒 Lv ${it.lvl}` : UI.coin(it.price, s.coins < it.price ? 'short' : '')}</span></button>`;
          }).join('')}</div>`;
      }
      host.innerHTML = `<div class="page market-page">
        <div class="page-head"><h1>Market Stall</h1><div class="wallet">${UI.coin(s.coins)}</div></div>
        <div class="market-banner"><span class="mb-art">${A.ui('market')}</span><p>“Welcome, ${UI.name()}! Fresh seeds, cozy decor, and fair prices. No rush — browse as long as you like!”</p></div>
        <div class="chip-tabs" role="tablist">${tabs.map(([k, l]) => `<button class="chip ${tab === k ? 'on' : ''}" role="tab" aria-selected="${tab === k}" data-tab="${k}">${l}</button>`).join('')}</div>
        ${body}
      </div>`;
      host.onclick = (e) => {
        const t = e.target.closest('[data-tab]'); if (t) { tab = t.dataset.tab; UI.render(false); return; }
        const dt = e.target.closest('[data-dtheme]'); if (dt) { decorTheme = dt.dataset.dtheme; UI.refresh(); return; }
        const sl = e.target.closest('[data-sell]'); if (sl) { sellSheet(sl.dataset.sell); return; }
        const b = e.target.closest('[data-buy]'); if (!b) return;
        const it = catalogue(tab).find(x => x.key === b.dataset.buy);
        if (it.tool && it.owned) { UI.toast('You already own this tool! 🧰'); return; }
        if (s.level < it.lvl) { UI.toast(`🔒 This unlocks at level ${it.lvl}. Keep growing!`); return; }
        if (s.coins < it.price) {
          UI.toast(`It costs ${it.price} coins and you have ${s.coins}. ${it.price} − ${s.coins} = ${it.price - s.coins} more coins needed. Try selling some harvest! 🧺`);
          return;
        }
        buySheet(it);
      };
    }
  };

  /* ================= CRAFTING CORNER ================= */
  let bouquet = [];
  function bouquetType(fl) {
    const set = new Set(fl);
    if (set.size === 1) return 'bouquet_classic';
    if (set.has('lavender') && set.has('sunflower')) return 'bouquet_comp';
    if (set.size === 3) return 'bouquet_rainbow';
    return 'bouquet_mix';
  }
  function bouquetHTML() {
    const avail = DF.FLOWERS.filter(f => S.count(f) - bouquet.filter(x => x === f).length > 0 || bouquet.includes(f));
    const type = bouquet.length === 3 ? bouquetType(bouquet) : null;
    return `<section class="bouquet-station">
      <h2 class="section-title">💐 Bouquet Table</h2>
      <p class="small-t">Pick 3 flowers. Same kind, a mix, or three different colours? Each combination makes a different bouquet!</p>
      <div class="bq-row">
        <div class="bq-slots">${[0, 1, 2].map(i => `<button class="bq-slot ${bouquet[i] ? 'filled' : ''}" data-bqremove="${i}" aria-label="${bouquet[i] ? 'Remove ' + DF.CROPS[bouquet[i]].name : 'Empty slot'}">${bouquet[i] ? A.icon(bouquet[i]) : '<span>+</span>'}</button>`).join('')}</div>
        <div class="bq-result">${type ? `${A.icon(type)}<b>${DF.GOODS[type].name}</b><small>${DF.GOODS[type].desc} Sells for ${DF.GOODS[type].sell}.</small><button class="btn primary" data-bqmake>Make bouquet 💐</button>` : '<span class="muted">Your bouquet will appear here</span>'}</div>
      </div>
      <div class="bq-flowers">${DF.FLOWERS.map(f => { const left = S.count(f) - bouquet.filter(x => x === f).length; return `<button class="item-tile ${left > 0 ? '' : 'dim'}" data-bqadd="${f}" aria-label="Add ${DF.CROPS[f].name}, ${left} left">${A.icon(f)}<span class="cnt">${left}</span><span class="nm">${DF.CROPS[f].name}</span></button>`; }).join('')}</div>
      ${avail.length ? '' : '<p class="muted small-t">Grow daisies, sunflowers, tulips or lavender in the Garden to make bouquets.</p>'}
    </section>`;
  }
  function recipeHTML(id) {
    const r = DF.RECIPES[id], s = DF.state;
    if (!S.recipeKnown(id)) {
      const lockedLvl = r.lvl && s.level < r.lvl;
      return `<div class="recipe-card mystery"><span class="rc-ic">❓</span><div><b>Mystery recipe</b><small>${lockedLvl ? `Unlocks around level ${r.lvl}.` : `Collect ${Object.keys(r.needs).map(k => UI.itemName(k).toLowerCase()).join(' + ')} to discover it!`}</small></div></div>`;
    }
    const canMake = Object.entries(r.needs).every(([k, n]) => S.has(k, n));
    const times = Math.min(...Object.entries(r.needs).map(([k, n]) => Math.floor(S.count(k) / n)));
    const [mainK, mainN] = Object.entries(r.needs)[0];
    const have = S.count(mainK);
    const divLine = Object.keys(r.needs).length === 1 && have >= mainN ? `<small class="math">${have} ÷ ${mainN} = ${Math.floor(have / mainN)} ${UI.itemName(r.out).toLowerCase()}${have % mainN ? `, ${have % mainN} left over` : ''}</small>` : '';
    return `<div class="recipe-card ${canMake ? 'can' : ''}">
      <span class="rc-ic">${A.icon(r.out)}</span>
      <div class="rc-txt"><b>${r.name}</b><small>${r.why}</small>
        <div class="needs">${Object.entries(r.needs).map(([k, n]) => `<span class="need ${S.has(k, n) ? 'ok' : ''}">${A.icon(k)}${S.count(k)}/${n}</span>`).join('<span class="plus">+</span>')}</div>${divLine}</div>
      <button class="btn ${canMake ? 'primary' : ''}" data-craft="${id}" ${canMake ? '' : 'aria-disabled="true"'}>${canMake ? `Craft${times > 1 ? ` (${times})` : ''}` : 'Need more'}</button>
    </div>`;
  }
  function craft(id) {
    const r = DF.RECIPES[id];
    const missing = Object.entries(r.needs).filter(([k, n]) => !S.has(k, n));
    if (missing.length) {
      UI.toast(`Still needed: ${missing.map(([k, n]) => `${n - S.count(k)} more ${UI.itemName(k).toLowerCase()}`).join(', ')}.`);
      return;
    }
    Object.entries(r.needs).forEach(([k, n]) => S.take(k, n));
    S.add(r.out, r.n);
    S.stat('craft_any'); S.stat('craft_' + id);
    S.addXP(r.xp);
    if (r.fact) S.learn(r.fact);
    if (id === 'compost' && S.statValue('craft_compost') === 2) S.learn('s_life');
    DF.Audio.play('harvest');
    S.commit(1); UI.refresh();
    UI.toast(`🔨 You made ${r.n > 1 ? r.n + ' × ' : 'a '}${UI.itemName(r.out)}! +${r.xp} XP${DF.FURNITURE[r.out] ? ' — place it from the House!' : ''}`);
    if (S.statValue('craft_any') === 1) UI.clover('Your very first craft! You’re a real maker now. 🔨✨', { hearts: true });
  }

  DF.Views.craft = {
    render(host) {
      const known = Object.keys(DF.RECIPES).filter(S.recipeKnown);
      const unknown = Object.keys(DF.RECIPES).filter(id => !S.recipeKnown(id));
      host.innerHTML = `<div class="page craft-page">
        <div class="page-head"><h1>Crafting Corner</h1></div>
        <p class="lead">Turn your harvest, animal gifts and even old litter into lovely new things. Reusing materials is great for the planet! ♻️</p>
        ${bouquetHTML()}
        <h2 class="section-title">🔨 Workbench</h2>
        <div class="recipes">${known.map(recipeHTML).join('')}${unknown.map(recipeHTML).join('')}</div>
      </div>`;
      host.onclick = (e) => {
        const add = e.target.closest('[data-bqadd]');
        if (add) {
          const f = add.dataset.bqadd;
          if (bouquet.length >= 3) { UI.toast('Your bouquet already has 3 flowers — tap one to remove it.'); return; }
          if (S.count(f) - bouquet.filter(x => x === f).length <= 0) { UI.toast(`No ${DF.CROPS[f].name.toLowerCase()}s left. Grow more in the Garden! 🌱`); return; }
          bouquet.push(f); DF.Audio.play('tap'); UI.refresh(); return;
        }
        const rm = e.target.closest('[data-bqremove]');
        if (rm) { bouquet.splice(+rm.dataset.bqremove, 1); UI.refresh(); return; }
        if (e.target.closest('[data-bqmake]')) {
          const need = {}; bouquet.forEach(f => need[f] = (need[f] || 0) + 1);
          if (!Object.entries(need).every(([k, n]) => S.has(k, n))) { bouquet = []; UI.refresh(); return; }
          Object.entries(need).forEach(([k, n]) => S.take(k, n));
          const type = bouquetType(bouquet);
          S.add(type, 1); S.stat('craft_bouquet'); S.stat('craft_any'); S.addXP(6);
          if (type === 'bouquet_comp') S.learn('c_colorwheel');
          if (S.statValue('craft_bouquet') === 1) S.learn('b_pollination');
          bouquet = [];
          DF.Audio.play('quest'); UI.confetti();
          S.commit(1); UI.refresh();
          UI.clover(`What a beautiful ${DF.GOODS[type].name}! ${type === 'bouquet_comp' ? 'Purple and yellow are opposites on the colour wheel — they make each other pop!' : 'You have a real eye for flowers. 💐'}`, { hearts: true });
          return;
        }
        const c = e.target.closest('[data-craft]'); if (c) craft(c.dataset.craft);
      };
    },
    leave() { bouquet = []; }
  };
})();
