/* ============================================================
   CORE DESIGN v3 — "Blackout" (js/main.js)
   i18n (RU default / EN) + GSAP/ScrollTrigger motion + 2D mosaic canvas.
   Motion DNA: sticky-stack services, giant swapping approach numeral,
   outlined marquee, draw-on Tabler icons, count-up stats, magnetic CTA.
   Graceful degradation: no GSAP -> static; reduced-motion -> static.
   ============================================================ */
(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- i18n ---------------- */
  var EN = {
    navServices:"Services", navApproach:"Approach", navAbout:"About", navContact:"Contacts",
    ctaPrimary:"Discuss your task",
    heroEyebrow:"Integrated business support platform",
    h1l1:"We structure,", h1acc:"protect", h1l2b:" and grow", h1l3:"your business",
    heroSub:"Strategic and operational support for businesses across Russia, the CIS and the Middle East: finance, law, tax and risk in one team.",
    heroCta1:"Discuss your task", heroCta2:"Explore services",
    sec1:"Manufacturing", sec2:"Trade", sec3:"IT", sec4:"Financial services",
    sec1b:"Manufacturing", sec2b:"Trade", sec3b:"IT", sec4b:"Financial services",
    aboutLead:"The partner businesses trust to structure, protect and grow.",
    aboutP:"Core Business Consulting combines local expertise with international experience. We build tailored solutions across management, finance, law, tax and risk: from manufacturing and trade to IT and financial services.",
    pr1:"Professionalism", pr2:"Stability", pr3:"Transparency", pr4:"Foresight",
    pr1d:"Deep expertise in every engagement.", pr2d:"Predictable processes and outcomes.",
    pr3d:"Clear decisions and honest reporting.", pr4d:"Decisions built for the years ahead.",
    servLabel:"What we do", servH1:"Six disciplines. ", servH2:"One team.",
    s1t:"Accounting & finance", s1d:"The full cycle of accounting and finance: records, RAS and IFRS reporting, treasury and budget control.", s1p:"RAS & IFRS, audit, tax",
    s2t:"Law & tax", s2d:"Legal support from incorporation and structuring to transactions and disputes, with an optimal cash-flow model.", s2p:"UAE, Russia, Kazakhstan, deals",
    s3t:"Human capital", s3d:"The full HR spectrum: personnel administration, recruitment, HR policy and incentive systems. Transparent processes.", s3p:"Admin, recruitment, incentives",
    s4t:"Investment & valuation", s4d:"Independent valuation of companies, projects and assets; analysis of business models and deal-structure recommendations.", s4p:"Assets, business models, deals",
    s5t:"Compliance & risk", s5d:"A business-protection system: forensic investigations, internal control, asset-leakage prevention and risk monitoring.", s5p:"Forensic, control, monitoring",
    s6t:"Project management", s6d:"Strategic and operational management of projects: from corporate strategy to organisational and technology rollouts.", s6p:"Strategy, process, rollout",
    appH:"A predictable outcome at every stage",
    ap1t:"Diagnostics", ap1d:"Audit of the current structure, financial model and risks. We agree on goals and constraints.",
    ap2t:"Architecture", ap2d:"We design the corporate and tax structure around the business and its jurisdictions.",
    ap3t:"Implementation", ap3d:"Incorporation, licences, accounting setup, processes and controls.",
    ap4t:"Ongoing support", ap4d:"Day-to-day accounting, reporting, compliance and analytics for management decisions.",
    ap5t:"Optimization", ap5d:"Continuous process improvement, efficiency control and long-term business sustainability.",
    st1:"years of combined team expertise", st2:"key jurisdictions: UAE, Russia, Kazakhstan", st3:"business-support disciplines", st4:"cost reduction in restructuring projects",
    tH:"A team that speaks the language of numbers",
    q1:"Within a year Core Business Consulting rebuilt our group across two jurisdictions and closed long-standing accounting issues.",
    q1n:"Igor Demidov", q1r:"CFO, manufacturing group, Kazan",
    q2:"Incorporation in the UAE and setting up compliance took less time than we planned. The team works with numbers.",
    q2n:"Leyla Abbas", q2r:"COO, trading group, Dubai",
    contactLabel:"Get in touch", contactH:"Let's discuss your business", contactP:"We'll prepare a tailored proposal for your specific objectives.",
    cdEmail:"Email", cdJur:"Jurisdictions", cdJurV:"UAE, Russia, Kazakhstan", cdReg:"Regions", cdRegV:"Russia, CIS, Middle East",
    fName:"Name", fComp:"Company", fCompH:"Optional", fEmail:"Email", fMsg:"Your task", fSend:"Send request",
    errName:"Please enter your name", errEmail:"Please enter a valid email", errMsg:"Please describe your task",
    sentMsg:"Thank you! We'll be in touch shortly.",
    formError:"Could not send your request. Please try again or email info@cbc.com.",
    ftTag:"Integrated business support across Russia, the CIS and the Middle East.",
    ftS1:"Accounting", ftS2:"Law & tax", ftS3:"HR", ftS4:"Investment",
    ftAddr:"Address on request", ftRights:"© 2026 Core Business Consulting. All rights reserved.",
    legalPrivacy:"Privacy Policy", legalTerms:"Terms of Use"
  };
  var RU = {};
  var phEN = { "Иван Петров":"John Smith", "ООО «Компания»":"Your company", "name@company.com":"name@company.com", "Опишите задачу и сроки":"Describe your task and timeline" };

  function applyLang(l){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k = el.getAttribute('data-i18n');
      if(l==='en'){ if(!(k in RU)) RU[k] = el.textContent; if(EN[k]!=null) el.textContent = EN[k]; }
      else if(k in RU){ el.textContent = RU[k]; }
    });
    document.querySelectorAll('[data-ph]').forEach(function(el){
      var base = el.getAttribute('data-ph');
      el.placeholder = (l==='en' && phEN[base]) ? phEN[base] : base;
    });
    document.querySelectorAll('.lang button').forEach(function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-lang')===l ? 'true':'false');
    });
    document.documentElement.lang = l;
    if(window.ScrollTrigger){ ScrollTrigger.refresh(); }
  }
  document.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener('click', function(){ applyLang(b.getAttribute('data-lang')); });
  });

  var header = document.getElementById('header');

  /* ---------------- counters ---------------- */
  function runCount(el){
    if(el._done) return; el._done = true;
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec')||'0',10);
    var suf = el.getAttribute('data-suffix')||'';
    if(reduce || !window.gsap){ el.textContent = target.toFixed(dec)+suf; return; }
    var o={v:0};
    gsap.to(o,{v:target,duration:1.5,ease:'power2.out',onUpdate:function(){ el.textContent=o.v.toFixed(dec)+suf; }});
  }

  /* ---------------- contact form (same contract as core_design_v2) ---------------- */
  var FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxx' — empty = demo mode
  var SENDING = { ru:'Отправка…', en:'Sending…' };
  var form = document.getElementById('cform');
  if(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var name=form.name.value.trim(), email=form.email.value.trim(), msg=form.message.value.trim();
      var ok=true;
      function mark(id,bad){ document.getElementById(id).classList.toggle('show',bad); if(bad) ok=false; }
      mark('e_name', !name);
      mark('e_email', !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email));
      mark('e_msg', !msg);
      var sent=document.getElementById('sent'), errBox=document.getElementById('formErr');
      sent.classList.remove('show'); errBox.classList.remove('show');
      if(!ok) return;
      var lang = (document.documentElement.lang==='en') ? 'en' : 'ru';
      if(!FORM_ENDPOINT){ sent.classList.add('show'); form.reset(); return; }
      var btn = form.querySelector('button[type="submit"]'); var label = btn.textContent;
      btn.disabled = true; btn.textContent = SENDING[lang];
      fetch(FORM_ENDPOINT, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
        body: JSON.stringify({ name:name, company:form.company.value.trim(), email:email, message:msg })
      })
      .then(function(r){ if(!r.ok) throw new Error('http '+r.status); })
      .then(function(){ sent.classList.add('show'); form.reset(); })
      .catch(function(){ errBox.classList.add('show'); })
      .finally(function(){ btn.disabled=false; btn.textContent=label; });
    });
  }

  /* ---------------- static fallback ---------------- */
  function showAllStatic(){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); el.style.opacity=1; el.style.transform='none'; });
    document.querySelectorAll('.line-in').forEach(function(el){ el.style.transform='none'; });
    document.querySelectorAll('[data-count]').forEach(runCount);
    document.querySelectorAll('.astep').forEach(function(s){ s.classList.add('active'); });
  }

  applyLang('ru');

  /* ---------------- GSAP motion ---------------- */
  function initMotion(){
    if(!window.gsap || !window.ScrollTrigger){ showAllStatic(); return; }
    gsap.registerPlugin(ScrollTrigger);
    if(reduce){ showAllStatic(); return; }

    ScrollTrigger.create({ start:'top -60', end:99999,
      onUpdate:function(self){ header.classList.toggle('scrolled', self.scroll()>60); } });

    gsap.to('#progress',{ scaleX:1, ease:'none',
      scrollTrigger:{ trigger:document.body, start:'top top', end:'bottom bottom', scrub:0.3 } });

    /* hero entrance */
    var tl = gsap.timeline({ defaults:{ ease:'power3.out' } });
    gsap.set('.line-in',{ yPercent:115 });
    gsap.set(['.hero-eyebrow','.hero-sub','.hero-cta'],{ opacity:0, y:22 });
    tl.to('.hero-eyebrow',{ opacity:1, y:0, duration:.6 },0)
      .to('.line-in',{ yPercent:0, duration:1, stagger:.12 },0.05)
      .to('.hero-sub',{ opacity:1, y:0, duration:.6 },0.55)
      .to('.hero-cta',{ opacity:1, y:0, duration:.6 },0.68);

    /* generic reveals */
    gsap.utils.toArray('.reveal').forEach(function(el){
      gsap.fromTo(el,{ opacity:0, y:30 },{ opacity:1, y:0, duration:.85, ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 86%', onEnter:function(){ el.classList.add('in'); } } });
    });

    /* counters */
    gsap.utils.toArray('[data-count]').forEach(function(el){
      ScrollTrigger.create({ trigger:el, start:'top 88%', once:true, onEnter:function(){ runCount(el); } });
    });

    /* approach steps activate in sequence (all sizes) */
    gsap.utils.toArray('.astep').forEach(function(s){
      ScrollTrigger.create({ trigger:s, start:'top 68%',
        onEnter:function(){ s.classList.add('active'); }, onLeaveBack:function(){ s.classList.remove('active'); } });
    });

    /* sectors marquee (single, seamless) */
    (function(){
      var track = document.getElementById('marquee');
      if(!track) return;
      var half = track.scrollWidth/2;
      if(!half) return;
      gsap.to(track,{ x:-half, duration:20, ease:'none', repeat:-1,
        modifiers:{ x:function(x){ return (parseFloat(x)%half)+'px'; } } });
    })();

    /* desktop-only: sticky-stack services + numeral swap + magnetic CTA */
    gsap.matchMedia().add('(min-width: 901px)', function(){
      var TOP = 88; // clearance under the fixed header

      /* services stack: each card pins below the header; the next slides over while
         the pinned one recedes (scale + dim). pinSpacing:false keeps the page length honest. */
      var cards = gsap.utils.toArray('.stack-card');
      cards.forEach(function(card, i){
        if(i === cards.length-1) return;
        ScrollTrigger.create({ trigger:card, start:'top top+='+TOP,
          endTrigger:cards[cards.length-1], end:'top top+='+TOP,
          pin:true, pinSpacing:false, refreshPriority:1 });
        gsap.to(card,{ scale:.95, opacity:.45, ease:'none',
          scrollTrigger:{ trigger:cards[i+1], start:'top bottom', end:'top top+='+TOP, scrub:true } });
      });

      /* approach: the giant outlined numeral swaps as steps pass the sticky heading */
      var big = document.getElementById('bignum');
      function setNum(n){
        if(!big || big._n === n) return; big._n = n;
        big.textContent = '0'+n;
        gsap.fromTo(big,{ yPercent:16, opacity:0 },{ yPercent:0, opacity:1, duration:.45, ease:'power3.out', overwrite:'auto' });
      }
      gsap.utils.toArray('.astep').forEach(function(s, i){
        ScrollTrigger.create({ trigger:s, start:'top 58%', end:'bottom 58%',
          onToggle:function(self){ if(self.isActive) setNum(i+1); } });
      });

      /* magnetic primary CTA */
      var mag = document.getElementById('magnet');
      if(mag){
        var xTo = gsap.quickTo(mag,'x',{ duration:.5, ease:'power3' });
        var yTo = gsap.quickTo(mag,'y',{ duration:.5, ease:'power3' });
        mag.addEventListener('pointermove', function(e){
          var r = mag.getBoundingClientRect();
          xTo((e.clientX-(r.left+r.width/2))*0.4); yTo((e.clientY-(r.top+r.height/2))*0.5);
        });
        mag.addEventListener('pointerleave', function(){ xTo(0); yTo(0); });
      }
    });

    ScrollTrigger.refresh();
    if(document.fonts && document.fonts.ready){ document.fonts.ready.then(function(){ ScrollTrigger.refresh(); }); }
  }

  /* ---------------- animated line icons (draw-on in view + hover replay) ---------------- */
  function setupAnimIcons(){
    var icons = Array.prototype.slice.call(document.querySelectorAll('.aicon'));
    if(!icons.length) return;
    icons.forEach(function(svg){
      svg._shapes = [];
      svg.querySelectorAll('path,circle,line,polyline,polygon,rect,ellipse').forEach(function(sh){
        var len = 0; try { len = sh.getTotalLength(); } catch(e){}
        if(len > 0.5){ sh.style.strokeDasharray = len; sh._len = len; svg._shapes.push(sh); }
      });
    });
    if(reduce) return;
    function draw(svg){
      svg._shapes.forEach(function(sh,i){
        sh.style.transition = 'none';
        sh.style.strokeDashoffset = sh._len;
        sh.getBoundingClientRect();
        sh.style.transition = 'stroke-dashoffset .55s cubic-bezier(.16,1,.3,1) ' + (i*0.06) + 's';
        sh.style.strokeDashoffset = '0';
      });
    }
    icons.forEach(function(svg){ svg._shapes.forEach(function(sh){ sh.style.strokeDashoffset = sh._len; }); });
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(es){
        es.forEach(function(e){ if(e.isIntersecting){ draw(e.target); io.unobserve(e.target); } });
      }, { threshold:0.35 });
      icons.forEach(function(svg){ io.observe(svg); });
    } else { icons.forEach(draw); }
    document.querySelectorAll('.stack-card').forEach(function(card){
      var svg = card.querySelector('.aicon'); if(!svg) return;
      card.addEventListener('pointerenter', function(){ draw(svg); });
    });
  }

  /* ---------------- hero mosaic: grid-aligned flickering cells ---------------- */
  function initMosaic(){
    var cv = document.getElementById('mosaic');
    if(!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), cells = [], W = 0, H = 0, running = false, G = 64;
    function build(){
      W = cv.clientWidth; H = cv.clientHeight; if(W < 2 || H < 2) return;
      var dpr = Math.min(2, window.devicePixelRatio||1);
      cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
      cells = [];
      var cols = Math.ceil(W/G), rows = Math.ceil(H/G);
      for(var gy=0; gy<rows; gy++) for(var gx=0; gx<cols; gx++){
        if(Math.random() < 0.07){
          cells.push({ x:gx*G, y:gy*G, red:Math.random()<0.12, ph:Math.random()*Math.PI*2, sp:0.6+Math.random()*1.8 });
        }
      }
    }
    function paint(t){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<cells.length;i++){ var c = cells[i];
        var a = 0.04 + 0.13*(0.5 + 0.5*Math.sin(c.ph + t*0.00045*c.sp));
        ctx.fillStyle = c.red ? 'rgba(244,0,0,'+Math.min(0.5, a*2.4)+')' : 'rgba(255,255,255,'+a+')';
        ctx.fillRect(c.x+1, c.y+1, G-2, G-2);
      }
    }
    function loop(t){ if(!running) return; paint(t||0); requestAnimationFrame(loop); }
    function start(){ if(running) return; running = true; requestAnimationFrame(loop); }
    function stop(){ running = false; }
    build();
    if(reduce){ paint(0); }
    else if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ es[0].isIntersecting ? start() : stop(); },{ threshold:0 }).observe(cv);
    } else { start(); }
    var rt; window.addEventListener('resize', function(){
      clearTimeout(rt); rt = setTimeout(function(){ build(); if(reduce) paint(0); }, 180);
    });
  }

  /* ---------------- boot ---------------- */
  initMotion();
  setupAnimIcons();
  initMosaic();
  // Re-arm ScrollTrigger after late layout (web fonts especially — Unbounded reflows headings).
  function refreshST(){ if(window.ScrollTrigger){ ScrollTrigger.refresh(); } }
  window.addEventListener('load', refreshST);
  [200, 700, 1500, 2800].forEach(function(t){ setTimeout(refreshST, t); });
  if(!reduce && window.ResizeObserver && window.ScrollTrigger){
    var _ph = document.documentElement.scrollHeight, _prt;
    new ResizeObserver(function(){
      var h = document.documentElement.scrollHeight;
      if(Math.abs(h - _ph) < 2) return; _ph = h;
      clearTimeout(_prt); _prt = setTimeout(refreshST, 120);
    }).observe(document.body);
  }
})();
