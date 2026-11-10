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

export function buildPresetVariableDiagnostics(blocks: any[]) {
  const defsByName = new Map<string, Array<{ blockId: string; blockName: string; def: any }>>();
  const refsByName = new Map<string, Array<{ blockId: string; blockName: string }>>();
  const defCountByBlock = new Map<string, number>();
  const refCountByBlock = new Map<string, number>();
  const varRe = /\{\{\s*(?:(?:var|promptVar|presetVar|getvar|hasPromptVar|hasPresetVar|varDefault|promptVarDefault|presetVarDefault)(?:\s*::\s*|\s+)|\.([a-zA-Z0-9_]+)|([a-zA-Z0-9_.-]+))/gi;
  const explicitVarRe = /\{\{\s*(?:(?:var|promptVar|presetVar|getvar|hasPromptVar|hasPresetVar|varDefault|promptVarDefault|presetVarDefault)(?:\s*::\s*|\s+)([a-zA-Z0-9_.-]+)|\.([a-zA-Z0-9_]+)\s*\}\})/gi;

  for (const blk of blocks || []) {
    const vars = Array.isArray(blk.variables) ? blk.variables : [];
    defCountByBlock.set(blk.id, vars.length);
    for (const v of vars) {
      if (!v?.name) continue;
      const list = defsByName.get(v.name) || [];
      list.push({ blockId: blk.id, blockName: blk.name || 'Untitled', def: v });
      defsByName.set(v.name, list);
    }
    const text = blk.content || '';
    const blockRefSet = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = explicitVarRe.exec(text)) !== null) {
      const name = m[1] || m[2];
      if (!name) continue;
      blockRefSet.add(name);
      const rList = refsByName.get(name) || [];
      if (!rList.some((x) => x.blockId === blk.id)) {
        rList.push({ blockId: blk.id, blockName: blk.name || 'Untitled' });
        refsByName.set(name, rList);
      }
    }
    void varRe;
    refCountByBlock.set(blk.id, blockRefSet.size);
  }

  const missing: Array<{ name: string; refs: Array<{ blockId: string; blockName: string }> }> = [];
  const duplicates: Array<{ name: string; defs: Array<{ blockId: string; blockName: string; def: any }> }> = [];
  const unused: Array<{ name: string; defs: Array<{ blockId: string; blockName: string; def: any }> }> = [];

  for (const [name, refs] of refsByName.entries()) {
    if (!defsByName.has(name)) missing.push({ name, refs });
  }
  for (const [name, defs] of defsByName.entries()) {
    if (defs.length > 1) duplicates.push({ name, defs });
    if (!refsByName.has(name)) unused.push({ name, defs });
  }

  // Generic local {{setvar}} / {{getvar}} topology across all blocks in the preset
  const allReadLocalVars = new Set<string>();
  const setVarsByBlock = new Map<string, string[]>();
  const getvarRe = /\{\{\s*(?:getvar|var)(?:::|\s+)([a-zA-Z0-9_.-]+)\s*\}\}/gi;
  const dotReadRe = /\{\{\s*\.([a-zA-Z0-9_]+)\s*\}\}/g;
  const setvarRe = /\{\{\s*setvar(?:::|\s+)([a-zA-Z0-9_.-]+)(?:::|\s*\}\})/gi;

  for (const blk of blocks || []) {
    const text = typeof blk?.content === 'string' ? blk.content : '';
    if (!text) continue;
    let m: RegExpExecArray | null;
    while ((m = getvarRe.exec(text)) !== null) allReadLocalVars.add(m[1]);
    while ((m = dotReadRe.exec(text)) !== null) allReadLocalVars.add(m[1]);
    const written: string[] = [];
    while ((m = setvarRe.exec(text)) !== null) {
      if (!written.includes(m[1])) written.push(m[1]);
    }
    if (written.length) setVarsByBlock.set(blk.id, written);
  }

  return { defCountByBlock, refCountByBlock, missing, duplicates, unused, setVarsByBlock, allReadLocalVars };
}

export function cloneBlocksForHost(blocks: any[]): any[] {
  return (blocks || []).map((block) => ({
    id: String(block.id || uid()),
    name: String(block.name ?? ''),
    content: String(block.content ?? ''),
    role: ['system', 'user', 'assistant', 'user_append', 'assistant_append'].includes(block.role) ? block.role : 'system',
    enabled: Boolean(block.enabled),
    position: ['pre_history', 'post_history', 'in_history'].includes(block.position) ? block.position : 'pre_history',
    depth: Math.max(0, Number(block.depth) || 0),
    marker: block.marker ? String(block.marker) : null,
    isLocked: Boolean(block.isLocked),
    color: block.color ? String(block.color) : null,
    injectionTrigger: Array.isArray(block.injectionTrigger) ? [...block.injectionTrigger] : [],
    ...(Array.isArray(block.characterTagTrigger) ? { characterTagTrigger: [...block.characterTagTrigger] } : {}),
    group: block.group ? String(block.group) : null,
    categoryMode: block.categoryMode === 'radio' || block.categoryMode === 'checkbox' ? block.categoryMode : null,
    ...(Array.isArray(block.variables)
      ? {
          variables: block.variables.map(normalizeVariableDef),
        }
      : {}),
  }));
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
    color: b.color ? String(b.color) : null,
    injectionTrigger: Array.isArray(b.injectionTrigger) ? b.injectionTrigger.map(String) : [],
    group: b.group ? String(b.group) : null,
  };
  if (b.categoryMode === 'radio' || b.categoryMode === 'checkbox') cleanBlock.categoryMode = b.categoryMode;
  if (Array.isArray(b.variables)) cleanBlock.variables = b.variables.map((v: any) => normalizeVariableDef(v, false));
  return cleanBlock;
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
