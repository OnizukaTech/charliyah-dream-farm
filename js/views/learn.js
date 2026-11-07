/* Charliyah's Dream Farm — Learning Treehouse & mini-games
   Bee's Flower Adventure · Market Math · Animal Habitat Match · Garden Genius · Word Sprouts · Story Nook */
(function () {
  'use strict';
  const DF = window.DF, UI = DF.UI, S = DF.S, A = DF.Art;
  const G = (DF.Games = {});

  /* ---------------- Treehouse hub ---------------- */
  DF.Views.learn = {
    render(host) {
      const s = DF.state;
      const ch = S.challenge();
      const plays = (id) => S.statValue('mg_' + id);
      host.innerHTML = `<div class="page learn-page">
        <div class="page-head"><h1>The Learning Treehouse</h1></div>
        <div class="treehouse-hero"><div class="th-clover">${A.clover()}</div><div class="bubble static">Welcome to my favourite spot, ${UI.name()}! Every game here teaches a little secret about nature. Wrong answers are totally okay — that's how brains grow! 🌱</div></div>
        <button class="challenge-card ${ch.done ? 'done' : ''}" data-game="${ch.game}">
          <span class="cc-tag">${ch.done ? '✅ Done today!' : '⭐ Today’s Challenge'}</span>
          <span class="cc-ic">${DF.MINIGAMES[ch.game].icon}</span>
          <span><b>${DF.MINIGAMES[ch.game].name}</b><small>${ch.done ? 'Come back tomorrow (in game days!) for a new one. You can still play anytime.' : 'Play it for a bonus of 15 coins! It changes each farm day — no pressure, it’s always here.'}</small></span>
        </button>
        <div class="game-grid">${Object.entries(DF.MINIGAMES).map(([id, g]) => `
          <button class="game-card" data-game="${id}" style="--gc:${g.color}">
            <span class="gc-ic">${g.icon}</span><b>${g.name}</b><small>${g.desc}</small>
            <span class="gc-foot"><span class="topic">${g.topic}</span>${id === 'story' ? `<span>${Object.keys(s.storiesRead).length}/${DF.STORIES.length} read</span>` : `<span>${plays(id) ? `Played ${plays(id)}×` : 'New!'}</span>`}</span>
          </button>`).join('')}</div>
      </div>`;
      host.onclick = (e) => { const b = e.target.closest('[data-game]'); if (b) G.open(b.dataset.game); };
    }
  };

  /* ---------------- shared game frame ---------------- */
  let frame = null;
  G.open = (id) => {
    DF.Audio.play('tap');
    G.close();
    const g = DF.MINIGAMES[id];
    const el = document.createElement('div');
    el.className = 'game-overlay';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', g.name);
    el.innerHTML = `<div class="game-top"><button class="btn round pause" data-pause aria-label="Pause"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor"/></svg></button><h2>${g.icon} ${g.name}</h2><div class="game-prog" id="gProg" aria-live="polite"></div></div><div class="game-body" id="gBody"></div>`;
    document.body.appendChild(el);
    frame = { id, el, body: el.querySelector('#gBody') };
    el.querySelector('[data-pause]').onclick = () => G.pause();
    GAMES[id].intro(frame.body);
    setTimeout(() => { const b = el.querySelector('.game-body .btn'); b && b.focus({ preventScroll: true }); }, 50);
  };
  G.close = () => { if (frame) { frame.el.remove(); frame = null; } };
  G.pause = () => {
    UI.modal({
      title: 'Paused', cls: 'small', body: '<p>Take a breather! Your progress in this game is waiting.</p>',
      buttons: [{ label: 'Quit to Treehouse', cls: 'ghost', onClick: () => { G.close(); UI.go('learn'); } }, { label: 'Keep playing ▶', cls: 'primary' }]
    });
  };
  G.prog = (txt) => { if (frame) frame.el.querySelector('#gProg').innerHTML = txt; };
  const introScreen = (o) => `<div class="g-intro"><div class="g-intro-art">${o.art || A.clover()}</div><h3>${o.title}</h3>${o.text}<button class="btn primary big" data-start>${o.start || 'Let’s play! ▶'}</button></div>`;

  G.finish = (id, o) => {
    // o: { stars (0-3), score text, coins, xp, facts: [] }
    const s = DF.state;
    const mg = (s.mg[id] = s.mg[id] || {});
    mg.plays = (mg.plays || 0) + 1;
    mg.best = Math.max(mg.best || 0, o.stars || 0);
    S.stat('mg_' + id); S.stat('mg_any');
    let coins = o.coins || 10, bonus = 0;
    const ch = S.challenge();
    if (ch.game === id && !ch.done) { s.challenge.done = true; bonus = 15; S.stat('challenges'); }
    S.addCoins(coins + bonus);
    const newFacts = (o.facts || []).filter(f => S.learn(f, true));
    S.addXP(o.xp || 15);
    S.commit();
    DF.Audio.play('quest');
    UI.confetti();
    frame.body.innerHTML = `<div class="g-done">
      <div class="stars" aria-label="${o.stars} of 3 stars">${[0, 1, 2].map(i => `<span class="${i < o.stars ? 'on' : ''}">${A.ui('star')}</span>`).join('')}</div>
      <h3>${o.title || 'Wonderful work!'}</h3><p>${o.score || ''}</p>
      <div class="reward-row">${UI.coin(coins)}<span class="xp-pill">+${o.xp || 15} XP</span>${bonus ? `<span class="bonus-pill">⭐ Challenge bonus ${UI.coin(bonus)}</span>` : ''}</div>
      ${newFacts.length ? `<div class="new-pages"><b>📖 ${newFacts.length} new journal page${newFacts.length > 1 ? 's' : ''}!</b>${newFacts.map(f => `<button class="link-btn" data-fact="${f}">${DF.FACTS[f].title}</button>`).join('')}</div>` : ''}
      <div class="g-clover">${A.clover('hop')}<div class="bubble static">${UI.esc(UI.fill(UI.pick(DF.CLOVER.learn)))}</div></div>
      <div class="g-done-btns"><button class="btn" data-again>Play again 🔁</button><button class="btn primary" data-home>Back to Treehouse 🌳</button></div></div>`;
    frame.body.querySelector('[data-again]').onclick = () => G.open(id);
    frame.body.querySelector('[data-home]').onclick = () => { G.close(); UI.go('learn'); };
    G.prog('Complete! 🎉');
  };
  const starsFor = (mistakes, total) => mistakes === 0 ? 3 : mistakes <= Math.max(1, Math.round(total * 0.25)) ? 2 : 1;

  /* ================= 1. BEE'S FLOWER ADVENTURE ================= */
  const FL_COL = { daisy: '#fff', sunflower: '#ffcd3c', tulip: '#f2577a', lavender: '#a07ad8' };
  const bee = {
    intro(body) {
      body.innerHTML = introScreen({
        art: A.bee('#ffcd3c'), title: 'Help Bumble pollinate the garden!',
        text: `<p>Flowers need <b>pollen</b> from another flower <b>of the same kind</b> to make seeds.</p>
          <ol class="steps-mini"><li>Tap an <b>open flower</b> to collect its pollen.</li><li>Tap a <b>bud of the same kind</b> to pollinate it — watch it bloom!</li></ol><p class="muted">No timer. Take as long as you like. 🐝</p>`
      });
      body.querySelector('[data-start]').onclick = () => this.start(1);
    },
    start(round) {
      this.round = round; this.mistakes = this.mistakes && round > 1 ? this.mistakes : 0; this.carry = null;
      const kinds = DF.FLOWERS.slice(0, round + 1);
      const flowers = [];
      kinds.forEach(k => { flowers.push({ k, open: true }); flowers.push({ k, open: false }); flowers.push({ k, open: false }); });
      this.flowers = UI.shuffle(flowers);
      this.draw('Round ' + round + ': ' + (round === 1 ? 'Two kinds of flowers.' : round === 2 ? 'Three kinds now!' : 'Four kinds — you’re a pro!'));
    },
    draw(msg) {
      const body = frame.body;
      const left = this.flowers.filter(f => !f.open).length;
      const waiting = this.waitingKinds();
      const needHint = !this.carry || !waiting.includes(this.carry);
      G.prog(`Round ${this.round}/3 · ${left} bud${left === 1 ? '' : 's'} left`);
      body.innerHTML = `<div class="bee-game">
        <div class="bee-msg" aria-live="polite">${msg || ''}</div>
        <div class="bee-carry">Bumble is carrying: <b>${this.carry ? `<span class="pollen-dot" style="--c:${FL_COL[this.carry]}"></span>${DF.CROPS[this.carry].name} pollen` : 'nothing yet'}</b></div>
        <div class="bee-board cols-${Math.min(4, this.flowers.length / 3 + (this.round > 1 ? 1 : 1))}">
          ${this.flowers.map((f, i) => `<button class="bee-flower ${f.open ? 'open' : 'bud'} ${f.open && needHint && waiting.includes(f.k) ? 'needed' : ''} ${!f.open && this.carry === f.k ? 'needed' : ''}" data-f="${i}" aria-label="${DF.CROPS[f.k].name} ${f.open ? 'flower with pollen' : 'bud waiting for pollen'}">
            ${f.open ? A.icon(f.k) : `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 92 L50 50" stroke="#5aa94b" stroke-width="5"/><path d="M50 66 C40 60 34 52 36 46 C44 50 48 56 50 64Z" fill="#6cb85a"/><path d="M36 50 C36 26 64 26 64 50 Q50 58 36 50Z" fill="#9bd18a" stroke="#5aa94b" stroke-width="2.5"/><path d="M42 34 Q50 22 58 34 Q50 30 42 34Z" fill="${FL_COL[f.k]}" stroke="#ccc" stroke-width="1"/></svg>`}
            <span class="fl-name">${DF.CROPS[f.k].name}${f.open ? '' : ' bud'}</span></button>`).join('')}
          <div class="bee-sprite" aria-hidden="true">${A.bee(this.carry ? FL_COL[this.carry] : null)}</div>
        </div></div>`;
      if (this.beePos != null) this.moveBee(this.beePos, true);
      body.onclick = (e) => { const b = e.target.closest('[data-f]'); if (b) this.tap(+b.dataset.f); };
    },
    moveBee(i, instant) {
      const board = frame.body.querySelector('.bee-board'), fl = frame.body.querySelector(`[data-f="${i}"]`), sp = frame.body.querySelector('.bee-sprite');
      if (!board || !fl || !sp) return;
      const br = board.getBoundingClientRect(), fr = fl.getBoundingClientRect();
      if (instant) sp.style.transition = 'none';
      sp.style.transform = `translate(${fr.left - br.left + fr.width / 2 - 30}px, ${fr.top - br.top - 10}px)`;
      if (instant) { void sp.offsetWidth; sp.style.transition = ''; }
    },
    waitingKinds() { return Array.from(new Set(this.flowers.filter(x => !x.open).map(x => x.k))); },
    nameList(kinds) { const n = kinds.map(k => '<b>' + DF.CROPS[k].name.toLowerCase() + '</b>'); return n.length > 1 ? n.slice(0, -1).join(', ') + ' or ' + n[n.length - 1] : n[0]; },
    tap(i) {
      const f = this.flowers[i];
      this.moveBee(i);
      this.beePos = i;
      DF.Audio.play('buzz');
      setTimeout(() => {
        if (f.open) {
          this.carry = f.k;
          const waiting = this.waitingKinds();
          if (!waiting.includes(f.k)) {
            this.draw(`🐝 Bumble collected ${DF.CROPS[f.k].name.toLowerCase()} pollen — but every ${DF.CROPS[f.k].name.toLowerCase()} has already bloomed! Tap an open ${this.nameList(waiting)} to collect the pollen those buds need.`);
            return;
          }
          this.draw(`🐝 Bumble collected <b>${DF.CROPS[f.k].name.toLowerCase()} pollen</b>. Now find a ${DF.CROPS[f.k].name.toLowerCase()} bud!`);
          return;
        }
        if (!this.carry) { this.draw('Bumble needs pollen first! Tap an <b>open flower</b>. 🌼'); return; }
        if (this.carry !== f.k) {
          this.mistakes++;
          DF.Audio.play('wrong');
          this.draw(`Oops! That's a <b>${DF.CROPS[f.k].name.toLowerCase()}</b> bud, but Bumble has ${DF.CROPS[this.carry].name.toLowerCase()} pollen. Pollen only works on the <b>same kind</b> of flower — tap an open <b>${DF.CROPS[f.k].name.toLowerCase()}</b> first! 💛`);
          return;
        }
        f.open = true;
        DF.Audio.play('right');
        const left = this.flowers.filter(x => !x.open).length;
        if (!left) {
          if (this.round < 3) { this.carry = null; this.beePos = null; this.draw('🌸 All bloomed! Get ready for the next round…'); setTimeout(() => this.start(this.round + 1), 1300); }
          else {
            G.finish('bee', {
              stars: starsFor(this.mistakes, 18), title: 'The whole garden is blooming!',
              score: `You pollinated 18 flowers${this.mistakes ? ` (and learned from ${this.mistakes} mix-up${this.mistakes > 1 ? 's' : ''})` : ' without a single mix-up'}! Pollinated flowers can now make seeds and fruit.`,
              coins: 12 + (3 - Math.min(3, this.mistakes)) * 2, xp: 20, facts: ['b_pollination', 'b_pollen_same', 'b_why', 'b_food', 'b_dance', 'b_species']
            });
          }
          return;
        }
        const stillSame = this.flowers.some(x => !x.open && x.k === f.k);
        this.draw(`✨ Pollinated! The ${DF.CROPS[f.k].name.toLowerCase()} bloomed. ${left} bud${left > 1 ? 's' : ''} to go.${stillSame ? '' : ` All the ${DF.CROPS[f.k].name.toLowerCase()}s are done — now tap an open ${this.nameList(this.waitingKinds())} to collect new pollen!`}`);
      }, UI.reducedMotion() ? 0 : 420);
    }
  };

  /* ================= 2. MARKET MATH ================= */
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const PRICE_ITEMS = [['sunflower seeds', 'sunflower_seed'], ['a watering can', 'big_can'], ['a flower pot', 'flower_pot'], ['a jar of jam', 'jam'], ['a bag of carrots', 'carrot'], ['a pink bow', 'acc_bow'], ['a basket of eggs', 'egg'], ['a little lamp', 'lamp_cottage']];
  function opts(correct, spread) {
    const set = new Set([correct]);
    let guard = 0;
    while (set.size < 4 && guard++ < 50) { const d = correct + rnd(-spread, spread); if (d >= 0 && d !== correct) set.add(d); }
    let n = 1; while (set.size < 4) set.add(correct + spread + n++);
    return UI.shuffle(Array.from(set));
  }
  function mathQuestion(level, idx) {
    const tier = Math.min(5, level + Math.floor(idx / 3));
    const types = ['add', 'sub', 'change'];
    if (tier >= 2) types.push('mul', 'chart', 'afford');
    if (tier >= 3) types.push('frac', 'save', 'multi');
    if (tier >= 4) types.push('frac2', 'profit');
    const t = types[(idx + rnd(0, types.length - 1)) % types.length];
    const big = tier >= 3 ? 1 : 0;
    let q, ans, why, icon = 'coin', choices;
    if (t === 'add') { const a = rnd(5, 20 + big * 30), b = rnd(3, 15 + big * 20); q = `You have ${a} coins and sell a bouquet for ${b} coins. How many coins do you have now?`; ans = a + b; why = `${a} + ${b} = ${ans}`; icon = 'bouquet_mix'; }
    if (t === 'sub') { const a = rnd(15, 40 + big * 40), b = rnd(3, a - 2); q = `You have ${a} coins and buy a decoration for ${b} coins. How many are left?`; ans = a - b; why = `${a} − ${b} = ${ans}`; icon = 'flower_pot'; }
    if (t === 'change') { const p = rnd(4, 19), paid = p < 10 ? 10 : 20; q = `A pink bow costs ${p} coins. You pay with ${paid} coins. How much change do you get?`; ans = paid - p; why = `${paid} − ${p} = ${ans}`; icon = 'acc_bow'; }
    if (t === 'mul') { const a = rnd(2, 6 + big * 3), b = rnd(2, 6 + big * 4); q = `You sell ${a} carrots for ${b} coins each. How many coins do you earn?`; ans = a * b; why = `${a} × ${b} = ${ans}`; icon = 'carrot'; }
    if (t === 'multi') { const hens = rnd(2, 5), eggs = rnd(2, 4); q = `Each of your ${hens} hens lays ${eggs} eggs. How many eggs altogether?`; ans = hens * eggs; why = `${hens} × ${eggs} = ${ans}`; icon = 'egg'; }
    if (t === 'frac') { const d = UI.pick([2, 3, 4]), each = rnd(2, 6), tot = d * each; const nm = { 2: 'half', 3: 'a third', 4: 'a quarter' }[d]; q = `You picked ${tot} strawberries and give ${nm} of them to Clover. How many does Clover get?`; ans = each; why = `${nm} of ${tot} means ${tot} ÷ ${d} = ${ans}`; icon = 'strawberry'; }
    if (t === 'frac2') { const d = UI.pick([3, 4, 5]), each = rnd(2, 5), tot = d * each, k = rnd(2, d - 1); q = `${k}/${d} of your ${tot} apples go into pies. How many apples is that?`; ans = each * k; why = `${tot} ÷ ${d} = ${each}, and ${k} × ${each} = ${ans}`; icon = 'apple'; }
    if (t === 'save') { const per = rnd(3, 8), days = rnd(3, 7), price = per * days; q = `A star lamp costs ${price} coins. If you save ${per} coins every day, how many days until you can buy it?`; ans = days; why = `${price} ÷ ${per} = ${days} days. Saving a little each day adds up!`; icon = 'lamp_star'; }
    if (t === 'profit') { const cost = rnd(2, 8), sell = cost + rnd(3, 12); q = `Tulip seeds cost ${cost} coins and a tulip sells for ${sell}. What's your profit on one tulip?`; ans = sell - cost; why = `Profit = what you earn − what you spend: ${sell} − ${cost} = ${ans}`; icon = 'tulip'; }
    if (t === 'afford') {
      const a = rnd(3, 8), b = rnd(5, 12), have = a + b + rnd(-3, 4);
      const [an, ak] = PRICE_ITEMS[0], [bn, bk] = PRICE_ITEMS[1];
      q = `${an[0].toUpperCase() + an.slice(1)} cost ${a} coins and ${bn} costs ${b} coins. You have ${have} coins. What can you do?`;
      icon = ak;
      const both = a + b <= have;
      const right = both ? `Buy both, with ${have - a - b} left` : `Buy only one — both cost ${a + b}`;
      const wrongs = both ? [`Buy only one — both cost ${a + b}`, `Buy both, with ${have - a - b + 2} left`, 'Buy nothing'] : [`Buy both, with ${Math.abs(have - a - b)} left`, 'Buy nothing at all', `Buy both, with 1 left`];
      choices = UI.shuffle([right].concat(wrongs.slice(0, 3)));
      return { q, ans: right, choices, why: `${a} + ${b} = ${a + b}. ${both ? `${have} − ${a + b} = ${have - a - b} left over.` : `That's more than ${have}, so you can only afford one of them.`}`, icon, text: true };
    }
    if (t === 'chart') {
      const crops = UI.shuffle(['carrot', 'tomato', 'sunflower', 'daisy', 'strawberry']).slice(0, 4);
      const vals = crops.map(() => rnd(2, 9));
      const mode = rnd(0, 1);
      const chart = `<div class="bar-chart" role="img" aria-label="Bar chart of harvest: ${crops.map((c, i) => DF.CROPS[c].name + ' ' + vals[i]).join(', ')}">${crops.map((c, i) => `<div class="bar-col"><span class="bar" style="height:${vals[i] * 10}%"><b>${vals[i]}</b></span><span class="bar-ic">${A.icon(c)}</span><small>${DF.CROPS[c].name}</small></div>`).join('')}</div>`;
      if (mode === 0) {
        const i = rnd(0, 3); let j = rnd(0, 3); while (j === i || vals[j] === vals[i]) { j = (j + 1) % 4; if (j === i) j = (j + 1) % 4; if (vals[j] === vals[i]) { vals[j] = vals[i] + 1; } }
        const hi = vals[i] >= vals[j] ? i : j, lo = hi === i ? j : i;
        q = `${chart}<p>How many more ${DF.CROPS[crops[hi]].name.toLowerCase()}s than ${DF.CROPS[crops[lo]].name.toLowerCase()}s were harvested?</p>`;
        ans = vals[hi] - vals[lo]; why = `${vals[hi]} − ${vals[lo]} = ${ans}`;
        return { q, ans, choices: opts(ans, 3), why, html: true };
      }
      const max = Math.max(...vals); const hi = vals.indexOf(max); if (vals.filter(v => v === max).length > 1) vals[hi] += 1;
      const chart2 = `<div class="bar-chart" role="img" aria-label="Bar chart">${crops.map((c, i) => `<div class="bar-col"><span class="bar" style="height:${vals[i] * 10}%"><b>${vals[i]}</b></span><span class="bar-ic">${A.icon(c)}</span><small>${DF.CROPS[c].name}</small></div>`).join('')}</div>`;
      return { q: `${chart2}<p>Which crop had the biggest harvest?</p>`, ans: DF.CROPS[crops[hi]].name, choices: UI.shuffle(crops.map(c => DF.CROPS[c].name)), why: `The tallest bar is ${DF.CROPS[crops[hi]].name}, with ${vals[hi]}.`, html: true, text: true };
    }
    return { q, ans, choices: choices || opts(ans, Math.max(3, Math.round(ans * 0.3))), why, icon };
  }
  const math = {
    intro(body) {
      const lvl = DF.state.mg.math.level || 1;
      body.innerHTML = introScreen({
        art: A.ui('market'), title: 'Market Math Challenge',
        text: `<p>Help run the market stall! Solve 8 shopping puzzles: adding, change, multiplying, fractions, budgeting and charts.</p><p class="muted">Difficulty: <b>${'⭐'.repeat(lvl)}</b> — it grows as you get better. Wrong answers just show you how it works. 🧮</p>`
      });
      body.querySelector('[data-start]').onclick = () => { this.i = 0; this.mistakes = 0; this.firstTry = 0; this.qs = Array.from({ length: 8 }, (_, i) => mathQuestion(lvl, i)); this.show(); };
    },
    show() {
      const qq = this.qs[this.i];
      this.tries = 0;
      G.prog(`Question ${this.i + 1}/8`);
      frame.body.innerHTML = `<div class="q-card">${qq.icon && !qq.html ? `<div class="q-ic">${A.icon(qq.icon)}</div>` : ''}<div class="q-text">${qq.html ? qq.q : `<p>${qq.q}</p>`}</div>
        <div class="answers ${qq.text ? 'col' : 'grid4'}">${qq.choices.map(c => `<button class="btn answer" data-a="${UI.esc(c)}">${qq.text ? UI.esc(c) : c}</button>`).join('')}</div>
        <p class="feedback" aria-live="polite"></p></div>`;
      frame.body.onclick = (e) => {
        const b = e.target.closest('[data-a]'); if (!b || b.disabled) return;
        const fb = frame.body.querySelector('.feedback');
        if (String(qq.ans) === b.dataset.a) {
          if (this.tries === 0) this.firstTry++;
          b.classList.add('right'); DF.Audio.play('right');
          UI.$$('[data-a]', frame.body).forEach(x => x.disabled = true);
          fb.innerHTML = `✅ Yes! ${qq.why}<br><button class="btn primary" data-next>${this.i < 7 ? 'Next ▶' : 'Finish 🎉'}</button>`;
          fb.querySelector('[data-next]').onclick = () => { this.i++; if (this.i < 8) this.show(); else this.done(); };
          fb.querySelector('[data-next]').focus({ preventScroll: true });
        } else {
          this.tries++; this.mistakes++;
          b.classList.add('wrong'); b.disabled = true; DF.Audio.play('wrong');
          fb.innerHTML = this.tries === 1 ? 'Not quite — try again! Hint: write the numbers down and take it one step at a time. 💛' : `Here's how it works: ${qq.why}. Pick the matching answer!`;
        }
      };
    },
    done() {
      const mg = DF.state.mg.math;
      const up = this.firstTry >= 6 && (mg.level || 1) < 5;
      if (up) mg.level = (mg.level || 1) + 1;
      G.finish('math', { stars: this.firstTry >= 7 ? 3 : this.firstTry >= 5 ? 2 : 1, title: up ? 'Level up! Harder puzzles unlocked! 🧮' : 'Market Math complete!', score: `${this.firstTry} of 8 correct on the first try.${up ? ' Next time the puzzles will be a bit trickier.' : ''}`, coins: 8 + this.firstTry * 2, xp: 15 + this.firstTry, facts: ['m_budget', 'm_profit', 'm_save'] });
    }
  };

  /* ================= 3. ANIMAL HABITAT MATCH ================= */
  const habitat = {
    intro(body) {
      body.innerHTML = introScreen({
        art: '<div class="emoji-art">🐧🐪🐸</div>', title: 'Animal Habitat Match',
        text: '<p>Every animal needs the right <b>home</b>, the right <b>food</b> and the right <b>care</b>.</p><p>Tap an animal, then tap its match. Three rounds: homes, foods, and needs!</p>'
      });
      body.querySelector('[data-start]').onclick = () => { this.round = 0; this.mistakes = 0; this.startRound(); };
    },
    startRound() {
      const R = DF.HABITAT_ROUNDS[this.round];
      this.pairs = UI.shuffle(R.pairs).slice(0, 4);
      this.right = UI.shuffle(this.pairs.map((p, i) => i));
      this.done = {}; this.sel = null; this.msg = R.title + '.';
      this.draw();
    },
    draw() {
      G.prog(`Round ${this.round + 1}/3`);
      const R = DF.HABITAT_ROUNDS[this.round];
      frame.body.innerHTML = `<div class="match-game"><h3>${R.title}</h3>
        <div class="match-cols"><div class="match-col">${this.pairs.map((p, i) => `<button class="match-card animal ${this.done[i] ? 'matched' : ''} ${this.sel === i ? 'sel' : ''}" data-l="${i}" ${this.done[i] ? 'disabled' : ''} aria-pressed="${this.sel === i}"><span class="emo">${p.a}</span><span>${p.an}</span></button>`).join('')}</div>
        <div class="match-col">${this.right.map(i => { const p = this.pairs[i]; return `<button class="match-card ${this.done[i] ? 'matched' : ''}" data-r="${i}" ${this.done[i] ? 'disabled' : ''}><span class="emo">${p.b}</span><span>${p.bn}</span></button>`; }).join('')}</div></div>
        <p class="feedback" aria-live="polite">${this.msg}</p></div>`;
      frame.body.onclick = (e) => {
        const l = e.target.closest('[data-l]');
        if (l) { this.sel = +l.dataset.l; this.msg = `Where does the <b>${this.pairs[this.sel].an.toLowerCase()}</b> match? Tap the right side.`; DF.Audio.play('tap'); this.draw(); return; }
        const r = e.target.closest('[data-r]'); if (!r) return;
        if (this.sel == null) { this.msg = 'First tap an animal on the left. 🐾'; this.draw(); return; }
        const ri = +r.dataset.r;
        if (ri === this.sel) {
          this.done[ri] = true; DF.Audio.play('right');
          this.msg = `✅ ${this.pairs[ri].why}`;
          this.sel = null;
          if (Object.keys(this.done).length === this.pairs.length) {
            this.draw();
            const fb = frame.body.querySelector('.feedback');
            fb.insertAdjacentHTML('beforeend', `<br><button class="btn primary" data-next>${this.round < 2 ? 'Next round ▶' : 'Finish 🎉'}</button>`);
            fb.querySelector('[data-next]').onclick = () => {
              this.round++;
              if (this.round < 3) this.startRound();
              else G.finish('habitat', { stars: starsFor(this.mistakes, 12), title: 'Habitat Hero!', score: `You matched 12 animals to their homes, food and needs${this.mistakes ? ` with ${this.mistakes} helpful mistake${this.mistakes > 1 ? 's' : ''}` : ' perfectly'}!`, coins: 10 + Math.max(0, 6 - this.mistakes), xp: 20, facts: ['n_habitat', 'n_herbivore', 'n_foodchain', 'n_biodiversity'] });
            };
            fb.querySelector('[data-next]').focus({ preventScroll: true });
            return;
          }
        } else {
          this.mistakes++; DF.Audio.play('wrong');
          this.msg = `Hmm, not quite! Think about what a ${this.pairs[this.sel].an.toLowerCase()} really needs — try another one. 💛`;
        }
        this.draw();
      };
    }
  };

  /* ================= 4. GARDEN GENIUS ================= */
  function patternPuzzle() {
    const pool = UI.shuffle(['carrot', 'tomato', 'sunflower', 'daisy', 'strawberry', 'apple']);
    const shapes = [[0, 1], [0, 1, 2], [0, 0, 1], [0, 1, 1], [0, 1, 2, 1]];
    const sh = UI.pick(shapes);
    const seq = Array.from({ length: 7 }, (_, i) => pool[sh[i % sh.length]]);
    const answer = seq[6];
    const used = Array.from(new Set(sh.map(x => pool[x])));
    const choices = UI.shuffle(Array.from(new Set(used.concat(pool.slice(3, 5)))).slice(0, 3).concat(used.includes(answer) ? [] : [answer]));
    if (!choices.includes(answer)) choices[0] = answer;
    return { type: 'mc', html: `<p>What comes next in the pattern?</p><div class="pattern">${seq.slice(0, 6).map(k => `<span>${A.icon(k)}</span>`).join('')}<span class="q-mark">?</span></div>`, choices: Array.from(new Set(choices)).map(k => ({ v: k, html: A.icon(k), label: UI.itemName(k) })), ans: answer, why: `The pattern repeats: ${sh.map(x => UI.itemName(pool[x])).join(', ')}…` };
  }
  function rulePuzzle() {
    const pool = ['carrot', 'tomato', 'sunflower', 'daisy'];
    const good = [UI.pick(pool)];
    while (good.length < 4) { const n = UI.pick(pool.filter(p => p !== good[good.length - 1])); good.push(n); }
    const bad = () => { const r = good.slice(); const i = rnd(0, 2); r[i + 1] = r[i]; return r; };
    let b1 = bad(), b2 = bad(); let tries = 0; while (b2.join() === b1.join() && tries++ < 10) b2 = bad();
    const rows = UI.shuffle([{ r: good, ok: true }, { r: b1 }, { r: b2 }]);
    return { type: 'mc', html: '<p>Gardeners often avoid planting the same crop side by side. Which row has <b>no two of the same crop next to each other</b>?</p>', choices: rows.map((x, i) => ({ v: String(i), html: `<span class="row-ic">${x.r.map(k => A.icon(k)).join('')}</span>`, label: x.r.map(UI.itemName).join(', ') })), ans: String(rows.findIndex(x => x.ok)), why: 'In the right row, every neighbour is different. Mixing crops can help keep pests and diseases from spreading!' };
  }
  const genius = {
    intro(body) {
      body.innerHTML = introScreen({ art: '<div class="emoji-art">🧠🌻🔍</div>', title: 'Garden Genius', text: '<p>8 brain-teasers: <b>patterns</b>, <b>life cycles</b>, <b>garden logic</b> and <b>nature riddles</b>. Think it through — there’s no timer!</p>' });
      body.querySelector('[data-start]').onclick = () => {
        const riddles = UI.shuffle(DF.RIDDLES).slice(0, 3);
        const cycles = UI.shuffle(DF.LIFECYCLES).slice(0, 2);
        this.list = UI.shuffle([patternPuzzle(), patternPuzzle(), rulePuzzle(),
          ...cycles.map(c => ({ type: 'order', name: c.name, steps: c.steps })),
          ...riddles.map(r => ({ type: 'mc', html: `<p class="riddle">🔮 ${r.q}</p>`, choices: UI.shuffle(r.a.map((t, i) => ({ v: String(i), html: t, label: t }))), ans: String(r.c), why: r.why, text: true }))]);
        this.i = 0; this.mistakes = 0; this.show();
      };
    },
    show() {
      const p = this.list[this.i];
      G.prog(`Puzzle ${this.i + 1}/${this.list.length}`);
      if (p.type === 'order') {
        this.picked = [];
        const shuffled = UI.shuffle(p.steps.map((s, i) => ({ s, i })));
        frame.body.innerHTML = `<div class="q-card"><p>Put the life cycle of <b>${p.name}</b> in order. Tap the steps from <b>first</b> to <b>last</b>.</p>
          <div class="order-slots">${p.steps.map((_, i) => `<span class="o-slot" data-slot="${i}">${i + 1}</span>`).join('<span class="arrow">→</span>')}</div>
          <div class="answers col">${shuffled.map(o => `<button class="btn answer" data-step="${o.i}">${o.s}</button>`).join('')}</div><p class="feedback" aria-live="polite"></p></div>`;
        frame.body.onclick = (e) => {
          const b = e.target.closest('[data-step]'); if (!b || b.disabled) return;
          const fb = frame.body.querySelector('.feedback');
          if (+b.dataset.step === this.picked.length) {
            const slot = frame.body.querySelector(`[data-slot="${this.picked.length}"]`);
            slot.textContent = p.steps[+b.dataset.step]; slot.classList.add('filled');
            this.picked.push(+b.dataset.step); b.disabled = true; b.classList.add('right'); DF.Audio.play('right');
            if (this.picked.length === p.steps.length) this.correct(`That's the full cycle: ${p.steps.join(' → ')}.`);
            else fb.textContent = 'Yes! What comes next?';
          } else {
            this.mistakes++; DF.Audio.play('wrong');
            b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400);
            fb.innerHTML = `Hmm, not that one yet. What happens ${this.picked.length ? 'right after <b>' + p.steps[this.picked.length - 1] + '</b>' : '<b>first</b>'}?`;
          }
        };
        return;
      }
      frame.body.innerHTML = `<div class="q-card">${p.html}<div class="answers ${p.text ? 'col' : 'icons'}">${p.choices.map(c => `<button class="btn answer" data-v="${c.v}" aria-label="${UI.esc(c.label)}">${c.html}</button>`).join('')}</div><p class="feedback" aria-live="polite"></p></div>`;
      let tries = 0;
      frame.body.onclick = (e) => {
        const b = e.target.closest('[data-v]'); if (!b || b.disabled) return;
        if (b.dataset.v === p.ans) { b.classList.add('right'); DF.Audio.play('right'); UI.$$('[data-v]', frame.body).forEach(x => x.disabled = true); this.correct(p.why); }
        else { tries++; this.mistakes++; b.classList.add('wrong'); b.disabled = true; DF.Audio.play('wrong'); frame.body.querySelector('.feedback').innerHTML = tries > 1 ? `Hint: ${p.why}` : 'Good guess, but not quite! Look again carefully. 🔍'; }
      };
    },
    correct(why) {
      const fb = frame.body.querySelector('.feedback');
      fb.innerHTML = `✅ ${why}<br><button class="btn primary" data-next>${this.i < this.list.length - 1 ? 'Next ▶' : 'Finish 🎉'}</button>`;
      fb.querySelector('[data-next]').onclick = () => { this.i++; if (this.i < this.list.length) this.show(); else G.finish('genius', { stars: starsFor(this.mistakes, 8), title: 'You’re a Garden Genius!', score: `${this.list.length} puzzles solved!`, coins: 10 + Math.max(0, 6 - this.mistakes), xp: 20, facts: ['bf_meta', 'pd_frog', 'p_lifecycle', 'w_cycle', 'p_seeds_travel'] }); };
      fb.querySelector('[data-next]').focus({ preventScroll: true });
    }
  };

  /* ================= 5. WORD SPROUTS ================= */
  const words = {
    intro(body) {
      body.innerHTML = introScreen({ art: '<div class="emoji-art">🔤🌱</div>', title: 'Word Sprouts', text: '<p>Read the clue, then tap the letters to grow the nature word. Tap a letter in the word to send it back.</p><p class="muted">Stuck? Use a hint — that’s what they’re for!</p>' });
      body.querySelector('[data-start]').onclick = () => {
        const byLen = DF.WORDS.slice().sort((a, b) => a.w.length - b.w.length);
        const pick = (from, to, n) => UI.shuffle(byLen.slice(from, to)).slice(0, n);
        this.list = pick(0, 5, 2).concat(pick(5, 11, 2), pick(11, 16, 2));
        this.i = 0; this.hints = 0; this.mistakes = 0; this.show();
      };
    },
    show() {
      const w = this.list[this.i].w;
      let tiles = UI.shuffle(w.split('').map((ch, i) => ({ ch, id: i })));
      let guard = 0; while (tiles.map(t => t.ch).join('') === w && guard++ < 10) tiles = UI.shuffle(tiles);
      this.tiles = tiles; this.slots = Array(w.length).fill(null);
      this.draw();
    },
    draw(msg) {
      const item = this.list[this.i], w = item.w;
      G.prog(`Word ${this.i + 1}/${this.list.length}`);
      frame.body.innerHTML = `<div class="word-game"><p class="clue">🌿 <b>Clue:</b> ${item.d}</p>
        <div class="slots">${this.slots.map((t, i) => `<button class="slot ${t != null ? 'filled' : ''}" data-slot="${i}" aria-label="${t != null ? 'Letter ' + this.tiles.find(x => x.id === t).ch + ', tap to remove' : 'Empty letter spot'}">${t != null ? this.tiles.find(x => x.id === t).ch : ''}</button>`).join('')}</div>
        <div class="tiles">${this.tiles.map(t => `<button class="tile" data-tile="${t.id}" ${this.slots.includes(t.id) ? 'disabled' : ''}>${t.ch}</button>`).join('')}</div>
        <div class="g-btns"><button class="btn ghost" data-hint>💡 Hint</button><button class="btn ghost" data-clear>↺ Clear</button></div>
        <p class="feedback" aria-live="polite">${msg || ''}</p></div>`;
      frame.body.onclick = (e) => {
        const t = e.target.closest('[data-tile]');
        if (t && !t.disabled) { const at = this.slots.indexOf(null); if (at >= 0) { this.slots[at] = +t.dataset.tile; DF.Audio.play('tap'); } this.check(); return; }
        const s = e.target.closest('[data-slot]');
        if (s && this.slots[+s.dataset.slot] != null && !s.classList.contains('locked')) { this.slots[+s.dataset.slot] = null; this.draw(); return; }
        if (e.target.closest('[data-clear]')) { this.slots = this.slots.map(() => null); this.draw(); return; }
        if (e.target.closest('[data-hint]')) {
          this.hints++;
          const w2 = this.list[this.i].w;
          const pos = this.slots.findIndex((id, i) => id == null || this.tiles.find(x => x.id === id).ch !== w2[i]);
          if (pos < 0) return;
          this.slots = this.slots.map((id, i) => (i >= pos ? null : id));
          const tile = this.tiles.find(x => x.ch === w2[pos] && !this.slots.includes(x.id));
          this.slots[pos] = tile.id;
          this.check(`The letter in spot ${pos + 1} is <b>${w2[pos]}</b>.`);
        }
      };
    },
    check(msg) {
      const w = this.list[this.i].w;
      if (this.slots.includes(null)) { this.draw(msg); return; }
      const guess = this.slots.map(id => this.tiles.find(x => x.id === id).ch).join('');
      if (guess === w) {
        DF.Audio.play('right');
        const s = DF.state; s.vocab = Array.isArray(s.vocab) ? s.vocab : [];
        if (!s.vocab.includes(w)) s.vocab.push(w);
        this.draw(`✅ <b>${w}</b> — ${this.list[this.i].d} <br><button class="btn primary" data-next>${this.i < this.list.length - 1 ? 'Next word ▶' : 'Finish 🎉'}</button>`);
        UI.$$('.tile, .slot', frame.body).forEach(x => { x.disabled = true; x.classList.add('locked'); });
        frame.body.querySelector('.slots').classList.add('grown');
        frame.body.querySelector('[data-next]').onclick = () => { this.i++; if (this.i < this.list.length) this.show(); else G.finish('words', { stars: this.hints === 0 && this.mistakes === 0 ? 3 : this.hints + this.mistakes <= 3 ? 2 : 1, title: 'Your word garden is blooming!', score: `You grew ${this.list.length} nature words. They're saved in your journal's Word Garden!`, coins: 12, xp: 18, facts: ['p_roots', 'b_pollination', 's_compost'] }); };
        frame.body.querySelector('[data-next]').focus({ preventScroll: true });
      } else {
        this.mistakes++; DF.Audio.play('wrong');
        this.draw(`Almost! Some letters are in the wrong spots. Tap a letter in the word to send it back, or use a hint. 💛`);
      }
    }
  };

  /* ================= 6. STORY NOOK ================= */
  const story = {
    intro(body) {
      const s = DF.state;
      body.innerHTML = `<div class="story-list"><p class="lead">Snuggle up! Pick a story to read. After each one there are two little questions.</p>
        ${DF.STORIES.map(st => `<button class="story-card" data-story="${st.id}"><span class="st-ic">${st.icon}</span><span><b>${st.title}</b><small>${s.storiesRead[st.id] ? '✅ Read — read it again anytime' : 'New story'}</small></span></button>`).join('')}</div>`;
      G.prog(`${Object.keys(s.storiesRead).length}/${DF.STORIES.length} read`);
      body.onclick = (e) => { const b = e.target.closest('[data-story]'); if (b) this.read(DF.STORIES.find(x => x.id === b.dataset.story), 0); };
    },
    read(st, page) {
      G.prog(`${st.title} · page ${page + 1}/${st.text.length}`);
      frame.body.innerHTML = `<div class="storybook"><div class="sb-page"><div class="sb-ic">${st.icon}</div><h3>${st.title}</h3><p>${st.text[page]}</p></div>
        <div class="g-btns">${page > 0 ? '<button class="btn ghost" data-prev>◀ Back</button>' : '<button class="btn ghost" data-list>Stories</button>'}<button class="btn primary" data-next>${page < st.text.length - 1 ? 'Next page ▶' : 'Questions ✏️'}</button></div></div>`;
      DF.Audio.play('page');
      frame.body.onclick = (e) => {
        if (e.target.closest('[data-prev]')) this.read(st, page - 1);
        else if (e.target.closest('[data-list]')) this.intro(frame.body);
        else if (e.target.closest('[data-next]')) { if (page < st.text.length - 1) this.read(st, page + 1); else this.quiz(st, 0, 0); }
      };
    },
    quiz(st, qi, mistakes) {
      const q = st.qs[qi];
      G.prog(`${st.title} · question ${qi + 1}/${st.qs.length}`);
      frame.body.innerHTML = `<div class="q-card"><p>${q.q}</p><div class="answers col">${UI.shuffle(q.a.map((t, i) => ({ t, i }))).map(o => `<button class="btn answer" data-ans="${o.i}">${o.t}</button>`).join('')}</div><p class="feedback" aria-live="polite"></p><button class="link-btn" data-reread>📖 Read the story again</button></div>`;
      frame.body.onclick = (e) => {
        if (e.target.closest('[data-reread]')) { this.read(st, 0); return; }
        const b = e.target.closest('[data-ans]'); if (!b || b.disabled) return;
        if (+b.dataset.ans === q.c) {
          b.classList.add('right'); DF.Audio.play('right');
          UI.$$('[data-ans]', frame.body).forEach(x => x.disabled = true);
          const fb = frame.body.querySelector('.feedback');
          fb.innerHTML = `✅ Exactly right!<br><button class="btn primary" data-next>${qi < st.qs.length - 1 ? 'Next ▶' : 'Finish 🎉'}</button>`;
          fb.querySelector('[data-next]').onclick = () => {
            if (qi < st.qs.length - 1) { this.quiz(st, qi + 1, mistakes); return; }
            const first = !DF.state.storiesRead[st.id];
            DF.state.storiesRead[st.id] = true; S.stat('story');
            G.finish('story', { stars: mistakes === 0 ? 3 : 2, title: `You finished "${st.title}"!`, score: first ? 'A new story for your collection.' : 'Reading it again makes it even better!', coins: first ? 12 : 5, xp: first ? 18 : 8, facts: { st_bee: ['b_pollination'], st_bell: ['a_sheep_faces'], st_seed: ['p_lifecycle', 'p_tulip'], st_pond: ['e_reuse', 'pd_frog'] }[st.id] });
          };
          fb.querySelector('[data-next]').focus({ preventScroll: true });
        } else { mistakes++; b.classList.add('wrong'); b.disabled = true; DF.Audio.play('wrong'); frame.body.querySelector('.feedback').innerHTML = 'Not quite! You can peek at the story again if you like. 📖'; }
      };
    }
  };

  const GAMES = { bee, math, habitat, genius, words, story };
  G.GAMES = GAMES;
})();
