/* ============================================================
   Core Business Consulting — CORE DESIGN v2  (js/main.js)
   i18n (RU default / EN) + GSAP/ScrollTrigger motion + Three.js hero boxes.
   Graceful degradation: no GSAP -> static; reduced-motion -> static; no WebGL -> CSS box fallback.
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
    hsJur:"jurisdictions", hsDir:"disciplines", hsYears:"years of expertise",
    sec1:"Manufacturing", sec2:"Trade", sec3:"IT", sec4:"Financial services",
    sec1b:"Manufacturing", sec2b:"Trade", sec3b:"IT", sec4b:"Financial services",
    aboutLead:"The partner businesses trust to structure, protect and grow.",
    aboutP:"Core Business Consulting combines local expertise with international experience. We build tailored solutions across management, finance, law, tax and risk: from manufacturing and trade to IT and financial services.",
    pr1:"Professionalism", pr2:"Stability", pr3:"Transparency", pr4:"Foresight",
    servLabel:"What we do", servH1:"Six disciplines. ", servH2:"One team.", scrollHint:"Scroll",
    s1t:"Accounting & finance", s1d:"The full cycle of accounting and finance: records, RAS and IFRS reporting, treasury and budget control.", s1p:"RAS & IFRS, audit, tax",
    s2t:"Law & tax", s2d:"Legal support from incorporation and structuring to transactions and disputes, with an optimal cash-flow model.", s2p:"UAE, Russia, Kazakhstan, deals",
    s3t:"Human capital", s3d:"The full HR spectrum: personnel administration, recruitment, HR policy and incentive systems. Transparent processes.", s3p:"Admin, recruitment, incentives",
    s4t:"Investment & valuation", s4d:"Independent valuation of companies, projects and assets; analysis of business models and deal-structure recommendations.", s4p:"Assets, business models, deals",
    s5t:"Compliance & risk", s5d:"A business-protection system: forensic investigations, internal control, asset-leakage prevention and risk monitoring.", s5p:"Forensic, control, monitoring",
    s6t:"Project management", s6d:"Strategic and operational management of projects: from corporate strategy to organisational and technology rollouts.", s6p:"Strategy, process, rollout",
    svcEndH:"Six disciplines, one team, one point of contact.", svcEndCta:"Discuss your task",
    appH:"A predictable outcome at every stage", appSub:"Proven project-management methodologies: from diagnostics to ongoing support.",
    ap1t:"Diagnostics", ap1d:"Audit of the current structure, financial model and risks. We agree on goals and constraints.",
    ap2t:"Architecture", ap2d:"We design the corporate and tax structure around the business and its jurisdictions.",
    ap3t:"Implementation", ap3d:"Incorporation, licences, accounting setup, processes and controls.",
    ap4t:"Ongoing support", ap4d:"Day-to-day accounting, reporting, compliance and analytics for management decisions.",
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
    ftAddr:"Address on request", ftRights:"© 2026 Core Business Consulting. All rights reserved."
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

  function runCount(el){
    if(el._done) return; el._done = true;
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec')||'0',10);
    var suf = el.getAttribute('data-suffix')||'';
    if(reduce || !window.gsap){ el.textContent = target.toFixed(dec)+suf; return; }
    var o={v:0};
    gsap.to(o,{v:target,duration:1.5,ease:'power2.out',onUpdate:function(){ el.textContent=o.v.toFixed(dec)+suf; }});
  }

  /* contact form: validation + real submission.
     Set FORM_ENDPOINT to your Formspree/Getform/own POST URL to go live.
     Empty string = demo mode (validates + shows success without a network call). */
  var FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxx'
  var FORM_T = {
    ru:{ sending:'Отправка…', error:'Не удалось отправить запрос. Попробуйте ещё раз или напишите на info@cbc.com.' },
    en:{ sending:'Sending…',  error:'Could not send your request. Please try again or email info@cbc.com.' }
  };
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

      if(!FORM_ENDPOINT){ sent.classList.add('show'); form.reset(); return; } // demo mode

      var btn = form.querySelector('button[type="submit"]'); var label = btn.textContent;
      btn.disabled = true; btn.textContent = FORM_T[lang].sending;
      fetch(FORM_ENDPOINT, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
        body: JSON.stringify({ name:name, company:form.company.value.trim(), email:email, message:msg })
      })
      .then(function(r){ if(!r.ok) throw new Error('http '+r.status); })
      .then(function(){ sent.classList.add('show'); form.reset(); })
      .catch(function(){ errBox.textContent = FORM_T[lang].error; errBox.classList.add('show'); })
      .finally(function(){ btn.disabled=false; btn.textContent=label; });
    });
  }

  function showAllStatic(){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); el.style.opacity=1; el.style.transform='none'; });
    document.querySelectorAll('.line-in').forEach(function(el){ el.style.transform='none'; });
    document.querySelectorAll('.bxr-cover').forEach(function(c){ c.style.transform='scaleX(0)'; });
    document.querySelectorAll('[data-count]').forEach(runCount);
    var fill=document.getElementById('tlfill'); if(fill) fill.style.transform='scaleY(1)';
    document.querySelectorAll('.tstep').forEach(function(s){ s.classList.add('active'); });
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

    /* generic reveals (adds .in so CSS box accents fire too) */
    gsap.utils.toArray('.reveal').forEach(function(el){
      gsap.fromTo(el,{ opacity:0, y:30 },{ opacity:1, y:0, duration:.85, ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 86%', onEnter:function(){ el.classList.add('in'); } } });
    });

    /* box-wipe heading reveals: red box sweeps across the heading */
    gsap.utils.toArray('.bxr').forEach(function(wrap){
      var cover = wrap.querySelector('.bxr-cover');
      if(!cover) return;
      gsap.set(cover,{ scaleX:0, transformOrigin:'left center' });
      gsap.timeline({ scrollTrigger:{ trigger:wrap, start:'top 84%' } })
        .to(cover,{ scaleX:1, duration:.4, ease:'power2.in' })
        .to(cover,{ scaleX:0, transformOrigin:'right center', duration:.5, ease:'power2.out' });
    });

    /* counters */
    gsap.utils.toArray('[data-count]').forEach(function(el){
      ScrollTrigger.create({ trigger:el, start:'top 88%', once:true, onEnter:function(){ runCount(el); } });
    });

    /* box timeline: red fill box scales down the track + step boxes activate */
    var fill = document.getElementById('tlfill');
    if(fill){
      gsap.fromTo(fill,{ scaleY:0 },{ scaleY:1, ease:'none',
        scrollTrigger:{ trigger:'#timeline', start:'top 72%', end:'bottom 78%', scrub:0.6 } });
    }
    gsap.utils.toArray('#approach .tstep').forEach(function(s){
      ScrollTrigger.create({ trigger:s, start:'top 70%',
        onEnter:function(){ s.classList.add('active'); }, onLeaveBack:function(){ s.classList.remove('active'); } });
    });

    /* marquee (single, seamless) */
    (function(){
      var track = document.getElementById('marquee');
      if(!track) return;
      var half = track.scrollWidth/2;
      if(!half) return;
      gsap.to(track,{ x:-half, duration:18, ease:'none', repeat:-1,
        modifiers:{ x:function(x){ return (parseFloat(x)%half)+'px'; } } });
    })();

    /* desktop-only: hero parallax + horizontal services hijack + magnetic CTA */
    gsap.matchMedia().add('(min-width: 901px)', function(){
      gsap.utils.toArray('#hero [data-par]').forEach(function(layer){
        var d = parseFloat(layer.getAttribute('data-par'))||0.3;
        gsap.to(layer,{ yPercent:-22*d*4, ease:'none',
          scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true } });
      });

      var track = document.getElementById('htrack');
      var section = document.getElementById('services');
      var getDist = function(){ return track.scrollWidth - window.innerWidth + (window.innerWidth*0.06); };
      gsap.to(track,{ x:function(){ return -getDist(); }, ease:'none',
        scrollTrigger:{ trigger:section, start:'top top', end:function(){ return '+='+getDist(); },
          pin:true, scrub:1, anticipatePin:1, invalidateOnRefresh:true } });

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

  /* ---------------- Three.js hero box composition ---------------- */
  function showFallback(){
    var f = document.querySelector('.hero-visual .fallback'); if(f) f.style.display='grid';
    var c = document.getElementById('boxes'); if(c) c.style.display='none';
  }
  function initBoxes(){
    var canvas = document.getElementById('boxes');
    if(!canvas) return;
    if(!window.THREE){ showFallback(); return; }
    var wrap = canvas.parentElement;
    if(!wrap || wrap.clientWidth < 2 || wrap.clientHeight < 2){
      // hidden (mobile) — init later if it becomes visible
      var once = function(){ if(wrap && wrap.clientWidth>2 && wrap.clientHeight>2){ window.removeEventListener('resize', once); initBoxes(); } };
      window.addEventListener('resize', once);
      return;
    }
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas:canvas, alpha:true, antialias:true }); }
    catch(e){ showFallback(); return; }

    var W = wrap.clientWidth, H = wrap.clientHeight;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio||1));
    renderer.setSize(W, H, false);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, W/H, 0.1, 100);
    camera.position.set(0,0,9);

    var group = new THREE.Group(); scene.add(group);
    var RED = 0xf40000, BLACK = 0x000000, GRAY = 0xbdbdbd;
    var defs = [
      { type:'wire',  c:BLACK, s:[2.6,2.6,2.6], p:[-0.2, 0.1, 0.0], r:[0.5,0.6,0.0] },
      { type:'solid', c:RED,   s:[1.0,1.0,1.0], p:[ 1.8, 1.15,0.6], r:[0.3,0.4,0.1] },
      { type:'solid', c:BLACK, s:[0.72,0.72,0.72], p:[-1.8,-1.35,0.4], r:[0.2,0.5,0.0] },
      { type:'wire',  c:GRAY,  s:[1.5,1.5,1.5], p:[ 1.45,-1.25,-0.6], r:[0.1,0.3,0.2] },
      { type:'wire',  c:BLACK, s:[0.95,0.95,0.95], p:[-2.0, 1.5,-0.4], r:[0.4,0.2,0.1] },
      { type:'solid', c:RED,   s:[0.5,0.5,0.5], p:[ 0.45,-2.0, 0.9], r:[0.0,0.0,0.0] }
    ];
    defs.forEach(function(d){
      var geo = new THREE.BoxGeometry(d.s[0], d.s[1], d.s[2]);
      var obj;
      if(d.type==='wire'){
        obj = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color:d.c }));
        geo.dispose();
      } else {
        obj = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color:d.c }));
      }
      obj.position.set(d.p[0], d.p[1], d.p[2]);
      obj.rotation.set(d.r[0], d.r[1], d.r[2]);
      obj.userData.spin = [ (Math.random()-0.5)*0.003, (Math.random()-0.5)*0.003, 0 ];
      // home = assembled formation; away = dispersed/exploded start
      obj.userData.home = { x:d.p[0], y:d.p[1], z:d.p[2] };
      obj.userData.away = { x:d.p[0]*2.6 + (Math.random()-0.5)*3.5, y:d.p[1]*2.6 + (Math.random()-0.5)*3.5, z:d.p[2]*2.0 - 2.5 - Math.random()*3 };
      group.add(obj);
    });

    var spin=0, mx=0, my=0, tx=0, ty=0, raf=null;
    // assemble-on-scroll state: a = entrance assemble (0->1 on load); d = disperse (0->1 as the hero scrolls away)
    var state = { a: (reduce || !window.gsap) ? 1 : 0, d: 0 };
    window.addEventListener('pointermove', function(e){
      tx = (e.clientX/window.innerWidth - 0.5);
      ty = (e.clientY/window.innerHeight - 0.5);
    });
    function applyPositions(){
      var net = state.a * (1 - state.d);
      for(var k=0;k<group.children.length;k++){
        var o=group.children[k], h=o.userData.home, a=o.userData.away;
        o.position.x = a.x + (h.x-a.x)*net;
        o.position.y = a.y + (h.y-a.y)*net;
        o.position.z = a.z + (h.z-a.z)*net;
      }
    }
    function frame(){
      spin += 0.0010; // slow, deliberate group rotation (no per-cube spin -> calmer, architectural)
      mx += (tx-mx)*0.04; my += (ty-my)*0.04;
      group.rotation.y = spin + mx*0.5;
      group.rotation.x = -0.12 + my*0.28; // fixed 3/4 tilt + gentle pointer parallax
      applyPositions();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    function resize(){
      var w = wrap.clientWidth, h = wrap.clientHeight; if(w<2||h<2) return;
      camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
      if(reduce){ applyPositions(); renderer.render(scene, camera); }
    }
    window.addEventListener('resize', resize);
    if(reduce){ applyPositions(); renderer.render(scene, camera); }
    else {
      frame();
      if(window.gsap){
        gsap.to(state,{ a:1, duration:1.4, ease:'power3.out', delay:0.15 });   // assemble on load
        if(window.ScrollTrigger){
          gsap.to(state,{ d:1, ease:'none',                                     // disperse as hero leaves; re-assemble scrolling up
            scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true } });
        }
      }
    }
  }

  /* ---------------- boot ---------------- */
  initMotion();
  initBoxes();
  // ScrollTrigger pin needs its measurements re-armed after late layout (web fonts, 3D canvas sizing).
  // A single load/fonts.ready refresh proved unreliable on this heavier page, so re-arm on a short cascade.
  function refreshST(){ if(window.ScrollTrigger){ ScrollTrigger.refresh(); } }
  window.addEventListener('load', refreshST);
  [200, 700, 1500, 2800].forEach(function(t){ setTimeout(refreshST, t); });
})();
