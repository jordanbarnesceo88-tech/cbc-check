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
    heroEyebrow:"Integrated business support",
    h1l1:"We optimize,", h1acc:"protect", h1l2b:" and grow", h1l3:"your business",
    heroSub:"Core Business Consulting supports companies across the CIS and the Middle East, combining financial, tax, legal and crisis-management expertise.",
    heroCta1:"Discuss your task", heroCta2:"Explore services",
    sec1:"Manufacturing", sec2:"Trade", sec3:"IT", sec4:"Financial services",
    sec1b:"Manufacturing", sec2b:"Trade", sec3b:"IT", sec4b:"Financial services",
    aboutLead:"Our principles",
    aboutP:"Our local and international experience allows us to build tailored solutions for companies across different business segments, including trade, logistics and IT.",
    pr1:"Professionalism", pr2:"Stability", pr3:"Transparency", pr4:"Foresight",
    pr1d:"Deep expertise in every engagement.", pr2d:"Predictable processes and outcomes.",
    pr3d:"Clear decisions and honest reporting.", pr4d:"Decisions built for the years ahead.",
    servLabel:"What we do", servH1:"Six disciplines. ", servH2:"One team.",
    s1t:"Accounting & finance", s1d:"The full cycle of accounting and financial services: bookkeeping, RAS and IFRS reporting, tax support, treasury and budget control.", s1p:"RAS & IFRS, audit, tax",
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

  /* Smooth anchor scrolling in JS. CSS scroll-behavior:smooth is intentionally NOT used:
     it makes ScrollTrigger.refresh() measure mid-animation on a scrolled page, skewing every
     trigger start by the current scroll offset (services pinned over the principles). */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(ev){
      var id = a.getAttribute('href').slice(1);
      var target = id && document.getElementById(id);
      if(!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if(history.pushState) history.pushState(null, '', '#'+id);
    });
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
  var SENDING = { ru:'Отправка…', en:'Sending…' }; // the #formErr text is localized via the formError i18n key
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

    /* principles: staggered reveal of the value cards */
    var principleCells = gsap.utils.toArray('.principles .principle');
    if(principleCells.length){
      gsap.set(principleCells,{ opacity:0, y:22 });
      ScrollTrigger.create({ trigger:'.principles', start:'top 85%', once:true,
        onEnter:function(){ gsap.to(principleCells,{ opacity:1, y:0, duration:.6, ease:'power3.out', stagger:.09,
          clearProps:'transform' }); } }); // clear inline transform so the CSS hover lift works afterwards
    }

    /* box timeline: red fill box scales down the track + step boxes activate */
    var fill = document.getElementById('tlfill');
    if(fill){
      gsap.fromTo(fill,{ scaleY:0 },{ scaleY:1, ease:'none',
        scrollTrigger:{ trigger:'#timeline', start:'top 72%', end:'bottom 82%', scrub:0.6 } });
    }
    // each step reveals: dot pops in, number/title/body slide in, step activates as the red fill reaches it
    gsap.utils.toArray('#approach .tstep').forEach(function(s){
      var dot=s.querySelector('.tdot'), body=[s.querySelector('h3'), s.querySelector('p')];
      gsap.set(dot,{ scale:.5, opacity:0 });
      gsap.set(body,{ opacity:0, x:-26 });
      gsap.timeline({ scrollTrigger:{ trigger:s, start:'top 80%',
          onEnter:function(){ s.classList.add('active'); }, onLeaveBack:function(){ s.classList.remove('active'); } } })
        .to(dot,{ scale:1, opacity:1, duration:.5, ease:'back.out(1.7)' })
        .to(body,{ opacity:1, x:0, duration:.6, ease:'power3.out', stagger:.08 }, '-=0.3');
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
      // approach: each step drifts at a slightly different rate (parallax depth against the sticky heading)
      gsap.utils.toArray('#approach .tstep').forEach(function(s,i){
        gsap.to(s,{ yPercent:(i%2 ? 8 : -8), ease:'none',
          scrollTrigger:{ trigger:'#approach', start:'top bottom', end:'bottom top', scrub:true } });
      });

      var track = document.getElementById('htrack');
      var section = document.getElementById('services');
      var getDist = function(){ return track.scrollWidth - window.innerWidth + (window.innerWidth*0.06); };
      gsap.to(track,{ x:function(){ return -getDist(); }, ease:'none',
        scrollTrigger:{ trigger:section, start:'top top', end:function(){ return '+='+getDist(); },
          pin:true, scrub:1, invalidateOnRefresh:true,
          refreshPriority:1 } }); // refresh this pin before downstream triggers so their positions account for the pin-spacer

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
    camera.position.set(0,0,11.4); // fits the grown structure, not just the cube
    scene.add(new THREE.AmbientLight(0xffffff, 0.80));
    var key = new THREE.DirectionalLight(0xffffff, 0.5); key.position.set(3,5,4); scene.add(key);

    var group = new THREE.Group(); scene.add(group);

    /* The v2 composition, reworked: a loose group of boxes of different sizes — some solid,
       some wireframe — turning slowly on its axis all the time. HOVER pulls every part into
       one solid RED cube: they align, even out to the same size and take the accent colour.
       Leaving lets the composition fall back open. Scroll only parallaxes it, so the wow
       moment always happens where you can see it. */
    var RED = new THREE.Color(0xf40000), BLACK = new THREE.Color(0x000000);
    var boxGeo = new THREE.BoxGeometry(1,1,1);
    var edgeGeo = new THREE.EdgesGeometry(boxGeo);

    var S = 1.42, OFF = S/2 + 0.04;   // the cube the parts resolve into
    /* rest pose: size, solid/wireframe, colour, position — tuned as a composition */
    var defs = [
      { s:1.80, solid:false, c:0x000000, p:[-1.55, 0.45,-0.30] },
      { s:0.62, solid:true,  c:0xf40000, p:[ 1.80, 1.25, 0.55] },
      { s:0.82, solid:true,  c:0x111111, p:[-1.85,-1.40, 0.35] },
      { s:1.25, solid:false, c:0xbdbdbd, p:[ 1.50,-1.30,-0.50] },
      { s:0.90, solid:false, c:0x000000, p:[-2.05, 1.60,-0.35] },
      { s:0.52, solid:true,  c:0xf40000, p:[ 0.45,-2.05, 0.80] },
      { s:1.05, solid:true,  c:0xffffff, p:[ 0.65, 1.95,-0.85] },
      { s:0.72, solid:false, c:0x000000, p:[ 2.15, 0.05, 0.40] }
    ];
    var pieces = [], li = 0;
    for(var xi=0; xi<2; xi++) for(var yi=0; yi<2; yi++) for(var zi=0; zi<2; zi++){
      var d = defs[li];
      var piece = new THREE.Group();
      var mat = new THREE.MeshLambertMaterial({ color:d.c, transparent:true, opacity: d.solid ? 1 : 0,
        polygonOffset:true, polygonOffsetFactor:1, polygonOffsetUnits:1 });
      var lmat = new THREE.LineBasicMaterial({ color: d.solid ? 0x000000 : d.c });
      var mesh = new THREE.Mesh(boxGeo, mat);
      mesh.visible = d.solid;
      piece.add(mesh);
      piece.add(new THREE.LineSegments(edgeGeo, lmat));
      piece.userData = {
        mat:mat, lmat:lmat, mesh:mesh,
        restC:new THREE.Color(d.c), restLC:new THREE.Color(d.solid ? 0x000000 : d.c),
        restOp: d.solid ? 1 : 0, restS:d.s, rest:{ x:d.p[0], y:d.p[1], z:d.p[2] },
        home:{ x:(xi-0.5)*2*OFF, y:(yi-0.5)*2*OFF, z:(zi-0.5)*2*OFF },   // its slot in the red cube
        rot:{ x:Math.random()*Math.PI, y:Math.random()*Math.PI, z:Math.random()*Math.PI*0.5 },
        rs: 0.10 + Math.random()*0.22,                                   // idle tumble speed
        fs: 0.5 + Math.random()*0.7, fp: Math.random()*Math.PI*2         // idle float
      };
      group.add(piece); pieces.push(piece); li++;
    }

    var spin=0, mx=0, my=0, tx=0, ty=0, clock=0, demo=null;
    // h = 0 loose composition, 1 = one solid red cube. drift = gentle scroll parallax.
    var state = { h: (reduce || !window.gsap) ? 1 : 0, drift: 0 };
    window.addEventListener('pointermove', function(e){
      tx = (e.clientX/window.innerWidth - 0.5);
      ty = (e.clientY/window.innerHeight - 0.5);
    });
    function applyState(){
      var h = state.h, inv = 1 - h;
      for(var k=0;k<pieces.length;k++){
        var o=pieces[k], u=o.userData, r=u.rest, hm=u.home;
        var fl = Math.sin(clock*u.fs + u.fp) * 0.13 * inv;               // idle float, stops when locked
        o.position.set(r.x + (hm.x-r.x)*h, r.y + (hm.y-r.y)*h + fl, r.z + (hm.z-r.z)*h);
        o.rotation.set((u.rot.x + clock*u.rs)*inv,                        // parts align as they lock
                       (u.rot.y + clock*u.rs*1.2)*inv,
                       u.rot.z*inv);
        o.scale.setScalar(u.restS + (S - u.restS)*h);                     // and even out to one size
        u.mat.color.copy(u.restC).lerp(RED, h);                           // ...taking the accent colour
        u.lmat.color.copy(u.restLC).lerp(BLACK, h);
        var op = u.restOp + (1 - u.restOp)*h;
        u.mat.opacity = op; u.mesh.visible = op > 0.02;
      }
      group.position.y = -state.drift * 1.1;
    }
    function frame(){
      clock += 0.016;
      spin += 0.0016; // always turning on its axis
      mx += (tx-mx)*0.04; my += (ty-my)*0.04;
      group.rotation.y = spin + mx*0.5;
      group.rotation.x = -0.16 + my*0.26; // fixed 3/4 tilt + gentle pointer parallax
      applyState();
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }
    function resize(){
      var w = wrap.clientWidth, h = wrap.clientHeight; if(w<2||h<2) return;
      camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
      if(reduce){ applyState(); renderer.render(scene, camera); }
    }
    window.addEventListener('resize', resize);
    if(reduce){ applyState(); renderer.render(scene, camera); }
    else {
      frame();
      if(window.gsap){
        /* play the assembly once on load so the interaction is discoverable without hovering */
        demo = gsap.timeline({ delay:2.2 })
          .to(state,{ h:1, duration:1.2, ease:'power3.out' })
          .to(state,{ h:1, duration:1.6 })
          .to(state,{ h:0, duration:1.1, ease:'power2.inOut' });
        function toState(v, dur, ease){
          if(demo){ demo.kill(); demo = null; }
          // 'auto', not true: `true` would also kill the scroll-parallax tween on this same object
          gsap.to(state,{ h:v, duration:dur, ease:ease, overwrite:'auto' });
        }
        wrap.addEventListener('pointerenter', function(){ toState(1, 0.85, 'power3.out'); });
        wrap.addEventListener('pointerleave', function(){ toState(0, 1.0, 'power2.inOut'); });
        if(window.ScrollTrigger){
          gsap.to(state,{ drift:1, ease:'none',   // scroll only parallaxes: no assembly you could miss
            scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true } });
        }
      }
    }
  }

  /* ---------------- animated line icons (Tabler stroke paths, drawn on in view + hover replay) ---------------- */
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
    if(reduce) return; // leave icons fully drawn

    function draw(svg){
      svg._shapes.forEach(function(sh,i){
        sh.style.transition = 'none';
        sh.style.strokeDashoffset = sh._len;
        sh.getBoundingClientRect(); // force reflow so the transition replays
        sh.style.transition = 'stroke-dashoffset .55s cubic-bezier(.16,1,.3,1) ' + (i*0.06) + 's';
        sh.style.strokeDashoffset = '0';
      });
    }
    icons.forEach(function(svg){ svg._shapes.forEach(function(sh){ sh.style.strokeDashoffset = sh._len; }); }); // undraw
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(es){
        es.forEach(function(e){ if(e.isIntersecting){ draw(e.target); io.unobserve(e.target); } });
      }, { threshold:0.35 });
      icons.forEach(function(svg){ io.observe(svg); });
    } else { icons.forEach(draw); }
    document.querySelectorAll('.panel, .principles .principle').forEach(function(card){
      var svg = card.querySelector('.aicon'); if(!svg) return;
      card.addEventListener('pointerenter', function(){ draw(svg); });
    });
  }

  /* ---------------- boot ---------------- */
  initMotion();
  initBoxes();
  setupAnimIcons();
  // ScrollTrigger pin needs its measurements re-armed after late layout (web fonts, 3D canvas sizing).
  // A single load/fonts.ready refresh proved unreliable on this heavier page, so re-arm on a short cascade.
  function refreshST(){ if(window.ScrollTrigger){ ScrollTrigger.refresh(); } }
  window.addEventListener('load', refreshST);
  [200, 700, 1500, 2800].forEach(function(t){ setTimeout(refreshST, t); });
  // Re-arm on any document-height change (late web-font reflow grows the About section; without this the
  // services pin can keep an early start and overlap the previous section). Debounced.
  if(!reduce && window.ResizeObserver && window.ScrollTrigger){
    var _ph = document.documentElement.scrollHeight, _prt;
    new ResizeObserver(function(){
      var h = document.documentElement.scrollHeight;
      if(Math.abs(h - _ph) < 2) return; _ph = h;
      clearTimeout(_prt); _prt = setTimeout(refreshST, 120);
    }).observe(document.body);
  }
})();
