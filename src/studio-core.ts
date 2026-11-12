export const SWATCHES = ['#a795e8', '#64b5f6', '#4db6ac', '#81c784', '#ffd54f', '#ffb74d', '#e57373', '#f06292'];
export const TRIGGERS = ['normal', 'continue', 'regenerate', 'swipe', 'impersonate', 'quiet'];

export const MACRO_CATALOG = [
  { group: 'Identity & Card', label: '{{char}} — Character Name', snippet: '{{char}}' },
  { group: 'Identity & Card', label: '{{user}} — User / Persona Name', snippet: '{{user}}' },
  { group: 'Identity & Card', label: '{{description}} — Character Description', snippet: '{{description}}' },
  { group: 'Identity & Card', label: '{{personality}} — Character Personality', snippet: '{{personality}}' },
  { group: 'Identity & Card', label: '{{scenario}} — Scenario', snippet: '{{scenario}}' },
  { group: 'Identity & Card', label: '{{persona}} — User Persona', snippet: '{{persona}}' },
  { group: 'Identity & Card', label: '{{mesExamples}} — Example Dialogue', snippet: '{{mesExamples}}' },
  { group: 'Identity & Card', label: '{{system}} — Character System Prompt', snippet: '{{system}}' },
  { group: 'Identity & Card', label: '{{charPostHistoryInstructions}} — Post-History / Jailbreak', snippet: '{{charPostHistoryInstructions}}' },
  { group: 'Identity & Card', label: '{{charTags}} — Character Tags List', snippet: '{{charTags}}' },
  { group: 'Chat & Context', label: '{{lastMessage}} — Last Message', snippet: '{{lastMessage}}' },
  { group: 'Chat & Context', label: '{{lastUserMessage}} — Last User Message', snippet: '{{lastUserMessage}}' },
  { group: 'Chat & Context', label: '{{lastCharMessage}} — Last Character Message', snippet: '{{lastCharMessage}}' },
  { group: 'Chat & Context', label: '{{messageCount}} — Message Count', snippet: '{{messageCount}}' },
  { group: 'Chat & Context', label: '{{isGroupChat}} — Group Chat Condition', snippet: '{{isGroupChat}}' },
  { group: 'Chat & Context', label: '{{group}} — Group Members', snippet: '{{group}}' },
  { group: 'Chat & Context', label: '{{isNarrator}} — Narrator Persona Flag', snippet: '{{isNarrator}}' },
  { group: 'Chat & Context', label: '{{model}} — Active Model Name', snippet: '{{model}}' },
  { group: 'Chat & Context', label: '{{maxContext}} — Max Context Tokens', snippet: '{{maxContext}}' },
  { group: 'Variables & Control Flow', label: '{{if::...}}...{{/if}} — Conditional Block', snippet: '{{if::{{isGroupChat}}}}\n\n{{else}}\n\n{{/if}}' },
  { group: 'Variables & Control Flow', label: '{{unless::...}}...{{/unless}} — Inverted Conditional', snippet: '{{unless::{{isGroupChat}}}}\n\n{{/unless}}' },
  { group: 'Variables & Control Flow', label: '{{switch::...}} — Multi-Branch Switch', snippet: '{{switch::{{.mode}}}}\n{{case::a}}\n\n{{/case}}\n{{default}}\n\n{{/default}}\n{{/switch}}' },
  { group: 'Variables & Control Flow', label: '{{default::val::fallback}} — Fallback Value', snippet: '{{default::{{.value}}::fallback}}' },
  { group: 'Variables & Control Flow', label: '{{setchatvar::key::val}} — Set Persisted Chat Var (@)', snippet: '{{setchatvar::key::value}}' },
  { group: 'Variables & Control Flow', label: '{{getchatvar::key}} — Read Persisted Chat Var (@)', snippet: '{{getchatvar::key}}' },
  { group: 'Variables & Control Flow', label: '{{setvar::key::val}} — Set Local Var (.)', snippet: '{{setvar::key::value}}' },
  { group: 'Loom, Council & Memory', label: '{{memories}} — Long-Term Chat Memories', snippet: '{{memories}}' },
  { group: 'Loom, Council & Memory', label: '{{databank}} — Databank Retrieval Chunks', snippet: '{{databank}}' },
  { group: 'Loom, Council & Memory', label: '{{entities}} — Memory Cortex Entities', snippet: '{{entities}}' },
  { group: 'Loom, Council & Memory', label: '{{relationships}} — Memory Cortex Relationships', snippet: '{{relationships}}' },
  { group: 'Loom, Council & Memory', label: '{{arc}} — Narrative Arc Summary', snippet: '{{arc}}' },
  { group: 'Loom, Council & Memory', label: '{{loomStyle}} — Loom Narrative Style', snippet: '{{loomStyle}}' },
  { group: 'Loom, Council & Memory', label: '{{loomSummary}} — Stored Loom Summary', snippet: '{{loomSummary}}' },
  { group: 'Loom, Council & Memory', label: '{{loomSovHand}} — Sovereign Hand Co-Pilot', snippet: '{{if::{{loomSovHandActive}}}}\n{{loomSovHand}}\n{{/if}}' },
  { group: 'Loom, Council & Memory', label: '{{lumiaCouncilDeliberation}} — Council Deliberation', snippet: '{{if::{{lumiaCouncilModeActive}}}}\n{{lumiaCouncilDeliberation}}\n{{/if}}' },
  { group: 'Loom, Council & Memory', label: '{{reasoningPrefix}}...{{reasoningSuffix}} — CoT Tags', snippet: '{{reasoningPrefix}}\n\n{{reasoningSuffix}}' },
  { group: 'Random, Math & Time', label: '{{pick::a::b::c}} — Random Choice', snippet: '{{pick::vivid::poetic::atmospheric}}' },
  { group: 'Random, Math & Time', label: '{{random::1::100}} — Random Number', snippet: '{{random::1::100}}' },
  { group: 'Random, Math & Time', label: '{{roll::1d20}} — Dice Roll', snippet: '{{roll::1d20}}' },
  { group: 'Random, Math & Time', label: '{{calc::...}} — Math Expression', snippet: '{{calc::{{messageCount}} + 1}}' },
  { group: 'Random, Math & Time', label: '{{time}} / {{date}} — Current Time & Date', snippet: '{{time}}, {{weekday}} {{date}}' },
];

export const MARKERS = [
  { id: '', label: 'None (Custom Prompt)' },
  { id: 'category', label: 'Category Divider' },
  { id: 'chat_history', label: 'Chat History (chat_history)' },
  { id: 'world_info_before', label: 'World Info Before (world_info_before)' },
  { id: 'world_info_after', label: 'World Info After (world_info_after)' },
  { id: 'char_description', label: 'Char Description (char_description)' },
  { id: 'char_personality', label: 'Char Personality (char_personality)' },
  { id: 'persona_description', label: 'User Persona (persona_description)' },
  { id: 'scenario', label: 'Scenario (scenario)' },
  { id: 'dialogue_examples', label: 'Example Messages (dialogue_examples)' },
  { id: 'main_prompt', label: 'Main Prompt (main_prompt)' },
  { id: 'enhance_definitions', label: 'Enhance Definitions (enhance_definitions)' },
  { id: 'jailbreak', label: 'Post-History Instructions (jailbreak)' },
  { id: 'nsfw_prompt', label: 'NSFW / Auxiliary Prompt (nsfw_prompt)' },
];

export interface VariableStarterExample {
  id: string;
  badge: string;
  title: string;
  summary: string;
  variable: any;
  promptSnippet: string;
}

export const VARIABLE_STARTER_EXAMPLES: VariableStarterExample[] = [
  {
    id: 'writing_tone',
    badge: 'Dropdown',
    title: '🎨 Writing Tone',
    summary: 'User picks a short label (Warm, Dramatic, Clinical); full instructions inject into the prompt.',
    variable: {
      name: 'writing_tone',
      label: 'Writing Tone',
      type: 'select',
      description: 'Choose the overall emotional register of the narration.',
      defaultValue: 'warm',
      options: [
        { id: 'warm', label: 'Warm & Empathetic', value: 'Write with warmth, emotional attunement, and natural tenderness.' },
        { id: 'dramatic', label: 'Dramatic & Cinematic', value: 'Use heightened tension, atmospheric lighting, and cinematic pacing.' },
        { id: 'clinical', label: 'Crisp & Grounded', value: 'Keep prose grounded, observant, and concise without melodrama.' },
      ],
    },
    promptSnippet: '{{var::writing_tone}}',
  },
  {
    id: 'response_length',
    badge: 'Slider',
    title: '📏 Response Length',
    summary: 'A touch slider from 1 to 6 paragraphs so users can control reply length.',
    variable: {
      name: 'response_length',
      label: 'Target Paragraphs',
      type: 'slider',
      description: 'How many paragraphs each reply should aim for.',
      min: 1,
      max: 6,
      step: 1,
      defaultValue: 3,
    },
    promptSnippet: 'Keep your response around {{var::response_length}} paragraphs long.',
  },
  {
    id: 'strict_canon',
    badge: 'On/Off Switch',
    title: '🛡️ Strict Canon Toggle',
    summary: 'An On/Off switch (1 or 0) that turns a prompt rule on or off using {{if::...}}.',
    variable: {
      name: 'strict_canon',
      label: 'Strict Canon Mode',
      type: 'switch',
      description: 'When enabled, enforces strict adherence to character lore and canon.',
      defaultValue: 1,
    },
    promptSnippet: '{{if::{{var::strict_canon}}}}\nStrictly adhere to established canon and character lore. Do not invent contradictory backstory.\n{{/if}}',
  },
  {
    id: 'style_addons',
    badge: 'Multi-select',
    title: '🧩 Style Checklist',
    summary: 'Lets users check multiple writing rules that combine automatically.',
    variable: {
      name: 'style_addons',
      label: 'Active Style Rules',
      type: 'multiselect',
      description: 'Select any combination of prose enhancements.',
      separator: '\n',
      defaultValue: ['sensory', 'dialogue'],
      options: [
        { id: 'sensory', label: 'Vivid Sensory Detail', value: '- Ground every scene in sound, texture, and lighting.' },
        { id: 'dialogue', label: 'Natural Dialogue', value: '- Keep dialogue sharp, subtextual, and true to character voice.' },
        { id: 'thoughts', label: 'Inner Monologue', value: '- Weave unspoken internal thoughts in italics.' },
      ],
    },
    promptSnippet: '{{var::style_addons}}',
  },
  {
    id: 'custom_focus',
    badge: 'Text Box',
    title: '✍️ Scene Focus Note',
    summary: 'A simple text field where users can type a custom focus or theme.',
    variable: {
      name: 'scene_focus',
      label: 'Scene Focus',
      type: 'text',
      description: 'Optional theme or detail to emphasize in the story.',
      defaultValue: 'slow-burn character chemistry',
    },
    promptSnippet: 'Emphasize {{var::scene_focus}} throughout the scene.',
  },
];

export const AUTHORS_NOTE_PRESETS = [
  {
    label: '✨ Vivid & Slow',
    content: '[Style: vivid sensory descriptions, grounded atmosphere, slow and deliberate pacing.]',
  },
  {
    label: '⚡ Raise Tension',
    content: '[Increase dramatic tension. Something feels subtly off in the environment.]',
  },
  {
    label: '💭 Inner Thoughts',
    content: "[Include {{char}}'s unspoken internal thoughts and emotional reactions in italics.]",
  },
  {
    label: '💬 Dialogue Focus',
    content: '[Focus on natural back-and-forth dialogue and subtle body language over long exposition.]',
  },
];

export const esc = (x: unknown): string =>
  String(x ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));

export const uid = (): string =>
  globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function selectOptions<T extends { id: string }>(items: T[], value: string | undefined, label: (item: T) => string): string {
  return items.map((x) => `<option value="${esc(x.id)}" ${x.id === value ? 'selected' : ''}>${esc(label(x))}</option>`).join('');
}

export const freshDraft = () => ({
  name: 'New preset',
  provider: 'loom',
  engine: 'classic',
  parameters: {},
  prompts: {},
  metadata: { promptVariables: {} },
  prompt_order: [
    { id: uid(), name: 'Main Prompt', content: '', role: 'system', enabled: true, position: 'pre_history', depth: 0, marker: 'main_prompt', isLocked: false, color: null, injectionTrigger: [], group: null },
    { id: uid(), name: 'Char Description', content: '', role: 'system', enabled: true, position: 'pre_history', depth: 0, marker: 'char_description', isLocked: true, color: null, injectionTrigger: [], group: null },
    { id: uid(), name: 'Chat History', content: '', role: 'system', enabled: true, position: 'pre_history', depth: 0, marker: 'chat_history', isLocked: true, color: null, injectionTrigger: [], group: null },
  ],
});

export function normalizeVariableDef(v: any, allowEmptyWhileEditing = false): any {
  const type = v?.type === 'boolean' ? 'switch' : ['text', 'textarea', 'number', 'slider', 'select', 'switch', 'multiselect'].includes(v?.type) ? v.type : 'text';
  const cleanedName = String(v?.name ?? '').replace(/[^a-zA-Z0-9_]/g, '_');
  const base: any = {
    name: allowEmptyWhileEditing ? cleanedName : cleanedName || 'var_1',
    label: allowEmptyWhileEditing ? String(v?.label ?? '') : String(v?.label || cleanedName || 'Variable'),
    type,
  };
  if (typeof v?.description === 'string' && v.description) base.description = v.description;
  if (type === 'switch') {
    base.defaultValue = v?.defaultValue === 1 || v?.defaultValue === '1' || v?.defaultValue === true || v?.defaultValue === 'true' ? 1 : 0;
  } else if (type === 'number' || type === 'slider') {
    const min = Number.isFinite(Number(v?.min)) ? Number(v.min) : 0;
    const max = Number.isFinite(Number(v?.max)) ? Number(v.max) : 100;
    if (type === 'slider' || v?.min !== undefined) base.min = min;
    if (type === 'slider' || v?.max !== undefined) base.max = max;
    if (v?.step !== undefined && Number.isFinite(Number(v.step))) base.step = Number(v.step);
    const defNum = Number(v?.defaultValue);
    base.defaultValue = Number.isFinite(defNum) ? defNum : min;
  } else if (type === 'select' || type === 'multiselect') {
    const rawOpts = Array.isArray(v?.options) && v.options.length ? v.options : [{ id: 'option_1', label: 'Option 1', value: '' }];
    base.options = rawOpts.map((o: any, i: number) => ({
      id: String(o?.id || `option_${i + 1}`),
      label: String(o?.label || o?.id || `Option ${i + 1}`),
      value: String(o?.value ?? ''),
    }));
    if (type === 'select') {
      const defStr = String(v?.defaultValue ?? base.options[0].id);
      base.defaultValue = base.options.some((o: any) => o.id === defStr) ? defStr : base.options[0].id;
    } else {
      const validIds = new Set(base.options.map((o: any) => o.id));
      const rawDef = Array.isArray(v?.defaultValue)
        ? v.defaultValue.map(String)
        : typeof v?.defaultValue === 'string' && v.defaultValue.trim()
          ? v.defaultValue.split(',').map((s: string) => s.trim())
          : [];
      base.defaultValue = rawDef.filter((id: string) => validIds.has(id));
      if (typeof v?.separator === 'string') base.separator = v.separator;
    }
  } else {
    base.defaultValue = String(v?.defaultValue ?? '');
    if (type === 'textarea' && Number.isFinite(Number(v?.rows))) base.rows = Math.max(2, Number(v.rows));
  }
  return base;
}

export function resolveSingleVariableRenderedValue(v: any, rawSelection: any): { rendered: string; selectedKeys: Set<string> } {
  const active = rawSelection !== undefined && rawSelection !== '' ? rawSelection : v.defaultValue;
  const selectedKeys = new Set<string>();

  if (v.type === 'switch' || v.type === 'boolean') {
    const isOn = active === 1 || active === '1' || active === true || active === 'true';
    if (isOn) selectedKeys.add('1');
    return { rendered: isOn ? '1' : '0', selectedKeys };
  }
  if (v.type === 'select') {
    const opts = Array.isArray(v.options) ? v.options : [];
    const key = String(active ?? '');
    const found = opts.find((o: any) => o.id === key || o.label === key) || opts[0];
    if (found) {
      selectedKeys.add(String(found.id));
      return { rendered: String(found.value ?? ''), selectedKeys };
    }
    return { rendered: key, selectedKeys };
  }
  if (v.type === 'multiselect') {
    const opts = Array.isArray(v.options) ? v.options : [];
    const chosenList = Array.isArray(active)
      ? active.map(String)
      : typeof active === 'string' && active.trim()
        ? active.split(',').map((s) => s.trim())
        : [];
    for (const k of chosenList) selectedKeys.add(k);
    const pieces = opts
      .filter((o: any) => selectedKeys.has(String(o.id)))
      .map((o: any) => String(o.value ?? ''))
      .filter(Boolean);
    const sep = typeof v.separator === 'string' ? v.separator : '\n\n';
    return { rendered: pieces.join(sep), selectedKeys };
  }
  return { rendered: String(active ?? ''), selectedKeys };
}

export function resolveBlockVariablesPreview(block: any, savedBlockVars: Record<string, any> = {}): string {
  if (!block) return '';
  const vars: any[] = Array.isArray(block.variables) ? block.variables : [];
  const varMap = new Map<string, { def: any; rendered: string; defaultRendered: string; selectedKeys: Set<string> }>();

  for (const v of vars) {
    if (!v?.name) continue;
    const { rendered, selectedKeys } = resolveSingleVariableRenderedValue(v, savedBlockVars[v.name]);
    const { rendered: defaultRendered } = resolveSingleVariableRenderedValue(v, undefined);
    varMap.set(v.name, { def: v, rendered, defaultRendered, selectedKeys });
  }

  let text = String(block.content || '');
  if (!text.trim() && vars.length > 0) {
    text = vars.map((v) => `{{var::${v.name}}}`).join('\n\n');
  }

  text = text.replace(/\{\{\s*(?:var|promptVar|presetVar)::([a-zA-Z0-9_.-]+)::ison::([^}]*)\}\}/gi, (_m, name, keysRaw) => {
    const entry = varMap.get(name);
    if (!entry) return 'false';
    const keys = String(keysRaw || '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    if (!keys.length) return 'true';
    return keys.every((k) => entry.selectedKeys.has(k)) ? 'true' : 'false';
  });

  text = text.replace(/\{\{\s*(?:varDefault|promptVarDefault|presetVarDefault)(?:::|\s+)([a-zA-Z0-9_.-]+)\s*\}\}/gi, (_m, name) => {
    return varMap.get(name)?.defaultRendered ?? '';
  });
  text = text.replace(/\{\{\s*(?:hasVar|hasPromptVar|hasPresetVar)(?:::|\s+)([a-zA-Z0-9_.-]+)\s*\}\}/gi, (_m, name) => {
    return varMap.has(name) ? 'true' : 'false';
  });

  text = text.replace(/\{\{\s*(?:(?:var|promptVar|presetVar|getvar)(?:::|\s+)([a-zA-Z0-9_.-]+)|\.([a-zA-Z0-9_]+))\s*\}\}/gi, (full, n1, n2) => {
    const name = n1 || n2;
    if (!varMap.has(name)) return full;
    return varMap.get(name)!.rendered;
  });

  const isTruthy = (cond: string): boolean => {
    let c = cond.trim();
    let negate = false;
    if (c.startsWith('!')) {
      negate = true;
      c = c.slice(1).trim();
    }
    if (c.startsWith('.') && varMap.has(c.slice(1))) {
      c = varMap.get(c.slice(1))!.rendered;
    }
    const falsy = !c || ['0', 'false', 'null', 'undefined', 'no', 'off'].includes(c.toLowerCase());
    return negate ? falsy : !falsy;
  };

  text = text.replace(/\{\{\s*if(?:::|\s+)([^{}]+?)\}\}([\s\S]*?)\{\{\s*\/if\s*\}\}/gi, (_m, cond, body) => {
    const parts = String(body).split(/\{\{\s*else\s*\}\}/i);
    return isTruthy(cond) ? parts[0] : (parts[1] ?? '');
  });

  return text.trim();
}

const UNSAFE_HTML_TAGS = new Set(['SCRIPT', 'IFRAME', 'FRAME', 'OBJECT', 'EMBED', 'APPLET', 'BASE', 'META', 'LINK']);

function sanitizeHtmlFragment(rawHtml: string): DocumentFragment {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${rawHtml}</body>`, 'text/html');
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  const toRemove: Element[] = [];
  let node = walker.nextNode() as Element | null;
  while (node) {
    if (UNSAFE_HTML_TAGS.has(node.tagName)) {
      toRemove.push(node);
    } else {
      for (const attr of Array.from(node.attributes)) {
        const name = attr.name.toLowerCase();
        const val = attr.value.trim().toLowerCase();
        if (name.startsWith('on') || ((name === 'href' || name === 'src' || name === 'xlink:href') && val.startsWith('javascript:'))) {
          node.removeAttribute(attr.name);
        }
      }
    }
    node = walker.nextNode() as Element | null;
  }
  for (const el of toRemove) el.remove();
  const frag = document.createDocumentFragment();
  while (doc.body.firstChild) {
    frag.appendChild(doc.body.firstChild);
  }
  return frag;
}

function formatInlineProse(escapedText: string): string {
  let out = escapedText;
  out = out.replace(/`([^`\n]+)`/g, '<code class="ps-inline-code">$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="ps-prose-bold">$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em class="ps-prose-italic">*$2*</em>');
  out = out.replace(/(&quot;[^&\n]+?&quot;|“[^”\n]+?”)/g, '<span class="ps-prose-dialogue">$1</span>');
  return out;
}

function renderMarkdownAndHtmlWithPlaceholders(rawText: string): { html: string; islands: string[] } {
  const islands: string[] = [];
  let working = rawText;

  if (/<style\b/i.test(working)) {
    const idx = islands.length;
    islands.push(working);
    return { html: `<div class="ps-html-island-host" data-island-index="${idx}"></div>`, islands };
  }

  const codeBlocks: string[] = [];
  working = working.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const cIdx = codeBlocks.length;
    codeBlocks.push(`<pre class="ps-code-block"${lang ? ` data-lang="${esc(lang)}"` : ''}><code>${esc(code)}</code></pre>`);
    return `\u0000CODEBLOCK_${cIdx}\u0000`;
  });

  const htmlTokens: string[] = [];
  working = working.replace(/<\/?[a-zA-Z][^>]*>/g, (tag) => {
    const tIdx = htmlTokens.length;
    htmlTokens.push(tag);
    return `\u0000HTMLTAG_${tIdx}\u0000`;
  });

  const paragraphs = working.split(/\n{2,}/);
  const formattedParas = paragraphs.map((para) => {
    const trimmed = para.trim();
    if (!trimmed) return '';
    const escaped = esc(trimmed);
    const withInline = formatInlineProse(escaped).replace(/\n/g, '<br>');
    if (/^\u0000HTMLTAG_\d+\u0000/.test(trimmed) || /^\u0000CODEBLOCK_\d+\u0000$/.test(trimmed)) {
      return withInline;
    }
    return `<p>${withInline}</p>`;
  });

  let finalHtml = formattedParas.filter(Boolean).join('\n');
  finalHtml = finalHtml.replace(/\u0000HTMLTAG_(\d+)\u0000/g, (_m, i) => htmlTokens[Number(i)] || '');
  finalHtml = finalHtml.replace(/\u0000CODEBLOCK_(\d+)\u0000/g, (_m, i) => codeBlocks[Number(i)] || '');

  return { html: finalHtml, islands };
}

export function renderChatPreviewInto(container: HTMLElement, rawText: string, asRawText = false): void {
  if (!rawText) {
    container.innerHTML =
      '<div class="ps-empty-state"><div style="font-size:1.5rem;margin-bottom:6px">💬</div><strong>Ready to Test</strong><p class="ps-muted" style="margin-top:4px">Pick a Context Chat on the left and click <strong>▶ Generate Reply</strong> to preview your preset in a live chat bubble.</p></div>';
    return;
  }
  if (asRawText) {
    const pre = document.createElement('pre');
    pre.className = 'ps-result';
    pre.style.margin = '0';
    pre.textContent = rawText;
    container.replaceChildren(pre);
    return;
  }

  const { html, islands } = renderMarkdownAndHtmlWithPlaceholders(rawText);
  const frag = sanitizeHtmlFragment(html);
  const wrap = document.createElement('div');
  wrap.className = 'ps-chat-prose';
  wrap.appendChild(frag);

  wrap.querySelectorAll<HTMLElement>('.ps-html-island-host[data-island-index]').forEach((hostEl) => {
    const idx = Number(hostEl.dataset.islandIndex);
    const islandSource = islands[idx];
    if (!islandSource) return;
    const shadow = hostEl.shadowRoot || hostEl.attachShadow({ mode: 'open' });
    const baseReset = document.createElement('style');
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

export function computeDraftFingerprint(d: any): string {
  if (!d) return '';
  return JSON.stringify({
    name: d.name || '',
    provider: d.provider || 'loom',
    engine: d.engine || 'classic',
    prompt_order: d.prompt_order || [],
    parameters: d.parameters || {},
    prompts: d.prompts || {},
    metadata: d.metadata || {},
  });
}

export function ensureUniqueBlockIds(d: any): any {
  if (!d || !Array.isArray(d.prompt_order)) return d;
  const seen = new Set<string>();
  for (const blk of d.prompt_order) {
    if (!blk.id || seen.has(blk.id)) blk.id = uid();
    seen.add(blk.id);
  }
  return d;
}

/**
 * Accurately diagnoses Prompt Variables (`{{var::name}}`, `{{promptVar::name}}`, `{{presetVar::name}}`)
 * without falsely flagging local scratchpad variables (`{{setvar::m_roll::...}}` / `{{getvar::m_roll}}` / `{{.m_roll}}`).
 */
export function buildPresetVariableDiagnostics(blocks: any[]) {
  const defsByName = new Map<string, Array<{ blockId: string; blockName: string; def: any }>>();
  const refsByName = new Map<string, Array<{ blockId: string; blockName: string }>>();
  const defCountByBlock = new Map<string, number>();
  const refCountByBlock = new Map<string, number>();

  // 1. Collect all local scratchpad variables written via setvar / addvar / incvar / decvar / .var = / let / foreach
  const writtenLocalVars = new Set<string>(['item', 'msg']);
  const localWriteRe =
    /\{\{\s*(?:(?:setvar|addvar|incvar|decvar|setvarkey|addvarkey|counter|toggle)(?:::|\s+)([a-zA-Z0-9_.-]+)|\.([a-zA-Z0-9_]+)\s*(?:[+-]?=|\+\+|--)|(?:let|withVar|scope)(?:::|\s+)([a-zA-Z0-9_.-]+))/gi;

  for (const blk of blocks || []) {
    const text = typeof blk?.content === 'string' ? blk.content : '';
    if (!text) continue;
    let wm: RegExpExecArray | null;
    while ((wm = localWriteRe.exec(text)) !== null) {
      const k = wm[1] || wm[2] || wm[3];
      if (k) writtenLocalVars.add(k);
    }
  }

  // 2. Collect Prompt Variable definitions on each block
  for (const blk of blocks || []) {
    const vars = Array.isArray(blk.variables) ? blk.variables : [];
    defCountByBlock.set(blk.id, vars.length);
    for (const v of vars) {
      if (!v?.name) continue;
      const list = defsByName.get(v.name) || [];
      list.push({ blockId: blk.id, blockName: blk.name || 'Untitled', def: v });
      defsByName.set(v.name, list);
    }
  }

  // 3. Collect explicit Prompt Variable references ({{var::...}}, {{promptVar::...}}, {{presetVar::...}})
  // plus {{getvar::x}} / {{.x}} ONLY if x is a defined Prompt Variable on the preset
  const explicitPromptVarRe =
    /\{\{\s*(?:var|promptVar|presetVar|hasPromptVar|hasPresetVar|varDefault|promptVarDefault|presetVarDefault)(?:\s*::\s*|\s+)([a-zA-Z0-9_.-]+)/gi;
  const generalLocalReadRe = /\{\{\s*(?:getvar(?:\s*::\s*|\s+)([a-zA-Z0-9_.-]+)|\.([a-zA-Z0-9_]+)\s*\}\})/gi;

  for (const blk of blocks || []) {
    const text = blk.content || '';
    const blockRefSet = new Set<string>();
    let m: RegExpExecArray | null;

    while ((m = explicitPromptVarRe.exec(text)) !== null) {
      const name = m[1];
      if (!name || writtenLocalVars.has(name)) continue;
      blockRefSet.add(name);
      const rList = refsByName.get(name) || [];
      if (!rList.some((x) => x.blockId === blk.id)) {
        rList.push({ blockId: blk.id, blockName: blk.name || 'Untitled' });
        refsByName.set(name, rList);
      }
    }

    while ((m = generalLocalReadRe.exec(text)) !== null) {
      const name = m[1] || m[2];
      if (!name) continue;
      // Only count getvar/.var as a Prompt Variable reference if it matches a defined Prompt Variable
      if (defsByName.has(name)) {
        blockRefSet.add(name);
        const rList = refsByName.get(name) || [];
        if (!rList.some((x) => x.blockId === blk.id)) {
          rList.push({ blockId: blk.id, blockName: blk.name || 'Untitled' });
          refsByName.set(name, rList);
        }
      }
    }

    refCountByBlock.set(blk.id, blockRefSet.size);
  }

  const missing: Array<{ name: string; refs: Array<{ blockId: string; blockName: string }> }> = [];
  const duplicates: Array<{ name: string; defs: Array<{ blockId: string; blockName: string; def: any }> }> = [];
  const unused: Array<{ name: string; defs: Array<{ blockId: string; blockName: string; def: any }> }> = [];

  for (const [name, refs] of refsByName.entries()) {
    if (!defsByName.has(name) && !writtenLocalVars.has(name)) {
      missing.push({ name, refs });
    }
  }
  for (const [name, defs] of defsByName.entries()) {
    if (defs.length > 1) duplicates.push({ name, defs });
    if (!refsByName.has(name)) unused.push({ name, defs });
  }

  return { defCountByBlock, refCountByBlock, missing, duplicates, unused };
}

export function cloneBlocksForHost(blocks: any[]): any[] {
  return (blocks || []).map((block) => sanitizeBlockForLoom(block));
}

export function sanitizeBlockForLoom(b: any): any {
  const cleanBlock: any = {
    id: String(b.id || uid()),
    name: String(b.name || 'Untitled'),
    content: String(b.content || ''),
    role: ['system', 'user', 'assistant', 'user_append', 'assistant_append'].includes(b.role) ? b.role : 'system',
    enabled: Boolean(b.enabled),
    position: ['pre_history', 'post_history', 'in_history'].includes(b.position) ? b.position : 'pre_history',
    depth: Math.max(0, Number(b.depth) || 0),
    marker: b.marker ? String(b.marker) : null,
    isLocked: Boolean(b.isLocked),
    color: blockColor(b),
    injectionTrigger: Array.isArray(b.injectionTrigger) ? b.injectionTrigger.map(String) : [],
    group: b.group ? String(b.group) : null,
  };
  if (b.categoryMode === 'radio' || b.categoryMode === 'checkbox') cleanBlock.categoryMode = b.categoryMode;
  if (Array.isArray(b.variables)) cleanBlock.variables = b.variables.map((v: any) => normalizeVariableDef(v, false));
  return cleanBlock;
}

function blockColor(b: any): string | null {
  return b.color ? String(b.color) : null;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {}
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    return true;
  } catch (_) {
    return false;
  }
}

export function exportJsonFile(filename: string, dataObj: unknown): void {
  const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
