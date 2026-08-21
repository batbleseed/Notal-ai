(function () {
  "use strict";

  function isMobileOrPortrait() {
    return window.innerWidth <= 768 || (window.innerWidth <= 1024 && window.matchMedia("(orientation: portrait)").matches);
  }

  // ============================================================
  // Notal AI - hmmmd.js
  // PART 1/3
  // ============================================================

  const GOOGLE_CLIENT_ID =
    "524364273952-7gqtr9pdujlahhbt3b35p6p9be369gh0.apps.googleusercontent.com";

  // ============================================================
  // CONFIGURATION
  // ============================================================

  const CLOUDFLARE_WORKER_URL =
    "https://notal-ai-backend.hotfinixbrave.workers.dev/";

  const NOTAL_API_URL =
    CLOUDFLARE_WORKER_URL + "api/chat";

  // ============================================================
  // PROVIDERS
  // ============================================================

  const providers = [
    {
      id: "notalai-space",
      name: "Notal AI",
      baseUrl: NOTAL_API_URL,
      keyHint: "No API key needed (Built-in)",
      needsProxy: false,
      vision: false,
      imageGen: false
    },

    {
      id: "openrouter",
      name: "OpenRouter",
      baseUrl:
        "https://openrouter.ai/api/v1/chat/completions",
      keyHint: "sk-or-v1-...",
      needsProxy: false,
      vision: true,
      imageGen: true
    },

    {
      id: "deepseek",
      name: "DeepSeek",
      baseUrl:
        "https://api.deepseek.com/v1/chat/completions",
      keyHint: "sk-...",
      needsProxy: false,
      vision: false,
      imageGen: false
    },

    {
      id: "openai",
      name: "OpenAI",
      baseUrl:
        "https://api.openai.com/v1/chat/completions",
      keyHint: "sk-proj-...",
      needsProxy: true,
      vision: true,
      imageGen: true
    },

    {
      id: "google",
      name: "Google AI",
      baseUrl:
        "https://generativelanguage.googleapis.com/v1beta/models/",
      keyHint: "AIza...",
      needsProxy: true,
      vision: true,
      imageGen: false
    },

    {
      id: "tokenrouter",
      name: "TokenRouter",
      baseUrl:
        "https://api.tokenrouter.com/v1/chat/completions",
      keyHint: "sk-...",
      needsProxy: false,
      vision: true,
      imageGen: false
    }
  ];

  // ============================================================
  // MODELS
  // ============================================================

  const allModels = [
    {
      id: "notal-local",
      name: "Notal AI",
      provider: "notalai-space",
      icon: "fa-brain",
      badge: "Default",
      thinking: false,
      cost: "low",
      vision: false
    },

    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "openai",
      icon: "fa-brain",
      badge: "Vision",
      thinking: false,
      cost: "high",
      vision: true
    },

    {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
      provider: "openai",
      icon: "fa-bolt",
      badge: "Fast",
      thinking: false,
      cost: "low",
      vision: true
    },

    {
      id: "anthropic/claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      provider: "openrouter",
      icon: "fa-feather",
      badge: "Vision",
      thinking: true,
      cost: "high",
      vision: true
    },

    {
      id: "moonshotai/kimi-k3-free",
      name: "Kimi K3 Free",
      provider: "tokenrouter",
      icon: "fa-star",
      badge: "Latest",
      thinking: true,
      cost: "medium",
      vision: true
    },

    {
      id: "gemini-3.6-flash",
      name: "Gemini 3.6 Flash",
      provider: "google",
      icon: "fa-bolt",
      badge: "Latest",
      thinking: false,
      cost: "low",
      vision: true
    },

    {
      id: "gemini-3.5-flash",
      name: "Gemini 3.5 Flash",
      provider: "google",
      icon: "fa-bolt",
      badge: "Stable",
      thinking: false,
      cost: "low",
      vision: true
    },

    {
      id: "gemini-3.5-flash-lite",
      name: "Gemini 3.5 Flash-Lite",
      provider: "google",
      icon: "fa-bolt",
      badge: "Fast",
      thinking: false,
      cost: "low",
      vision: false
    },

    {
      id: "gemini-3.1-pro",
      name: "Gemini 3.1 Pro",
      provider: "google",
      icon: "fa-gem",
      badge: "Powerful",
      thinking: true,
      cost: "medium",
      vision: true
    },

    {
      id: "gemini-3.1-flash",
      name: "Gemini 3.1 Flash",
      provider: "google",
      icon: "fa-bolt",
      badge: "Fast",
      thinking: false,
      cost: "low",
      vision: true
    },

    {
      id: "deepseek-chat",
      name: "DeepSeek V3",
      provider: "deepseek",
      icon: "fa-search",
      badge: "Cheap",
      thinking: false,
      cost: "low",
      vision: false
    },

    {
      id: "deepseek-reasoner",
      name: "DeepSeek R1",
      provider: "deepseek",
      icon: "fa-brain",
      badge: "Reason",
      thinking: true,
      cost: "medium",
      vision: false
    },

    {
      id: "mistralai/mistral-large-2",
      name: "Mistral Large 2",
      provider: "openrouter",
      icon: "fa-feather",
      badge: "Smart",
      thinking: false,
      cost: "medium",
      vision: true
    },

    {
      id: "meta-llama/llama-3.2-90b-vision",
      name: "Llama 3.2 90B Vision",
      provider: "openrouter",
      icon: "fa-eye",
      badge: "Vision",
      thinking: false,
      cost: "medium",
      vision: true
    },

    {
      id: "meta-llama/llama-3.1-70b-instruct",
      name: "Llama 3.1 70B",
      provider: "openrouter",
      icon: "fa-brain",
      badge: "Open",
      thinking: false,
      cost: "medium",
      vision: false
    },

    {
      id: "dall-e-3",
      name: "DALL-E 3",
      provider: "openai",
      icon: "fa-paintbrush",
      badge: "Image Gen",
      thinking: false,
      cost: "high",
      imageGen: true
    },

    {
      id: "stabilityai/stable-diffusion-3.5",
      name: "SD 3.5",
      provider: "openrouter",
      icon: "fa-paintbrush",
      badge: "Image Gen",
      thinking: false,
      cost: "medium",
      imageGen: true
    }
  ];

  // ============================================================
  // STATE
  // ============================================================

  let keys = {};

  let currentModel =
    allModels.find(m => m.id === "notal-local") ||
    allModels[0];

  let chats = [];
  let currentChatId = null;
  let currentMessages = [];

  let isProcessing = false;

  let proxyEnabled = false;
  let proxyUrl = "";

  let previewEnabled = true;
  let systemPromptEnabled = true;

  let currentTheme = "default";

  let uploadedFiles = [];

  let googleUser = null;

  let sidebarOpen = true;

  let abortController = null;

  let isLanding = true;

  let previewContent = "";

  let previewObjectUrl = null;

  let thinkingContent = "";

  let streamAborted = false;

  let activeThinkId = null;

  let chatSearchQuery = "";

  let chatTemperature = parseFloat(
    localStorage.getItem("notal_temperature") || "0.7"
  );

  let speakingBtn = null;

  // ============================================================
  // DOM REFERENCES
  // ============================================================

  const $ = id =>
    document.getElementById(id);

  const messagesContainer =
    $("messagesContainer");

  const userInput =
    $("userInput");

  const sendBtn =
    $("sendBtn");

  const stopBtn =
    $("stopBtn");

  const modelTrigger =
    $("modelTrigger");

  const modelDropdown =
    $("modelDropdown");

  const selectedModelName =
    $("selectedModelName");

  const chatHistory =
    $("chatHistory");

  const sidebar =
    $("sidebar");

  const sidebarOverlay =
    $("sidebarOverlay");

  const mobilePreviewOverlay =
    $("mobilePreviewOverlay");

  const settingsModal =
    $("settingsModal");

  const connectionDot =
    $("connectionDot");

  const previewPanel =
    $("previewPanel");

  const previewFrame =
    $("previewFrame");

  const previewUrl =
    $("previewUrl");

  const fileUploadInput =
    $("fileUploadInput");

  const toggleSidebarBtn =
    $("toggleSidebarBtn");

  const signoutDropdown =
    $("signoutDropdown");

  // ============================================================
  // SAFE HTML
  // ============================================================

  function escapeHtml(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ============================================================
  // MARKDOWN
  // ============================================================

  function renderMarkdown(text) {

    let html =
      escapeHtml(text || "");

    html = html.replace(
      /```(\w*)\n?([\s\S]*?)```/g,
      (_, lang, code) => {

        const language =
          lang
            ? `<span class="code-language">${escapeHtml(lang)}</span>`
            : "";

        return `
          <div class="code-block-wrapper">
            ${language}
            <pre><code>${code.trim()}</code></pre>
          </div>
        `;
      }
    );

    html = html.replace(
      /`([^`]+)`/g,
      "<code>$1</code>"
    );

    html = html.replace(
      /\*\*(.+?)\*\*/g,
      "<strong>$1</strong>"
    );

    html = html.replace(
      /\*(.+?)\*/g,
      "<em>$1</em>"
    );

    html = html.replace(
      /^### (.+)$/gm,
      "<h3>$1</h3>"
    );

    html = html.replace(
      /^## (.+)$/gm,
      "<h2>$1</h2>"
    );

    html = html.replace(
      /^# (.+)$/gm,
      "<h1>$1</h1>"
    );

    html = html.replace(
      /^- (.+)$/gm,
      "<li>$1</li>"
    );

    html = html.replace(
      /(<li>.*<\/li>)/s,
      "<ul>$1</ul>"
    );

    html = html.replace(
      /^> (.+)$/gm,
      "<blockquote>$1</blockquote>"
    );

    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    html = html.replace(
      /\n/g,
      "<br>"
    );

    return html;
  }

  // ============================================================
  // STATE
  // ============================================================

  function loadState() {

    try {

      keys =
        JSON.parse(
          localStorage.getItem("notal_keys") ||
          "{}"
        );

      const savedModel =
        localStorage.getItem("notal_model");

      currentModel =
        allModels.find(
          m => m.id === savedModel
        ) ||
        allModels.find(
          m => m.id === "notal-local"
        ) ||
        allModels[0];

      chats =
        JSON.parse(
          localStorage.getItem("notal_chats") ||
          "[]"
        );

      currentChatId =
        localStorage.getItem(
          "notal_current_chat"
        ) || null;

      proxyEnabled =
        localStorage.getItem(
          "notal_proxy_enabled"
        ) === "true";

      proxyUrl =
        localStorage.getItem(
          "notal_proxy_url"
        ) || "";

      previewEnabled =
        localStorage.getItem(
          "notal_preview"
        ) !== "false";

      systemPromptEnabled =
        localStorage.getItem(
          "notal_system_prompt"
        ) !== "false";

      currentTheme =
        localStorage.getItem(
          "notal_theme"
        ) || "default";

      googleUser =
        JSON.parse(
          localStorage.getItem(
            "notal_google_user"
          ) || "null"
        );

      applyTheme(currentTheme);

      if ($("proxyToggle"))
        $("proxyToggle").checked =
          proxyEnabled;

      if ($("proxyUrlInput"))
        $("proxyUrlInput").value =
          proxyUrl;

      if ($("previewToggle"))
        $("previewToggle").checked =
          previewEnabled;

      if ($("systemPromptToggle"))
        $("systemPromptToggle").checked =
          systemPromptEnabled;

      updateConnectionUI();
      updateUserUI();

      initModelDropdown();
      updateModelTrigger();

      renderProviderCards();
      renderChatHistory();

      if (currentChatId) {

        loadChat(currentChatId);

        isLanding = false;

      } else if (chats.length) {

        loadChat(chats[0].id);

        isLanding = false;

      } else {

        showLanding();
      }

    } catch (error) {

      console.error(
        "LoadState error:",
        error
      );

      showLanding();
    }
  }

  function saveState() {

    try {

      localStorage.setItem(
        "notal_keys",
        JSON.stringify(keys)
      );

      localStorage.setItem(
        "notal_model",
        currentModel.id
      );

      localStorage.setItem(
        "notal_chats",
        JSON.stringify(chats)
      );

      if (currentChatId) {

        localStorage.setItem(
          "notal_current_chat",
          currentChatId
        );
      }

      localStorage.setItem(
        "notal_proxy_enabled",
        String(proxyEnabled)
      );

      localStorage.setItem(
        "notal_proxy_url",
        proxyUrl
      );

      localStorage.setItem(
        "notal_preview",
        String(previewEnabled)
      );

      localStorage.setItem(
        "notal_system_prompt",
        String(systemPromptEnabled)
      );

      localStorage.setItem(
        "notal_theme",
        currentTheme
      );

    } catch (error) {

      console.error(
        "SaveState error:",
        error
      );
    }
  }

  // ============================================================
  // CONNECTION
  // ============================================================

  function updateConnectionUI() {

    const hasKey =
      Object.values(keys)
        .some(k =>
          typeof k === "string" &&
          k.trim()
        );

    const notalSelected =
      currentModel?.provider ===
      "notalai-space";

    if (connectionDot) {

      connectionDot.classList.toggle(
        "connected",
        hasKey || notalSelected
      );

      connectionDot.title =
        hasKey || notalSelected
          ? "API connected"
          : "No API key";
    }
  }

  // ============================================================
  // USER UI
  // ============================================================

  function updateUserUI() {
    const signIn = $("sidebarGoogleSignin");
    const profile = $("sidebarUserProfile");
    const settingsName = $("settingsProfileName");
    const settingsAvatar = $("settingsProfileAvatar");
    const signInItem = $("profileSignInItem");
    const signOutItem = $("profileSignOutItem");

    if (googleUser && googleUser.name) {
      if (signIn) signIn.style.display = "none";
      if (profile) {
        profile.style.display = "flex";
        if ($("sidebarUserAvatar")) {
          $("sidebarUserAvatar").src = googleUser.picture || "";
        }
        if ($("sidebarUserName")) {
          $("sidebarUserName").textContent = googleUser.name || "User";
        }
      }
      if (settingsName) settingsName.textContent = googleUser.name;
      if (settingsAvatar) {
        if (googleUser.picture) {
          settingsAvatar.innerHTML = `<img src="${escapeHtml(googleUser.picture)}" alt="${escapeHtml(googleUser.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        } else {
          settingsAvatar.innerHTML = `<i class="fas fa-user"></i>`;
        }
      }
      if (signInItem) signInItem.innerHTML = `<i class="fas fa-user-pen"></i> Edit Profile`;
      if (signOutItem) signOutItem.style.display = "flex";
    } else {
      if (signIn) signIn.style.display = "block";
      if (profile) profile.style.display = "none";
      if (signoutDropdown) signoutDropdown.classList.remove("show");
      if (settingsName) settingsName.textContent = "Guest User";
      if (settingsAvatar) settingsAvatar.innerHTML = `<i class="fas fa-user"></i>`;
      if (signInItem) signInItem.innerHTML = `<i class="fas fa-user-plus"></i> Set Profile & Sign In`;
      if (signOutItem) signOutItem.style.display = "none";
    }
  }

  // ============================================================
  // THEME
  // ============================================================

  function applyTheme(theme) {

    document.body.className =
      theme === "dark"
        ? "theme-dark"
        : "";

    const themeVal = $("themeValue");
    if (themeVal) {
      themeVal.textContent = theme === "dark" ? "Dark" : "Light";
    }

    const themeIcon = document.querySelector("#themeRow .settings-row-icon i");
    if (themeIcon) {
      themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
    }

    document
      .querySelectorAll(".theme-btn")
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.theme === theme
        );
      });
  }

  // ============================================================
  // API CONFIGURATION
  // IMPORTANT:
  // This function exists BEFORE handleSend().
  // ============================================================

  function getApiConfig() {

    if (
      currentModel &&
      currentModel.provider ===
        "notalai-space"
    ) {

      return {

        useGradio: true,

        provider:
          "notalai-space",

        url:
          NOTAL_API_URL,

        headers: {
          "Content-Type":
            "application/json"
        },

        apiKey: null
      };
    }

    const provider =
      providers.find(
        p =>
          p.id ===
          currentModel.provider
      );

    if (!provider) {
      return null;
    }

    const apiKey =
      keys[currentModel.provider];

    if (
      !apiKey ||
      !apiKey.trim()
    ) {
      return null;
    }

    let url =
      provider.baseUrl;

    if (
      proxyEnabled &&
      proxyUrl &&
      provider.needsProxy
    ) {
      url = proxyUrl;
    }

    return {

      useGradio: false,

      provider:
        currentModel.provider,

      url,

      headers: {
        "Content-Type":
          "application/json",

        "Authorization":
          `Bearer ${apiKey}`
      },

      apiKey
    };
  }

  // ============================================================
  // CLOUDFLARE / NOTAL AI API
  // ============================================================

  async function callGradioSpace(
    messages,
    signal
  ) {

    const payload = {

      messages,

      message:
        messages.length
          ? messages[messages.length - 1]
              .content || ""
          : "",

      history:
        messages.slice(
          0,
          -1
        ),

      model:
        currentModel?.id ||
        "notal-local"
    };

    const response =
      await fetch(
        NOTAL_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(payload),

          signal
        }
      );

    const raw =
      await response.text();

    let data = {};

    try {

      data =
        raw
          ? JSON.parse(raw)
          : {};

    } catch {

      throw new Error(
        `Invalid server response: ${raw.substring(
          0,
          300
        )}`
      );
    }

    if (!response.ok) {

      throw new Error(
        data.error ||
        data.detail ||
        `HTTP ${response.status}`
      );
    }

    const answer =
      data.response ||
      data.content ||
      data.message ||
      data.output ||
      data.choices?.[0]?.message?.content;

    if (!answer) {

      throw new Error(
        "Notal AI returned no response."
      );
    }

    return {
      content: answer,
      thinking:
        data.thinking ||
        data.reasoning ||
        data.choices?.[0]?.message?.reasoning ||
        null
    };
  }

  // ============================================================
  // MODEL DROPDOWN
  // ============================================================

  function initModelDropdown() {

    if (!modelDropdown) return;

    // Filter models: Notal AI is always visible.
    // For other providers, only show models if keys[model.provider] is filled and not empty.
    const visibleModels = allModels.filter(model => {
      if (model.provider === "notalai-space") return true;
      const providerKey = keys[model.provider];
      return typeof providerKey === "string" && providerKey.trim().length > 0;
    });

    // If current model became hidden, fallback to Notal AI
    if (!visibleModels.some(m => m.id === currentModel?.id)) {
      currentModel =
        allModels.find(m => m.id === "notal-local") ||
        allModels[0];
      updateModelTrigger();
      saveState();
    }

    const groups = {};

    visibleModels.forEach(model => {

      const type =
        model.imageGen
          ? "Image Generation"
          : model.vision
            ? "Vision & Text"
            : "Text";

      const key =
        `${model.provider}-${type}`;

      if (!groups[key]) {

        const provObj = providers.find(p => p.id === model.provider);

        groups[key] = {
          provider:
            model.provider,
          providerName: provObj ? provObj.name : model.provider,
          type,
          models: []
        };
      }

      groups[key].models.push(
        model
      );
    });

    modelDropdown.innerHTML =
      `<div class="model-dropdown-header">
        <span>Select AI Model</span>
        <span style="font-size:0.62rem;color:var(--text2);text-transform:none;font-weight:500;">${visibleModels.length} active</span>
      </div>`;

    Object.values(groups)
      .forEach(group => {

        const label =
          document.createElement("div");

        label.style.cssText =
          "padding:.35rem .8rem;" +
          "font-size:.62rem;" +
          "font-weight:700;" +
          "color:var(--text2);" +
          "text-transform:uppercase;" +
          "letter-spacing:0.04em;" +
          "background:var(--bg2);" +
          "border-bottom:1px solid var(--border);";

        label.textContent =
          `${group.providerName} • ${group.type}`;

        modelDropdown.appendChild(
          label
        );

        group.models.forEach(
          model => {

            const option =
              document.createElement(
                "div"
              );

            option.className =
              "model-option " +
              (
                model.id ===
                currentModel.id
                  ? "selected"
                  : ""
              );

            const costIcon =
              model.cost === "low"
                ? "🟢"
                : model.cost === "medium"
                  ? "🟡"
                  : "🔴";

            const typeIcon =
              model.imageGen
                ? "🎨"
                : model.vision
                  ? "👁️"
                  : "💬";

            option.innerHTML = `
              <i
                class="fas ${model.icon}"
                style="width:1.2rem;color:var(--accent);"
              ></i>

              <span style="font-weight:600;font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${escapeHtml(model.name)}
              </span>

              ${model.badge ? `
                <span
                  style="
                    font-size:.56rem;
                    background:var(--bg2);
                    color:var(--text);
                    border:1px solid var(--border);
                    padding:.1rem .4rem;
                    border-radius:.8rem;
                    margin-left:.4rem;
                    font-weight:600;
                  "
                >
                  ${escapeHtml(model.badge)}
                </span>
              ` : ""}

              <span
                style="
                  margin-left:auto;
                  font-size:.65rem;
                "
              >
                ${typeIcon}
              </span>

              ${
                model.id === currentModel.id
                  ? '<i class="fas fa-check" style="margin-left:.35rem;color:var(--accent);font-size:0.75rem;"></i>'
                  : ""
              }
            `;

            option.addEventListener(
              "click",
              (e) => {
                e.stopPropagation();

                currentModel =
                  model;

                updateModelTrigger();
                initModelDropdown();

                if (modelDropdown)
                  modelDropdown.classList.remove(
                    "show"
                  );

                updateConnectionUI();
                saveState();
              }
            );

            modelDropdown.appendChild(
              option
            );
          }
        );
      });

    // Settings & API Keys Button inside Model Dropdown
    const settingsBtn = document.createElement("button");
    settingsBtn.type = "button";
    settingsBtn.className = "model-dropdown-settings-action";
    settingsBtn.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;width:100%;">
        <i class="fas fa-sliders" style="color:var(--accent);font-size:0.85rem;"></i>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;font-size:0.78rem;color:var(--text);">Settings & API Keys</div>
          <div style="font-size:0.65rem;color:var(--text2);">Configure provider keys to unlock more models</div>
        </div>
        <i class="fas fa-chevron-right" style="font-size:0.65rem;color:var(--text2);margin-left:auto;"></i>
      </div>
    `;
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (modelDropdown) modelDropdown.classList.remove("show");
      renderProviderCards();
      if (settingsModal) settingsModal.classList.remove("hidden");
    });
    modelDropdown.appendChild(settingsBtn);
  }

  function updateModelTrigger() {

    if (!selectedModelName)
      return;

    const icon =
      currentModel.imageGen
        ? "🎨"
        : currentModel.vision
          ? "👁️"
          : "⧩";

    selectedModelName.textContent =
      `${icon} ${currentModel.name}`;
  }

  // ============================================================
  // LANDING
  // ============================================================

  function showLanding() {

    if (!messagesContainer)
      return;

    isLanding = true;

    messagesContainer.innerHTML = `
      <div class="landing-screen">

        <div class="landing-logo">
          ⧩
        </div>

        <div class="landing-title">
          What can I help with?
        </div>

        <div class="landing-subtitle">
          Ask anything, upload images,
          generate art, or browse the web
        </div>

        <div class="suggestions">

          <div
            class="suggestion-card"
            data-prompt="Generate an image of a futuristic city"
          >
            <div class="s-icon">🎨</div>
            <div class="s-title">
              Generate Image
            </div>
          </div>

          <div
            class="suggestion-card"
            data-prompt="Browse https://example.com and summarize"
          >
            <div class="s-icon">🌐</div>
            <div class="s-title">
              Browse Web
            </div>
          </div>

          <div
            class="suggestion-card"
            data-prompt="What's in this image?"
          >
            <div class="s-icon">👁️</div>
            <div class="s-title">
              Vision
            </div>
          </div>

          <div
            class="suggestion-card"
            data-prompt="Write a Python function to sort a list"
          >
            <div class="s-icon">💻</div>
            <div class="s-title">
              Write Code
            </div>
          </div>

        </div>
      </div>
    `;

    messagesContainer
      .querySelectorAll(
        ".suggestion-card"
      )
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            if (userInput) {

              userInput.value =
                card.dataset.prompt;

              userInput.focus();

              userInput.dispatchEvent(
                new Event("input")
              );
            }
          }
        );
      });

    messagesContainer.scrollTop = 0;
  }

  // ============================================================
  // CHAT CREATION
  // ============================================================

  function createNewChat() {

    const chat = {

      id:
        Date.now().toString(),

      title:
        "New Chat",

      messages: [],

      pinned: false
    };

    chats.unshift(chat);

    currentChatId =
      chat.id;

    currentMessages = [];

    saveState();
    renderChatHistory();
    showLanding();

    if (
      isMobileOrPortrait()
    ) {
      closeMobileSidebar();
    }
  }

  // ============================================================
  // LOAD CHAT
  // ============================================================

  function loadChat(id) {

    const chat =
      chats.find(
        c => c.id === id
      );

    if (!chat) return;

    currentChatId =
      id;

    currentMessages =
      Array.isArray(chat.messages)
        ? chat.messages
        : [];

    isLanding = false;

    renderMessages();
    renderChatHistory();
    saveState();

    if (
      isMobileOrPortrait()
    ) {
      closeMobileSidebar();
    }
  }

  // ============================================================
  // DELETE CHAT
  // ============================================================

  function deleteChat(id) {

    chats =
      chats.filter(
        c => c.id !== id
      );

    if (
      currentChatId === id
    ) {

      currentChatId =
        chats[0]?.id ||
        null;

      currentMessages = [];

      if (currentChatId) {

        loadChat(
          currentChatId
        );

      } else {

        showLanding();
      }
    }

    saveState();
    renderChatHistory();
  }

  // ============================================================
  // CHAT HISTORY
  // ============================================================

  function renderChatHistory() {

    const chatCountBadge = $("chatCountBadge");
    if (chatCountBadge) {
      chatCountBadge.textContent = String(chats.length);
    }

    if (!chatHistory)
      return;

    let list = chats;

    if (chatSearchQuery) {

      list =
        chats.filter(
          chat =>
            (chat.title || "")
              .toLowerCase()
              .includes(
                chatSearchQuery
              )
        );
    }

    const pinned =
      list.filter(
        c => c.pinned
      );

    const rest =
      list.filter(
        c => !c.pinned
      );

    const itemHtml =
      chat => `

        <div
          class="history-item ${
            chat.id === currentChatId
              ? "active"
              : ""
          }"
          data-id="${escapeHtml(chat.id)}"
        >

          <span class="history-item-title">
            ${
              chat.pinned
                ? "📌 "
                : ""
            }

            ${escapeHtml(
              chat.title || "Chat"
            )}
          </span>

          <div class="history-item-actions">

            <button
              class="history-action-btn pin"
              data-id="${escapeHtml(chat.id)}"
              title="Pin"
            >
              <i class="fas fa-thumbtack"></i>
            </button>

            <button
              class="history-action-btn ren"
              data-id="${escapeHtml(chat.id)}"
              title="Rename"
            >
              <i class="fas fa-pen"></i>
            </button>

            <button
              class="history-action-btn exp"
              data-id="${escapeHtml(chat.id)}"
              title="Export"
            >
              <i class="fas fa-download"></i>
            </button>

            <button
              class="history-action-btn del"
              data-id="${escapeHtml(chat.id)}"
              title="Delete"
            >
              <i class="fas fa-trash"></i>
            </button>

          </div>
        </div>
      `;

    let html = "";

    if (pinned.length) {

      html +=
        `<div class="history-section-label">
          Pinned
        </div>` +
        pinned
          .map(itemHtml)
          .join("");
    }

    if (rest.length) {

      html +=
        (
          pinned.length
            ? `<div class="history-section-label">
                 Recent
               </div>`
            : ""
        ) +
        rest
          .map(itemHtml)
          .join("");
    }

    chatHistory.innerHTML =
      html ||
      `
        <div
          style="
            padding:1rem;
            text-align:center;
            color:var(--text2);
            font-size:.75rem;
          "
        >
          ${
            chatSearchQuery
              ? "No results"
              : "No chats"
          }
        </div>
      `;

    chatHistory
      .querySelectorAll(
        ".history-item"
      )
      .forEach(item => {

        item.addEventListener(
          "click",
          event => {

            if (
              !event.target.closest(
                "button"
              )
            ) {
              loadChat(
                item.dataset.id
              );
            }
          }
        );

        item
          .querySelector(".del")
          ?.addEventListener(
            "click",
            event => {

              event.stopPropagation();

              if (
                confirm(
                  "Delete this chat?"
                )
              ) {
                deleteChat(
                  item.dataset.id
                );
              }
            }
          );

        item
          .querySelector(".ren")
          ?.addEventListener(
            "click",
            event => {

              event.stopPropagation();

              renameChat(
                item.dataset.id
              );
            }
          );

        item
          .querySelector(".pin")
          ?.addEventListener(
            "click",
            event => {

              event.stopPropagation();

              togglePinChat(
                item.dataset.id
              );
            }
          );

        item
          .querySelector(".exp")
          ?.addEventListener(
            "click",
            event => {

              event.stopPropagation();

              exportChat(
                item.dataset.id
              );
            }
          );
      });
  }

  // ============================================================
  // RENDER MESSAGES
  // ============================================================

  function renderMessages() {

    if (!messagesContainer)
      return;

    messagesContainer.innerHTML = "";

    currentMessages.forEach(
      message => {

        if (!message.content)
          return;

        appendMsg(
          message.content,
          message.role === "user",
          message.thinking,
          message.files,
          message.imageGen,
          message.ts
        );
      }
    );

    scrollToBottom();
  }

  function scrollToBottom() {

    if (messagesContainer) {

      messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
    }
  }

  // ============================================================
  // MINI BROWSER
  // ============================================================

  function createMiniBrowser(url) {

    const container =
      document.createElement("div");

    container.className =
      "browser-container";

    const safeUrl =
      escapeHtml(url);

    container.innerHTML = `

      <div class="browser-toolbar">

        <button class="browser-back">
          <i class="fas fa-arrow-left"></i>
        </button>

        <button class="browser-forward">
          <i class="fas fa-arrow-right"></i>
        </button>

        <button class="browser-refresh">
          <i class="fas fa-redo"></i>
        </button>

        <input
          class="browser-url"
          value="${safeUrl}"
          placeholder="Enter URL..."
        >

        <button class="browser-go">
          <i class="fas fa-arrow-right"></i>
        </button>

      </div>

      <iframe
        class="browser-iframe"
        src="${safeUrl}"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
      ></iframe>
    `;

    const iframe =
      container.querySelector(
        ".browser-iframe"
      );

    const urlInput =
      container.querySelector(
        ".browser-url"
      );

    container
      .querySelector(".browser-go")
      .addEventListener(
        "click",
        () => {

          let value =
            urlInput.value.trim();

          if (
            !value.startsWith(
              "http://"
            ) &&
            !value.startsWith(
              "https://"
            )
          ) {
            value =
              "https://" +
              value;
          }

          iframe.src =
            value;
        }
      );

    urlInput.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        ) {
          container
            .querySelector(
              ".browser-go"
            )
            .click();
        }
      }
    );

    container
      .querySelector(
        ".browser-refresh"
      )
      .addEventListener(
        "click",
        () => {

          iframe.src =
            iframe.src;
        }
      );

    container
      .querySelector(
        ".browser-back"
      )
      .addEventListener(
        "click",
        () => {

          try {
            iframe.contentWindow
              ?.history
              ?.back();
          } catch {}
        }
      );

    container
      .querySelector(
        ".browser-forward"
      )
      .addEventListener(
        "click",
        () => {

          try {
            iframe.contentWindow
              ?.history
              ?.forward();
          } catch {}
        }
      );

    return container;
  }  // ============================================================
  // PART 2/3
  // ============================================================

  // ============================================================
  // APPEND MESSAGE
  // ============================================================

  function appendMsg(
    content,
    isUser,
    thinking = null,
    attachedFiles = null,
    imageGen = null,
    ts = null
  ) {

    if (!messagesContainer)
      return;

    const row =
      document.createElement("div");

    row.className =
      `message-row ${
        isUser
          ? "user-row"
          : ""
      }`;

    if (!isUser) {

      let thinkingHtml = "";

      if (thinking) {

        const thinkId =
          "think-" +
          Date.now() +
          "-" +
          Math.random()
            .toString(36)
            .slice(2);

        thinkingHtml = `

          <button
            class="thinking-toggle-btn"
            onclick="
              document
                .getElementById('${thinkId}')
                .classList
                .toggle('visible')
            "
          >
            <i class="fas fa-brain"></i>
            View thinking
          </button>

          <div
            class="thinking-content"
            id="${thinkId}"
          >
            ${escapeHtml(thinking)}
          </div>
        `;
      }

      let extraContent = "";

      if (imageGen) {

        extraContent =
          `
            <div class="image-loading">
              <i class="fas fa-spinner"></i>
              Generating image...
            </div>
          `;
      }

      let displayContent =
        content || "";

      if (
        displayContent.includes(
          "[BROWSER]"
        )
      ) {

        const match =
          displayContent.match(
            /\[BROWSER\](.*?)\[\/BROWSER\]/
          );

        if (match) {

          const browser =
            createMiniBrowser(
              match[1]
            );

          extraContent +=
            browser.outerHTML;

          displayContent =
            displayContent.replace(
              /\[BROWSER\].*?\[\/BROWSER\]/,
              "🌐 Browser opened"
            );
        }
      }

      const html =
        renderMarkdown(
          displayContent
        );

      const timeStr =
        ts
          ? new Date(ts)
              .toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit"
                }
              )
          : "";

      const actions = `

        <div class="msg-actions">

          <button
            class="msg-action-btn"
            data-action="copy"
            title="Copy"
          >
            <i class="fas fa-copy"></i>
          </button>

          <button
            class="msg-action-btn"
            data-action="regen"
            title="Regenerate"
          >
            <i class="fas fa-rotate-right"></i>
          </button>

          <button
            class="msg-action-btn"
            data-action="speak"
            title="Read aloud"
          >
            <i class="fas fa-volume-high"></i>
          </button>

          <button
            class="msg-action-btn"
            data-action="like"
            title="Good response"
          >
            <i class="fas fa-thumbs-up"></i>
          </button>

          <button
            class="msg-action-btn"
            data-action="dislike"
            title="Bad response"
          >
            <i class="fas fa-thumbs-down"></i>
          </button>

          <span class="msg-time">
            ${timeStr}
          </span>

        </div>
      `;

      row.innerHTML = `

        <div class="message-avatar ai-avatar">
          ⧩
        </div>

        <div class="message-content">

          ${thinkingHtml}

          <div
            class="message-bubble ai-bubble"
          >
            ${html}
            ${extraContent}
          </div>

          ${actions}

        </div>
      `;

    } else {

      let fileHtml = "";

      if (
        attachedFiles &&
        attachedFiles.length
      ) {

        fileHtml =
          `<div class="upload-preview">`;

        attachedFiles.forEach(
          file => {

            if (
              file.type?.startsWith(
                "image/"
              )
            ) {

              fileHtml += `
                <img
                  src="${escapeHtml(file.data)}"
                  alt="${escapeHtml(file.name)}"
                >
              `;

            } else {

              fileHtml += `
                <span class="file-tag">
                  <i class="fas fa-file"></i>
                  ${escapeHtml(file.name)}
                </span>
              `;
            }
          }
        );

        fileHtml +=
          "</div>";
      }

      const avatar =
        googleUser?.picture
          ? `
            <img
              src="${escapeHtml(
                googleUser.picture
              )}"
              alt="U"
            >
          `
          : `
            <i class="fas fa-user"></i>
          `;

      const timeStr =
        ts
          ? new Date(ts)
              .toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit"
                }
              )
          : "";

      row.innerHTML = `

        <div class="message-content">

          <div class="message-bubble user-bubble">
            ${escapeHtml(content)}
          </div>

          ${fileHtml}

          <div class="msg-actions">

            <button
              class="msg-action-btn"
              data-action="edit"
              title="Edit & resend"
            >
              <i class="fas fa-pen"></i>
            </button>

            <button
              class="msg-action-btn"
              data-action="copy"
              title="Copy"
            >
              <i class="fas fa-copy"></i>
            </button>

            <span class="msg-time">
              ${timeStr}
            </span>

          </div>

        </div>

        <div class="message-avatar user-avatar">
          ${avatar}
        </div>
      `;
    }

    messagesContainer.appendChild(
      row
    );

    if (!isUser) {
      addCodeActions(row);
    }

    scrollToBottom();
  }

  // ============================================================
  // CODE ACTIONS
  // ============================================================

  function addCodeActions(container) {

    if (!container)
      return;

    container
      .querySelectorAll(
        ".code-block-wrapper"
      )
      .forEach(wrapper => {

        if (
          wrapper.querySelector(
            ".code-actions"
          )
        ) {
          return;
        }

        const code =
          wrapper.querySelector(
            "code"
          );

        if (!code)
          return;

        const actions =
          document.createElement(
            "div"
          );

        actions.className =
          "code-actions";

        const copy =
          document.createElement(
            "button"
          );

        copy.innerHTML =
          '<i class="fas fa-copy"></i>';

        copy.addEventListener(
          "click",
          () => {

            navigator.clipboard
              .writeText(
                code.textContent
              )
              .then(() => {

                copy.innerHTML =
                  '<i class="fas fa-check"></i>';

                copy.classList.add(
                  "copied"
                );

                setTimeout(
                  () => {

                    copy.innerHTML =
                      '<i class="fas fa-copy"></i>';

                    copy.classList.remove(
                      "copied"
                    );
                  },
                  2000
                );

              })
              .catch(() => {
                toast(
                  "Copy failed"
                );
              });
          }
        );

        actions.appendChild(
          copy
        );

        const text =
          code.textContent
            .trim();

        if (
          previewEnabled &&
          (
            text.startsWith(
              "<!doctype"
            ) ||
            text.startsWith(
              "<html"
            ) ||
            text.includes(
              "<body"
            )
          )
        ) {

          const previewButton =
            document.createElement(
              "button"
            );

          previewButton.className =
            "run-btn";

          previewButton.innerHTML =
            `
              <i class="fas fa-play"></i>
              <span>Preview</span>
            `;

          previewButton.addEventListener(
            "click",
            () => {
              openPreview(
                text,
                "index.html"
              );
            }
          );

          actions.appendChild(
            previewButton
          );
        }

        wrapper.appendChild(
          actions
        );
      });
  }

  // ============================================================
  // PREVIEW
  // ============================================================

  function buildPreviewDocument(
    content
  ) {

    const bridge = `
      <script>
      (function () {

        const send = function (
          type,
          args
        ) {

          try {

            parent.postMessage(
              {
                source:
                  "notal-preview",

                type,

                args:
                  Array
                    .from(args)
                    .map(function (value) {

                      try {

                        return typeof value ===
                          "string"
                          ? value
                          : JSON.stringify(
                              value
                            );

                      } catch {

                        return String(
                          value
                        );
                      }

                    })
              },
              "*"
            );

          } catch {}
        };

        ["log","info","warn","error","debug"]
          .forEach(function (key) {

            const old =
              console[key];

            console[key] =
              function () {

                send(
                  key,
                  arguments
                );

                old.apply(
                  console,
                  arguments
                );
              };
          });

        window.addEventListener(
          "error",
          function (event) {

            send(
              "error",
              [
                event.message +
                " @ " +
                event.filename +
                ":" +
                event.lineno
              ]
            );
          }
        );

        window.addEventListener(
          "unhandledrejection",
          function (event) {

            send(
              "error",
              [
                "Unhandled promise rejection: " +
                event.reason
              ]
            );
          }
        );

        window.addEventListener(
          "load",
          function () {

            send(
              "info",
              ["Preview loaded"]
            );
          }
        );

      })();
      </script>
    `;

    if (
      /<head[\s>]/i.test(
        content
      )
    ) {

      return content.replace(
        /<head(\s[^>]*)?>/i,
        match =>
          match +
          bridge
      );
    }

    return `
      <!doctype html>

      <html>

      <head>

        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        >

        ${bridge}

      </head>

      <body>

        ${content}

      </body>

      </html>
    `;
  }

  function openPreview(
    content,
    filename = "index.html"
  ) {

    previewContent =
      content;

    window.__notalPreviewContent =
      content;

    if (previewPanel) {
      previewPanel.classList.add(
        "visible"
      );
    }

    if (
      isMobileOrPortrait() &&
      mobilePreviewOverlay
    ) {

      mobilePreviewOverlay.classList.add(
        "active"
      );
    }

    if (previewUrl) {
      previewUrl.textContent =
        filename;
    }

    clearPreviewConsole();

    if (previewObjectUrl) {

      URL.revokeObjectURL(
        previewObjectUrl
      );
    }

    const fullDocument =
      buildPreviewDocument(
        content
      );

    previewObjectUrl =
      URL.createObjectURL(
        new Blob(
          [fullDocument],
          {
            type: "text/html"
          }
        )
      );

    if (previewFrame) {

      previewFrame.src =
        previewObjectUrl;
    }

    const status =
      $("previewStatus");

    if (status) {

      status.textContent =
        "Running";

      status.className =
        "preview-status live";
    }
  }

  function clearPreviewConsole() {

    const body =
      $("previewConsoleBody");

    if (body) {

      body.innerHTML =
        `
          <div class="console-empty">
            Console output will appear here.
          </div>
        `;
    }

    const count =
      $("previewConsoleCount");

    if (count) {
      count.textContent =
        "0";
    }
  }

  window.addEventListener(
    "message",
    event => {

      if (
        !event.data ||
        event.data.source !==
          "notal-preview"
      ) {
        return;
      }

      const body =
        $("previewConsoleBody");

      if (!body)
        return;

      const empty =
        body.querySelector(
          ".console-empty"
        );

      if (empty)
        empty.remove();

      const line =
        document.createElement(
          "div"
        );

      line.className =
        `console-line ${
          event.data.type || "log"
        }`;

      line.textContent =
        `[${event.data.type || "log"}] ` +
        (
          event.data.args || []
        ).join(" ");

      body.appendChild(
        line
      );

      const count =
        $("previewConsoleCount");

      if (count) {

        count.textContent =
          body.querySelectorAll(
            ".console-line"
          ).length;
      }

      body.scrollTop =
        body.scrollHeight;
    }
  );

  // ============================================================
  // SAVE CURRENT CHAT
  // ============================================================

  function saveCurrentChat() {

    const chat =
      chats.find(
        c =>
          c.id ===
          currentChatId
      );

    if (!chat)
      return;

    chat.messages =
      [...currentMessages];

    if (
      chat.title ===
        "New Chat" &&
      currentMessages.length
    ) {

      const firstUser =
        currentMessages.find(
          m =>
            m.role === "user"
        );

      if (firstUser) {

        const title =
          String(
            firstUser.content ||
            "New Chat"
          );

        chat.title =
          title.substring(
            0,
            30
          ) +
          (
            title.length > 30
              ? "..."
              : ""
          );
      }
    }

    saveState();
    renderChatHistory();
  }

  // ============================================================
  // SIDEBAR
  // ============================================================

  function closeSidebar() {

    if (sidebar) {

      sidebar.classList.add(
        "closed"
      );

      sidebar.classList.remove(
        "open"
      );
    }

    if (sidebarOverlay) {

      sidebarOverlay.classList.remove(
        "active"
      );
    }

    sidebarOpen =
      false;
    document.body.classList.remove("sidebar-open");
    document.body.classList.add("sidebar-closed");

    if (
      !isMobileOrPortrait() &&
      toggleSidebarBtn
    ) {

      toggleSidebarBtn.style.display =
        "flex";
    }

    localStorage.setItem(
      "notal_sidebar_open",
      "false"
    );
  }

  function openSidebar() {

    if (sidebar) {

      sidebar.classList.remove(
        "closed"
      );
    }

    sidebarOpen =
      true;
    document.body.classList.add("sidebar-open");
    document.body.classList.remove("sidebar-closed");

    if (toggleSidebarBtn) {

      toggleSidebarBtn.style.display =
        "none";
    }

    if (
      isMobileOrPortrait()
    ) {

      if (sidebar) {

        sidebar.classList.add(
          "open"
        );
      }

      if (sidebarOverlay) {

        sidebarOverlay.classList.add(
          "active"
        );
      }
    }

    localStorage.setItem(
      "notal_sidebar_open",
      "true"
    );
  }

  function toggleSidebar() {

    if (
      sidebar &&
      (
        sidebar.classList.contains(
          "closed"
        ) ||
        (
          isMobileOrPortrait() &&
          !sidebar.classList.contains(
            "open"
          )
        )
      )
    ) {

      openSidebar();

    } else {

      closeSidebar();
    }
  }

  function closeMobileSidebar() {

    if (sidebar) {

      sidebar.classList.remove(
        "open"
      );
    }

    if (sidebarOverlay) {

      sidebarOverlay.classList.remove(
        "active"
      );
    }
  }

  // ============================================================
  // FILE UPLOADS
  // ============================================================

  if ($("uploadBtn")) {

    $("uploadBtn")
      .addEventListener(
        "click",
        () => {

          if (fileUploadInput) {

            fileUploadInput.click();
          }
        }
      );
  }

  if (fileUploadInput) {

    fileUploadInput
      .addEventListener(
        "change",
        () => {

          const files =
            Array.from(
              fileUploadInput.files ||
              []
            );

          if (!files.length)
            return;

          let completed = 0;

          files.forEach(
            file => {

              const reader =
                new FileReader();

              reader.onload = () => {

                uploadedFiles.push({

                  id:
                    Date.now() +
                    Math.random(),

                  name:
                    file.name,

                  type:
                    file.type,

                  data:
                    reader.result,

                  size:
                    file.size,

                  content:
                    reader.result
                });

                completed++;

                if (
                  completed ===
                  files.length
                ) {

                  const notification =
                    document.createElement(
                      "div"
                    );

                  notification.style.cssText =
                    `
                      position:fixed;
                      bottom:70px;
                      right:20px;
                      background:var(--accent);
                      color:var(--bg);
                      padding:.4rem .8rem;
                      border-radius:1rem;
                      font-size:.8rem;
                      z-index:9999;
                    `;

                  notification.textContent =
                    `📎 ${files.length} file(s) uploaded`;

                  document.body.appendChild(
                    notification
                  );

                  setTimeout(
                    () => {
                      notification.remove();
                    },
                    2000
                  );
                }
              };

              if (
                file.type.startsWith(
                  "image/"
                )
              ) {

                reader.readAsDataURL(
                  file
                );

              } else {

                reader.readAsText(
                  file
                );
              }
            }
          );

          fileUploadInput.value =
            "";
        }
      );
  }

  // ============================================================
  // THINKING UI
  // ============================================================

  function finalizeThinkingUI(
    thinkId,
    keepContent
  ) {

    const button =
      document.getElementById(
        "thinkBtn-" +
        thinkId
      );

    const element =
      document.getElementById(
        thinkId
      );

    if (button) {

      if (keepContent) {

        button.innerHTML =
          `
            <i class="fas fa-brain"></i>
            View thinking
          `;

        button.classList.remove(
          "active"
        );

      } else {

        button.remove();
      }
    }

    if (element) {

      element.classList.remove(
        "streaming"
      );

      if (!keepContent) {
        element.remove();
      }
    }
  }

  // ============================================================
  // STREAM TEXT
  // ============================================================

  function streamText(
    element,
    content,
    thinkingElement = null
  ) {

    let index = 0;

    let fullText = "";

    const chars =
      String(content || "")
        .split("");

    function renderCurrent() {

      element.innerHTML =
        renderMarkdown(
          fullText
        );

      addCodeActions(
        element.closest(
          ".message-row"
        )
      );

      if (
        thinkingElement &&
        thinkingContent
      ) {

        thinkingElement.textContent =
          thinkingContent;

        thinkingElement.classList.add(
          "streaming"
        );
      }

      scrollToBottom();
    }

    function streamChar() {

      if (streamAborted) {

        fullText =
          String(content || "");

        renderCurrent();

        if (thinkingElement) {

          thinkingElement.classList.remove(
            "streaming"
          );
        }

        return;
      }

      if (
        index <
        chars.length
      ) {

        fullText +=
          chars[index];

        index++;

        renderCurrent();

        setTimeout(
          streamChar,
          2 +
            Math.random() * 3
        );

      } else {

        renderCurrent();

        if (thinkingElement) {

          thinkingElement.classList.remove(
            "streaming"
          );
        }
      }
    }

    streamChar();
  }

  // ============================================================
  // THINKING BUTTON
  // ============================================================

  function createThinkingUI(
    thinkId
  ) {

    return `

      <button
        class="thinking-toggle-btn"
        id="thinkBtn-${thinkId}"
        onclick="
          document
            .getElementById('${thinkId}')
            .classList
            .toggle('visible')
        "
      >
        <i class="fas fa-brain"></i>

        <span class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </span>

        Thinking...
      </button>

      <div
        class="thinking-content"
        id="${thinkId}"
      ></div>
    `;
  }

  // ============================================================
  // CREATE STREAMING ROW
  // ============================================================

  function createStreamingRow() {

    const row =
      document.createElement(
        "div"
      );

    row.className =
      "message-row";

    const bubbleId =
      "stream-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2);

    const thinkId =
      "think-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2);

    row.dataset.bubbleId =
      bubbleId;

    row.dataset.thinkId =
      thinkId;

    row.innerHTML = `

      <div class="message-avatar ai-avatar">
        ⧩
      </div>

      <div class="message-content">

        ${createThinkingUI(
          thinkId
        )}

        <div
          class="message-bubble ai-bubble"
          id="${bubbleId}"
        ></div>

      </div>
    `;

    if (messagesContainer) {

      messagesContainer.appendChild(
        row
      );

      scrollToBottom();
    }

    return {
      row,
      bubbleId,
      thinkId
    };
  }

  // ============================================================
  // IMAGE GENERATION PLACEHOLDER
  // ============================================================

  async function handleImageGeneration(
    text,
    bubbleId
  ) {

    const bubble =
      document.getElementById(
        bubbleId
      );

    if (bubble) {

      bubble.innerHTML = `
        <div class="image-loading">
          <i class="fas fa-spinner fa-spin"></i>
          Generating image...
        </div>
      `;
    }

    /*
      Image generation is intentionally not
      performed through the Notal /api/chat
      text endpoint.

      If you later add an image endpoint,
      implement it here.
    */

    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          500
        )
    );

    const message =
      "🎨 Image generation is not connected to the Notal AI `/api/chat` text endpoint yet.";

    if (bubble) {

      bubble.innerHTML =
        renderMarkdown(
          message
        );
    }

    return message;
  }

  // ============================================================
  // WEB FETCH
  // ============================================================

  async function fetchWebpage(
    url,
    signal
  ) {

    let fetchUrl =
      `https://api.allorigins.win/raw?url=${encodeURIComponent(
        url
      )}`;

    if (
      proxyEnabled &&
      proxyUrl
    ) {

      fetchUrl =
        `${proxyUrl}?url=${encodeURIComponent(
          url
        )}`;
    }

    const response =
      await fetch(
        fetchUrl,
        { signal }
      );

    if (!response.ok) {

      throw new Error(
        `Failed to fetch webpage (HTTP ${response.status}).`
      );
    }

    const html =
      await response.text();

    const parser =
      new DOMParser();

    const doc =
      parser.parseFromString(
        html,
        "text/html"
      );

    doc
      .querySelectorAll(
        "script,style,link,meta,noscript"
      )
      .forEach(
        element =>
          element.remove()
      );

    let text =
      doc.body
        ? (
            doc.body.innerText ||
            "No content found."
          )
        : "No content found.";

    return text.substring(
      0,
      8000
    );
  }

  // ============================================================
  // API REQUEST FOR NON-NOTAL PROVIDERS
  // ============================================================

  async function callExternalProvider(
    config,
    messages,
    signal
  ) {

    let requestBody = {

      model:
        currentModel.id,

      messages,

      temperature:
        chatTemperature,

      max_tokens:
        4000
    };

    /*
      OpenAI-compatible APIs generally
      use this structure.

      Google has a different API format,
      so it is handled separately below.
    */

    if (
      config.provider ===
      "google"
    ) {

      const contents =
        messages
          .filter(
            message =>
              message.role !==
              "system"
          )
          .map(
            message => ({
              role:
                message.role ===
                "assistant"
                  ? "model"
                  : "user",

              parts: [
                {
                  text:
                    String(
                      message.content ||
                      ""
                    )
                }
              ]
            })
          );

      const systemMessage =
        messages.find(
          message =>
            message.role ===
            "system"
        );

      const body = {

        contents,

        generationConfig: {

          temperature:
            chatTemperature,

          maxOutputTokens:
            4000
        }
      };

      if (systemMessage) {

        body.systemInstruction = {

          parts: [
            {
              text:
                String(
                  systemMessage.content ||
                  ""
                )
            }
          ]
        };
      }

      const url =
        `${config.url}${encodeURIComponent(
          currentModel.id
        )}:generateContent?key=${encodeURIComponent(
          config.apiKey
        )}`;

      const response =
        await fetch(
          url,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(
                body
              ),

            signal
          }
        );

      const raw =
        await response.text();

      let data = {};

      try {
        data =
          JSON.parse(raw);
      } catch {
        throw new Error(
          `Invalid Google response: ${raw.substring(
            0,
            300
          )}`
        );
      }

      if (!response.ok) {

        throw new Error(
          data.error?.message ||
          `HTTP ${response.status}`
        );
      }

      const answer =
        data.candidates?.[0]
          ?.content
          ?.parts
          ?.map(
            p => p.text || ""
          )
          .join("") ||
        "No response from Google AI.";

      return {
        content: answer,
        thinking: null
      };
    }

    const response =
      await fetch(
        config.url,
        {
          method: "POST",

          headers:
            config.headers,

          body:
            JSON.stringify(
              requestBody
            ),

          signal,

          mode: "cors",

          credentials: "omit"
        }
      );

    const raw =
      await response.text();

    let data = {};

    try {

      data =
        JSON.parse(raw);

    } catch {

      throw new Error(
        `Invalid API response: ${raw.substring(
          0,
          300
        )}`
      );
    }

    if (!response.ok) {

      throw new Error(
        data.error?.message ||
        data.error ||
        `HTTP ${response.status}`
      );
    }

    return {

      content:
        data.response ||
        data.choices?.[0]
          ?.message
          ?.content ||
        "No response from AI.",

      thinking:
        data.thinking ||
        data.choices?.[0]
          ?.message
          ?.reasoning ||
        null
    };
  }

  // ============================================================
  // SYSTEM PROMPT
  // ============================================================

  function buildSystemPrompt() {

    if (!systemPromptEnabled) {
      return null;
    }

    return `
You are Notal AI, a helpful AI assistant.

Be accurate, clear, and concise.
When writing code, use Markdown code blocks.
Do not claim to have performed actions that you did not perform.
If you are uncertain, say so.
    `.trim();
  }  // ============================================================
  // PART 3/3
  // ============================================================

  // ============================================================
  // HANDLE SEND
  //
  // IMPORTANT:
  // This function is defined BEFORE the event listener
  // at the bottom of this file.
  // ============================================================

  async function handleSend() {

    let content = null;
    let thinking = null;

    if (isProcessing)
      return;

    const text =
      userInput
        ? userInput.value.trim()
        : "";

    if (
      !text &&
      !uploadedFiles.length
    ) {
      return;
    }

    // ----------------------------------------------------------
    // API CONFIG
    // ----------------------------------------------------------

    const config =
      getApiConfig();

    if (!config) {

      alert(
        `Please add your ${currentModel.provider} API key in Settings first.`
      );

      if (settingsModal) {

        settingsModal.classList.remove(
          "hidden"
        );
      }

      return;
    }

    // ----------------------------------------------------------
    // CHAT
    // ----------------------------------------------------------

    if (!currentChatId) {

      createNewChat();
    }

    if (isLanding) {

      isLanding = false;

      if (messagesContainer) {

        messagesContainer.innerHTML =
          "";
      }
    }

    // ----------------------------------------------------------
    // REQUEST FLAGS
    // ----------------------------------------------------------

    const lowerText =
      text.toLowerCase();

    const isImageGen =
      !!currentModel.imageGen &&
      (
        lowerText.includes(
          "generate"
        ) ||
        lowerText.includes(
          "create"
        ) ||
        lowerText.includes(
          "draw"
        ) ||
        lowerText.includes(
          "paint"
        ) ||
        lowerText.includes(
          "image"
        )
      );

    const wantsSummary =
      lowerText.includes(
        "summarize"
      ) ||
      lowerText.includes(
        "summary"
      ) ||
      lowerText.includes(
        "tell me about"
      ) ||
      lowerText.includes(
        "explain"
      ) ||
      lowerText.includes(
        "analyze"
      );

    const isBrowse =
      lowerText.includes(
        "browse"
      ) ||
      lowerText.includes(
        "visit"
      ) ||
      lowerText.includes(
        "open"
      ) ||
      lowerText.includes(
        "go to"
      ) ||
      lowerText.includes(
        "fetch"
      );

    const urlMatch =
      text.match(
        /(https?:\/\/[^\s]+)/i
      );

    // ----------------------------------------------------------
    // FILE CONTENT
    // ----------------------------------------------------------

    let userContent =
      text || "";

    if (uploadedFiles.length) {

      const fileContext =
        uploadedFiles
          .map(file => {

            if (
              file.type?.startsWith(
                "image/"
              )
            ) {

              return `[Image: ${file.name}]`;
            }

            return (
              `--- ${file.name} ---\n` +
              `${String(
                file.content || ""
              ).substring(
                0,
                4000
              )}\n` +
              `---`
            );
          })
          .join("\n\n");

      userContent =
        text
          ? `${text}\n\n${fileContext}`
          : `Analyze:\n${fileContext}`;
    }

    const displayContent =
      text ||
      (
        uploadedFiles.length
          ? `📎 ${uploadedFiles.length} file(s)`
          : ""
      );

    const attachedFiles =
      [...uploadedFiles];

    // ----------------------------------------------------------
    // SAVE USER MESSAGE
    // ----------------------------------------------------------

    currentMessages.push({

      role: "user",

      content:
        userContent,

      files:
        attachedFiles.length
          ? attachedFiles
          : null,

      ts:
        Date.now()
    });

    appendMsg(
      displayContent,
      true,
      null,
      attachedFiles.length
        ? attachedFiles
        : null,
      false,
      Date.now()
    );

    if (userInput) {

      userInput.value = "";

      userInput.style.height =
        "auto";
    }

    uploadedFiles = [];

    saveCurrentChat();

    // ----------------------------------------------------------
    // STREAMING AI ROW
    // ----------------------------------------------------------

    const stream =
      createStreamingRow();

    const bubbleId =
      stream.bubbleId;

    const thinkId =
      stream.thinkId;

    isProcessing = true;

    if (sendBtn) {

      sendBtn.style.display =
        "none";
    }

    if (stopBtn) {

      stopBtn.classList.add(
        "visible"
      );
    }

    abortController =
      new AbortController();

    streamAborted = false;

    activeThinkId =
      thinkId;

    thinkingContent = "";

    try {

      // ========================================================
      // IMAGE GENERATION
      // ========================================================

      if (
        isImageGen &&
        currentModel.imageGen
      ) {

        const generatedMessage =
          await handleImageGeneration(
            text,
            bubbleId
          );

        currentMessages.push({

          role: "assistant",

          content:
            generatedMessage,

          imageGen: true,

          ts:
            Date.now()
        });

        saveCurrentChat();

        return;
      }

      // ========================================================
      // BROWSE
      // ========================================================

      if (
        isBrowse &&
        urlMatch
      ) {

        const url =
          urlMatch[0];

        try {

          const webpage =
            await fetchWebpage(
              url,
              abortController.signal
            );

          let finalContent = "";

          if (wantsSummary) {

            const summaryMessages = [];

            const systemPrompt =
              buildSystemPrompt();

            if (systemPrompt) {

              summaryMessages.push({

                role: "system",

                content:
                  `${systemPrompt}

Summarize the following webpage content clearly and accurately.

URL:
${url}

Webpage content:
${webpage}`
              });
            } else {

              summaryMessages.push({

                role: "user",

                content:
                  `Summarize this webpage:

URL:
${url}

Content:
${webpage}`
              });
            }

            summaryMessages.push({

              role: "user",

              content:
                "Provide a clear summary."
            });

            let result;

            if (
              config.useGradio
            ) {

              result =
                await callGradioSpace(
                  summaryMessages,
                  abortController.signal
                );

            } else {

              result =
                await callExternalProvider(
                  config,
                  summaryMessages,
                  abortController.signal
                );
            }

            finalContent =
              `🌐 **Webpage Summary**

${url}

${result.content}

---

📄 **Extracted Content**

${webpage.substring(
  0,
  4000
)}`;

          } else {

            finalContent =
              `🌐 **${url}**

${webpage}`;
          }

          const bubble =
            document.getElementById(
              bubbleId
            );

          if (bubble) {

            streamText(
              bubble,
              finalContent,
              document.getElementById(
                thinkId
              )
            );
          }

          currentMessages.push({

            role: "assistant",

            content:
              finalContent,

            browser: true,

            ts:
              Date.now()
          });

          saveCurrentChat();

          return;

        } catch (error) {

          if (
            error.name ===
            "AbortError"
          ) {

            throw error;
          }

          throw new Error(
            `Web browsing failed: ${error.message}`
          );
        }
      }

      // ========================================================
      // BUILD CHAT MESSAGES
      // ========================================================

      const apiMessages = [];

      const systemPrompt =
        buildSystemPrompt();

      if (systemPrompt) {

        apiMessages.push({

          role: "system",

          content:
            systemPrompt
        });
      }

      currentMessages.forEach(
        message => {

          if (
            !message.content
          ) {
            return;
          }

          if (
            message.role !==
              "user" &&
            message.role !==
              "assistant"
          ) {
            return;
          }

          apiMessages.push({

            role:
              message.role,

            content:
              String(
                message.content
              )
                .replace(
                  /<[^>]*>/g,
                  ""
                )
          });
        }
      );

      // ========================================================
      // API CALL
      // ========================================================

      let result;

      if (
        config.useGradio
      ) {

        result =
          await callGradioSpace(
            apiMessages,
            abortController.signal
          );

      } else {

        result =
          await callExternalProvider(
            config,
            apiMessages,
            abortController.signal
          );
      }

      content =
        result.content;

      thinking =
        result.thinking;

      // ========================================================
      // THINKING
      // ========================================================

      const thinkingElement =
        document.getElementById(
          thinkId
        );

      if (
        thinking &&
        thinkingElement
      ) {

        thinkingContent =
          thinking;

        thinkingElement.textContent =
          thinking;

        thinkingElement.classList.add(
          "streaming"
        );

        const button =
          document.getElementById(
            "thinkBtn-" +
            thinkId
          );

        if (button) {

          button.innerHTML =
            `
              <i
                class="fas fa-brain"
                style="color:#f59e0b;"
              ></i>

              💭 Thinking...

              <i
                class="fas fa-chevron-right"
                style="font-size:.6rem;"
              ></i>
            `;

          button.classList.add(
            "active"
          );
        }
      }

      // ========================================================
      // OUTPUT
      // ========================================================

      const bubble =
        document.getElementById(
          bubbleId
        );

      if (bubble) {

        streamText(
          bubble,
          content,
          thinkingElement
        );

      } else {

        appendMsg(
          content,
          false,
          thinking
        );
      }

      // ========================================================
      // FINISH THINKING UI
      // ========================================================

      setTimeout(
        () => {

          const button =
            document.getElementById(
              "thinkBtn-" +
              thinkId
            );

          if (button) {

            button.innerHTML =
              `
                <i class="fas fa-brain"></i>
                View thinking
              `;

            button.classList.remove(
              "active"
            );
          }

          if (thinkingElement) {

            thinkingElement.classList.remove(
              "streaming"
            );
          }

        },
        Math.min(
          10000,
          (
            String(
              content || ""
            ).length *
            3
          ) + 500
        )
      );

      // ========================================================
      // SAVE ASSISTANT MESSAGE
      // ========================================================

      currentMessages.push({

        role: "assistant",

        content,

        thinking,

        ts:
          Date.now()
      });

      saveCurrentChat();

    } catch (error) {

      console.error(
        "=== FULL ERROR CAUGHT ===",
        error
      );

      const bubble =
        document.getElementById(
          bubbleId
        );

      finalizeThinkingUI(
        thinkId,
        !!thinkingContent
      );

      let errorMessage =
        `❌ ${error.message}`;

      if (
        error.name ===
        "AbortError"
      ) {

        errorMessage =
          "⏹️ Stopped";
      }

      if (
        error.message &&
        error.message.includes(
          "No API configuration"
        )
      ) {

        errorMessage =
          "❌ No API configuration found. Check Settings.";
      }

      if (
        bubble
      ) {

        bubble.innerHTML =
          renderMarkdown(
            errorMessage
          );
      }

      currentMessages.push({

        role: "assistant",

        content:
          errorMessage,

        ts:
          Date.now()
      });

      saveCurrentChat();

    } finally {

      isProcessing = false;

      if (sendBtn) {

        sendBtn.style.display =
          "flex";
      }

      if (stopBtn) {

        stopBtn.classList.remove(
          "visible"
        );
      }

      abortController =
        null;

      activeThinkId =
        null;

      thinkingContent =
        "";

      if (userInput) {

        userInput.focus();
      }
    }
  }

  // ============================================================
  // PROVIDER CARDS
  // ============================================================

  function renderProviderCards() {

    const container =
      $("providerCards");

    if (!container)
      return;

    container.innerHTML =
      providers
        .map(
          provider => {
            const isBuiltin = provider.id === "notalai-space";
            const hasKey = isBuiltin || !!(keys[provider.id] && String(keys[provider.id]).trim());
            return `
            <div
              class="provider-card ${hasKey ? "has-key" : ""}"
            >
              <div
                class="provider-card-header"
              >
                ${escapeHtml(provider.name)}
                <span
                  class="badge ${
                    isBuiltin
                      ? "badge-green"
                      : provider.needsProxy
                        ? "badge-yellow"
                        : "badge-green"
                  }"
                >
                  ${
                    isBuiltin
                      ? "Ready"
                      : provider.needsProxy
                        ? "Proxy"
                        : "Direct"
                  }
                </span>
                ${hasKey ? "✅" : ""}
              </div>

              ${
                isBuiltin
                  ? `<div style="font-size:0.75rem;color:var(--text2);padding:0.3rem 0;">Built-in AI model • No API key required</div>`
                  : `
                  <input
                    type="password"
                    placeholder="${escapeHtml(provider.keyHint)}"
                    value="${escapeHtml(keys[provider.id] || "")}"
                    data-provider="${escapeHtml(provider.id)}"
                  >
                  `
              }
            </div>
          `;
          }
        )
        .join("");

    container
      .querySelectorAll(
        "input"
      )
      .forEach(input => {

        input.addEventListener(
          "input",
          () => {

            const provider =
              input.dataset.provider;

            const val = input.value.trim();

            if (val) {

              keys[provider] = val;
              input.closest(".provider-card")?.classList.add("has-key");

            } else {

              delete keys[
                provider
              ];
              input.closest(".provider-card")?.classList.remove("has-key");
            }

            saveState();
            updateConnectionUI();
            initModelDropdown();
          }
        );
      });
  }

  // ============================================================
  // PIN / RENAME / EXPORT
  // ============================================================

  function togglePinChat(id) {

    const chat =
      chats.find(
        c => c.id === id
      );

    if (!chat)
      return;

    chat.pinned =
      !chat.pinned;

    saveState();
    renderChatHistory();

    toast(
      chat.pinned
        ? "Chat pinned"
        : "Chat unpinned"
    );
  }

  function renameChat(id) {

    const chat =
      chats.find(
        c => c.id === id
      );

    if (!chat)
      return;

    const title =
      prompt(
        "Rename chat:",
        chat.title ||
          "Chat"
      );

    if (
      title &&
      title.trim()
    ) {

      chat.title =
        title.trim();

      saveState();
      renderChatHistory();

      toast(
        "Chat renamed"
      );
    }
  }

  function exportChat(id) {

    const chat =
      chats.find(
        c => c.id === id
      );

    if (!chat)
      return;

    let markdown =
      "# " +
      (
        chat.title ||
        "Chat"
      ) +
      "\n\n";

    (
      chat.messages ||
      []
    ).forEach(
      message => {

        markdown +=
          (
            message.role ===
            "user"
              ? "**You:** "
              : "**Notal AI:** "
          ) +
          (
            message.content ||
            ""
          ) +
          "\n\n";
      }
    );

    const blob =
      new Blob(
        [markdown],
        {
          type:
            "text/markdown"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const anchor =
      document.createElement(
        "a"
      );

    anchor.href =
      url;

    anchor.download =
      (
        chat.title ||
        "chat"
      )
        .replace(
          /[^a-z0-9]+/gi,
          "_"
        ) +
      ".md";

    document.body.appendChild(
      anchor
    );

    anchor.click();

    anchor.remove();

    setTimeout(
      () => {
        URL.revokeObjectURL(
          url
        );
      },
      1000
    );

    toast(
      "Chat exported"
    );
  }

  // ============================================================
  // TOAST
  // ============================================================

  function toast(message) {

    document
      .querySelectorAll(
        ".toast"
      )
      .forEach(
        element =>
          element.remove()
      );

    const element =
      document.createElement(
        "div"
      );

    element.className =
      "toast";

    element.textContent =
      message;

    document.body.appendChild(
      element
    );

    requestAnimationFrame(
      () => {

        element.classList.add(
          "show"
        );
      }
    );

    setTimeout(
      () => {

        element.classList.remove(
          "show"
        );

        setTimeout(
          () => {
            element.remove();
          },
          300
        );
      },
      2200
    );
  }

  // ============================================================
  // SPEECH
  // ============================================================

  function toggleSpeak(
    text,
    button
  ) {

    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {

      toast(
        "Speech not supported"
      );

      return;
    }

    if (
      speechSynthesis.speaking
    ) {

      speechSynthesis.cancel();

      if (speakingBtn) {

        speakingBtn.classList.remove(
          "active"
        );
      }

      speakingBtn =
        null;

      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(
        String(
          text || ""
        ).substring(
          0,
          1500
        )
      );

    utterance.rate =
      1;

    button.classList.add(
      "active"
    );

    speakingBtn =
      button;

    utterance.onend =
      utterance.onerror =
        () => {

          button.classList.remove(
            "active"
          );

          speakingBtn =
            null;
        };

    speechSynthesis.speak(
      utterance
    );
  }

  // ============================================================
  // REGENERATE
  // ============================================================

  function regenerateLast() {

    if (isProcessing)
      return;

    while (
      currentMessages.length &&
      currentMessages[
        currentMessages.length - 1
      ].role ===
        "assistant"
    ) {

      currentMessages.pop();
    }

    let index =
      -1;

    for (
      let i =
        currentMessages.length - 1;
      i >= 0;
      i--
    ) {

      if (
        currentMessages[i]
          .role === "user"
      ) {

        index =
          i;

        break;
      }
    }

    if (index < 0) {

      toast(
        "Nothing to regenerate"
      );

      return;
    }

    const content =
      currentMessages[
        index
      ].content;

    currentMessages.splice(
      index
    );

    saveCurrentChat();
    renderMessages();

    if (userInput) {

      userInput.value =
        content;

      userInput.dispatchEvent(
        new Event("input")
      );

      userInput.focus();
    }

    handleSend();
  }

  // ============================================================
  // EDIT USER MESSAGE
  // ============================================================

  function editUserMessage(
    index
  ) {

    if (isProcessing)
      return;

    const message =
      currentMessages[
        index
      ];

    if (
      !message ||
      message.role !==
        "user"
    ) {
      return;
    }

    if (userInput) {

      userInput.value =
        message.content;

      userInput.dispatchEvent(
        new Event("input")
      );

      userInput.focus();
    }

    currentMessages.splice(
      index
    );

    saveCurrentChat();
    renderMessages();

    toast(
      "Message loaded for editing"
    );
  }

  // ============================================================
  // MESSAGE ACTIONS
  // ============================================================

  if (messagesContainer) {

    messagesContainer.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            ".msg-action-btn"
          );

        if (!button)
          return;

        const row =
          button.closest(
            ".message-row"
          );

        if (!row)
          return;

        const action =
          button.dataset.action;

        const bubble =
          row.querySelector(
            ".message-bubble"
          );

        const text =
          bubble
            ? bubble.innerText.trim()
            : "";

        if (
          action ===
          "copy"
        ) {

          navigator.clipboard
            .writeText(text)
            .then(
              () =>
                toast(
                  "Copied to clipboard"
                )
            )
            .catch(
              () =>
                toast(
                  "Copy failed"
                )
            );

        } else if (
          action ===
          "speak"
        ) {

          toggleSpeak(
            text,
            button
          );

        } else if (
          action ===
          "regen"
        ) {

          regenerateLast();

        } else if (
          action ===
          "edit"
        ) {

          const index =
            Array.prototype.indexOf.call(
              messagesContainer
                .children,
              row
            );

          editUserMessage(
            index
          );
        }
      }
    );
  }

  // ============================================================
  // TEMPERATURE
  // ============================================================

  if (
    $("temperatureSlider")
  ) {

    $("temperatureSlider").value =
      chatTemperature;

    if (
      $("temperatureValue")
    ) {

      $("temperatureValue")
        .textContent =
        chatTemperature;
    }

    $("temperatureSlider")
      .addEventListener(
        "input",
        () => {

          chatTemperature =
            parseFloat(
              $("temperatureSlider")
                .value
            );

          if (
            $("temperatureValue")
          ) {

            $("temperatureValue")
              .textContent =
              chatTemperature;
          }

          localStorage.setItem(
            "notal_temperature",
            String(
              chatTemperature
            )
          );
        }
      );
  }

  // ============================================================
  // SEARCH
  // ============================================================

  if (
    $("chatSearchInput")
  ) {

    $("chatSearchInput")
      .addEventListener(
        "input",
        event => {

          chatSearchQuery =
            event.target.value
              .trim()
              .toLowerCase();

          renderChatHistory();
        }
      );
  }

  // ============================================================
  // SETTINGS EVENTS
  // ============================================================

  if (
    $("closeSettingsBtn")
  ) {

    $("closeSettingsBtn")
      .addEventListener(
        "click",
        () => {

          if (settingsModal) {

            settingsModal.classList.add(
              "hidden"
            );
          }
        }
      );
  }

  if (
    $("sidebarSettingsBtn")
  ) {

    $("sidebarSettingsBtn")
      .addEventListener(
        "click",
        () => {

          renderProviderCards();

          if (settingsModal) {

            settingsModal.classList.remove(
              "hidden"
            );
          }
        }
      );
  }

  if (
    $("saveSettingsBtn")
  ) {

    $("saveSettingsBtn")
      .addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              "#providerCards input"
            )
            .forEach(
              input => {

                const provider =
                  input.dataset
                    .provider;

                if (
                  input.value.trim()
                ) {

                  keys[provider] =
                    input.value.trim();

                } else {

                  delete keys[
                    provider
                  ];
                }
              }
            );

          proxyEnabled =
            $("proxyToggle")
              ? $("proxyToggle")
                  .checked
              : false;

          proxyUrl =
            $("proxyUrlInput")
              ? $("proxyUrlInput")
                  .value.trim()
              : "";

          previewEnabled =
            $("previewToggle")
              ? $("previewToggle")
                  .checked
              : true;

          systemPromptEnabled =
            $("systemPromptToggle")
              ? $("systemPromptToggle")
                  .checked
              : true;

          saveState();

          updateConnectionUI();

          if (settingsModal) {

            settingsModal.classList.add(
              "hidden"
            );
          }

          toast(
            "Settings saved"
          );
        }
      );
  }

  // ============================================================
  // TOGGLES
  // ============================================================

  if (
    $("systemPromptToggle")
  ) {

    $("systemPromptToggle")
      .addEventListener(
        "change",
        event => {

          systemPromptEnabled =
            event.target.checked;

          saveState();
        }
      );
  }

  if (
    $("previewToggle")
  ) {

    $("previewToggle")
      .addEventListener(
        "change",
        event => {

          previewEnabled =
            event.target.checked;

          saveState();
        }
      );
  }

  if (
    $("proxyToggle")
  ) {

    $("proxyToggle")
      .addEventListener(
        "change",
        event => {

          proxyEnabled =
            event.target.checked;

          saveState();
        }
      );
  }

  // ============================================================
  // SIDEBAR & NAVIGATION EVENTS
  // ============================================================

  if ($("navChatsBtn")) {
    $("navChatsBtn").addEventListener("click", () => {
      document.querySelectorAll(".sidebar-nav-btn").forEach(btn => btn.classList.remove("active"));
      $("navChatsBtn").classList.add("active");
      if ($("chatSearchInput")) {
        $("chatSearchInput").focus();
      }
    });
  }

  if ($("navExploreBtn")) {
    $("navExploreBtn").addEventListener("click", () => {
      const palette = $("commandPalette");
      if (palette) {
        palette.classList.remove("hidden");
        const input = $("commandPaletteInput");
        if (input) {
          input.value = "/";
          input.focus();
        }
      } else {
        toast("Explore: Use / for quick prompt commands");
      }
    });
  }

  if ($("navSettingsQuickBtn")) {
    $("navSettingsQuickBtn").addEventListener("click", () => {
      renderProviderCards();
      if (settingsModal) {
        settingsModal.classList.remove("hidden");
      }
    });
  }

  if ($("themeRow")) {
    $("themeRow").addEventListener("click", (e) => {
      if (e.target.closest(".theme-btn")) return;
      const dd = $("themeDropdown");
      if (dd) {
        const isHidden = dd.style.display === "none";
        dd.style.display = isHidden ? "block" : "none";
      }
    });
  }

  if (
    $("closeSidebarBtn")
  ) {

    $("closeSidebarBtn")
      .addEventListener(
        "click",
        event => {

          event.preventDefault();

          closeSidebar();
        }
      );
  }

  if (toggleSidebarBtn) {

    toggleSidebarBtn
      .addEventListener(
        "click",
        event => {

          event.preventDefault();

          openSidebar();
        }
      );
  }

  if (
    $("menuToggle")
  ) {

    $("menuToggle")
      .addEventListener(
        "click",
        event => {

          event.preventDefault();

          toggleSidebar();
        }
      );
  }

  if (
    sidebarOverlay
  ) {

    sidebarOverlay
      .addEventListener(
        "click",
        () => {

          closeMobileSidebar();

          if (
            !isMobileOrPortrait()
          ) {

            closeSidebar();
          }
        }
      );
  }

  // ============================================================
  // NEW CHAT
  // ============================================================

  if (
    $("newChatBtn")
  ) {

    $("newChatBtn")
      .addEventListener(
        "click",
        createNewChat
      );
  }

  // ============================================================
  // MODEL DROPDOWN
  // ============================================================

  if (
    modelTrigger
  ) {

    modelTrigger
      .addEventListener(
        "click",
        event => {

          event.stopPropagation();

          if (
            modelDropdown
          ) {

            modelDropdown.classList.toggle(
              "show"
            );
          }
        }
      );
  }

  document.addEventListener(
    "click",
    event => {

      if (
        modelTrigger &&
        !modelTrigger.contains(
          event.target
        ) &&
        modelDropdown &&
        !modelDropdown.contains(
          event.target
        )
      ) {

        modelDropdown.classList.remove(
          "show"
        );
      }
    }
  );

  // ============================================================
  // SEND BUTTON
  //
  // handleSend() is already defined above.
  // ============================================================

  if (sendBtn) {

    sendBtn.addEventListener(
      "click",
      handleSend
    );
  }

  // ============================================================
  // USER INPUT
  // ============================================================

  if (userInput) {

    userInput.addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
            "Enter" &&
          !event.shiftKey
        ) {

          event.preventDefault();

          handleSend();
        }
      }
    );

    userInput.addEventListener(
      "input",
      () => {

        userInput.style.height =
          "auto";

        userInput.style.height =
          Math.min(
            userInput.scrollHeight,
            144
          ) +
          "px";
      }
    );
  }

  // ============================================================
  // STOP BUTTON
  // ============================================================

  if (stopBtn) {

    stopBtn.addEventListener(
      "click",
      () => {

        streamAborted =
          true;

        if (
          abortController
        ) {

          abortController.abort();

          abortController =
            null;
        }

        if (
          activeThinkId
        ) {

          finalizeThinkingUI(
            activeThinkId,
            !!thinkingContent
          );

          activeThinkId =
            null;
        }
      }
    );
  }

  // ============================================================
  // PREVIEW EVENTS
  // ============================================================

  if (
    $("closePreviewBtn")
  ) {

    $("closePreviewBtn")
      .addEventListener(
        "click",
        () => {

          if (
            previewPanel
          ) {

            previewPanel.classList.remove(
              "visible"
            );
          }

          if (
            mobilePreviewOverlay
          ) {

            mobilePreviewOverlay.classList.remove(
              "active"
            );
          }
        }
      );
  }

  if (
    $("previewRefreshBtn")
  ) {

    $("previewRefreshBtn")
      .addEventListener(
        "click",
        () => {

          if (
            previewContent
          ) {

            openPreview(
              previewContent
            );
          }
        }
      );
  }

  if (
    mobilePreviewOverlay
  ) {

    mobilePreviewOverlay
      .addEventListener(
        "click",
        () => {

          if (
            previewPanel
          ) {

            previewPanel.classList.remove(
              "visible"
            );
          }

          mobilePreviewOverlay.classList.remove(
            "active"
          );
        }
      );
  }

  // ============================================================
  // THEME BUTTONS
  // ============================================================

  document
    .querySelectorAll(
      ".theme-btn"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".theme-btn"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "active"
                  )
              );

            button.classList.add(
              "active"
            );

            currentTheme =
              button.dataset.theme ||
              "default";

            applyTheme(
              currentTheme
            );

            saveState();
          }
        );
      }
    );

  // ============================================================
  // CLEAR CHATS
  // ============================================================

  if (
    $("clearAllChatsBtn")
  ) {

    $("clearAllChatsBtn")
      .addEventListener(
        "click",
        () => {

          if (
            !confirm(
              "Delete ALL chats?"
            )
          ) {
            return;
          }

          chats = [];

          currentChatId =
            null;

          currentMessages =
            [];

          saveState();

          renderChatHistory();

          showLanding();

          toast(
            "All chats cleared"
          );
        }
      );
  }

  // ============================================================
  // GOOGLE LOGIN
  // ============================================================

  function parseJwt(
    token
  ) {

    const parts =
      String(token)
        .split(".");

    if (
      parts.length <
      2
    ) {

      throw new Error(
        "Invalid JWT"
      );
    }

    const base64 =
      parts[1]
        .replace(
          /-/g,
          "+"
        )
        .replace(
          /_/g,
          "/"
        );

    const json =
      decodeURIComponent(
        atob(base64)
          .split("")
          .map(
            character =>
              "%" +
              (
                "00" +
                character
                  .charCodeAt(0)
                  .toString(16)
              ).slice(-2)
          )
          .join("")
      );

    return JSON.parse(
      json
    );
  }

  function cleanModelResponse(text) {
    if (!text) return '';

    // Remove <think>...</think>
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');

    // Remove an incomplete/open <think> block
    text = text.replace(/<think>[\s\S]*$/gi, '');

    return text.trim();
}

  // ============================================================
  // USER PROFILE & AUTHENTICATION (Google OAuth + Email + Profile)
  // ============================================================

  const AVATAR_PRESETS = [
    {
      id: "spark",
      name: "Indigo Spark",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><defs><linearGradient id='g1' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23a855f7'/></linearGradient></defs><rect width='80' height='80' rx='40' fill='url(%23g1)'/><circle cx='40' cy='32' r='14' fill='%23ffffff'/><path d='M20 64 C20 48 30 46 40 46 C50 46 60 48 60 64' fill='%23ffffff'/></svg>"
    },
    {
      id: "emerald",
      name: "Emerald Pro",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><defs><linearGradient id='g2' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%2310b981'/><stop offset='100%' stop-color='%2306b6d4'/></linearGradient></defs><rect width='80' height='80' rx='40' fill='url(%23g2)'/><circle cx='40' cy='32' r='14' fill='%23ffffff'/><path d='M20 64 C20 48 30 46 40 46 C50 46 60 48 60 64' fill='%23ffffff'/></svg>"
    },
    {
      id: "sunset",
      name: "Sunset Gold",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><defs><linearGradient id='g3' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23f59e0b'/><stop offset='100%' stop-color='%23ef4444'/></linearGradient></defs><rect width='80' height='80' rx='40' fill='url(%23g3)'/><circle cx='40' cy='32' r='14' fill='%23ffffff'/><path d='M20 64 C20 48 30 46 40 46 C50 46 60 48 60 64' fill='%23ffffff'/></svg>"
    },
    {
      id: "cyber",
      name: "Cyber Neon",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><defs><linearGradient id='g4' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%230f172a'/><stop offset='100%' stop-color='%231e293b'/></linearGradient></defs><rect width='80' height='80' rx='40' fill='url(%23g4)'/><circle cx='40' cy='32' r='14' fill='%2338bdf8'/><path d='M20 64 C20 48 30 46 40 46 C50 46 60 48 60 64' fill='%2338bdf8'/></svg>"
    },
    {
      id: "violet",
      name: "Neon Violet",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><defs><linearGradient id='g5' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23ec4899'/><stop offset='100%' stop-color='%238b5cf6'/></linearGradient></defs><rect width='80' height='80' rx='40' fill='url(%23g5)'/><circle cx='40' cy='32' r='14' fill='%23ffffff'/><path d='M20 64 C20 48 30 46 40 46 C50 46 60 48 60 64' fill='%23ffffff'/></svg>"
    },
    {
      id: "blue",
      name: "Ocean Blue",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><defs><linearGradient id='g6' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%233b82f6'/><stop offset='100%' stop-color='%231d4ed8'/></linearGradient></defs><rect width='80' height='80' rx='40' fill='url(%23g6)'/><circle cx='40' cy='32' r='14' fill='%23ffffff'/><path d='M20 64 C20 48 30 46 40 46 C50 46 60 48 60 64' fill='%23ffffff'/></svg>"
    }
  ];

  let selectedAvatarUrl = "";
  let isRegisterMode = false;

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  function handleGoogleCredential(response) {
    try {
      if (!response || !response.credential) {
        throw new Error("Google credential missing");
      }
      const payload = parseJwt(response.credential);
      if (!payload) throw new Error("Invalid JWT token");

      googleUser = {
        id: payload.sub || ("google_" + Date.now()),
        name: payload.name || payload.email || "Google User",
        email: payload.email || "",
        picture: payload.picture || AVATAR_PRESETS[0].url,
        authMethod: "google",
        updatedAt: Date.now()
      };

      localStorage.setItem("notal_google_user", JSON.stringify(googleUser));
      localStorage.setItem("notal_user", JSON.stringify(googleUser));
      updateUserUI();
      closeProfileModal();
      toast(`Signed in as ${googleUser.name}`);
    } catch (err) {
      console.error("Google credential error:", err);
      toast("Google sign-in completed fallback");
    }
  }
  window.handleGoogleCredential = handleGoogleCredential;

  function initGoogleAuth() {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        const container = $("gsiButtonContainer");
        if (container) {
          container.innerHTML = "";
          google.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            type: "standard",
            shape: "rectangular",
            text: "signin_with",
            logo_alignment: "left",
            width: 280
          });
        }
      } catch (err) {
        console.warn("GSI init warning:", err);
      }
    } else {
      setTimeout(initGoogleAuth, 600);
    }
  }

  function setAuthTab(tabName) {
    document.querySelectorAll(".auth-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    $("paneGoogle")?.classList.toggle("active", tabName === "google");
    $("paneEmail")?.classList.toggle("active", tabName === "email");
    $("paneProfile")?.classList.toggle("active", tabName === "profile");
  }

  function updateModalAvatarPreview(url) {
    const preview = $("modalAvatarPreview");
    if (!preview) return;
    if (url) {
      preview.innerHTML = `<img src="${escapeHtml(url)}" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      preview.innerHTML = `<i class="fas fa-user"></i>`;
    }
  }

  function openProfileModal(defaultTab = "google") {
    const modal = $("profileModal");
    if (!modal) return;

    setAuthTab(defaultTab);

    const nameInput = $("profileNameInput");
    const urlInput = $("profileAvatarUrlInput");
    const list = $("avatarPresetsList");

    const currentName = googleUser?.name || "";
    const currentPic = googleUser?.picture || AVATAR_PRESETS[0].url;
    selectedAvatarUrl = currentPic;

    if (nameInput) nameInput.value = currentName;
    if (urlInput) urlInput.value = (currentPic && currentPic.startsWith("http") ? currentPic : "");

    updateModalAvatarPreview(selectedAvatarUrl);

    if (list) {
      list.innerHTML = AVATAR_PRESETS.map(preset => `
        <button type="button" class="avatar-preset-btn ${preset.url === selectedAvatarUrl ? 'selected' : ''}" data-url="${escapeHtml(preset.url)}" title="${escapeHtml(preset.name)}">
          <img src="${escapeHtml(preset.url)}" alt="${escapeHtml(preset.name)}">
        </button>
      `).join("");

      list.querySelectorAll(".avatar-preset-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          list.querySelectorAll(".avatar-preset-btn").forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          selectedAvatarUrl = btn.dataset.url;
          if (urlInput) urlInput.value = "";
          updateModalAvatarPreview(selectedAvatarUrl);
        });
      });
    }

    if (urlInput) {
      urlInput.oninput = () => {
        const val = urlInput.value.trim();
        if (val) {
          selectedAvatarUrl = val;
          list?.querySelectorAll(".avatar-preset-btn").forEach(b => b.classList.remove("selected"));
          updateModalAvatarPreview(selectedAvatarUrl);
        }
      };
    }

    initGoogleAuth();
    modal.classList.remove("hidden");
  }

  function closeProfileModal() {
    $("profileModal")?.classList.add("hidden");
  }

  function handleEmailAuth() {
    const email = $("authEmailInput")?.value.trim().toLowerCase();
    const password = $("authPasswordInput")?.value.trim();
    const name = $("authNameInput")?.value.trim() || (email ? email.split("@")[0] : "User");

    if (!email || !email.includes("@")) {
      toast("Please enter a valid email address");
      $("authEmailInput")?.focus();
      return;
    }
    if (!password || password.length < 4) {
      toast("Password must be at least 4 characters");
      $("authPasswordInput")?.focus();
      return;
    }

    let registeredUsers = JSON.parse(localStorage.getItem("notal_registered_users") || "[]");
    let existingUser = registeredUsers.find(u => u.email && u.email.toLowerCase() === email);

    if (isRegisterMode) {
      if (existingUser) {
        toast("Account already exists with this email. Logging in...");
      } else {
        existingUser = {
          id: "email_" + btoa(email).replace(/=/g, "").slice(0, 12),
          name: name,
          email: email,
          password: password,
          picture: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)].url,
          authMethod: "email",
          createdAt: Date.now()
        };
        registeredUsers.push(existingUser);
        localStorage.setItem("notal_registered_users", JSON.stringify(registeredUsers));
      }
    } else {
      if (existingUser && existingUser.password && existingUser.password !== password) {
        toast("Incorrect password for this email");
        return;
      }
      if (!existingUser) {
        existingUser = {
          id: "email_" + btoa(email).replace(/=/g, "").slice(0, 12),
          name: name,
          email: email,
          picture: AVATAR_PRESETS[0].url,
          authMethod: "email",
          createdAt: Date.now()
        };
        registeredUsers.push(existingUser);
        localStorage.setItem("notal_registered_users", JSON.stringify(registeredUsers));
      }
    }

    googleUser = {
      id: existingUser.id,
      name: existingUser.name || name,
      email: existingUser.email,
      picture: existingUser.picture || AVATAR_PRESETS[0].url,
      authMethod: "email",
      updatedAt: Date.now()
    };

    localStorage.setItem("notal_google_user", JSON.stringify(googleUser));
    localStorage.setItem("notal_user", JSON.stringify(googleUser));

    updateUserUI();
    closeProfileModal();
    toast(`Welcome, ${googleUser.name}!`);
  }

  function saveProfile() {
    const nameInput = $("profileNameInput");
    const urlInput = $("profileAvatarUrlInput");

    const name = nameInput ? nameInput.value.trim() : "";
    let picture = urlInput && urlInput.value.trim() ? urlInput.value.trim() : selectedAvatarUrl;
    if (!picture) picture = AVATAR_PRESETS[0].url;

    if (!name) {
      toast("Please enter a display name");
      return;
    }

    googleUser = {
      id: googleUser?.id || "user_" + Date.now(),
      name: name,
      email: googleUser?.email || (name.toLowerCase().replace(/\s+/g, '') + "@notal.ai"),
      picture: picture,
      authMethod: googleUser?.authMethod || "custom",
      updatedAt: Date.now()
    };

    localStorage.setItem("notal_google_user", JSON.stringify(googleUser));
    localStorage.setItem("notal_user", JSON.stringify(googleUser));

    updateUserUI();
    closeProfileModal();
    toast(`Profile updated for ${googleUser.name}`);
  }

  function signOutGoogle() {
    googleUser = null;
    localStorage.removeItem("notal_google_user");
    localStorage.removeItem("notal_user");
    updateUserUI();
    toast("Signed out");
  }

  // Bind tab switchers
  $("tabBtnGoogle")?.addEventListener("click", () => setAuthTab("google"));
  $("tabBtnEmail")?.addEventListener("click", () => setAuthTab("email"));
  $("tabBtnProfile")?.addEventListener("click", () => setAuthTab("profile"));
  $("switchToEmailTabBtn")?.addEventListener("click", () => setAuthTab("email"));

  // Google Direct trigger
  $("googleDirectBtn")?.addEventListener("click", () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        google.accounts.id.prompt();
      } catch (e) {
        setAuthTab("email");
      }
    } else {
      toast("Connecting to Google Services...");
      initGoogleAuth();
    }
  });

  // Email form toggle & submit
  $("authModeToggleBtn")?.addEventListener("click", () => {
    isRegisterMode = !isRegisterMode;
    const header = $("emailFormHeader");
    const nameGroup = $("registerNameGroup");
    const btnText = $("emailAuthBtnText");
    const toggleBtn = $("authModeToggleBtn");

    if (isRegisterMode) {
      if (header) header.textContent = "Create New Account";
      if (nameGroup) nameGroup.style.display = "flex";
      if (btnText) btnText.textContent = "Create Account";
      if (toggleBtn) toggleBtn.textContent = "Already have an account? Sign In";
    } else {
      if (header) header.textContent = "Account Sign In";
      if (nameGroup) nameGroup.style.display = "none";
      if (btnText) btnText.textContent = "Sign In";
      if (toggleBtn) toggleBtn.textContent = "Need an account? Register";
    }
  });

  $("emailAuthSubmitBtn")?.addEventListener("click", handleEmailAuth);
  $("authPasswordInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleEmailAuth();
  });
  $("authEmailInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("authPasswordInput")?.focus();
  });

  $("quickFillDemoBtn")?.addEventListener("click", () => {
    if ($("authEmailInput")) $("authEmailInput").value = "batbleseed@gmail.com";
    if ($("authPasswordInput")) $("authPasswordInput").value = "password123";
    if ($("authNameInput")) $("authNameInput").value = "Batbleseed";
    toast("Demo credentials filled in");
  });

  // Bind profile triggers
  $("googleSigninBtn")?.addEventListener("click", () => openProfileModal("google"));
  $("profileSignInItem")?.addEventListener("click", () => {
    $("profileDropdown")?.classList.remove("show");
    openProfileModal("google");
  });
  $("profileEditNameItem")?.addEventListener("click", () => {
    $("profileDropdown")?.classList.remove("show");
    openProfileModal("profile");
  });
  $("profileSignOutItem")?.addEventListener("click", () => {
    $("profileDropdown")?.classList.remove("show");
    signOutGoogle();
  });
  $("saveProfileModalBtn")?.addEventListener("click", saveProfile);
  $("closeProfileModalBtn")?.addEventListener("click", closeProfileModal);
  $("quickGuestLoginBtn")?.addEventListener("click", () => {
    signOutGoogle();
    closeProfileModal();
  });

  // Settings profile card click -> dropdown toggle
  $("settingsProfileCard")?.addEventListener("click", (e) => {
    if (e.target.closest("#profileDropdown")) return;
    $("profileDropdown")?.classList.toggle("show");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#settingsProfileCard")) {
      $("profileDropdown")?.classList.remove("show");
    }
  });

  // Sidebar profile dropdown toggle & signout
  $("userProfileBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    $("signoutDropdown")?.classList.toggle("show");
  });
  $("signoutConfirmBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    $("signoutDropdown")?.classList.remove("show");
    signOutGoogle();
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#sidebarUserProfile")) {
      $("signoutDropdown")?.classList.remove("show");
    }
  });

  // Storage listener for instantaneous multi-tab and studio.html sync
  window.addEventListener("storage", (e) => {
    if (e.key === "notal_google_user" || e.key === "notal_user") {
      try {
        googleUser = JSON.parse(localStorage.getItem("notal_google_user") || localStorage.getItem("notal_user") || "null");
      } catch (err) {
        googleUser = null;
      }
      updateUserUI();
    }
  });

  // ============================================================
  // KEYBOARD SHORTCUTS
  // ============================================================

  document.addEventListener(
    "keydown",
    event => {

      const modifier =
        event.ctrlKey ||
        event.metaKey;

      if (
        event.key ===
        "Escape"
      ) {

        if (
          isProcessing &&
          abortController
        ) {

          streamAborted =
            true;

          abortController.abort();

        } else {

          if (
            settingsModal
          ) {

            settingsModal.classList.add(
              "hidden"
            );
          }

          if (
            previewPanel
          ) {

            previewPanel.classList.remove(
              "visible"
            );
          }

          if (
            mobilePreviewOverlay
          ) {

            mobilePreviewOverlay.classList.remove(
              "active"
            );
          }
        }
      }

      if (
        modifier &&
        event.key.toLowerCase() ===
          "k"
      ) {

        event.preventDefault();

        createNewChat();

        toast(
          "New chat created"
        );
      }

      if (
        modifier &&
        event.key.toLowerCase() ===
          "b"
      ) {

        event.preventDefault();

        toggleSidebar();
      }

      if (
        modifier &&
        event.key.toLowerCase() ===
          "e"
      ) {

        event.preventDefault();

        if (
          settingsModal
        ) {

          settingsModal.classList.toggle(
            "hidden"
          );
        }
      }
    }
  );

  // ============================================================
  // INITIALIZATION
  // ============================================================

  window.addEventListener(
    "load",
    () => {

      try {

        loadState();

        if (userInput) {

          userInput.focus();
        }

        console.log(
          "%cNotal AI initialized",
          "font-weight:bold;color:#7c3aed;"
        );

        console.log(
          "Current model:",
          currentModel?.name
        );

        console.log(
          "Cloudflare API:",
          NOTAL_API_URL
        );

      } catch (error) {

        console.error(
          "Notal AI initialization failed:",
          error
        );

        showLanding();
      }
    }
  );

  // ============================================================
  // FINAL IIFE CLOSURE
  //
  // THIS MUST BE THE VERY LAST LINE OF THE FILE.
  // ============================================================

})();
