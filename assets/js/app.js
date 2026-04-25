/* TINYSTEPS — interactions & widgets */
(function() {
  'use strict';

  /* ---------- Preloader ---------- */
  window.addEventListener('load', () => {
    const pl = document.getElementById('preloader');
    if (pl) setTimeout(() => pl.classList.add('hide'), 500);
  });

  /* ---------- Scroll progress ---------- */
  const progressBar = document.getElementById('progressBar');
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    if (progressBar) progressBar.style.width = (scrolled * 100) + '%';
    const bt = document.getElementById('backTop');
    if (bt) bt.classList.toggle('show', h.scrollTop > 600);
    // Update active nav link
    const sections = document.querySelectorAll('section[id], header[id]');
    let active = '';
    sections.forEach(s => {
      const top = s.getBoundingClientRect().top;
      if (top <= 120) active = s.id;
    });
    document.querySelectorAll('.dk-item, .tabbar a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href === '#' + active) a.classList.add('active');
      else a.classList.remove('active');
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Cursor (desktop only) ---------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.getElementById('cursor');
    const dot = document.getElementById('cursorDot');
    if (cursor && dot) {
      let mx = 0, my = 0, cx = 0, cy = 0;
      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`; });
      const tick = () => { cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18; cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`; requestAnimationFrame(tick); };
      tick();
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
    }
  }

  /* ---------- Reveal-on-scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Typed hero word ---------- */
  const typed = document.getElementById('typedText');
  if (typed) {
    const words = ['milestone', 'forecast', 'data point', 'tiny step'];
    let wi = 0, ci = 0, del = false;
    const typeTick = () => {
      const w = words[wi];
      if (!del) {
        ci++;
        typed.textContent = w.slice(0, ci);
        if (ci === w.length) { del = true; setTimeout(typeTick, 1500); return; }
      } else {
        ci--;
        typed.textContent = w.slice(0, ci);
        if (ci === 0) { del = false; wi = (wi+1) % words.length; }
      }
      setTimeout(typeTick, del ? 55 : 100);
    };
    setTimeout(typeTick, 600);
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const countIO = new IntersectionObserver((ents) => {
    ents.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      let start = 0, dur = 1400, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const e2 = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(start + (end - start) * e2) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countIO.observe(c));

  /* ---------- Phone slideshow (hero) ---------- */
  const phSlides = document.querySelectorAll('.ph-slide');
  const phDots = document.querySelectorAll('.ph-dots i');
  let phIdx = 0;
  const goPh = (i) => {
    phSlides.forEach(s => s.classList.remove('active'));
    phDots.forEach(d => d.classList.remove('active'));
    phSlides[i]?.classList.add('active');
    phDots[i]?.classList.add('active');
    phIdx = i;
  };
  phDots.forEach((d,i) => d.addEventListener('click', () => goPh(i)));
  if (phSlides.length) setInterval(() => goPh((phIdx+1) % phSlides.length), 4200);

  /* ---------- Dock dropdown ---------- */
  document.querySelectorAll('[data-popover]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.popover;
      document.querySelectorAll('.dk-popover').forEach(p => { if (p.id !== id) p.classList.remove('open'); });
      document.getElementById(id)?.classList.toggle('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dk-popover').forEach(p => p.classList.remove('open'));
  });

  /* ---------- Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const h = a.getAttribute('href');
      if (h.length > 1) {
        const t = document.querySelector(h);
        if (t) {
          e.preventDefault();
          document.querySelectorAll('.dk-popover').forEach(p => p.classList.remove('open'));
          window.scrollTo({ top: t.offsetTop - 20, behavior: 'smooth' });
        }
      }
    });
  });

  /* =======================================================
     WIDGET — TinySteps Module Map
     ======================================================= */
  const destinations = [
    { id:'growth', x:50, y:18, name:'Growth Monitoring', region:'Module 01 · LSTM + XGBoost', desc:'Single-layer LSTM (23,298 params) forecasts next-day weight and height from a 7-day sliding window. Paired with an XGBoost risk model (AUC 0.9499, 9.05-day lead time) and an RF-XGBoost anomaly ensemble.', img:'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop', meta:['600 infants','33,000 rows','41 features'] },
    { id:'asd', x:82, y:50, name:'ASD Screening', region:'Module 02 · Two-stage Q-CHAT', desc:'Stage-1 logistic regression maps 25 Q-CHAT features to three-class probabilities. Borderline cases (confidence < 0.70) escalate to Stage-2 XGBoost for a second-opinion score. Macro AUC 0.912, at-risk sensitivity 0.88.', img:'https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=800&auto=format&fit=crop', meta:['1,200 children','25 Q-CHAT items','AUC 0.912'] },
    { id:'cry', x:50, y:82, name:'Cry Analysis', region:'Module 03 · Audio-visual fusion', desc:'Three MFCC-based audio classifiers ensemble with a facial pain CNN (24.4 MB). A calibrated fusion model combines their outputs into pain / hunger / discomfort classes — 87.4% overall accuracy versus 79.2% audio-only.', img:'https://images.unsplash.com/photo-1566004100631-35d015d6a491?q=80&w=800&auto=format&fit=crop', meta:['4,500 recordings','40-D MFCC','87.4% acc'] },
    { id:'postpartum', x:18, y:50, name:'Postpartum Health', region:'Module 04 · Ridge + Random Forest', desc:'Ridge regression for back and pelvic pain (MAE 0.82, R²=0.74). Random Forests for perineal trauma (AUC 0.891) and C-section recovery (AUC 0.876). Each domain emits a stratified recommendation for caregiver follow-up.', img:'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop', meta:['850 mothers','3 domains','AUC 0.891'] }
  ];
  const slMap = document.getElementById('slMap');
  if (slMap) {
    const pinLayer = document.getElementById('slPins');
    const detail = document.getElementById('slDetail');
    destinations.forEach(d => {
      const pin = document.createElement('div');
      pin.className = 'sl-pin'; pin.style.left = d.x + '%'; pin.style.top = d.y + '%';
      pin.innerHTML = `<div class="pin-dot"></div>`;
      pin.addEventListener('click', () => showDest(d));
      pinLayer.appendChild(pin);
    });
    const showDest = (d) => {
      document.querySelectorAll('.sl-pin').forEach(p => p.classList.remove('active'));
      const pins = document.querySelectorAll('.sl-pin');
      const idx = destinations.findIndex(x => x.id === d.id);
      if (pins[idx]) pins[idx].classList.add('active');
      detail.innerHTML = `
        <div class="sl-img"><img src="${d.img}" alt="${d.name}" loading="lazy"></div>
        <span class="sl-region">${d.region}</span>
        <h4>${d.name}</h4>
        <p>${d.desc}</p>
        <div class="sl-meta">${d.meta.map(m => `<span><i class="fa-solid fa-circle-check"></i>${m}</span>`).join('')}</div>
      `;
    };
    showDest(destinations[0]);
  }

  /* =======================================================
     WIDGET — Module Performance Dial
     ======================================================= */
  const uvCities = {
    Growth:     { uv:9,  headline:9.05, auc:95, f1:75, extra:16, extraLabel:'Early detection',   tip:'XGBoost risk model · AUC 0.9499 · 9.05-day lead time · only 1.63 false alarms per infant.',   c:'growth · lead 9d' },
    ASD:        { uv:7,  headline:91,   auc:91, f1:85, extra:88, extraLabel:'At-risk sensitivity', tip:'Two-stage Q-CHAT · Stage-2 XGBoost lifts borderline F1 from 0.61 to 0.74.',                c:'screening · auc 0.91' },
    Cry:        { uv:8,  headline:87,   auc:87, f1:87, extra:8,  extraLabel:'Fusion gain (pts)',   tip:'Multi-modal fusion · 87.4% overall vs 79.2% audio-only · pain recall 0.91.',               c:'fusion · 87.4%' },
    Postpartum: { uv:9,  headline:89,   auc:89, f1:81, extra:74, extraLabel:'Back-pain R²',        tip:'Ridge back/pelvic MAE 0.82 · RF perineal AUC 0.891 · RF C-section AUC 0.876.',              c:'maternal · auc 0.89' }
  };
  const uvDialFill = document.getElementById('uvFill');
  const uvDialNum  = document.getElementById('uvNum');
  const uvDialLvl  = document.getElementById('uvLvl');
  const uvBars     = document.getElementById('uvBars');
  const uvTip      = document.getElementById('uvTip');
  const uvTabs     = document.getElementById('uvTabs');
  if (uvDialFill) {
    const R = 95; const C = 2 * Math.PI * R;
    uvDialFill.setAttribute('stroke-dasharray', C);
    const setCity = (name) => {
      const d = uvCities[name]; if (!d) return;
      const frac = Math.min(d.uv / 11, 1);
      uvDialFill.setAttribute('stroke-dashoffset', C * (1 - frac));
      uvDialNum.textContent = d.headline;
      uvDialLvl.textContent = d.c.toUpperCase();
      uvTip.innerHTML = `<i class="fa-solid fa-circle-info"></i>${d.tip}`;
      uvBars.innerHTML = `
        <div class="uv-r"><i class="fa-solid fa-chart-line"></i><div class="uv-r-bar"><div style="width:${d.auc}%"></div></div><span>AUC ${(d.auc/100).toFixed(2)}</span></div>
        <div class="uv-r"><i class="fa-solid fa-bullseye"></i><div class="uv-r-bar"><div style="width:${d.f1}%;background:linear-gradient(90deg,#7fb7d6,#4d8fb0)"></div></div><span>F1 ${(d.f1/100).toFixed(2)}</span></div>
        <div class="uv-r"><i class="fa-solid fa-seedling"></i><div class="uv-r-bar"><div style="width:${Math.min(d.extra,100)}%;background:linear-gradient(90deg,#6aa888,#9a92e3)"></div></div><span>${d.extra}${d.extraLabel.includes('R²')?'/100':''}</span></div>
      `;
    };
    Object.keys(uvCities).forEach((name,i) => {
      const b = document.createElement('button');
      b.textContent = name; if (i===0) b.classList.add('on');
      b.addEventListener('click', () => {
        uvTabs.querySelectorAll('button').forEach(x => x.classList.remove('on'));
        b.classList.add('on'); setCity(name);
      });
      uvTabs.appendChild(b);
    });
    setCity('Growth');
  }

  /* =======================================================
     WIDGET — Chatbot Demo
     ======================================================= */
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatSend  = document.getElementById('chatSend');
  const scripted = {
    'growth': [
      { t:'Loading the growth forecaster…', dly:600 },
      { t:'<strong>LSTM · 7-day window:</strong> next-day weight change +18 g · height change +0.06 cm.', dly:900 },
      { t:'<strong>XGBoost risk model:</strong> 7-day WAZ-crossing probability <em>0.08</em> (low). Lead-time average 9.05 days.', dly:900 },
      { t:'<strong>Anomaly ensemble:</strong> RF-XGBoost score 0.12 — today\'s measurement sits within personal baseline.', dly:900 },
      { t:'Current trajectory is <strong>stable</strong>. Continue feeding plan · revisit in 48h.', dly:700 }
    ],
    'cry': [
      { t:'Running the cry fusion model…', dly:800 },
      { t:'<strong>Audio ensemble (MFCC):</strong> hunger 0.86 · discomfort 0.10 · pain 0.04.', dly:900 },
      { t:'<strong>Facial pain CNN:</strong> pain probability 0.18 — low distress signal.', dly:900 },
      { t:'Calibrated fusion → <strong>hunger</strong> (confidence 0.83). Try feeding before re-checking.', dly:800 }
    ],
    'asd': [
      { t:'Loading the Q-CHAT screening pipeline…', dly:700 },
      { t:'<strong>Stage 1 · Logistic regression</strong> on 25 Q-CHAT features returns a 3-class probability vector.', dly:900 },
      { t:'If the Stage-1 confidence is below <em>0.70</em>, the case is routed to <strong>Stage 2 · XGBoost</strong> for a second-opinion score.', dly:900 },
      { t:'Final label is chosen by confidence-weighted voting. Macro AUC <strong>0.912</strong>, at-risk sensitivity <strong>0.88</strong>.', dly:800 }
    ],
    'postpartum': [
      { t:'Opening the postpartum assessment…', dly:600 },
      { t:'<strong>Back & pelvic pain (Ridge):</strong> 1.4 / 10 — low, continue mobility exercises.', dly:900 },
      { t:'<strong>Perineal trauma (Random Forest):</strong> low risk · AUC 0.891 on held-out cohort.', dly:900 },
      { t:'<strong>C-section recovery (Random Forest):</strong> not applicable for this mother.', dly:700 }
    ],
    'default': [
      { t:'I can help across four modules — growth forecasting, ASD screening, cry analysis and postpartum recovery. Try one of the suggestions below!', dly:700 }
    ]
  };
  const addBubble = (text, who='bot', html=false) => {
    const m = document.createElement('div'); m.className = 'chat-msg ' + who;
    const b = document.createElement('div'); b.className = 'bubble';
    if (html) b.innerHTML = text; else b.textContent = text;
    m.appendChild(b); chatBody.appendChild(m);
    chatBody.scrollTop = chatBody.scrollHeight;
  };
  const addTyping = () => {
    const m = document.createElement('div'); m.className = 'chat-msg bot typing-row';
    m.innerHTML = `<div class="chat-typing"><i></i><i></i><i></i></div>`;
    chatBody.appendChild(m); chatBody.scrollTop = chatBody.scrollHeight; return m;
  };
  const matchScript = (q) => {
    q = q.toLowerCase();
    if (/growth|weight|height|lstm|forecast|waz|risk/.test(q)) return scripted['growth'];
    if (/cry|crying|pain|hunger|fusion|mfcc/.test(q)) return scripted['cry'];
    if (/asd|autism|q-?chat|screen|developmental/.test(q)) return scripted['asd'];
    if (/postpartum|maternal|pelvic|perineal|c-?section|back pain|ridge/.test(q)) return scripted['postpartum'];
    return scripted['default'];
  };
  const runBot = async (userMsg) => {
    const script = matchScript(userMsg);
    for (const step of script) {
      const typing = addTyping();
      await new Promise(r => setTimeout(r, step.dly));
      typing.remove();
      addBubble(step.t, 'bot', true);
      await new Promise(r => setTimeout(r, 200));
    }
  };
  if (chatSend && chatInput) {
    const send = () => {
      const q = chatInput.value.trim(); if (!q) return;
      addBubble(q, 'user'); chatInput.value = '';
      runBot(q);
    };
    chatSend.addEventListener('click', send);
    chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
    document.querySelectorAll('.chat-suggest button').forEach(b => {
      b.addEventListener('click', () => { chatInput.value = b.dataset.q; send(); });
    });
    // seed
    setTimeout(() => {
      addBubble('Hello! I\'m TinySteps — a caregiver-facing assistant spanning four clinical modules. Ask me about growth, cries, screening or postpartum recovery.', 'bot', true);
    }, 400);
  }

  /* =======================================================
     WIDGET — Risk Score Estimator (per module / age group)
     ======================================================= */
  const moduleProfiles = {
    growth:     { name:'Growth', base: 0.12, ageBias: { g1:1.3, g2:1.1, g3:1.0, g4:0.9, g5:0.85, g6:0 }, disabledAge: ['g6'], lead: 9.05, auc: 0.9499 },
    asd:        { name:'ASD',    base: 0.22, ageBias: { g1:0.4, g2:0.7, g3:1.0, g4:1.15, g5:1.25, g6:0 }, disabledAge: ['g1','g6'], lead: null, auc: 0.912 },
    cry:        { name:'Cry',    base: 0.30, ageBias: { g1:1.1, g2:1.2, g3:1.0, g4:0.9, g5:0.7, g6:0 },  disabledAge: ['g6'], lead: null, auc: 0.874 },
    postpartum: { name:'Postpartum', base: 0.35, ageBias: { g1:0, g2:0, g3:0, g4:0, g5:0, g6:1.0 },      disabledAge: ['g1','g2','g3','g4','g5'], lead: null, auc: 0.891 }
  };
  const ageLabels = { g1:'0–30 days', g2:'31–90 days', g3:'91–180 days', g4:'181–365 days', g5:'1–2 years', g6:'Adult · maternal' };
  const fareFrom = document.getElementById('fareFrom');
  const fareTo   = document.getElementById('fareTo');
  const farePax  = document.getElementById('farePax');
  const fareComf = document.getElementById('fareComf');
  const fareCV   = document.getElementById('fareComfV');
  const fareRes  = document.getElementById('fareRes');

  const computeFare = () => {
    if (!fareFrom) return;
    const mod = moduleProfiles[fareFrom.value];
    const age = fareTo.value;
    const obs = Math.max(1, +farePax.value || 1);
    const caution = +fareComf.value;
    fareCV.textContent = ['Conservative','Balanced','Vigilant','Maximum'][caution-1];
    if (!mod || mod.disabledAge.includes(age)) {
      fareRes.innerHTML = '<div class="fare-res"><div class="ic car"><i class="fa-solid fa-circle-info"></i></div><div><h5>Not applicable for this age group</h5><small>Try another age bracket or module combination</small></div><div></div></div>';
      return;
    }
    const cautionMul = [0.7, 1.0, 1.3, 1.6][caution-1];
    const obsFactor = Math.min(1.4, 0.5 + obs / 14);
    const rawRisk = Math.min(0.99, mod.base * mod.ageBias[age] * cautionMul);
    const confidence = Math.min(0.99, 0.55 + obsFactor * 0.3);

    const options = [
      { key:'flag', ic:'tuk', icon:'fa-triangle-exclamation', name:'Risk flag',           val:(rawRisk*100).toFixed(1)+'%',           sub:`${mod.name} · ${ageLabels[age]}`, best:true },
      { key:'conf', ic:'bus', icon:'fa-bullseye',             name:'Model confidence',    val:confidence.toFixed(2),                  sub:`based on ${obs} recent observations` },
      { key:'auc',  ic:'train',icon:'fa-chart-line',          name:'Held-out AUC',        val:mod.auc.toFixed(3),                     sub:'Test-set benchmark · paper Table III/IV/V/VI' },
      { key:'lead', ic:'car', icon:'fa-clock',                name:'Lead time',           val: mod.lead ? mod.lead.toFixed(2)+' d' : '—', sub: mod.lead ? 'Average early-detection window' : 'Not defined for this module' }
    ];
    fareRes.innerHTML = options.map(o => `
      <div class="fare-res ${o.best ? 'best' : ''}">
        <div class="ic ${o.ic}"><i class="fa-solid ${o.icon}"></i></div>
        <div><h5>${o.name}</h5><small>${o.sub}</small></div>
        <div class="price">${o.val}<small>${mod.name}</small></div>
      </div>`).join('');
  };
  [fareFrom, fareTo, farePax, fareComf].forEach(el => el && el.addEventListener('input', computeFare));
  computeFare();

  /* =======================================================
     WIDGET — Safety Alert Feed (live-ish)
     ======================================================= */
  const feed = document.getElementById('safetyFeed');
  const alertPool = [
    { lvl:'info', icon:'fa-chart-line',          t:'Growth update',         s:'LSTM forecast aligns with personal baseline · cumulative D14 error 89 g.', time:'2m' },
    { lvl:'warn', icon:'fa-triangle-exclamation',t:'WAZ drift detected',    s:'Risk model XGBoost 2A flags increased 7-day probability (0.46). Schedule a visit.', time:'9m' },
    { lvl:'crit', icon:'fa-heart-pulse',         t:'Anomaly ensemble',      s:'RF-XGBoost anomaly score 0.81 — personal baseline deviation on day 48.', time:'14m' },
    { lvl:'info', icon:'fa-shield-heart',        t:'ASD Stage-1 typical',   s:'Q-CHAT stage-1 classifies case as typical with confidence 0.92.', time:'22m' },
    { lvl:'warn', icon:'fa-brain',               t:'Borderline escalation', s:'Stage-1 confidence 0.64 below threshold · routed to Stage-2 XGBoost.', time:'31m' },
    { lvl:'info', icon:'fa-waveform',            t:'Cry classified · hunger', s:'Audio + facial fusion returns hunger 0.86 · suggest feed before re-check.', time:'44m' },
    { lvl:'crit', icon:'fa-person-breastfeeding',t:'Postpartum alert',      s:'Ridge back-pain score 6.8 / 10 · schedule physiotherapy review.', time:'1h' },
    { lvl:'info', icon:'fa-circle-check',        t:'All modules nominal',   s:'Daily pipeline completed · growth, ASD, cry and postpartum aggregates saved.', time:'1h' }
  ];
  if (feed) {
    feed.innerHTML = alertPool.slice(0,6).map((a,i) => `
      <div class="alert-item lvl-${a.lvl}" style="animation-delay:${i*0.08}s">
        <div class="ic"><i class="fa-solid ${a.icon}"></i></div>
        <div><strong>${a.t}</strong><small>${a.s}</small></div>
        <span class="time">${a.time}</span>
      </div>`).join('');
    // Auto-prepend a new random alert every 6s (simulated)
    let counter = 0;
    setInterval(() => {
      if (document.hidden) return;
      const a = alertPool[counter % alertPool.length]; counter++;
      const div = document.createElement('div');
      div.className = 'alert-item lvl-' + a.lvl;
      div.innerHTML = `<div class="ic"><i class="fa-solid ${a.icon}"></i></div><div><strong>${a.t}</strong><small>${a.s}</small></div><span class="time">now</span>`;
      feed.prepend(div);
      if (feed.children.length > 8) feed.lastElementChild.remove();
    }, 6500);
  }

  /* =======================================================
     WIDGET — Itinerary Drag-Drop
     ======================================================= */
  const itinList = document.getElementById('itinList');
  const itinDays = document.querySelectorAll('.itin-day-slot');
  const activities = [
    { id:'a1',  label:'Weight measurement', cat:'culture',   h:'5m', sub:'Daily · baseline input' },
    { id:'a2',  label:'Height / length',    cat:'culture',   h:'5m', sub:'Weekly · LSTM input' },
    { id:'a3',  label:'Growth review',      cat:'adventure', h:'10m',sub:'Anomaly card · risk flag' },
    { id:'a4',  label:'Q-CHAT screening',   cat:'nature',    h:'12m',sub:'25-item behavioural' },
    { id:'a5',  label:'Cry recording',      cat:'nature',    h:'30s',sub:'5s audio + facial frame' },
    { id:'a6',  label:'Feed tracking',      cat:'food',      h:'2m', sub:'Breast / formula log' },
    { id:'a7',  label:'Sleep log',          cat:'food',      h:'1m', sub:'Caregiver entry' },
    { id:'a8',  label:'Back-pain check',    cat:'adventure', h:'3m', sub:'Ridge regression input' },
    { id:'a9',  label:'Perineal survey',    cat:'nature',    h:'3m', sub:'Random Forest input' },
    { id:'a10', label:'C-section wound',    cat:'beach',     h:'3m', sub:'Healing indicators' }
  ];
  const iconOf = { culture:'fa-chart-line', nature:'fa-brain', adventure:'fa-waveform', food:'fa-baby-carriage', beach:'fa-heart-pulse' };
  if (itinList) {
    itinList.innerHTML = activities.map(a => `
      <div class="itin-chip" draggable="true" data-id="${a.id}">
        <div class="ic ${a.cat}"><i class="fa-solid ${iconOf[a.cat]}"></i></div>
        <div class="label">${a.label}<small>${a.sub}</small></div>
        <div class="h">${a.h}</div>
      </div>`).join('');

    let dragged = null;
    document.querySelectorAll('.itin-chip').forEach(c => {
      c.addEventListener('dragstart', e => {
        dragged = c; c.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      c.addEventListener('dragend', () => { c.classList.remove('dragging'); dragged = null; });
    });
    itinDays.forEach(d => {
      d.addEventListener('dragover', e => { e.preventDefault(); d.parentElement.classList.add('over'); });
      d.addEventListener('dragleave', () => d.parentElement.classList.remove('over'));
      d.addEventListener('drop', e => {
        e.preventDefault();
        d.parentElement.classList.remove('over');
        if (dragged) {
          const clone = dragged.cloneNode(true);
          clone.classList.remove('dragging');
          clone.setAttribute('draggable', 'false');
          clone.addEventListener('click', () => clone.remove());
          clone.style.cursor = 'pointer';
          clone.title = 'Click to remove';
          d.appendChild(clone);
          d.classList.remove('empty');
        }
      });
    });
  }

  /* =======================================================
     WIDGET — Testimonials carousel
     ======================================================= */
  const track = document.getElementById('testTrack');
  const testDots = document.getElementById('testDots');
  if (track) {
    const count = track.children.length;
    let tIdx = 0;
    const perView = () => window.innerWidth > 860 ? 3 : window.innerWidth > 520 ? 2 : 1;
    const update = () => {
      const card = track.children[0]; if (!card) return;
      const cw = card.getBoundingClientRect().width + 20;
      const max = Math.max(0, count - perView());
      tIdx = Math.min(tIdx, max);
      track.style.transform = `translateX(${-tIdx * cw}px)`;
      if (testDots) testDots.querySelectorAll('i').forEach((d,i) => d.classList.toggle('on', i === tIdx));
    };
    if (testDots) {
      for (let i = 0; i <= count - perView(); i++) {
        const dot = document.createElement('i');
        dot.addEventListener('click', () => { tIdx = i; update(); });
        testDots.appendChild(dot);
      }
      testDots.children[0]?.classList.add('on');
    }
    let aut = setInterval(() => { tIdx = (tIdx + 1) % Math.max(1, count - perView() + 1); update(); }, 4500);
    track.addEventListener('pointerenter', () => clearInterval(aut));
    window.addEventListener('resize', update);
    update();
  }

  /* =======================================================
     WIDGET — AI Demo (3-step)
     ======================================================= */
  const steps = document.querySelectorAll('.aidemo-step');
  const panes = document.querySelectorAll('.aidemo-pane');
  let adStep = 0;
  let adPrefs = new Set();
  let adDays = 5;
  const goStep = (i) => {
    adStep = i;
    steps.forEach((s,k) => {
      s.classList.toggle('on', k === i);
      s.classList.toggle('done', k < i);
    });
    panes.forEach((p,k) => p.classList.toggle('on', k === i));
    if (i === 2) renderPlan();
  };
  steps.forEach((s,i) => s.addEventListener('click', () => goStep(i)));
  document.querySelectorAll('[data-ad-next]').forEach(b => b.addEventListener('click', () => goStep(Math.min(adStep+1, 2))));
  document.querySelectorAll('[data-ad-prev]').forEach(b => b.addEventListener('click', () => goStep(Math.max(adStep-1, 0))));

  document.querySelectorAll('.ad-pref').forEach(p => {
    p.addEventListener('click', () => { p.classList.toggle('on'); const k = p.dataset.pref; if (adPrefs.has(k)) adPrefs.delete(k); else adPrefs.add(k); });
  });
  document.querySelectorAll('.ad-days button').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.ad-days button').forEach(x => x.classList.remove('on'));
      b.classList.add('on'); adDays = +b.dataset.days;
    });
  });

  const planTemplates = {
    culture:  ['Log weight · LSTM input','Height reading · weekly','Review anomaly card','Risk-flag check · XGBoost 2A','Growth trajectory review'],
    nature:   ['Q-CHAT milestone (5 items)','Stage-1 logistic screening','Borderline Stage-2 review','Developmental follow-up','Clinician sharing link'],
    beach:    ['Cry recording · 5s','Facial frame capture','Fusion model output review','Hunger vs pain trend','Night-time cry replay'],
    food:     ['Back-pain Ridge entry','Perineal RF survey','C-section wound log','Mobility score · weekly','Postpartum visit prep'],
    adventure:['Feed log · formula / breast','Sleep duration entry','Immunisation reminder','Vitamin D check','Bath / skincare note'],
    wellness: ['Bonding time note','Caregiver stress check','Sleep quality (mother)','Kangaroo care minutes','Family support summary']
  };
  const renderPlan = () => {
    const wrap = document.getElementById('adPlan'); if (!wrap) return;
    const picks = adPrefs.size ? [...adPrefs] : ['culture','nature','food'];
    let items = [];
    picks.forEach(k => items.push(...(planTemplates[k] || [])));
    items = items.sort(() => Math.random() - 0.5).slice(0, adDays);
    while (items.length < adDays) items.push(planTemplates.culture[items.length % 5]);
    wrap.innerHTML = items.map((it,i) => `
      <div class="ad-plan-day" style="animation-delay:${i*0.08}s">
        <h5>Day ${i+1} · ${it}</h5>
        <p>TinySteps has scheduled this around the infant's stage, recent model outputs and caregiver availability.</p>
      </div>`).join('');
  };

  /* =======================================================
     TWEAKS panel
     ======================================================= */
  const tweaksBtn = document.getElementById('tweaksBtn');
  const tweaksPanel = document.getElementById('tweaksPanel');
  if (tweaksBtn && tweaksPanel) {
    tweaksBtn.addEventListener('click', (e) => { e.stopPropagation(); tweaksPanel.classList.toggle('open'); });
    document.addEventListener('click', (e) => { if (!tweaksPanel.contains(e.target) && e.target !== tweaksBtn) tweaksPanel.classList.remove('open'); });
    // Motion intensity
    document.querySelectorAll('[data-motion]').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('[data-motion]').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        const m = b.dataset.motion;
        document.body.classList.remove('motion-low','motion-med','motion-high');
        document.body.classList.add('motion-' + m);
        document.documentElement.style.setProperty('--motion', m === 'low' ? 0.3 : m === 'high' ? 1.2 : 1);
      });
    });
    // Accent color
    document.querySelectorAll('[data-accent]').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('[data-accent]').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        const acc = b.dataset.accent;
        const map = {
          coral:  { a:'#f48b7e', b:'#e7675a' },
          gold:   { a:'#e8b86a', b:'#c89545' },
          ocean:  { a:'#4d8fb0', b:'#2f6b8a' },
          lotus:  { a:'#c76ea8', b:'#9e4e86' },
          jungle: { a:'#6aa888', b:'#4c8168' }
        };
        const c = map[acc]; if (!c) return;
        document.documentElement.style.setProperty('--c-sunset', c.a);
        document.documentElement.style.setProperty('--c-sunset-2', c.b);
        document.documentElement.style.setProperty('--accent', c.a);
      });
    });
    // Hero variant
    document.querySelectorAll('[data-variant]').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('[data-variant]').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        const hero = document.getElementById('home');
        hero.classList.remove('variant-v1','variant-v2','variant-v3');
        hero.classList.add('variant-' + b.dataset.variant);
      });
    });
  }

  /* =======================================================
     Contact form (mock)
     ======================================================= */
  const cf = document.getElementById('contactForm');
  if (cf) {
    cf.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = document.getElementById('formNote');
      note.textContent = 'Thank you! Your message has been received — we will reply within 48h.';
      cf.reset();
      setTimeout(() => note.textContent = '', 6000);
    });
  }

})();
