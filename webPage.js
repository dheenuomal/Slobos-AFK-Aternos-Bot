"use strict";

const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (m) => HTML_ESCAPES[m]);
}

// Reset, typography and chrome shared by every dashboard page
const BASE_STYLES = `
  *, *::before, *::after { box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #0d1117;
    color: #e6edf3;
    margin: 0;
    padding: 40px 24px;
  }

  main { width: 100%; margin: 0 auto; }

  header { margin-bottom: 32px; }
  header h1 {
    font-size: 26px;
    font-weight: 700;
    color: #f0f6fc;
    margin: 0;
    line-height: 1.2;
  }
  header p {
    font-size: 14px;
    color: #8b949e;
    margin: 6px 0 0;
    line-height: 1.5;
  }

  footer { margin-top: 32px; text-align: center; }
  footer p { font-size: 12px; color: #484f58; margin: 0; }
`;

// "Back to Dashboard" link used by every sub-page
const BACK_BUTTON_STYLES = `
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #8b949e;
    text-decoration: none;
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 8px;
    padding: 7px 14px;
    margin-bottom: 32px;
    transition: color 0.2s, background 0.2s;
  }
  .back-btn:hover { background: #21262d; color: #c9d1d9; }
`;

const BACK_BUTTON_HTML = `<a href="/" class="back-btn">&#8592; Back to Dashboard</a>`;

// Full HTML document: shared head/base styles plus page-specific styles and body
function renderPage({ title, styles = "", body, script = "", bodyAttrs = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${escapeHTML(title)}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" media="print" onload="this.media='all'"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
    <style>${BASE_STYLES}${styles}</style>
  </head>
  <body${bodyAttrs ? " " + bodyAttrs : ""}>
${body}
${script ? `<script>${script}</script>` : ""}
  </body>
</html>`;
}

module.exports = {
  escapeHTML,
  renderPage,
  BASE_STYLES,
  BACK_BUTTON_STYLES,
  BACK_BUTTON_HTML,
};
