# 🤖 Slobos & Mr. Juice Aternos 24/7 Hosting Bot

A Minecraft bot that helps keep an Aternos server online 24/7 by automatically joining it using a Mineflayer-based bot. Perfect for SMPs or small multiplayer servers that shut down when no players are online.

---

## ✨ Features
*   ✅ **Auto-Connect**: Automatically joins your server.
*   ✅ **Infinite Uptime**: Prevents AFK kicks and server shutdowns.
*   ✅ **Smart Reconnect**: Automatically reconnects if the internet drops or server restarts.
*   ✅ **Render-Ready**: Includes "Self-Ping" to run 24/7 for FREE on Render.com.
*   ✅ **Plugin Support**: Compatible with Paper/Spigot/Bukkit (auto-auth included).

---

## 🛠️ Requirements
*   **GitHub Account**
*   **Aternos Server**
*   **Render Account** (for 24/7 hosting)
*   **Common Sense!** 🧠        

---

## 🚀 Setup Guide

We have made setup super easy! Check out the guide below:

[**Detailed Google Doc Guide**](https://docs.google.com/document/d/1Fl0dRzP6O30ehp5-QcaB11IobF8I1JJhKUipzCWiCYA/edit?tab=t.0).

---

## 🔐 Configuration & Secrets

Secrets live in environment variables, **never** in `settings.json` (that file is committed to git). See [`.env.example`](.env.example).

| Variable | Purpose |
| --- | --- |
| `DASHBOARD_TOKEN` | **Required** to use the dashboard controls (`/start`, `/stop`, `/command`) and to view `/logs`. Without it those routes stay disabled. |
| `AUTO_AUTH_PASSWORD` | In-game `/login` / `/register` password used by auto-auth. |
| `BOT_ACCOUNT_PASSWORD` | Only for premium (Microsoft) accounts. |
| `DISCORD_WEBHOOK_URL` | Optional connect/disconnect/chat notifications. |

Generate a dashboard token with:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

On Render/Replit set these in the Environment/Secrets panel. Locally: `node --env-file=.env index.js`.

Your dashboard is publicly reachable, so anyone who can load it could otherwise run Minecraft commands as your bot — sign in at `/login` with the token before using the controls.

---

## ⚙️ Usage
*   **Start**: Just turn on your Aternos server. The bot will join automatically.
*   **Status**: Visit the Render URL to see a status dashboard.
*   **Controls/Logs**: Sign in at `/login` with your `DASHBOARD_TOKEN`.
*   **Chat**: The bot logs chat to the console.

---

## ⚠️ Disclaimer
This project is not affiliated with Aternos, Mojang, or Microsoft. Use at your own risk. Misuse may violate platform terms of service. This bot does not bypass Aternos queue limits; it only keeps the server active once it is online.

---

## ❤️ Credits
*   **Slobos (Discord: sloboscc)** — Original creator & idea. (The GOAT 🐐)
*   **Mr.Juice (Discord: Mr.Juice3046)** — Updates, Guide, & Maintenance.

**License**: MIT License
