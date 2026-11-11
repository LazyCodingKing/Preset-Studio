export const STUDIO_BASE_CSS = `
.ps-root {
  --ps-bg: var(--lumiverse-fill, #1c1b22);
  --ps-bg-deep: var(--lumiverse-bg-deep, #13111a);
  --ps-surface: var(--lumiverse-fill-subtle, #25242e);
  --ps-elevated: var(--lumiverse-bg-elevated, #2d2b38);
  --ps-border: var(--lumiverse-border, rgba(255,255,255,0.12));
  --ps-text: var(--lumiverse-text, #f2f0f7);
  --ps-muted: var(--lumiverse-text-muted, #a39eb5);
  --ps-accent: var(--lumiverse-primary, #a795e8);
  --ps-accent-contrast: var(--lumiverse-primary-contrast, #161320);
  --ps-danger: var(--lumiverse-danger, #e57373);
  --ps-success: var(--lumiverse-success, #66bb6a);
  --ps-warning: var(--lumiverse-warning, #ffb74d);
  --ps-radius: var(--lumiverse-radius, 10px);
  --ps-kb-inset: 0px;
  container-type: inline-size;
  color: var(--ps-text);
  font: inherit;
  line-height: 1.45;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  box-sizing: border-box;
  padding: 0;
}
.ps-root *, .ps-root *::before, .ps-root *::after { box-sizing: border-box; }
.ps-root h2, .ps-root h3, .ps-root h4 { margin: 0; font-weight: 650; letter-spacing: -0.02em; }
.ps-root p { margin: 0; line-height: 1.5; }
.ps-muted { color: var(--ps-muted); font-size: 0.85rem; }
.ps-mono { font-family: var(--lumiverse-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 0.83rem; }
.ps-row, .ps-actions, .ps-chips { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.ps-between { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.ps-root button, .ps-root select, .ps-root input:not([type="checkbox"]):not([type="radio"]), .ps-root textarea {
  font: inherit;
  font-size: 0.92rem;
  color: var(--ps-text);
  background: var(--ps-bg);
  border: 1px solid var(--ps-border);
  border-radius: calc(var(--ps-radius) - 2px);
  padding: 7px 11px;
  min-height: 38px;
  max-width: 100%;
  transition: border-color 0.14s ease, background-color 0.14s ease, transform 0.1s ease;
}
.ps-root button { cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-weight: 550; }
.ps-root button:hover:not(:disabled) { border-color: var(--ps-accent); background: var(--ps-elevated); }
.ps-root button:focus-visible, .ps-root input:focus-visible, .ps-root textarea:focus-visible, .ps-root select:focus-visible {
  outline: 2px solid var(--ps-accent);
  outline-offset: 2px;
}
.ps-root button:disabled { opacity: 0.45; cursor: not-allowed; }
.ps-btn-sm { min-height: 31px !important; padding: 4px 9px !important; font-size: 0.81rem !important; }
.ps-btn-icon { min-width: 34px; padding: 5px !important; }
.ps-primary { background: var(--ps-accent) !important; color: var(--ps-accent-contrast) !important; border-color: transparent !important; font-weight: 700 !important; }
.ps-primary:hover:not(:disabled) { filter: brightness(1.07); }
.ps-danger-btn { border-color: rgba(229,115,115,0.4) !important; color: var(--ps-danger) !important; }
.ps-panel {
  background: var(--ps-surface);
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius);
  padding: 14px;
  margin: 10px 0;
}
.ps-card {
  background: var(--ps-bg);
  border: 1px solid var(--ps-border);
  border-radius: calc(var(--ps-radius) - 2px);
  padding: 12px;
}
.ps-collapsible {
  background: var(--ps-bg);
  border: 1px solid var(--ps-border);
  border-radius: calc(var(--ps-radius) - 2px);
  padding: 10px 12px;
  margin-top: 10px;
}
.ps-collapsible > summary {
  cursor: pointer;
  font-weight: 600;
  font-size: 0.88rem;
  user-select: none;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.ps-collapsible > summary::-webkit-details-marker { display: none; }
.ps-collapsible[open] > summary {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--ps-border);
}
.ps-grid { display: grid; gap: 12px; }
.ps-grid-3 { display: grid; gap: 12px; }
.ps-root label { display: grid; gap: 5px; min-width: 0; flex: 1; font-size: 0.85rem; font-weight: 550; }
.ps-root input:not([type="checkbox"]):not([type="radio"]), .ps-root textarea, .ps-root select { width: 100%; min-width: 0; }
.ps-root textarea { resize: vertical; min-height: 110px; line-height: 1.5; }
.ps-root .ps-content { min-height: 250px; font-family: var(--lumiverse-font-mono, inherit); }
.ps-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.74rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--ps-bg);
  border: 1px solid var(--ps-border);
  color: var(--ps-muted);
  white-space: nowrap;
}
.ps-pill-accent { border-color: var(--ps-accent); color: var(--ps-accent); }
.ps-pill-warn { border-color: var(--ps-warning); color: var(--ps-warning); }
.ps-pill-ok { border-color: var(--ps-success); color: var(--ps-success); }
.ps-step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(167, 149, 232, 0.16);
  border: 1px solid var(--ps-accent);
  color: var(--ps-accent);
  font-size: 0.74rem;
  font-weight: 700;
  flex: none;
}
.ps-starter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
  gap: 8px;
  margin-top: 10px;
}
.ps-starter-card {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: space-between !important;
  text-align: left !important;
  padding: 10px 12px !important;
  height: 100%;
  background: var(--ps-bg) !important;
  border: 1px solid var(--ps-border) !important;
  border-radius: 8px !important;
}
.ps-starter-card:hover:not(:disabled) {
  border-color: var(--ps-accent) !important;
  background: var(--ps-elevated) !important;
}
.ps-live-preview-grid {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}
@container (min-width: 760px) {
  .ps-live-preview-grid {
    grid-template-columns: minmax(240px, 1fr) minmax(260px, 1.15fr);
  }
}
.ps-chat-bubble {
  background: var(--lumiverse-card-bg, var(--ps-bg));
  border: 1px solid var(--ps-border);
  border-radius: calc(var(--ps-radius) + 2px);
  padding: 14px 16px;
  min-height: 220px;
  max-height: 580px;
  overflow-y: auto;
  overscroll-behavior: contain;
  box-shadow: var(--lumiverse-shadow-sm, 0 4px 14px rgba(0,0,0,0.22));
}
.ps-chat-prose {
  color: var(--lumiverse-text, var(--ps-text));
  font-family: var(--lumiverse-font-family, inherit);
  font-size: 0.95rem;
  line-height: 1.65;
  overflow-wrap: anywhere;
}
.ps-chat-prose p { margin: 0 0 0.85em 0; line-height: 1.65; }
.ps-chat-prose p:last-child { margin-bottom: 0; }
.ps-chat-prose .ps-prose-dialogue { color: var(--lumiverse-prose-dialogue, #b39ddb); }
.ps-chat-prose .ps-prose-italic, .ps-chat-prose em, .ps-chat-prose i { color: var(--lumiverse-prose-italic, #c5cae9); font-style: italic; }
.ps-chat-prose .ps-prose-bold, .ps-chat-prose strong, .ps-chat-prose b { color: var(--lumiverse-prose-bold, inherit); font-weight: 700; }
.ps-chat-prose blockquote {
  margin: 8px 0;
  padding: 6px 12px;
  border-left: 3px solid var(--lumiverse-prose-blockquote, var(--ps-accent));
  background: rgba(255,255,255,0.03);
  border-radius: 4px;
}
.ps-chat-prose details {
  margin: 8px 0;
  padding: 8px 12px;
  background: var(--ps-surface);
  border: 1px solid var(--ps-border);
  border-radius: 8px;
}
.ps-chat-prose details > summary { cursor: pointer; font-weight: 600; }
.ps-chat-prose .ps-inline-code {
  font-family: var(--lumiverse-font-mono, monospace);
  font-size: 0.85em;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--ps-surface);
  border: 1px solid var(--ps-border);
}
.ps-chat-prose .ps-code-block {
  font-family: var(--lumiverse-font-mono, monospace);
  font-size: 0.84rem;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--ps-bg-deep);
  border: 1px solid var(--ps-border);
  overflow-x: auto;
  margin: 8px 0;
}
.ps-html-island-host {
  display: block;
  margin: 8px 0;
}
.ps-notice {
  border-left: 3px solid var(--ps-accent);
  padding: 10px 12px;
  background: var(--ps-surface);
  border-radius: 6px;
  margin: 10px 0;
  font-size: 0.9rem;
}
.ps-list { display: grid; gap: 6px; min-width: 0; }
.ps-col-list, .ps-col-detail { min-width: 0; max-width: 100%; overflow-x: hidden; }
.ps-col-list {
  max-height: min(720px, calc(var(--app-scaled-viewport-height, 100vh) - 190px)) !important;
  min-height: 300px;
  overflow-y: scroll !important;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  scrollbar-width: auto;
  scrollbar-color: var(--ps-accent) rgba(0, 0, 0, 0.35);
  padding: 10px 8px 12px 10px !important;
}
.ps-col-list::-webkit-scrollbar { width: 10px; height: 10px; display: block; }
.ps-col-list::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.35); border-radius: 999px; }
.ps-col-list::-webkit-scrollbar-thumb {
  background: rgba(167, 149, 232, 0.55);
  border-radius: 999px;
  border: 2px solid rgba(20, 17, 28, 0.8);
  min-height: 36px;
}
.ps-col-list::-webkit-scrollbar-thumb:hover { background: var(--ps-accent); }
.ps-block.ps-is-off { opacity: 0.56; }
.ps-toggle-on {
  background: rgba(102, 187, 106, 0.16) !important;
  border-color: var(--ps-success) !important;
  color: var(--ps-success) !important;
  font-weight: 700 !important;
}
.ps-block {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border: 1px solid var(--ps-border);
  border-radius: 8px;
  padding: 6px 7px;
  background: var(--ps-bg);
  transition: border-color 0.14s ease, background-color 0.14s ease;
}
.ps-block.ps-is-cat {
  background: var(--ps-elevated);
  border-left: 3px solid var(--ps-accent);
  margin-top: 6px;
}
.ps-block.ps-is-child { margin-left: 8px; width: calc(100% - 8px); }
.ps-block.ps-active-row { border-color: var(--ps-accent); box-shadow: 0 0 0 1px var(--ps-accent); background: rgba(167, 149, 232, 0.07); }
.ps-block.ps-dragging { opacity: 0.4; border-style: dashed; }
.ps-block.ps-drag-over-top { border-top: 2px solid var(--ps-accent); }
.ps-block.ps-drag-over-bottom { border-bottom: 2px solid var(--ps-accent); }
.ps-drag-handle {
  cursor: grab;
  user-select: none;
  touch-action: none;
  color: var(--ps-muted);
  padding: 2px;
  border-radius: 4px;
  font-size: 0.95rem;
  line-height: 1;
  flex: none;
}
.ps-drag-handle:hover { color: var(--ps-accent); background: var(--ps-elevated); }
.ps-drag-handle:active { cursor: grabbing; }
.ps-block-main {
  flex: 1 1 0%;
  min-width: 0;
  overflow: hidden;
  text-align: left;
  border: 0 !important;
  background: transparent !important;
  padding: 2px 4px !important;
  min-height: 34px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: center !important;
  gap: 2px !important;
}
.ps-block-title-row {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  min-width: 0;
}
.ps-block-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  overflow-wrap: anywhere;
  font-weight: 600;
  font-size: 0.86rem;
  line-height: 1.28;
  min-width: 0;
  flex: 1;
}
.ps-block-sub {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  font-size: 0.71rem;
  color: var(--ps-muted);
  line-height: 1.2;
}
.ps-mini-badge {
  display: inline-flex;
  align-items: center;
  padding: 0 5px;
  border-radius: 4px;
  font-size: 0.68rem;
  background: var(--ps-surface);
  border: 1px solid var(--ps-border);
  color: var(--ps-muted);
}
.ps-mini-badge.ps-def { color: var(--ps-accent); border-color: var(--ps-accent); }
.ps-mini-badge.ps-ref { color: var(--ps-warning); border-color: rgba(255, 183, 77, 0.45); }
.ps-row-actions { display: flex; align-items: center; gap: 3px; flex: none; }
.ps-row-step { display: none !important; }
.ps-block:hover .ps-row-step, .ps-block.ps-active-row .ps-row-step, .ps-block:focus-within .ps-row-step { display: inline-flex !important; }
.ps-row-btn {
  min-height: 26px !important;
  min-width: 24px !important;
  padding: 2px 5px !important;
  font-size: 0.74rem !important;
  flex: none;
}
.ps-native-dialog {
  box-sizing: border-box;
  width: min(640px, calc(100vw - 24px));
  max-height: min(680px, calc(var(--app-scaled-viewport-height, 100vh) - 28px));
  margin: auto;
  padding: 18px;
  border: 1px solid var(--ps-border);
  border-radius: 12px;
  background: var(--ps-surface);
  color: var(--ps-text);
  overflow: auto;
  box-shadow: 0 20px 52px rgba(0, 0, 0, 0.65);
}
.ps-native-dialog::backdrop { background: rgba(8, 7, 12, 0.72); backdrop-filter: blur(3px); }
.ps-mark-del { background: rgba(229, 115, 115, 0.25); color: #ffcdd2; border-radius: 3px; padding: 0 2px; }
.ps-mark-ins { background: rgba(102, 187, 106, 0.25); color: #c8e6c9; border-radius: 3px; padding: 0 2px; }
.ps-ctx-menu {
  position: fixed;
  z-index: 10000;
  min-width: 210px;
  background: var(--ps-elevated);
  color: var(--ps-text);
  border: 1px solid var(--ps-border);
  border-radius: 9px;
  padding: 5px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55);
  display: grid;
  gap: 2px;
}
.ps-ctx-menu button {
  width: 100%;
  justify-content: flex-start !important;
  border: 0 !important;
  background: transparent !important;
  min-height: 34px !important;
  padding: 6px 10px !important;
  font-size: 0.85rem !important;
  border-radius: 6px !important;
}
.ps-ctx-menu button:hover:not(:disabled) { background: var(--ps-surface) !important; }
.ps-dot { width: 9px; height: 9px; border-radius: 50%; flex: none; display: inline-block; border: 1px solid rgba(255,255,255,0.25); }
.ps-swatch-btn { width: 26px; height: 26px; min-height: 26px !important; border-radius: 50% !important; padding: 0 !important; }
.ps-swatch-btn[aria-pressed="true"] { outline: 2px solid var(--ps-text); outline-offset: 2px; }
.ps-result { white-space: pre-wrap; overflow-wrap: anywhere; max-height: 440px; overflow: auto; overscroll-behavior: contain; padding: 12px; background: var(--ps-bg); border: 1px solid var(--ps-border); border-radius: 8px; line-height: 1.6; }
.ps-bar-stack { display: flex; height: 10px; border-radius: 999px; overflow: hidden; background: var(--ps-bg); border: 1px solid var(--ps-border); margin: 8px 0; }
.ps-bar-seg { height: 100%; transition: width 0.25s ease; }
.ps-test-columns {
  display: grid;
  gap: 14px;
  align-items: start;
  margin-bottom: 12px;
}
.ps-test-col-ctrl, .ps-test-col-output {
  min-width: 0;
  max-width: 100%;
}
@container (min-width: 860px) {
  .ps-test-columns {
    grid-template-columns: minmax(320px, 0.92fr) minmax(360px, 1.28fr);
  }
}
`;

export const STUDIO_POLISH_CSS = `
.ps-mount { pointer-events: none; }
.ps-root.ps-full {
  pointer-events: auto;
  position: fixed;
  inset: 0;
  width: var(--app-scaled-viewport-width, 100%);
  height: var(--app-scaled-viewport-height, 100%);
  z-index: 1;
  background: var(--ps-bg-deep);
  padding: 0;
  overscroll-behavior: contain;
}
.ps-shell {
  max-width: 1640px;
  margin: 0 auto;
  padding: 12px clamp(10px, 2vw, 28px) calc(84px + var(--ps-kb-inset, 0px) + env(safe-area-inset-bottom, 0px));
}
.ps-full .ps-shell { padding-top: max(16px, env(safe-area-inset-top, 0px)); }
.ps-masthead {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--ps-border);
  padding-bottom: 12px;
  margin-bottom: 10px;
}
.ps-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
.ps-mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--ps-accent);
  border-radius: 10px;
  color: var(--ps-accent);
  background: var(--ps-surface);
  font-size: 19px;
  flex: none;
}
.ps-kicker { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.11em; color: var(--ps-muted); font-weight: 700; }
.ps-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  border-bottom: 1px solid var(--ps-border);
  margin: 10px 0 12px;
}
.ps-tabs button {
  border: 0 !important;
  border-radius: 8px 8px 0 0 !important;
  background: transparent !important;
  color: var(--ps-muted) !important;
  padding: 8px 12px !important;
  white-space: nowrap;
}
.ps-tabs button[aria-pressed="true"] {
  color: var(--ps-text) !important;
  background: var(--ps-surface) !important;
  box-shadow: inset 0 -3px var(--ps-accent);
  font-weight: 700 !important;
}
.ps-step { color: var(--ps-accent); font-size: 0.78em; font-weight: 700; margin-right: 4px; }
.ps-columns { display: grid; gap: 14px; align-items: start; }
.ps-mobile-back { display: none; }
@container (max-width: 799px) {
  .ps-columns.ps-has-detail .ps-col-list { display: none; }
  .ps-columns:not(.ps-has-detail) .ps-col-detail { display: none; }
  .ps-mobile-back { display: inline-flex !important; }
}
@container (min-width: 800px) {
  .ps-columns { grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.55fr); }
  .ps-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ps-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@container (min-width: 1220px) {
  .ps-columns.ps-with-xray { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.35fr) minmax(0, 0.85fr); }
}
`;
