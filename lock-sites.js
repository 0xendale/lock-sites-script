// ==UserScript==
// @name         Lock Sites Script
// @namespace    https://github.com/0xendale/lock-sites-script
// @version      1.0.0
// @description  A generic client-side PIN protection layer for any website.
// @author       0xendale
// @match        <all_urls>
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * CONFIGURATION
     * Set your PIN and UI preferences here.
     */
    const CONFIG = {
        PIN: "1234", // Change this to your desired PIN
        SESSION_KEY_PREFIX: "site_lock_session_",
        UI: {
            title: "Restricted Access",
            subtitle: "Please enter PIN to continue",
            placeholder: "••••",
            btnText: "Unlock",
            primaryColor: "#3b82f6", // Blue
            bgColor: "#111111"       // Dark Gray
        }
    };

    const CSS_STYLES = `
        html, body {
            background-color: ${CONFIG.UI.bgColor} !important;
            overflow: hidden !important;
        }
        
        /* Hide all direct children of body except our overlay */
        body > *:not(#site-lock-overlay) {
            display: none !important;
        }

        #site-lock-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background-color: ${CONFIG.UI.bgColor};
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2147483647; /* Max safe integer for z-index */
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #ffffff;
            user-select: none;
        }

        .lock-card {
            background: #1e1e1e;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            border: 1px solid #333;
            text-align: center;
            width: 320px;
            max-width: 90%;
        }

        .lock-icon { font-size: 36px; margin-bottom: 20px; display: block; }
        .lock-title { margin: 0 0 8px; font-size: 20px; font-weight: 600; color: #fff; }
        .lock-subtitle { margin: 0 0 24px; color: #888; font-size: 14px; }

        .lock-input {
            background: #2d2d2d;
            border: 1px solid #404040;
            color: white;
            padding: 14px;
            border-radius: 6px;
            font-size: 18px;
            text-align: center;
            letter-spacing: 8px;
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 16px;
            outline: none;
            transition: all 0.2s;
        }
        
        .lock-input:focus {
            border-color: ${CONFIG.UI.primaryColor};
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        
        .lock-input.error {
            border-color: #ef4444;
            animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }

        .lock-btn {
            background-color: ${CONFIG.UI.primaryColor};
            color: white;
            border: none;
            padding: 12px;
            border-radius: 6px;
            width: 100%;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .lock-btn:hover { filter: brightness(1.1); }
        .lock-btn:active { transform: scale(0.98); }

        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
    `;

    class SiteLock {
        constructor() {
            // Generate unique session key based on domain to avoid cross-site unlock
            this.sessionKey = CONFIG.SESSION_KEY_PREFIX + window.location.hostname;
            this.checkSession();
        }

        checkSession() {
            if (sessionStorage.getItem(this.sessionKey) === "true") return;

            // Inject styles immediately
            this.injectStyles();

            // Wait for body to be available
            if (document.body) {
                this.renderUI();
            } else {
                window.addEventListener('DOMContentLoaded', () => this.renderUI());
            }
        }

        injectStyles() {
            const styleSheet = document.createElement("style");
            styleSheet.id = "site-lock-styles";
            styleSheet.textContent = CSS_STYLES;
            document.documentElement.appendChild(styleSheet);
        }

        renderUI() {
            if (document.getElementById('site-lock-overlay')) return;

            const overlay = document.createElement("div");
            overlay.id = "site-lock-overlay";
            overlay.innerHTML = `
                <div class="lock-card">
                    <span class="lock-icon">🔒</span>
                    <h1 class="lock-title">${CONFIG.UI.title}</h1>
                    <p class="lock-subtitle">${CONFIG.UI.subtitle}</p>
                    <input type="password" class="lock-input" id="lock-pin" placeholder="${CONFIG.UI.placeholder}" maxlength="20" autocomplete="off" autofocus>
                    <button class="lock-btn" id="lock-btn">${CONFIG.UI.btnText}</button>
                </div>
            `;
            document.body.appendChild(overlay);

            // Re-focus helper
            setTimeout(() => {
                const input = document.getElementById("lock-pin");
                if (input) input.focus();
            }, 50);

            this.bindEvents();
        }

        bindEvents() {
            const input = document.getElementById("lock-pin");
            const btn = document.getElementById("lock-btn");
            const overlay = document.getElementById("site-lock-overlay");

            const validate = () => {
                if (input.value === CONFIG.PIN) {
                    this.unlock();
                } else {
                    input.value = "";
                    input.classList.add("error");
                    input.focus();
                    setTimeout(() => input.classList.remove("error"), 500);
                }
            };

            btn.addEventListener("click", validate);
            
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    validate();
                }
            });

            // Maintain focus on input
            overlay.addEventListener("click", (e) => {
                if(e.target === overlay) input.focus();
            });
        }

        unlock() {
            sessionStorage.setItem(this.sessionKey, "true");
            
            const overlay = document.getElementById("site-lock-overlay");
            const styles = document.getElementById("site-lock-styles");
            
            if (overlay) overlay.remove();
            if (styles) styles.remove();
        }
    }

    new SiteLock();

})();
