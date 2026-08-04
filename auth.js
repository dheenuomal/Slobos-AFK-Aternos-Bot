"use strict";

const crypto = require("crypto");
const { dashboardToken } = require("./secrets");

const COOKIE_NAME = "afkbot_session";
const COOKIE_MAX_AGE = 12 * 60 * 60; // seconds

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(";").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  });
  return out;
}

function presentedToken(req) {
  const header = req.get("x-dashboard-token");
  if (header) return header.trim();

  const authorization = req.get("authorization") || "";
  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }

  return parseCookies(req.headers.cookie)[COOKIE_NAME] || "";
}

function isAuthenticated(req) {
  if (!dashboardToken) return false;
  const presented = presentedToken(req);
  return Boolean(presented) && timingSafeEqual(presented, dashboardToken);
}

// Blocks unauthenticated access to the control plane. When no DASHBOARD_TOKEN is
// configured the endpoints stay closed instead of being world-writable.
function requireAuth(req, res, next) {
  if (!dashboardToken) {
    return res.status(503).json({
      success: false,
      msg: "Controls are disabled: set the DASHBOARD_TOKEN environment variable and restart the bot.",
    });
  }

  if (!isAuthenticated(req)) {
    return res
      .status(401)
      .json({ success: false, msg: "Unauthorized: dashboard token required." });
  }

  return next();
}

// Rejects cross-site form/fetch submissions that would otherwise ride along on
// the session cookie.
function requireSameOrigin(req, res, next) {
  const origin = req.get("origin");
  if (!origin) return next();

  const host = req.get("host");
  let originHost = null;
  try {
    originHost = new URL(origin).host;
  } catch (e) {
    originHost = null;
  }

  if (originHost && host && originHost === host) return next();

  return res
    .status(403)
    .json({ success: false, msg: "Cross-origin request rejected." });
}

function sessionCookie(req, token) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${COOKIE_MAX_AGE}`,
  ];
  if ((req.get("x-forwarded-proto") || req.protocol) === "https") {
    parts.push("Secure");
  }
  return parts.join("; ");
}

function clearedCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0`;
}

// Fixed-window limiter, enough to stop token guessing and command flooding.
function rateLimiter({ windowMs, max }) {
  const hits = new Map();

  return function limit(req, res, next) {
    const now = Date.now();
    const key = req.ip || "unknown";
    const entry = hits.get(key);

    if (!entry || now - entry.start >= windowMs) {
      hits.set(key, { start: now, count: 1 });
    } else if (entry.count >= max) {
      return res
        .status(429)
        .json({ success: false, msg: "Too many requests - slow down." });
    } else {
      entry.count++;
    }

    if (hits.size > 1000) {
      for (const [k, v] of hits) {
        if (now - v.start >= windowMs) hits.delete(k);
      }
    }

    return next();
  };
}

module.exports = {
  COOKIE_NAME,
  clearedCookie,
  isAuthenticated,
  rateLimiter,
  requireAuth,
  requireSameOrigin,
  sessionCookie,
  timingSafeEqual,
};
