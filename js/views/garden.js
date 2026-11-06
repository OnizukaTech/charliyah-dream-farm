/* Charliyah's Dream Farm — Garden (plant, water, harvest) and Orchard (fruit trees) */
(function () {
  'use strict';
  const DF = window.DF, UI = DF.UI, S = DF.S, A = DF.Art;

  const drops = (n, of) => `<span class="drops" aria-label="${n} of ${of} waterings">${Array.from({ length: of }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;

  function plotStatus(p) {
    if (!p.crop) return { cls: 'empty', text: 'Tap to plant' };
    if (S.plotReady(p)) return { cls: 'ready', text: 'Ready! Tap to harvest' };
    if (S.plotThirsty(p)) return { cls: 'thirsty', text: 'Thirsty — tap to water' };
    return { cls: 'drinking', text: 'Growing… water again later' };
  }

  /* ---------------- planting ---------------- */
  function plant(i, crop) {
    const s = DF.state, p = s.plots[i];
    if (p.crop || !S.take(crop + '_seed')) return false;
    p.crop = crop; p.g = 0; p.wP = -1;
    S.stat('plant_any'); S.stat('plant_' + crop);
    S.addXP(1);
    const first = S.statValue('plant_' + crop) === 1;
    if (S.statValue('plant_any') === 1) S.learn('p_lifecycle');
    else if (first) S.learn(DF.CROPS[crop].fact);
    return true;
  }
  function water(i) {
    const s = DF.state, p = s.plots[i];
    if (!S.plotThirsty(p)) return false;
    p.g += 1; p.wP = s.time.P;
    S.stat('water');
    if (S.statValue('water') === 3) S.learn('p_water_need');
    if (S.statValue('water') === 8) S.learn('p_roots');
    return true;
  }
  function harvest(i) {
    const s = DF.state, p = s.plots[i];
    if (!S.plotReady(p)) return null;
    const c = DF.CROPS[p.crop];
    const n = 1 + (p.compost ? 1 : 0);
    S.add(p.crop, n);
    if (c.kind === 'veg') S.add('scraps', 1);
    S.stat('harvest_any', n); S.stat('harvest_' + p.crop, n);
    S.addXP(c.xp);
    if (S.statValue('harvest_any') <= 2) S.learn('p_photosynth');
    if (p.crop === 'sunflower' && S.statValue('harvest_sunflower') >= 2) S.learn('p_sunflower2');
    if (S.statValue('harvest_any') >= 6) S.learn('p_chlorophyll');
    const res = { crop: p.crop, n, xp: c.xp, scraps: c.kind === 'veg' };
    p.crop = null; p.g = 0; p.wP = -1; p.compost = false;
    return res;
  }
  DF.Garden = { plant, water, harvest };

  function seedPicker(i) {
    const s = DF.state;
    const seeds = Object.keys(DF.CROPS).filter(c => S.has(c + '_seed'));
    const hasCompost = S.has('compost');
    const p = s.plots[i];
    if (!seeds.length) {
      UI.modal({
        title: 'No seeds left!', cls: 'small',
        body: `<p>Your seed bag is empty. Visit the <b>Market</b> to buy more — you can sell some of your harvest first if you need coins.</p>`,
        buttons: [{ label: 'Close', cls: 'ghost' }, { label: 'Go to Market 🛒', cls: 'primary', onClick: () => UI.go('market') }]
      });
      return;
    }
    const m = UI.modal({
      title: '🌱 What shall we plant?', cls: 'wide',
      body: `${hasCompost ? `<label class="toggle compost-toggle"><input type="checkbox" id="useCompost" ${p.compost ? 'checked disabled' : ''}><span>Add compost first (you have ${S.count('compost')}) — <b>+1 harvest</b> and one less watering</span></label>` : ''}
        <div class="seed-grid">${seeds.map(c => {
          const cr = DF.CROPS[c];
          return `<button class="seed-card" data-seed="${c}">${A.icon(c + '_seed')}<b>${cr.name}</b><span class="seed-meta">${drops(0, cr.water)}<span>Sells ${UI.coin(cr.sell)}</span><span>+${cr.xp} XP</span></span><span class="cnt">×${S.count(c + '_seed')}</span></button>`;
        }).join('')}</div>
        <p class="muted small-t">💧 Each drop is one watering. A plant can drink once in each part of the day (morning, afternoon, evening, night).</p>`
    });
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-seed]'); if (!b) return;
      const cb = m.el.querySelector('#useCompost');
      if (cb && cb.checked && !p.compost) { if (S.take('compost')) { p.compost = true; S.stat('used_compost'); S.learn('s_greens'); } }
      if (plant(i, b.dataset.seed)) {
        m.close();
        DF.Audio.play('plant');
        S.commit(1);
        UI.refresh();
        UI.pop(`[data-plot="${i}"]`);
        UI.floatAt(UI.$(`[data-plot="${i}"]`), '🌱 Planted!');
      }
    });
  }

  /* ---------------- GARDEN VIEW ---------------- */
  DF.Views.garden = {
    render(host) {
      const s = DF.state;
      const t = s.tools;
      const nextPlotPrice = DF.plotPrice(s.plots.length);
      const anyThirsty = s.plots.some(S.plotThirsty), anyReady = s.plots.some(S.plotReady), anyEmpty = s.plots.some(p => !p.crop);
      host.innerHTML = `<div class="page garden-page">
        <div class="page-head"><h1>${UI.name()}'s Garden</h1>
          <div class="tabs-inline"><button class="chip on" aria-current="page">🥕 Garden</button><button class="chip" data-go="orchard">🍎 Orchard</button></div></div>
        <div class="tool-row">
          ${t.big_can ? `<button class="btn tool" data-tool="waterAll" ${anyThirsty ? '' : 'disabled'}>${A.icon('big_can')} Water all</button>` : ''}
          ${t.gloves ? `<button class="btn tool" data-tool="harvestAll" ${anyReady ? '' : 'disabled'}>${A.icon('gloves')} Harvest all</button>` : ''}
          ${t.satchel ? `<button class="btn tool" data-tool="plantAll" ${anyEmpty ? '' : 'disabled'}>${A.icon('satchel')} Plant all</button>` : ''}
          <button class="btn ghost" data-tool="rest">${A.ui(s.time.phase === 3 ? 'moon' : 'sun')} ${S.phaseName()} · rest</button>
        </div>
        <div class="plots">${s.plots.map((p, i) => {
          const st = plotStatus(p);
          const cr = p.crop ? DF.CROPS[p.crop] : null;
          return `<button class="plot ${st.cls}" data-plot="${i}" aria-label="Plot ${i + 1}: ${cr ? cr.name + ', ' : ''}${st.text}">
            <span class="soil">${p.compost ? '<span class="compost-tag" title="Compost added">🟤</span>' : ''}${cr ? A.plant(p.crop, S.plotStage(p)) : '<span class="plus">+</span>'}${st.cls === 'ready' ? '<span class="sparkles" aria-hidden="true">✨</span>' : ''}</span>
            <span class="plot-info">${cr ? `<b>${cr.name}</b>${drops(Math.min(p.g, S.waterNeed(p)), S.waterNeed(p))}` : '<b>Empty plot</b>'}<small>${st.text}</small></span>
          </button>`;
        }).join('')}
        ${s.plots.length < DF.MAX_PLOTS ? `<button class="plot buy" data-buyplot aria-label="Buy a new garden plot for ${nextPlotPrice} coins"><span class="soil">${A.icon('plot')}</span><span class="plot-info"><b>New plot</b><small>${UI.coin(nextPlotPrice)}</small></span></button>` : ''}
        </div>
        <details class="tip-box"><summary>🌼 How does my garden grow?</summary>
          <p>1. Tap an empty plot and choose a seed. 2. Tap it to water it — each 💧 is one drink. 3. Plants can drink once in each part of the day, so go and visit your animals or play a game while time passes (or tap the sun to rest). 4. When it sparkles, tap to harvest! Then sell your harvest at the Market, or use it in crafting.</p>
          <p>Nothing ever wilts or dies here, so take your time. 🌸</p></details>
      </div>`;
      host.onclick = (e) => {
        const plotBtn = e.target.closest('[data-plot]');
        if (plotBtn) { onPlot(+plotBtn.dataset.plot, plotBtn); return; }
        if (e.target.closest('[data-buyplot]')) { buyPlot(); return; }
        const tool = e.target.closest('[data-tool]');
        if (tool) useTool(tool.dataset.tool, tool);
      };
    }
  };

  function onPlot(i, el) {
    const s = DF.state, p = s.plots[i];
    if (!p.crop) { seedPicker(i); return; }
    if (S.plotReady(p)) {
      const r = harvest(i);
      DF.Audio.play('harvest');
      S.commit(1);
      UI.refresh();
      const nel = UI.$(`[data-plot="${i}"]`);
      UI.floatAt(nel, `+${r.n} ${DF.CROPS[r.crop].name}${r.n > 1 ? 's' : ''} · +${r.xp} XP${r.scraps ? ' · +1 scraps' : ''}`);
      return;
    }
    if (water(i)) {
      DF.Audio.play('water');
      S.commit(1);
      UI.refresh();
      const nel = UI.$(`[data-plot="${i}"]`);
      UI.pop(nel);
      UI.floatAt(nel, S.plotReady(p) ? '💧 Ready to harvest!' : '💧💧 Slurp!', 'water');
      return;
    }
    const need = S.waterNeed(p) - p.g;
    UI.toast(`💧 This ${DF.CROPS[p.crop].name.toLowerCase()} already had a drink this ${S.phaseName().toLowerCase()}. It needs ${need} more drink${need > 1 ? 's' : ''} — come back after time passes!`);
  }
  function buyPlot() {
    const s = DF.state, price = DF.plotPrice(s.plots.length);
    if (s.coins < price) { UI.toast(`You need ${price - s.coins} more coins for a new plot (${price} − ${s.coins} = ${price - s.coins}). Sell some harvest at the Market!`); return; }
    UI.confirm('Expand your garden?', `A new plot costs <b>${price}</b> coins. You have ${s.coins}, so you'd have <b>${s.coins - price}</b> left.`, 'Buy plot 🌱', () => {
      if (!S.spend(price)) return;
      s.plots.push({ crop: null, g: 0, wP: -1, compost: false });
      S.stat('plots_bought');
      DF.Audio.play('coin'); S.commit(); UI.refresh(); UI.toast('🌱 Your garden just got bigger!');
    });
  }
  function useTool(tool, el) {
    const s = DF.state;
    if (tool === 'rest') { DF.Panels.time(); return; }
    let n = 0;
    if (tool === 'waterAll') { s.plots.forEach((p, i) => { if (water(i)) n++; }); if (n) { DF.Audio.play('water'); UI.toast(`💧 Watered ${n} plant${n > 1 ? 's' : ''} with one swoosh!`); } }
    if (tool === 'harvestAll') {
      let xp = 0; s.plots.forEach((p, i) => { const r = harvest(i); if (r) { n += r.n; xp += r.xp; } });
      if (n) { DF.Audio.play('harvest'); UI.toast(`🧺 Harvested ${n} crops · +${xp} XP`); }
    }
    if (tool === 'plantAll') {
      const seeds = Object.keys(DF.CROPS).filter(c => S.has(c + '_seed'));
      if (!seeds.length) { UI.toast('No seeds in your bag — visit the Market!'); return; }
      const m = UI.modal({ title: 'Plant which seed everywhere?', cls: 'small', body: `<div class="seed-grid">${seeds.map(c => `<button class="seed-card" data-seed="${c}">${A.icon(c + '_seed')}<b>${DF.CROPS[c].name}</b><span class="cnt">×${S.count(c + '_seed')}</span></button>`).join('')}</div>` });
      m.el.addEventListener('click', (e) => {
        const b = e.target.closest('[data-seed]'); if (!b) return;
        let k = 0; s.plots.forEach((p, i) => { if (!p.crop && plant(i, b.dataset.seed)) k++; });
        m.close(); DF.Audio.play('plant'); S.commit(1); UI.refresh(); UI.toast(`🌱 Planted ${k} ${DF.CROPS[b.dataset.seed].name.toLowerCase()} seed${k > 1 ? 's' : ''}!`);
      });
      return;
    }
    S.commit(1); UI.refresh();
  }

  /* ---------------- ORCHARD VIEW ---------------- */
  DF.Views.orchard = {
    render(host) {
      const s = DF.state;
      const nextPrice = DF.treeSpotPrice(s.trees.length);
      host.innerHTML = `<div class="page orchard-page">
        <div class="page-head"><h1>The Orchard</h1>
          <div class="tabs-inline"><button class="chip" data-go="garden">🥕 Garden</button><button class="chip on" aria-current="page">🍎 Orchard</button></div></div>
        <p class="lead">Fruit trees take a little longer to grow, but once they're big they give fruit again and again — plus fallen twigs for crafting!</p>
        <div class="trees">${s.trees.map((t, i) => {
          const def = t.type ? DF.TREES[t.type] : null;
          const mature = S.treeMature(t), fruit = S.treeHasFruit(t), wood = S.treeWood(t);
          let status = 'Tap to plant a sapling';
          if (def && !mature) status = S.treeThirsty(t) ? 'Thirsty — tap to water' : 'Growing… water again later';
          if (mature) status = fruit ? `Tap to pick ${def.fruitName.toLowerCase()}!` : `New fruit soon (after ${Math.max(1, t.fruitP - s.time.P)} more part${t.fruitP - s.time.P > 1 ? 's' : ''} of the day)`;
          return `<div class="tree-card ${fruit ? 'ready' : ''}">
            <button class="tree-btn" data-tree="${i}" aria-label="Tree spot ${i + 1}: ${def ? def.name + ', ' : ''}${status}">${A.tree(def ? def.fruit : null, def ? (mature ? 2 : t.g > 0 ? 1 : 0) : 0, S.season(), fruit)}</button>
            <div class="tree-info"><b>${def ? def.name : 'Empty spot'}</b>${def && !mature ? drops(t.g, def.water) : ''}<small>${status}</small>
            ${wood ? `<button class="btn small" data-twigs="${i}">🪵 Gather fallen twigs</button>` : ''}</div>
          </div>`;
        }).join('')}
        ${s.trees.length < DF.MAX_TREES ? `<div class="tree-card buy"><button class="tree-btn" data-buytree aria-label="Buy a new tree spot for ${nextPrice} coins">${A.icon('tree_spot')}</button><div class="tree-info"><b>New tree spot</b><small>${UI.coin(nextPrice)}</small></div></div>` : ''}
        </div></div>`;
      host.onclick = (e) => {
        const tw = e.target.closest('[data-twigs]');
        if (tw) {
          const t = s.trees[+tw.dataset.twigs];
          if (!S.treeWood(t)) return;
          t.woodP = s.time.P; S.add('wood', 2); S.addXP(1);
          S.learn('e_trees');
          DF.Audio.play('harvest'); S.commit(1); UI.refresh(); UI.toast('🪵 +2 fallen twigs — no chopping needed!');
          return;
        }
        if (e.target.closest('[data-buytree]')) {
          const price = DF.treeSpotPrice(s.trees.length);
          if (s.coins < price) { UI.toast(`You need ${price - s.coins} more coins for a new tree spot.`); return; }
          UI.confirm('New tree spot?', `It costs <b>${price}</b> coins. You'll have <b>${s.coins - price}</b> left.`, 'Buy 🌳', () => {
            if (!S.spend(price)) return;
            s.trees.push({ type: null, g: 0, wP: -1, fruitP: null, woodP: -1 });
            DF.Audio.play('coin'); S.commit(); UI.refresh();
          });
          return;
        }
        const b = e.target.closest('[data-tree]'); if (!b) return;
        const i = +b.dataset.tree, t = s.trees[i];
        if (!t.type) { saplingPicker(i); return; }
        const def = DF.TREES[t.type];
        if (S.treeHasFruit(t)) {
          S.add(def.fruit, def.yield); S.stat('fruit', def.yield); S.stat('fruit_' + def.fruit, def.yield);
          S.addXP(def.xp);
          t.fruitP = s.time.P + def.regrow;
          S.learn(def.fact);
          DF.Audio.play('harvest'); S.commit(1); UI.refresh();
          UI.floatAt(UI.$(`[data-tree="${i}"]`), `+${def.yield} ${def.fruitName} · +${def.xp} XP`);
          return;
        }
        if (S.treeThirsty(t)) {
          t.g += 1; t.wP = s.time.P; S.stat('water');
          if (S.treeMature(t)) { t.fruitP = s.time.P + 1; t.woodP = -1; S.stat('trees_grown'); UI.toast(`🌳 Your ${def.name.toLowerCase()} is all grown up! Fruit will appear soon.`); }
          DF.Audio.play('water'); S.commit(1); UI.refresh();
          UI.floatAt(UI.$(`[data-tree="${i}"]`), '💧 Gulp!', 'water');
          return;
        }
        UI.toast(S.treeMature(t) ? 'The tree is resting. New fruit grows as time passes 🍃' : 'This little tree already had a drink. Come back after time passes!');
      };
    }
  };
  function saplingPicker(i) {
    const s = DF.state;
    const owned = Object.keys(DF.TREES).filter(k => S.has(k + '_sapling'));
    if (!owned.length) {
      UI.modal({ title: 'No saplings yet', cls: 'small', body: '<p>Saplings are baby trees. You can buy them at the <b>Market</b> once you reach level 2.</p>', buttons: [{ label: 'Close', cls: 'ghost' }, { label: 'Go to Market 🛒', cls: 'primary', onClick: () => UI.go('market', { tab: 'seeds' }) }] });
      return;
    }
    const m = UI.modal({ title: 'Plant a tree', cls: 'small', body: `<div class="seed-grid">${owned.map(k => `<button class="seed-card" data-sap="${k}">${A.icon(k + '_sapling')}<b>${DF.TREES[k].name}</b><span class="seed-meta">${drops(0, DF.TREES[k].water)}<span>${DF.TREES[k].yield} fruit per picking</span></span></button>`).join('')}</div>` });
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-sap]'); if (!b) return;
      if (!S.take(b.dataset.sap + '_sapling')) return;
      Object.assign(s.trees[i], { type: b.dataset.sap, g: 0, wP: -1, fruitP: null, woodP: -1 });
      S.stat('plant_tree'); S.addXP(4);
      m.close(); DF.Audio.play('plant'); S.commit(1); UI.refresh(); UI.toast('🌳 Planted! Water it to help it grow.');
    });
  }
})();
