# Notal AI

<div align="center">
  <img src="https://raw.githubusercontent.com/batbleseed/Notal-ai/main/logo.png" alt="Notal AI Logo" width="200">
  <br>
  <strong>Your All-in-One AI Platform</strong>
  <br>
  <sub>Free • Privacy-First • 15+ AI Models</sub>
</div>

---

## 🚀 **What is Notal AI?**

Notal AI is a **100% client-side**, privacy-focused AI platform that brings together the best AI models in one beautiful interface. No signup required, no data collection, and no hidden costs.

**🔗 Live Demo:** [Notal AI Studio](https://batbleseed.github.io/Notal-ai/studio.html)

---

## ✨ **Features**

### 🤖 **15+ AI Models**
| Provider | Models | Badges |
|----------|--------|--------|
| **Google Gemini** | 3.6 Flash, 3.5 Flash, 3.5 Lite, 3.1 Pro, 3.1 Flash, 2.0 Flash, 1.5 Pro, 1.5 Flash | Latest, Stable, Fast, Powerful, Free |
| **DeepSeek** | V3, R1, Coder | Cheap, Reason, Coding |
| **OpenAI** | GPT-4o, GPT-4o Mini, DALL-E 3 | Vision, Fast, Image Gen |
| **OpenRouter** | Claude 3.5 Sonnet, Mistral Large 2, Llama 3.2 90B Vision, Llama 3.1 70B, Qwen 2.5 72B, SD 3.5, Imagen 3 | Vision, Smart, Open, Image Gen |

### 🎨 **Image Generation**
- Generate images with DALL-E 3, Stable Diffusion 3.5, and Imagen 3
- Simple commands like: "Generate an image of a futuristic city"
- Images appear directly in chat

### 👁️ **Vision Analysis**
- Upload and analyze images with GPT-4o, Claude 3.5, and Gemini
- Ask questions about images
- Detailed descriptions and analysis

### 🌐 **Web Browsing**
- Browse any website directly in chat
- Extract and read web content
- List all links on a page
- Commands like: "Browse https://example.com"

### 💻 **Code Generation**
- Generate code in any language
- Live HTML preview with iframe
- Markdown rendering with syntax highlighting
- Copy code with one click

### 📎 **File Upload**
- Support for images, PDFs, text files, and code files
- Preview uploaded files
- Multi-file support

### 🧠 **ChatGPT-Style Thinking**
- Animated thinking process with 3 stages:
  1. **Analyzing** 🔍
  2. **Processing** ⚙️
  3. **Generating** ✨
- View thinking toggle button

### 🔒 **Privacy-First**
- All data stored locally in your browser
- No backend server
- No data collection
- Your API keys never leave your browser

---

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────┐
│           Notal AI Studio                    │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────────────┐ │
│  │   Sidebar    │  │    Chat Area         │ │
│  │ • Chat List  │  │ • Messages           │ │
│  │ • New Chat   │  │ • Thinking Animation │ │
│  │ • Settings   │  │ • File Upload        │ │
│  └─────────────┘  └──────────────────────┘ │
│  ┌─────────────────────────────────────────┐ │
│  │         Input Area                      │ │
│  │  [📎] [Type a message...] [▶ Send]     │ │
│  └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│              localStorage                    │
│  • API Keys    • Chat History               │
│  • Preferences • System Prompt              │
└─────────────────────────────────────────────┘
```

### **Technology Stack**
- **Frontend:** Vanilla JavaScript + HTML5 + CSS3
- **Icons:** Font Awesome 6.4
- **Storage:** localStorage
- **Hosting:** GitHub Pages
- **APIs:** Google Gemini, DeepSeek, OpenAI, OpenRouter

---

## 🔑 **API Configuration**

To use Notal AI, add your API keys in Settings (⚙️ icon):

| Provider | Key Format | Get It Here |
|----------|-----------|-------------|
| **Google Gemini** | `AIza...` | [ai.google.dev](https://ai.google.dev/) |
| **DeepSeek** | `sk-...` | [platform.deepseek.com](https://platform.deepseek.com/) |
| **OpenAI** | `sk-proj-...` | [platform.openai.com](https://platform.openai.com/) |
| **OpenRouter** | `sk-or-v1-...` | [openrouter.ai](https://openrouter.ai/) |

---

## 🚀 **Quick Start**

1. **Open** [Notal AI Studio](https://batbleseed.github.io/Notal-ai/studio.html)
2. **Add API Key** in Settings (⚙️ icon)
3. **Select Model** from the dropdown
4. **Start Chatting!**

### **Example Commands**

```bash
# Chat with AI
"What is quantum computing?"

# Generate images
"Generate an image of a futuristic city at sunset"

# Browse websites
"Browse https://wikipedia.org"

# Analyze images
[Upload an image] "What's in this image?"

# Generate code
"Write a Python function to sort a list of numbers"

# Create web pages
"Create an HTML landing page for a coffee shop"
```

---

## 📁 **Project Structure**

```
Notal-ai/
├── studio.html          # Main application
├── chat.html            # Simple chat interface
├── README.md           # This file
├── logo.png            # Logo image
└── .github/
    └── pages/
        └── index.html  # GitHub Pages config
```

---

## 🎯 **Use Cases**

### **For Developers**
- Generate and test code
- Debug issues with AI assistance
- Create HTML/CSS prototypes
- Learn new programming concepts

### **For Content Creators**
- Generate images for projects
- Brainstorm ideas
- Research topics
- Create content outlines

### **For Students**
- Learn new concepts
- Get explanations
- Practice problem-solving
- Research assistance

### **For Researchers**
- Analyze documents
- Extract information
- Generate summaries
- Process images

---

## 🛠️ **Local Development**

1. **Clone the repository**
```bash
git clone https://github.com/batbleseed/Notal-ai.git
cd Notal-ai
```

2. **Open in browser**
```bash
# Simple way
open studio.html

# Or use a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

3. **Start developing**
- Edit `studio.html` for main app
- Modify styles in `<style>` section
- Update JavaScript functionality

---

## 📊 **Browser Support**

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Opera 76+ | ✅ Full |
| Mobile Browsers | ✅ Full |

---

## 🔒 **Privacy Policy**

### **What We DON'T Do**
- ❌ Collect any user data
- ❌ Store API keys anywhere except your browser
- ❌ Send analytics or tracking
- ❌ Sell or share your information
- ❌ Require signups or accounts

### **What We DO**
- ✅ Run 100% client-side
- ✅ Store data locally in your browser
- ✅ Let you use your own API keys
- ✅ Keep everything private

---

## 🤝 **Contributing**

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Commit your changes**
```bash
git commit -m 'Add amazing feature'
```
4. **Push to the branch**
```bash
git push origin feature/amazing-feature
```
5. **Open a Pull Request**

### **Contribution Guidelines**
- Keep code clean and well-commented
- Test thoroughly before submitting
- Update documentation as needed
- Follow existing code style

---

## 🐛 **Reporting Issues**

Found a bug? Let us know!

1. Check if it's already reported in [Issues](https://github.com/batbleseed/Notal-ai/issues)
2. If not, create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS version
   - Screenshots (if applicable)

---

## 📝 **Changelog**

### **v3.0.0** (Current)
- ✅ Native Google Gemini API integration
- ✅ Native DeepSeek API integration
- ✅ ChatGPT-style thinking animation
- ✅ Web browsing via CORS proxies
- ✅ Image generation with DALL-E, SD, Imagen
- ✅ Vision analysis with multiple models
- ✅ Server-Side Rendering for SEO
- ✅ Improved UI/UX
- ✅ Dark/Light theme toggle

### **v2.0.0**
- ✅ OpenRouter integration
- ✅ 9+ AI models
- ✅ File upload support
- ✅ Code preview
- ✅ Chat history

### **v1.0.0**
- ✅ Initial release
- ✅ Basic chat interface
- ✅ OpenRouter API support

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Notal AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 **Acknowledgments**

- **Google Gemini** - For their amazing free tier
- **DeepSeek** - For affordable AI access
- **OpenAI** - For GPT-4 and DALL-E
- **OpenRouter** - For unified API access
- **Font Awesome** - For beautiful icons
- **GitHub Pages** - For free hosting

---

## 📞 **Contact**

- **GitHub:** [batbleseed](https://github.com/batbleseed)
- **Project URL:** [Notal AI](https://github.com/batbleseed/Notal-ai)
- **Live Demo:** [Notal AI Studio](https://batbleseed.github.io/Notal-ai/studio.html)

---

<div align="center">
  <sub>Built with ❤️ by the Notal AI team</sub>
  <br>
  <sub>⭐ If you like this project, give it a star on GitHub! ⭐</sub>
</div>
