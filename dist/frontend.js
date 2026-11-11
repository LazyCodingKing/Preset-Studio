// src/studio-styles.ts
var STUDIO_BASE_CSS = `
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
var STUDIO_POLISH_CSS = `
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

// src/studio-core.ts
var SWATCHES = ["#a795e8", "#64b5f6", "#4db6ac", "#81c784", "#ffd54f", "#ffb74d", "#e57373", "#f06292"];
var TRIGGERS = ["normal", "continue", "regenerate", "swipe", "impersonate", "quiet"];
var MACRO_CATALOG = [
  { group: "Identity & Card", label: "{{char}} — Character Name", snippet: "{{char}}" },
  { group: "Identity & Card", label: "{{user}} — User / Persona Name", snippet: "{{user}}" },
  { group: "Identity & Card", label: "{{description}} — Character Description", snippet: "{{description}}" },
  { group: "Identity & Card", label: "{{personality}} — Character Personality", snippet: "{{personality}}" },
  { group: "Identity & Card", label: "{{scenario}} — Scenario", snippet: "{{scenario}}" },
  { group: "Identity & Card", label: "{{persona}} — User Persona", snippet: "{{persona}}" },
  { group: "Identity & Card", label: "{{mesExamples}} — Example Dialogue", snippet: "{{mesExamples}}" },
  { group: "Identity & Card", label: "{{system}} — Character System Prompt", snippet: "{{system}}" },
  { group: "Identity & Card", label: "{{charPostHistoryInstructions}} — Post-History / Jailbreak", snippet: "{{charPostHistoryInstructions}}" },
  { group: "Identity & Card", label: "{{charTags}} — Character Tags List", snippet: "{{charTags}}" },
  { group: "Chat & Context", label: "{{lastMessage}} — Last Message", snippet: "{{lastMessage}}" },
  { group: "Chat & Context", label: "{{lastUserMessage}} — Last User Message", snippet: "{{lastUserMessage}}" },
  { group: "Chat & Context", label: "{{lastCharMessage}} — Last Character Message", snippet: "{{lastCharMessage}}" },
  { group: "Chat & Context", label: "{{messageCount}} — Message Count", snippet: "{{messageCount}}" },
  { group: "Chat & Context", label: "{{isGroupChat}} — Group Chat Condition", snippet: "{{isGroupChat}}" },
  { group: "Chat & Context", label: "{{group}} — Group Members", snippet: "{{group}}" },
  { group: "Chat & Context", label: "{{isNarrator}} — Narrator Persona Flag", snippet: "{{isNarrator}}" },
  { group: "Chat & Context", label: "{{model}} — Active Model Name", snippet: "{{model}}" },
  { group: "Chat & Context", label: "{{maxContext}} — Max Context Tokens", snippet: "{{maxContext}}" },
  { group: "Variables & Control Flow", label: "{{if::...}}...{{/if}} — Conditional Block", snippet: `{{if::{{isGroupChat}}}}

{{else}}

{{/if}}` },
  { group: "Variables & Control Flow", label: "{{unless::...}}...{{/unless}} — Inverted Conditional", snippet: `{{unless::{{isGroupChat}}}}

{{/unless}}` },
  { group: "Variables & Control Flow", label: "{{switch::...}} — Multi-Branch Switch", snippet: `{{switch::{{.mode}}}}
{{case::a}}

{{/case}}
{{default}}

{{/default}}
{{/switch}}` },
  { group: "Variables & Control Flow", label: "{{default::val::fallback}} — Fallback Value", snippet: "{{default::{{.value}}::fallback}}" },
  { group: "Variables & Control Flow", label: "{{setchatvar::key::val}} — Set Persisted Chat Var (@)", snippet: "{{setchatvar::key::value}}" },
  { group: "Variables & Control Flow", label: "{{getchatvar::key}} — Read Persisted Chat Var (@)", snippet: "{{getchatvar::key}}" },
  { group: "Variables & Control Flow", label: "{{setvar::key::val}} — Set Local Var (.)", snippet: "{{setvar::key::value}}" },
  { group: "Loom, Council & Memory", label: "{{memories}} — Long-Term Chat Memories", snippet: "{{memories}}" },
  { group: "Loom, Council & Memory", label: "{{databank}} — Databank Retrieval Chunks", snippet: "{{databank}}" },
  { group: "Loom, Council & Memory", label: "{{entities}} — Memory Cortex Entities", snippet: "{{entities}}" },
  { group: "Loom, Council & Memory", label: "{{relationships}} — Memory Cortex Relationships", snippet: "{{relationships}}" },
  { group: "Loom, Council & Memory", label: "{{arc}} — Narrative Arc Summary", snippet: "{{arc}}" },
  { group: "Loom, Council & Memory", label: "{{loomStyle}} — Loom Narrative Style", snippet: "{{loomStyle}}" },
  { group: "Loom, Council & Memory", label: "{{loomSummary}} — Stored Loom Summary", snippet: "{{loomSummary}}" },
  { group: "Loom, Council & Memory", label: "{{loomSovHand}} — Sovereign Hand Co-Pilot", snippet: `{{if::{{loomSovHandActive}}}}
{{loomSovHand}}
{{/if}}` },
  { group: "Loom, Council & Memory", label: "{{lumiaCouncilDeliberation}} — Council Deliberation", snippet: `{{if::{{lumiaCouncilModeActive}}}}
{{lumiaCouncilDeliberation}}
{{/if}}` },
  { group: "Loom, Council & Memory", label: "{{reasoningPrefix}}...{{reasoningSuffix}} — CoT Tags", snippet: `{{reasoningPrefix}}

{{reasoningSuffix}}` },
  { group: "Random, Math & Time", label: "{{pick::a::b::c}} — Random Choice", snippet: "{{pick::vivid::poetic::atmospheric}}" },
  { group: "Random, Math & Time", label: "{{random::1::100}} — Random Number", snippet: "{{random::1::100}}" },
  { group: "Random, Math & Time", label: "{{roll::1d20}} — Dice Roll", snippet: "{{roll::1d20}}" },
  { group: "Random, Math & Time", label: "{{calc::...}} — Math Expression", snippet: "{{calc::{{messageCount}} + 1}}" },
  { group: "Random, Math & Time", label: "{{time}} / {{date}} — Current Time & Date", snippet: "{{time}}, {{weekday}} {{date}}" }
];
var MARKERS = [
  { id: "", label: "None (Custom Prompt)" },
  { id: "category", label: "Category Divider" },
  { id: "chat_history", label: "Chat History (chat_history)" },
  { id: "world_info_before", label: "World Info Before (world_info_before)" },
  { id: "world_info_after", label: "World Info After (world_info_after)" },
  { id: "char_description", label: "Char Description (char_description)" },
  { id: "char_personality", label: "Char Personality (char_personality)" },
  { id: "persona_description", label: "User Persona (persona_description)" },
  { id: "scenario", label: "Scenario (scenario)" },
  { id: "dialogue_examples", label: "Example Messages (dialogue_examples)" },
  { id: "main_prompt", label: "Main Prompt (main_prompt)" },
  { id: "enhance_definitions", label: "Enhance Definitions (enhance_definitions)" },
  { id: "jailbreak", label: "Post-History Instructions (jailbreak)" },
  { id: "nsfw_prompt", label: "NSFW / Auxiliary Prompt (nsfw_prompt)" }
];
var VARIABLE_STARTER_EXAMPLES = [
  {
    id: "writing_tone",
    badge: "Dropdown",
    title: "\uD83C\uDFA8 Writing Tone",
    summary: "User picks a short label (Warm, Dramatic, Clinical); full instructions inject into the prompt.",
    variable: {
      name: "writing_tone",
      label: "Writing Tone",
      type: "select",
      description: "Choose the overall emotional register of the narration.",
      defaultValue: "warm",
      options: [
        { id: "warm", label: "Warm & Empathetic", value: "Write with warmth, emotional attunement, and natural tenderness." },
        { id: "dramatic", label: "Dramatic & Cinematic", value: "Use heightened tension, atmospheric lighting, and cinematic pacing." },
        { id: "clinical", label: "Crisp & Grounded", value: "Keep prose grounded, observant, and concise without melodrama." }
      ]
    },
    promptSnippet: "{{var::writing_tone}}"
  },
  {
    id: "response_length",
    badge: "Slider",
    title: "\uD83D\uDCCF Response Length",
    summary: "A touch slider from 1 to 6 paragraphs so users can control reply length.",
    variable: {
      name: "response_length",
      label: "Target Paragraphs",
      type: "slider",
      description: "How many paragraphs each reply should aim for.",
      min: 1,
      max: 6,
      step: 1,
      defaultValue: 3
    },
    promptSnippet: "Keep your response around {{var::response_length}} paragraphs long."
  },
  {
    id: "strict_canon",
    badge: "On/Off Switch",
    title: "\uD83D\uDEE1️ Strict Canon Toggle",
    summary: "An On/Off switch (1 or 0) that turns a prompt rule on or off using {{if::...}}.",
    variable: {
      name: "strict_canon",
      label: "Strict Canon Mode",
      type: "switch",
      description: "When enabled, enforces strict adherence to character lore and canon.",
      defaultValue: 1
    },
    promptSnippet: `{{if::{{var::strict_canon}}}}
Strictly adhere to established canon and character lore. Do not invent contradictory backstory.
{{/if}}`
  },
  {
    id: "style_addons",
    badge: "Multi-select",
    title: "\uD83E\uDDE9 Style Checklist",
    summary: "Lets users check multiple writing rules that combine automatically.",
    variable: {
      name: "style_addons",
      label: "Active Style Rules",
      type: "multiselect",
      description: "Select any combination of prose enhancements.",
      separator: `
`,
      defaultValue: ["sensory", "dialogue"],
      options: [
        { id: "sensory", label: "Vivid Sensory Detail", value: "- Ground every scene in sound, texture, and lighting." },
        { id: "dialogue", label: "Natural Dialogue", value: "- Keep dialogue sharp, subtextual, and true to character voice." },
        { id: "thoughts", label: "Inner Monologue", value: "- Weave unspoken internal thoughts in italics." }
      ]
    },
    promptSnippet: "{{var::style_addons}}"
  },
  {
    id: "custom_focus",
    badge: "Text Box",
    title: "✍️ Scene Focus Note",
    summary: "A simple text field where users can type a custom focus or theme.",
    variable: {
      name: "scene_focus",
      label: "Scene Focus",
      type: "text",
      description: "Optional theme or detail to emphasize in the story.",
      defaultValue: "slow-burn character chemistry"
    },
    promptSnippet: "Emphasize {{var::scene_focus}} throughout the scene."
  }
];
var AUTHORS_NOTE_PRESETS = [
  {
    label: "✨ Vivid & Slow",
    content: "[Style: vivid sensory descriptions, grounded atmosphere, slow and deliberate pacing.]"
  },
  {
    label: "⚡ Raise Tension",
    content: "[Increase dramatic tension. Something feels subtly off in the environment.]"
  },
  {
    label: "\uD83D\uDCAD Inner Thoughts",
    content: "[Include {{char}}'s unspoken internal thoughts and emotional reactions in italics.]"
  },
  {
    label: "\uD83D\uDCAC Dialogue Focus",
    content: "[Focus on natural back-and-forth dialogue and subtle body language over long exposition.]"
  }
];
var esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c);
var uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
function selectOptions(items, value, label) {
  return items.map((x) => `<option value="${esc(x.id)}" ${x.id === value ? "selected" : ""}>${esc(label(x))}</option>`).join("");
}
var freshDraft = () => ({
  name: "New preset",
  provider: "loom",
  engine: "classic",
  parameters: {},
  prompts: {},
  metadata: { promptVariables: {} },
  prompt_order: [
    { id: uid(), name: "Main Prompt", content: "", role: "system", enabled: true, position: "pre_history", depth: 0, marker: "main_prompt", isLocked: false, color: null, injectionTrigger: [], group: null },
    { id: uid(), name: "Char Description", content: "", role: "system", enabled: true, position: "pre_history", depth: 0, marker: "char_description", isLocked: true, color: null, injectionTrigger: [], group: null },
    { id: uid(), name: "Chat History", content: "", role: "system", enabled: true, position: "pre_history", depth: 0, marker: "chat_history", isLocked: true, color: null, injectionTrigger: [], group: null }
  ]
});
function normalizeVariableDef(v, allowEmptyWhileEditing = false) {
  const type = v?.type === "boolean" ? "switch" : ["text", "textarea", "number", "slider", "select", "switch", "multiselect"].includes(v?.type) ? v.type : "text";
  const cleanedName = String(v?.name ?? "").replace(/[^a-zA-Z0-9_]/g, "_");
  const base = {
    name: allowEmptyWhileEditing ? cleanedName : cleanedName || "var_1",
    label: allowEmptyWhileEditing ? String(v?.label ?? "") : String(v?.label || cleanedName || "Variable"),
    type
  };
  if (typeof v?.description === "string" && v.description)
    base.description = v.description;
  if (type === "switch") {
    base.defaultValue = v?.defaultValue === 1 || v?.defaultValue === "1" || v?.defaultValue === true || v?.defaultValue === "true" ? 1 : 0;
  } else if (type === "number" || type === "slider") {
    const min = Number.isFinite(Number(v?.min)) ? Number(v.min) : 0;
    const max = Number.isFinite(Number(v?.max)) ? Number(v.max) : 100;
    if (type === "slider" || v?.min !== undefined)
      base.min = min;
    if (type === "slider" || v?.max !== undefined)
      base.max = max;
    if (v?.step !== undefined && Number.isFinite(Number(v.step)))
      base.step = Number(v.step);
    const defNum = Number(v?.defaultValue);
    base.defaultValue = Number.isFinite(defNum) ? defNum : min;
  } else if (type === "select" || type === "multiselect") {
    const rawOpts = Array.isArray(v?.options) && v.options.length ? v.options : [{ id: "option_1", label: "Option 1", value: "" }];
    base.options = rawOpts.map((o, i) => ({
      id: String(o?.id || `option_${i + 1}`),
      label: String(o?.label || o?.id || `Option ${i + 1}`),
      value: String(o?.value ?? "")
    }));
    if (type === "select") {
      const defStr = String(v?.defaultValue ?? base.options[0].id);
      base.defaultValue = base.options.some((o) => o.id === defStr) ? defStr : base.options[0].id;
    } else {
      const validIds = new Set(base.options.map((o) => o.id));
      const rawDef = Array.isArray(v?.defaultValue) ? v.defaultValue.map(String) : typeof v?.defaultValue === "string" && v.defaultValue.trim() ? v.defaultValue.split(",").map((s) => s.trim()) : [];
      base.defaultValue = rawDef.filter((id) => validIds.has(id));
      if (typeof v?.separator === "string")
        base.separator = v.separator;
    }
  } else {
    base.defaultValue = String(v?.defaultValue ?? "");
    if (type === "textarea" && Number.isFinite(Number(v?.rows)))
      base.rows = Math.max(2, Number(v.rows));
  }
  return base;
}
function resolveSingleVariableRenderedValue(v, rawSelection) {
  const active = rawSelection !== undefined && rawSelection !== "" ? rawSelection : v.defaultValue;
  const selectedKeys = new Set;
  if (v.type === "switch" || v.type === "boolean") {
    const isOn = active === 1 || active === "1" || active === true || active === "true";
    if (isOn)
      selectedKeys.add("1");
    return { rendered: isOn ? "1" : "0", selectedKeys };
  }
  if (v.type === "select") {
    const opts = Array.isArray(v.options) ? v.options : [];
    const key = String(active ?? "");
    const found = opts.find((o) => o.id === key || o.label === key) || opts[0];
    if (found) {
      selectedKeys.add(String(found.id));
      return { rendered: String(found.value ?? ""), selectedKeys };
    }
    return { rendered: key, selectedKeys };
  }
  if (v.type === "multiselect") {
    const opts = Array.isArray(v.options) ? v.options : [];
    const chosenList = Array.isArray(active) ? active.map(String) : typeof active === "string" && active.trim() ? active.split(",").map((s) => s.trim()) : [];
    for (const k of chosenList)
      selectedKeys.add(k);
    const pieces = opts.filter((o) => selectedKeys.has(String(o.id))).map((o) => String(o.value ?? "")).filter(Boolean);
    const sep = typeof v.separator === "string" ? v.separator : `

`;
    return { rendered: pieces.join(sep), selectedKeys };
  }
  return { rendered: String(active ?? ""), selectedKeys };
}
function resolveBlockVariablesPreview(block, savedBlockVars = {}) {
  if (!block)
    return "";
  const vars = Array.isArray(block.variables) ? block.variables : [];
  const varMap = new Map;
  for (const v of vars) {
    if (!v?.name)
      continue;
    const { rendered, selectedKeys } = resolveSingleVariableRenderedValue(v, savedBlockVars[v.name]);
    const { rendered: defaultRendered } = resolveSingleVariableRenderedValue(v, undefined);
    varMap.set(v.name, { def: v, rendered, defaultRendered, selectedKeys });
  }
  let text = String(block.content || "");
  if (!text.trim() && vars.length > 0) {
    text = vars.map((v) => `{{var::${v.name}}}`).join(`

`);
  }
  text = text.replace(/\{\{\s*(?:var|promptVar|presetVar)::([a-zA-Z0-9_.-]+)::ison::([^}]*)\}\}/gi, (_m, name, keysRaw) => {
    const entry = varMap.get(name);
    if (!entry)
      return "false";
    const keys = String(keysRaw || "").split(",").map((k) => k.trim()).filter(Boolean);
    if (!keys.length)
      return "true";
    return keys.every((k) => entry.selectedKeys.has(k)) ? "true" : "false";
  });
  text = text.replace(/\{\{\s*(?:varDefault|promptVarDefault|presetVarDefault)(?:::|\s+)([a-zA-Z0-9_.-]+)\s*\}\}/gi, (_m, name) => {
    return varMap.get(name)?.defaultRendered ?? "";
  });
  text = text.replace(/\{\{\s*(?:hasVar|hasPromptVar|hasPresetVar)(?:::|\s+)([a-zA-Z0-9_.-]+)\s*\}\}/gi, (_m, name) => {
    return varMap.has(name) ? "true" : "false";
  });
  text = text.replace(/\{\{\s*(?:(?:var|promptVar|presetVar|getvar)(?:::|\s+)([a-zA-Z0-9_.-]+)|\.([a-zA-Z0-9_]+))\s*\}\}/gi, (full, n1, n2) => {
    const name = n1 || n2;
    if (!varMap.has(name))
      return full;
    return varMap.get(name).rendered;
  });
  const isTruthy = (cond) => {
    let c = cond.trim();
    let negate = false;
    if (c.startsWith("!")) {
      negate = true;
      c = c.slice(1).trim();
    }
    if (c.startsWith(".") && varMap.has(c.slice(1))) {
      c = varMap.get(c.slice(1)).rendered;
    }
    const falsy = !c || ["0", "false", "null", "undefined", "no", "off"].includes(c.toLowerCase());
    return negate ? falsy : !falsy;
  };
  text = text.replace(/\{\{\s*if(?:::|\s+)([^{}]+?)\}\}([\s\S]*?)\{\{\s*\/if\s*\}\}/gi, (_m, cond, body) => {
    const parts = String(body).split(/\{\{\s*else\s*\}\}/i);
    return isTruthy(cond) ? parts[0] : parts[1] ?? "";
  });
  return text.trim();
}
var UNSAFE_HTML_TAGS = new Set(["SCRIPT", "IFRAME", "FRAME", "OBJECT", "EMBED", "APPLET", "BASE", "META", "LINK"]);
function sanitizeHtmlFragment(rawHtml) {
  const parser = new DOMParser;
  const doc = parser.parseFromString(`<body>${rawHtml}</body>`, "text/html");
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  const toRemove = [];
  let node = walker.nextNode();
  while (node) {
    if (UNSAFE_HTML_TAGS.has(node.tagName)) {
      toRemove.push(node);
    } else {
      for (const attr of Array.from(node.attributes)) {
        const name = attr.name.toLowerCase();
        const val = attr.value.trim().toLowerCase();
        if (name.startsWith("on") || (name === "href" || name === "src" || name === "xlink:href") && val.startsWith("javascript:")) {
          node.removeAttribute(attr.name);
        }
      }
    }
    node = walker.nextNode();
  }
  for (const el of toRemove)
    el.remove();
  const frag = document.createDocumentFragment();
  while (doc.body.firstChild) {
    frag.appendChild(doc.body.firstChild);
  }
  return frag;
}
function formatInlineProse(escapedText) {
  let out = escapedText;
  out = out.replace(/`([^`\n]+)`/g, '<code class="ps-inline-code">$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="ps-prose-bold">$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em class="ps-prose-italic">*$2*</em>');
  out = out.replace(/(&quot;[^&\n]+?&quot;|“[^”\n]+?”)/g, '<span class="ps-prose-dialogue">$1</span>');
  return out;
}
function renderMarkdownAndHtmlWithPlaceholders(rawText) {
  const islands = [];
  let working = rawText;
  if (/<style\b/i.test(working)) {
    const idx = islands.length;
    islands.push(working);
    return { html: `<div class="ps-html-island-host" data-island-index="${idx}"></div>`, islands };
  }
  const codeBlocks = [];
  working = working.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const cIdx = codeBlocks.length;
    codeBlocks.push(`<pre class="ps-code-block"${lang ? ` data-lang="${esc(lang)}"` : ""}><code>${esc(code)}</code></pre>`);
    return `\x00CODEBLOCK_${cIdx}\x00`;
  });
  const htmlTokens = [];
  working = working.replace(/<\/?[a-zA-Z][^>]*>/g, (tag) => {
    const tIdx = htmlTokens.length;
    htmlTokens.push(tag);
    return `\x00HTMLTAG_${tIdx}\x00`;
  });
  const paragraphs = working.split(/\n{2,}/);
  const formattedParas = paragraphs.map((para) => {
    const trimmed = para.trim();
    if (!trimmed)
      return "";
    const escaped = esc(trimmed);
    const withInline = formatInlineProse(escaped).replace(/\n/g, "<br>");
    if (/^\u0000HTMLTAG_\d+\u0000/.test(trimmed) || /^\u0000CODEBLOCK_\d+\u0000$/.test(trimmed)) {
      return withInline;
    }
    return `<p>${withInline}</p>`;
  });
  let finalHtml = formattedParas.filter(Boolean).join(`
`);
  finalHtml = finalHtml.replace(/\u0000HTMLTAG_(\d+)\u0000/g, (_m, i) => htmlTokens[Number(i)] || "");
  finalHtml = finalHtml.replace(/\u0000CODEBLOCK_(\d+)\u0000/g, (_m, i) => codeBlocks[Number(i)] || "");
  return { html: finalHtml, islands };
}
function renderChatPreviewInto(container, rawText, asRawText = false) {
  if (!rawText) {
    container.innerHTML = '<div class="ps-muted" style="padding:18px 4px;text-align:center">Click <strong>▶ Generate Reply</strong> to see how your preset responds in a live chat bubble (including HTML, CSS, Markdown, and dialogue styling).</div>';
    return;
  }
  if (asRawText) {
    const pre = document.createElement("pre");
    pre.className = "ps-result";
    pre.style.margin = "0";
    pre.textContent = rawText;
    container.replaceChildren(pre);
    return;
  }
  const { html, islands } = renderMarkdownAndHtmlWithPlaceholders(rawText);
  const frag = sanitizeHtmlFragment(html);
  const wrap = document.createElement("div");
  wrap.className = "ps-chat-prose";
  wrap.appendChild(frag);
  wrap.querySelectorAll(".ps-html-island-host[data-island-index]").forEach((hostEl) => {
    const idx = Number(hostEl.dataset.islandIndex);
    const islandSource = islands[idx];
    if (!islandSource)
      return;
    const shadow = hostEl.shadowRoot || hostEl.attachShadow({ mode: "open" });
    const baseReset = document.createElement("style");
    baseReset.textContent = `
      :host {
        display: block;
        color: var(--lumiverse-text, #f2f0f7);
        font-family: var(--lumiverse-font-family, inherit);
        line-height: 1.55;
        overflow-x: auto;
      }
      *, *::before, *::after { box-sizing: border-box; }
    `;
    const islandFrag = sanitizeHtmlFragment(islandSource);
    shadow.replaceChildren(baseReset, islandFrag);
  });
  container.replaceChildren(wrap);
}
function computeDraftFingerprint(d) {
  if (!d)
    return "";
  return JSON.stringify({
    name: d.name || "",
    provider: d.provider || "loom",
    engine: d.engine || "classic",
    prompt_order: d.prompt_order || [],
    parameters: d.parameters || {},
    prompts: d.prompts || {},
    metadata: d.metadata || {}
  });
}
function ensureUniqueBlockIds(d) {
  if (!d || !Array.isArray(d.prompt_order))
    return d;
  const seen = new Set;
  for (const blk of d.prompt_order) {
    if (!blk.id || seen.has(blk.id))
      blk.id = uid();
    seen.add(blk.id);
  }
  return d;
}
function buildPresetVariableDiagnostics(blocks) {
  const defsByName = new Map;
  const refsByName = new Map;
  const defCountByBlock = new Map;
  const refCountByBlock = new Map;
  const explicitVarRe = /\{\{\s*(?:(?:var|promptVar|presetVar|getvar|hasPromptVar|hasPresetVar|varDefault|promptVarDefault|presetVarDefault)(?:\s*::\s*|\s+)([a-zA-Z0-9_.-]+)|\.([a-zA-Z0-9_]+)\s*\}\})/gi;
  for (const blk of blocks || []) {
    const vars = Array.isArray(blk.variables) ? blk.variables : [];
    defCountByBlock.set(blk.id, vars.length);
    for (const v of vars) {
      if (!v?.name)
        continue;
      const list = defsByName.get(v.name) || [];
      list.push({ blockId: blk.id, blockName: blk.name || "Untitled", def: v });
      defsByName.set(v.name, list);
    }
    const text = blk.content || "";
    const blockRefSet = new Set;
    let m;
    while ((m = explicitVarRe.exec(text)) !== null) {
      const name = m[1] || m[2];
      if (!name)
        continue;
      blockRefSet.add(name);
      const rList = refsByName.get(name) || [];
      if (!rList.some((x) => x.blockId === blk.id)) {
        rList.push({ blockId: blk.id, blockName: blk.name || "Untitled" });
        refsByName.set(name, rList);
      }
    }
    refCountByBlock.set(blk.id, blockRefSet.size);
  }
  const missing = [];
  const duplicates = [];
  const unused = [];
  for (const [name, refs] of refsByName.entries()) {
    if (!defsByName.has(name))
      missing.push({ name, refs });
  }
  for (const [name, defs] of defsByName.entries()) {
    if (defs.length > 1)
      duplicates.push({ name, defs });
    if (!refsByName.has(name))
      unused.push({ name, defs });
  }
  const allReadLocalVars = new Set;
  const setVarsByBlock = new Map;
  const getvarRe = /\{\{\s*(?:getvar|var)(?:::|\s+)([a-zA-Z0-9_.-]+)\s*\}\}/gi;
  const dotReadRe = /\{\{\s*\.([a-zA-Z0-9_]+)\s*\}\}/g;
  const setvarRe = /\{\{\s*setvar(?:::|\s+)([a-zA-Z0-9_.-]+)(?:::|\s*\}\})/gi;
  for (const blk of blocks || []) {
    const text = typeof blk?.content === "string" ? blk.content : "";
    if (!text)
      continue;
    let m;
    while ((m = getvarRe.exec(text)) !== null)
      allReadLocalVars.add(m[1]);
    while ((m = dotReadRe.exec(text)) !== null)
      allReadLocalVars.add(m[1]);
    const written = [];
    while ((m = setvarRe.exec(text)) !== null) {
      if (!written.includes(m[1]))
        written.push(m[1]);
    }
    if (written.length)
      setVarsByBlock.set(blk.id, written);
  }
  return { defCountByBlock, refCountByBlock, missing, duplicates, unused, setVarsByBlock, allReadLocalVars };
}
function cloneBlocksForHost(blocks) {
  return (blocks || []).map((block) => ({
    id: String(block.id || uid()),
    name: String(block.name ?? ""),
    content: String(block.content ?? ""),
    role: ["system", "user", "assistant", "user_append", "assistant_append"].includes(block.role) ? block.role : "system",
    enabled: Boolean(block.enabled),
    position: ["pre_history", "post_history", "in_history"].includes(block.position) ? block.position : "pre_history",
    depth: Math.max(0, Number(block.depth) || 0),
    marker: block.marker ? String(block.marker) : null,
    isLocked: Boolean(block.isLocked),
    color: block.color ? String(block.color) : null,
    injectionTrigger: Array.isArray(block.injectionTrigger) ? [...block.injectionTrigger] : [],
    ...Array.isArray(block.characterTagTrigger) ? { characterTagTrigger: [...block.characterTagTrigger] } : {},
    group: block.group ? String(block.group) : null,
    categoryMode: block.categoryMode === "radio" || block.categoryMode === "checkbox" ? block.categoryMode : null,
    ...Array.isArray(block.variables) ? {
      variables: block.variables.map((v) => normalizeVariableDef(v, false))
    } : {}
  }));
}
function sanitizeBlockForLoom(b) {
  const cleanBlock = {
    id: String(b.id || uid()),
    name: String(b.name || "Untitled"),
    content: String(b.content || ""),
    role: ["system", "user", "assistant", "user_append", "assistant_append"].includes(b.role) ? b.role : "system",
    enabled: Boolean(b.enabled),
    position: ["pre_history", "post_history", "in_history"].includes(b.position) ? b.position : "pre_history",
    depth: Math.max(0, Number(b.depth) || 0),
    marker: b.marker ? String(b.marker) : null,
    isLocked: Boolean(b.isLocked),
    color: blockColor(b),
    injectionTrigger: Array.isArray(b.injectionTrigger) ? b.injectionTrigger.map(String) : [],
    group: b.group ? String(b.group) : null
  };
  if (b.categoryMode === "radio" || b.categoryMode === "checkbox")
    cleanBlock.categoryMode = b.categoryMode;
  if (Array.isArray(b.variables))
    cleanBlock.variables = b.variables.map((v) => normalizeVariableDef(v, false));
  return cleanBlock;
}
function blockColor(b) {
  return b.color ? String(b.color) : null;
}
async function copyToClipboard(text) {
  if (!text)
    return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    return true;
  } catch (_) {
    return false;
  }
}
function exportJsonFile(filename, dataObj) {
  const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

// src/studio-dialogs.ts
function closeModalRef(modalRef) {
  if (modalRef.current) {
    try {
      modalRef.current.cleanup?.();
      modalRef.current.close?.();
      modalRef.current.remove?.();
      modalRef.current.dismiss?.();
    } catch (_) {}
    modalRef.current = null;
  }
}
function askConfirm(root, modalRef, title, message, variant = "warning", confirmLabel = "Confirm") {
  closeModalRef(modalRef);
  const returnFocus = document.activeElement;
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.className = "ps-native-dialog";
    const isDanger = variant === "danger";
    dialog.innerHTML = `<h3 style="margin-bottom:8px">${esc(title)}</h3><p class="ps-muted" style="margin-bottom:16px;color:var(--ps-text)">${esc(message)}</p><div class="ps-actions" style="justify-content:flex-end"><button type="button" data-confirm-result="cancel">Cancel</button><button type="button" class="${isDanger ? "ps-danger-btn" : "ps-primary"}" style="${isDanger ? "background:var(--ps-danger);color:#14111c;font-weight:700" : ""}" data-confirm-result="ok">${esc(confirmLabel)}</button></div>`;
    const finish = (val) => {
      if (modalRef.current === dialog)
        modalRef.current = null;
      try {
        dialog.close();
      } catch (_) {}
      dialog.remove();
      returnFocus?.focus?.({ preventScroll: true });
      resolve(val);
    };
    dialog.addEventListener("cancel", (ev) => {
      ev.preventDefault();
      finish(false);
    });
    dialog.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape")
        ev.stopPropagation();
    });
    dialog.addEventListener("click", (ev) => {
      if (ev.target === dialog)
        finish(false);
      const btn = ev.target.closest("button[data-confirm-result]");
      if (btn)
        finish(btn.dataset.confirmResult === "ok");
    });
    root.appendChild(dialog);
    modalRef.current = dialog;
    if (typeof dialog.showModal === "function")
      dialog.showModal();
    else
      dialog.setAttribute("open", "");
    dialog.querySelector('[data-confirm-result="ok"]')?.focus({ preventScroll: true });
  });
}
function promptTemplateName(root, modalRef, defaultName = "", blockCount = 1) {
  closeModalRef(modalRef);
  const returnFocus = document.activeElement;
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.className = "ps-native-dialog";
    dialog.style.width = "min(420px, calc(100vw - 24px))";
    dialog.innerHTML = `<h3 style="margin-bottom:6px">\uD83D\uDCE6 Save as Template</h3><p class="ps-muted" style="margin-bottom:12px">Save ${blockCount} block${blockCount === 1 ? "" : "s"} as a reusable template.</p><label>Template Name<input type="text" data-tpl-name value="${esc(defaultName)}" placeholder="e.g. Dialogue & Pacing Rules" maxlength="120"></label><div class="ps-actions" style="justify-content:flex-end;margin-top:14px"><button type="button" data-tpl-action="cancel">Cancel</button><button type="button" class="ps-primary" data-tpl-action="save">Save Template</button></div>`;
    const input = dialog.querySelector("[data-tpl-name]");
    const finish = (val) => {
      if (modalRef.current === dialog)
        modalRef.current = null;
      try {
        dialog.close();
      } catch (_) {}
      dialog.remove();
      returnFocus?.focus?.({ preventScroll: true });
      resolve(val);
    };
    dialog.addEventListener("cancel", (ev) => {
      ev.preventDefault();
      finish(null);
    });
    dialog.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape")
        ev.stopPropagation();
      if (ev.key === "Enter") {
        ev.preventDefault();
        const trimmed = input.value.trim();
        if (trimmed)
          finish(trimmed);
      }
    });
    dialog.addEventListener("click", (ev) => {
      if (ev.target === dialog)
        finish(null);
      const btn = ev.target.closest("button[data-tpl-action]");
      if (!btn)
        return;
      if (btn.dataset.tplAction === "cancel")
        finish(null);
      else if (btn.dataset.tplAction === "save" && input.value.trim())
        finish(input.value.trim());
    });
    root.appendChild(dialog);
    modalRef.current = dialog;
    if (typeof dialog.showModal === "function")
      dialog.showModal();
    else
      dialog.setAttribute("open", "");
    input.focus({ preventScroll: true });
    input.select();
  });
}
function openFindReplaceDialog(root, modalRef, state, persist, render) {
  const d = state.draft;
  if (!d)
    return;
  closeModalRef(modalRef);
  const returnFocus = document.activeElement;
  const dialog = document.createElement("dialog");
  dialog.className = "ps-native-dialog";
  dialog.innerHTML = `<div class="ps-between" style="margin-bottom:8px"><h3>\uD83D\uDD0D Find & Replace Across Preset</h3><button type="button" class="ps-btn-sm ps-btn-icon" data-fr="close" aria-label="Close">✕</button></div><p class="ps-muted" style="margin-bottom:10px">Search and replace literal text across all unlocked blocks in your draft. Locked blocks are skipped unless unlocked first.</p><div class="ps-grid"><label>Find Text<textarea data-fr="find" rows="2" style="min-height:64px" spellcheck="false" placeholder="Text or {{macro}} to find…"></textarea></label><label>Replace With<textarea data-fr="replace" rows="2" style="min-height:64px" spellcheck="false" placeholder="Replacement text (leave empty to delete)…"></textarea></label></div><p class="ps-muted" style="margin:8px 0" data-fr="status" role="status">Enter text above to preview matching blocks.</p><div class="ps-list" style="max-height:280px;overflow:auto" data-fr="results"></div><div class="ps-between" style="margin-top:12px;padding-top:10px;border-top:1px solid var(--ps-border)"><button type="button" class="ps-btn-sm" data-fr="close">Cancel</button><button type="button" class="ps-btn-sm ps-primary" data-fr="apply" disabled>Replace Matches</button></div>`;
  const findInput = dialog.querySelector('[data-fr="find"]');
  const replaceInput = dialog.querySelector('[data-fr="replace"]');
  const statusEl = dialog.querySelector('[data-fr="status"]');
  const resultsEl = dialog.querySelector('[data-fr="results"]');
  const applyBtn = dialog.querySelector('[data-fr="apply"]');
  const selectedIds = new Set;
  let matches = [];
  const close = () => {
    if (modalRef.current === dialog)
      modalRef.current = null;
    try {
      dialog.close();
    } catch (_) {}
    dialog.remove();
    returnFocus?.focus?.({ preventScroll: true });
  };
  const updatePreview = (selectAllMatches = false) => {
    const needle = findInput.value;
    const rep = replaceInput.value;
    matches = [];
    if (needle && needle !== rep) {
      for (const blk of d.prompt_order) {
        if (blk.isLocked || blk.marker === "category")
          continue;
        const parts = (blk.content || "").split(needle);
        if (parts.length > 1) {
          matches.push({ blk, count: parts.length - 1, parts });
          if (selectAllMatches)
            selectedIds.add(blk.id);
        }
      }
    }
    const totalCount = matches.reduce((acc, m) => acc + (selectedIds.has(m.blk.id) ? m.count : 0), 0);
    statusEl.textContent = !needle ? "Enter text above to preview matching blocks." : needle === rep ? "Find and Replace strings are identical." : `${matches.length} matching unlocked block(s) · ${totalCount} replacement(s) selected.`;
    applyBtn.disabled = totalCount === 0;
    applyBtn.textContent = totalCount ? `Replace ${totalCount} Match(es)` : "Replace Matches";
    resultsEl.innerHTML = matches.map(({ blk, count, parts }) => {
      const previewHtml = parts.map((p) => esc(p)).join(`<mark class="ps-mark-del">${esc(needle)}</mark><mark class="ps-mark-ins">${esc(rep)}</mark>`);
      return `<details class="ps-card" style="padding:8px"><summary class="ps-between"><label style="display:inline-flex;align-items:center;gap:8px;flex:1"><input type="checkbox" style="width:auto;min-height:18px" data-fr-id="${esc(blk.id)}" ${selectedIds.has(blk.id) ? "checked" : ""}><strong>${esc(blk.name || "Untitled")}</strong></label><span class="ps-pill">${count} match${count === 1 ? "" : "es"}</span></summary><pre class="ps-result" style="margin-top:6px;max-height:140px">${previewHtml}</pre></details>`;
    }).join("");
  };
  findInput.addEventListener("input", () => {
    selectedIds.clear();
    updatePreview(true);
  });
  replaceInput.addEventListener("input", () => updatePreview(false));
  resultsEl.addEventListener("change", (ev) => {
    const cb = ev.target.closest("input[data-fr-id]");
    if (!cb)
      return;
    if (cb.checked)
      selectedIds.add(cb.dataset.frId);
    else
      selectedIds.delete(cb.dataset.frId);
    updatePreview(false);
  });
  dialog.addEventListener("cancel", (ev) => {
    ev.preventDefault();
    close();
  });
  dialog.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape")
      ev.stopPropagation();
  });
  dialog.addEventListener("click", (ev) => {
    const target = ev.target;
    if (target === dialog || target.closest('[data-fr="close"]')) {
      close();
      return;
    }
    if (target.closest('[data-fr="apply"]')) {
      const needle = findInput.value;
      const rep = replaceInput.value;
      let changedBlocks = 0;
      for (const { blk } of matches) {
        if (!selectedIds.has(blk.id))
          continue;
        blk.content = (blk.content || "").split(needle).join(rep);
        changedBlocks++;
      }
      close();
      if (changedBlocks > 0) {
        persist();
        state.notice = `Replaced matches across ${changedBlocks} block(s). Use Undo (Ctrl+Z) to revert.`;
        render();
      }
    }
  });
  root.appendChild(dialog);
  modalRef.current = dialog;
  if (typeof dialog.showModal === "function")
    dialog.showModal();
  else
    dialog.setAttribute("open", "");
  findInput.focus({ preventScroll: true });
}
function openTemplatePickerModal(root, modalRef, state, insertEntries, importJsonFile, render) {
  const d = state.draft;
  if (!d)
    return;
  closeModalRef(modalRef);
  const returnFocus = document.activeElement;
  const afterName = d.prompt_order[state.selected]?.name || "selected block";
  const dialog = document.createElement("dialog");
  dialog.className = "ps-native-dialog";
  dialog.innerHTML = `<div class="ps-between" style="margin-bottom:8px"><h3>Choose a Template to Add</h3><button type="button" class="ps-btn-sm ps-btn-icon" data-modal-action="close" aria-label="Close">✕</button></div><p class="ps-muted" style="margin-bottom:12px">Blocks will be inserted right after <strong>${esc(afterName)}</strong>.</p>${state.templates.length ? `<div class="ps-list">${state.templates.map((t, idx) => {
    const blockNames = (t.entries || []).map((e) => e.block?.name || "Untitled").join(" · ");
    return `<div class="ps-card ps-between"><div style="min-width:0;flex:1"><div><strong>${esc(t.name)}</strong> <span class="ps-pill">${t.entries.length} block${t.entries.length === 1 ? "" : "s"}</span></div><div class="ps-muted" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px">${esc(blockNames)}</div></div><button type="button" class="ps-btn-sm ps-primary" data-modal-insert="${idx}">＋ Insert</button></div>`;
  }).join("")}</div>` : `<div class="ps-card" style="text-align:center;padding:18px 12px"><p class="ps-muted">No saved templates yet. Import a template JSON or build one in Remix & Templates.</p></div>`}<div class="ps-between" style="margin-top:14px;padding-top:10px;border-top:1px solid var(--ps-border)"><button type="button" class="ps-btn-sm" data-modal-action="import">\uD83D\uDCE5 Import Template JSON</button><button type="button" class="ps-btn-sm" data-modal-action="remix">Manage in Remix Tab →</button></div>`;
  const close = () => {
    if (modalRef.current === dialog)
      modalRef.current = null;
    try {
      dialog.close();
    } catch (_) {}
    dialog.remove();
    returnFocus?.focus?.({ preventScroll: true });
  };
  dialog.addEventListener("cancel", (ev) => {
    ev.preventDefault();
    close();
  });
  dialog.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape")
      ev.stopPropagation();
  });
  dialog.addEventListener("click", async (ev) => {
    const target = ev.target;
    if (target === dialog) {
      close();
      return;
    }
    const insBtn = target.closest("button[data-modal-insert]");
    if (insBtn) {
      const t = state.templates[Number(insBtn.dataset.modalInsert)];
      close();
      if (t) {
        insertEntries(t.entries);
        state.notice = `Added ${t.entries.length} blocks from “${t.name}”.`;
        render();
      }
      return;
    }
    const actBtn = target.closest("button[data-modal-action]");
    if (!actBtn)
      return;
    const act = actBtn.dataset.modalAction;
    close();
    if (act === "remix") {
      state.view = "remix";
      render();
    } else if (act === "import") {
      try {
        await importJsonFile("template");
        render();
        openTemplatePickerModal(root, modalRef, state, insertEntries, importJsonFile, render);
      } catch (err) {
        state.notice = err.message;
        render();
      }
    }
  });
  root.appendChild(dialog);
  modalRef.current = dialog;
  if (typeof dialog.showModal === "function")
    dialog.showModal();
  else
    dialog.setAttribute("open", "");
}
function openBlockContextMenu(root, modalRef, state, index, x, y, callbacks) {
  const d = state.draft;
  const b = d?.prompt_order?.[index];
  if (!b)
    return;
  closeModalRef(modalRef);
  state.selected = index;
  const menu = document.createElement("div");
  menu.className = "ps-ctx-menu";
  const left = Math.max(8, Math.min(x, window.innerWidth - 230));
  const top = Math.max(8, Math.min(y, window.innerHeight - 310));
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.innerHTML = `
    <button type="button" data-ctx-key="edit-macro" ${b.isLocked ? "disabled" : ""}>⤢ Full-Screen Macro Editor</button>
    <button type="button" data-ctx-key="preview-macro">⚡ Preview Resolved Macros</button>
    <button type="button" data-ctx-key="toggle">${b.enabled ? "Disable Block" : "Enable Block"}</button>
    <button type="button" data-ctx-key="lock">${b.isLocked ? "\uD83D\uDD13 Unlock Block" : "\uD83D\uDD12 Lock Block"}</button>
    <hr style="border:0;border-top:1px solid var(--ps-border);margin:3px 0">
    <button type="button" data-ctx-key="dup">Duplicate Block</button>
    <button type="button" data-ctx-key="basket">\uD83D\uDCE6 Save Block as Template…</button>
    <button type="button" data-ctx-key="top" ${index === 0 ? "disabled" : ""}>⇈ Move to Top</button>
    <button type="button" data-ctx-key="bottom" ${index >= d.prompt_order.length - 1 ? "disabled" : ""}>⇊ Move to Bottom</button>
    <hr style="border:0;border-top:1px solid var(--ps-border);margin:3px 0">
    <button type="button" class="ps-danger-btn" data-ctx-key="delete">\uD83D\uDDD1 Delete Block</button>
  `;
  const dismiss = () => {
    document.removeEventListener("pointerdown", onOutside, true);
    if (modalRef.current === menu)
      modalRef.current = null;
    menu.remove();
  };
  menu.cleanup = dismiss;
  const onOutside = (ev) => {
    if (!menu.contains(ev.target))
      dismiss();
  };
  setTimeout(() => document.addEventListener("pointerdown", onOutside, true), 0);
  menu.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("button[data-ctx-key]");
    if (!btn)
      return;
    const selectedKey = btn.dataset.ctxKey;
    dismiss();
    if (selectedKey === "edit-macro")
      await callbacks.openFullTextEditorForBlock(b);
    else if (selectedKey === "preview-macro") {
      state.showMacroPane = true;
      await callbacks.runMacroPreview(b);
    } else if (selectedKey === "toggle") {
      b.enabled = !b.enabled;
      callbacks.persist();
      callbacks.render();
    } else if (selectedKey === "lock") {
      b.isLocked = !b.isLocked;
      callbacks.persist();
      callbacks.render();
    } else if (selectedKey === "dup") {
      d.prompt_order.splice(index + 1, 0, { ...structuredClone(b), id: uid(), name: (b.name || "Block") + " copy", isLocked: false });
      state.selected = index + 1;
      callbacks.persist();
      callbacks.render();
    } else if (selectedKey === "basket") {
      await callbacks.saveEntriesAsTemplate([{ block: structuredClone(b), values: structuredClone(d.metadata?.promptVariables?.[b.id] || {}), source: d.name || "Draft" }], b.name || "Block Template");
    } else if (selectedKey === "top" && index > 0)
      callbacks.moveBlock(index, 0);
    else if (selectedKey === "bottom" && index < d.prompt_order.length - 1)
      callbacks.moveBlock(index, d.prompt_order.length - 1);
    else if (selectedKey === "delete")
      await callbacks.deleteBlockAtIndex(index);
  });
  root.appendChild(menu);
  modalRef.current = menu;
}

// src/studio-views.ts
function translationButtons(state, action, block, index) {
  const id = index === undefined ? "" : ` data-index="${index}"`;
  const disabled = state.translating ? "disabled" : "";
  return `<div class="ps-actions"><button type="button" class="ps-btn-sm" data-action="${action}" data-scope="name"${id} ${disabled}>\uD83C\uDF10 Title</button>${block.content?.trim() ? `<button type="button" class="ps-btn-sm" data-action="${action}" data-scope="content"${id} ${disabled}>\uD83C\uDF10 Prompt</button><button type="button" class="ps-btn-sm" data-action="${action}" data-scope="both"${id} ${disabled}>\uD83C\uDF10 Both</button>` : ""}</div>`;
}
function translationPreview(t, prefix) {
  return `<div class="ps-grid" style="margin-top:8px">${t.name !== undefined ? `<label>Translated title<input data-state="${prefix}Name" value="${esc(t.name)}"></label>` : ""}${t.content !== undefined ? `<label>Translated prompt<textarea data-state="${prefix}Text">${esc(t.content)}</textarea></label>` : ""}</div>`;
}
function batchPreview(state, target) {
  const batch = state.batchTranslation;
  if (!batch || batch.target !== target)
    return "";
  return `<div class="ps-panel"><h4>Review ${batch.entries.length} translated blocks</h4><p class="ps-muted">Compare original vs. translated text before applying.</p>${batch.entries.map((e) => `<details style="margin:6px 0"><summary>${esc(e.original.name || "Untitled")} ${e.name !== undefined ? `→ <strong>${esc(e.name)}</strong>` : ""}</summary>${e.content !== undefined ? `<div class="ps-grid" style="margin-top:6px"><div><span class="ps-muted">Original</span><pre class="ps-result">${esc(e.original.content)}</pre></div><div><span class="ps-muted">Translated</span><pre class="ps-result">${esc(e.content)}</pre></div></div>` : ""}</details>`).join("")}<div class="ps-actions" style="margin-top:8px"><button type="button" class="ps-primary ps-btn-sm" data-action="apply-batch" data-target="${target}">Apply Batch</button><button type="button" class="ps-btn-sm" data-action="discard-batch">Discard</button></div></div>`;
}
function bulkControls(state, target) {
  const disabled = state.translating ? "disabled" : "";
  return `<div class="ps-card" style="margin:8px 0"><div class="ps-between"><strong>Batch Translate (${target === "source" ? "Source Preset" : "Current Draft"}) → ${esc(state.translationLanguage)}</strong><span class="ps-muted" data-batch-progress aria-live="polite"></span></div><div class="ps-row" style="margin-top:6px">${["selected", "all"].map((group) => `<div class="ps-actions"><span class="ps-muted">${group === "selected" ? "Checked:" : "All:"}</span>${[["name", "Titles"], ["content", "Prompts"], ["both", "Both"]].map(([scope, label]) => `<button type="button" class="ps-btn-sm" data-action="translate-batch" data-target="${target}" data-group="${group}" data-scope="${scope}" ${disabled}>${label}</button>`).join("")}</div>`).join(" · ")}</div>${batchPreview(state, target)}</div>`;
}
function renderArchitectTab(ctx, state) {
  const d = state.draft;
  if (state.editorMode === "native") {
    return `<div class="ps-panel"><div class="ps-between" style="margin-bottom:10px"><div><h3>Native Loom Block Editor</h3><p class="ps-muted">Drag-and-drop blocks, configure placement selectors, and insert macros using Lumiverse's built-in component.</p></div><button type="button" class="ps-btn-sm ps-primary" data-action="editor-mode" data-mode="studio">⇄ Switch to Studio Inspector</button></div><div id="ps-native-loom-slot"></div></div>`;
  }
  const b = d.prompt_order[state.selected];
  const varDiag = buildPresetVariableDiagnostics(d.prompt_order);
  const categoryBlocks = d.prompt_order.filter((blk) => blk.marker === "category");
  const allCatsCollapsed = categoryBlocks.length > 0 && categoryBlocks.every((c) => state.collapsedCategories.includes(c.id));
  let currentCatId = null;
  const hasSearchOrFilter = Boolean(state.blockSearch.trim()) || state.blockFilter !== "all";
  const filteredBlocks = d.prompt_order.map((block, index) => {
    if (block.marker === "category")
      currentCatId = block.id;
    return {
      block,
      index,
      parentCatId: block.marker === "category" ? null : currentCatId,
      isChild: block.marker !== "category" && Boolean(currentCatId)
    };
  }).filter(({ block, parentCatId }) => {
    if (!hasSearchOrFilter && parentCatId && state.collapsedCategories.includes(parentCatId))
      return false;
    if (state.blockFilter === "enabled" && !block.enabled)
      return false;
    if (state.blockFilter === "categories" && block.marker !== "category")
      return false;
    if (state.blockFilter === "markers" && (!block.marker || block.marker === "category"))
      return false;
    if (state.blockSearch.trim()) {
      const q = state.blockSearch.toLowerCase();
      return (block.name || "").toLowerCase().includes(q) || (block.content || "").toLowerCase().includes(q);
    }
    return true;
  });
  const macroData = state.macroPreview?.blockId === b?.id ? state.macroPreview : null;
  const varCount = Array.isArray(b?.variables) ? b.variables.length : 0;
  const markerOptions = b && b.marker && !MARKERS.some((m) => m.id === b.marker) ? [...MARKERS, { id: b.marker, label: `${b.marker} (Preset Marker)` }] : MARKERS;
  const presetVarNames = [];
  for (const blk of d.prompt_order) {
    if (Array.isArray(blk.variables)) {
      for (const v of blk.variables) {
        if (v?.name && !presetVarNames.includes(v.name))
          presetVarNames.push(v.name);
      }
    }
  }
  return `
    <div class="ps-panel" style="padding:10px 14px">
      <div class="ps-between">
        <div class="ps-chips">
          ${[["all", "All"], ["enabled", "Active"], ["categories", "Categories"], ["markers", "Markers"]].map(([id, label]) => `<button type="button" class="ps-btn-sm ${state.blockFilter === id ? "ps-primary" : ""}" data-action="filter-blocks" data-filter="${id}">${label}</button>`).join("")}
          <input style="width:160px;max-width:100%;min-height:31px;padding:3px 8px" placeholder="Filter blocks…" data-state="blockSearch" value="${esc(state.blockSearch)}">
        </div>
        <div class="ps-actions">
          <button type="button" class="ps-btn-sm" data-action="open-find-replace" title="Find & replace across all unlocked blocks">\uD83D\uDD0D Find & Replace</button>
          <button type="button" class="ps-btn-sm ps-primary" data-action="add-block">＋ Add Prompt</button>
          <button type="button" class="ps-btn-sm" data-action="add-category">＋ Add Category</button>
          <button type="button" class="ps-btn-sm" data-action="quick-insert-template">\uD83D\uDCE6 ＋ Add Template</button>
          ${state.selectedDraft.length ? `
            <button type="button" class="ps-btn-sm" data-action="quick-template-from-selected">\uD83D\uDCE6 Save Checked (${state.selectedDraft.length}) as Template…</button>
            <button type="button" class="ps-btn-sm" data-action="enable-checked-blocks">✓ Enable (${state.selectedDraft.length})</button>
            <button type="button" class="ps-btn-sm" data-action="disable-checked-blocks">○ Disable (${state.selectedDraft.length})</button>
            <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-checked-blocks">\uD83D\uDDD1 Delete (${state.selectedDraft.length})</button>
          ` : ""}
          ${ctx.components?.mountLoomBlockEditor ? '<button type="button" class="ps-btn-sm" data-action="editor-mode" data-mode="native">⇄ Native Loom Editor</button>' : ""}
        </div>
      </div>
    </div>

    <div class="ps-columns ${state.mobileDetailOpen ? "ps-has-detail" : ""} ${state.showMacroPane ? "ps-with-xray" : ""}">
      <div class="ps-col-list ps-panel" data-scroll-id="prompt-order-list">
        <div class="ps-between" style="margin-bottom:8px">
          <strong>Prompt Order (${filteredBlocks.length}/${d.prompt_order.length})</strong>
          ${categoryBlocks.length ? `<button type="button" class="ps-btn-sm" data-action="toggle-all-categories">${allCatsCollapsed ? "▾ Expand Categories" : "▸ Collapse Categories"}</button>` : '<span class="ps-muted">Drag ⠿ to reorder</span>'}
        </div>
        <div class="ps-list">
          ${filteredBlocks.map(({ block, index, isChild }) => {
    const tok = state.tokenCounts[block.id];
    const defCnt = varDiag.defCountByBlock.get(block.id) || 0;
    const refCnt = varDiag.refCountByBlock.get(block.id) || 0;
    const isCat = block.marker === "category";
    const isCatCollapsed = isCat && state.collapsedCategories.includes(block.id);
    return `
              <div class="ps-block ${isCat ? "ps-is-cat" : isChild ? "ps-is-child" : ""} ${!block.enabled ? "ps-is-off" : ""} ${index === state.selected ? "ps-active-row" : ""}" draggable="true" data-context-index="${index}">
                <span class="ps-drag-handle" data-drag-handle="${index}" title="Drag to reorder">⠿</span>
                ${isCat ? `<button type="button" class="ps-row-btn" data-action="toggle-category-collapse" data-cat-id="${esc(block.id)}" aria-expanded="${!isCatCollapsed}" title="${isCatCollapsed ? "Expand category" : "Collapse category"}">${isCatCollapsed ? "▸" : "▾"}</button>` : `<input type="checkbox" style="width:auto;min-height:18px;flex:none" data-draft-id="${esc(block.id)}" aria-label="Select ${esc(block.name)}" ${state.selectedDraft.includes(block.id) ? "checked" : ""}>`}
                <button type="button" class="ps-block-main" data-action="select-block" data-index="${index}" aria-current="${index === state.selected}" title="${esc(block.name || "Untitled")}">
                  <div class="ps-block-title-row">
                    ${block.color ? `<span class="ps-dot" style="background:${esc(block.color)}"></span>` : ""}
                    ${block.isLocked ? '<span title="Locked" style="font-size:0.75rem;flex:none">\uD83D\uDD12</span>' : ""}
                    <span class="ps-block-title">${esc(block.name || "Untitled")}</span>
                  </div>
                  <div class="ps-block-sub">
                    <span>${esc(block.marker || block.role)}</span>
                    ${block.content?.trim() && tok ? `<span data-token-id="${esc(block.id)}">· ${tok}t</span>` : `<span data-token-id="${esc(block.id)}"></span>`}
                    ${defCnt ? `<span class="ps-mini-badge ps-def" title="Defines ${defCnt} variable(s)">D${defCnt}</span>` : ""}
                    ${refCnt ? `<span class="ps-mini-badge ps-ref" title="References ${refCnt} variable(s)">V${refCnt}</span>` : ""}
                  </div>
                </button>
                <div class="ps-row-actions">
                  <button type="button" class="ps-row-btn ps-row-step" data-action="move-row-up" data-index="${index}" ${index === 0 ? "disabled" : ""} title="Move up">↑</button>
                  <button type="button" class="ps-row-btn ps-row-step" data-action="move-row-down" data-index="${index}" ${index >= d.prompt_order.length - 1 ? "disabled" : ""} title="Move down">↓</button>
                  ${!isCat ? `<button type="button" class="ps-row-btn ${block.enabled ? "ps-toggle-on" : ""}" data-action="toggle" data-index="${index}" aria-pressed="${!!block.enabled}">${block.enabled ? "On" : "Off"}</button>` : ""}
                  <button type="button" class="ps-row-btn ps-danger-btn ps-row-step" data-action="delete-row" data-index="${index}" title="Delete block">\uD83D\uDDD1</button>
                  <button type="button" class="ps-row-btn" data-action="block-menu" data-index="${index}" title="More actions">⋯</button>
                </div>
              </div>`;
  }).join("") || '<p class="ps-muted">No matching blocks.</p>'}
        </div>
      </div>

      <div class="ps-col-detail" data-scroll-id="inspector-detail">
        ${!b ? '<div class="ps-panel"><p class="ps-muted">Select or add a block to inspect.</p></div>' : `
          <div class="ps-panel">
            <div class="ps-between" style="margin-bottom:12px">
              <div class="ps-row">
                <button type="button" class="ps-btn-sm ps-mobile-back" data-action="close-mobile-detail">← Back</button>
                <h3>${esc(b.name || "Untitled")}</h3>
                <span class="ps-pill ps-pill-accent">${esc(b.marker || b.role)}</span>
                <button type="button" class="ps-btn-sm ${b.enabled ? "ps-toggle-on" : ""}" data-action="toggle" data-index="${state.selected}">${b.enabled ? "● Active in Prompt" : "○ Disabled (Skipped)"}</button>
              </div>
              <div class="ps-actions">
                <button type="button" class="ps-btn-sm ${b.isLocked ? "ps-primary" : ""}" data-action="toggle-lock">${b.isLocked ? "\uD83D\uDD12 Locked" : "\uD83D\uDD13 Unlocked"}</button>
                <button type="button" class="ps-btn-sm" data-action="view" data-view="variables">\uD83C\uDF9B Variables (${varCount})</button>
                <button type="button" class="ps-btn-sm ${state.showMacroPane ? "ps-primary" : ""}" data-action="toggle-macro-pane">⚡ Macro Preview</button>
                <button type="button" class="ps-btn-sm ps-primary" data-action="open-text-editor" ${b.isLocked ? "disabled" : ""}>⤢ Expand Editor</button>
              </div>
            </div>

            ${b.isLocked ? '<div class="ps-notice" style="margin-bottom:12px;border-left-color:var(--ps-warning)">\uD83D\uDD12 This block is locked against accidental text edits. Click <strong>\uD83D\uDD12 Locked</strong> above to unlock.</div>' : ""}

            <!-- Primary 80/20 Fields Front & Center -->
            <div class="ps-grid" style="margin-bottom:10px">
              <label>Block Title
                <input data-block="name" value="${esc(b.name)}" placeholder="e.g. Tone & World Rules" ${b.isLocked ? "disabled" : ""}>
              </label>
              <label>Role
                <select data-block="role" ${b.isLocked ? "disabled" : ""}>
                  ${["system", "user", "assistant", "user_append", "assistant_append"].map((x) => `<option value="${x}" ${b.role === x ? "selected" : ""}>${x}</option>`).join("")}
                </select>
              </label>
            </div>

            <!-- Quick Macro Toolbar -->
            <div class="ps-card" style="margin-bottom:10px;padding:8px 10px">
              <div class="ps-between" style="gap:6px">
                <div class="ps-row" style="flex:1">
                  <span class="ps-muted" style="font-weight:600">Quick Insert:</span>
                  <div class="ps-chips">
                    ${["{{char}}", "{{user}}", "{{persona}}", "{{if::...}}", "{{memories}}"].map((chip) => `<button type="button" class="ps-btn-sm ps-mono" data-action="insert-macro-chip" data-snippet="${esc(chip === "{{if::...}}" ? `{{if::{{isGroupChat}}}}

{{/if}}` : chip)}" ${b.isLocked ? "disabled" : ""}>${esc(chip)}</button>`).join("")}
                    ${presetVarNames.slice(0, 3).map((vn) => `<button type="button" class="ps-btn-sm ps-mono" data-action="insert-macro-chip" data-snippet="{{var::${esc(vn)}}}" ${b.isLocked ? "disabled" : ""}>{{var::${esc(vn)}}}</button>`).join("")}
                  </div>
                </div>
                <div class="ps-row">
                  <select style="width:auto;max-width:200px;min-height:30px;padding:2px 6px;font-size:0.8rem" data-state="quickMacroSnippet" ${b.isLocked ? "disabled" : ""}>
                    ${MACRO_CATALOG.map((m) => `<option value="${esc(m.snippet)}" ${state.quickMacroSnippet === m.snippet ? "selected" : ""}>${esc(m.group)}: ${esc(m.label)}</option>`).join("")}
                  </select>
                  <button type="button" class="ps-btn-sm ps-primary" data-action="insert-selected-macro" ${b.isLocked ? "disabled" : ""}>＋ Insert</button>
                </div>
              </div>
            </div>

            <!-- Prompt Content Editor -->
            <label style="margin-bottom:12px">
              <div class="ps-between" style="margin-bottom:4px">
                <span>Prompt Content <span class="ps-muted">(supports {{macros}} and variables)</span></span>
                <button type="button" class="ps-btn-sm" data-action="copy-active-block-content" title="Copy to clipboard">\uD83D\uDCCB Copy</button>
              </div>
              <textarea class="ps-content" data-block="content" placeholder="${b.marker ? `Structural marker (${b.marker}) — leave empty unless overriding.` : "Write your prompt instructions here…"}" ${b.isLocked ? "disabled" : ""}>${esc(b.content)}</textarea>
            </label>

            <!-- Collapsible: Advanced Placement, Depth & Triggers -->
            <details class="ps-collapsible" data-details-id="block-advanced-options">
              <summary>
                <span>⚙️ Placement, Depth & Injection Triggers</span>
                <span class="ps-muted" style="font-size:0.8rem">${esc(b.position)} · Depth ${esc(b.depth ?? 0)} · ${b.marker || "Normal"}</span>
              </summary>
              <div class="ps-grid">
                <label>Position in Prompt
                  <select data-block="position" ${b.isLocked ? "disabled" : ""}>
                    ${[["pre_history", "Before Chat History (pre_history)"], ["post_history", "After Chat History (post_history)"], ["in_history", "At Depth in History (in_history)"]].map(([val, lbl]) => `<option value="${val}" ${b.position === val ? "selected" : ""}>${lbl}</option>`).join("")}
                  </select>
                </label>
                ${b.position === "in_history" ? `
                  <label>In-History Depth (messages from the end)
                    <div id="ps-depth-stepper-slot">
                      <input data-block="depth" type="number" min="0" max="100" value="${esc(b.depth ?? 0)}" ${b.isLocked ? "disabled" : ""}>
                    </div>
                  </label>
                ` : ""}
                <label>Structural Marker
                  <select data-block="marker" ${b.isLocked ? "disabled" : ""}>
                    ${markerOptions.map((m) => `<option value="${esc(m.id)}" ${(b.marker || "") === m.id ? "selected" : ""}>${esc(m.label)}</option>`).join("")}
                  </select>
                </label>
                ${b.marker === "category" ? `
                  <label>Category Selection Mode
                    <select data-block="categoryMode" ${b.isLocked ? "disabled" : ""}>
                      <option value="">None</option>
                      <option value="checkbox" ${b.categoryMode === "checkbox" ? "selected" : ""}>Checkbox (Multi)</option>
                      <option value="radio" ${b.categoryMode === "radio" ? "selected" : ""}>Radio (Single)</option>
                    </select>
                  </label>
                ` : ""}
                <label>Block Group <span class="ps-muted">(Optional mutual-exclusion group ID)</span>
                  <input data-block="group" value="${esc(b.group || "")}" placeholder="e.g. style_group" ${b.isLocked ? "disabled" : ""}>
                </label>
              </div>

              <div style="margin-top:10px">
                <label>Injection Triggers <span class="ps-muted">(Empty = active on all generations)</span>
                  <div class="ps-chips" style="margin-top:4px">
                    ${TRIGGERS.map((tr) => `<button type="button" class="ps-btn-sm ${(b.injectionTrigger || []).includes(tr) ? "ps-primary" : ""}" data-action="toggle-trigger" data-trigger="${tr}" ${b.isLocked ? "disabled" : ""}>${tr}</button>`).join("")}
                  </div>
                </label>
              </div>

              <div class="ps-between" style="margin-top:12px">
                <div class="ps-row">
                  <span class="ps-muted">Color Tag:</span>
                  <button type="button" class="ps-btn-sm" data-action="set-color" data-color="">None</button>
                  ${SWATCHES.map((c) => `<button type="button" class="ps-swatch-btn" style="background:${c}" data-action="set-color" data-color="${c}" aria-label="Color ${c}" aria-pressed="${b.color === c}"></button>`).join("")}
                </div>
                ${translationButtons(state, "translate", b)}
              </div>
            </details>

            <!-- Translation preview if active on this block -->
            ${state.translation?.blockId === b.id ? `
              <div class="ps-card" style="margin-top:10px">
                <strong>Translation Preview (${esc(state.translationLanguage)})</strong>
                ${translationPreview(state.translation, "translation")}
                <div class="ps-actions" style="margin-top:8px">
                  <button type="button" class="ps-primary ps-btn-sm" data-action="apply-translation">Apply Translation</button>
                  <button type="button" class="ps-btn-sm" data-action="discard-translation">Discard</button>
                </div>
              </div>
            ` : ""}

            <!-- Bottom action row -->
            <div class="ps-between" style="margin-top:14px;padding-top:12px;border-top:1px solid var(--ps-border)">
              <div class="ps-actions">
                <button type="button" class="ps-btn-sm ps-primary" data-action="save" ${state.busy ? "disabled" : ""}>\uD83D\uDCBE Save Changes</button>
                <button type="button" class="ps-btn-sm" data-action="duplicate-block">Duplicate</button>
              </div>
              <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-block">\uD83D\uDDD1 Delete Block</button>
            </div>
          </div>
        `}
      </div>

      ${state.showMacroPane && b ? `
        <div class="ps-panel">
          <div class="ps-between">
            <h4>⚡ Live Macro Preview</h4>
            <button type="button" class="ps-btn-sm ps-primary" data-action="refresh-macro">↻ Refresh</button>
          </div>
          <p class="ps-muted" style="margin:4px 0 8px">Evaluated non-committing against ${state.chatId ? "selected chat" : "global context"}.</p>
          ${macroData?.diagnostics?.length ? `
            <div class="ps-notice" style="border-left-color:var(--ps-warning)">
              <strong>${macroData.diagnostics.length} Diagnostic(s):</strong>
              <ul style="margin:4px 0;padding-left:18px">${macroData.diagnostics.map((dg) => `<li>${esc(dg.message)}</li>`).join("")}</ul>
            </div>
          ` : ""}
          <pre class="ps-result">${esc(state.macroBusy ? "Resolving macros…" : macroData ? macroData.text || "(Resolved to empty string)" : "Click Refresh to preview expanded macros.")}</pre>
        </div>
      ` : ""}
    </div>
  `;
}
function renderVariablesTab(state) {
  const d = state.draft;
  const b = d?.prompt_order?.[state.selected];
  if (!b) {
    return `<div class="ps-panel"><p class="ps-muted">Select a block in Tab 01 first to configure its Prompt Variables.</p></div>`;
  }
  const vars = Array.isArray(b.variables) ? b.variables : [];
  const savedBlockVars = d.metadata?.promptVariables?.[b.id] || {};
  const previewText = resolveBlockVariablesPreview(b, savedBlockVars);
  const diag = buildPresetVariableDiagnostics(d.prompt_order);
  const hasIssues = diag.missing.length > 0 || diag.duplicates.length > 0 || diag.unused.length > 0;
  return `
    <!-- Top 1-Click Beginner Starter Gallery -->
    <div class="ps-panel" style="padding:12px 14px">
      <div class="ps-between">
        <div>
          <h3 style="display:flex;align-items:center;gap:6px"><span>✨ 1-Click Starter Examples</span></h3>
          <p class="ps-muted" style="margin-top:2px">Click any example below to instantly add a working variable and its prompt macro to “${esc(b.name || "this block")}”.</p>
        </div>
        <div class="ps-actions">
          <select data-action="select-block-dropdown" style="max-width:240px">
            ${d.prompt_order.map((blk, idx) => `<option value="${idx}" ${idx === state.selected ? "selected" : ""}>${esc(blk.name || "Untitled")} (${(blk.variables || []).length} vars)</option>`).join("")}
          </select>
          <button type="button" class="ps-btn-sm ps-primary" data-action="add-variable">＋ Custom Variable</button>
        </div>
      </div>

      <div class="ps-starter-grid">
        ${VARIABLE_STARTER_EXAMPLES.map((ex) => `
          <button type="button" class="ps-starter-card" data-action="apply-starter-variable" data-starter-id="${esc(ex.id)}" title="Add ${esc(ex.title)} to this block">
            <div>
              <div class="ps-between" style="width:100%;margin-bottom:4px">
                <strong style="font-size:0.86rem">${esc(ex.title)}</strong>
                <span class="ps-pill ps-pill-accent" style="font-size:0.68rem">${esc(ex.badge)}</span>
              </div>
              <p class="ps-muted" style="font-size:0.75rem;line-height:1.3">${esc(ex.summary)}</p>
            </div>
            <div style="font-size:0.75rem;font-weight:700;color:var(--ps-accent);margin-top:8px">＋ Add to Block</div>
          </button>
        `).join("")}
      </div>
    </div>

    <!-- Live Interactive Preview Panel -->
    ${vars.length > 0 ? `
      <div class="ps-panel" style="border-left:3px solid var(--ps-accent)">
        <div class="ps-between">
          <div>
            <h4 style="display:flex;align-items:center;gap:6px"><span>\uD83C\uDFAE Live Interactive Preview</span><span class="ps-pill ps-pill-ok">Active</span></h4>
            <p class="ps-muted" style="margin-top:2px">Test your variables with real Lumiverse controls on the left. See how they resolve in the prompt on the right.</p>
          </div>
          <button type="button" class="ps-btn-sm" data-action="reset-block-variables" title="Reset all variables on this block to their default values">↺ Reset to Defaults</button>
        </div>

        <div class="ps-live-preview-grid">
          <div class="ps-card" style="padding:10px 12px">
            <strong style="font-size:0.82rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--ps-muted)">What the User Sees</strong>
            <div id="ps-var-preview-controls-slot" style="margin-top:10px;display:grid;gap:12px"></div>
          </div>
          <div class="ps-card" style="padding:10px 12px">
            <div class="ps-between">
              <strong style="font-size:0.82rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--ps-accent)">Resolved Block Output (Sent to AI)</strong>
              <button type="button" class="ps-btn-sm ps-btn-icon" data-action="copy-var-preview-output" title="Copy resolved text">\uD83D\uDCCB</button>
            </div>
            <pre class="ps-result" id="ps-var-preview-output-slot" style="margin-top:8px;max-height:260px;font-size:0.85rem">${esc(previewText || "(Block content is empty)")}</pre>
          </div>
        </div>
      </div>
    ` : ""}

    <!-- Linter / Diagnostics if there are issues -->
    ${hasIssues ? `
      <details class="ps-panel ps-collapsible" data-details-id="var-health-linter" open style="border-left-color:var(--ps-warning)">
        <summary>
          <span>\uD83E\uDE7A Variable Diagnostics (${diag.missing.length + diag.duplicates.length + diag.unused.length})</span>
          <span class="ps-pill ps-pill-warn">Review Warnings</span>
        </summary>
        <div class="ps-list" style="margin-top:8px">
          ${diag.missing.map((m) => `
            <div class="ps-card ps-between" style="border-left:3px solid var(--ps-warning)">
              <div>
                <strong>Unknown <code>{{var::${esc(m.name)}}}</code></strong>
                <div class="ps-muted">Used in ${esc(m.refs.map((r) => r.blockName).join(", "))} — but no block defines it.</div>
              </div>
              <button type="button" class="ps-btn-sm" data-action="jump-to-block-id" data-block-id="${esc(m.refs[0].blockId)}">Fix in Block →</button>
            </div>
          `).join("")}
          ${diag.duplicates.map((dup) => `
            <div class="ps-card" style="border-left:3px solid var(--ps-danger)">
              <strong>Duplicate <code>{{var::${esc(dup.name)}}}</code></strong>
              <div class="ps-muted">Defined in multiple blocks: ${esc(dup.defs.map((df) => df.blockName).join(", "))}</div>
            </div>
          `).join("")}
          ${diag.unused.map((u) => `
            <div class="ps-card ps-between">
              <div>
                <strong>Unused <code>{{var::${esc(u.name)}}}</code></strong>
                <div class="ps-muted">Defined in ${esc(u.defs[0].blockName)}, but never referenced in any prompt block.</div>
              </div>
              <button type="button" class="ps-btn-sm" data-action="jump-to-block-id" data-block-id="${esc(u.defs[0].blockId)}">Inspect →</button>
            </div>
          `).join("")}
        </div>
      </details>
    ` : ""}

    <!-- Configured Variables List -->
    <div class="ps-panel">
      <div class="ps-between">
        <div>
          <h3>Configured Variables for “${esc(b.name || "Untitled")}” (${vars.length})</h3>
          <p class="ps-muted">Define the options, min/max values, or defaults for each variable on this block.</p>
        </div>
      </div>
    </div>

    <div class="ps-list" data-scroll-id="variables-list">
      ${vars.map((v, vi) => {
    return `
          <div class="ps-panel">
            <div class="ps-between" style="margin-bottom:8px">
              <div class="ps-row">
                <span class="ps-step-badge">${vi + 1}</span>
                <strong>${esc(v.label || v.name || "Variable")}</strong>
                <code class="ps-pill ps-mono">{{var::${esc(v.name || "key")}}}</code>
                <button type="button" class="ps-btn-sm" data-action="insert-var-into-prompt" data-var-name="${esc(v.name || "key")}" title="Insert {{var::${esc(v.name || "key")}}} into prompt">＋ Insert into Prompt</button>
                <button type="button" class="ps-btn-sm ps-btn-icon" data-action="copy-var-macro" data-macro="{{var::${esc(v.name || "key")}}}" title="Copy macro">\uD83D\uDCCB</button>
              </div>
              <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-variable" data-vindex="${vi}">Remove</button>
            </div>

            <div class="ps-grid-3">
              <label>Internal ID (alphanumeric/underscore)
                <input data-var-index="${vi}" data-var-field="name" value="${esc(v.name || "")}" placeholder="e.g. tone">
              </label>
              <label>Display Label shown to User
                <input data-var-index="${vi}" data-var-field="label" value="${esc(v.label || "")}" placeholder="e.g. Tone of Voice">
              </label>
              <label>Control Type
                <select data-var-index="${vi}" data-var-field="type">
                  ${[["text", "Text Field"], ["textarea", "Text Area"], ["number", "Number Box"], ["slider", "Visual Slider"], ["select", "Dropdown Menu"], ["switch", "On / Off Toggle"], ["multiselect", "Multi-Select Checklist"]].map(([tid, tlbl]) => `<option value="${tid}" ${(v.type === "boolean" ? "switch" : v.type) === tid ? "selected" : ""}>${tlbl}</option>`).join("")}
                </select>
              </label>
            </div>

            <div class="ps-grid" style="margin-top:8px">
              <label>Helper Description <span class="ps-muted">(optional tooltip for users)</span>
                <input data-var-index="${vi}" data-var-field="description" value="${esc(v.description || "")}" placeholder="Short explanation of what this variable changes">
              </label>
              <label>Default Value
                <input data-var-index="${vi}" data-var-field="defaultValue" value="${esc(Array.isArray(v.defaultValue) ? v.defaultValue.join(", ") : v.defaultValue ?? "")}" placeholder="Fallback value">
              </label>
            </div>

            ${v.type === "textarea" ? `
              <div class="ps-grid" style="margin-top:8px">
                <label>Text Area Rows (Height)
                  <input type="number" min="2" max="20" data-var-index="${vi}" data-var-field="rows" value="${esc(v.rows ?? 4)}">
                </label>
              </div>
            ` : ""}

            ${v.type === "multiselect" ? `
              <div class="ps-grid" style="margin-top:8px">
                <label>Join Separator <span class="ps-muted">(Default is \\n\\n for paragraphs)</span>
                  <input data-var-index="${vi}" data-var-field="separator" value="${esc((v.separator ?? `

`).replace(/\n/g, "\\n"))}">
                </label>
              </div>
            ` : ""}

            ${["number", "slider"].includes(v.type) ? `
              <div class="ps-grid-3" style="margin-top:8px">
                <label>Min Value
                  <input type="number" data-var-index="${vi}" data-var-field="min" value="${esc(v.min ?? 0)}">
                </label>
                <label>Max Value
                  <input type="number" data-var-index="${vi}" data-var-field="max" value="${esc(v.max ?? 100)}">
                </label>
                <label>Step Increment
                  <input type="number" step="any" data-var-index="${vi}" data-var-field="step" value="${esc(v.step ?? 1)}">
                </label>
              </div>
            ` : ""}

            ${["select", "multiselect"].includes(v.type) ? `
              <div class="ps-card" style="margin-top:8px">
                <div class="ps-between">
                  <strong>Options List (${(v.options || []).length})</strong>
                  <button type="button" class="ps-btn-sm ps-primary" data-action="add-var-option" data-vindex="${vi}">＋ Add Option</button>
                </div>
                <div class="ps-list" style="margin-top:6px">
                  ${(v.options || []).map((opt, oi) => `
                    <div class="ps-row">
                      <input style="flex:1" placeholder="ID/Key" data-var-index="${vi}" data-opt-index="${oi}" data-opt-field="id" value="${esc(opt.id ?? opt.label ?? "")}">
                      <input style="flex:1" placeholder="User-Friendly Label" data-var-index="${vi}" data-opt-index="${oi}" data-opt-field="label" value="${esc(opt.label || "")}">
                      <input style="flex:2" placeholder="Text substituted into prompt" data-var-index="${vi}" data-opt-index="${oi}" data-opt-field="value" value="${esc(opt.value || "")}">
                      <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-var-option" data-vindex="${vi}" data-oindex="${oi}">✕</button>
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}
          </div>
        `;
  }).join("") || '<div class="ps-panel"><p class="ps-muted">No variables on this block yet. Click one of the <strong>✨ 1-Click Starter Examples</strong> above or “＋ Custom Variable” to get started.</p></div>'}
    </div>

    <!-- Hidden by default: Raw Variables JSON -->
    <details class="ps-panel ps-collapsible" data-details-id="raw-vars-json">
      <summary><span>⚙️ Advanced: Raw Block Variables JSON</span><span class="ps-muted">Inspect raw schema</span></summary>
      <textarea data-json="variables">${esc(JSON.stringify(b.variables || [], null, 2))}</textarea>
      <button type="button" class="ps-btn-sm" style="margin-top:6px" data-action="apply-json" data-target="variables">Apply Variables JSON</button>
    </details>
  `;
}
function renderSamplersTab(state) {
  const d = state.draft;
  const p = d.parameters || {};
  return `
    <div class="ps-panel">
      <div class="ps-between">
        <div>
          <h3>Core Preset Settings</h3>
          <p class="ps-muted">Set the preset name and the core sampling parameters that determine creativity and response length.</p>
        </div>
        <button type="button" class="ps-btn-sm" data-action="copy-parameters-json">\uD83D\uDCCB Copy Parameters JSON</button>
      </div>

      <div class="ps-grid" style="margin-top:10px">
        <label>Preset Name
          <input data-preset="name" value="${esc(d.name)}" placeholder="My Custom Preset">
        </label>
        <label>Max Response Tokens <span class="ps-muted">(Length ceiling: ~300 = short, ~800 = medium, 2000+ = novel)</span>
          <input type="number" min="1" max="128000" data-param-num="max_tokens" value="${esc(p.max_tokens ?? "")}" placeholder="Provider default (usually 4096)">
        </label>
      </div>

      <div class="ps-grid" style="margin-top:12px" id="ps-sampler-sliders">
        <div class="ps-card" data-slider-slot="temperature"></div>
        <div class="ps-card" data-slider-slot="top_p"></div>
      </div>
    </div>

    <!-- Collapsible Advanced Samplers -->
    <details class="ps-panel ps-collapsible" data-details-id="advanced-samplers">
      <summary>
        <span>⚙️ Advanced Penalties & Repetition Controls</span>
        <span class="ps-muted">Min-P, Frequency/Presence penalties, Seed</span>
      </summary>
      <div class="ps-grid" style="margin-top:10px">
        <div class="ps-card" data-slider-slot="min_p"></div>
        <div class="ps-card" data-slider-slot="frequency_penalty"></div>
        <div class="ps-card" data-slider-slot="presence_penalty"></div>
        <div class="ps-card" data-slider-slot="repetition_penalty"></div>
      </div>

      <div class="ps-grid-3" style="margin-top:12px">
        <label>Top-K <span class="ps-muted">(0 = disabled)</span>
          <input type="number" min="0" max="1000" data-param-num="top_k" value="${esc(p.top_k ?? "")}" placeholder="0">
        </label>
        <label>Fixed Seed <span class="ps-muted">(empty = random)</span>
          <input type="number" data-param-num="seed" value="${esc(p.seed ?? "")}" placeholder="Random">
        </label>
        <label>Provider Type
          <input data-preset="provider" value="${esc(d.provider)}" placeholder="loom">
        </label>
      </div>
    </details>

    <!-- Collapsible Raw Native JSON -->
    <details class="ps-panel ps-collapsible" data-details-id="raw-json-inspector">
      <summary>
        <span>⚙️ Raw Presets JSON Inspector</span>
        <span class="ps-muted">Inspect parameters, prompts, and metadata bags</span>
      </summary>
      ${[["parameters", "Parameters (parameters)"], ["prompts", "Completion Prompts (prompts)"], ["metadata", "Metadata & Variables (metadata)"]].map(([k, l]) => `
        <details style="margin:8px 0" data-details-id="json-${k}">
          <summary>${l}</summary>
          <textarea data-json="${k}">${esc(JSON.stringify(d[k] || {}, null, 2))}</textarea>
          <button type="button" class="ps-btn-sm" style="margin-top:6px" data-action="apply-json" data-target="${k}">Apply ${l}</button>
        </details>
      `).join("")}
    </details>
  `;
}
function renderRemixTab(state) {
  const allExpanded = state.importBlocks.length > 0 && state.expandedImports.length >= state.importBlocks.length;
  const allCollapsed = state.expandedImports.length === 0;
  const checkedCount = state.selectedImports.length;
  return `
    <!-- Saved Templates first -->
    <div class="ps-panel">
      <div class="ps-between">
        <div>
          <h3>\uD83D\uDCE6 Saved Template Library (${state.templates.length})</h3>
          <p class="ps-muted">Quickly insert pre-built modules of blocks into your draft, or export templates as JSON.</p>
        </div>
        <div class="ps-actions">
          <button type="button" class="ps-btn-sm" data-action="import-template-json">\uD83D\uDCE5 Import Template JSON</button>
        </div>
      </div>

      <div class="ps-list" style="margin-top:10px">
        ${state.templates.map((t, i) => `
          <div class="ps-block">
            <span style="flex:1">
              <strong>${esc(t.name)}</strong>
              <span class="ps-pill ps-pill-accent">${t.entries.length} blocks</span>
            </span>
            <button type="button" class="ps-btn-sm" data-action="copy-template-text" data-index="${i}" title="Copy all prompt text in this template">\uD83D\uDCCB Copy</button>
            <button type="button" class="ps-btn-sm ps-primary" data-action="insert-template" data-index="${i}">＋ Insert into Preset</button>
            <button type="button" class="ps-btn-sm" data-action="export-template" data-index="${i}">\uD83D\uDCE4 Export</button>
            <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-template" data-index="${i}">\uD83D\uDDD1</button>
          </div>
        `).join("") || '<p class="ps-muted">No saved templates yet. Check any blocks in Tab 01 or below and click “\uD83D\uDCE6 Save Checked as Template…”.</p>'}
      </div>
    </div>

    <!-- Source Preset Mixer -->
    <div class="ps-panel">
      <div class="ps-between">
        <div>
          <h3>Mix & Copy Blocks from Another Preset</h3>
          <p class="ps-muted">Select an existing preset from your library to inspect and copy blocks straight into your draft.</p>
        </div>
      </div>

      <label style="margin-top:10px">Select Preset to Explore
        <select data-action="import-source">
          <option value="">Choose an existing preset…</option>
          ${selectOptions(state.presets, state.importPreset, (x) => x.name)}
        </select>
      </label>

      ${state.importBlocks.length ? `
        <div class="ps-between" style="margin:12px 0 6px">
          <div class="ps-row">
            <strong>Source Blocks (${state.importBlocks.length})</strong>
            ${checkedCount ? `<span class="ps-pill ps-pill-accent">${checkedCount} checked</span>` : ""}
          </div>
          <div class="ps-actions">
            ${checkedCount ? `
              <button type="button" class="ps-btn-sm ps-primary" data-action="add-checked-imports">＋ Add Checked (${checkedCount}) to Draft</button>
              <button type="button" class="ps-btn-sm" data-action="collect-blocks">\uD83D\uDCE6 Save Checked (${checkedCount}) as Template…</button>
            ` : ""}
            <button type="button" class="ps-btn-sm" data-action="collapse-all-imports" ${allCollapsed ? "disabled" : ""}>▸ Collapse All</button>
            <button type="button" class="ps-btn-sm" data-action="expand-all-imports" ${allExpanded ? "disabled" : ""}>▾ Expand All</button>
          </div>
        </div>

        <div class="ps-list" style="margin-top:8px">
          ${state.importBlocks.map((block, i) => {
    const isExpanded = state.expandedImports.includes(i);
    const hasTranslation = state.sourceTranslation?.presetId === state.importPreset && state.sourceTranslation?.index === i;
    return `
              <article class="ps-card ${block.marker === "category" ? "ps-is-cat" : ""}" style="padding:${isExpanded ? "12px" : "7px 12px"}">
                <div class="ps-between">
                  <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
                    <input style="width:auto;min-height:20px" type="checkbox" data-import-index="${i}" aria-label="Select ${esc(block.name || "Untitled")}" ${state.selectedImports.includes(i) ? "checked" : ""}>
                    <button type="button" class="ps-btn-sm ps-btn-icon" data-action="toggle-import-expand" data-index="${i}" aria-expanded="${isExpanded}">${isExpanded ? "▾" : "▸"}</button>
                    <button type="button" class="ps-block-main" data-action="toggle-import-expand" data-index="${i}">
                      <strong>${esc(block.name || "Untitled")}</strong>
                      <span class="ps-pill">${block.marker === "category" ? "Category" : esc(block.marker || block.role)}</span>
                    </button>
                  </div>
                  <div class="ps-actions">
                    <button type="button" class="ps-btn-sm" data-action="copy-source-content" data-index="${i}" title="Copy source text">\uD83D\uDCCB</button>
                    <button type="button" class="ps-primary ps-btn-sm" data-action="import-block" data-index="${i}">＋ Add to Draft</button>
                  </div>
                </div>
                ${isExpanded ? block.content ? `<pre class="ps-result" style="margin-top:8px;max-height:180px">${esc(block.content)}</pre>` : '<p class="ps-muted" style="margin-top:6px">Structural marker — injects dynamic context.</p>' : ""}
              </article>
            `;
  }).join("")}
        </div>
      ` : ""}
    </div>
  `;
}
function renderXRayBreakdown(state) {
  const a = state.assembled;
  if (!a)
    return "";
  const isCustom = a.source === "custom";
  const d = state.draft;
  const nonCatBlocks = (d?.prompt_order || []).filter((b) => b.marker !== "category");
  const enabledCount = nonCatBlocks.filter((b) => b.enabled).length;
  const breakdown = Array.isArray(a.breakdown) ? a.breakdown : [];
  const messages = Array.isArray(a.messages) ? a.messages : [];
  const buckets = { block: 0, chat_history: 0, world_info: 0, memory: 0, authors_note: 0, other: 0 };
  breakdown.forEach((item) => {
    const est = Math.ceil((item.content || "").length / 4);
    if (item.type === "block")
      buckets.block += est;
    else if (item.type === "chat_history")
      buckets.chat_history += est;
    else if (item.type === "world_info")
      buckets.world_info += est;
    else if (item.type === "long_term_memory")
      buckets.memory += est;
    else if (item.type === "authors_note")
      buckets.authors_note += est;
    else
      buckets.other += est;
  });
  const totalEst = Math.max(1, buckets.block + buckets.chat_history + buckets.world_info + buckets.memory + buckets.authors_note + buckets.other);
  const filtered = breakdown.filter((item) => {
    if (state.breakdownFilter !== "all" && item.type !== state.breakdownFilter && item.role !== state.breakdownFilter)
      return false;
    if (state.breakdownSearch.trim()) {
      const q = state.breakdownSearch.toLowerCase();
      return (item.name || "").toLowerCase().includes(q) || (item.content || "").toLowerCase().includes(q);
    }
    return true;
  });
  return `
    <details class="ps-panel ps-collapsible" data-details-id="xray-main-details" ${state.xrayExpanded ? "open" : ""}>
      <summary>
        <span>\uD83D\uDD2C Assembled Prompt X-Ray (${breakdown.length} blocks · ${messages.length} messages)</span>
        <span class="ps-pill ps-pill-accent">~${totalEst.toLocaleString()} est. tokens</span>
      </summary>

      <div class="ps-between" style="margin-bottom:8px">
        <p class="ps-muted">Source: <strong>${isCustom ? "Custom Prompt" : "Preset Blocks"}</strong> · ${enabledCount} blocks active.</p>
        <div class="ps-actions">
          <button type="button" class="ps-btn-sm" data-action="copy-xray-messages">\uD83D\uDCCB Copy Messages JSON</button>
        </div>
      </div>

      <div class="ps-bar-stack" title="Token distribution">
        <div class="ps-bar-seg" style="width:${buckets.block / totalEst * 100}%;background:#a795e8"></div>
        <div class="ps-bar-seg" style="width:${buckets.chat_history / totalEst * 100}%;background:#64b5f6"></div>
        <div class="ps-bar-seg" style="width:${buckets.world_info / totalEst * 100}%;background:#81c784"></div>
        <div class="ps-bar-seg" style="width:${buckets.memory / totalEst * 100}%;background:#ffb74d"></div>
        <div class="ps-bar-seg" style="width:${buckets.authors_note / totalEst * 100}%;background:#f06292"></div>
      </div>

      <div class="ps-between" style="margin:8px 0">
        <div class="ps-chips">
          ${[["all", "All"], ["block", "Preset Blocks"], ["chat_history", "History"], ["world_info", "Lore"], ["authors_note", "Author's Note"], ["system", "System"]].map(([id, lbl]) => `<button type="button" class="ps-btn-sm ${state.breakdownFilter === id ? "ps-primary" : ""}" data-action="filter-breakdown" data-filter="${id}">${lbl}</button>`).join("")}
        </div>
        <input style="width:180px;max-width:100%;min-height:30px;padding:3px 8px" placeholder="Search assembled blocks…" data-state="breakdownSearch" value="${esc(state.breakdownSearch)}">
      </div>

      <div class="ps-list" data-scroll-id="xray-list">
        ${filtered.map((item, idx) => `
          <details class="ps-card" data-details-id="xray-${idx}">
            <summary class="ps-between">
              <span><strong>${esc(item.name || item.type || `Entry ${idx + 1}`)}</strong> <span class="ps-pill">${esc(item.role)}</span> <span class="ps-pill">${esc(item.type)}</span></span>
              <span class="ps-muted">~${Math.ceil((item.content || "").length / 4)}t</span>
            </summary>
            <pre class="ps-result" style="margin-top:8px">${esc(item.content || "(empty)")}</pre>
          </details>
        `).join("") || '<p class="ps-muted">No items match filter.</p>'}
      </div>
    </details>
  `;
}
function renderTestTab(state) {
  const runA = state.runs[state.compareA];
  const runB = state.runs[state.compareB];
  const isCustomPromptMode = state.testPromptSource === "custom";
  const isMultiTurn = state.testTurnMode === "multi";
  const turns = Array.isArray(state.testTurns) ? state.testTurns : [];
  const an = state.authorsNote || { enabled: false, content: "", depth: 4, role: "system" };
  const isChatView = (state.testReplyViewMode || "chat") === "chat";
  return `
    <div class="ps-test-columns">
      <!-- Left Column: Streamlined 3-Step Test Setup -->
      <div class="ps-test-col-ctrl">
        <div class="ps-panel" style="margin-top:0">
          <!-- Step 1: Chat & Connection -->
          <div style="margin-bottom:12px">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
              <span class="ps-step-badge">1</span>
              <strong>Choose Context & Connection</strong>
            </div>
            <div class="ps-grid">
              <label>Context Chat <span class="ps-muted">(Character & history context)</span>
                <select data-state="chatId">
                  <option value="">Choose a chat…</option>
                  ${selectOptions(state.chats, state.chatId, (x) => x.name || x.id)}
                </select>
              </label>
              <label>AI Model Connection
                <select data-state="connectionId">
                  <option value="">Active default connection</option>
                  ${selectOptions(state.connections, state.connectionId, (x) => `${x.name} · ${x.model}`)}
                </select>
              </label>
            </div>
          </div>

          <!-- Step 2: Test Message / Multi-Turn -->
          <div style="margin-bottom:12px">
            <div class="ps-between" style="margin-bottom:6px">
              <div style="display:flex;align-items:center;gap:6px">
                <span class="ps-step-badge">2</span>
                <strong>Test User Message</strong>
              </div>
              <div class="ps-chips">
                <button type="button" class="ps-btn-sm ${!isMultiTurn ? "ps-primary" : ""}" data-action="set-test-turn-mode" data-mode="single">Single Turn</button>
                <button type="button" class="ps-btn-sm ${isMultiTurn ? "ps-primary" : ""}" data-action="set-test-turn-mode" data-mode="multi">\uD83D\uDCAC Thread (${turns.length})</button>
              </div>
            </div>

            ${!isMultiTurn ? `
              <textarea data-state="custom" style="min-height:76px" placeholder="Type a message to test how your preset replies…">${esc(state.custom)}</textarea>
            ` : `
              <div class="ps-card" style="padding:8px">
                <div class="ps-between" style="margin-bottom:6px">
                  <div class="ps-actions">
                    <button type="button" class="ps-btn-sm ps-primary" data-action="add-test-turn">＋ Add Turn</button>
                    <button type="button" class="ps-btn-sm" data-action="fill-dummy-turns">⚡ ＋ 5 Mock Turns</button>
                  </div>
                  <div class="ps-actions">
                    <button type="button" class="ps-btn-sm ps-danger-btn" data-action="clear-test-turns" ${!turns.length ? "disabled" : ""}>Clear</button>
                  </div>
                </div>
                <div class="ps-list" style="max-height:220px;overflow-y:auto">
                  ${turns.map((turn, ti) => `
                    <div class="ps-card" style="padding:6px 8px">
                      <div class="ps-between" style="margin-bottom:3px">
                        <span class="ps-pill">#${ti + 1}</span>
                        <div class="ps-actions">
                          <select style="min-height:24px;font-size:0.75rem" data-turn-idx="${ti}" data-turn-field="role">
                            <option value="user" ${turn.role === "user" ? "selected" : ""}>User</option>
                            <option value="assistant" ${turn.role === "assistant" ? "selected" : ""}>Assistant</option>
                            <option value="system" ${turn.role === "system" ? "selected" : ""}>System</option>
                          </select>
                          <button type="button" class="ps-btn-sm ps-danger-btn ps-btn-icon" data-action="delete-test-turn" data-turn-idx="${ti}">✕</button>
                        </div>
                      </div>
                      <textarea data-turn-idx="${ti}" data-turn-field="content" style="min-height:46px;font-size:0.85rem" placeholder="Turn #${ti + 1} content…">${esc(turn.content)}</textarea>
                    </div>
                  `).join("") || '<p class="ps-muted" style="text-align:center;padding:8px 0">Click “＋ Add Turn” to stage conversation history.</p>'}
                </div>
              </div>
            `}
          </div>

          <!-- Step 3: Author's Note Card -->
          <div class="ps-card" style="margin-bottom:12px;border-left:3px solid var(--ps-accent)">
            <div class="ps-between" style="margin-bottom:6px">
              <div style="display:flex;align-items:center;gap:6px">
                <span class="ps-step-badge">3</span>
                <strong>\uD83D\uDCDD Author's Note</strong>
              </div>
              <button type="button" class="ps-btn-sm ${an.enabled ? "ps-toggle-on" : ""}" data-action="toggle-authors-note">${an.enabled ? "● Active" : "○ Off"}</button>
            </div>
            <p class="ps-muted" style="font-size:0.78rem;margin-bottom:6px">Whisper instructions directly into the conversation context at a specific depth.</p>

            <div class="ps-chips" style="margin-bottom:8px">
              <span class="ps-muted" style="font-size:0.75rem">Presets:</span>
              ${AUTHORS_NOTE_PRESETS.map((p, pIdx) => `<button type="button" class="ps-btn-sm" data-action="set-authors-note-preset" data-preset-idx="${pIdx}">${esc(p.label)}</button>`).join("")}
            </div>

            <textarea data-authors-note="content" style="min-height:60px;font-size:0.86rem" placeholder="[Style: vivid descriptions, slow pacing] (supports {{macros}})">${esc(an.content)}</textarea>

            <div class="ps-grid" style="margin-top:8px">
              <label>Depth from latest message (default 4)
                <input type="number" min="0" max="40" data-authors-note="depth" value="${esc(an.depth ?? 4)}">
              </label>
              <label>Message Role
                <select data-authors-note="role">
                  <option value="system" ${an.role === "system" ? "selected" : ""}>System</option>
                  <option value="user" ${an.role === "user" ? "selected" : ""}>User</option>
                  <option value="assistant" ${an.role === "assistant" ? "selected" : ""}>Assistant</option>
                </select>
              </label>
            </div>
          </div>

          <!-- Main Generation Action Bar -->
          <div class="ps-between" style="margin-top:14px;gap:8px">
            <button type="button" class="ps-btn-sm" data-action="preview" ${state.busy ? "disabled" : ""}>\uD83D\uDD2C Inspect Prompt</button>
            <div class="ps-actions">
              <button type="button" class="ps-primary" style="min-height:40px;padding:8px 18px" data-action="run" ${state.busy ? "disabled" : ""}>▶ Generate Reply</button>
              <button type="button" class="ps-danger-btn ps-btn-sm" data-action="stop" ${!state.busy ? "disabled" : ""}>■ Stop</button>
            </div>
          </div>

          <!-- Collapsible: Advanced Test Options -->
          <details class="ps-collapsible" data-details-id="advanced-test-options">
            <summary>
              <span>⚙️ Advanced Test Options</span>
              <span class="ps-muted">Generation type, custom prompt override</span>
            </summary>
            <div class="ps-grid" style="margin-top:10px">
              <label>Generation Trigger
                <select data-state="generationType">
                  ${["normal", "continue", "regenerate", "swipe", "impersonate"].map((x) => `<option ${state.generationType === x ? "selected" : ""}>${x}</option>`).join("")}
                </select>
              </label>
              <label>Test Prompt Source
                <select data-state="testPromptSource" data-action="change-test-prompt-source">
                  <option value="preset" ${!isCustomPromptMode ? "selected" : ""}>Preset Blocks (Tab 01)</option>
                  <option value="custom" ${isCustomPromptMode ? "selected" : ""}>Custom Text Override</option>
                </select>
              </label>
            </div>

            ${isCustomPromptMode ? `
              <div style="margin-top:10px">
                <div class="ps-between" style="margin-bottom:4px">
                  <span class="ps-muted">Custom System Prompt (bypasses Tab 01 blocks):</span>
                  <label style="display:inline-flex;align-items:center;gap:6px;font-size:0.78rem">
                    <input type="checkbox" style="width:auto;min-height:16px" data-custom-check="history" ${state.testCustomPromptIncludeHistory ? "checked" : ""}>
                    <span>Include Chat History</span>
                  </label>
                </div>
                <textarea data-state="testCustomPrompt" class="ps-content" style="min-height:100px" placeholder="Write custom prompt instructions to test…">${esc(state.testCustomPrompt)}</textarea>
              </div>
            ` : ""}

            <div class="ps-actions" style="margin-top:10px">
              <button type="button" class="ps-btn-sm" data-action="profile">Sync States from Active Chat</button>
              <button type="button" class="ps-btn-sm" data-action="dry" ${state.busy || !state.draft.id ? "disabled" : ""}>Database Dry Run</button>
            </div>
          </details>
        </div>
      </div>

      <!-- Right Column: Main-Chat-Faithful Reply Bubble -->
      <div class="ps-test-col-output">
        ${state.reasoning ? `
          <details class="ps-panel" style="margin-top:0" open>
            <summary class="ps-between">
              <span><strong>\uD83D\uDCAD Extended Reasoning / CoT</strong></span>
              <button type="button" class="ps-btn-sm" data-action="copy-test-reasoning">\uD83D\uDCCB Copy</button>
            </summary>
            <div class="ps-result ps-reasoning-box" style="margin-top:8px;max-height:180px">${esc(state.reasoning)}</div>
          </details>
        ` : ""}

        <div class="ps-panel" style="${state.reasoning ? "" : "margin-top:0"}">
          <div class="ps-between">
            <div class="ps-row">
              <h3>Reply Preview ${state.busy ? "· Generating…" : ""}</h3>
              ${state.lastUsage ? `<span class="ps-pill ps-pill-ok">P: ${state.lastUsage.prompt_tokens || 0}t · C: ${state.lastUsage.completion_tokens || 0}t</span>` : ""}
            </div>
            <div class="ps-chips">
              <button type="button" class="ps-btn-sm ${isChatView ? "ps-primary" : ""}" data-action="set-reply-view-mode" data-mode="chat">\uD83D\uDC41️ Chat View</button>
              <button type="button" class="ps-btn-sm ${!isChatView ? "ps-primary" : ""}" data-action="set-reply-view-mode" data-mode="raw">&lt;/&gt; Raw Text</button>
              <button type="button" class="ps-btn-sm" data-action="copy-test-reply" ${!state.result ? "disabled" : ""}>\uD83D\uDCCB Copy</button>
            </div>
          </div>

          <!-- The Live Chat Bubble Preview Container -->
          <div class="ps-chat-bubble" id="ps-chat-reply-bubble" style="margin-top:10px" aria-live="polite">
            <!-- Populated by renderChatPreviewInto() in frontend.ts -->
          </div>

          ${state.result && !state.busy ? `
            <div class="ps-between" style="margin-top:10px;padding-top:8px;border-top:1px solid var(--ps-border)">
              <span class="ps-muted" style="font-size:0.82rem">Like this response? Add it to the thread to test follow-ups:</span>
              <button type="button" class="ps-primary ps-btn-sm" data-action="continue-test-dialogue">\uD83D\uDCAC Reply to This Turn →</button>
            </div>
          ` : ""}
        </div>
      </div>
    </div>

    <!-- Tucked-Away Prompt X-Ray and A/B Comparison Drawers -->
    ${renderXRayBreakdown(state)}

    <details class="ps-panel ps-collapsible" data-details-id="ab-run-comparator">
      <summary>
        <span>⚖️ A/B Session Run Comparator (${state.runs.length} runs recorded)</span>
        <span class="ps-muted">Compare outputs side-by-side</span>
      </summary>
      ${state.runs.length >= 2 ? `
        <div class="ps-row" style="margin:8px 0">
          <label style="flex:initial">Run A
            <select data-state="compareA">
              ${state.runs.map((r, idx) => `<option value="${idx}" ${Number(state.compareA) === idx ? "selected" : ""}>#${idx + 1} (${esc(r.time)})</option>`).join("")}
            </select>
          </label>
          <label style="flex:initial">Run B
            <select data-state="compareB">
              ${state.runs.map((r, idx) => `<option value="${idx}" ${Number(state.compareB) === idx ? "selected" : ""}>#${idx + 1} (${esc(r.time)})</option>`).join("")}
            </select>
          </label>
        </div>
      ` : ""}

      ${state.runs.length >= 2 && runA && runB ? `
        <div class="ps-grid" style="margin-top:10px">
          <div class="ps-card">
            <div class="ps-between">
              <strong>Run #${Number(state.compareA) + 1} · ${esc(runA.connection)}</strong>
              <span class="ps-pill">${esc(runA.time)}</span>
            </div>
            <pre class="ps-result" style="margin-top:8px">${esc(runA.content)}</pre>
          </div>
          <div class="ps-card">
            <div class="ps-between">
              <strong>Run #${Number(state.compareB) + 1} · ${esc(runB.connection)}</strong>
              <span class="ps-pill">${esc(runB.time)}</span>
            </div>
            <pre class="ps-result" style="margin-top:8px">${esc(runB.content)}</pre>
          </div>
        </div>
      ` : `
        <div class="ps-list" style="margin-top:8px">
          ${state.runs.map((r, i) => `
            <details class="ps-card">
              <summary>Run #${i + 1} · ${esc(r.time)} · ${esc(r.connection)}</summary>
              <pre class="ps-result" style="margin-top:8px">${esc(r.content)}</pre>
            </details>
          `).join("") || '<p class="ps-muted">Generate 2 or more test replies to compare them side-by-side.</p>'}
        </div>
      `}
    </details>
  `;
}
function renderStudioSettingsTab(state) {
  const perms = state.permissions || {};
  return `
    <div class="ps-panel">
      <h3>Translation & Language Preferences</h3>
      <p class="ps-muted">Configure the target language used for single-block and batch translations.</p>
      <div class="ps-grid" style="margin-top:10px">
        <label>Target Language
          <input data-state="translationLanguage" value="${esc(state.translationLanguage)}" placeholder="e.g. English, Japanese, Spanish…">
        </label>
        <label>Translation Connection
          <select data-state="translationConnection">
            <option value="">Active default connection</option>
            ${selectOptions(state.connections, state.translationConnection, (x) => `${x.name} · ${x.model}`)}
          </select>
        </label>
      </div>
      <div class="ps-actions" style="margin-top:12px">
        <button type="button" class="ps-primary" data-action="save-preferences">Save Preferences</button>
      </div>
    </div>

    ${state.draft ? bulkControls(state, "draft") : ""}

    <div class="ps-panel">
      <h3>Extension Permissions Status</h3>
      <p class="ps-muted">These permissions enable full preset editing, dry runs, and overlay windows.</p>
      <div class="ps-chips" style="margin-top:8px">
        ${[["presets", "Presets CRUD"], ["chats", "Chats Context"], ["generation", "LLM Generation & Assembly"], ["app_manipulation", "Full-Window Overlay"], ["regex_scripts", "Display Regex Support"]].map(([key, label]) => `<span class="ps-pill ${perms[key] ? "ps-pill-ok" : "ps-pill-warn"}">${perms[key] ? "✓" : "⚠"} ${label}</span>`).join("")}
      </div>
    </div>
  `;
}

// src/studio-bridge.ts
function readHostPresetEditorDraft(ctx) {
  try {
    const fullState = ctx.ui?.presetEditor?.getState?.();
    if (!fullState?.open || !fullState?.preset || !fullState?.presetId)
      return null;
    const scoped = ctx.ui?.presetEditor?.extension?.getState?.();
    const blocks = scoped?.presetId === fullState.presetId && Array.isArray(scoped.blocks) ? cloneBlocksForHost(scoped.blocks) : cloneBlocksForHost(fullState.preset.blocks || []);
    const promptVariables = scoped?.presetId === fullState.presetId && scoped.promptVariableValues ? structuredClone(scoped.promptVariableValues) : structuredClone(fullState.preset.metadata?.promptVariables || {});
    return ensureUniqueBlockIds({
      id: fullState.preset.id,
      name: fullState.preset.name,
      provider: fullState.preset.provider || "loom",
      engine: fullState.preset.engine || "classic",
      ...typeof fullState.preset.cache_revision === "number" ? { cache_revision: fullState.preset.cache_revision } : {},
      parameters: structuredClone(fullState.preset.parameters || {}),
      prompts: structuredClone(fullState.preset.prompts || {}),
      metadata: {
        ...structuredClone(fullState.preset.metadata || {}),
        promptVariables
      },
      prompt_order: blocks
    });
  } catch (_) {
    return null;
  }
}
async function syncSaveWithNativePresetEditor(ctx, request, draftToSave, isCopy) {
  const pe = ctx.ui?.presetEditor;
  if (!isCopy && draftToSave.id && pe?.getState && pe?.updatePreset) {
    let peState = pe.getState();
    if (!peState?.open) {
      await request("open-native-presets-tab").catch(() => {});
      for (let attempt = 0;attempt < 12; attempt++) {
        await new Promise((r) => setTimeout(r, 35));
        peState = pe.getState();
        if (peState?.open && peState?.preset)
          break;
      }
    }
    if (peState?.open && peState?.preset && peState.preset.id === draftToSave.id) {
      const cleanBlocks = cloneBlocksForHost(draftToSave.prompt_order || []);
      let applied = false;
      pe.updatePreset((latest) => {
        applied = true;
        return {
          ...latest,
          name: draftToSave.name || latest.name,
          blocks: cleanBlocks,
          parameters: structuredClone(draftToSave.parameters || latest.parameters || {}),
          prompts: structuredClone(draftToSave.prompts || latest.prompts || {}),
          metadata: {
            ...structuredClone(latest.metadata || {}),
            ...structuredClone(draftToSave.metadata || {})
          }
        };
      });
      if (applied) {
        if (typeof pe.flush === "function")
          await pe.flush();
        const freshSaved = await request("get", { id: draftToSave.id });
        await request("toast", {
          kind: "success",
          title: "Preset Studio",
          message: `Applied "${draftToSave.name}" live to Lumiverse`
        });
        return freshSaved || { ...draftToSave, prompt_order: cleanBlocks };
      }
    }
  }
  return await request("save", {
    preset: { ...draftToSave, prompt_order: cloneBlocksForHost(draftToSave.prompt_order || []) },
    copy: isCopy
  });
}
function mountPresetEditorLauncher(ctx, state, setFull, hasFullMount, tab, scheduleTokenCount, render) {
  let toolbarHandle = null;
  let toolbarRoot = null;
  let unsubPresetEditor = null;
  try {
    if (typeof ctx.ui?.registerPresetEditorToolbarItem === "function") {
      toolbarHandle = ctx.ui.registerPresetEditorToolbarItem({
        id: "preset-studio-launcher",
        ariaLabel: "Open in Preset Studio"
      });
      toolbarRoot = toolbarHandle?.root ?? null;
    } else if (typeof ctx.ui?.mount === "function") {
      toolbarRoot = ctx.ui.mount("preset_editor_toolbar");
    }
    if (toolbarRoot) {
      toolbarRoot.setAttribute("data-ps-launcher-root", "true");
      toolbarRoot.style.cssText = "display:flex;align-items:center;width:100%;padding:6px 14px;border-bottom:1px solid var(--lumiverse-border, rgba(255,255,255,0.08))";
      const launcher = document.createElement("button");
      launcher.type = "button";
      launcher.setAttribute("data-ps-launcher", "true");
      launcher.style.cssText = "display:flex;align-items:center;justify-content:center;width:100%;gap:7px;min-height:36px;padding:0 12px;border:1px solid var(--lumiverse-border);border-radius:8px;background:var(--lumiverse-fill-subtle, rgba(255,255,255,0.04));color:var(--lumiverse-text);font:inherit;font-size:12px;font-weight:700;cursor:pointer";
      launcher.innerHTML = "<span>✳ Open in Preset Studio</span>";
      launcher.addEventListener("click", () => {
        const hostDraft = readHostPresetEditorDraft(ctx);
        if (hostDraft && (!state.dirty || state.draft?.id !== hostDraft.id)) {
          state.draft = hostDraft;
          state.savedFingerprint = computeDraftFingerprint(hostDraft);
          state.selected = 0;
          state.dirty = false;
          state.historyPast = [structuredClone(hostDraft)];
          state.historyFuture = [];
          scheduleTokenCount();
        }
        if (hasFullMount)
          setFull(true);
        else {
          tab.activate?.();
          render();
        }
      });
      toolbarRoot.replaceChildren(launcher);
    }
    if (ctx.ui?.presetEditor?.onChange) {
      unsubPresetEditor = ctx.ui.presetEditor.onChange((peState) => {
        if (!peState?.preset || state.dirty || state.busy)
          return;
        if (!state.draft || state.draft.id === peState.preset.id) {
          const hostDraft = readHostPresetEditorDraft(ctx);
          if (hostDraft) {
            state.draft = hostDraft;
            state.savedFingerprint = computeDraftFingerprint(hostDraft);
            render();
          }
        }
      });
    }
  } catch (_) {}
  return () => {
    unsubPresetEditor?.();
    if (toolbarHandle?.destroy) {
      try {
        toolbarHandle.destroy();
      } catch (_) {}
      toolbarHandle = null;
      toolbarRoot = null;
    } else if (toolbarRoot) {
      toolbarRoot.replaceChildren();
      try {
        toolbarRoot.remove();
      } catch (_) {}
      toolbarRoot = null;
    }
  };
}
function bindDragAndDropListeners(root, state, moveBlock, clearLongPress) {
  let dragFromIndex = null;
  let touchDragIndex = null;
  function clearDragIndicators() {
    root.querySelectorAll(".ps-dragging, .ps-drag-over-top, .ps-drag-over-bottom").forEach((el) => {
      el.classList.remove("ps-dragging", "ps-drag-over-top", "ps-drag-over-bottom");
    });
  }
  root.addEventListener("dragstart", (e) => {
    const target = e.target;
    const row = target.closest("[data-context-index]");
    if (!row || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      return;
    dragFromIndex = Number(row.dataset.contextIndex);
    row.classList.add("ps-dragging");
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(dragFromIndex));
    }
  });
  root.addEventListener("dragover", (e) => {
    if (dragFromIndex === null)
      return;
    const row = e.target.closest("[data-context-index]");
    if (!row)
      return;
    e.preventDefault();
    const targetIndex = Number(row.dataset.contextIndex);
    if (targetIndex === dragFromIndex)
      return;
    const rect = row.getBoundingClientRect();
    const isAfter = e.clientY > rect.top + rect.height / 2;
    row.classList.toggle("ps-drag-over-top", !isAfter);
    row.classList.toggle("ps-drag-over-bottom", isAfter);
  });
  root.addEventListener("dragleave", (e) => {
    const row = e.target.closest("[data-context-index]");
    if (row)
      row.classList.remove("ps-drag-over-top", "ps-drag-over-bottom");
  });
  root.addEventListener("drop", (e) => {
    if (dragFromIndex === null)
      return;
    e.preventDefault();
    const row = e.target.closest("[data-context-index]");
    const from = dragFromIndex;
    dragFromIndex = null;
    clearDragIndicators();
    if (!row)
      return;
    let to = Number(row.dataset.contextIndex);
    if (from === to)
      return;
    const rect = row.getBoundingClientRect();
    const isAfter = e.clientY > rect.top + rect.height / 2;
    if (isAfter && from > to)
      to = Math.min(state.draft.prompt_order.length - 1, to + 1);
    else if (!isAfter && from < to)
      to = Math.max(0, to - 1);
    moveBlock(from, to);
  });
  root.addEventListener("dragend", () => {
    dragFromIndex = null;
    clearDragIndicators();
  });
  root.addEventListener("pointerdown", (e) => {
    const handle = e.target.closest("[data-drag-handle]");
    if (!handle || e.pointerType === "mouse")
      return;
    clearLongPress();
    touchDragIndex = Number(handle.dataset.dragHandle);
    handle.closest("[data-context-index]")?.classList.add("ps-dragging");
    handle.setPointerCapture?.(e.pointerId);
  });
  root.addEventListener("pointermove", (e) => {
    if (touchDragIndex === null)
      return;
    e.preventDefault();
    clearDragIndicators();
    root.querySelector(`[data-context-index="${touchDragIndex}"]`)?.classList.add("ps-dragging");
    const elUnder = document.elementFromPoint(e.clientX, e.clientY);
    const overRow = elUnder?.closest?.("[data-context-index]");
    if (overRow && Number(overRow.dataset.contextIndex) !== touchDragIndex) {
      const rect = overRow.getBoundingClientRect();
      const isAfter = e.clientY > rect.top + rect.height / 2;
      overRow.classList.toggle("ps-drag-over-top", !isAfter);
      overRow.classList.toggle("ps-drag-over-bottom", isAfter);
    }
  });
  root.addEventListener("pointerup", (e) => {
    if (touchDragIndex === null)
      return;
    const from = touchDragIndex;
    touchDragIndex = null;
    const elUnder = document.elementFromPoint(e.clientX, e.clientY);
    const overRow = elUnder?.closest?.("[data-context-index]");
    clearDragIndicators();
    if (!overRow)
      return;
    const to = Number(overRow.dataset.contextIndex);
    if (from !== to)
      moveBlock(from, to);
  });
  root.addEventListener("pointercancel", () => {
    touchDragIndex = null;
    clearDragIndicators();
  });
}

// src/frontend.ts
function setup(ctx) {
  const tab = ctx.ui.registerDrawerTab({
    id: "studio",
    title: "Preset Studio",
    shortName: "Studio",
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 8h7M7 12h4M7 16h5"/><path d="m16 10 .7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></svg>',
    description: "Create, edit, remix, and test Loom presets",
    keywords: ["loom", "prompt", "test", "preset", "studio", "variables", "xray"]
  });
  const style = ctx.dom.addStyle(STUDIO_BASE_CSS);
  const polish = ctx.dom.addStyle(STUDIO_POLISH_CSS);
  const root = document.createElement("div");
  root.className = "ps-root";
  tab.root.appendChild(root);
  let mount = null;
  let full = false;
  let previousFocus = null;
  try {
    mount = ctx.ui.mountApp({ className: "ps-mount", position: "app-overlay" });
    mount.setVisible(false);
  } catch (_) {}
  const state = {
    presets: [],
    chats: [],
    connections: [],
    permissions: { presets: true, chats: true, generation: true, app_manipulation: true, regex_scripts: false },
    draft: null,
    recovery: null,
    selected: 0,
    view: "blocks",
    editorMode: "studio",
    blockFilter: "all",
    blockSearch: "",
    collapsedCategories: [],
    savedFingerprint: "",
    mobileDetailOpen: false,
    showMacroPane: false,
    macroPreview: null,
    macroBusy: false,
    tokenCounts: {},
    totalDraftTokens: 0,
    tokenizerName: "",
    historyPast: [],
    historyFuture: [],
    chatId: "",
    connectionId: "",
    generationType: "normal",
    custom: "",
    result: "",
    displayResult: "",
    reasoning: "",
    lastUsage: null,
    testPromptSource: "preset",
    testCustomPrompt: "",
    testCustomPromptIncludeHistory: true,
    testTurnMode: "single",
    testTurns: [],
    authorsNote: {
      enabled: false,
      content: "",
      depth: 4,
      role: "system"
    },
    testReplyViewMode: "chat",
    runs: [],
    compareA: 0,
    compareB: 1,
    assembled: null,
    breakdownFilter: "all",
    breakdownSearch: "",
    xrayExpanded: false,
    busy: false,
    notice: "",
    activeRun: null,
    dirty: false,
    importPreset: "",
    importBlocks: [],
    importValues: {},
    selectedImports: [],
    expandedImports: [],
    templates: [],
    quickMacroSnippet: "{{char}}",
    translationLanguage: "English",
    translationConnection: "",
    translation: null,
    sourceTranslation: null,
    translating: false,
    selectedDraft: [],
    batchTranslation: null
  };
  const pending = new Map;
  const tokenCache = new Map;
  const mountedHandles = new Set;
  const modalRef = { current: null };
  let timer = null;
  let tokenTimer = null;
  let longPressTimer = null;
  let refreshPromise = null;
  let hasLoadedOnce = false;
  let destroyed = false;
  let saveChain = Promise.resolve();
  function destroyMounted() {
    for (const h of mountedHandles) {
      try {
        h.destroy?.();
      } catch (_) {}
    }
    mountedHandles.clear();
  }
  function trackMount(fn) {
    try {
      const h = fn();
      if (h && typeof h.destroy === "function")
        mountedHandles.add(h);
      return h;
    } catch (_) {
      return null;
    }
  }
  const unsubKb = ctx.ui?.events?.onKeyboardChange?.((kb) => {
    root.style.setProperty("--ps-kb-inset", kb?.visible ? `${kb.insetBottom || 0}px` : "0px");
  });
  function request(action, payload = {}, handlers = {}) {
    const requestId = uid();
    return new Promise((resolve, reject) => {
      pending.set(requestId, { resolve, reject, ...handlers });
      ctx.sendToBackend({ action, requestId, ...payload });
    });
  }
  function setFull(value) {
    if (value && !mount) {
      state.notice = "Full window requires the app_manipulation permission. Continuing in the drawer.";
      render();
      return;
    }
    full = value;
    if (full) {
      previousFocus = document.activeElement;
      mount.root.appendChild(root);
      mount.setVisible(true);
      root.classList.add("ps-full");
      if (!state.presets.length)
        refresh().catch(() => {});
      if (!ctx.ui?.presetEditor?.getState?.()?.open) {
        request("open-native-presets-tab").catch(() => {});
      }
    } else {
      tab.root.appendChild(root);
      mount?.setVisible(false);
      root.classList.remove("ps-full");
      previousFocus?.focus?.();
    }
    render();
    if (full)
      root.querySelector('[data-action="close-window"]')?.focus();
  }
  const unsub = ctx.onBackendMessage((msg) => {
    if (!msg)
      return;
    if (msg.type === "backend-ready" || msg.type === "permissions") {
      if (msg.permissions)
        state.permissions = { ...state.permissions, ...msg.permissions };
      if (full || hasLoadedOnce)
        refresh().catch(() => {});
      else
        render();
      return;
    }
    if (msg.type === "command") {
      if (msg.chatId)
        state.chatId = msg.chatId;
      if (msg.commandId === "open-studio-full")
        setFull(true);
      else if (msg.commandId === "test-studio-chat") {
        if (!state.draft)
          state.draft = freshDraft();
        state.view = "test";
        if (mount)
          setFull(true);
        else {
          tab.activate?.();
          refresh().catch(() => {});
          render();
        }
      }
      return;
    }
    const p = pending.get(msg.requestId);
    if (!p)
      return;
    if (msg.type === "token") {
      p.onToken?.(msg.token);
      return;
    }
    if (msg.type === "reasoning") {
      p.onReasoning?.(msg.token);
      return;
    }
    if (msg.type === "progress") {
      p.onProgress?.(msg);
      return;
    }
    if (msg.type === "assembled") {
      p.onAssembled?.(msg.data);
      return;
    }
    if (msg.type === "result" || msg.type === "error") {
      pending.delete(msg.requestId);
      msg.type === "error" ? p.reject(new Error(msg.error)) : p.resolve(msg.data);
    }
  });
  function pushHistory(snapshot) {
    if (!snapshot)
      return;
    const serialized = JSON.stringify(snapshot);
    if (state.historyPast.length && JSON.stringify(state.historyPast[state.historyPast.length - 1]) === serialized)
      return;
    state.historyPast.push(structuredClone(snapshot));
    if (state.historyPast.length > 20)
      state.historyPast.shift();
    state.historyFuture = [];
  }
  function scheduleTokenCount() {
    clearTimeout(tokenTimer);
    tokenTimer = setTimeout(async () => {
      if (destroyed || !state.draft?.prompt_order?.length)
        return;
      const blocks = state.draft.prompt_order;
      const connKey = state.connectionId || "default";
      const missingIndices = [];
      const missingTexts = [];
      blocks.forEach((b, idx) => {
        const text = b.content || "";
        if (!text.trim())
          return;
        const cacheKey = `${connKey}:${text}`;
        if (!tokenCache.has(cacheKey)) {
          missingIndices.push(idx);
          missingTexts.push(text);
        }
      });
      try {
        if (missingTexts.length > 0) {
          const res = await request("count-tokens", { texts: missingTexts, connectionId: state.connectionId });
          if (destroyed || !res?.counts)
            return;
          if (tokenCache.size > 512)
            tokenCache.clear();
          missingIndices.forEach((blockIdx, i) => {
            const text = blocks[blockIdx]?.content || "";
            tokenCache.set(`${connKey}:${text}`, {
              count: Number(res.counts[i]) || 0,
              tokenizerName: res.tokenizerName || ""
            });
          });
          if (res.tokenizerName)
            state.tokenizerName = res.tokenizerName;
        }
        const map = {};
        let sum = 0;
        for (const b of blocks) {
          const text = b.content || "";
          const c = text.trim() ? tokenCache.get(`${connKey}:${text}`)?.count || 0 : 0;
          map[b.id] = c;
          if (b.enabled && b.marker !== "category")
            sum += c;
        }
        state.tokenCounts = map;
        state.totalDraftTokens = sum;
        const totalBadge = root.querySelector("[data-total-tokens]");
        if (totalBadge)
          totalBadge.textContent = `~${sum.toLocaleString()} block tokens`;
        blocks.forEach((b) => {
          const pill = root.querySelector(`[data-token-id="${CSS.escape(b.id)}"]`);
          if (pill)
            pill.textContent = b.content?.trim() && map[b.id] ? `· ${map[b.id]}t` : "";
        });
      } catch (_) {}
    }, 420);
  }
  function persist(skipHistory = false, deferHistory = false) {
    if (!skipHistory && !deferHistory && state.draft) {
      pushHistory(state.draft);
      state.dirty = state.savedFingerprint ? computeDraftFingerprint(state.draft) !== state.savedFingerprint : true;
    } else if (deferHistory) {
      state.dirty = true;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (destroyed || !state.draft)
        return;
      if (!skipHistory && deferHistory) {
        pushHistory(state.draft);
      }
      state.dirty = state.savedFingerprint ? computeDraftFingerprint(state.draft) !== state.savedFingerprint : true;
      const draft = structuredClone(state.draft);
      state.recovery = draft;
      saveChain = saveChain.catch(() => {}).then(() => request("draft", { draft })).catch((e) => {
        state.notice = "Could not recover draft: " + e.message;
        render();
      });
    }, 450);
    scheduleTokenCount();
  }
  function undo() {
    if (state.historyPast.length < 2)
      return;
    const current = state.historyPast.pop();
    state.historyFuture.push(current);
    state.draft = structuredClone(state.historyPast[state.historyPast.length - 1]);
    state.selected = Math.min(state.selected, Math.max(0, state.draft.prompt_order.length - 1));
    persist(true);
    render();
  }
  function redo() {
    if (!state.historyFuture.length)
      return;
    const next = state.historyFuture.pop();
    state.historyPast.push(structuredClone(next));
    state.draft = structuredClone(next);
    state.selected = Math.min(state.selected, Math.max(0, state.draft.prompt_order.length - 1));
    persist(true);
    render();
  }
  const onKey = (e) => {
    if (e.key === "Escape" && full) {
      if (root.querySelector("dialog[open]"))
        return;
      e.stopPropagation();
      setFull(false);
      return;
    }
    if (!root.contains(document.activeElement))
      return;
    const tag = document.activeElement?.tagName;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && tag !== "INPUT" && tag !== "TEXTAREA") {
      e.preventDefault();
      e.shiftKey ? redo() : undo();
    }
  };
  document.addEventListener("keydown", onKey);
  function moveBlock(fromIndex, toIndex) {
    const d = state.draft;
    if (!d?.prompt_order?.length)
      return;
    const len = d.prompt_order.length;
    if (fromIndex < 0 || fromIndex >= len || toIndex < 0 || toIndex >= len || fromIndex === toIndex)
      return;
    const selectedId = d.prompt_order[state.selected]?.id;
    const [moved] = d.prompt_order.splice(fromIndex, 1);
    d.prompt_order.splice(toIndex, 0, moved);
    const nextSelected = selectedId ? d.prompt_order.findIndex((b) => b.id === selectedId) : toIndex;
    state.selected = nextSelected >= 0 ? nextSelected : toIndex;
    persist();
    render();
  }
  function insertEntries(entries) {
    const d = state.draft;
    const copies = entries.map((entry) => {
      const block = structuredClone(entry.block);
      const id = uid();
      delete block.stashId;
      block.id = id;
      if (entry.values && Object.keys(entry.values).length) {
        d.metadata = d.metadata || {};
        d.metadata.promptVariables = d.metadata.promptVariables || {};
        d.metadata.promptVariables[id] = structuredClone(entry.values);
      }
      return block;
    });
    d.prompt_order.splice(state.selected + 1, 0, ...copies);
    state.selected += copies.length;
    persist();
  }
  function insertTextAtPromptCursor(snippet) {
    const b = state.draft?.prompt_order?.[state.selected];
    if (!b || b.isLocked || !snippet)
      return;
    const ta = root.querySelector('textarea[data-block="content"]');
    if (ta) {
      const start = typeof ta.selectionStart === "number" ? ta.selectionStart : (b.content || "").length;
      const end = typeof ta.selectionEnd === "number" ? ta.selectionEnd : start;
      const scrollTop = ta.scrollTop;
      const cur = b.content || "";
      b.content = cur.slice(0, start) + snippet + cur.slice(end);
      ta.value = b.content;
      const nextPos = start + snippet.length;
      ta.focus({ preventScroll: true });
      ta.setSelectionRange(nextPos, nextPos);
      ta.scrollTop = scrollTop;
      persist();
      if (state.showMacroPane)
        runMacroPreview(b);
    } else {
      b.content = (b.content || "") + snippet;
      persist();
      render();
    }
  }
  async function importJsonFile(mode) {
    if (!ctx.uploads?.pickFile)
      throw new Error("File picker is not available in this host.");
    const files = await ctx.uploads.pickFile({
      accept: [".json", "application/json"],
      multiple: false,
      maxSizeBytes: 5 * 1024 * 1024
    });
    if (!files?.length)
      return;
    const text = new TextDecoder().decode(files[0].bytes);
    const parsed = JSON.parse(text);
    if (mode === "preset") {
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.prompt_order)) {
        throw new Error("JSON file is not a valid preset (missing prompt_order array).");
      }
      if (state.dirty && !await askConfirm(root, modalRef, "Replace Draft?", "Replace your current unsaved draft with the imported preset?", "warning", "Replace")) {
        return;
      }
      delete parsed.id;
      state.draft = ensureUniqueBlockIds({
        name: String(parsed.name || files[0].name.replace(/\.json$/i, "") || "Imported Preset"),
        provider: parsed.provider || "loom",
        engine: parsed.engine || "classic",
        parameters: parsed.parameters || {},
        prompts: parsed.prompts || {},
        metadata: parsed.metadata || {},
        prompt_order: parsed.prompt_order
      });
      state.savedFingerprint = "";
      state.selected = 0;
      persist();
      await request("toast", { kind: "success", message: `Imported preset "${state.draft.name}"` });
    } else {
      const entries = Array.isArray(parsed?.entries) ? parsed.entries : Array.isArray(parsed) ? parsed.map((b) => ({ block: b, source: "Imported" })) : null;
      if (!entries?.length)
        throw new Error("JSON file does not contain template entries.");
      const name = String(parsed.name || files[0].name.replace(/\.json$/i, "") || "Imported Template");
      state.templates = await request("template-save", { template: { id: uid(), name, entries } });
    }
  }
  async function deleteBlockAtIndex(index) {
    const d = state.draft;
    const b = d?.prompt_order?.[index];
    if (!b)
      return;
    const msg = b.isLocked ? `“${b.name || "Untitled"}” is currently locked (\uD83D\uDD12). Delete it from your draft anyway?` : `Delete “${b.name || "Untitled"}” from your draft?`;
    if (!await askConfirm(root, modalRef, "Delete Block?", msg, "danger", "Delete Block"))
      return;
    const removedId = b.id;
    d.prompt_order.splice(index, 1);
    state.selectedDraft = state.selectedDraft.filter((id) => id !== removedId);
    if (d.metadata?.promptVariables)
      delete d.metadata.promptVariables[removedId];
    state.selected = Math.max(0, Math.min(state.selected >= index ? state.selected - (state.selected > index ? 1 : 0) : state.selected, d.prompt_order.length - 1));
    state.notice = `Deleted “${b.name || "Untitled"}”.`;
    persist();
    render();
  }
  async function openFullTextEditorForBlock(b) {
    if (!b || b.isLocked)
      return;
    const res = await request("text-editor", {
      title: `Prompt Block: ${b.name || "Untitled"}`,
      value: b.content || "",
      placeholder: "Write prompt instructions and {{macros}}…"
    });
    if (res && !res.cancelled && typeof res.text === "string") {
      b.content = res.text;
      persist();
      if (state.showMacroPane)
        await runMacroPreview(b);
      render();
    }
  }
  async function runMacroPreview(b) {
    if (!b)
      return;
    state.macroBusy = true;
    render();
    try {
      const res = await request("macro-preview", { template: b.content || "", chatId: state.chatId });
      state.macroPreview = { blockId: b.id, text: res.text || "", diagnostics: res.diagnostics || [] };
    } catch (e) {
      state.macroPreview = { blockId: b.id, text: "", diagnostics: [{ message: e.message, offset: 0, length: 0 }] };
    } finally {
      state.macroBusy = false;
      render();
    }
  }
  async function translateFields(block, scope) {
    const original = { name: block.name || "", content: block.content || "" };
    const fields = scope === "both" ? ["name", "content"] : [scope];
    const result = { original };
    await Promise.all(fields.map(async (field) => {
      if (!original[field].trim()) {
        throw new Error(field === "name" ? "This block has no title to translate." : "This block has no prompt text to translate.");
      }
      const translated = await request("translate", {
        text: original[field],
        language: state.translationLanguage,
        connectionId: state.translationConnection
      });
      result[field] = translated.content;
    }));
    return result;
  }
  function applyTranslatedFields(block, t) {
    if (t.name !== undefined && block.name !== t.original.name || t.content !== undefined && block.content !== t.original.content) {
      throw new Error("The original block changed. Translate it again.");
    }
    if (t.name !== undefined)
      block.name = t.name;
    if (t.content !== undefined)
      block.content = t.content;
  }
  function updateLiveVariablesPreview() {
    const d = state.draft;
    const b = d?.prompt_order?.[state.selected];
    const outBox = root.querySelector("#ps-var-preview-output-slot");
    if (!outBox || !b)
      return;
    const savedBlockVars = d.metadata?.promptVariables?.[b.id] || {};
    const text = resolveBlockVariablesPreview(b, savedBlockVars);
    outBox.textContent = text || "(Block content is empty)";
  }
  function mountInteractiveWidgets() {
    const d = state.draft;
    if (!d || !ctx.components)
      return;
    if (state.view === "blocks" && state.editorMode === "native") {
      const slot = root.querySelector("#ps-native-loom-slot");
      if (slot && ctx.components.mountLoomBlockEditor) {
        trackMount(() => ctx.components.mountLoomBlockEditor(slot, {
          value: {
            blocks: d.prompt_order.map(sanitizeBlockForLoom),
            promptVariableValues: structuredClone(d.metadata?.promptVariables || {})
          },
          compact: !full,
          onChange: (next) => {
            d.prompt_order = next.blocks;
            d.metadata = d.metadata || {};
            d.metadata.promptVariables = next.promptVariableValues || {};
            persist();
          }
        }));
      }
    }
    if (state.view === "settings" && ctx.components.mountRangeSlider) {
      const specs = [
        { key: "temperature", label: "Temperature (Randomness)", min: 0, max: 2, step: 0.05, def: 0.8, decimals: 2 },
        { key: "top_p", label: "Top-P (Nucleus Sampling)", min: 0, max: 1, step: 0.01, def: 0.95, decimals: 2 },
        { key: "min_p", label: "Min-P", min: 0, max: 1, step: 0.01, def: 0, decimals: 2 },
        { key: "frequency_penalty", label: "Frequency Penalty", min: -2, max: 2, step: 0.05, def: 0, decimals: 2 },
        { key: "presence_penalty", label: "Presence Penalty", min: -2, max: 2, step: 0.05, def: 0, decimals: 2 },
        { key: "repetition_penalty", label: "Repetition Penalty", min: 1, max: 2, step: 0.01, def: 1, decimals: 2 }
      ];
      for (const s of specs) {
        const slot = root.querySelector(`[data-slider-slot="${s.key}"]`);
        if (!slot)
          continue;
        slot.innerHTML = "";
        trackMount(() => ctx.components.mountRangeSlider(slot, {
          label: s.label,
          min: s.min,
          max: s.max,
          step: s.step,
          value: Number(d.parameters?.[s.key] ?? s.def),
          format: { decimals: s.decimals },
          onCommit: (val) => {
            d.parameters = d.parameters || {};
            d.parameters[s.key] = val;
            persist();
          }
        }));
      }
    }
    if (state.view === "variables") {
      const b = d.prompt_order?.[state.selected];
      const controlsSlot = root.querySelector("#ps-var-preview-controls-slot");
      if (controlsSlot && b && Array.isArray(b.variables) && b.variables.length > 0) {
        controlsSlot.innerHTML = "";
        d.metadata = d.metadata || {};
        d.metadata.promptVariables = d.metadata.promptVariables || {};
        d.metadata.promptVariables[b.id] = d.metadata.promptVariables[b.id] || {};
        const savedVars = d.metadata.promptVariables[b.id];
        for (const v of b.variables) {
          if (!v?.name)
            continue;
          const currentVal = savedVars[v.name] !== undefined ? savedVars[v.name] : v.defaultValue;
          const row = document.createElement("div");
          row.style.cssText = "display:grid;gap:4px;";
          controlsSlot.appendChild(row);
          if (v.type === "switch" || v.type === "boolean") {
            trackMount(() => ctx.components.mountSwitch(row, {
              checked: currentVal === 1 || currentVal === "1" || currentVal === true || currentVal === "true",
              size: "md",
              ariaLabel: v.label || v.name,
              onChange: (checked) => {
                savedVars[v.name] = checked ? 1 : 0;
                persist();
                updateLiveVariablesPreview();
              }
            }));
            const lbl = document.createElement("span");
            lbl.textContent = ` ${v.label || v.name}`;
            lbl.style.cssText = "font-size:0.86rem;font-weight:600;margin-top:2px;";
            row.appendChild(lbl);
          } else if (v.type === "slider") {
            trackMount(() => ctx.components.mountRangeSlider(row, {
              label: v.label || v.name,
              hint: v.description || "",
              min: Number.isFinite(Number(v.min)) ? Number(v.min) : 0,
              max: Number.isFinite(Number(v.max)) ? Number(v.max) : 100,
              step: Number.isFinite(Number(v.step)) ? Number(v.step) : 1,
              value: Number.isFinite(Number(currentVal)) ? Number(currentVal) : Number(v.min || 0),
              onCommit: (val) => {
                savedVars[v.name] = val;
                persist();
                updateLiveVariablesPreview();
              }
            }));
          } else if (v.type === "select") {
            const rawOpts = Array.isArray(v.options) ? v.options : [];
            const selectOptionsList = rawOpts.map((o) => ({
              value: String(o.id ?? o.label ?? ""),
              label: String(o.label || o.id || "Option")
            }));
            const labelEl = document.createElement("span");
            labelEl.textContent = v.label || v.name;
            labelEl.style.cssText = "font-size:0.86rem;font-weight:600;";
            row.appendChild(labelEl);
            trackMount(() => ctx.components.mountSelect(row, {
              value: String(currentVal ?? selectOptionsList[0]?.value ?? ""),
              options: selectOptionsList,
              placeholder: "Choose option…",
              onChange: (val) => {
                savedVars[v.name] = val;
                persist();
                updateLiveVariablesPreview();
              }
            }));
          } else if (v.type === "multiselect") {
            const rawOpts = Array.isArray(v.options) ? v.options : [];
            const multiOptionsList = rawOpts.map((o) => ({
              value: String(o.id ?? o.label ?? ""),
              label: String(o.label || o.id || "Option")
            }));
            const labelEl = document.createElement("span");
            labelEl.textContent = v.label || v.name;
            labelEl.style.cssText = "font-size:0.86rem;font-weight:600;";
            row.appendChild(labelEl);
            const chosenList = Array.isArray(currentVal) ? currentVal.map(String) : typeof currentVal === "string" && currentVal.trim() ? currentVal.split(",").map((s) => s.trim()) : [];
            trackMount(() => ctx.components.mountMultiSelect(row, {
              value: chosenList,
              options: multiOptionsList,
              placeholder: "Select items…",
              onChange: (vals) => {
                savedVars[v.name] = vals;
                persist();
                updateLiveVariablesPreview();
              }
            }));
          } else if (v.type === "textarea") {
            const labelEl = document.createElement("span");
            labelEl.textContent = v.label || v.name;
            labelEl.style.cssText = "font-size:0.86rem;font-weight:600;";
            row.appendChild(labelEl);
            trackMount(() => ctx.components.mountTextArea(row, {
              value: String(currentVal ?? ""),
              rows: Number(v.rows || 3),
              placeholder: v.description || "Type value…",
              onChange: (val) => {
                savedVars[v.name] = val;
                persist(false, true);
                updateLiveVariablesPreview();
              }
            }));
          } else {
            const labelEl = document.createElement("span");
            labelEl.textContent = v.label || v.name;
            labelEl.style.cssText = "font-size:0.86rem;font-weight:600;";
            row.appendChild(labelEl);
            trackMount(() => ctx.components.mountTextInput(row, {
              value: String(currentVal ?? ""),
              placeholder: v.description || "Type value…",
              onChange: (val) => {
                savedVars[v.name] = val;
                persist(false, true);
                updateLiveVariablesPreview();
              }
            }));
          }
        }
      }
    }
  }
  function render() {
    if (destroyed)
      return;
    const savedRootScroll = root.scrollTop;
    const savedScrollMap = new Map;
    root.querySelectorAll("[data-scroll-id]").forEach((el) => {
      if (el.dataset.scrollId)
        savedScrollMap.set(el.dataset.scrollId, { top: el.scrollTop, left: el.scrollLeft });
    });
    const openDetailsIds = new Set;
    root.querySelectorAll("details[data-details-id]").forEach((el) => {
      if (el.open && el.dataset.detailsId)
        openDetailsIds.add(el.dataset.detailsId);
    });
    destroyMounted();
    const d = state.draft;
    root.innerHTML = `
      <div class="ps-shell">
        <header class="ps-masthead">
          <div class="ps-brand">
            <div class="ps-mark" aria-hidden="true">✳</div>
            <div>
              <div class="ps-kicker">Lumiverse Prompt IDE</div>
              <h2>Preset Studio ${d ? `· <span style="color:var(--ps-accent)">${esc(d.name)}</span>` : ""}</h2>
            </div>
          </div>
          <div class="ps-actions">
            ${d ? `
              <span class="ps-pill ps-pill-accent" data-total-tokens>~${state.totalDraftTokens.toLocaleString()} block tokens</span>
              <button type="button" class="ps-btn-sm" data-action="undo" ${state.historyPast.length < 2 ? "disabled" : ""} title="Undo (Ctrl+Z)">↶ Undo</button>
              <button type="button" class="ps-btn-sm" data-action="redo" ${!state.historyFuture.length ? "disabled" : ""} title="Redo (Ctrl+Shift+Z)">↷ Redo</button>
            ` : ""}
            ${full ? '<button type="button" class="ps-btn-sm" data-action="close-window">✕ Exit Full Window</button>' : '<button type="button" class="ps-btn-sm ps-primary" data-action="full-window">⤢ Full Window</button>'}
            <button type="button" class="ps-btn-sm" data-action="refresh">↻ Refresh</button>
          </div>
        </header>

        ${state.notice ? `<div class="ps-notice" role="status">${esc(state.notice)}</div>` : ""}

        <!-- Clean, Direct Top Action Bar -->
        <section class="ps-panel ps-between" aria-label="Preset library">
          <div class="ps-row" style="flex:1">
            <label style="max-width:320px">
              <select data-action="open">
                <option value="">Choose an existing preset…</option>
                ${selectOptions(state.presets, d?.id, (x) => x.name)}
              </select>
            </label>
            <button type="button" class="ps-btn-sm" data-action="new">＋ New</button>
            <button type="button" class="ps-btn-sm" data-action="import-preset-json">\uD83D\uDCE5 Import JSON</button>
            ${d ? '<button type="button" class="ps-btn-sm" data-action="export-preset-json">\uD83D\uDCE4 Export JSON</button>' : ""}
            ${state.recovery ? '<button type="button" class="ps-btn-sm" data-action="restore">Recover Draft</button>' : ""}
          </div>

          ${d ? `
            <div class="ps-actions">
              <span class="ps-pill ${state.dirty ? "ps-pill-warn" : "ps-pill-ok"}">${state.dirty ? "● Unsaved" : "✓ Saved"}</span>
              <button type="button" class="ps-btn-sm" data-action="save-copy" ${state.busy ? "disabled" : ""}>Save Copy</button>
              <button type="button" class="ps-primary" style="min-height:36px;padding:6px 16px" data-action="save" ${state.busy ? "disabled" : ""}>${d.id ? "Save Changes" : "Create Preset"}</button>
            </div>
          ` : ""}
        </section>

        ${d ? `
          <nav class="ps-tabs" aria-label="Studio tabs">
            ${[
      ["blocks", "01", "Prompts"],
      ["variables", "02", "Variables & Inputs"],
      ["settings", "03", "Settings & Samplers"],
      ["remix", "04", "Templates & Mixer"],
      ["test", "05", "Test Lab"],
      ["studio-settings", "06", "Translate & Tools"]
    ].map(([id, step, label]) => `<button type="button" data-action="view" data-view="${id}" aria-pressed="${state.view === id}"><span class="ps-step">${step}</span>${label}</button>`).join("")}
          </nav>

          ${state.view === "blocks" ? renderArchitectTab(ctx, state) : state.view === "variables" ? renderVariablesTab(state) : state.view === "settings" ? renderSamplersTab(state) : state.view === "remix" ? renderRemixTab(state) : state.view === "test" ? renderTestTab(state) : renderStudioSettingsTab(state)}
        ` : `
          <div class="ps-panel" style="text-align:center;padding:36px 16px">
            <h3>Welcome to Preset Studio</h3>
            <p class="ps-muted" style="margin:8px 0 16px">Open an existing preset from the dropdown above, import a JSON preset, or start fresh.</p>
            <button type="button" class="ps-primary" data-action="new">＋ Create New Preset</button>
          </div>
        `}
      </div>
    `;
    mountInteractiveWidgets();
    if (state.view === "test") {
      const bubbleEl = root.querySelector("#ps-chat-reply-bubble");
      if (bubbleEl) {
        const textToRender = state.displayResult || state.result;
        renderChatPreviewInto(bubbleEl, textToRender, state.testReplyViewMode === "raw");
      }
    }
    openDetailsIds.forEach((id) => {
      const det = root.querySelector(`details[data-details-id="${CSS.escape(id)}"]`);
      if (det)
        det.open = true;
    });
    savedScrollMap.forEach((pos, id) => {
      const el = root.querySelector(`[data-scroll-id="${CSS.escape(id)}"]`);
      if (el) {
        el.scrollTop = pos.top;
        el.scrollLeft = pos.left;
      }
    });
    root.scrollTop = savedRootScroll;
  }
  const cleanupLauncher = mountPresetEditorLauncher(ctx, state, setFull, Boolean(mount), tab, scheduleTokenCount, render);
  bindDragAndDropListeners(root, state, moveBlock, () => clearTimeout(longPressTimer));
  function refresh() {
    if (refreshPromise)
      return refreshPromise;
    hasLoadedOnce = true;
    refreshPromise = request("load").then((data) => {
      if (destroyed)
        return;
      state.presets = data.presets || [];
      state.chats = data.chats || [];
      state.connections = data.connections || [];
      state.recovery = data.draft;
      if (data.permissions)
        state.permissions = { ...state.permissions, ...data.permissions };
      if (!state.preferencesLoaded) {
        state.translationLanguage = data.preferences?.translationLanguage || "English";
        state.translationConnection = data.preferences?.translationConnection || "";
        state.preferencesLoaded = true;
      }
      state.templates = Array.isArray(data.templates) ? data.templates : [];
      if (!state.chatId)
        state.chatId = data.active?.id || "";
      render();
    }).finally(() => {
      refreshPromise = null;
    });
    return refreshPromise;
  }
  async function saveEntriesAsTemplate(entries, suggestedName = "") {
    if (!entries.length)
      throw new Error("Select at least one block first.");
    const name = await promptTemplateName(root, modalRef, suggestedName, entries.length);
    if (!name)
      return;
    state.templates = await request("template-save", {
      template: { id: uid(), name, entries: structuredClone(entries) }
    });
    state.notice = `Saved template “${name}” (${entries.length} block${entries.length === 1 ? "" : "s"}).`;
    render();
  }
  const contextMenuCallbacks = {
    openFullTextEditorForBlock,
    runMacroPreview,
    moveBlock,
    deleteBlockAtIndex,
    saveEntriesAsTemplate,
    persist,
    render
  };
  root.addEventListener("contextmenu", (e) => {
    const row = e.target.closest("[data-context-index]");
    if (!row)
      return;
    e.preventDefault();
    openBlockContextMenu(root, modalRef, state, Number(row.dataset.contextIndex), e.clientX, e.clientY, contextMenuCallbacks);
  });
  root.addEventListener("touchstart", (e) => {
    const target = e.target;
    if (target.closest("[data-drag-handle]"))
      return;
    const row = target.closest("[data-context-index]");
    if (!row)
      return;
    const t = e.touches[0];
    const x = t.clientX;
    const y = t.clientY;
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(() => {
      openBlockContextMenu(root, modalRef, state, Number(row.dataset.contextIndex), x, y, contextMenuCallbacks);
    }, 520);
  }, { passive: true });
  root.addEventListener("touchmove", () => clearTimeout(longPressTimer), { passive: true });
  root.addEventListener("touchend", () => clearTimeout(longPressTimer), { passive: true });
  root.addEventListener("input", (e) => {
    const el = e.target;
    if (el.tagName === "SELECT")
      return;
    const d = state.draft;
    if (el.dataset.block && d) {
      let val = el.value;
      if (el.dataset.block === "depth")
        val = Math.max(0, Number(val) || 0);
      if (el.dataset.block === "marker" || el.dataset.block === "categoryMode" || el.dataset.block === "group")
        val = val || null;
      d.prompt_order[state.selected][el.dataset.block] = val;
      persist(false, true);
    } else if (el.dataset.preset && d) {
      d[el.dataset.preset] = el.value;
      persist(false, true);
    } else if (el.dataset.paramNum && d) {
      d.parameters = d.parameters || {};
      if (el.value === "")
        delete d.parameters[el.dataset.paramNum];
      else
        d.parameters[el.dataset.paramNum] = Number(el.value);
      persist(false, true);
    } else if (el.dataset.authorsNote) {
      const field = el.dataset.authorsNote;
      if (field === "depth")
        state.authorsNote.depth = Math.max(0, Number(el.value) || 0);
      else if (field === "content")
        state.authorsNote.content = el.value;
    } else if (el.dataset.varIndex !== undefined && d) {
      const b = d.prompt_order[state.selected];
      const idx = Number(el.dataset.varIndex);
      const v = b?.variables?.[idx];
      if (!v)
        return;
      if (el.dataset.optIndex !== undefined) {
        const opt = v.options?.[Number(el.dataset.optIndex)];
        if (opt && el.dataset.optField)
          opt[el.dataset.optField] = el.value;
      } else if (el.dataset.varField) {
        const f = el.dataset.varField;
        if (f === "separator")
          v[f] = el.value.replace(/\\n/g, `
`);
        else if (f === "defaultValue" && v.type === "multiselect")
          v[f] = el.value.split(",").map((s) => s.trim()).filter(Boolean);
        else
          v[f] = ["min", "max", "step", "rows"].includes(f) ? Number(el.value) : el.value;
      }
      b.variables[idx] = normalizeVariableDef(v, true);
      persist(false, true);
      updateLiveVariablesPreview();
    } else if (el.dataset.varRuntime && d) {
      const b = d.prompt_order[state.selected];
      if (!b)
        return;
      d.metadata = d.metadata || {};
      d.metadata.promptVariables = d.metadata.promptVariables || {};
      d.metadata.promptVariables[b.id] = d.metadata.promptVariables[b.id] || {};
      d.metadata.promptVariables[b.id][el.dataset.varRuntime] = el.value;
      persist(false, true);
      updateLiveVariablesPreview();
    } else if (el.dataset.state === "sourceTranslationName" && state.sourceTranslation)
      state.sourceTranslation.name = el.value;
    else if (el.dataset.state === "translationName" && state.translation)
      state.translation.name = el.value;
    else if (el.dataset.state === "sourceTranslationText" && state.sourceTranslation)
      state.sourceTranslation.content = el.value;
    else if (el.dataset.state === "translationText" && state.translation)
      state.translation.content = el.value;
    else if (el.dataset.turnIdx !== undefined && el.dataset.turnField === "content") {
      const idx = Number(el.dataset.turnIdx);
      if (state.testTurns[idx]) {
        state.testTurns[idx].content = el.value;
      }
    } else if (el.dataset.state) {
      const key = el.dataset.state;
      state[key] = el.value;
      if (["blockSearch", "breakdownSearch", "compareA", "compareB"].includes(key)) {
        const pos = el.selectionStart;
        render();
        const nextEl = root.querySelector(`[data-state="${key}"]`);
        if (nextEl) {
          nextEl.focus({ preventScroll: true });
          if (typeof pos === "number" && nextEl.setSelectionRange)
            nextEl.setSelectionRange(pos, pos);
        }
      }
    }
  });
  root.addEventListener("change", async (e) => {
    const el = e.target;
    if (el.tagName === "SELECT" && el.dataset.state) {
      const key = el.dataset.state;
      state[key] = el.value;
      if (["compareA", "compareB", "connectionId", "chatId", "generationType"].includes(key)) {
        if (key === "connectionId")
          scheduleTokenCount();
        render();
      }
      return;
    }
    if (el.dataset.authorsNote === "role") {
      state.authorsNote.role = el.value;
      return;
    }
    if (el.tagName === "SELECT" && el.dataset.block && state.draft) {
      let val = el.value;
      if (el.dataset.block === "marker" || el.dataset.block === "categoryMode")
        val = val || null;
      const blk = state.draft.prompt_order[state.selected];
      blk[el.dataset.block] = val;
      if (el.dataset.block === "marker") {
        if (val === "category" && !blk.categoryMode)
          blk.categoryMode = "checkbox";
        else if (val !== "category")
          blk.categoryMode = null;
      }
      persist();
      render();
      return;
    }
    if (el.dataset.draftId !== undefined) {
      const id = el.dataset.draftId;
      state.selectedDraft = el.checked ? [...new Set([...state.selectedDraft, id])] : state.selectedDraft.filter((x) => x !== id);
      render();
      return;
    }
    if (el.dataset.importIndex !== undefined) {
      const i = Number(el.dataset.importIndex);
      state.selectedImports = el.checked ? [...new Set([...state.selectedImports, i])] : state.selectedImports.filter((n) => n !== i);
      render();
      return;
    }
    if (el.dataset.customCheck === "history") {
      state.testCustomPromptIncludeHistory = el.checked;
      render();
      return;
    }
    if (el.dataset.turnIdx !== undefined && el.dataset.turnField === "role") {
      const idx = Number(el.dataset.turnIdx);
      if (state.testTurns[idx]) {
        state.testTurns[idx].role = el.value;
        render();
      }
      return;
    }
    if (el.dataset.varField === "type") {
      const b = state.draft?.prompt_order?.[state.selected];
      const idx = Number(el.dataset.varIndex);
      if (b?.variables?.[idx]) {
        b.variables[idx] = normalizeVariableDef({ ...b.variables[idx], type: el.value });
      }
      persist();
      render();
      return;
    }
    if (el.dataset.action === "select-block-dropdown") {
      state.selected = Number(el.value) || 0;
      render();
      return;
    }
    if (el.dataset.action === "import-source") {
      try {
        state.importPreset = el.value;
        state.sourceTranslation = null;
        state.batchTranslation = null;
        state.importBlocks = [];
        state.importValues = {};
        state.selectedImports = [];
        state.expandedImports = [];
        if (el.value) {
          const preset = await request("get", { id: el.value });
          if (!preset)
            throw new Error("Source preset is no longer available.");
          state.importBlocks = preset.prompt_order || [];
          state.importValues = preset.metadata?.promptVariables || {};
          state.expandedImports = state.importBlocks.map((_, idx) => idx);
        }
        render();
      } catch (err) {
        state.notice = err.message;
        render();
      }
      return;
    }
    if (el.dataset.action === "open" && el.value) {
      try {
        if (state.dirty && !await askConfirm(root, modalRef, "Discard Unsaved Changes?", "Open this preset and discard your current unsaved draft?", "warning", "Open Preset")) {
          render();
          return;
        }
        state.draft = ensureUniqueBlockIds(await request("get", { id: el.value }));
        state.savedFingerprint = computeDraftFingerprint(state.draft);
        state.selected = 0;
        state.selectedDraft = [];
        state.collapsedCategories = [];
        state.historyPast = [structuredClone(state.draft)];
        state.historyFuture = [];
        state.batchTranslation = null;
        state.dirty = false;
        state.notice = "";
        scheduleTokenCount();
        render();
      } catch (err) {
        state.notice = err.message;
        render();
      }
    }
  });
  root.addEventListener("click", async (e) => {
    const el = e.target.closest("button[data-action]");
    if (!el)
      return;
    const a = el.dataset.action;
    const d = state.draft;
    const b = d?.prompt_order?.[state.selected];
    try {
      if (a === "full-window") {
        setFull(true);
        return;
      } else if (a === "close-window") {
        setFull(false);
        return;
      } else if (a === "refresh")
        await refresh();
      else if (a === "undo") {
        undo();
        return;
      } else if (a === "redo") {
        redo();
        return;
      } else if (a === "new") {
        if (state.dirty && !await askConfirm(root, modalRef, "Start New Preset?", "Discard your current unsaved draft and start a new preset?", "warning", "Start New"))
          return;
        state.draft = freshDraft();
        state.savedFingerprint = "";
        state.selected = 0;
        state.selectedDraft = [];
        state.collapsedCategories = [];
        state.historyPast = [structuredClone(state.draft)];
        state.historyFuture = [];
        state.batchTranslation = null;
        persist(true);
      } else if (a === "restore") {
        if (!state.recovery)
          throw new Error("No recovered draft is available.");
        if (state.dirty && !await askConfirm(root, modalRef, "Recover Draft?", "Replace the current draft with the last auto-recovered draft?", "warning", "Recover"))
          return;
        state.draft = ensureUniqueBlockIds(structuredClone(state.recovery));
        state.selected = 0;
        state.dirty = true;
        scheduleTokenCount();
      } else if (a === "import-preset-json")
        await importJsonFile("preset");
      else if (a === "import-template-json")
        await importJsonFile("template");
      else if (a === "export-preset-json" && d)
        exportJsonFile(`${(d.name || "preset").replace(/[^a-z0-9-_]+/gi, "_")}.json`, d);
      else if (a === "export-template") {
        const t = state.templates[Number(el.dataset.index)];
        if (t)
          exportJsonFile(`template-${t.name.replace(/[^a-z0-9-_]+/gi, "_")}.json`, t);
      } else if (a === "view")
        state.view = el.dataset.view;
      else if (a === "editor-mode")
        state.editorMode = el.dataset.mode;
      else if (a === "open-find-replace") {
        openFindReplaceDialog(root, modalRef, state, persist, render);
        return;
      } else if (a === "toggle-category-collapse") {
        const catId = el.dataset.catId;
        state.collapsedCategories = state.collapsedCategories.includes(catId) ? state.collapsedCategories.filter((id) => id !== catId) : [...state.collapsedCategories, catId];
      } else if (a === "toggle-all-categories" && d) {
        const catIds = d.prompt_order.filter((blk) => blk.marker === "category").map((blk) => blk.id);
        const allCollapsed = catIds.length > 0 && catIds.every((id) => state.collapsedCategories.includes(id));
        state.collapsedCategories = allCollapsed ? [] : catIds;
      } else if (a === "filter-blocks")
        state.blockFilter = el.dataset.filter;
      else if (a === "filter-breakdown")
        state.breakdownFilter = el.dataset.filter;
      else if (a === "toggle-xray-expand")
        state.xrayExpanded = !state.xrayExpanded;
      else if (a === "jump-to-block") {
        state.selected = Number(el.dataset.index) || 0;
        state.view = "blocks";
        state.mobileDetailOpen = true;
      } else if (a === "jump-to-block-id" && d) {
        const idx = d.prompt_order.findIndex((blk) => blk.id === el.dataset.blockId);
        if (idx >= 0) {
          state.selected = idx;
          state.view = "blocks";
          state.mobileDetailOpen = true;
        }
      } else if (a === "select-block") {
        state.selected = Number(el.dataset.index);
        state.mobileDetailOpen = true;
        if (state.showMacroPane)
          await runMacroPreview(d.prompt_order[state.selected]);
      } else if (a === "close-mobile-detail")
        state.mobileDetailOpen = false;
      else if (a === "block-menu") {
        const rect = el.getBoundingClientRect();
        openBlockContextMenu(root, modalRef, state, Number(el.dataset.index), rect.left, rect.bottom + 4, contextMenuCallbacks);
        return;
      } else if (a === "toggle-lock" && b) {
        b.isLocked = !b.isLocked;
        persist();
      } else if (a === "set-color" && b) {
        b.color = el.dataset.color || null;
        persist();
      } else if (a === "toggle-trigger" && b) {
        const tr = el.dataset.trigger;
        const cur = Array.isArray(b.injectionTrigger) ? b.injectionTrigger : [];
        b.injectionTrigger = cur.includes(tr) ? cur.filter((x) => x !== tr) : [...cur, tr];
        persist();
      } else if (a === "insert-selected-macro") {
        insertTextAtPromptCursor(state.quickMacroSnippet || "{{char}}");
        return;
      } else if (a === "insert-macro-chip") {
        insertTextAtPromptCursor(el.dataset.snippet || "");
        return;
      } else if (a === "open-text-editor" && b) {
        await openFullTextEditorForBlock(b);
        return;
      } else if (a === "apply-starter-variable" && b) {
        const starterId = el.dataset.starterId;
        const ex = VARIABLE_STARTER_EXAMPLES.find((s) => s.id === starterId);
        if (ex) {
          b.variables = Array.isArray(b.variables) ? b.variables : [];
          const newVar = structuredClone(ex.variable);
          let uniqueName = newVar.name;
          let counter = 1;
          while (b.variables.some((v) => v.name === uniqueName)) {
            uniqueName = `${newVar.name}_${++counter}`;
          }
          newVar.name = uniqueName;
          newVar.label = `${newVar.label}${counter > 1 ? ` ${counter}` : ""}`;
          b.variables.push(newVar);
          const snippetToInsert = ex.promptSnippet.replace(new RegExp(`\\b${ex.variable.name}\\b`, "g"), uniqueName);
          const curContent = b.content || "";
          b.content = curContent.trim() ? `${curContent.trim()}

${snippetToInsert}` : snippetToInsert;
          persist();
          state.notice = `Added variable “${newVar.label}” ({{var::${uniqueName}}}) to block.`;
        }
      } else if (a === "insert-var-into-prompt" && b) {
        const varName = el.dataset.varName;
        if (varName) {
          insertTextAtPromptCursor(`{{var::${varName}}}`);
          state.notice = `Inserted {{var::${varName}}} into block content.`;
        }
        return;
      } else if (a === "reset-block-variables" && b) {
        if (d.metadata?.promptVariables?.[b.id]) {
          delete d.metadata.promptVariables[b.id];
          persist();
          render();
          state.notice = "Reset active variable values on this block to defaults.";
        }
        return;
      } else if (a === "copy-var-preview-output") {
        const savedBlockVars = d?.metadata?.promptVariables?.[b?.id] || {};
        const text = resolveBlockVariablesPreview(b, savedBlockVars);
        await copyToClipboard(text);
        await request("toast", { kind: "success", title: "Preset Studio", message: "Copied resolved block text" });
        return;
      } else if (a === "toggle-authors-note") {
        state.authorsNote.enabled = !state.authorsNote.enabled;
        render();
        return;
      } else if (a === "set-authors-note-preset") {
        const pIdx = Number(el.dataset.presetIdx);
        const preset = AUTHORS_NOTE_PRESETS[pIdx];
        if (preset) {
          state.authorsNote.content = preset.content;
          state.authorsNote.enabled = true;
          render();
        }
        return;
      } else if (a === "set-reply-view-mode") {
        state.testReplyViewMode = el.dataset.mode || "chat";
        render();
        return;
      } else if (a === "change-test-prompt-source") {
        state.testPromptSource = el.value || "preset";
        render();
        return;
      } else if (a === "set-test-turn-mode") {
        state.testTurnMode = el.dataset.mode || "single";
        render();
        return;
      } else if (a === "add-test-turn") {
        state.testTurns.push({ id: uid(), role: "user", content: "" });
        render();
        return;
      } else if (a === "delete-test-turn") {
        state.testTurns.splice(Number(el.dataset.turnIdx), 1);
        render();
        return;
      } else if (a === "clear-test-turns") {
        state.testTurns = [];
        render();
        return;
      } else if (a === "fill-dummy-turns") {
        const mocks = [
          { role: "user", content: "Hello! Are you ready for this adventure?" },
          { role: "assistant", content: "Always ready. Where should we begin?" },
          { role: "user", content: "Let us head toward the old ruins across the misty ridge." },
          { role: "assistant", content: "The air turns cold as the trail narrows. Watch your footing." },
          { role: "user", content: "I draw my lantern and scan the stone doorway ahead." }
        ];
        state.testTurns.push(...mocks.map((m) => ({ id: uid(), ...m })));
        state.notice = "Appended 5 multi-turn conversation steps to test your preset.";
        render();
        return;
      } else if (a === "continue-test-dialogue") {
        const lastUser = state.testTurnMode === "single" ? state.custom.trim() : "";
        if (lastUser)
          state.testTurns.push({ id: uid(), role: "user", content: lastUser });
        if (state.result?.trim())
          state.testTurns.push({ id: uid(), role: "assistant", content: state.result.trim() });
        state.testTurns.push({ id: uid(), role: "user", content: "" });
        state.testTurnMode = "multi";
        state.result = "";
        state.displayResult = "";
        state.reasoning = "";
        state.custom = "";
        state.notice = "Added reply to conversation thread. Type your next response below!";
        render();
        setTimeout(() => {
          const allTextareas = root.querySelectorAll('textarea[data-turn-field="content"]');
          allTextareas[allTextareas.length - 1]?.focus({ preventScroll: true });
        }, 30);
        return;
      } else if (a === "copy-active-block-content" && b) {
        await copyToClipboard(b.content || "");
        await request("toast", { kind: "success", title: "Preset Studio", message: `Copied prompt content of “${b.name}”` });
        return;
      } else if (a === "copy-var-macro") {
        await copyToClipboard(el.dataset.macro || "");
        await request("toast", { kind: "success", title: "Preset Studio", message: `Copied macro: ${el.dataset.macro}` });
        return;
      } else if (a === "copy-parameters-json" && d) {
        await copyToClipboard(JSON.stringify(d.parameters || {}, null, 2));
        await request("toast", { kind: "success", title: "Preset Studio", message: "Copied sampler parameters JSON" });
        return;
      } else if (a === "copy-source-content") {
        const item = state.importBlocks[Number(el.dataset.index)];
        if (item?.content) {
          await copyToClipboard(item.content);
          await request("toast", { kind: "success", title: "Preset Studio", message: `Copied prompt of “${item.name || "Block"}”` });
        }
        return;
      } else if (a === "copy-template-text") {
        const tpl = state.templates[Number(el.dataset.index)];
        if (tpl?.entries?.length) {
          const joined = tpl.entries.map((ent) => `### ${ent.block.name || "Block"}
${ent.block.content || ""}`).join(`

`);
          await copyToClipboard(joined);
          await request("toast", { kind: "success", title: "Preset Studio", message: `Copied all prompts in template “${tpl.name}”` });
        }
        return;
      } else if (a === "copy-test-reasoning") {
        await copyToClipboard(state.reasoning || "");
        await request("toast", { kind: "success", title: "Preset Studio", message: "Copied reasoning transcript" });
        return;
      } else if (a === "copy-test-reply") {
        await copyToClipboard(state.result || "");
        await request("toast", { kind: "success", title: "Preset Studio", message: "Copied test reply" });
        return;
      } else if (a === "copy-xray-messages") {
        const msgs = state.assembled?.messages || [];
        await copyToClipboard(JSON.stringify(msgs, null, 2));
        await request("toast", { kind: "success", title: "Preset Studio", message: `Copied ${msgs.length} assembled messages JSON` });
        return;
      } else if (a === "toggle-macro-pane") {
        state.showMacroPane = !state.showMacroPane;
        if (state.showMacroPane && b)
          await runMacroPreview(b);
      } else if (a === "refresh-macro" && b) {
        await runMacroPreview(b);
        return;
      } else if (a === "add-variable" && b) {
        b.variables = Array.isArray(b.variables) ? b.variables : [];
        const idx = b.variables.length + 1;
        b.variables.push({ name: `var_${idx}`, label: `Variable ${idx}`, description: "", type: "text", defaultValue: "" });
        persist();
      } else if (a === "delete-variable" && b) {
        b.variables.splice(Number(el.dataset.vindex), 1);
        persist();
      } else if (a === "add-var-option" && b) {
        const v = b.variables?.[Number(el.dataset.vindex)];
        if (v) {
          v.options = Array.isArray(v.options) ? v.options : [];
          const n = v.options.length + 1;
          v.options.push({ id: `opt_${n}`, label: `Option ${n}`, value: "" });
          persist();
        }
      } else if (a === "delete-var-option" && b) {
        const v = b.variables?.[Number(el.dataset.vindex)];
        v?.options?.splice(Number(el.dataset.oindex), 1);
        persist();
      } else if (a === "collapse-all-imports")
        state.expandedImports = [];
      else if (a === "expand-all-imports")
        state.expandedImports = state.importBlocks.map((_, idx) => idx);
      else if (a === "toggle-import-expand") {
        const idx = Number(el.dataset.index);
        state.expandedImports = state.expandedImports.includes(idx) ? state.expandedImports.filter((n) => n !== idx) : [...state.expandedImports, idx];
      } else if (a === "import-block") {
        const source = state.importBlocks[Number(el.dataset.index)];
        if (!source)
          throw new Error("Source block is no longer available.");
        insertEntries([{ block: source, values: state.importValues[source.id] }]);
        state.notice = `Added “${source.name || "Block"}” to draft.`;
      } else if (a === "add-checked-imports") {
        if (!state.selectedImports.length)
          throw new Error("Check at least one source block first.");
        const entries = state.selectedImports.map((i) => state.importBlocks[i]).filter(Boolean).map((block) => ({ block, values: state.importValues[block.id] }));
        insertEntries(entries);
        state.selectedImports = [];
        state.notice = `Added ${entries.length} checked block(s) to your draft.`;
      } else if (a === "collect-blocks") {
        if (!state.selectedImports.length)
          throw new Error("Check at least one source block first.");
        const source = state.presets.find((p) => p.id === state.importPreset)?.name || "Preset";
        const entries = state.selectedImports.map((i) => state.importBlocks[i]).filter(Boolean).map((block) => ({
          block: structuredClone(block),
          values: structuredClone(state.importValues[block.id] || {}),
          source
        }));
        await saveEntriesAsTemplate(entries, `${source} Selection`);
        state.selectedImports = [];
        render();
        return;
      } else if (a === "move-row-up" || a === "move-row-down") {
        const idx = Number(el.dataset.index);
        moveBlock(idx, idx + (a === "move-row-up" ? -1 : 1));
        return;
      } else if (a === "quick-insert-template") {
        openTemplatePickerModal(root, modalRef, state, insertEntries, importJsonFile, render);
        return;
      } else if (a === "quick-template-from-selected") {
        const chosen = d.prompt_order.filter((blk) => state.selectedDraft.includes(blk.id));
        if (!chosen.length)
          throw new Error("Check at least one block first.");
        const entries = chosen.map((blk) => ({
          block: structuredClone(blk),
          values: structuredClone(d.metadata?.promptVariables?.[blk.id] || {}),
          source: d.name || "Draft"
        }));
        await saveEntriesAsTemplate(entries, chosen.length === 1 ? chosen[0].name : `${d.name || "Preset"} Pack`);
        state.selectedDraft = [];
        render();
        return;
      } else if (a === "insert-template") {
        const t = state.templates[Number(el.dataset.index)];
        if (!t)
          throw new Error("Template not found.");
        insertEntries(t.entries);
        state.notice = `Added ${t.entries.length} blocks from ${t.name}.`;
      } else if (a === "delete-template") {
        const t = state.templates[Number(el.dataset.index)];
        if (!t || !await askConfirm(root, modalRef, "Delete Template?", `Delete the saved template “${t.name}”?`, "danger", "Delete"))
          return;
        state.templates = await request("template-delete", { id: t.id });
        state.notice = "Template deleted.";
      } else if (a === "toggle") {
        const block = d.prompt_order[Number(el.dataset.index)];
        block.enabled = !block.enabled;
        persist();
      } else if (a === "add-block" || a === "add-category") {
        d.prompt_order.push({
          id: uid(),
          name: a === "add-category" ? "New category" : "New prompt",
          content: "",
          role: "system",
          enabled: true,
          position: "pre_history",
          depth: 0,
          marker: a === "add-category" ? "category" : null,
          isLocked: false,
          color: a === "add-category" ? "#a795e8" : null,
          injectionTrigger: [],
          group: null,
          ...a === "add-category" ? { categoryMode: "checkbox" } : {}
        });
        state.selected = d.prompt_order.length - 1;
        state.mobileDetailOpen = true;
        persist();
      } else if (a === "save-preferences") {
        if (!state.translationLanguage.trim())
          throw new Error("Enter a translation language.");
        await request("preferences", {
          translationLanguage: state.translationLanguage.trim(),
          translationConnection: state.translationConnection
        });
        state.notice = "Studio settings saved.";
      } else if (a === "translate-batch") {
        const target = el.dataset.target;
        const group = el.dataset.group;
        const scope = el.dataset.scope;
        const list = target === "source" ? state.importBlocks : d.prompt_order;
        const owner = target === "source" ? state.importPreset : d;
        const chosen = list.filter((block, i) => group === "all" || (target === "source" ? state.selectedImports.includes(i) : state.selectedDraft.includes(block.id)));
        if (!chosen.length)
          throw new Error("Select at least one block to translate.");
        const snapshots = chosen.map((block) => ({ id: block.id, name: block.name || "", content: block.content || "" }));
        state.batchTranslation = null;
        state.translating = true;
        render();
        const progressEl = root.querySelector("[data-batch-progress]");
        if (progressEl)
          progressEl.textContent = `Translating ${snapshots.length} block(s) in parallel batches…`;
        try {
          const res = await request("translate-batch", {
            blocks: snapshots,
            scope,
            language: state.translationLanguage,
            connectionId: state.translationConnection
          }, {
            onProgress: (p) => {
              const elProg = root.querySelector("[data-batch-progress]");
              if (elProg)
                elProg.textContent = `Translated ${p.completed} / ${p.total} fields…`;
            }
          });
          const entries = res?.entries || [];
          if (!entries.length)
            throw new Error("The selected blocks have no text in the chosen fields.");
          if ((target === "source" ? state.importPreset : state.draft) !== owner)
            throw new Error("The preset changed while translating. Start again.");
          state.batchTranslation = { target, owner, entries };
          state.notice = `${entries.length} translated blocks ready to review.`;
        } finally {
          state.translating = false;
        }
      } else if (a === "apply-batch") {
        const batch = state.batchTranslation;
        const target = el.dataset.target;
        if (!batch || batch.target !== target || (target === "source" ? state.importPreset : state.draft) !== batch.owner)
          throw new Error("The preset changed. Translate again.");
        const list = target === "source" ? state.importBlocks : state.draft.prompt_order;
        const pairs = batch.entries.map((entry) => ({ entry, block: list.find((item) => item.id === entry.id) }));
        if (pairs.some(({ entry, block }) => !block || entry.name !== undefined && (block.name || "") !== entry.original.name || entry.content !== undefined && (block.content || "") !== entry.original.content)) {
          throw new Error("A block changed since translation. Translate again.");
        }
        for (const { entry, block } of pairs)
          applyTranslatedFields(block, entry);
        state.batchTranslation = null;
        if (target === "draft")
          persist();
        state.notice = target === "draft" ? "Translations applied to the draft." : "Translations ready to add; source preset unchanged.";
      } else if (a === "discard-batch")
        state.batchTranslation = null;
      else if (a === "translate-source") {
        const index = Number(el.dataset.index);
        const block = state.importBlocks[index];
        const presetId = state.importPreset;
        if (!block)
          throw new Error("Select a source block first.");
        state.translating = true;
        render();
        try {
          const result = await translateFields(block, el.dataset.scope);
          if (state.importPreset === presetId)
            state.sourceTranslation = { presetId, index, ...result };
        } finally {
          state.translating = false;
        }
        state.notice = "Translation ready to review.";
      } else if (a === "apply-source-translation") {
        const t = state.sourceTranslation;
        const block = state.importBlocks[Number(el.dataset.index)];
        if (!t || t.presetId !== state.importPreset || t.index !== Number(el.dataset.index) || !block)
          throw new Error("The source block changed. Translate it again.");
        applyTranslatedFields(block, t);
        state.sourceTranslation = null;
        state.notice = "Translation ready to add.";
      } else if (a === "discard-source-translation")
        state.sourceTranslation = null;
      else if (a === "translate") {
        if (!b)
          throw new Error("Select a block first.");
        const blockId = b.id;
        state.translating = true;
        render();
        try {
          const result = await translateFields(b, el.dataset.scope);
          state.translation = { blockId, ...result };
        } finally {
          state.translating = false;
        }
        state.notice = "Translation ready to review.";
      } else if (a === "apply-translation") {
        const t = state.translation;
        if (!t || !b || t.blockId !== b.id)
          throw new Error("Select the translated block first.");
        applyTranslatedFields(b, t);
        state.translation = null;
        persist();
        state.notice = "Translation applied to the draft.";
      } else if (a === "discard-translation")
        state.translation = null;
      else if (a === "up" || a === "down") {
        const n = state.selected + (a === "up" ? -1 : 1);
        if (n >= 0 && n < d.prompt_order.length)
          moveBlock(state.selected, n);
        return;
      } else if (a === "duplicate-block" && b) {
        d.prompt_order.splice(state.selected + 1, 0, { ...structuredClone(b), id: uid(), name: (b.name || "Block") + " copy", isLocked: false });
        state.selected++;
        persist();
      } else if (a === "delete-row") {
        await deleteBlockAtIndex(Number(el.dataset.index));
        return;
      } else if (a === "delete-block" && b) {
        await deleteBlockAtIndex(state.selected);
        return;
      } else if ((a === "enable-checked-blocks" || a === "disable-checked-blocks") && d) {
        const enable = a === "enable-checked-blocks";
        const targetIds = new Set(state.selectedDraft);
        for (const blk of d.prompt_order) {
          if (targetIds.has(blk.id))
            blk.enabled = enable;
        }
        state.selectedDraft = [];
        persist();
      } else if (a === "delete-checked-blocks" && d) {
        const count = state.selectedDraft.length;
        if (!count)
          return;
        if (!await askConfirm(root, modalRef, "Delete Checked Blocks?", `Delete ${count} checked block(s) from your draft?`, "danger", `Delete ${count} Block(s)`))
          return;
        const toRemove = new Set(state.selectedDraft);
        d.prompt_order = d.prompt_order.filter((blk) => !toRemove.has(blk.id));
        if (d.metadata?.promptVariables) {
          for (const bid of toRemove)
            delete d.metadata.promptVariables[bid];
        }
        state.selectedDraft = [];
        state.selected = Math.max(0, Math.min(state.selected, d.prompt_order.length - 1));
        state.notice = `Deleted ${count} checked block(s).`;
        persist();
      } else if (a === "apply-json") {
        let value;
        try {
          value = JSON.parse(root.querySelector(`[data-json="${el.dataset.target}"]`).value);
        } catch {
          throw new Error("Invalid JSON. Fix the syntax and try again.");
        }
        if (el.dataset.target === "variables") {
          if (!Array.isArray(value))
            throw new Error("Variables must be a JSON array.");
          b.variables = value;
        } else {
          if (!value || typeof value !== "object" || Array.isArray(value))
            throw new Error("This field must be a JSON object.");
          d[el.dataset.target] = value;
        }
        persist();
      } else if (a === "save" || a === "save-copy") {
        root.inert = true;
        root.setAttribute("aria-busy", "true");
        try {
          const saved = ensureUniqueBlockIds(await syncSaveWithNativePresetEditor(ctx, request, d, a === "save-copy"));
          state.draft = saved;
          state.savedFingerprint = computeDraftFingerprint(saved);
          state.dirty = false;
          clearTimeout(timer);
          await saveChain;
          await request("draft", { draft: saved });
          await refresh();
          state.notice = saved.provider === "loom" ? "Saved and applied live to Lumiverse (no page refresh needed)." : 'Saved. Set Provider to "loom" to list this preset in the native Loom Presets tab.';
        } finally {
          root.inert = false;
          root.removeAttribute("aria-busy");
        }
      } else if (a === "profile") {
        const peState = ctx.ui?.presetEditor?.getState?.();
        if (peState?.open && peState?.preset && peState.preset.id === d.id && Array.isArray(peState.preset.blocks)) {
          const map = new Map(peState.preset.blocks.map((blk) => [blk.id, Boolean(blk.enabled)]));
          for (const block of d.prompt_order)
            if (map.has(block.id))
              block.enabled = map.get(block.id);
          persist();
          state.notice = "Applied active block states from the open native Preset Editor.";
        } else {
          if (!state.chatId)
            throw new Error("Choose a chat first.");
          const active = await request("active", { chatId: state.chatId, presetId: d.id, generationType: state.generationType });
          if (active.preset_id && d.id && active.preset_id !== d.id)
            throw new Error("The selected chat uses a different preset. Open that preset first.");
          for (const block of d.prompt_order)
            if (Object.hasOwn(active.block_states || {}, block.id))
              block.enabled = active.block_states[block.id];
          persist();
          state.notice = `Applied active block states from ${active.source || "profile"}.`;
        }
      } else if (a === "stop") {
        if (state.activeRun)
          await request("cancel", { runId: state.activeRun });
        state.notice = "Generation stopped.";
      } else if (a === "dry") {
        if (!state.chatId)
          throw new Error("Choose a chat first.");
        state.busy = true;
        render();
        const result = await request("dry", {
          chatId: state.chatId,
          connectionId: state.connectionId,
          presetId: d.id,
          generationType: state.generationType
        });
        state.assembled = result;
        state.notice = "Saved-preset dry run complete.";
        state.busy = false;
      } else if (a === "preview" || a === "run") {
        const isCustomSource = state.testPromptSource === "custom";
        if (!isCustomSource && !state.chatId)
          throw new Error("Choose a chat first.");
        if (isCustomSource && !state.testCustomPrompt.trim() && !state.custom.trim()) {
          throw new Error("Type your custom prompt text or a custom test turn first.");
        }
        state.busy = true;
        state.result = "";
        state.displayResult = "";
        state.reasoning = "";
        state.lastUsage = null;
        state.assembled = null;
        const snapshot = structuredClone(d);
        const requestId = uid();
        state.activeRun = requestId;
        const stagedTurns = state.testTurnMode === "multi" ? state.testTurns : state.custom.trim() ? [{ role: "user", content: state.custom.trim() }] : [];
        render();
        await new Promise((resolve, reject) => {
          pending.set(requestId, {
            resolve,
            reject,
            onAssembled: (assembledPayload) => {
              state.assembled = assembledPayload;
              render();
            },
            onReasoning: (token) => {
              state.reasoning += token;
              const rbox = root.querySelector(".ps-reasoning-box");
              if (rbox)
                rbox.textContent = state.reasoning;
            },
            onToken: (token) => {
              state.result += token;
              const bubble = root.querySelector("#ps-chat-reply-bubble");
              if (bubble) {
                renderChatPreviewInto(bubble, state.result, state.testReplyViewMode === "raw");
              }
            }
          });
          ctx.sendToBackend({
            action: a,
            requestId,
            preset: snapshot,
            promptSource: state.testPromptSource,
            customPrompt: state.testCustomPrompt,
            includeChatHistory: state.testCustomPromptIncludeHistory,
            chatId: state.chatId,
            connectionId: state.connectionId,
            generationType: state.generationType,
            testTurns: stagedTurns,
            customMessage: state.custom,
            authorsNote: state.authorsNote
          });
        }).then((result) => {
          if (a === "run" && !result?.aborted) {
            state.lastUsage = result?.usage || null;
            if (result?.reasoning && !state.reasoning)
              state.reasoning = result.reasoning;
            state.result = result?.content || state.result;
            state.displayResult = result?.displayContent || state.result;
            state.runs.push({
              time: new Date().toLocaleTimeString(),
              connection: state.connections.find((c) => c.id === state.connectionId)?.name || "Active connection",
              content: state.result,
              reasoning: state.reasoning,
              snapshot
            });
            if (state.runs.length >= 2) {
              state.compareA = state.runs.length - 2;
              state.compareB = state.runs.length - 1;
            }
          }
        });
        state.busy = false;
        state.activeRun = null;
      }
      if (![
        "refresh",
        "save",
        "save-copy",
        "dry",
        "profile",
        "stop",
        "collect-blocks",
        "insert-template",
        "quick-insert-template",
        "quick-template-from-selected",
        "delete-template",
        "translate",
        "apply-translation",
        "save-preferences",
        "translate-source",
        "apply-source-translation",
        "translate-batch",
        "apply-batch",
        "import-block",
        "add-checked-imports",
        "delete-checked-blocks",
        "delete-row",
        "delete-block",
        "fill-dummy-turns",
        "continue-test-dialogue",
        "apply-starter-variable",
        "toggle-authors-note",
        "set-authors-note-preset",
        "set-reply-view-mode",
        "reset-block-variables"
      ].includes(a)) {
        state.notice = "";
      }
      render();
    } catch (err) {
      state.busy = false;
      state.activeRun = null;
      state.notice = (err.message || String(err)) + (a === "save" ? " Your draft is preserved." : "");
      render();
    }
  });
  const unsubActivate = tab.onActivate?.(() => {
    refresh().catch((err) => {
      state.notice = err.message;
      render();
    });
  });
  render();
  return () => {
    destroyed = true;
    closeModalRef(modalRef);
    destroyMounted();
    clearTimeout(timer);
    clearTimeout(tokenTimer);
    clearTimeout(longPressTimer);
    if (state.activeRun)
      request("cancel", { runId: state.activeRun }).catch(() => {});
    for (const [, p] of pending) {
      try {
        p.reject?.(new Error("Extension unloaded."));
      } catch (_) {}
    }
    pending.clear();
    tokenCache.clear();
    unsub();
    unsubActivate?.();
    unsubKb?.();
    cleanupLauncher();
    document.removeEventListener("keydown", onKey);
    mount?.destroy();
    tab.destroy();
    polish();
    style();
    ctx.dom.cleanup();
  };
}
export {
  setup
};
