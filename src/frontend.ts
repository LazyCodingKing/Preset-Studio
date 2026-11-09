import { STUDIO_BASE_CSS, STUDIO_POLISH_CSS } from './studio-styles.js';
import {
  esc,
  uid,
  selectOptions,
  freshDraft,
  computeDraftFingerprint,
  ensureUniqueBlockIds,
  sanitizeBlockForLoom,
  exportJsonFile,
} from './studio-core.js';
import {
  closeModalRef,
  askConfirm,
  promptTemplateName,
  openFindReplaceDialog,
  openTemplatePickerModal,
  openBlockContextMenu,
  type ModalRef,
} from './studio-dialogs.js';
import {
  renderArchitectTab,
  renderVariablesTab,
  renderSamplersTab,
  renderRemixTab,
  renderTestTab,
  renderStudioSettingsTab,
} from './studio-views.js';
import {
  syncSaveWithNativePresetEditor,
  mountPresetEditorLauncher,
  bindDragAndDropListeners,
} from './studio-bridge.js';

export function setup(ctx: any) {
  const tab = ctx.ui.registerDrawerTab({
    id: 'studio',
    title: 'Preset Studio',
    shortName: 'Studio',
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 8h7M7 12h4M7 16h5"/><path d="m16 10 .7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></svg>',
    description: 'Create, edit, remix, and test Loom presets',
    keywords: ['loom', 'prompt', 'test', 'preset', 'studio', 'variables', 'xray'],
  });

  const style = ctx.dom.addStyle(STUDIO_BASE_CSS);
  const polish = ctx.dom.addStyle(STUDIO_POLISH_CSS);

  const root = document.createElement('div');
  root.className = 'ps-root';
  tab.root.appendChild(root);

  let mount: any = null;
  let full = false;
  let previousFocus: HTMLElement | null = null;
  try {
    mount = ctx.ui.mountApp({ className: 'ps-mount', position: 'app-overlay' });
    mount.setVisible(false);
  } catch (_) {}

  const state: any = {
    presets: [],
    chats: [],
    connections: [],
    permissions: { presets: true, chats: true, generation: true, app_manipulation: true },
    draft: null,
    recovery: null,
    selected: 0,
    view: 'blocks',
    editorMode: 'studio',
    blockFilter: 'all',
    blockSearch: '',
    collapsedCategories: [],
    savedFingerprint: '',
    mobileDetailOpen: false,
    showMacroPane: false,
    macroPreview: null,
    macroBusy: false,
    tokenCounts: {},
    totalDraftTokens: 0,
    tokenizerName: '',
    historyPast: [],
    historyFuture: [],
    chatId: '',
    connectionId: '',
    generationType: 'normal',
    custom: '',
    result: '',
    reasoning: '',
    lastUsage: null,
    runs: [],
    compareA: 0,
    compareB: 1,
    assembled: null,
    breakdownFilter: 'all',
    breakdownSearch: '',
    xrayExpanded: true,
    busy: false,
    notice: '',
    activeRun: null,
    dirty: false,
    importPreset: '',
    importBlocks: [],
    importValues: {},
    selectedImports: [],
    expandedImports: [],
    basket: [],
    templateName: '',
    templates: [],
    quickTemplateIndex: '0',
    quickMacroSnippet: '{{char}}',
    translationLanguage: 'English',
    translationConnection: '',
    translation: null,
    sourceTranslation: null,
    translating: false,
    selectedDraft: [],
    batchTranslation: null,
  };

  const pending = new Map<string, any>();
  const mountedHandles = new Set<{ destroy?: () => void }>();
  const modalRef: ModalRef = { current: null };
  let timer: any = null;
  let tokenTimer: any = null;
  let longPressTimer: any = null;
  let destroyed = false;
  let saveChain = Promise.resolve();

  function destroyMounted() {
    for (const h of mountedHandles) {
      try { h.destroy?.(); } catch (_) {}
    }
    mountedHandles.clear();
  }

  function trackMount(fn: () => any) {
    try {
      const h = fn();
      if (h && typeof h.destroy === 'function') mountedHandles.add(h);
      return h;
    } catch (_) {
      return null;
    }
  }

  const unsubKb = ctx.ui?.events?.onKeyboardChange?.((kb: any) => {
    root.style.setProperty('--ps-kb-inset', kb?.visible ? `${kb.insetBottom || 0}px` : '0px');
  });

  function request(action: string, payload: Record<string, any> = {}, handlers: Record<string, any> = {}): Promise<any> {
    const requestId = uid();
    return new Promise((resolve, reject) => {
      pending.set(requestId, { resolve, reject, ...handlers });
      ctx.sendToBackend({ action, requestId, ...payload });
    });
  }

  function setFull(value: boolean) {
    if (value && !mount) {
      state.notice = 'Full window requires the app_manipulation permission. Continuing in the drawer.';
      render();
      return;
    }
    full = value;
    if (full) {
      previousFocus = document.activeElement as HTMLElement | null;
      mount.root.appendChild(root);
      mount.setVisible(true);
      root.classList.add('ps-full');
      if (!ctx.ui?.presetEditor?.getState?.()?.open) {
        request('open-native-presets-tab').catch(() => {});
      }
    } else {
      tab.root.appendChild(root);
      mount?.setVisible(false);
      root.classList.remove('ps-full');
      previousFocus?.focus?.();
    }
    render();
    if (full) root.querySelector<HTMLElement>('[data-action="close-window"]')?.focus();
  }

  const unsub = ctx.onBackendMessage((msg: any) => {
    if (!msg) return;
    if (msg.type === 'permissions' && msg.permissions) {
      state.permissions = { ...state.permissions, ...msg.permissions };
      render();
      return;
    }
    if (msg.type === 'command') {
      if (msg.chatId) state.chatId = msg.chatId;
      if (msg.commandId === 'open-studio-full') setFull(true);
      else if (msg.commandId === 'test-studio-chat') {
        if (!state.draft) state.draft = freshDraft();
        state.view = 'test';
        if (mount) setFull(true);
        else { tab.activate?.(); render(); }
      }
      return;
    }
    const p = pending.get(msg.requestId);
    if (!p) return;
    if (msg.type === 'token') { p.onToken?.(msg.token); return; }
    if (msg.type === 'reasoning') { p.onReasoning?.(msg.token); return; }
    if (msg.type === 'assembled') { p.onAssembled?.(msg.data); return; }
    if (msg.type === 'result' || msg.type === 'error') {
      pending.delete(msg.requestId);
      msg.type === 'error' ? p.reject(new Error(msg.error)) : p.resolve(msg.data);
    }
  });

  function pushHistory(snapshot: any) {
    if (!snapshot) return;
    const serialized = JSON.stringify(snapshot);
    if (state.historyPast.length && JSON.stringify(state.historyPast[state.historyPast.length - 1]) === serialized) return;
    state.historyPast.push(structuredClone(snapshot));
    if (state.historyPast.length > 20) state.historyPast.shift();
    state.historyFuture = [];
  }

  function scheduleTokenCount() {
    clearTimeout(tokenTimer);
    tokenTimer = setTimeout(async () => {
      if (destroyed || !state.draft?.prompt_order?.length) return;
      const blocks = state.draft.prompt_order;
      const texts = blocks.map((b: any) => b.content || '');
      try {
        const res = await request('count-tokens', { texts, connectionId: state.connectionId });
        if (destroyed || !res?.counts) return;
        const map: Record<string, number> = {};
        let sum = 0;
        blocks.forEach((b: any, idx: number) => {
          const c = Number(res.counts[idx]) || 0;
          map[b.id] = c;
          if (b.enabled && b.marker !== 'category') sum += c;
        });
        state.tokenCounts = map;
        state.totalDraftTokens = sum;
        state.tokenizerName = res.tokenizerName || '';
        const totalBadge = root.querySelector('[data-total-tokens]');
        if (totalBadge) totalBadge.textContent = `~${sum.toLocaleString()} block tokens`;
        blocks.forEach((b: any) => {
          const pill = root.querySelector(`[data-token-id="${CSS.escape(b.id)}"]`);
          if (pill) pill.textContent = b.content?.trim() && map[b.id] ? `· ${map[b.id]}t` : '';
        });
      } catch (_) {}
    }, 420);
  }

  function persist(skipHistory = false) {
    if (!skipHistory && state.draft) pushHistory(state.draft);
    state.dirty = state.savedFingerprint ? computeDraftFingerprint(state.draft) !== state.savedFingerprint : true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const draft = structuredClone(state.draft);
      state.recovery = draft;
      saveChain = saveChain
        .catch(() => {})
        .then(() => request('draft', { draft }))
        .catch((e) => {
          state.notice = 'Could not recover draft: ' + e.message;
          render();
        });
    }, 450);
    scheduleTokenCount();
  }

  function undo() {
    if (state.historyPast.length < 2) return;
    const current = state.historyPast.pop();
    state.historyFuture.push(current);
    state.draft = structuredClone(state.historyPast[state.historyPast.length - 1]);
    state.selected = Math.min(state.selected, Math.max(0, state.draft.prompt_order.length - 1));
    persist(true);
    render();
  }

  function redo() {
    if (!state.historyFuture.length) return;
    const next = state.historyFuture.pop();
    state.historyPast.push(structuredClone(next));
    state.draft = structuredClone(next);
    state.selected = Math.min(state.selected, Math.max(0, state.draft.prompt_order.length - 1));
    persist(true);
    render();
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && full) {
      if (root.querySelector('dialog[open]')) return;
      e.stopPropagation();
      setFull(false);
      return;
    }
    if (!root.contains(document.activeElement)) return;
    const tag = (document.activeElement as HTMLElement)?.tagName;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault();
      e.shiftKey ? redo() : undo();
    }
  };
  document.addEventListener('keydown', onKey);

  function moveBlock(fromIndex: number, toIndex: number) {
    const d = state.draft;
    if (!d?.prompt_order?.length) return;
    const len = d.prompt_order.length;
    if (fromIndex < 0 || fromIndex >= len || toIndex < 0 || toIndex >= len || fromIndex === toIndex) return;
    const selectedId = d.prompt_order[state.selected]?.id;
    const [moved] = d.prompt_order.splice(fromIndex, 1);
    d.prompt_order.splice(toIndex, 0, moved);
    const nextSelected = selectedId ? d.prompt_order.findIndex((b: any) => b.id === selectedId) : toIndex;
    state.selected = nextSelected >= 0 ? nextSelected : toIndex;
    persist();
    render();
  }

  function insertEntries(entries: any[]) {
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

  function insertTextAtPromptCursor(snippet: string) {
    const b = state.draft?.prompt_order?.[state.selected];
    if (!b || b.isLocked || !snippet) return;
    const ta = root.querySelector<HTMLTextAreaElement>('textarea[data-block="content"]');
    if (ta) {
      const start = typeof ta.selectionStart === 'number' ? ta.selectionStart : (b.content || '').length;
      const end = typeof ta.selectionEnd === 'number' ? ta.selectionEnd : start;
      const scrollTop = ta.scrollTop;
      const cur = b.content || '';
      b.content = cur.slice(0, start) + snippet + cur.slice(end);
      ta.value = b.content;
      const nextPos = start + snippet.length;
      ta.focus({ preventScroll: true });
      ta.setSelectionRange(nextPos, nextPos);
      ta.scrollTop = scrollTop;
      persist();
      if (state.showMacroPane) void runMacroPreview(b);
    } else {
      b.content = (b.content || '') + snippet;
      persist();
      render();
    }
  }

  async function importJsonFile(mode: 'preset' | 'template') {
    if (!ctx.uploads?.pickFile) throw new Error('File picker is not available in this host.');
    const files = await ctx.uploads.pickFile({
      accept: ['.json', 'application/json'],
      multiple: false,
      maxSizeBytes: 5 * 1024 * 1024,
    });
    if (!files?.length) return;
    const text = new TextDecoder().decode(files[0].bytes);
    const parsed = JSON.parse(text);
    if (mode === 'preset') {
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.prompt_order)) {
        throw new Error('JSON file is not a valid preset (missing prompt_order array).');
      }
      if (state.dirty && !(await askConfirm(root, modalRef, 'Replace Draft?', 'Replace your current unsaved draft with the imported JSON preset?', 'warning', 'Replace'))) return;
      delete parsed.id;
      state.draft = ensureUniqueBlockIds({
        name: String(parsed.name || files[0].name.replace(/\.json$/i, '') || 'Imported Preset'),
        provider: parsed.provider || 'loom',
        engine: parsed.engine || 'classic',
        parameters: parsed.parameters || {},
        prompts: parsed.prompts || {},
        metadata: parsed.metadata || {},
        prompt_order: parsed.prompt_order,
      });
      state.savedFingerprint = '';
      state.selected = 0;
      persist();
      await request('toast', { kind: 'success', message: `Imported preset "${state.draft.name}"` });
    } else {
      const entries = Array.isArray(parsed?.entries) ? parsed.entries : Array.isArray(parsed) ? parsed.map((b) => ({ block: b, source: 'Imported' })) : null;
      if (!entries?.length) throw new Error('JSON file does not contain template entries.');
      const name = String(parsed.name || files[0].name.replace(/\.json$/i, '') || 'Imported Template');
      state.templates = await request('template-save', { template: { id: uid(), name, entries } });
    }
  }

  async function deleteBlockAtIndex(index: number) {
    const d = state.draft;
    const b = d?.prompt_order?.[index];
    if (!b) return;
    const msg = b.isLocked
      ? `“${b.name || 'Untitled'}” is currently locked (🔒). Delete it from your draft anyway?`
      : `Delete “${b.name || 'Untitled'}” from your draft?`;
    if (!(await askConfirm(root, modalRef, 'Delete Block?', msg, 'danger', 'Delete Block'))) return;
    const removedId = b.id;
    d.prompt_order.splice(index, 1);
    state.selectedDraft = state.selectedDraft.filter((id: string) => id !== removedId);
    if (d.metadata?.promptVariables) delete d.metadata.promptVariables[removedId];
    state.selected = Math.max(0, Math.min(state.selected >= index ? state.selected - (state.selected > index ? 1 : 0) : state.selected, d.prompt_order.length - 1));
    state.notice = `Deleted “${b.name || 'Untitled'}”.`;
    persist();
    render();
  }

  async function openFullTextEditorForBlock(b: any) {
    if (!b || b.isLocked) return;
    const res = await request('text-editor', {
      title: `Prompt Block: ${b.name || 'Untitled'}`,
      value: b.content || '',
      placeholder: 'Write prompt instructions and {{macros}}…',
    });
    if (res && !res.cancelled && typeof res.text === 'string') {
      b.content = res.text;
      persist();
      if (state.showMacroPane) await runMacroPreview(b);
      render();
    }
  }

  async function runMacroPreview(b: any) {
    if (!b) return;
    state.macroBusy = true;
    render();
    try {
      const res = await request('macro-preview', { template: b.content || '', chatId: state.chatId });
      state.macroPreview = { blockId: b.id, text: res.text || '', diagnostics: res.diagnostics || [] };
    } catch (e: any) {
      state.macroPreview = { blockId: b.id, text: '', diagnostics: [{ message: e.message, offset: 0, length: 0 }] };
    } finally {
      state.macroBusy = false;
      render();
    }
  }

  async function translateFields(block: any, scope: string) {
    const original: Record<string, string> = { name: block.name || '', content: block.content || '' };
    const fields = scope === 'both' ? ['name', 'content'] : [scope];
    const result: any = { original };
    for (const field of fields) {
      if (!original[field].trim()) throw new Error(field === 'name' ? 'This block has no title to translate.' : 'This block has no prompt text to translate.');
      const translated = await request('translate', { text: original[field], language: state.translationLanguage, connectionId: state.translationConnection });
      result[field] = translated.content;
    }
    return result;
  }

  function applyTranslatedFields(block: any, t: any) {
    if ((t.name !== undefined && block.name !== t.original.name) || (t.content !== undefined && block.content !== t.original.content)) {
      throw new Error('The original block changed. Translate it again.');
    }
    if (t.name !== undefined) block.name = t.name;
    if (t.content !== undefined) block.content = t.content;
  }

  function mountInteractiveWidgets() {
    const d = state.draft;
    if (!d || !ctx.components) return;
    if (state.view === 'blocks' && state.editorMode === 'native') {
      const slot = root.querySelector<HTMLElement>('#ps-native-loom-slot');
      if (slot && ctx.components.mountLoomBlockEditor) {
        trackMount(() =>
          ctx.components.mountLoomBlockEditor(slot, {
            value: {
              blocks: d.prompt_order.map(sanitizeBlockForLoom),
              promptVariableValues: structuredClone(d.metadata?.promptVariables || {}),
            },
            compact: !full,
            onChange: (next: any) => {
              d.prompt_order = next.blocks;
              d.metadata = d.metadata || {};
              d.metadata.promptVariables = next.promptVariableValues || {};
              persist();
            },
          }),
        );
      }
    }
    if (state.view === 'settings' && ctx.components.mountRangeSlider) {
      const specs = [
        { key: 'temperature', label: 'Temperature', min: 0, max: 2, step: 0.05, def: 0.8, decimals: 2 },
        { key: 'top_p', label: 'Top-P (Nucleus)', min: 0, max: 1, step: 0.01, def: 0.95, decimals: 2 },
        { key: 'min_p', label: 'Min-P', min: 0, max: 1, step: 0.01, def: 0, decimals: 2 },
        { key: 'frequency_penalty', label: 'Frequency Penalty', min: -2, max: 2, step: 0.05, def: 0, decimals: 2 },
        { key: 'presence_penalty', label: 'Presence Penalty', min: -2, max: 2, step: 0.05, def: 0, decimals: 2 },
        { key: 'repetition_penalty', label: 'Repetition Penalty', min: 1, max: 2, step: 0.01, def: 1, decimals: 2 },
      ];
      for (const s of specs) {
        const slot = root.querySelector<HTMLElement>(`[data-slider-slot="${s.key}"]`);
        if (!slot) continue;
        slot.innerHTML = '';
        trackMount(() =>
          ctx.components.mountRangeSlider(slot, {
            label: s.label,
            min: s.min,
            max: s.max,
            step: s.step,
            value: Number(d.parameters?.[s.key] ?? s.def),
            format: { decimals: s.decimals },
            onCommit: (val: number) => {
              d.parameters = d.parameters || {};
              d.parameters[s.key] = val;
              persist();
            },
          }),
        );
      }
    }
  }

  function render() {
    if (destroyed) return;
    const savedRootScroll = root.scrollTop;
    const savedScrollMap = new Map<string, { top: number; left: number }>();
    root.querySelectorAll<HTMLElement>('[data-scroll-id]').forEach((el) => {
      if (el.dataset.scrollId) savedScrollMap.set(el.dataset.scrollId, { top: el.scrollTop, left: el.scrollLeft });
    });
    const openDetailsIds = new Set<string>();
    root.querySelectorAll<HTMLDetailsElement>('details[data-details-id]').forEach((el) => {
      if (el.open && el.dataset.detailsId) openDetailsIds.add(el.dataset.detailsId);
    });

    destroyMounted();
    const d = state.draft;
    root.innerHTML = `<div class="ps-shell"><header class="ps-masthead"><div class="ps-brand"><div class="ps-mark" aria-hidden="true">✳</div><div><div class="ps-kicker">Lumiverse Prompt IDE</div><h2>Preset Studio ${d ? `· <span style="color:var(--ps-accent)">${esc(d.name)}</span>` : ''}</h2></div></div><div class="ps-actions">${d ? `<span class="ps-pill ps-pill-accent" data-total-tokens>~${state.totalDraftTokens.toLocaleString()} block tokens</span><button class="ps-btn-sm" data-action="undo" ${state.historyPast.length < 2 ? 'disabled' : ''} title="Undo (Ctrl+Z)">↶ Undo</button><button class="ps-btn-sm" data-action="redo" ${!state.historyFuture.length ? 'disabled' : ''} title="Redo (Ctrl+Shift+Z)">↷ Redo</button>` : ''}${full ? '<button data-action="close-window">✕ Exit Full Window</button>' : '<button class="ps-primary" data-action="full-window">⤢ Full Window</button>'}<button class="ps-btn-sm" data-action="refresh">↻ Refresh</button></div></header>${state.notice ? `<div class="ps-notice" role="status">${esc(state.notice)}</div>` : ''}<section class="ps-panel ps-between" aria-label="Preset library"><div class="ps-row" style="flex:1"><label style="max-width:340px">Preset Library<select data-action="open"><option value="">Choose an existing preset…</option>${selectOptions(state.presets, d?.id, (x: any) => x.name)}</select></label><button data-action="new">＋ New</button><button data-action="restore" ${state.recovery ? '' : 'disabled'}>Recover Draft</button><button data-action="import-preset-json">📥 Import JSON</button>${d ? '<button data-action="export-preset-json">📤 Export JSON</button>' : ''}</div>${d ? `<div class="ps-actions"><span class="ps-pill ${state.dirty ? 'ps-pill-warn' : 'ps-pill-ok'}">${state.dirty ? '● Unsaved draft' : '✓ Saved'}</span><button data-action="save-copy" ${state.busy ? 'disabled' : ''}>Save Copy</button><button class="ps-primary" data-action="save" ${state.busy ? 'disabled' : ''}>${d.id ? 'Save Changes' : 'Create Preset'}</button></div>` : ''}</section>${d ? `<nav class="ps-tabs" aria-label="Studio tabs">${[
      ['blocks', '01', 'Prompt Architect'],
      ['variables', '02', 'Variables & Inputs'],
      ['settings', '03', 'Samplers & Behavior'],
      ['remix', '04', 'Remix & Templates'],
      ['test', '05', 'Test Lab & X-Ray'],
      ['studio-settings', '06', 'Translation & Studio'],
    ].map(([id, step, label]) => `<button data-action="view" data-view="${id}" aria-pressed="${state.view === id}"><span class="ps-step">${step}</span>${label}</button>`).join('')}</nav>${state.view === 'blocks' ? renderArchitectTab(ctx, state) : state.view === 'variables' ? renderVariablesTab(state) : state.view === 'settings' ? renderSamplersTab(state) : state.view === 'remix' ? renderRemixTab(state) : state.view === 'test' ? renderTestTab(state) : renderStudioSettingsTab(state)}` : '<div class="ps-panel" style="text-align:center;padding:36px 16px"><h3>Welcome to Preset Studio</h3><p class="ps-muted" style="margin:8px 0 16px">Open an existing preset from the dropdown above, import a JSON preset, or start a fresh Loom preset.</p><button class="ps-primary" data-action="new">＋ Create New Preset</button></div>'}</div>`;
    mountInteractiveWidgets();

    openDetailsIds.forEach((id) => {
      const det = root.querySelector<HTMLDetailsElement>(`details[data-details-id="${CSS.escape(id)}"]`);
      if (det) det.open = true;
    });
    savedScrollMap.forEach((pos, id) => {
      const el = root.querySelector<HTMLElement>(`[data-scroll-id="${CSS.escape(id)}"]`);
      if (el) {
        el.scrollTop = pos.top;
        el.scrollLeft = pos.left;
      }
    });
    root.scrollTop = savedRootScroll;
  }

  const cleanupLauncher = mountPresetEditorLauncher(ctx, state, setFull, Boolean(mount), tab, scheduleTokenCount, render);
  bindDragAndDropListeners(root, state, moveBlock, () => clearTimeout(longPressTimer));

  async function refresh() {
    const data = await request('load');
    state.presets = data.presets || [];
    state.chats = data.chats || [];
    state.connections = data.connections || [];
    state.recovery = data.draft;
    if (data.permissions) state.permissions = { ...state.permissions, ...data.permissions };
    if (!state.preferencesLoaded) {
      state.translationLanguage = data.preferences?.translationLanguage || 'English';
      state.translationConnection = data.preferences?.translationConnection || '';
      state.preferencesLoaded = true;
    }
    state.templates = Array.isArray(data.templates) ? data.templates : [];
    if (!state.chatId) state.chatId = data.active?.id || '';
    render();
  }

  async function saveEntriesAsTemplate(entries: any[], suggestedName = '') {
    if (!entries.length) throw new Error('Select at least one block first.');
    const name = await promptTemplateName(root, modalRef, suggestedName, entries.length);
    if (!name) return;
    state.templates = await request('template-save', {
      template: { id: uid(), name, entries: structuredClone(entries) },
    });
    state.notice = `Saved template “${name}” (${entries.length} block${entries.length === 1 ? '' : 's'}).`;
    render();
  }

  const contextMenuCallbacks = {
    openFullTextEditorForBlock,
    runMacroPreview,
    moveBlock,
    deleteBlockAtIndex,
    saveEntriesAsTemplate,
    persist,
    render,
  };

  root.addEventListener('contextmenu', (e) => {
    const row = (e.target as HTMLElement).closest<HTMLElement>('[data-context-index]');
    if (!row) return;
    e.preventDefault();
    openBlockContextMenu(root, modalRef, state, Number(row.dataset.contextIndex), e.clientX, e.clientY, contextMenuCallbacks);
  });

  root.addEventListener('touchstart', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-drag-handle]')) return;
    const row = target.closest<HTMLElement>('[data-context-index]');
    if (!row) return;
    const t = e.touches[0];
    const x = t.clientX;
    const y = t.clientY;
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(() => {
      openBlockContextMenu(root, modalRef, state, Number(row.dataset.contextIndex), x, y, contextMenuCallbacks);
    }, 520);
  }, { passive: true });
  root.addEventListener('touchmove', () => clearTimeout(longPressTimer), { passive: true });
  root.addEventListener('touchend', () => clearTimeout(longPressTimer), { passive: true });

  root.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const d = state.draft;
    if (el.dataset.block && d) {
      let val: any = el.value;
      if (el.dataset.block === 'depth') val = Math.max(0, Number(val) || 0);
      if (el.dataset.block === 'marker' || el.dataset.block === 'categoryMode' || el.dataset.block === 'group') val = val || null;
      d.prompt_order[state.selected][el.dataset.block] = val;
      persist();
    } else if (el.dataset.preset && d) {
      d[el.dataset.preset] = el.value;
      persist();
    } else if (el.dataset.paramNum && d) {
      d.parameters = d.parameters || {};
      if (el.value === '') delete d.parameters[el.dataset.paramNum];
      else d.parameters[el.dataset.paramNum] = Number(el.value);
      persist();
    } else if (el.dataset.promptField && d) {
      d.prompts = d.prompts || {};
      d.prompts[el.dataset.promptField] = el.value;
      persist();
    } else if (el.dataset.promptNum && d) {
      d.prompts = d.prompts || {};
      d.prompts[el.dataset.promptNum] = Math.max(0, Number(el.value) || 0);
      persist();
    } else if (el.dataset.cfGroup && el.dataset.cfNum && d) {
      d.prompts = d.prompts || {};
      d.prompts.contextFilters = d.prompts.contextFilters || {};
      d.prompts.contextFilters[el.dataset.cfGroup] = d.prompts.contextFilters[el.dataset.cfGroup] || {};
      d.prompts.contextFilters[el.dataset.cfGroup][el.dataset.cfNum] = Math.max(0, Number(el.value) || 0);
      persist();
    } else if (el.dataset.varIndex !== undefined && el.dataset.varCheck === undefined && d) {
      const b = d.prompt_order[state.selected];
      const v = b?.variables?.[Number(el.dataset.varIndex)];
      if (!v) return;
      if (el.dataset.optIndex !== undefined) {
        const opt = v.options?.[Number(el.dataset.optIndex)];
        if (opt && el.dataset.optField) {
          const of = el.dataset.optField;
          opt[of] = of === 'depth' ? (el.value === '' ? undefined : Math.max(0, Number(el.value) || 0)) : el.value;
        }
      } else if (el.dataset.varField) {
        const f = el.dataset.varField;
        if (f === 'separator') v[f] = el.value.replace(/\\n/g, '\n');
        else v[f] = ['min', 'max', 'step', 'rows'].includes(f) ? Number(el.value) : el.value;
      }
      persist();
    } else if (el.dataset.varRuntime && d) {
      const b = d.prompt_order[state.selected];
      if (!b) return;
      d.metadata = d.metadata || {};
      d.metadata.promptVariables = d.metadata.promptVariables || {};
      d.metadata.promptVariables[b.id] = d.metadata.promptVariables[b.id] || {};
      d.metadata.promptVariables[b.id][el.dataset.varRuntime] = el.value;
      persist();
    } else if (el.dataset.state === 'sourceTranslationName' && state.sourceTranslation) state.sourceTranslation.name = el.value;
    else if (el.dataset.state === 'translationName' && state.translation) state.translation.name = el.value;
    else if (el.dataset.state === 'sourceTranslationText' && state.sourceTranslation) state.sourceTranslation.content = el.value;
    else if (el.dataset.state === 'translationText' && state.translation) state.translation.content = el.value;
    else if (el.dataset.state) {
      const key = el.dataset.state;
      state[key] = el.value;
      if (['blockSearch', 'breakdownSearch', 'compareA', 'compareB'].includes(key)) {
        const pos = (el as HTMLInputElement).selectionStart;
        render();
        const nextEl = root.querySelector<HTMLInputElement>(`[data-state="${key}"]`);
        if (nextEl) {
          nextEl.focus({ preventScroll: true });
          if (typeof pos === 'number' && nextEl.setSelectionRange) nextEl.setSelectionRange(pos, pos);
        }
      }
    }
  });

  root.addEventListener('change', async (e) => {
    const el = e.target as HTMLInputElement | HTMLSelectElement;
    if (el.tagName === 'SELECT' && el.dataset.block && state.draft) {
      let val: any = el.value;
      if (el.dataset.block === 'marker' || el.dataset.block === 'categoryMode') val = val || null;
      state.draft.prompt_order[state.selected][el.dataset.block] = val;
      persist();
      render();
      return;
    }
    if (el.dataset.draftId !== undefined) {
      const id = el.dataset.draftId;
      state.selectedDraft = (el as HTMLInputElement).checked
        ? [...new Set([...state.selectedDraft, id])]
        : state.selectedDraft.filter((x: string) => x !== id);
      render();
      return;
    }
    if (el.dataset.importIndex !== undefined) {
      const i = Number(el.dataset.importIndex);
      state.selectedImports = (el as HTMLInputElement).checked
        ? [...new Set([...state.selectedImports, i])]
        : state.selectedImports.filter((n: number) => n !== i);
      render();
      return;
    }
    if (el.dataset.varCheck === 'placementSelector' && state.draft) {
      const b = state.draft.prompt_order?.[state.selected];
      const v = b?.variables?.[Number(el.dataset.varIndex)];
      if (v) {
        v.placementSelector = Boolean((el as HTMLInputElement).checked);
        persist();
        render();
      }
      return;
    }
    if (el.dataset.cfGroup && el.dataset.cfCheck && state.draft) {
      const d = state.draft;
      d.prompts = d.prompts || {};
      d.prompts.contextFilters = d.prompts.contextFilters || {};
      d.prompts.contextFilters[el.dataset.cfGroup] = d.prompts.contextFilters[el.dataset.cfGroup] || {};
      d.prompts.contextFilters[el.dataset.cfGroup][el.dataset.cfCheck] = Boolean((el as HTMLInputElement).checked);
      persist();
      return;
    }
    if (el.dataset.varField === 'type') {
      const b = state.draft?.prompt_order?.[state.selected];
      const v = b?.variables?.[Number(el.dataset.varIndex)];
      if (v && ['select', 'multiselect'].includes(v.type) && !Array.isArray(v.options)) {
        v.options = [{ id: 'option_1', label: 'Option 1', value: 'Option 1 text' }];
      }
      render();
      return;
    }
    if (el.dataset.action === 'select-block-dropdown') {
      state.selected = Number(el.value) || 0;
      render();
      return;
    }
    if (el.dataset.action === 'import-source') {
      try {
        state.importPreset = el.value;
        state.sourceTranslation = null;
        state.batchTranslation = null;
        state.importBlocks = [];
        state.importValues = {};
        state.selectedImports = [];
        state.expandedImports = [];
        if (el.value) {
          const preset = await request('get', { id: el.value });
          if (!preset) throw new Error('Source preset is no longer available.');
          state.importBlocks = preset.prompt_order || [];
          state.importValues = preset.metadata?.promptVariables || {};
          state.expandedImports = state.importBlocks.map((_: any, idx: number) => idx);
        }
        render();
      } catch (err: any) {
        state.notice = err.message;
        render();
      }
      return;
    }
    if (el.dataset.action === 'open' && el.value) {
      try {
        if (state.dirty && !(await askConfirm(root, modalRef, 'Discard Unsaved Changes?', 'Open this preset and discard your current unsaved draft?', 'warning', 'Open Preset'))) {
          render();
          return;
        }
        state.draft = ensureUniqueBlockIds(await request('get', { id: el.value }));
        state.savedFingerprint = computeDraftFingerprint(state.draft);
        state.selected = 0;
        state.selectedDraft = [];
        state.collapsedCategories = [];
        state.historyPast = [structuredClone(state.draft)];
        state.historyFuture = [];
        state.batchTranslation = null;
        state.dirty = false;
        state.notice = '';
        scheduleTokenCount();
        render();
      } catch (err: any) {
        state.notice = err.message;
        render();
      }
    }
  });

  root.addEventListener('click', async (e) => {
    const el = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
    if (!el) return;
    const a = el.dataset.action!;
    const d = state.draft;
    const b = d?.prompt_order?.[state.selected];
    try {
      if (a === 'full-window') { setFull(true); return; }
      else if (a === 'close-window') { setFull(false); return; }
      else if (a === 'refresh') await refresh();
      else if (a === 'undo') { undo(); return; }
      else if (a === 'redo') { redo(); return; }
      else if (a === 'new') {
        if (state.dirty && !(await askConfirm(root, modalRef, 'Start New Preset?', 'Discard your current unsaved draft and start a new preset?', 'warning', 'Start New'))) return;
        state.draft = freshDraft();
        state.savedFingerprint = '';
        state.selected = 0;
        state.selectedDraft = [];
        state.collapsedCategories = [];
        state.historyPast = [structuredClone(state.draft)];
        state.historyFuture = [];
        state.batchTranslation = null;
        persist(true);
      } else if (a === 'restore') {
        if (!state.recovery) throw new Error('No recovered draft is available.');
        if (state.dirty && !(await askConfirm(root, modalRef, 'Recover Draft?', 'Replace the current draft with the last auto-recovered draft?', 'warning', 'Recover'))) return;
        state.draft = ensureUniqueBlockIds(structuredClone(state.recovery));
        state.selected = 0;
        state.dirty = true;
        scheduleTokenCount();
      } else if (a === 'import-preset-json') await importJsonFile('preset');
      else if (a === 'import-template-json') await importJsonFile('template');
      else if (a === 'export-preset-json' && d) exportJsonFile(`${(d.name || 'preset').replace(/[^a-z0-9-_]+/gi, '_')}.json`, d);
      else if (a === 'export-template') {
        const t = state.templates[Number(el.dataset.index)];
        if (t) exportJsonFile(`template-${t.name.replace(/[^a-z0-9-_]+/gi, '_')}.json`, t);
      } else if (a === 'view') state.view = el.dataset.view;
      else if (a === 'editor-mode') state.editorMode = el.dataset.mode;
      else if (a === 'open-find-replace') { openFindReplaceDialog(root, modalRef, state, persist, render); return; }
      else if (a === 'toggle-category-collapse') {
        const catId = el.dataset.catId!;
        state.collapsedCategories = state.collapsedCategories.includes(catId)
          ? state.collapsedCategories.filter((id: string) => id !== catId)
          : [...state.collapsedCategories, catId];
      } else if (a === 'toggle-all-categories' && d) {
        const catIds = d.prompt_order.filter((blk: any) => blk.marker === 'category').map((blk: any) => blk.id);
        const allCollapsed = catIds.length > 0 && catIds.every((id: string) => state.collapsedCategories.includes(id));
        state.collapsedCategories = allCollapsed ? [] : catIds;
      } else if (a === 'filter-blocks') state.blockFilter = el.dataset.filter;
      else if (a === 'filter-breakdown') state.breakdownFilter = el.dataset.filter;
      else if (a === 'toggle-xray-expand') state.xrayExpanded = !state.xrayExpanded;
      else if (a === 'jump-to-block') {
        state.selected = Number(el.dataset.index) || 0;
        state.view = 'blocks';
        state.mobileDetailOpen = true;
      } else if (a === 'jump-to-block-id' && d) {
        const idx = d.prompt_order.findIndex((blk: any) => blk.id === el.dataset.blockId);
        if (idx >= 0) {
          state.selected = idx;
          state.view = 'blocks';
          state.mobileDetailOpen = true;
        }
      } else if (a === 'clear-marker' && b) {
        b.marker = null;
        persist();
        state.notice = `Cleared marker on “${b.name}” so its custom Prompt Content is always used.`;
      } else if (a === 'select-block') {
        state.selected = Number(el.dataset.index);
        state.mobileDetailOpen = true;
        if (state.showMacroPane) await runMacroPreview(d.prompt_order[state.selected]);
      } else if (a === 'close-mobile-detail') state.mobileDetailOpen = false;
      else if (a === 'block-menu') {
        const rect = el.getBoundingClientRect();
        openBlockContextMenu(root, modalRef, state, Number(el.dataset.index), rect.left, rect.bottom + 4, contextMenuCallbacks);
        return;
      } else if (a === 'toggle-lock' && b) { b.isLocked = !b.isLocked; persist(); }
      else if (a === 'set-color' && b) { b.color = el.dataset.color || null; persist(); }
      else if (a === 'toggle-trigger' && b) {
        const tr = el.dataset.trigger!;
        const cur = Array.isArray(b.injectionTrigger) ? b.injectionTrigger : [];
        b.injectionTrigger = cur.includes(tr) ? cur.filter((x: string) => x !== tr) : [...cur, tr];
        persist();
      } else if (a === 'insert-selected-macro') {
        insertTextAtPromptCursor(state.quickMacroSnippet || '{{char}}');
        return;
      } else if (a === 'insert-macro-chip') {
        insertTextAtPromptCursor(el.dataset.snippet || '');
        return;
      } else if (a === 'open-text-editor' && b) { await openFullTextEditorForBlock(b); return; }
      else if (a === 'open-custom-editor') {
        const res = await request('text-editor', { title: 'Custom Test Message', value: state.custom, placeholder: 'Enter test user message…' });
        if (res && !res.cancelled && typeof res.text === 'string') state.custom = res.text;
      } else if (a === 'toggle-macro-pane') {
        state.showMacroPane = !state.showMacroPane;
        if (state.showMacroPane && b) await runMacroPreview(b);
      } else if (a === 'refresh-macro' && b) { await runMacroPreview(b); return; }
      else if (a === 'add-current-to-basket' && b) {
        await saveEntriesAsTemplate(
          [{ block: structuredClone(b), values: structuredClone(d.metadata?.promptVariables?.[b.id] || {}), source: d.name || 'Draft' }],
          b.name || 'Block Template',
        );
        return;
      } else if (a === 'add-variable' && b) {
        b.variables = Array.isArray(b.variables) ? b.variables : [];
        const idx = b.variables.length + 1;
        b.variables.push({ name: `var_${idx}`, label: `Variable ${idx}`, description: '', type: 'text', defaultValue: '' });
        persist();
      } else if (a === 'delete-variable' && b) {
        b.variables.splice(Number(el.dataset.vindex), 1);
        persist();
      } else if (a === 'add-var-option' && b) {
        const v = b.variables?.[Number(el.dataset.vindex)];
        if (v) {
          v.options = Array.isArray(v.options) ? v.options : [];
          const n = v.options.length + 1;
          v.options.push({ id: `opt_${n}`, label: `Option ${n}`, value: '' });
          persist();
        }
      } else if (a === 'delete-var-option' && b) {
        const v = b.variables?.[Number(el.dataset.vindex)];
        v?.options?.splice(Number(el.dataset.oindex), 1);
        persist();
      } else if (a === 'insert-sov-hand' && d) {
        d.prompt_order.push({
          id: uid(),
          name: 'Sovereign Hand Co-Pilot',
          content: '{{if::{{loomSovHandActive}}}}\n{{loomSovHand}}\n{{/if}}',
          role: 'system',
          enabled: true,
          position: 'post_history',
          depth: 0,
          marker: null,
          isLocked: false,
          color: '#4db6ac',
          injectionTrigger: [],
          group: null,
        });
        state.selected = d.prompt_order.length - 1;
        state.view = 'blocks';
        persist();
        state.notice = 'Inserted Sovereign Hand Co-Pilot block.';
      } else if (a === 'collapse-all-imports') state.expandedImports = [];
      else if (a === 'expand-all-imports') state.expandedImports = state.importBlocks.map((_: any, idx: number) => idx);
      else if (a === 'toggle-import-expand') {
        const idx = Number(el.dataset.index);
        state.expandedImports = state.expandedImports.includes(idx)
          ? state.expandedImports.filter((n: number) => n !== idx)
          : [...state.expandedImports, idx];
      } else if (a === 'import-block') {
        const source = state.importBlocks[Number(el.dataset.index)];
        if (!source) throw new Error('Source block is no longer available.');
        insertEntries([{ block: source, values: state.importValues[source.id] }]);
        state.notice = `Added “${source.name || 'Block'}” to draft.`;
      } else if (a === 'add-checked-imports') {
        if (!state.selectedImports.length) throw new Error('Check at least one source block first.');
        const entries = state.selectedImports
          .map((i: number) => state.importBlocks[i])
          .filter(Boolean)
          .map((block: any) => ({ block, values: state.importValues[block.id] }));
        insertEntries(entries);
        state.selectedImports = [];
        state.notice = `Added ${entries.length} checked block(s) to your draft.`;
      } else if (a === 'collect-blocks') {
        if (!state.selectedImports.length) throw new Error('Check at least one source block first.');
        const source = state.presets.find((p: any) => p.id === state.importPreset)?.name || 'Preset';
        const entries = state.selectedImports
          .map((i: number) => state.importBlocks[i])
          .filter(Boolean)
          .map((block: any) => ({
            block: structuredClone(block),
            values: structuredClone(state.importValues[block.id] || {}),
            source,
          }));
        await saveEntriesAsTemplate(entries, `${source} Selection`);
        state.selectedImports = [];
        render();
        return;
      } else if (a === 'move-row-up' || a === 'move-row-down') {
        const idx = Number(el.dataset.index);
        moveBlock(idx, idx + (a === 'move-row-up' ? -1 : 1));
        return;
      } else if (a === 'quick-insert-template') {
        openTemplatePickerModal(root, modalRef, state, insertEntries, importJsonFile, render);
        return;
      } else if (a === 'quick-template-from-selected') {
        const chosen = d.prompt_order.filter((blk: any) => state.selectedDraft.includes(blk.id));
        if (!chosen.length) throw new Error('Check at least one block first.');
        const entries = chosen.map((blk: any) => ({
          block: structuredClone(blk),
          values: structuredClone(d.metadata?.promptVariables?.[blk.id] || {}),
          source: d.name || 'Draft',
        }));
        await saveEntriesAsTemplate(entries, chosen.length === 1 ? chosen[0].name : `${d.name || 'Preset'} Pack`);
        state.selectedDraft = [];
        render();
        return;
      } else if (a === 'insert-template') {
        const t = state.templates[Number(el.dataset.index)];
        if (!t) throw new Error('Template not found.');
        insertEntries(t.entries);
        state.notice = `Added ${t.entries.length} blocks from ${t.name}.`;
      } else if (a === 'delete-template') {
        const t = state.templates[Number(el.dataset.index)];
        if (!t || !(await askConfirm(root, modalRef, 'Delete Template?', `Delete the saved template “${t.name}”?`, 'danger', 'Delete'))) return;
        state.templates = await request('template-delete', { id: t.id });
        state.notice = 'Template deleted.';
      } else if (a === 'toggle') {
        const block = d.prompt_order[Number(el.dataset.index)];
        block.enabled = !block.enabled;
        persist();
      } else if (a === 'add-block' || a === 'add-category') {
        d.prompt_order.push({
          id: uid(),
          name: a === 'add-category' ? 'New category' : 'New prompt',
          content: '',
          role: 'system',
          enabled: true,
          position: 'pre_history',
          depth: 0,
          marker: a === 'add-category' ? 'category' : null,
          isLocked: false,
          color: a === 'add-category' ? '#a795e8' : null,
          injectionTrigger: [],
          group: null,
          ...(a === 'add-category' ? { categoryMode: 'checkbox' } : {}),
        });
        state.selected = d.prompt_order.length - 1;
        state.mobileDetailOpen = true;
        persist();
      } else if (a === 'save-preferences') {
        if (!state.translationLanguage.trim()) throw new Error('Enter a translation language.');
        await request('preferences', { translationLanguage: state.translationLanguage.trim(), translationConnection: state.translationConnection });
        state.notice = 'Studio settings saved.';
      } else if (a === 'translate-batch') {
        const target = el.dataset.target!;
        const group = el.dataset.group!;
        const scope = el.dataset.scope!;
        const list = target === 'source' ? state.importBlocks : d.prompt_order;
        const owner = target === 'source' ? state.importPreset : d;
        const chosen = list.filter((block: any, i: number) => group === 'all' || (target === 'source' ? state.selectedImports.includes(i) : state.selectedDraft.includes(block.id)));
        if (!chosen.length) throw new Error('Select at least one block to translate.');
        const snapshots = chosen.map((block: any) => ({ id: block.id, name: block.name || '', content: block.content || '' }));
        const entries: any[] = [];
        state.batchTranslation = null;
        state.translating = true;
        render();
        try {
          for (let i = 0; i < snapshots.length; i++) {
            const block = snapshots[i];
            const fields = scope === 'both' ? ['name', 'content'] : [scope];
            const available = fields.filter((field) => block[field].trim());
            if (!available.length) continue;
            const progress = root.querySelector('[data-batch-progress]');
            if (progress) progress.textContent = `Translating ${i + 1} of ${snapshots.length}…`;
            const result: any = { id: block.id, original: { name: block.name, content: block.content } };
            for (const field of available) {
              const translated = await request('translate', { text: block[field], language: state.translationLanguage, connectionId: state.translationConnection });
              result[field] = translated.content;
            }
            entries.push(result);
          }
          if (!entries.length) throw new Error('The selected blocks have no text in the chosen fields.');
          if ((target === 'source' ? state.importPreset : state.draft) !== owner) throw new Error('The preset changed while translating. Start again.');
          state.batchTranslation = { target, owner, entries };
          state.notice = `${entries.length} translated blocks ready to review.`;
        } finally {
          state.translating = false;
        }
      } else if (a === 'apply-batch') {
        const batch = state.batchTranslation;
        const target = el.dataset.target!;
        if (!batch || batch.target !== target || (target === 'source' ? state.importPreset : state.draft) !== batch.owner) throw new Error('The preset changed. Translate again.');
        const list = target === 'source' ? state.importBlocks : state.draft.prompt_order;
        const pairs = batch.entries.map((entry: any) => ({ entry, block: list.find((item: any) => item.id === entry.id) }));
        if (pairs.some(({ entry, block }: any) => !block || (entry.name !== undefined && (block.name || '') !== entry.original.name) || (entry.content !== undefined && (block.content || '') !== entry.original.content))) {
          throw new Error('A block changed since translation. Translate again.');
        }
        for (const { entry, block } of pairs) applyTranslatedFields(block, entry);
        state.batchTranslation = null;
        if (target === 'draft') persist();
        state.notice = target === 'draft' ? 'Translations applied to the draft.' : 'Translations ready to add; source preset unchanged.';
      } else if (a === 'discard-batch') state.batchTranslation = null;
      else if (a === 'translate-source') {
        const index = Number(el.dataset.index);
        const block = state.importBlocks[index];
        const presetId = state.importPreset;
        if (!block) throw new Error('Select a source block first.');
        state.translating = true;
        render();
        try {
          const result = await translateFields(block, el.dataset.scope!);
          if (state.importPreset === presetId) state.sourceTranslation = { presetId, index, ...result };
        } finally {
          state.translating = false;
        }
        state.notice = 'Translation ready to review.';
      } else if (a === 'apply-source-translation') {
        const t = state.sourceTranslation;
        const block = state.importBlocks[Number(el.dataset.index)];
        if (!t || t.presetId !== state.importPreset || t.index !== Number(el.dataset.index) || !block) throw new Error('The source block changed. Translate it again.');
        applyTranslatedFields(block, t);
        state.sourceTranslation = null;
        state.notice = 'Translation ready to add.';
      } else if (a === 'discard-source-translation') state.sourceTranslation = null;
      else if (a === 'translate') {
        if (!b) throw new Error('Select a block first.');
        const blockId = b.id;
        state.translating = true;
        render();
        try {
          const result = await translateFields(b, el.dataset.scope!);
          state.translation = { blockId, ...result };
        } finally {
          state.translating = false;
        }
        state.notice = 'Translation ready to review.';
      } else if (a === 'apply-translation') {
        const t = state.translation;
        if (!t || !b || t.blockId !== b.id) throw new Error('Select the translated block first.');
        applyTranslatedFields(b, t);
        state.translation = null;
        persist();
        state.notice = 'Translation applied to the draft.';
      } else if (a === 'discard-translation') state.translation = null;
      else if (a === 'up' || a === 'down') {
        const n = state.selected + (a === 'up' ? -1 : 1);
        if (n >= 0 && n < d.prompt_order.length) moveBlock(state.selected, n);
        return;
      } else if (a === 'duplicate-block' && b) {
        d.prompt_order.splice(state.selected + 1, 0, { ...structuredClone(b), id: uid(), name: (b.name || 'Block') + ' copy', isLocked: false });
        state.selected++;
        persist();
      } else if (a === 'delete-row') {
        await deleteBlockAtIndex(Number(el.dataset.index));
        return;
      } else if (a === 'delete-block' && b) {
        await deleteBlockAtIndex(state.selected);
        return;
      } else if (a === 'delete-checked-blocks' && d) {
        const count = state.selectedDraft.length;
        if (!count) return;
        if (!(await askConfirm(root, modalRef, 'Delete Checked Blocks?', `Delete ${count} checked block(s) from your draft?`, 'danger', `Delete ${count} Block(s)`))) return;
        const toRemove = new Set(state.selectedDraft);
        d.prompt_order = d.prompt_order.filter((blk: any) => !toRemove.has(blk.id));
        if (d.metadata?.promptVariables) {
          for (const id of toRemove) delete d.metadata.promptVariables[id as string];
        }
        state.selectedDraft = [];
        state.selected = Math.max(0, Math.min(state.selected, d.prompt_order.length - 1));
        state.notice = `Deleted ${count} checked block(s).`;
        persist();
      } else if (a === 'apply-json') {
        let value: any;
        try {
          value = JSON.parse(root.querySelector<HTMLTextAreaElement>(`[data-json="${el.dataset.target}"]`)!.value);
        } catch {
          throw new Error('Invalid JSON. Fix the syntax and try again.');
        }
        if (el.dataset.target === 'variables') {
          if (!Array.isArray(value)) throw new Error('Variables must be a JSON array.');
          b.variables = value;
        } else {
          if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('This field must be a JSON object.');
          d[el.dataset.target!] = value;
        }
        persist();
      } else if (a === 'save' || a === 'save-copy') {
        root.inert = true;
        root.setAttribute('aria-busy', 'true');
        try {
          const saved = ensureUniqueBlockIds(await syncSaveWithNativePresetEditor(ctx, request, d, a === 'save-copy'));
          state.draft = saved;
          state.savedFingerprint = computeDraftFingerprint(saved);
          state.dirty = false;
          clearTimeout(timer);
          await saveChain;
          await request('draft', { draft: saved });
          await refresh();
          state.notice = saved.provider === 'loom' ? 'Saved and applied live to Lumiverse (no page refresh needed).' : 'Saved. Set Provider to "loom" to list this preset in the native Loom Presets tab.';
        } finally {
          root.inert = false;
          root.removeAttribute('aria-busy');
        }
      } else if (a === 'profile') {
        if (!state.chatId) throw new Error('Choose a chat first.');
        const active = await request('active', { chatId: state.chatId });
        if (active.preset_id !== d.id) throw new Error('The selected chat uses a different preset. Open that preset first.');
        for (const block of d.prompt_order) if (Object.hasOwn(active.block_states, block.id)) block.enabled = active.block_states[block.id];
        persist();
        state.notice = `Applied active block states from ${active.source}.`;
      } else if (a === 'stop') {
        if (state.activeRun) await request('cancel', { runId: state.activeRun });
      } else if (a === 'dry') {
        if (!state.chatId) throw new Error('Choose a chat first.');
        state.busy = true;
        render();
        const result = await request('dry', { chatId: state.chatId, connectionId: state.connectionId, presetId: d.id, generationType: state.generationType });
        state.assembled = result;
        state.notice = 'Saved-preset dry run complete.';
        state.busy = false;
      } else if (a === 'preview' || a === 'run') {
        if (!state.chatId) throw new Error('Choose a chat first.');
        state.busy = true;
        state.result = '';
        state.reasoning = '';
        state.lastUsage = null;
        state.assembled = null;
        const snapshot = structuredClone(d);
        const requestId = uid();
        state.activeRun = requestId;
        render();
        await new Promise((resolve, reject) => {
          pending.set(requestId, {
            resolve,
            reject,
            onAssembled: (data: any) => { state.assembled = data; },
            onReasoning: (token: string) => {
              state.reasoning += token;
              const rbox = root.querySelector('.ps-reasoning-box');
              if (rbox) rbox.textContent = state.reasoning;
            },
            onToken: (token: string) => {
              state.result += token;
              const box = root.querySelector('.ps-reply-box');
              if (box) box.textContent = state.result;
            },
          });
          ctx.sendToBackend({
            action: a,
            requestId,
            preset: snapshot,
            chatId: state.chatId,
            connectionId: state.connectionId,
            generationType: state.generationType,
            customMessage: state.custom,
          });
        }).then((result: any) => {
          if (a === 'run') {
            state.lastUsage = result?.usage || null;
            if (result?.reasoning && !state.reasoning) state.reasoning = result.reasoning;
            state.runs.push({
              time: new Date().toLocaleTimeString(),
              connection: state.connections.find((c: any) => c.id === state.connectionId)?.name || 'Active connection',
              content: result?.content || state.result,
              reasoning: state.reasoning,
              snapshot,
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
      if (!['refresh', 'save', 'save-copy', 'dry', 'profile', 'collect-blocks', 'save-template', 'insert-template', 'quick-insert-template', 'quick-template-from-selected', 'delete-template', 'translate', 'apply-translation', 'save-preferences', 'translate-source', 'apply-source-translation', 'translate-batch', 'apply-batch', 'import-block', 'add-current-to-basket', 'insert-sov-hand', 'clear-marker'].includes(a)) {
        state.notice = '';
      }
      render();
    } catch (err: any) {
      state.busy = false;
      state.activeRun = null;
      state.notice = (err.message || String(err)) + (a === 'save' ? ' Your draft is preserved.' : '');
      render();
    }
  });

  render();
  refresh().catch((err) => {
    state.notice = err.message;
    render();
  });

  return () => {
    destroyed = true;
    closeModalRef(modalRef);
    destroyMounted();
    clearTimeout(timer);
    clearTimeout(tokenTimer);
    clearTimeout(longPressTimer);
    if (state.activeRun) request('cancel', { runId: state.activeRun }).catch(() => {});
    unsub();
    unsubKb?.();
    cleanupLauncher();
    document.removeEventListener('keydown', onKey);
    mount?.destroy();
    tab.destroy();
    polish();
    style();
    ctx.dom.cleanup();
  };
}
