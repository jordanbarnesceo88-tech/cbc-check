/* ============================================================
   CORE DESIGN v2 — js/legal.js
   Minimal RU/EN toggle for content pages. Each page defines window.PAGE_EN
   with its translations before loading this file.
   ============================================================ */
(function(){
  "use strict";
  var EN = window.PAGE_EN || {};
  var RU = {};
  function applyLang(l){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k = el.getAttribute('data-i18n');
      if(l==='en'){ if(!(k in RU)) RU[k] = el.textContent; if(EN[k]!=null) el.textContent = EN[k]; }
      else if(k in RU){ el.textContent = RU[k]; }
    });
    document.querySelectorAll('.lang button').forEach(function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-lang')===l ? 'true':'false');
    });
    document.documentElement.lang = l;
  }
  document.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener('click', function(){ applyLang(b.getAttribute('data-lang')); });
  });
  applyLang('ru');
})();
