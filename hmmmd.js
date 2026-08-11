(function() {
  "use strict";

  // ============================================================
  //  CONFIGURATION
  // ============================================================
  const GOOGLE_CLIENT_ID = '524364273952-7gqtr9pdujlahhbt3b35p6p9be369gh0.apps.googleusercontent.com';

  // ============================================================
  //  PROVIDERS
  // ============================================================
  const providers = [
    { id: 'openrouter', name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1/chat/completions', keyHint: 'sk-or-v1-...', needsProxy: false, vision: true, imageGen: true },
    { id: 'deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1/chat/completions', keyHint: 'sk-...', needsProxy: false, vision: false, imageGen: false },
    { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1/chat/completions', keyHint: 'sk-proj-...', needsProxy: true, vision: true, imageGen: true },
    { id: 'google', name: 'Google AI', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/', keyHint: 'AIza...', needsProxy: true, vision: true, imageGen: false },
    { id: 'tokenrouter', name: 'TokenRouter', baseUrl: 'https://api.tokenrouter.com/v1/chat/completions', keyHint: 'sk-...', needsProxy: false, vision: true, imageGen: false },
  ];

  // ============================================================
  //  MODELS
  // ============================================================
  const allModels = [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', icon: 'fa-brain', badge: 'Vision', thinking: false, cost: 'high', vision: true },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', icon: 'fa-bolt', badge: 'Fast', thinking: false, cost: 'low', vision: true },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'openrouter', icon: 'fa-feather', badge: 'Vision', thinking: true, cost: 'high', vision: true },
    { id: 'moonshotai/kimi-k3-free', name: 'Kimi K3 Free', provider: 'tokenrouter', icon: 'fa-star', badge: 'Latest', thinking: true, cost: 'medium', vision: true },
    { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', provider: 'google', icon: 'fa-bolt', badge: 'Latest', thinking: false, cost: 'low', vision: true },
    { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', provider: 'google', icon: 'fa-bolt', badge: 'Stable', thinking: false, cost: 'low', vision: true },
    { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash-Lite', provider: 'google', icon: 'fa-bolt', badge: 'Fast', thinking: false, cost: 'low', vision: false },
    { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', provider: 'google', icon: 'fa-gem', badge: 'Powerful', thinking: true, cost: 'medium', vision: true },
    { id: 'gemini-3.1-flash', name: 'Gemini 3.1 Flash', provider: 'google', icon: 'fa-bolt', badge: 'Fast', thinking: false, cost: 'low', vision: true },
    { id: 'deepseek-chat', name: 'DeepSeek V3', provider: 'deepseek', icon: 'fa-search', badge: 'Cheap', thinking: false, cost: 'low', vision: false },
    { id: 'deepseek-reasoner', name: 'DeepSeek R1', provider: 'deepseek', icon: 'fa-brain', badge: 'Reason', thinking: true, cost: 'medium', vision: false },
    { id: 'mistralai/mistral-large-2', name: 'Mistral Large 2', provider: 'openrouter', icon: 'fa-feather', badge: 'Smart', thinking: false, cost: 'medium', vision: true },
    { id: 'meta-llama/llama-3.2-90b-vision', name: 'Llama 3.2 90B Vision', provider: 'openrouter', icon: 'fa-eye', badge: 'Vision', thinking: false, cost: 'medium', vision: true },
    { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'openrouter', icon: 'fa-brain', badge: 'Open', thinking: false, cost: 'medium', vision: false },
    { id: 'dall-e-3', name: 'DALL-E 3', provider: 'openai', icon: 'fa-paintbrush', badge: 'Image Gen', thinking: false, cost: 'high', imageGen: true },
    { id: 'stabilityai/stable-diffusion-3.5', name: 'SD 3.5', provider: 'openrouter', icon: 'fa-paintbrush', badge: 'Image Gen', thinking: false, cost: 'medium', imageGen: true },
  ];

  // ============================================================
  //  STATE
  // ============================================================
  let keys = {}, currentModel = allModels[0], chats = [], currentChatId = null, currentMessages = [];
  let isProcessing = false, proxyEnabled = false, proxyUrl = '', previewEnabled = true, systemPromptEnabled = true;
  let currentTheme = 'default', uploadedFiles = [], googleUser = null;
  let sidebarOpen = true, abortController = null, isLanding = true, previewContent = '';
  let thinkingContent = '';
  let streamAborted = false, activeThinkId = null;

  const $ = id => document.getElementById(id);
  const messagesContainer = $('messagesContainer');
  const userInput = $('userInput');
  const sendBtn = $('sendBtn');
  const stopBtn = $('stopBtn');
  const modelTrigger = $('modelTrigger');
  const modelDropdown = $('modelDropdown');
  const selectedModelName = $('selectedModelName');
  const chatHistory = $('chatHistory');
  const sidebar = $('sidebar');
  const sidebarOverlay = $('sidebarOverlay');
  const mobilePreviewOverlay = $('mobilePreviewOverlay');
  const settingsModal = $('settingsModal');
  const connectionDot = $('connectionDot');
  const previewPanel = $('previewPanel');
  const previewFrame = $('previewFrame');
  const previewUrl = $('previewUrl');
  const fileUploadInput = $('fileUploadInput');
  const toggleSidebarBtn = $('toggleSidebarBtn');
  const signoutDropdown = $('signoutDropdown');

  // ============================================================
  //  RENDER MARKDOWN
  // ============================================================
  function renderMarkdown(text) {
    let html = text;
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => `<div class="code-block-wrapper"><pre><code>${escapeHtml(code.trim())}</code></pre></div>`);
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function escapeHtml(t) { return t.replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>'); }

  // ============================================================
  //  LOAD / SAVE STATE
  // ============================================================
  function loadState() {
    try {
      keys = JSON.parse(localStorage.getItem('notal_keys') || '{}');
      currentModel = allModels.find(m => m.id === localStorage.getItem('notal_model')) || allModels[0];
      chats = JSON.parse(localStorage.getItem('notal_chats') || '[]');
      currentChatId = localStorage.getItem('notal_current_chat') || null;
      proxyEnabled = localStorage.getItem('notal_proxy_enabled') === 'true';
      proxyUrl = localStorage.getItem('notal_proxy_url') || '';
      previewEnabled = localStorage.getItem('notal_preview') !== 'false';
      systemPromptEnabled = localStorage.getItem('notal_system_prompt') !== 'false';
      currentTheme = localStorage.getItem('notal_theme') || 'default';
      googleUser = JSON.parse(localStorage.getItem('notal_google_user') || 'null');
      console.log('State loaded - systemPromptEnabled:', systemPromptEnabled, 'previewEnabled:', previewEnabled, 'raw storage value:', localStorage.getItem('notal_system_prompt'));
      applyTheme(currentTheme);
      if ($('proxyToggle')) $('proxyToggle').checked = proxyEnabled;
      if ($('proxyUrlInput')) $('proxyUrlInput').value = proxyUrl;
      if ($('previewToggle')) $('previewToggle').checked = previewEnabled;
      if ($('systemPromptToggle')) $('systemPromptToggle').checked = systemPromptEnabled;
      updateConnectionUI();
      updateUserUI();
      initModelDropdown();
      updateModelTrigger();
      renderProviderCards();
      renderChatHistory();
      if (currentChatId) { loadChat(currentChatId); isLanding = false; }
      else if (chats.length > 0) { loadChat(chats[0].id); isLanding = false; }
      else showLanding();
    } catch (e) {
      console.error('LoadState error:', e);
      showLanding();
    }
  }

  function saveState() {
    try {
      localStorage.setItem('notal_keys', JSON.stringify(keys));
      localStorage.setItem('notal_model', currentModel.id);
      localStorage.setItem('notal_chats', JSON.stringify(chats));
      if (currentChatId) localStorage.setItem('notal_current_chat', currentChatId);
      localStorage.setItem('notal_proxy_enabled', String(proxyEnabled));
      localStorage.setItem('notal_proxy_url', proxyUrl);
      localStorage.setItem('notal_preview', String(previewEnabled));
      localStorage.setItem('notal_system_prompt', String(systemPromptEnabled));
      localStorage.setItem('notal_theme', currentTheme);
      console.log('State saved - systemPromptEnabled:', systemPromptEnabled, 'stored as:', String(systemPromptEnabled));
    } catch (e) {
      console.error('SaveState error:', e);
    }
  }

  function updateConnectionUI() {
    const has = Object.values(keys).some(k => k?.trim());
    if (connectionDot) {
      connectionDot.classList.toggle('connected', has);
      connectionDot.title = has ? 'API connected' : 'No API key';
    }
  }

  function updateUserUI() {
    const s = $('sidebarGoogleSignin'), p = $('sidebarUserProfile');
    if (googleUser) {
      if (s) s.style.display = 'none';
      if (p) { p.style.display = 'flex';
      if ($('sidebarUserAvatar')) $('sidebarUserAvatar').src = googleUser.picture;
      if ($('sidebarUserName')) $('sidebarUserName').textContent = googleUser.name; }
    } else {
      if (s) s.style.display = 'block';
      if (p) p.style.display = 'none';
      if (signoutDropdown) signoutDropdown.classList.remove('show');
    }
  }

  function applyTheme(t) {
    document.body.className = t === 'dark' ? 'theme-dark' : '';
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === t));
  }

  // ============================================================
  //  API CONFIG
  // ============================================================
  const CLOUDFLARE_WORKER_URL = 'https://notal-ai-backend.hotfinixbrave.workers.dev/';
  
  function getApiConfig() {
    console.log('Current model:', currentModel);
    console.log('Keys available:', Object.keys(keys));
    
    const apiKey = keys[currentModel.provider];
    
    if (apiKey) {
      console.log('Using Cloudflare Worker proxy');
      return {
        url: CLOUDFLARE_WORKER_URL,
        headers: {
          'Content-Type': 'application/json'
        },
        useWorker: true,
        provider: currentModel.provider,
        apiKey: apiKey
      };
    }
    
    return null;
  }

  // ============================================================
  //  UI FUNCTIONS
  // ============================================================
  function initModelDropdown() {
    if (!modelDropdown) return;
    const groups = {};
    allModels.forEach(m => {
      const type = m.imageGen ? 'Image Generation' : m.vision ? 'Vision & Text' : 'Text';
      const key = `${m.provider}-${type}`;
      if (!groups[key]) groups[key] = { provider: m.provider, type: type, models: [] };
      groups[key].models.push(m);
    });

    modelDropdown.innerHTML = '<div class="model-dropdown-header">Models</div>';
    Object.entries(groups).forEach(([key, group]) => {
      const label = document.createElement('div');
      label.style.cssText = 'padding:0.3rem 0.8rem;font-size:0.6rem;font-weight:700;color:#999;text-transform:uppercase;background:var(--bg2);';
      label.textContent = `${group.provider.toUpperCase()} — ${group.type}`;
      modelDropdown.appendChild(label);

      group.models.forEach(m => {
        const o = document.createElement('div');
        o.className = `model-option ${m.id === currentModel.id ? 'selected' : ''}`;
        const costIcon = m.cost === 'low' ? '🟢' : m.cost === 'medium' ? '🟡' : '🔴';
        const typeIcon = m.imageGen ? '🎨' : m.vision ? '👁️' : '💬';
        o.innerHTML = `<i class="fas ${m.icon}" style="width:1.3rem;"></i>${m.name}<span style="font-size:0.55rem;background:#e5e7eb;padding:0.1rem 0.4rem;border-radius:0.8rem;margin-left:0.4rem;">${m.badge}</span><span style="margin-left:auto;font-size:0.6rem;">${typeIcon} ${costIcon}</span>${m.id === currentModel.id ? '<i class="fas fa-check" style="margin-left:0.3rem;"></i>' : ''}`;
        o.addEventListener('click', () => {
          currentModel = m;
          updateModelTrigger();
          initModelDropdown();
          if (modelDropdown) modelDropdown.classList.remove('show');
          saveState();
        });
        modelDropdown.appendChild(o);
      });
    });
  }

  function updateModelTrigger() {
    if (!selectedModelName) return;
    const icon = currentModel.imageGen ? '🎨' : currentModel.vision ? '👁️' : '🤖';
    selectedModelName.textContent = `${icon} ${currentModel.name}`;
  }

  function showLanding() {
    if (!messagesContainer) return;
    isLanding = true;
    messagesContainer.innerHTML = `
      <div class="landing-screen">
        <div class="landing-logo">⧩</div>
        <div class="landing-title">What can I help with?</div>
        <div class="landing-subtitle">Ask anything, upload images, generate art, or browse the web</div>
        <div class="suggestions">
          <div class="suggestion-card" data-prompt="Generate an image of a futuristic city">
            <div class="s-icon">🎨</div><div class="s-title">Generate Image</div>
          </div>
          <div class="suggestion-card" data-prompt="Browse https://example.com and summarize">
            <div class="s-icon">🌐</div><div class="s-title">Browse Web</div>
          </div>
          <div class="suggestion-card" data-prompt="What's in this image?">
            <div class="s-icon">👁️</div><div class="s-title">Vision</div>
          </div>
          <div class="suggestion-card" data-prompt="Write a Python function to sort a list">
            <div class="s-icon">💻</div><div class="s-title">Write Code</div>
          </div>
        </div>
      </div>`;
    messagesContainer.querySelectorAll('.suggestion-card').forEach(card => {
      card.addEventListener('click', () => {
        if (userInput) { userInput.value = card.dataset.prompt;
        userInput.focus(); }
      });
    });
    if (messagesContainer) messagesContainer.scrollTop = 0;
  }

  function createNewChat() {
    const c = { id: Date.now().toString(), title: 'New Chat', messages: [] };
    chats.unshift(c);
    currentChatId = c.id;
    currentMessages = [];
    saveState();
    renderChatHistory();
    showLanding();
    if (window.innerWidth <= 768) closeMobileSidebar();
  }

  function loadChat(id) {
    const c = chats.find(x => x.id === id);
    if (!c) return;
    currentChatId = id;
    currentMessages = c.messages || [];
    isLanding = false;
    renderMessages();
    renderChatHistory();
    saveState();
    if (window.innerWidth <= 768) closeMobileSidebar();
  }

  function deleteChat(id) {
    chats = chats.filter(c => c.id !== id);
    if (currentChatId === id) {
      currentChatId = chats[0]?.id || null;
      currentMessages = [];
      if (currentChatId) loadChat(currentChatId);
      else showLanding();
    }
    saveState();
    renderChatHistory();
  }

  function renderChatHistory() {
    if (!chatHistory) return;
    let list = chats;
    if (chatSearchQuery) list = chats.filter(c => (c.title || '').toLowerCase().includes(chatSearchQuery));
    const pinned = list.filter(c => c.pinned), rest = list.filter(c => !c.pinned);
    const itemHtml = c => `<div class="history-item ${c.id === currentChatId ? 'active' : ''}" data-id="${c.id}"><span class="history-item-title">${c.pinned ? '\uD83D\uDCCC ' : ''}${c.title}</span><div class="history-item-actions"><button class="history-action-btn pin" data-id="${c.id}" title="Pin"><i class="fas fa-thumbtack"></i></button><button class="history-action-btn ren" data-id="${c.id}" title="Rename"><i class="fas fa-pen"></i></button><button class="history-action-btn exp" data-id="${c.id}" title="Export"><i class="fas fa-download"></i></button><button class="history-action-btn del" data-id="${c.id}" title="Delete"><i class="fas fa-trash"></i></button></div></div>`;
    let html = '';
    if (pinned.length) html += '<div class="history-section-label">Pinned</div>' + pinned.map(itemHtml).join('');
    if (rest.length) html += (pinned.length ? '<div class="history-section-label">Recent</div>' : '') + rest.map(itemHtml).join('');
    chatHistory.innerHTML = html || '<div style="padding:1rem;text-align:center;color:var(--text2);font-size:0.75rem;">' + (chatSearchQuery ? 'No results' : 'No chats') + '</div>';
    chatHistory.querySelectorAll('.history-item').forEach(i => {
      i.addEventListener('click', e => { if (!e.target.closest('button')) loadChat(i.dataset.id); });
      i.querySelector('.del')?.addEventListener('click', e => { e.stopPropagation(); if (confirm('Delete?')) deleteChat(i.dataset.id); });
      i.querySelector('.ren')?.addEventListener('click', e => { e.stopPropagation(); renameChat(i.dataset.id); });
      i.querySelector('.pin')?.addEventListener('click', e => { e.stopPropagation(); togglePinChat(i.dataset.id); });
      i.querySelector('.exp')?.addEventListener('click', e => { e.stopPropagation(); exportChat(i.dataset.id); });
    });
  }

  function renderMessages() {
    if (!messagesContainer) return;
    messagesContainer.innerHTML = '';
    currentMessages.forEach(m => {
      if (m.content) appendMsg(m.content, m.role === 'user', m.thinking, m.files, m.imageGen, m.ts);
    });
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function scrollToBottom() {
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function createMiniBrowser(url) {
    const container = document.createElement('div');
    container.className = 'browser-container';
    container.innerHTML = `
      <div class="browser-toolbar">
        <button class="browser-back"><i class="fas fa-arrow-left"></i></button>
        <button class="browser-forward"><i class="fas fa-arrow-right"></i></button>
        <button class="browser-refresh"><i class="fas fa-redo"></i></button>
        <input class="browser-url" value="${escapeHtml(url)}" placeholder="Enter URL...">
        <button class="browser-go"><i class="fas fa-arrow-right"></i></button>
      </div>
      <iframe class="browser-iframe" src="${escapeHtml(url)}" sandbox="allow-scripts allow-same-origin allow-forms allow-modals"></iframe>
    `;

    const iframe = container.querySelector('.browser-iframe');
    const urlInput = container.querySelector('.browser-url');

    container.querySelector('.browser-go').addEventListener('click', () => {
      let val = urlInput.value.trim();
      if (!val.startsWith('http://') && !val.startsWith('https://')) val = 'https://' + val;
      iframe.src = val;
    });

    container.querySelector('.browser-url').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') container.querySelector('.browser-go').click();
    });

    container.querySelector('.browser-refresh').addEventListener('click', () => {
      iframe.src = iframe.src;
    });

    container.querySelector('.browser-back').addEventListener('click', () => {
      try { iframe.contentWindow?.history?.back(); } catch(e) {}
    });

    container.querySelector('.browser-forward').addEventListener('click', () => {
      try { iframe.contentWindow?.history?.forward(); } catch(e) {}
    });

    return container;
  }

  function appendMsg(content, isUser, thinking = null, attachedFiles = null, imageGen = null, ts = null) {
    if (!messagesContainer) return;
    const row = document.createElement('div');
    row.className = `message-row ${isUser ? 'user-row' : ''}`;
    if (!isUser) {
      let th = '';
      if (thinking) {
        const thinkId = 'think-' + Date.now();
        th = `<button class="thinking-toggle-btn" onclick="document.getElementById('${thinkId}').classList.toggle('visible')"><i class="fas fa-brain"></i> View thinking</button><div class="thinking-content" id="${thinkId}">${thinking}</div>`;
      }

      let extraContent = '';
      if (imageGen) {
        extraContent = `<div class="image-loading"><i class="fas fa-spinner"></i> Generating image...</div>`;
      }

      if (content.includes('[BROWSER]')) {
        const url = content.match(/\[BROWSER\](.*?)\[\/BROWSER\]/);
        if (url) {
          const browserContainer = createMiniBrowser(url[1]);
          extraContent += browserContainer.outerHTML;
          content = content.replace(/\[BROWSER\].*?\[\/BROWSER\]/, '🌐 Browser opened');
        }
      }

      const html = renderMarkdown(content);
      const timeStr = ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      const acts = `<div class="msg-actions"><button class="msg-action-btn" data-action="copy" title="Copy"><i class="fas fa-copy"></i></button><button class="msg-action-btn" data-action="regen" title="Regenerate"><i class="fas fa-rotate-right"></i></button><button class="msg-action-btn" data-action="speak" title="Read aloud"><i class="fas fa-volume-high"></i></button><button class="msg-action-btn" data-action="like" title="Good response"><i class="fas fa-thumbs-up"></i></button><button class="msg-action-btn" data-action="dislike" title="Bad response"><i class="fas fa-thumbs-down"></i></button><span class="msg-time">${timeStr}</span></div>`;
      row.innerHTML = `<div class="message-avatar ai-avatar">⧩</div><div class="message-content">${th}<div class="message-bubble ai-bubble" id="stream-${Date.now()}">${html}${extraContent}</div>${acts}</div>`;
    } else {
      let fh = '';
      if (attachedFiles?.length) {
        fh = '<div class="upload-preview">';
        attachedFiles.forEach(f => {
          if (f.type?.startsWith('image/')) fh += `<img src="${f.data}" alt="${f.name}">`;
          else fh += `<span class="file-tag"><i class="fas fa-file"></i> ${f.name}</span>`;
        });
        fh += '</div>';
      }
      const av = googleUser?.picture ? `<img src="${googleUser.picture}" alt="U">` : '<i class="fas fa-user"></i>';
      const utime = ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      const uacts = `<div class="msg-actions"><button class="msg-action-btn" data-action="edit" title="Edit & resend"><i class="fas fa-pen"></i></button><button class="msg-action-btn" data-action="copy" title="Copy"><i class="fas fa-copy"></i></button><span class="msg-time">${utime}</span></div>`;
      row.innerHTML = `<div class="message-content"><div class="message-bubble user-bubble">${content}</div>${fh}${uacts}</div><div class="message-avatar user-avatar">${av}</div>`;
    }
    messagesContainer.appendChild(row);
    if (!isUser) addCodeActions(row);
    scrollToBottom();
  }

  function addCodeActions(container) {
    if (!container) return;
    container.querySelectorAll('.code-block-wrapper').forEach(w => {
      if (w.querySelector('.code-actions')) return;
      const c = w.querySelector('code');
      if (!c) return;
      const a = document.createElement('div');
      a.className = 'code-actions';
      const cp = document.createElement('button');
      cp.innerHTML = '<i class="fas fa-copy"></i>';
      cp.addEventListener('click', () => {
        navigator.clipboard.writeText(c.textContent).then(() => {
          cp.innerHTML = '<i class="fas fa-check"></i>';
          cp.classList.add('copied');
          setTimeout(() => { cp.innerHTML = '<i class="fas fa-copy"></i>';
            cp.classList.remove('copied'); }, 2000);
        });
      });
      a.appendChild(cp);
      if (previewEnabled && (c.className.includes('html') || c.textContent.trim().startsWith('<'))) {
        const rb = document.createElement('button');
        rb.className = 'run-btn';
        rb.innerHTML = '<i class="fas fa-play"></i>';
        rb.addEventListener('click', () => openPreview(c.textContent, 'index.html'));
        a.appendChild(rb);
      }
      w.appendChild(a);
    });
  }

  function openPreview(content, filename = 'index.html') {
    previewContent = content;
    if (previewPanel) previewPanel.classList.add('visible');
    if (window.innerWidth <= 768 && mobilePreviewOverlay) mobilePreviewOverlay.classList.add('active');
    if (previewUrl) previewUrl.textContent = filename;
    const blob = new Blob([content], { type: 'text/html' });
    if (previewFrame) previewFrame.src = URL.createObjectURL(blob);
  }

  function saveCurrentChat() {
    const c = chats.find(x => x.id === currentChatId);
    if (c) {
      c.messages = [...currentMessages];
      if (c.title === 'New Chat' && currentMessages.length > 0) {
        const u = currentMessages.find(m => m.role === 'user');
        if (u) c.title = u.content.substring(0, 30) + (u.content.length > 30 ? '...' : '');
      }
    }
    saveState();
    renderChatHistory();
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.add('closed');
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    sidebarOpen = false;
    if (window.innerWidth >= 769 && toggleSidebarBtn) toggleSidebarBtn.style.display = 'flex';
    localStorage.setItem('notal_sidebar_open', 'false');
  }

  function openSidebar() {
    if (sidebar) sidebar.classList.remove('closed');
    sidebarOpen = true;
    if (toggleSidebarBtn) toggleSidebarBtn.style.display = 'none';
    if (window.innerWidth <= 768) { if (sidebar) sidebar.classList.add('open'); if (sidebarOverlay) sidebarOverlay.classList.add('active'); }
    localStorage.setItem('notal_sidebar_open', 'true');
  }

  function toggleSidebar() {
    if (sidebar && (sidebar.classList.contains('closed') || (window.innerWidth <= 768 && !sidebar.classList.contains('open')))) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
  }

  // ============================================================
  //  FILE UPLOAD
  // ============================================================
  if ($('uploadBtn')) {
    $('uploadBtn').addEventListener('click', () => {
      if (fileUploadInput) fileUploadInput.click();
    });
  }

  if (fileUploadInput) {
    fileUploadInput.addEventListener('change', () => {
      const files = Array.from(fileUploadInput.files);
      if (!files.length) return;
      let done = 0;
      files.forEach(f => {
        const r = new FileReader();
        r.onload = () => {
          uploadedFiles.push({ id: Date.now() + Math.random(), name: f.name, type: f.type, data: r.result, size: f.size, content: r.result });
          done++;
          if (done === files.length) {
            const n = document.createElement('div');
            n.style.cssText = 'position:fixed;bottom:70px;right:20px;background:var(--accent);color:var(--bg);padding:0.4rem 0.8rem;border-radius:1rem;font-size:0.8rem;z-index:50;';
            n.textContent = `📎 ${files.length} file(s) uploaded`;
            document.body.appendChild(n);
            setTimeout(() => n.remove(), 2000);
          }
        };
        if (f.type.startsWith('image/')) r.readAsDataURL(f);
        else r.readAsText(f);
      });
      fileUploadInput.value = '';
    });
  }

  // ============================================================
  //  STREAM TEXT
  // ============================================================
  function finalizeThinkingUI(thinkId, keepContent) {
    const btn = document.getElementById('thinkBtn-' + thinkId);
    const el = document.getElementById(thinkId);
    if (btn) {
      if (keepContent) { btn.innerHTML = '<i class="fas fa-brain"></i> View thinking';
        btn.classList.remove('active'); } else { btn.remove(); }
    }
    if (el) { el.classList.remove('streaming'); if (!keepContent) el.remove(); }
  }

  function streamText(element, content, thinkingEl = null) {
    let index = 0;
    const chars = content.split('');
    let fullText = '';

    function renderCurrent() {
      const rendered = renderMarkdown(fullText);
      element.innerHTML = rendered;
      addCodeActions(element.closest('.message-row'));
      if (thinkingEl && thinkingContent) {
        thinkingEl.textContent = thinkingContent;
        thinkingEl.classList.add('streaming');
      }
      scrollToBottom();
    }

    function streamChar() {
      if (streamAborted) {
        fullText = content;
        renderCurrent();
        if (thinkingEl) thinkingEl.classList.remove('streaming');
        addCodeActions(element.closest('.message-row'));
        scrollToBottom();
        return;
      }
      if (index < chars.length) {
        fullText += chars[index];
        index++;
        renderCurrent();
        const delay = 2 + Math.random() * 3;
        setTimeout(streamChar, delay);
      } else {
        renderCurrent();
        if (thinkingEl) thinkingEl.classList.remove('streaming');
        addCodeActions(element.closest('.message-row'));
        scrollToBottom();
      }
    }

    streamChar();
  }

  // ============================================================
  //  HANDLE SEND
  // ============================================================
  async function handleSend() {
    if (isProcessing) return;
    const text = userInput ? userInput.value.trim() : '';
    if (!text && !uploadedFiles.length) return;

    console.log('=== HANDLE SEND START ===');
    console.log('Input text:', text);
    console.log('Current model:', currentModel);
    console.log('API key present:', !!keys[currentModel.provider]);

    const providerKey = keys[currentModel.provider];
    if (!providerKey || !providerKey.trim()) {
      alert(`Please add your ${currentModel.provider} API key in Settings first.`);
      if (settingsModal) settingsModal.classList.remove('hidden');
      return;
    }

    if (!currentChatId) createNewChat();
    if (isLanding) { isLanding = false; if (messagesContainer) messagesContainer.innerHTML = ''; }

    const isImageGen = currentModel.imageGen && (
      text.toLowerCase().includes('generate') ||
      text.toLowerCase().includes('create') ||
      text.toLowerCase().includes('draw') ||
      text.toLowerCase().includes('paint') ||
      text.toLowerCase().includes('image')
    );

    const wantsSummary = text.toLowerCase().includes('summarize') ||
      text.toLowerCase().includes('summary') ||
      text.toLowerCase().includes('tell me about') ||
      text.toLowerCase().includes('what\'s on') ||
      text.toLowerCase().includes('explain') ||
      text.toLowerCase().includes('give me an overview') ||
      text.toLowerCase().includes('break down') ||
      text.toLowerCase().includes('analyze');

    const isBrowse = text.includes('browse') || text.includes('visit') || text.includes('open') || text.includes('go to') || text.includes('fetch');
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/);

    let uc = text || '';
    if (uploadedFiles.length) {
      const fc = uploadedFiles.map(f => f.type?.startsWith('image/') ? `[Image: ${f.name}]` : `--- ${f.name} ---\n${(f.content || '').substring(0, 4000)}\n---`).join('\n\n');
      uc = text ? `${text}\n\n${fc}` : `Analyze:\n${fc}`;
    }
    const dc = text || (uploadedFiles.length ? `📎 ${uploadedFiles.length} file(s)` : '');
    const af = [...uploadedFiles];

    const userTs = Date.now();
    currentMessages.push({ role: 'user', content: uc, files: af.length ? af : null, ts: userTs });
    appendMsg(dc, true, null, af.length ? af : null, userTs);
    if (userInput) {
      userInput.value = '';
      userInput.style.height = 'auto';
    }
    uploadedFiles = [];
    saveCurrentChat();

    const row = document.createElement('div');
    row.className = 'message-row';
    const bubbleId = 'stream-' + Date.now();
    const thinkId = 'think-' + Date.now();
    row.innerHTML = `<div class="message-avatar ai-avatar">⧩</div><div class="message-content">
      <button class="thinking-toggle-btn" id="thinkBtn-${thinkId}" onclick="document.getElementById('${thinkId}').classList.toggle('visible')">
        <i class="fas fa-brain"></i> <span class="typing-indicator"><span></span><span></span><span></span></span> Thinking...
      </button>
      <div class="thinking-content" id="${thinkId}"></div>
      <div class="message-bubble ai-bubble" id="${bubbleId}"></div>
    </div>`;
    if (messagesContainer) {
      messagesContainer.appendChild(row);
      scrollToBottom();
    }
    
    console.log('AI message row created with bubbleId:', bubbleId);
    console.log('bubbleId exists in DOM:', !!document.getElementById(bubbleId));

    isProcessing = true;
    if (sendBtn) sendBtn.style.display = 'none';
    if (stopBtn) stopBtn.classList.add('visible');
    abortController = new AbortController();
    streamAborted = false;
    activeThinkId = thinkId;
    thinkingContent = '';

    console.log('Starting request processing...');
    
    try {
      console.log('Inside try block');
      
      // ===== IMAGE GENERATION =====
      if (isImageGen && currentModel.imageGen) {
        const imgHtml = `<div class="image-loading"><i class="fas fa-spinner"></i> Generating image...</div>`;
        currentMessages.push({ role: 'assistant', content: `🎨 Generated image placeholder`, imageGen: true });
        const bubble = document.getElementById(bubbleId);
        if (bubble) {
          bubble.innerHTML = imgHtml;
          scrollToBottom();
        }
        saveCurrentChat();
        isProcessing = false;
        if (sendBtn) sendBtn.style.display = 'flex';
        if (stopBtn) stopBtn.classList.remove('visible');
        abortController = null;
        if (userInput) userInput.focus();
        return;
      }

      // ===== WEB BROWSING =====
      if (isBrowse && urlMatch) {
        const url = urlMatch[0];
        try {
          let fetchUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
          
          if (proxyEnabled && proxyUrl) {
            fetchUrl = `${proxyUrl}?url=${encodeURIComponent(url)}`;
          }
          
          const resp = await fetch(fetchUrl, { signal: abortController.signal });
          if (!resp.ok) {
            throw new Error(`Failed to fetch webpage (HTTP ${resp.status}). Try enabling CORS proxy in Settings or check your internet connection.`);
          }
          const html = await resp.text();
          
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          doc.querySelectorAll('script, style, link, meta, noscript').forEach(el => el.remove());
          const body = doc.body;
          let parsedContent = body ? body.innerText || 'No content found.' : 'No content found.';
          parsedContent = parsedContent.substring(0, 8000);

          if (wantsSummary) {
            const am = [
              { role: 'system', content: `You are Notal AI. Summarize this webpage from ${url}:\n\n${parsedContent}` },
              { role: 'user', content: 'Provide a clear summary with overview, key points, and takeaways.' }
            ];

            const config = getApiConfig();
            if (!config) throw new Error('No API configuration found');

            const resp2 = await fetch(config.url, {
              method: 'POST',
              headers: config.headers,
              body: JSON.stringify({
                model: currentModel.id,
                messages: am,
                temperature: 0.7,
                max_tokens: 2000
              }),
              signal: abortController.signal
            });

            if (!resp2.ok) {
              const err = await resp2.json().catch(() => ({}));
              throw new Error(err.error?.message || `HTTP ${resp2.status}`);
            }

            const data = await resp2.json();
            const summary = data.choices?.[0]?.message?.content || 'No summary available.';

            const fullContent = `🌐 **Webpage Summary**: ${url}\n\n${summary}\n\n---\n📄 **Full Content**:\n${parsedContent.substring(0, 4000)}`;
            currentMessages.push({ role: 'assistant', content: fullContent, browser: true });
            const bubble = document.getElementById(bubbleId);
            if (bubble) streamText(bubble, fullContent, document.getElementById(thinkId));
          } else {
            const fullContent = `🌐 **${url}**\n\n${parsedContent}`;
            currentMessages.push({ role: 'assistant', content: fullContent, browser: true });
            const bubble = document.getElementById(bubbleId);
            if (bubble) streamText(bubble, fullContent, document.getElementById(thinkId));
          }
          saveCurrentChat();
          isProcessing = false;
          if (sendBtn) sendBtn.style.display = 'flex';
          if (stopBtn) stopBtn.classList.remove('visible');
          abortController = null;
          if (userInput) userInput.focus();
          return;
        } catch (err) {
          const bubble = document.getElementById(bubbleId);
          let errorMsg = `❌ ${err.message}`;
          
          if (err.name === 'AbortError') {
            errorMsg = '⏹️ Browsing cancelled';
          } else if (err.message.includes('Failed to fetch')) {
            errorMsg = `❌ Could not fetch webpage. The CORS proxy may be down or blocked. Try:\n1. Enabling CORS Proxy in Settings\n2. Using a different URL\n3. Checking your internet connection`;
          }
          
          if (bubble) bubble.innerHTML = errorMsg;
          currentMessages.push({ role: 'assistant', content: errorMsg });
          saveCurrentChat();
          isProcessing = false;
          if (sendBtn) sendBtn.style.display = 'flex';
          if (stopBtn) stopBtn.classList.remove('visible');
          abortController = null;
          if (userInput) userInput.focus();
          return;
        }
      }

      // ===== REGULAR CHAT =====
      const am = [];
      console.log('🔍 DEBUG: systemPromptEnabled value:', systemPromptEnabled, 'type:', typeof systemPromptEnabled);
      console.log('🔍 DEBUG: toggle element:', $('systemPromptToggle'));
      console.log('🔍 DEBUG: toggle checked:', $('systemPromptToggle')?.checked);
      console.log('🔍 DEBUG: localStorage value:', localStorage.getItem('notal_system_prompt'));
      
      currentMessages.forEach(m => {
        if (!m.content?.includes('Welcome')) {
          am.push({ role: m.role, content: m.content?.replace(/<[^>]*>/g, '') || '' });
        }
      });

      console.log('Messages to send:', am);
      
      const config = getApiConfig();
      if (!config) throw new Error('No API configuration found');

      console.log('Got API config, proceeding with request...');

      const requestBody = {
        provider: config.provider,
        model: currentModel.id,
        messages: am,
        apiKey: config.apiKey,
        temperature: chatTemperature
      };

      console.log('Sending request to Cloudflare Worker:', config.url);
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      console.log('Headers:', config.headers);

      let fetchUrl = config.url;
      let fetchHeaders = { ...config.headers };
      
      fetchHeaders['User-Agent'] = 'Notal AI Client';
      
      let resp;
      try {
        resp = await fetch(fetchUrl, {
          method: 'POST',
          headers: fetchHeaders,
          body: JSON.stringify(requestBody),
          signal: abortController.signal,
          mode: 'cors',
          credentials: 'omit'
        }).catch(err => {
          console.error('Worker fetch error:', err.message);
          throw err;
        });
      } catch (fetchErr) {
        console.warn('Cloudflare Worker fetch failed:', fetchErr.message);
        throw fetchErr;
      }

      console.log('Response status:', resp.status, resp.statusText);
      
      const responseText = await resp.text();
      console.log('Raw response text:', responseText);
      if (!resp.ok) {
        try {
          const err = JSON.parse(responseText);
          console.error('Worker error response:', err);
          throw new Error(err.error || `HTTP ${resp.status}: ${resp.statusText}`);
        } catch (e) {
          console.error('Failed to parse error response:', e);
          throw new Error(`HTTP ${resp.status}: ${responseText.substring(0, 200)}`);
        }
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Worker Response:', data);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`);
      }
      
      let content = data.response || data.choices?.[0]?.message?.content || 'No response from AI.';
      let thinking = data.thinking || data.choices?.[0]?.message?.reasoning || null;

      const thinkEl = document.getElementById(thinkId);
      if (thinking && thinkEl) {
        thinkingContent = thinking;
        thinkEl.textContent = thinking;
        thinkEl.classList.add('streaming');
        const btn = document.getElementById('thinkBtn-' + thinkId);
        if (btn) {
          btn.innerHTML = '<i class="fas fa-brain" style="color:#f59e0b;"></i> 💭 Thinking... <i class="fas fa-chevron-right" style="font-size:0.6rem;"></i>';
          btn.classList.add('active');
        }
      }

      const bubble = document.getElementById(bubbleId);
      console.log('Bubble element:', bubble);
      console.log('Content to display:', content);
      
      if (bubble) {
        streamText(bubble, content, thinkEl);
      } else {
        console.error('Bubble element not found!');
        appendMsg(content, false);
      }

      setTimeout(() => {
        const btn = document.getElementById('thinkBtn-' + thinkId);
        if (btn) {
          btn.innerHTML = '<i class="fas fa-brain"></i> View thinking';
          btn.classList.remove('active');
        }
        if (thinkEl) thinkEl.classList.remove('streaming');
      }, content.length * 3 + 500);

      currentMessages.push({ role: 'assistant', content, thinking, ts: Date.now() });
      saveCurrentChat();

    } catch (err) {
      console.error('=== FULL ERROR CAUGHT ===');
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      console.error('Error object:', err);
      console.error('=== END ERROR ===');
      
      const bubble = document.getElementById(bubbleId);
      finalizeThinkingUI(thinkId, !!thinkingContent);
      
      if (bubble) {
        let msg = `❌ ${err.message}`;
        
        if (err.name === 'AbortError') {
          msg = '⏹️ Stopped';
        } else if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
          msg = `❌ Cloudflare Worker Error: Could not connect to the proxy.\n\n1. Check your internet connection\n2. Verify the worker URL is correct\n3. Check browser console (F12) for details`;
        } else if (err.message.includes('HTTP 401')) {
          msg = `❌ Authentication Failed: Your ${currentModel.provider} API key is invalid.\n\nUpdate it in Settings and try again.`;
        } else if (err.message.includes('HTTP 429')) {
          msg = `❌ Rate Limited: Too many requests.\n\nPlease wait a moment and try again.`;
        } else if (err.message.includes('HTTP 400')) {
          msg = `❌ Bad Request: Check your API key and model.\n\nModel: ${currentModel.id}\n\nCheck browser console (F12) for details.`;
        } else if (err.message.includes('No API configuration found')) {
          msg = `❌ No API Key Found!\n\nYou need to add your ${currentModel.provider} API key in Settings:\n1. Click the ⚙️ Settings icon\n2. Go to "Keys" tab\n3. Paste your API key\n4. Click Save`;
        }
        
        bubble.innerHTML = msg;
        currentMessages.push({ role: 'assistant', content: msg });
      } else {
        console.error('Bubble not found for error display');
        appendMsg(err.message, false);
      }
      saveCurrentChat();
    } finally {
      isProcessing = false;
      if (sendBtn) sendBtn.style.display = 'flex';
      if (stopBtn) stopBtn.classList.remove('visible');
      abortController = null;
      activeThinkId = null;
      if (userInput) userInput.focus();
      thinkingContent = '';
    }
  }

  // ============================================================
  //  RENDER PROVIDER CARDS
  // ============================================================
  function renderProviderCards() {
    const c = $('providerCards');
    if (!c) return;
    c.innerHTML = providers.map(p => `<div class="provider-card ${keys[p.id] ? 'has-key' : ''}"><div class="provider-card-header">${p.name} <span class="badge ${p.needsProxy ? 'badge-yellow' : 'badge-green'}">${p.needsProxy ? 'Proxy' : 'Direct'}</span> ${keys[p.id] ? '✅' : ''}</div><input type="password" placeholder="${p.keyHint}" value="${keys[p.id] || ''}" data-provider="${p.id}"></div>`).join('');
    c.querySelectorAll('input').forEach(i => i.addEventListener('input', () => { if (i.value.trim()) keys[i.dataset.provider] = i.value.trim(); else delete keys[i.dataset.provider]; }));
  }

  // ============================================================
  //  EVENT LISTENERS
  // ============================================================
  if ($('closeSidebarBtn')) {
    $('closeSidebarBtn').addEventListener('click', e => { e.preventDefault();
      closeSidebar(); });
  }

  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', e => { e.preventDefault();
      openSidebar(); });
  }

  if ($('menuToggle')) {
    $('menuToggle').addEventListener('click', e => { e.preventDefault();
      toggleSidebar(); });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => { closeMobileSidebar(); if (window.innerWidth >= 769) closeSidebar(); });
  }

  if (mobilePreviewOverlay) {
    mobilePreviewOverlay.addEventListener('click', () => {
      if (previewPanel) previewPanel.classList.remove('visible');
      mobilePreviewOverlay.classList.remove('active');
    });
  }

  if ($('closePreviewBtn')) {
    $('closePreviewBtn').addEventListener('click', () => {
      if (previewPanel) previewPanel.classList.remove('visible');
      if (mobilePreviewOverlay) mobilePreviewOverlay.classList.remove('active');
    });
  }

  if ($('previewRefreshBtn')) {
    $('previewRefreshBtn').addEventListener('click', () => { if (previewContent) openPreview(previewContent); });
  }

  if ($('previewBackBtn')) {
    $('previewBackBtn').addEventListener('click', () => { if (previewFrame && previewFrame.contentWindow) previewFrame.contentWindow?.history?.back(); });
  }

  if ($('previewExternalBtn')) {
    $('previewExternalBtn').addEventListener('click', () => { if (previewContent) window.open(URL.createObjectURL(new Blob([previewContent], { type: 'text/html' }))); });
  }

  if ($('newChatBtn')) {
    $('newChatBtn').addEventListener('click', createNewChat);
  }

  if ($('sidebarSettingsBtn')) {
    $('sidebarSettingsBtn').addEventListener('click', () => {
      renderProviderCards();
      if (settingsModal) settingsModal.classList.remove('hidden');
      const activeTab = document.querySelector('.settings-tab[data-tab="keys"]');
      if (activeTab) activeTab.click();
    });
  }

  if ($('closeSettingsBtn')) {
    $('closeSettingsBtn').addEventListener('click', () => { if (settingsModal) settingsModal.classList.add('hidden'); });
  }

  if ($('saveSettingsBtn')) {
    $('saveSettingsBtn').addEventListener('click', () => {
      document.querySelectorAll('#providerCards input').forEach(i => { if (i.value.trim()) keys[i.dataset.provider] = i.value.trim(); });
      proxyEnabled = $('proxyToggle') ? $('proxyToggle').checked : false;
      proxyUrl = $('proxyUrlInput') ? $('proxyUrlInput').value.trim() : '';
      previewEnabled = $('previewToggle') ? $('previewToggle').checked : true;
      systemPromptEnabled = $('systemPromptToggle') ? $('systemPromptToggle').checked : true;
      console.log('Settings saved - systemPromptEnabled:', systemPromptEnabled);
      saveState();
      updateConnectionUI();
      if (settingsModal) settingsModal.classList.add('hidden');
    });
  }
  
  if ($('systemPromptToggle')) {
    $('systemPromptToggle').addEventListener('change', (e) => {
      systemPromptEnabled = e.target.checked;
      console.log('System prompt toggled:', systemPromptEnabled);
      saveState();
    });
  }
  
  if ($('previewToggle')) {
    $('previewToggle').addEventListener('change', (e) => {
      previewEnabled = e.target.checked;
      console.log('Preview toggled:', previewEnabled);
      saveState();
    });
  }
  
  if ($('proxyToggle')) {
    $('proxyToggle').addEventListener('change', (e) => {
      proxyEnabled = e.target.checked;
      console.log('Proxy toggled:', proxyEnabled);
      saveState();
    });
  }

  const closeSettingsBtnFooter = $('closeSettingsBtnFooter');
  if (closeSettingsBtnFooter) {
    closeSettingsBtnFooter.addEventListener('click', () => {
      if (settingsModal) settingsModal.classList.add('hidden');
    });
  }

  const themeRow = $('themeRow');
  const themeDropdown = $('themeDropdown');
  if (themeRow && themeDropdown) {
    themeRow.addEventListener('click', () => {
      const isOpen = themeDropdown.style.display !== 'none';
      themeDropdown.style.display = isOpen ? 'none' : 'block';
      themeRow.querySelector('.settings-row-chevron').style.transform = isOpen ? '' : 'rotate(180deg)';
    });
  }

  document.querySelectorAll('.theme-btn').forEach(b => b.addEventListener('click', () => { 
    document.querySelectorAll('.theme-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    currentTheme = b.dataset.theme;
    applyTheme(currentTheme);
    const themeValue = $('themeValue');
    if (themeValue) themeValue.textContent = currentTheme === 'dark' ? 'Dark' : 'Light';
    const themeIcon = themeRow ? themeRow.querySelector('.settings-row-icon i') : null;
    if (themeIcon) themeIcon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    saveState(); 
  }));

  function updateSettingsProfile() {
    const avatar = $('settingsProfileAvatar');
    const name = $('settingsProfileName');
    if (googleUser) {
      if (name) name.textContent = googleUser.name;
      if (avatar) avatar.innerHTML = `<img src="${googleUser.picture}" alt="U">`;
    } else {
      if (name) name.textContent = 'Guest User';
      if (avatar) avatar.innerHTML = '<i class="fas fa-user"></i>';
    }
  }

  if ($('sidebarSettingsBtn')) {
    const origClick = $('sidebarSettingsBtn').onclick;
    $('sidebarSettingsBtn').addEventListener('click', () => {
      updateSettingsProfile();
    });
  }

  const settingsProfileCard = $('settingsProfileCard');
  const profileDropdown = $('profileDropdown');
  if (settingsProfileCard && profileDropdown) {
    settingsProfileCard.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if (!settingsProfileCard.contains(e.target)) {
        profileDropdown.classList.remove('show');
      }
    });
  }

  if ($('profileSignInItem')) {
    $('profileSignInItem').addEventListener('click', () => {
      if (profileDropdown) profileDropdown.classList.remove('show');
      if (window.google?.accounts?.id && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
        google.accounts.id.prompt();
      } else {
        const n = prompt('Name:');
        if (n?.trim()) {
          googleUser = { name: n.trim(), picture: `https://ui-avatars.com/api/?name=${n.trim()}&bg=000&color=fff&size=64` };
          localStorage.setItem('notal_google_user', JSON.stringify(googleUser));
          updateUserUI();
          updateSettingsProfile();
        }
      }
    });
  }

  if ($('profileEditNameItem')) {
    $('profileEditNameItem').addEventListener('click', () => {
      if (profileDropdown) profileDropdown.classList.remove('show');
      const currentName = googleUser ? googleUser.name : 'Guest User';
      const n = prompt('Display name:', currentName);
      if (n?.trim()) {
        if (googleUser) {
          googleUser.name = n.trim();
          googleUser.picture = `https://ui-avatars.com/api/?name=${n.trim()}&bg=000&color=fff&size=64`;
        } else {
          googleUser = { name: n.trim(), picture: `https://ui-avatars.com/api/?name=${n.trim()}&bg=000&color=fff&size=64` };
        }
        localStorage.setItem('notal_google_user', JSON.stringify(googleUser));
        updateUserUI();
        updateSettingsProfile();
      }
    });
  }

  if ($('profileSignOutItem')) {
    $('profileSignOutItem').addEventListener('click', () => {
      if (profileDropdown) profileDropdown.classList.remove('show');
      googleUser = null;
      localStorage.removeItem('notal_google_user');
      updateUserUI();
      updateSettingsProfile();
    });
  }

  if ($('googleSigninBtn')) {
    $('googleSigninBtn').addEventListener('click', () => {
      if (window.google?.accounts?.id && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') google.accounts.id.prompt();
      else { const n = prompt('Name:'); if (n?.trim()) { googleUser = { name: n.trim(), picture: `https://ui-avatars.com/api/?name=${n.trim()}&bg=000&color=fff&size=64` };
          localStorage.setItem('notal_google_user', JSON.stringify(googleUser));
          updateUserUI(); } }
    });
  }

  if ($('userProfileBtn')) {
    $('userProfileBtn').addEventListener('click', (e) => { e.stopPropagation(); if (signoutDropdown) signoutDropdown.classList.toggle('show'); });
  }

  if ($('signoutConfirmBtn')) {
    $('signoutConfirmBtn').addEventListener('click', () => { googleUser = null;
      localStorage.removeItem('notal_google_user');
      updateUserUI(); if (signoutDropdown) signoutDropdown.classList.remove('show'); });
  }

  document.addEventListener('click', () => { if (signoutDropdown) signoutDropdown.classList.remove('show'); });

  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      streamAborted = true;
      if (abortController) { abortController.abort();
        abortController = null; }
      if (activeThinkId) { finalizeThinkingUI(activeThinkId, !!thinkingContent);
        activeThinkId = null; }
    });
  }

  if (modelTrigger) {
    modelTrigger.addEventListener('click', e => { e.stopPropagation(); if (modelDropdown) modelDropdown.classList.toggle('show'); });
  }

  document.addEventListener('click', e => {
    if (modelTrigger && !modelTrigger.contains(e.target) && modelDropdown && !modelDropdown.contains(e.target)) {
      modelDropdown.classList.remove('show');
    }
  });

  if (sendBtn) {
    sendBtn.addEventListener('click', handleSend);
  }

  if (userInput) {
    userInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault();
        handleSend(); } });

    function autoGrowInput() {
      userInput.style.height = 'auto';
      userInput.style.height = Math.min(userInput.scrollHeight, 144) + 'px';
    }
    userInput.addEventListener('input', autoGrowInput);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (isProcessing && abortController) abortController.abort();
      else {
        if (settingsModal) settingsModal.classList.add('hidden');
        if (previewPanel) previewPanel.classList.remove('visible');
        if (signoutDropdown) signoutDropdown.classList.remove('show');
      }
    }
  });

  let tx = 0;
  if (sidebar) {
    sidebar.addEventListener('touchstart', e => { tx = e.touches[0].clientX; });
    sidebar.addEventListener('touchmove', e => { if (e.touches[0].clientX - tx < -60) { closeMobileSidebar(); if (window.innerWidth >= 769) closeSidebar(); } });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      if (toggleSidebarBtn) toggleSidebarBtn.style.display = 'none';
      if (sidebarOpen && sidebar) sidebar.classList.remove('closed');
    } else {
      if (!sidebarOpen) {
        if (toggleSidebarBtn) toggleSidebarBtn.style.display = 'flex';
        if (sidebar) sidebar.classList.add('closed');
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
      } else {
        if (toggleSidebarBtn) toggleSidebarBtn.style.display = 'none';
        if (sidebar) sidebar.classList.remove('closed', 'open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
      }
    }
  });

  if (localStorage.getItem('notal_sidebar_open') === 'false') {
    sidebarOpen = false;
    if (window.innerWidth >= 769) {
      if (sidebar) sidebar.classList.add('closed');
      if (toggleSidebarBtn) toggleSidebarBtn.style.display = 'flex';
    }
  }

  // ============================================================
  //  EXTENDED FEATURES
  // ============================================================
  let chatSearchQuery = '';
  let chatTemperature = parseFloat(localStorage.getItem('notal_temperature') || '0.7');
  let fontSizePref = localStorage.getItem('notal_font_size') || 'md';
  let accentPref = localStorage.getItem('notal_accent') || 'default';
  let recognition = null, isRecording = false, speakingBtn = null;

  function toast(msg) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2200);
  }

  if ($('chatSearchInput')) {
    $('chatSearchInput').addEventListener('input', e => {
      chatSearchQuery = e.target.value.trim().toLowerCase();
      renderChatHistory();
    });
  }

  function togglePinChat(id) { const c = chats.find(x => x.id === id); if (!c) return; c.pinned = !c.pinned; saveState(); renderChatHistory(); toast(c.pinned ? 'Chat pinned' : 'Chat unpinned'); }
  function renameChat(id) { const c = chats.find(x => x.id === id); if (!c) return; const t = prompt('Rename chat:', c.title); if (t && t.trim()) { c.title = t.trim(); saveState(); renderChatHistory(); toast('Chat renamed'); } }
  function exportChat(id) {
    const c = chats.find(x => x.id === id); if (!c) return;
    let md = '# ' + (c.title || 'Chat') + '\n\n';
    (c.messages || []).forEach(m => { md += (m.role === 'user' ? '**You:** ' : '**Notal AI:** ') + (m.content || '') + '\n\n'; });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }));
    a.download = (c.title || 'chat').replace(/[^a-z0-9]+/gi, '_') + '.md';
    a.click();
    toast('Chat exported');
  }

  if (messagesContainer) {
    messagesContainer.addEventListener('click', e => {
      const btn = e.target.closest('.msg-action-btn');
      if (!btn) return;
      const row = btn.closest('.message-row');
      if (!row) return;
      const idx = Array.prototype.indexOf.call(messagesContainer.children, row);
      const action = btn.dataset.action;
      const bubble = row.querySelector('.message-bubble');
      const text = bubble ? bubble.innerText.trim() : '';
      if (action === 'copy') { navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard')); }
      else if (action === 'speak') { toggleSpeak(text, btn); }
      else if (action === 'regen') { regenerateLast(); }
      else if (action === 'edit') { editUserMessage(idx); }
      else if (action === 'like' || action === 'dislike') {
        const other = row.querySelector('[data-action="' + (action === 'like' ? 'dislike' : 'like') + '"]');
        const was = btn.classList.contains('active');
        btn.classList.toggle('active');
        if (other) other.classList.remove('active');
        const m = currentMessages[idx];
        if (m) { m.feedback = was ? null : action; saveCurrentChat(); }
        toast(was ? 'Feedback removed' : 'Thanks for the feedback!');
      }
    });
  }

  function toggleSpeak(text, btn) {
    if (!('speechSynthesis' in window)) { toast('Speech not supported'); return; }
    if (speechSynthesis.speaking) { speechSynthesis.cancel(); if (speakingBtn) speakingBtn.classList.remove('active'); speakingBtn = null; return; }
    const u = new SpeechSynthesisUtterance(text.substring(0, 1500));
    u.rate = 1;
    btn.classList.add('active'); speakingBtn = btn;
    u.onend = u.onerror = () => { btn.classList.remove('active'); speakingBtn = null; };
    speechSynthesis.speak(u);
  }

  function regenerateLast() {
    if (isProcessing) return;
    while (currentMessages.length && currentMessages[currentMessages.length - 1].role === 'assistant') currentMessages.pop();
    let idx = -1;
    for (let i = currentMessages.length - 1; i >= 0; i--) { if (currentMessages[i].role === 'user') { idx = i; break; } }
    if (idx < 0) { toast('Nothing to regenerate'); return; }
    const content = currentMessages[idx].content;
    currentMessages.splice(idx);
    saveCurrentChat();
    renderMessages();
    if (userInput) { userInput.value = content; userInput.dispatchEvent(new Event('input')); }
    handleSend();
  }

  function editUserMessage(idx) {
    if (isProcessing) return;
    const m = currentMessages[idx];
    if (!m || m.role !== 'user') return;
    if (userInput) { userInput.value = m.content; userInput.dispatchEvent(new Event('input')); userInput.focus(); }
    currentMessages.splice(idx);
    saveCurrentChat();
    renderMessages();
    toast('Message loaded for editing');
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRec && $('voiceBtn')) {
    recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = e => {
      let t = '';
      for (const r of e.results) t += r[0].transcript;
      if (userInput) { userInput.value = t; userInput.dispatchEvent(new Event('input')); }
    };
    recognition.onend = () => { isRecording = false; $('voiceBtn').classList.remove('voice-on'); };
    recognition.onerror = () => { isRecording = false; $('voiceBtn').classList.remove('voice-on'); toast('Voice input error'); };
    $('voiceBtn').addEventListener('click', () => {
      if (isRecording) { recognition.stop(); }
      else { try { recognition.start(); isRecording = true; $('voiceBtn').classList.add('voice-on'); toast('Listening...'); } catch (err) {} }
    });
  } else if ($('voiceBtn')) { $('voiceBtn').style.display = 'none'; }

  function applyFontSize(sz) {
    document.body.classList.remove('font-sm', 'font-lg');
    if (sz === 'sm') document.body.classList.add('font-sm');
    if (sz === 'lg') document.body.classList.add('font-lg');
    fontSizePref = sz;
    localStorage.setItem('notal_font_size', sz);
    document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.dataset.size === sz));
  }
  document.querySelectorAll('.font-btn').forEach(b => b.addEventListener('click', () => applyFontSize(b.dataset.size)));
  applyFontSize(fontSizePref);

  function applyAccent(name) {
    const colors = { blue: '#2d68ff', green: '#22c55e', purple: '#8b5cf6', orange: '#f59e0b', red: '#ef4444' };
    const st = document.body.style;
    if (!name || name === 'default' || !colors[name]) {
      st.removeProperty('--accent'); st.removeProperty('--accent-hover'); st.removeProperty('--bubble-user');
      name = 'default';
    } else {
      st.setProperty('--accent', colors[name]);
      st.setProperty('--accent-hover', colors[name]);
      st.setProperty('--bubble-user', colors[name]);
    }
    accentPref = name;
    localStorage.setItem('notal_accent', name);
    document.querySelectorAll('.swatch').forEach(sw => sw.classList.toggle('active', sw.dataset.accent === name));
  }
  document.querySelectorAll('.swatch').forEach(sw => sw.addEventListener('click', () => { applyAccent(sw.dataset.accent); toast('Accent color updated'); }));
  applyAccent(accentPref);

  if ($('temperatureSlider')) {
    $('temperatureSlider').value = chatTemperature;
    if ($('temperatureValue')) $('temperatureValue').textContent = chatTemperature;
    $('temperatureSlider').addEventListener('input', () => {
      chatTemperature = parseFloat($('temperatureSlider').value);
      if ($('temperatureValue')) $('temperatureValue').textContent = chatTemperature;
      localStorage.setItem('notal_temperature', String(chatTemperature));
    });
  }

  if ($('clearAllChatsBtn')) {
    $('clearAllChatsBtn').addEventListener('click', () => {
      if (!chats.length) { toast('No chats to clear'); return; }
      if (confirm('Delete ALL chats? This cannot be undone.')) {
        chats = []; currentChatId = null; currentMessages = [];
        saveState(); renderChatHistory(); showLanding();
        toast('All chats cleared');
      }
    });
  }

  if ($('exportAllBtn')) {
    $('exportAllBtn').addEventListener('click', () => {
      if (!chats.length) { toast('No chats to export'); return; }
      let md = '# Notal AI - Chat Export\n\n';
      chats.forEach(c => {
        md += '## ' + (c.title || 'Chat') + '\n\n';
        (c.messages || []).forEach(m => { md += (m.role === 'user' ? '**You:** ' : '**Notal AI:** ') + (m.content || '') + '\n\n'; });
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }));
      a.download = 'notal-ai-chats.md';
      a.click();
      toast('All chats exported');
    });
  }

  if (userInput && $('charCounter')) {
    userInput.addEventListener('input', () => {
      const n = userInput.value.length;
      $('charCounter').textContent = n;
      $('charCounter').classList.toggle('warn', n > 3000);
    });
  }

  document.addEventListener('keydown', e => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); createNewChat(); toast('New chat created'); }
    else if (mod && e.key.toLowerCase() === 'b') { e.preventDefault(); toggleSidebar(); }
    else if (mod && e.key.toLowerCase() === 'e') { e.preventDefault(); if (settingsModal) { settingsModal.classList.toggle('hidden'); updateSettingsProfile(); } }
    else if (e.key === '/' && !e.target.matches('input, textarea')) { e.preventDefault(); if (userInput) userInput.focus(); }
  });

  function initGoogleSignIn() {
    if (window.google?.accounts?.id && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            try {
              const payload = JSON.parse(atob(response.credential.split('.')[1]));
              googleUser = {
                name: payload.name,
                picture: payload.picture,
                email: payload.email
              };
              localStorage.setItem('notal_google_user', JSON.stringify(googleUser));
              updateUserUI();
            } catch (e) {
              console.error('Google Sign-In error:', e);
            }
          }
        });
      } catch (e) {
        console.error('Google Sign-In init error:', e);
      }
    }
  }

  window.addEventListener('load', () => {
    setTimeout(initGoogleSignIn, 1000);
    loadState();
    if (userInput) userInput.focus();
  });
})();
