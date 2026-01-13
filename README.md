# Lock Sites Script

A lightweight, clean, and effective client-side security layer for any website. This userscript forces a PIN code entry before revealing any content on the specified websites.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Size](https://img.shields.io/github/size/0xendale/lock-sites-script/userscript.js)

## ✨ Features

* **🔒 Universal Protection:** Works on any website you configure (Notion, Gmail, Social Media, etc.).
* **⚡ Anti-Flicker:** Uses aggressive CSS Injection to hide site content *before* it renders.
* **🌑 Modern Dark UI:** Minimalist, professional interface that overlays the target site.
* **💾 Smart Session:** Unlocks per tab/session. Reloading the page won't ask for the PIN again until you close the tab.
* **🚀 Zero Dependencies:** Pure Vanilla JS, highly performant.

## 🛠 Installation

1.  Install a Userscript manager:
    * [Tampermonkey](https://www.tampermonkey.net/) (Recommended)
    * [Violentmonkey](https://violentmonkey.github.io/)
2.  Create a new script and paste the content of `userscript.js`.
3.  **Configure the Target Sites:**
    * By default, the script matches `<all_urls>`. It is **highly recommended** to go to your Userscript Manager settings and set specific "User Matches" (e.g., `https://www.notion.so/*`, `https://web.whatsapp.com/*`) to avoid locking every site you visit.

## ⚙️ Configuration

Open the script editor and modify the `CONFIG` object at the top:

```javascript
const CONFIG = {
    PIN: "1234", // <--- CHANGE THIS TO YOUR SECRET PIN
    UI: {
        title: "Restricted Access", // Custom Title
        // ...
    }
};
```
⚠️ Disclaimer
This tool provides a UI-level security layer (Client-side). It is designed to prevent casual snooping (e.g., leaving your laptop open at a coffee shop). It does not encrypt network traffic or server-side data. Experienced users can bypass this by disabling JavaScript or the extension.
