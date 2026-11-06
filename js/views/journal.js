/* Charliyah's Dream Farm — "Little Discoveries" journal: facts, badges & certificates, collection book, harvest chart, word garden */
(function () {
  'use strict';
  const DF = window.DF, UI = DF.UI, S = DF.S, A = DF.Art;
  let tab = 'facts';

  function factsHTML() {
    const s = DF.state;
    const total = Object.keys(DF.FACTS).length;
    return `<p class="lead small-t">You've discovered <b>${s.facts.length}</b> of ${total} secrets. Find more by growing, caring, exploring the pond, tapping butterflies, playing Treehouse games, and chatting with Clover!</p>
      ${Object.entries(DF.TOPICS).map(([t, info]) => {
        const all = Object.keys(DF.FACTS).filter(f => DF.FACTS[f].topic === t);
        const got = all.filter(f => s.facts.includes(f));
        return `<section class="chapter" style="--tc:${info.color}"><h3><span class="ch-ic">${info.icon}</span>${info.name}<small>${got.length}/${all.length}</small></h3>
          <div class="pages">${all.map(f => s.facts.includes(f)
            ? `<button class="page-card" data-fact="${f}"><span class="pc-ic">${info.icon}</span><b>${DF.FACTS[f].title}</b></button>`
            : `<div class="page-card locked" aria-label="Undiscovered page"><span class="pc-ic">❔</span><b>???</b></div>`).join('')}</div></section>`;
      }).join('')}`;
  }
  function badgesHTML() {
    const s = DF.state;
    return `<p class="lead small-t">Earn badges by trying all sorts of things. Every badge comes with a certificate you can print! 🏅</p>
      <div class="badge-grid">${DF.BADGES.map(b => {
        const got = s.badges[b.id];
        const prog = Math.min(b.goal, S.statValue(b.stat));
        return `<button class="badge ${got ? 'got' : ''}" data-badge="${b.id}" aria-label="${b.name}${got ? ', earned' : ', ' + prog + ' of ' + b.goal}"><span class="b-ic">${got ? b.icon : '🔒'}</span><b>${b.name}</b><small>${b.desc}</small>${got ? '<span class="cert-tag">📜 Certificate</span>' : `<span class="progress"><span style="width:${Math.round(prog / b.goal * 100)}%"></span></span>`}</button>`;
      }).join('')}</div>`;
  }
  function collectionHTML() {
    const s = DF.state;
    const cell = (got, art, name, sub) => `<div class="coll-cell ${got ? 'got' : ''}">${got ? art : `<span class="silhouette">${art}</span>`}<b>${got ? name : '???'}</b>${got && sub ? `<small>${sub}</small>` : ''}</div>`;
    const crops = Object.keys(DF.CROPS).map(k => cell(S.statValue('harvest_' + k) > 0, A.icon(k), DF.CROPS[k].name, `${S.statValue('harvest_' + k)} harvested`)).join('');
    const fruits = Object.values(DF.TREES).map(t => cell(S.statValue('fruit_' + t.fruit) > 0, A.icon(t.fruit), t.fruitName, `${S.statValue('fruit_' + t.fruit)} picked`)).join('');
    const animals = DF.ANIMAL_ORDER.map(k => { const a = s.animals.find(x => x.type === k); return cell(!!a, A.animal(k), DF.ANIMALS[k].name, a ? UI.esc(a.name) : ''); }).join('');
    const goods = ['egg', 'wool', 'fluff', 'duck_egg', 'milk', 'horseshoe'].map(k => cell(S.statValue('got_' + k) > 0, A.icon(k), UI.itemName(k))).join('');
    const crafted = Object.entries(DF.RECIPES).map(([id, r]) => cell(S.statValue('craft_' + id) > 0, A.icon(r.out), r.name)).join('')
      + ['bouquet_classic', 'bouquet_mix', 'bouquet_rainbow', 'bouquet_comp'].map(k => cell(S.statValue('got_' + k) > 0, A.icon(k), DF.GOODS[k].name)).join('');
    const pond = [['pd_frog', '🐸', 'Frog'], ['pd_fish', '🐟', 'Fish'], ['pd_dragonfly', '🪰', 'Dragonfly'], ['pd_lily', '🌸', 'Water lily'], ['bf_meta', '🦋', 'Butterfly'], ['b_dance', '🐝', 'Honeybee']].map(([f, e, n]) => cell(s.facts.includes(f), `<span class="emo-big">${e === '🪰' ? '🦗' : e}</span>`, n)).join('');
    return `<h3 class="sub">🥕 Crops & Flowers</h3><div class="coll-grid">${crops}</div>
      <h3 class="sub">🍎 Fruit</h3><div class="coll-grid">${fruits}</div>
      <h3 class="sub">🐾 Animal Friends</h3><div class="coll-grid">${animals}</div>
      <h3 class="sub">🥚 Animal Gifts</h3><div class="coll-grid">${goods}</div>
      <h3 class="sub">🔨 Crafted Treasures</h3><div class="coll-grid">${crafted}</div>
      <h3 class="sub">🌿 Wild Friends Spotted</h3><div class="coll-grid">${pond}</div>`;
  }
  function chartHTML() {
    const data = Object.keys(DF.CROPS).map(k => ({ k, v: S.statValue('harvest_' + k) })).filter(d => d.v > 0);
    if (!data.length) return '<div class="empty-note">Your harvest chart will grow as you harvest crops! 📊</div>';
    const max = Math.max(...data.map(d => d.v));
    const top = data.reduce((a, b) => (b.v > a.v ? b : a));
    const total = data.reduce((t, d) => t + d.v, 0);
    return `<p class="lead small-t">A bar chart shows amounts as bars — the taller the bar, the bigger the number. Total harvested: <b>${total}</b>.</p>
      <div class="bar-chart big" role="img" aria-label="Harvest chart: ${data.map(d => DF.CROPS[d.k].name + ' ' + d.v).join(', ')}">${data.map(d => `<div class="bar-col"><span class="bar" style="height:${Math.max(6, d.v / max * 100)}%"><b>${d.v}</b></span><span class="bar-ic">${A.icon(d.k)}</span><small>${DF.CROPS[d.k].name}</small></div>`).join('')}</div>
      <div class="chart-notes"><p>🏆 Your biggest harvest is <b>${DF.CROPS[top.k].name}</b> with ${top.v}.</p>
      ${data.length > 1 ? (() => { const low = data.reduce((a, b) => (b.v < a.v ? b : a)); return `<p>📏 That's <b>${top.v - low.v}</b> more than ${DF.CROPS[low.k].name.toLowerCase()} (${top.v} − ${low.v} = ${top.v - low.v}).</p>`; })() : ''}</div>`;
  }
  function wordsHTML() {
    const v = Array.isArray(DF.state.vocab) ? DF.state.vocab : [];
    if (!v.length) return '<div class="empty-note">Play <b>Word Sprouts</b> in the Treehouse to plant words here! 🌱</div>';
    return `<p class="lead small-t">${v.length} word${v.length > 1 ? 's' : ''} growing in your word garden.</p><div class="word-garden">${v.map(w => { const d = DF.WORDS.find(x => x.w === w); return `<div class="word-flower"><span class="wf-top">🌼</span><b>${w}</b><small>${d ? d.d : ''}</small></div>`; }).join('')}</div>`;
  }

  function certificate(b) {
    const s = DF.state;
    const m = UI.modal({
      title: '', cls: 'cert-modal',
      body: `<div class="certificate" id="certPrint">
        <div class="cert-border">
          <div class="cert-top">🌸 ✿ 🌼 ✿ 🌸</div>
          <h2>Certificate of Achievement</h2>
          <p class="cert-small">Dream Farm proudly presents this award to</p>
          <p class="cert-name">${UI.esc(s.name)}</p>
          <div class="cert-badge">${b.icon}</div>
          <h3>${b.name}</h3>
          <p>${b.desc}</p>
          <div class="cert-foot"><div><span class="sig">Clover</span><small>Clover the Lamb, Farm Guide</small></div><div class="cert-clover">${A.clover()}</div><div><span class="sig">Day ${s.badges[b.id]}</span><small>on ${UI.esc(s.name)}'s Dream Farm</small></div></div>
        </div></div>`,
      buttons: [{ label: 'Close', cls: 'ghost' }, { label: '🖨 Print', cls: 'primary', onClick: () => { document.body.classList.add('printing-cert'); setTimeout(() => { window.print(); setTimeout(() => document.body.classList.remove('printing-cert'), 500); }, 50); return false; } }]
    });
    return m;
  }

  DF.Views.journal = {
    render(host) {
      const s = DF.state;
      const tabs = [['facts', '📖 Discoveries'], ['badges', '🏅 Badges'], ['collection', '🧺 Collection'], ['chart', '📊 Harvest Chart'], ['words', '🌼 Word Garden']];
      const body = { facts: factsHTML, badges: badgesHTML, collection: collectionHTML, chart: chartHTML, words: wordsHTML }[tab]();
      host.innerHTML = `<div class="page journal-page">
        <div class="journal-cover"><div class="jc-avatar">${A.avatar(s.avatar)}</div><div><h1>${UI.name()}'s Little Discoveries</h1><p>${s.facts.length} discoveries · ${Object.keys(s.badges).length} badges · Level ${s.level}</p></div></div>
        <div class="chip-tabs" role="tablist">${tabs.map(([k, l]) => `<button class="chip ${tab === k ? 'on' : ''}" role="tab" aria-selected="${tab === k}" data-jtab="${k}">${l}</button>`).join('')}</div>
        <div class="journal-body">${body}</div></div>`;
      host.onclick = (e) => {
        const t = e.target.closest('[data-jtab]'); if (t) { tab = t.dataset.jtab; DF.Audio.play('page'); UI.render(false); return; }
        const b = e.target.closest('[data-badge]');
        if (b) {
          const badge = DF.BADGES.find(x => x.id === b.dataset.badge);
          if (s.badges[badge.id]) certificate(badge);
          else UI.toast(`🔒 ${badge.name}: ${badge.desc} (${Math.min(badge.goal, S.statValue(badge.stat))}/${badge.goal})`);
        }
      };
    }
  };
})();
