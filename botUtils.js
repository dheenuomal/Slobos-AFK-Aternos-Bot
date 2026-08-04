"use strict";

const http = require("http");
const https = require("https");

const { addLog } = require("./logger");

// Random integer in [min, max]
function randomMs(minMs, maxMs) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

// base + random(0..spread)
function jitter(base, spread) {
  return base + Math.floor(Math.random() * spread);
}

// Bot is connected and usable
function isBotReady(bot, botState) {
  return Boolean(bot && botState.connected);
}

// Bot is usable and exposes control state (not yet available while connecting)
function canControl(bot, botState) {
  return isBotReady(bot, botState) && typeof bot.setControlState === "function";
}

// Hold a control down, then release it after durationMs
function pulseControl(bot, control, durationMs) {
  if (typeof bot.setControlState !== "function") return;
  bot.setControlState(control, true);
  setTimeout(() => {
    if (bot && typeof bot.setControlState === "function") {
      bot.setControlState(control, false);
    }
  }, durationMs);
}

// Run fn, logging any throw as "[tag] Error: message" instead of crashing
function safeRun(tag, fn) {
  try {
    return fn();
  } catch (e) {
    addLog(`[${tag}] Error: ${e.message}`);
    return undefined;
  }
}

function clearTimer(id) {
  if (id) clearTimeout(id);
  return null;
}

// Push an error onto botState.errors, capping the array to avoid a memory leak
function recordError(botState, entry) {
  botState.errors.push({ time: Date.now(), ...entry });
  if (botState.errors.length > 100) {
    botState.errors = botState.errors.slice(-50);
  }
}

const NETWORK_ERROR_PATTERNS = [
  "PartialReadError",
  "ECONNRESET",
  "EPIPE",
  "ETIMEDOUT",
  "ENOTFOUND",
  "timed out",
  "write after end",
  "This socket has been ended",
];

function isNetworkError(message) {
  const msg = String(message);
  return NETWORK_ERROR_PATTERNS.some((pattern) => msg.includes(pattern));
}

// http/https module matching a URL's scheme
function httpModuleFor(url) {
  return String(url).startsWith("https") ? https : http;
}

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s} s`;
}

module.exports = {
  randomMs,
  jitter,
  isBotReady,
  canControl,
  pulseControl,
  safeRun,
  clearTimer,
  recordError,
  isNetworkError,
  httpModuleFor,
  formatUptime,
};
