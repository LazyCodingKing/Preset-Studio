export const STUDIO_BASE_CSS = `
.ps-root {
  --ps-bg: var(--lumiverse-fill, var(--lumiverse-bg, #17161d));
  --ps-bg-deep: var(--lumiverse-bg-deep, var(--lumiverse-bg, #100f15));
  --ps-surface: var(--lumiverse-fill-subtle, var(--lumiverse-bg-elevated, #201e29));
  --ps-elevated: var(--lumiverse-bg-elevated, #292734);
  --ps-border: var(--lumiverse-border, rgba(128, 128, 160, 0.22));
  --ps-border-hover: var(--lumiverse-border-hover, rgba(128, 128, 160, 0.38));
  --ps-text: var(--lumiverse-text, #f3f1f8);
  --ps-muted: var(--lumiverse-text-muted, #9e99b0);
  --ps-accent: var(--lumiverse-primary, #a795e8);
  --ps-accent-soft: var(--lumiverse-primary-015, rgba(167, 149, 232, 0.14));
  --ps-accent-border: var(--lumiverse-primary-050, rgba(167, 149, 232, 0.45));
  --ps-accent-contrast: var(--lumiverse-primary-contrast, #14111d);
  --ps-danger: var(--lumiverse-danger, #ef6c6c);
  --ps-danger-soft: var(--lumiverse-danger-015, rgba(239, 108, 108, 0.14));
  --ps-success: var(--lumiverse-success, #5ec269);
  --ps-success-soft: var(--lumiverse-success-015, rgba(94, 194, 105, 0.14));
  --ps-warning: var(--lumiverse-warning, #f5b942);
  --ps-warning-soft: var(--lumiverse-warning-015, rgba(245, 185, 66, 0.12));
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
.ps-muted { color: var(--ps-muted); font-size: 0.83rem; }
.ps-mono { font-family: var(--lumiverse-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 0.82rem; }
.ps-row, .ps-actions, .ps-chips { display: flex; gap: 7px; align-items: center; flex-wrap: wrap; }
.ps-between { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }

/* Form Controls & Buttons */
.ps-root button, .ps-root select, .ps-root input:not([type="checkbox"]):not([type="radio"]), .ps-root textarea {
  font: inherit;
  font-size: 0.88rem;
  color: var(--ps-text);
  background: var(--ps-bg);
  border: 1px solid var(--ps-border);
  border-radius: calc(var(--ps-radius) - 2px);
  padding: 6px 11px;
  min-height: 36px;
  max-width: 100%;
  transition: border-color 0.14s ease, background-color 0.14s ease, box-shadow 0.14s ease;
}
.ps-root button {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 560;
  user-select: none;
}
.ps-root button:hover:not(:disabled) {
  border-color: var(--ps-border-hover);
  background: var(--ps-elevated);
}
.ps-root button:focus-visible, .ps-root input:focus-visible, .ps-root textarea:focus-visible, .ps-root select:focus-visible {
  outline: 2px solid var(--ps-accent);
  outline-offset: 1px;
}
.ps-root button:disabled { opacity: 0.42; cursor: not-allowed; }
.ps-btn-sm { min-height: 30px !important; padding: 3px 9px !important; font-size: 0.8rem !important; }
.ps-btn-icon { min-width: 32px; padding: 4px !important; }
.ps-primary {
  background: var(--ps-accent) !important;
  color: var(--ps-accent-contrast) !important;
  border-color: transparent !important;
  font-weight: 700 !important;
  box-shadow: 0 2px 10px var(--ps-accent-soft);
}
.ps-primary:hover:not(:disabled) { filter: brightness(1.08); }
.ps-danger-btn { border-color: var(--lumiverse-danger-050, rgba(239, 108, 108, 0.42)) !important; color: var(--ps-danger) !important; }
.ps-danger-btn:hover:not(:disabled) { background: var(--ps-danger-soft) !important; }

/* Surfaces & Cards */
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
  padding: 11px 12px;
}
.ps-empty-state {
  text-align: center;
  padding: 28px 16px;
  color: var(--ps-muted);
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
  font-size: 0.86rem;
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

/* Grids & Typography */
.ps-grid { display: grid; gap: 10px; }
.ps-grid-3 { display: grid; gap: 10px; }
.ps-root label { display: grid; gap: 4px; min-width: 0; flex: 1; font-size: 0.82rem; font-weight: 560; color: var(--ps-muted); }
.ps-root label > input, .ps-root label > select, .ps-root label > textarea { color: var(--ps-text); }
.ps-root input:not([type="checkbox"]):not([type="radio"]), .ps-root textarea, .ps-root select { width: 100%; min-width: 0; }
.ps-root textarea { resize: vertical; min-height: 100px; line-height: 1.55; }
.ps-root .ps-content { min-height: 270px; font-family: var(--lumiverse-font-mono, ui-monospace, monospace); font-size: 0.87rem; }

/* Pills & Badges */
.ps-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.73rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--ps-bg);
  border: 1px solid var(--ps-border);
  color: var(--ps-muted);
  white-space: nowrap;
}
.ps-pill-accent { border-color: var(--ps-accent-border); color: var(--ps-accent); background: var(--ps-accent-soft); }
.ps-pill-warn { border-color: var(--lumiverse-warning-050, rgba(245, 185, 66, 0.5)); color: var(--ps-warning); background: var(--ps-warning-soft); }
.ps-pill-ok { border-color: var(--lumiverse-success-050, rgba(94, 194, 105, 0.5)); color: var(--ps-success); background: var(--ps-success-soft); }
.ps-step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background: var(--ps-accent-soft);
  border: 1px solid var(--ps-accent);
  color: var(--ps-accent);
  font-size: 0.72rem;
  font-weight: 700;
  flex: none;
}

/* Segmented Sub-Tab Switcher */
.ps-seg-bar {
  display: inline-flex;
  background: var(--ps-bg);
  border: 1px solid var(--ps-border);
  border-radius: 8px;
  padding: 3px;
  gap: 3px;
}
.ps-seg-bar button {
  border: 0 !important;
  background: transparent !important;
  min-height: 28px !important;
  padding: 3px 10px !important;
  font-size: 0.79rem !important;
  border-radius: 6px !important;
  color: var(--ps-muted) !important;
}
.ps-seg-bar button[aria-pressed="true"], .ps-seg-bar button.ps-seg-active {
  background: var(--ps-elevated) !important;
  color: var(--ps-text) !important;
  font-weight: 650 !important;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

/* Starter Cards */
.ps-starter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  margin-top: 8px;
}
.ps-starter-card {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: space-between !important;
  text-align: left !important;
  padding: 10px 12px !important;
  height: 100%;
  background: var(--ps-surface) !important;
  border: 1px solid var(--ps-border) !important;
  border-radius: 8px !important;
}
.ps-starter-card:hover:not(:disabled) {
  border-color: var(--ps-accent) !important;
  background: var(--ps-elevated) !important;
}

/* Live Preview Split Grid */
.ps-live-preview-grid {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}
@container (min-width: 760px) {
  .ps-live-preview-grid {
    grid-template-columns: minmax(240px, 1fr) minmax(260px, 1.2fr);
  }
}

/* Chat Bubble Preview */
.ps-chat-bubble {
  background: var(--lumiverse-card-bg, var(--ps-bg));
  border: 1px solid var(--ps-border);
  border-radius: calc(var(--ps-radius) + 2px);
  padding: 16px 18px;
  min-height: 250px;
  max-height: 600px;
  overflow-y: auto;
  overscroll-behavior: contain;
  box-shadow: var(--lumiverse-shadow-sm, 0 4px 16px rgba(0,0,0,0.22));
}
.ps-chat-prose {
  color: var(--lumiverse-text, var(--ps-text));
  font-family: var(--lumiverse-font-family, inherit);
  font-size: 0.94rem;
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
.ps-html-island-host { display: block; margin: 8px 0; }

.ps-notice {
  border-left: 3px solid var(--ps-accent);
  padding: 9px 12px;
  background: var(--ps-surface);
  border-radius: 6px;
  margin: 8px 0;
  font-size: 0.86rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

/* Block Outline List */
.ps-list { display: grid; gap: 5px; min-width: 0; }
.ps-col-list, .ps-col-detail { min-width: 0; max-width: 100%; }
.ps-col-list {
  max-height: min(740px, calc(var(--app-scaled-viewport-height, 100vh) - 175px));
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 12px !important;
}
.ps-block.ps-is-off { opacity: 0.52; }
.ps-toggle-on {
  background: rgba(94, 194, 105, 0.16) !important;
  border-color: rgba(94, 194, 105, 0.55) !important;
  color: var(--ps-success) !important;
  font-weight: 700 !important;
}
.ps-block {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border: 1px solid var(--ps-border);
  border-radius: 8px;
  padding: 5px 8px;
  background: var(--ps-bg);
  transition: border-color 0.12s ease, background-color 0.12s ease;
}
.ps-block:hover { border-color: var(--ps-border-hover); }
.ps-block.ps-is-cat {
  background: var(--ps-elevated);
  border-left: 3px solid var(--ps-accent);
  margin-top: 6px;
}
.ps-block.ps-is-child { margin-left: 10px; width: calc(100% - 10px); }
.ps-block.ps-active-row {
  border-color: var(--ps-accent);
  box-shadow: inset 0 0 0 1px var(--ps-accent);
  background: var(--ps-accent-soft);
}
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
  font-size: 0.9rem;
  line-height: 1;
  flex: none;
  opacity: 0.65;
}
.ps-drag-handle:hover { opacity: 1; color: var(--ps-accent); }
.ps-block-main {
  flex: 1 1 0%;
  min-width: 0;
  overflow: hidden;
  text-align: left;
  border: 0 !important;
  background: transparent !important;
  padding: 2px 4px !important;
  min-height: 32px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: center !important;
  gap: 1px !important;
}
.ps-block-title-row {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  min-width: 0;
}
.ps-block-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
  font-size: 0.84rem;
  line-height: 1.25;
  min-width: 0;
  flex: 1;
}
.ps-block-sub {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  font-size: 0.7rem;
  color: var(--ps-muted);
  line-height: 1.15;
}
.ps-row-actions { display: flex; align-items: center; gap: 3px; flex: none; }
.ps-row-step { display: none !important; }
.ps-block:hover .ps-row-step, .ps-block.ps-active-row .ps-row-step, .ps-block:focus-within .ps-row-step { display: inline-flex !important; }
@media (hover: none) {
  .ps-row-step { display: inline-flex !important; }
}
.ps-row-btn {
  min-height: 24px !important;
  min-width: 24px !important;
  padding: 2px 6px !important;
  font-size: 0.72rem !important;
  flex: none;
}
.ps-perm-banner {
  border: 1px solid var(--lumiverse-warning-050, rgba(245, 185, 66, 0.45));
  background: var(--ps-warning-soft);
  border-radius: var(--ps-radius);
  padding: 9px 12px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 0.83rem;
}
.ps-diff-box {
  font-family: var(--lumiverse-font-mono, ui-monospace, monospace);
  font-size: 0.8rem;
  border: 1px solid var(--ps-border);
  border-radius: 8px;
  background: var(--ps-bg);
  max-height: 440px;
  overflow: auto;
  padding: 6px 0;
}
.ps-diff-line { padding: 2px 10px; white-space: pre-wrap; overflow-wrap: anywhere; }
.ps-diff-rem { background: var(--ps-danger-soft); color: var(--ps-danger); }
.ps-diff-add { background: var(--ps-success-soft); color: var(--ps-success); }
.ps-diff-same { color: var(--ps-muted); }
.ps-dialog-host { display: contents; }

/* Native Dialogs & Context Menu */
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
.ps-mark-del { background: rgba(239, 108, 108, 0.25); color: #ffcdd2; border-radius: 3px; padding: 0 2px; }
.ps-mark-ins { background: rgba(94, 194, 105, 0.25); color: #c8e6c9; border-radius: 3px; padding: 0 2px; }
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
  min-height: 32px !important;
  padding: 5px 10px !important;
  font-size: 0.83rem !important;
  border-radius: 6px !important;
}
.ps-ctx-menu button:hover:not(:disabled) { background: var(--ps-surface) !important; }
.ps-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; display: inline-block; }
.ps-swatch-btn { width: 24px; height: 24px; min-height: 24px !important; border-radius: 50% !important; padding: 0 !important; }
.ps-swatch-btn[aria-pressed="true"] { outline: 2px solid var(--ps-text); outline-offset: 2px; }
.ps-result { white-space: pre-wrap; overflow-wrap: anywhere; max-height: 440px; overflow: auto; overscroll-behavior: contain; padding: 12px; background: var(--ps-bg); border: 1px solid var(--ps-border); border-radius: 8px; line-height: 1.55; font-size: 0.84rem; }
.ps-bar-stack { display: flex; height: 8px; border-radius: 999px; overflow: hidden; background: var(--ps-bg); border: 1px solid var(--ps-border); margin: 8px 0; }
.ps-bar-seg { height: 100%; transition: width 0.25s ease; }

/* Test Lab Two-Column Layout */
.ps-test-columns {
  display: grid;
  gap: 14px;
  align-items: start;
  margin-bottom: 12px;
}
.ps-test-col-ctrl, .ps-test-col-output { min-width: 0; max-width: 100%; }
@container (min-width: 840px) {
  .ps-test-columns {
    grid-template-columns: minmax(310px, 0.88fr) minmax(380px, 1.32fr);
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
  max-width: 1620px;
  margin: 0 auto;
  padding: 10px clamp(10px, 1.8vw, 24px) calc(72px + var(--ps-kb-inset, 0px) + env(safe-area-inset-bottom, 0px));
}
.ps-full .ps-shell { padding-top: max(12px, env(safe-area-inset-top, 0px)); }

/* Unified Compact Studio Topbar */
.ps-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  background: var(--ps-surface);
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius);
  padding: 8px 12px;
  margin-bottom: 10px;
}
.ps-brand { display: flex; align-items: center; gap: 9px; min-width: 0; }
.ps-mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--ps-accent-border);
  border-radius: 8px;
  color: var(--ps-accent);
  background: var(--ps-accent-soft);
  font-size: 16px;
  flex: none;
}

/* Primary 4-Tab Bar */
.ps-tabs {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: thin;
  gap: 6px;
  border-bottom: 1px solid var(--ps-border);
  padding-bottom: 8px;
  margin: 8px 0 12px;
}
.ps-tabs button {
  border: 1px solid transparent !important;
  border-radius: 8px !important;
  background: transparent !important;
  color: var(--ps-muted) !important;
  padding: 6px 13px !important;
  min-height: 34px !important;
  white-space: nowrap;
  flex: 0 0 auto;
  font-size: 0.86rem !important;
}
.ps-tabs button:hover:not(:disabled) {
  background: var(--ps-surface) !important;
  color: var(--ps-text) !important;
}
.ps-tabs button[aria-pressed="true"] {
  color: var(--ps-text) !important;
  background: var(--ps-surface) !important;
  border-color: var(--ps-accent) !important;
  box-shadow: 0 2px 10px var(--ps-accent-soft);
  font-weight: 700 !important;
}
.ps-step {
  color: var(--ps-accent);
  font-size: 0.74em;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--ps-accent-soft);
  margin-right: 3px;
}
.ps-columns { display: grid; gap: 12px; align-items: start; }
.ps-mobile-back { display: none; }
@container (max-width: 799px) {
  .ps-columns.ps-has-detail .ps-col-list { display: none; }
  .ps-columns:not(.ps-has-detail) .ps-col-detail { display: none; }
  .ps-mobile-back { display: inline-flex !important; }
}
@container (min-width: 800px) {
  .ps-columns { grid-template-columns: minmax(260px, 0.82fr) minmax(380px, 1.68fr); }
  .ps-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ps-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@container (min-width: 1220px) {
  .ps-columns.ps-with-xray { grid-template-columns: minmax(250px, 0.78fr) minmax(360px, 1.42fr) minmax(260px, 0.8fr); }
}
`;
