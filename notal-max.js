/* Notal AI MAX enhancement layer */
(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const ui={
    palette:$('commandPaletteBackdrop'), search:$('commandSearch'), list:$('commandList'),
    focus:$('focusModeBtn'), paletteBtn:$('commandPaletteBtn'),
    lightbox:$('imageLightbox'), lightboxImg:$('lightboxImage'), lightboxClose:$('lightboxClose'),
    input:$('userInput'), upload:$('fileUploadInput'), messages:$('messagesContainer')
  };
  const actions=[
    {name:'New chat',desc:'Start a clean conversation',icon:'fa-pen-to-square',keys:'Ctrl K',run:()=>window.createNewChat?.()||document.getElementById('newChatBtn')?.click()},
    {name:'Focus composer',desc:'Jump straight to the message box',icon:'fa-keyboard',keys:'/',run:()=>ui.input?.focus()},
    {name:'Toggle sidebar',desc:'Show or hide chat history',icon:'fa-sidebar',keys:'Ctrl B',run:()=>window.toggleSidebar?.()||document.getElementById('closeSidebarBtn')?.click()},
    {name:'Open settings',desc:'Customize theme, APIs and behavior',icon:'fa-gear',keys:'Ctrl E',run:()=>document.getElementById('sidebarSettingsBtn')?.click()},
    {name:'Toggle focus mode',desc:'Distraction-free chat layout',icon:'fa-expand',run:()=>ui.focus?.click()},
    {name:'Attach file',desc:'Open the file picker',icon:'fa-paperclip',run:()=>ui.upload?.click()},
    {name:'Export all chats',desc:'Download your chat archive as Markdown',icon:'fa-file-export',run:()=>document.getElementById('exportAllBtn')?.click()},
    {name:'Clear composer',desc:'Remove the current draft',icon:'fa-eraser',run:()=>{if(ui.input){ui.input.value='';ui.input.dispatchEvent(new Event('input',{bubbles:true}));ui.input.focus();}}}
  ];
  let selected=0;
  function renderCommands(q=''){
    const term=q.trim().toLowerCase();
    const items=actions.filter(a=>!term||a.name.toLowerCase().includes(term)||a.desc.toLowerCase().includes(term));
    selected=Math.min(selected,Math.max(items.length-1,0));
    ui.list.innerHTML=items.length?items.map((a,i)=>`<div class="command-item ${i===selected?'selected':''}" data-index="${i}"><i class="fas ${a.icon}"></i><div class="command-main"><div class="command-name">${escapeText(a.name)}</div><div class="command-desc">${escapeText(a.desc)}</div></div>${a.keys?`<span class="command-shortcut">${escapeText(a.keys)}</span>`:''}</div>`).join(''):`<div style="padding:1rem;text-align:center;color:var(--text2);font-size:.8rem">No commands found</div>`;
    ui.list.querySelectorAll('.command-item').forEach(el=>el.addEventListener('click',()=>runCommand(items[+el.dataset.index])));
  }
  function escapeText(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}
  function openPalette(){ui.palette?.classList.add('show');if(ui.search){ui.search.value='';selected=0;renderCommands();setTimeout(()=>ui.search.focus(),20)}}
  function closePalette(){ui.palette?.classList.remove('show');ui.input?.focus()}
  function runCommand(cmd){if(!cmd)return;closePalette();setTimeout(()=>cmd.run?.(),0)}
  ui.paletteBtn?.addEventListener('click',openPalette);
  ui.palette?.addEventListener('click',e=>{if(e.target===ui.palette)closePalette()});
  ui.search?.addEventListener('input',e=>{selected=0;renderCommands(e.target.value)});
  document.addEventListener('keydown',e=>{
    if(ui.palette?.classList.contains('show')){
      if(e.key==='Escape'){e.preventDefault();closePalette();return}
      if(e.key==='ArrowDown'||e.key==='ArrowUp'||e.key==='Enter'){
        e.preventDefault();
        const visible=[...ui.list.querySelectorAll('.command-item')];
        if(e.key==='ArrowDown')selected=Math.min(selected+1,visible.length-1);
        if(e.key==='ArrowUp')selected=Math.max(selected-1,0);
        visible.forEach((n,i)=>n.classList.toggle('selected',i===selected));
        if(e.key==='Enter'&&visible[selected])visible[selected].click();
      }
      return;
    }
    const mod=e.ctrlKey||e.metaKey;
    if(mod&&e.key.toLowerCase()==='p'){e.preventDefault();openPalette()}
    if(e.key==='Escape'&&ui.lightbox?.classList.contains('show'))closeLightbox();
  });

  function setFocusMode(on){document.body.classList.toggle('focus-mode',on);localStorage.setItem('notal_focus_mode',String(on));ui.focus?.setAttribute('title',on?'Exit focus mode':'Focus mode');if(ui.focus?.querySelector('i'))ui.focus.querySelector('i').className=on?'fas fa-compress':'fas fa-expand'}
  ui.focus?.addEventListener('click',()=>setFocusMode(!document.body.classList.contains('focus-mode')));
  if(localStorage.getItem('notal_focus_mode')==='true')setFocusMode(true);

  // Composer shortcuts
  document.getElementById('quickAttachBtn')?.addEventListener('click',()=>ui.upload?.click());
  document.getElementById('quickImageBtn')?.addEventListener('click',()=>{
    if(ui.input){ui.input.value=(ui.input.value?ui.input.value+'\n':'')+'Analyze an image I upload. Describe what you see and highlight important details.';ui.input.dispatchEvent(new Event('input',{bubbles:true}));ui.input.focus();}
    ui.upload?.click();
  });
  document.getElementById('quickWebBtn')?.addEventListener('click',()=>{
    if(ui.input){ui.input.value=(ui.input.value?ui.input.value+'\n':'')+'Browse this URL and summarize it: ';ui.input.dispatchEvent(new Event('input',{bubbles:true}));ui.input.focus();}
  });
  document.getElementById('quickCodeBtn')?.addEventListener('click',()=>{
    if(ui.input){ui.input.value=(ui.input.value?ui.input.value+'\n':'')+'Act as a senior developer. Provide production-ready code with explanations and tests.';ui.input.dispatchEvent(new Event('input',{bubbles:true}));ui.input.focus();}
  });
  document.getElementById('quickClearBtn')?.addEventListener('click',()=>{if(ui.input){ui.input.value='';ui.input.dispatchEvent(new Event('input',{bubbles:true}));ui.input.focus()}});

  // Draft persistence
  const draftKey='notal_draft_v2';
  if(ui.input){
    const saved=localStorage.getItem(draftKey);if(saved)ui.input.value=saved;
    ui.input.addEventListener('input',()=>localStorage.setItem(draftKey,ui.input.value));
  }
  document.getElementById('sendBtn')?.addEventListener('click',()=>localStorage.removeItem(draftKey));

  // Drag/drop files into composer
  let dragDepth=0;
  ['dragenter','dragover'].forEach(type=>document.addEventListener(type,e=>{if(e.dataTransfer?.types?.length){e.preventDefault();dragDepth++;document.body.classList.add('drag-active')}}));
  ['dragleave','drop'].forEach(type=>document.addEventListener(type,e=>{if(e.dataTransfer?.types?.length){e.preventDefault();dragDepth=Math.max(0,dragDepth-1);if(!dragDepth)document.body.classList.remove('drag-active')}}));
  document.addEventListener('drop',e=>{const files=[...(e.dataTransfer?.files||[])];if(!files.length||!ui.upload)return;const dt=new DataTransfer();files.forEach(f=>dt.items.add(f));ui.upload.files=dt.files;ui.upload.dispatchEvent(new Event('change',{bubbles:true}));});

  // Paste images directly from clipboard
  document.addEventListener('paste',e=>{const imgs=[...(e.clipboardData?.items||[])].filter(i=>i.type.startsWith('image/'));if(!imgs.length||!ui.upload)return;const files=imgs.map(i=>i.getAsFile()).filter(Boolean);if(!files.length)return;const dt=new DataTransfer();files.forEach(f=>dt.items.add(f));ui.upload.files=dt.files;ui.upload.dispatchEvent(new Event('change',{bubbles:true}));});

  // Click-to-zoom generated/uploaded images
  function bindImages(){document.querySelectorAll('.ai-bubble img,.generated-image').forEach(img=>{if(img.dataset.lbBound)return;img.dataset.lbBound='1';img.addEventListener('click',()=>{ui.lightboxImg.src=img.src;ui.lightbox?.classList.add('show');ui.lightbox?.setAttribute('aria-hidden','false')})})}
  const observer=new MutationObserver(bindImages);if(ui.messages)observer.observe(ui.messages,{childList:true,subtree:true});bindImages();
  function closeLightbox(){ui.lightbox?.classList.remove('show');ui.lightbox?.setAttribute('aria-hidden','true');if(ui.lightboxImg)ui.lightboxImg.src=''}
  ui.lightboxClose?.addEventListener('click',closeLightbox);ui.lightbox?.addEventListener('click',e=>{if(e.target===ui.lightbox)closeLightbox()});

  // Keep composer usable on viewport changes.
  const resizeComposer=()=>{if(!ui.input)return;ui.input.style.maxHeight=Math.min(window.innerHeight*.32,320)+'px'};
  window.addEventListener('resize',resizeComposer,{passive:true});resizeComposer();
})();
