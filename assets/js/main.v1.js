
(function(){
  'use strict';
  var WA='https://wa.me/375445116088';
  var burger=document.getElementById('burger'), drawer=document.getElementById('drawer'),
      closeBtn=document.getElementById('drawerClose'), lastFocus=null;
  function openDrawer(){ if(!drawer) return; lastFocus=document.activeElement;
    drawer.hidden=false; document.body.classList.add('is-locked');
    burger.setAttribute('aria-expanded','true'); if(closeBtn) closeBtn.focus(); }
  function closeDrawer(){ if(!drawer||drawer.hidden) return;
    drawer.hidden=true; document.body.classList.remove('is-locked');
    if(burger) burger.setAttribute('aria-expanded','false'); if(lastFocus) lastFocus.focus(); }
  if(burger) burger.addEventListener('click',openDrawer);
  if(closeBtn) closeBtn.addEventListener('click',closeDrawer);
  if(drawer) drawer.addEventListener('click',function(e){ if(e.target===drawer) closeDrawer(); });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape') closeDrawer();
    if(e.key==='Tab' && drawer && !drawer.hidden){
      var f=drawer.querySelectorAll('a,button'); if(!f.length) return;
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize',function(){ if(window.innerWidth>1060) closeDrawer(); });

  /* карта режима сварки */
  var root=document.getElementById('wps');
  if(root && window.__MODES__){
    var D=window.__MODES__, METALS=window.__METALS__, THICKS=window.__THICKS__;
    var btns=[].slice.call(document.querySelectorAll('#metalBtns button')),
        thick=document.getElementById('thickSel'), place=document.getElementById('placeSel'),
        cur='steel';
    var code=document.getElementById('sheetCode'), method=document.getElementById('sheetMethod'),
        pick=document.getElementById('sheetPick'), oCur=document.getElementById('outCur'),
        oPol=document.getElementById('outPol'), oFill=document.getElementById('outFill'),
        oGas=document.getElementById('outGas'), oTips=document.getElementById('outTips'),
        oAvo=document.getElementById('outAvo'), cta=document.getElementById('wpsCta');
    function label(list,k,idx){ for(var i=0;i<list.length;i++) if(list[i][0]===k) return list[i][idx]; return k; }
    function render(){
      var key=cur+'|'+thick.value, d=D[key]; if(!d) return;
      var mi=0; METALS.forEach(function(m,i){ if(m[0]===cur) mi=i; });
      var ti=0; THICKS.forEach(function(t,i){ if(t[0]===thick.value) ti=i; });
      code.textContent='WPS · '+('0'+(mi*4+ti+1)).slice(-2);
      method.textContent=d.m;
      pick.textContent=label(METALS,cur,1)+' · '+label(THICKS,thick.value,1)+' · '+label(METALS,cur,2);
      oCur.textContent=d.c; oPol.textContent=d.p; oFill.textContent=d.f; oGas.textContent=d.g;
      oTips.innerHTML=d.t.map(function(x){ return '<li>'+x+'</li>'; }).join('');
      var extra='';
      if(place.value==='out' && /TIG|MIG|MAG|аргон/i.test(d.m+d.g)){
        extra='На улице газовую защиту сдувает: варим со щитом и с подветренной стороны, либо переходим на MMA.';
      }
      if(place.value==='pipe'){
        extra=(extra?extra+' ':'')+'Труба под давлением: провар корня проверяем изнутри и опрессовкой, поддув аргона обязателен для нержавейки.';
      }
      if(extra){ oAvo.hidden=false; oAvo.textContent=extra; } else { oAvo.hidden=true; oAvo.textContent=''; }
      var msg='Здравствуйте! Нужна сварка: '+label(METALS,cur,1).toLowerCase()+', '+label(THICKS,thick.value,1)+
              '. По вашей карте режима выходит '+d.m+', '+d.c+'. Подскажите по цене и срокам.';
      cta.href=WA+'?text='+encodeURIComponent(msg);
    }
    btns.forEach(function(b){
      b.addEventListener('click',function(){
        cur=b.getAttribute('data-m');
        btns.forEach(function(x){ x.setAttribute('aria-pressed', x===b?'true':'false'); });
        render();
      });
    });
    thick.addEventListener('change',render); place.addEventListener('change',render);
    render();
  }

  /* форма */
  var form=document.getElementById('leadForm'), msg=document.getElementById('formMsg');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var d=new FormData(form), name=(d.get('name')||'').toString().trim(),
          phone=(d.get('phone')||'').toString().trim();
      if(name.length<2||phone.length<6){
        msg.textContent='Нужны имя и телефон, иначе не перезвонить.'; return;
      }
      var lines=['Заявка с сайта ATLAS AIRTOP ZENIT','Имя: '+name,'Телефон: '+phone];
      ['task','obj','msg'].forEach(function(k){
        var v=(d.get(k)||'').toString().trim();
        if(v) lines.push((k==='task'?'Задача':k==='obj'?'Адрес':'Детали')+': '+v);
      });
      msg.textContent='Открываю WhatsApp с готовым сообщением.';
      window.open(WA+'?text='+encodeURIComponent(lines.join('\n')),'_blank');
    });
  }
})();
