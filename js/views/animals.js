/* Charliyah's Dream Farm — Animal Meadow: feeding, grooming, treats, friendship, adoption */
(function () {
  'use strict';
  const DF = window.DF, UI = DF.UI, S = DF.S, A = DF.Art;

  const hearts = (a) => `<span class="hearts" aria-label="Friendship ${S.hearts(a)} of 5 hearts">${[0, 1, 2, 3, 4].map(i => A.ui(i < S.hearts(a) ? 'heart' : 'heartEmpty')).join('')}</span>`;
  const productName = (type) => { const d = DF.ANIMALS[type]; return d.product ? UI.itemName(d.product) : 'a cozy cuddle'; };
  const REACT = {
    lamb: ['Baa! 💕', 'Biscuit leans into the brush.', 'Happy wiggle!'], chicken: ['Bawk bawk! 🐔', 'Cluck cluck!', 'Happy pecking!'],
    rabbit: ['Binky! 🐰', 'Nose wiggle!', 'Happy flop!'], duck: ['Quack! 🦆', 'Splishy splash!', 'Waddle waddle!'],
    cow: ['Mooo~ 💕', 'Slow happy blink.', 'Tail swish!'], cat: ['Purrrr… 🐱', 'Slow blink of love.', 'Kneads the blanket.'],
    dog: ['Woof! 🐶', 'Tail wag x100!', 'Happy zoomies!'], pony: ['Neigh! 🐴', 'Gentle nuzzle.', 'Happy hoof tap!']
  };

  function careAction(a, act, el) {
    const s = DF.state, d = DF.ANIMALS[a.type], P = s.time.P;
    const card = el.closest('.animal-card');
    const art = card && card.querySelector('.animal-stage');
    if (act === 'feed') {
      if (a.fedP === P) {
        const first = S.learn('a_food_amount', true);
        UI.toast(`${UI.esc(a.name)} is full! ${first ? DF.FACTS.a_food_amount.text : 'Animals need just the right amount of food — not too much. 💛'}`);
        if (first) S.commit();
        return;
      }
      a.fedP = P; S.friendAdd(a, 5); S.stat('feed'); S.stat('feed_' + a.type);
      S.addXP(2);
      if (S.statValue('feed_' + a.type) === 1) S.learn(d.facts[0]);
      DF.Audio.play('pet');
      S.commit(1); UI.refresh();
      react(a, `🍽 Yum! ${UI.pick(REACT[a.type])}`);
      return;
    }
    if (act === 'groom') {
      if (a.groomP === P) { DF.Audio.play('pet'); react(a, UI.pick(REACT[a.type])); return; }
      a.groomP = P; S.friendAdd(a, 4); S.stat('groom'); S.stat('groom_' + a.type);
      S.addXP(2);
      if (S.statValue('groom_' + a.type) === 2 && d.facts[1]) S.learn(d.facts[1]);
      DF.Audio.play('pet');
      S.commit(1); UI.refresh();
      react(a, `${d.groom === 'Brush' ? '🪮' : d.groom === 'Walk' ? '🦮' : '🤲'} ${UI.pick(REACT[a.type])}`);
      return;
    }
    if (act === 'treat') {
      if (!d.treat) return;
      if (a.treatP === P) { UI.toast(`One treat is plenty for now. Treats are special — not every-meal food! 🍬`); return; }
      if (!S.has(d.treat)) { UI.toast(`You need a ${UI.itemName(d.treat).toLowerCase()} for this treat. ${DF.CROPS[d.treat] ? 'Grow some in the Garden!' : 'Pick some in the Orchard!'}`); return; }
      S.take(d.treat); a.treatP = P; S.friendAdd(a, 8); S.stat('treat');
      if (a.type === 'rabbit') S.learn('a_rabbit');
      DF.Audio.play('harvest');
      S.commit(1); UI.refresh();
      react(a, `${UI.itemName(d.treat)}! 💖💖`);
      return;
    }
    if (act === 'collect') {
      if (!S.animalReady(a)) return;
      a.collectP = P;
      if (d.product) {
        S.add(d.product, 1); S.stat('collect_' + d.product); S.stat('collect_any');
        S.addXP(3);
        DF.Audio.play('harvest');
        S.commit(1); UI.refresh();
        react(a, `+1 ${UI.itemName(d.product)}!`);
      } else {
        S.addXP(d.xpGift || 10); S.stat('cuddles');
        DF.Audio.play('pet');
        S.commit(1); UI.refresh();
        react(a, `😻 ${UI.esc(a.name)} curls up in your lap. +${d.xpGift || 10} XP`);
      }
    }
  }
  function react(a, text) {
    const card = UI.$(`[data-animal="${a.id}"]`);
    if (!card) return;
    const st = card.querySelector('.animal-stage');
    st.classList.remove('happy'); void st.offsetWidth; st.classList.add('happy');
    st.insertAdjacentHTML('beforeend', UI.heartsBurst());
    UI.floatAt(st, text);
  }

  function careGuide(a) {
    const d = DF.ANIMALS[a.type];
    const facts = d.facts.map(f => `<li>${DF.FACTS[f].text}</li>`).join('');
    const quiz = d.quiz;
    const m = UI.modal({
      title: `${d.name} Care Guide`, cls: 'small',
      body: `<div class="care-guide"><div class="cg-art">${A.animal(a.type, a.acc)}</div>
        <p><b>${UI.esc(a.name)}</b> — ${d.personality}</p>
        <h3 class="sub">Daily care</h3><ul class="care-list"><li>🍽 Food: ${d.food}${d.treat ? ` (treat: a little ${UI.itemName(d.treat).toLowerCase()})` : ''}</li><li>💧 Fresh, clean water every day</li><li>🏡 A safe, dry shelter</li><li>${d.groom === 'Walk' ? '🦮 A daily walk' : d.groom === 'Brush' ? '🪮 Gentle brushing' : '🤲 Gentle attention'}</li></ul>
        <h3 class="sub">Did you know?</h3><ul class="fact-list">${facts}</ul>
        ${a.quiz ? '<p class="done-note">✅ You’ve passed this care check!</p>' : `<div class="quiz-box" id="careQuiz"><h3 class="sub">🩺 Care check</h3><p>${quiz.q}</p><div class="answers">${UI.shuffle(quiz.a.map((t, i) => ({ t, i }))).map(o => `<button class="btn answer" data-ans="${o.i}">${o.t}</button>`).join('')}</div><p class="feedback" aria-live="polite"></p></div>`}
      </div>`,
      buttons: [{ label: 'Close', cls: 'ghost' }]
    });
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ans]'); if (!b || a.quiz) return;
      const fb = m.el.querySelector('.feedback');
      if (+b.dataset.ans === quiz.c) {
        a.quiz = true; S.friendAdd(a, 10); S.stat('care_quiz'); S.addXP(10);
        d.facts.forEach(f => S.learn(f, true));
        S.learn('a_responsible', true);
        b.classList.add('right');
        fb.innerHTML = `✅ ${quiz.why} <b>+10 friendship, +10 XP!</b>`;
        DF.Audio.play('right');
        UI.$$('[data-ans]', m.el).forEach(x => x.disabled = true);
        S.commit(); UI.refresh();
      } else {
        b.classList.add('wrong'); b.disabled = true;
        fb.innerHTML = `Not quite — that's okay! Hint: read the "Did you know?" facts above and try again. 💛`;
        DF.Audio.play('wrong');
      }
    });
  }

  function accessoryPicker(a) {
    const owned = DF.ACCESSORIES.filter(k => S.has(k));
    const m = UI.modal({
      title: `Dress up ${UI.esc(a.name)}`, cls: 'small',
      body: `<div class="acc-preview">${A.animal(a.type, a.acc)}</div>
        ${owned.length || a.acc ? `<div class="item-grid">${a.acc ? `<button class="item-tile" data-acc="none">${A.icon(a.acc)}<span class="nm">Take off ${UI.itemName(a.acc)}</span></button>` : ''}${owned.map(k => `<button class="item-tile" data-acc="${k}">${A.icon(k)}<span class="cnt">${S.count(k)}</span><span class="nm">${UI.itemName(k)}</span></button>`).join('')}</div>`
          : '<p class="empty-note">No accessories yet! Buy bows, bells and hats at the Market, or craft a Flower Crown.</p>'}`,
      buttons: [{ label: 'Done', cls: 'primary' }]
    });
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-acc]'); if (!b) return;
      if (a.acc) { S.add(a.acc, 1); a.acc = null; }
      if (b.dataset.acc !== 'none' && S.take(b.dataset.acc)) { a.acc = b.dataset.acc; S.stat('dressup'); }
      DF.Audio.play('place'); S.commit(); UI.refresh(); m.close(); accessoryPicker(a);
    });
  }

  function adopt(type) {
    const s = DF.state, d = DF.ANIMALS[type];
    if (s.level < d.lvl) { UI.toast(`🔒 You can adopt a ${d.name.toLowerCase()} at level ${d.lvl}.`); return; }
    if (s.coins < d.cost) { UI.toast(`Adopting costs ${d.cost} coins — you need ${d.cost - s.coins} more. (${d.cost} − ${s.coins} = ${d.cost - s.coins})`); return; }
    UI.modal({
      title: `Adopt a ${d.name.toLowerCase()}?`, cls: 'small',
      body: `<div class="center">${A.animal(type)}</div><p>${d.personality}</p><p>Adopting means caring for them every time you visit: food, fresh water, shelter and kindness. Ready?</p>
        <label class="field"><span>Name your new friend</span><input id="adoptName" type="text" maxlength="14" value="${d.defName}"></label>
        <p class="muted">Cost: ${d.cost} coins · you'll have ${s.coins - d.cost} left.</p>`,
      buttons: [{ label: 'Not yet', cls: 'ghost' }, {
        label: 'Adopt 💖', cls: 'primary', onClick: (m) => {
          if (!S.spend(d.cost)) return;
          const nm = (m.el.querySelector('#adoptName').value.replace(/[<>]/g, '').trim() || d.defName).slice(0, 14);
          s.animals.push({ id: 'a' + s.nextAnimalId++, type, name: nm, friend: 10, fedP: -1, groomP: -1, treatP: -1, collectP: -1, acc: null, quiz: false });
          S.stat('adopt'); S.addXP(15); S.learn(d.facts[0], true);
          DF.Audio.play('quest'); UI.confetti();
          S.commit(); UI.refresh();
          UI.clover(`Welcome to the family, ${nm}! 💕 ${d.personality}`, { hearts: true });
        }
      }]
    });
  }

  DF.Views.animals = {
    render(host) {
      const s = DF.state, P = s.time.P;
      const ownedTypes = new Set(s.animals.map(a => a.type));
      const adoptable = DF.ANIMAL_ORDER.filter(t => !ownedTypes.has(t) && DF.ANIMALS[t].cost);
      host.innerHTML = `<div class="page animals-page">
        <div class="page-head"><h1>The Animal Meadow</h1></div>
        <p class="lead">Feed and ${'groom'} each friend once in every part of the day. A happy animal (fed + cared for) shares a gift! Friendship never goes down — they're always happy to see you. 💕</p>
        <div class="animal-grid">${s.animals.map(a => {
          const d = DF.ANIMALS[a.type];
          const fed = a.fedP === P, groomed = a.groomP === P, ready = S.animalReady(a), collected = a.collectP === P;
          return `<article class="animal-card ${ready ? 'ready' : ''}" data-animal="${a.id}">
            <button class="animal-stage" data-act="groom" data-id="${a.id}" aria-label="${d.groom} ${UI.esc(a.name)}">${A.animal(a.type, a.acc)}${ready ? `<span class="gift-bubble">${d.product ? A.icon(d.product) : '💤'}</span>` : ''}</button>
            <div class="animal-head"><h3>${UI.esc(a.name)}</h3><button class="icon-btn" data-act="rename" data-id="${a.id}" aria-label="Rename ${UI.esc(a.name)}">✏️</button><span class="kind">${d.name}</span></div>
            ${hearts(a)}
            <div class="status-row"><span class="chip-s ${fed ? 'ok' : ''}">${fed ? '✓ Fed' : '🍽 Hungry'}</span><span class="chip-s ${groomed ? 'ok' : ''}">${groomed ? '✓ ' + (d.groom === 'Brush' ? 'Brushed' : d.groom === 'Walk' ? 'Walked' : 'Petted') : (d.groom === 'Brush' ? '🪮 Wants brushing' : d.groom === 'Walk' ? '🦮 Wants a walk' : '🤲 Wants pets')}</span></div>
            <div class="care-btns">
              <button class="btn care" data-act="feed" data-id="${a.id}" ${fed ? 'aria-disabled="true"' : ''}>🍽 Feed</button>
              <button class="btn care" data-act="groom" data-id="${a.id}">${d.groom === 'Brush' ? '🪮' : d.groom === 'Walk' ? '🦮' : '🤲'} ${d.groom}</button>
              ${d.treat ? `<button class="btn care" data-act="treat" data-id="${a.id}">${A.icon(d.treat)} Treat</button>` : ''}
            </div>
            ${ready ? `<button class="btn primary wide" data-act="collect" data-id="${a.id}">🎁 Collect ${productName(a.type)}</button>`
              : `<p class="care-hint">${collected ? `Thanks for the ${productName(a.type).toLowerCase()}! Visit again later. 💤` : a.friend < 10 ? 'Spend time together to build friendship.' : `Feed & ${d.groom.toLowerCase()} ${UI.esc(a.name)} to collect ${productName(a.type).toLowerCase()}.`}</p>`}
            <div class="card-foot"><button class="link-btn" data-act="guide" data-id="${a.id}">📗 Care guide${a.quiz ? ' ✅' : ''}</button><button class="link-btn" data-act="dress" data-id="${a.id}">🎀 Dress up</button></div>
          </article>`;
        }).join('')}</div>
        ${adoptable.length ? `<h2 class="section-title">🏡 Adoption Corner</h2><div class="adopt-grid">${adoptable.map(t => {
          const d = DF.ANIMALS[t], locked = s.level < d.lvl;
          return `<button class="adopt-card ${locked ? 'locked' : ''}" data-adopt="${t}" aria-label="Adopt a ${d.name}${locked ? ', unlocks at level ' + d.lvl : ', costs ' + d.cost + ' coins'}">${A.animal(t)}<b>${d.name}</b><span>${locked ? `🔒 Level ${d.lvl}` : UI.coin(d.cost)}</span></button>`;
        }).join('')}</div>` : '<p class="center muted">Every kind of animal has a home on your farm! 🏡</p>'}
      </div>`;
      host.onclick = (e) => {
        const ad = e.target.closest('[data-adopt]'); if (ad) { adopt(ad.dataset.adopt); return; }
        const b = e.target.closest('[data-act]'); if (!b) return;
        const a = s.animals.find(x => x.id === b.dataset.id); if (!a) return;
        const act = b.dataset.act;
        if (act === 'rename') { UI.ask(`Rename ${UI.esc(a.name)}`, 'New name', a.name, (v) => { a.name = v.slice(0, 14); S.commit(); UI.refresh(); }); return; }
        if (act === 'guide') { careGuide(a); return; }
        if (act === 'dress') { accessoryPicker(a); return; }
        careAction(a, act, b);
      };
    }
  };
})();
