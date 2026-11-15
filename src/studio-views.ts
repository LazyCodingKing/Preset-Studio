import {
  SWATCHES,
  TRIGGERS,
  MACRO_CATALOG,
  MARKERS,
  VARIABLE_STARTER_EXAMPLES,
  AUTHORS_NOTE_PRESETS,
  computeRunMetrics,
  esc,
  selectOptions,
  buildPresetVariableDiagnostics,
  resolveBlockVariablesPreview,
  computeLineDiff,
  lintBlockMacros,
} from './studio-core.js';

const MODEL_PLACEHOLDERS = new Set(['', 'string', 'model', 'your-model-here', 'null', 'undefined']);

export function cleanModelName(model: unknown): string {
  const raw = typeof model === 'string' ? model.trim() : '';
  return MODEL_PLACEHOLDERS.has(raw.toLowerCase()) ? '' : raw;
}

export function formatConnectionLabel(c: any): string {
  if (!c) return 'Active default connection';
  const m = cleanModelName(c.model);
  const tags: string[] = [];
  if (c.provider) tags.push(String(c.provider));
  if (m) tags.push(m);
  const meta = tags.length ? ` (${tags.join(' / ')})` : '';
  const def = c.is_default ? ' [default]' : '';
  const noKey = c.has_api_key === false ? ' [No Key]' : '';
  return `${c.name}${meta}${def}${noKey}`;
}

export function renderPermissionBanner(state: any): string {
  const perms = state.permissions || {};
  const missing: string[] = [];
  if (!perms.presets) missing.push('Presets');
  if (!perms.chats) missing.push('Chats');
  if (!perms.generation) missing.push('Generation');
  if (!missing.length) return '';
  return `
    <div class="ps-perm-banner" role="alert">
      <span>⚠ Missing permissions: <strong>${esc(missing.join(', '))}</strong>. Enable them in Extensions to load presets, chats, and test generation.</span>
      <button type="button" class="ps-btn-sm ps-primary" data-action="open-extension-settings">Open Extension Settings</button>
    </div>
  `;
}

export function translationButtons(state: any, action: string, block: any, index?: number, extraDisabled = false): string {
  const id = index === undefined ? '' : ` data-index="${index}"`;
  const noGen = state.permissions?.generation === false;
  const disabled = state.translating || extraDisabled || noGen ? 'disabled' : '';
  const hasTitle = Boolean(String(block?.name || '').trim());
  const hasPrompt = Boolean(String(block?.content || '').trim());
  return `<div class="ps-actions">${hasTitle ? `<button type="button" class="ps-btn-sm" data-action="${action}" data-scope="name"${id} ${disabled}>🌐 Title</button>` : ''}${hasPrompt ? `<button type="button" class="ps-btn-sm" data-action="${action}" data-scope="content"${id} ${disabled}>🌐 Prompt</button>` : ''}${hasTitle && hasPrompt ? `<button type="button" class="ps-btn-sm" data-action="${action}" data-scope="both"${id} ${disabled}>🌐 Both</button>` : ''}</div>`;
}

export function translationPreview(t: any, prefix: string): string {
  return `<div class="ps-grid" style="margin-top:8px">${t.name !== undefined ? `<label>Translated title<input data-state="${prefix}Name" value="${esc(t.name)}"></label>` : ''}${t.content !== undefined ? `<label>Translated prompt<textarea data-state="${prefix}Text">${esc(t.content)}</textarea></label>` : ''}</div>`;
}

export function batchPreview(state: any, target: string): string {
  const batch = state.batchTranslation;
  if (!batch || batch.target !== target) return '';
  const failures: any[] = Array.isArray(batch.failures) ? batch.failures : [];
  return `
    <div class="ps-panel" style="margin-top:10px;border-left:3px solid var(--ps-accent)">
      <h4>Review ${batch.entries.length} translated block(s)</h4>
      <p class="ps-muted">${target === 'source' ? 'Compare original vs. translated text before updating the loaded source blocks (ready to add to draft).' : 'Compare original vs. translated text before applying to your draft.'}</p>
      ${failures.length ? `
        <div class="ps-notice" style="border-left-color:var(--ps-warning)">
          <span>⚠ ${failures.length} field(s) could not be translated cleanly (${esc(failures.slice(0, 3).map((f) => `${f.name}: ${f.error}`).join('; '))}).</span>
        </div>
      ` : ''}
      ${batch.entries.map((e: any) => `<details style="margin:6px 0"><summary>${esc(e.original.name || 'Untitled')} ${e.name !== undefined ? `→ <strong>${esc(e.name)}</strong>` : ''}</summary>${e.content !== undefined ? `<div class="ps-grid" style="margin-top:6px"><div><span class="ps-muted">Original</span><pre class="ps-result">${esc(e.original.content)}</pre></div><div><span class="ps-muted">Translated</span><pre class="ps-result">${esc(e.content)}</pre></div></div>` : ''}</details>`).join('')}
      <div class="ps-actions" style="margin-top:8px">
        <button type="button" class="ps-primary ps-btn-sm" data-action="apply-batch" data-target="${target}">${target === 'source' ? 'Apply to Source Blocks' : 'Apply to Draft'}</button>
        <button type="button" class="ps-btn-sm" data-action="discard-batch">Discard</button>
      </div>
    </div>
  `;
}

export function bulkControls(state: any, target: string): string {
  const noGen = state.permissions?.generation === false;
  const baseDisabled = state.translating || noGen;
  const checkedCount = target === 'source' ? (state.selectedImports || []).length : (state.selectedDraft || []).length;
  const selectedDisabled = baseDisabled || checkedCount === 0 ? 'disabled' : '';
  const allDisabled = baseDisabled ? 'disabled' : '';
  return `
    <div class="ps-card" style="margin:10px 0">
      <div class="ps-between">
        <strong>Batch Translate (${target === 'source' ? 'Source Preset' : 'Current Draft'}) → ${esc(state.translationLanguage || 'English')}</strong>
        <span class="ps-muted" data-batch-progress aria-live="polite">${state.translating ? esc(state.translateProgressText || 'Translating…') : ''}</span>
      </div>
      <div class="ps-row" style="margin-top:8px">
        <div class="ps-actions">
          <span class="ps-muted">Checked (${checkedCount}):</span>
          ${[['name', 'Titles'], ['content', 'Prompts'], ['both', 'Both']].map(([scope, label]) => `<button type="button" class="ps-btn-sm" data-action="translate-batch" data-target="${target}" data-group="selected" data-scope="${scope}" ${selectedDisabled}>${label}</button>`).join('')}
        </div>
        ·
        <div class="ps-actions">
          <span class="ps-muted">${target === 'draft' ? 'All Unlocked:' : 'All Blocks:'}</span>
          ${[['name', 'Titles'], ['content', 'Prompts'], ['both', 'Both']].map(([scope, label]) => `<button type="button" class="ps-btn-sm" data-action="translate-batch" data-target="${target}" data-group="all" data-scope="${scope}" ${allDisabled}>${label}</button>`).join('')}
        </div>
      </div>
      ${batchPreview(state, target)}
    </div>
  `;
}

export function renderInlineSamplersDrawer(state: any): string {
  const d = state.draft;
  const p = d.parameters || {};
  const temp = p.temperature ?? 0.8;
  const maxTok = p.max_tokens || 'Default';
  return `
    <details class="ps-panel ps-collapsible" data-details-id="inline-samplers-drawer" style="margin-top:12px">
      <summary>
        <span>🎚️ Preset Name, Samplers & Generation Limits</span>
        <span class="ps-pill ps-pill-accent">${esc(d.name || 'Untitled')} · Temp ${esc(temp)} · Max ${esc(maxTok)}</span>
      </summary>

      <div class="ps-grid" style="margin-top:4px">
        <label>Preset Display Name
          <input data-preset="name" value="${esc(d.name)}" placeholder="My Custom Preset">
        </label>
        <label>Max Response Tokens <span class="ps-muted">(~400 = medium, 2000+ = long/reasoning)</span>
          <input type="number" min="1" max="128000" data-param-num="max_tokens" value="${esc(p.max_tokens ?? '')}" placeholder="Provider default">
        </label>
      </div>

      <div class="ps-grid" style="margin-top:10px" id="ps-sampler-sliders">
        <div class="ps-card" data-slider-slot="temperature"></div>
        <div class="ps-card" data-slider-slot="top_p"></div>
      </div>

      <details class="ps-collapsible" data-details-id="advanced-samplers" style="margin-top:10px">
        <summary>
          <span>⚙️ Advanced Penalties & Raw JSON</span>
          <span class="ps-muted">Min-P, Repetition, Seed, Raw JSON</span>
        </summary>
        <div class="ps-grid" style="margin-top:8px">
          <div class="ps-card" data-slider-slot="min_p"></div>
          <div class="ps-card" data-slider-slot="frequency_penalty"></div>
          <div class="ps-card" data-slider-slot="presence_penalty"></div>
          <div class="ps-card" data-slider-slot="repetition_penalty"></div>
        </div>
        <div class="ps-grid-3" style="margin-top:10px">
          <label>Top-K <span class="ps-muted">(0 = off)</span>
            <input type="number" min="0" max="1000" data-param-num="top_k" value="${esc(p.top_k ?? '')}" placeholder="0">
          </label>
          <label>Fixed Seed
            <input type="number" data-param-num="seed" value="${esc(p.seed ?? '')}" placeholder="Random">
          </label>
          <label>Provider Type
            <input data-preset="provider" value="${esc(d.provider)}" placeholder="loom">
          </label>
        </div>
        <div class="ps-between" style="margin-top:10px">
          <span class="ps-muted">Need raw JSON access for parameters or metadata?</span>
          <button type="button" class="ps-btn-sm" data-action="copy-parameters-json">📋 Copy Parameters JSON</button>
        </div>
        ${[['parameters', 'Parameters JSON'], ['prompts', 'Completion Prompts JSON'], ['metadata', 'Metadata JSON']].map(([k, l]) => `
          <details style="margin:6px 0" data-details-id="json-${k}">
            <summary class="ps-muted" style="cursor:pointer;font-weight:600">${l}</summary>
            <textarea data-json="${k}" style="margin-top:6px;font-family:var(--lumiverse-font-mono,monospace);font-size:0.8rem">${esc(JSON.stringify(d[k] || {}, null, 2))}</textarea>
            <button type="button" class="ps-btn-sm" style="margin-top:6px" data-action="apply-json" data-target="${k}">Apply ${l}</button>
          </details>
        `).join('')}
      </details>
    </details>
  `;
}

export function getFilteredDraftBlocks(state: any) {
  const d = state.draft;
  if (!d || !Array.isArray(d.prompt_order)) return [];
  let currentCatId: string | null = null;
  const hasSearchOrFilter = Boolean((state.blockSearch || '').trim()) || state.blockFilter !== 'all';

  return d.prompt_order
    .map((block: any, index: number) => {
      if (block.marker === 'category') currentCatId = block.id;
      return {
        block,
        index,
        parentCatId: block.marker === 'category' ? null : currentCatId,
        isChild: block.marker !== 'category' && Boolean(currentCatId),
      };
    })
    .filter(({ block, parentCatId }: any) => {
      if (!hasSearchOrFilter && parentCatId && state.collapsedCategories.includes(parentCatId)) return false;
      if (state.blockFilter === 'enabled' && !block.enabled) return false;
      if (state.blockFilter === 'categories' && block.marker !== 'category') return false;
      if (state.blockFilter === 'markers' && (!block.marker || block.marker === 'category')) return false;
      if ((state.blockSearch || '').trim()) {
        const q = state.blockSearch.toLowerCase();
        return (block.name || '').toLowerCase().includes(q) || (block.content || '').toLowerCase().includes(q);
      }
      return true;
    });
}

export function renderBlockListOnlyHtml(state: any): string {
  const d = state.draft;
  if (!d) return '';
  const varDiag = buildPresetVariableDiagnostics(d.prompt_order);
  const filteredBlocks = getFilteredDraftBlocks(state);

  return filteredBlocks.map(({ block, index, isChild }: any) => {
    const tok = state.tokenCounts[block.id];
    const defCnt = varDiag.defCountByBlock.get(block.id) || 0;
    const isCat = block.marker === 'category';
    const isCatCollapsed = isCat && state.collapsedCategories.includes(block.id);
    const roleLabel = isCat ? 'folder' : block.marker ? `slot: ${block.marker}` : block.role;
    return `
      <div class="ps-block ${isCat ? 'ps-is-cat' : isChild ? 'ps-is-child' : ''} ${!block.enabled ? 'ps-is-off' : ''} ${index === state.selected ? 'ps-active-row' : ''}" draggable="true" data-context-index="${index}">
        <span class="ps-drag-handle" data-drag-handle="${index}" title="Drag to reorder">⠿</span>
        ${isCat ? `<button type="button" class="ps-row-btn" data-action="toggle-category-collapse" data-cat-id="${esc(block.id)}" aria-expanded="${!isCatCollapsed}">${isCatCollapsed ? '▸' : '▾'}</button>` : `<input type="checkbox" style="width:auto;min-height:16px;flex:none" data-draft-id="${esc(block.id)}" aria-label="Select ${esc(block.name)}" ${state.selectedDraft.includes(block.id) ? 'checked' : ''}>`}
        <button type="button" class="ps-block-main" data-action="select-block" data-index="${index}" aria-current="${index === state.selected}" title="${esc(block.name || 'Untitled')}">
          <div class="ps-block-title-row">
            ${block.color ? `<span class="ps-dot" style="background:${esc(block.color)}"></span>` : ''}
            ${block.isLocked ? '<span title="Locked" style="font-size:0.7rem;opacity:0.75;flex:none">🔒</span>' : ''}
            <span class="ps-block-title">${esc(block.name || 'Untitled')}</span>
          </div>
          <div class="ps-block-sub">
            <span>${esc(roleLabel)}</span>
            <span data-token-id="${esc(block.id)}">${block.content?.trim() && tok ? `· ${tok}t` : ''}</span>
            ${defCnt ? `<span title="${defCnt} user variable(s) on this block" style="color:var(--ps-accent)">· 🎛 ${defCnt}</span>` : ''}
          </div>
        </button>
        <div class="ps-row-actions">
          <button type="button" class="ps-row-btn ps-row-step" data-action="move-row-up" data-index="${index}" ${index === 0 ? 'disabled' : ''} title="Move up">↑</button>
          <button type="button" class="ps-row-btn ps-row-step" data-action="move-row-down" data-index="${index}" ${index >= d.prompt_order.length - 1 ? 'disabled' : ''} title="Move down">↓</button>
          ${!isCat ? `<button type="button" class="ps-row-btn ${block.enabled ? 'ps-toggle-on' : ''}" data-action="toggle" data-index="${index}" aria-pressed="${!!block.enabled}">${block.enabled ? 'On' : 'Off'}</button>` : ''}
          <button type="button" class="ps-row-btn" data-action="block-menu" data-index="${index}" title="Block options">⋯</button>
        </div>
      </div>`;
  }).join('') || '<div class="ps-empty-state"><p>No blocks match your filter.</p></div>';
}

export function renderArchitectTab(ctx: any, state: any): string {
  const d = state.draft;
  if (state.editorMode === 'native') {
    return `<div class="ps-panel"><div class="ps-between" style="margin-bottom:10px"><div><h3>Native Loom Block Editor</h3><p class="ps-muted">Drag-and-drop blocks, configure placement selectors, and insert macros using Lumiverse's built-in component.</p></div><button type="button" class="ps-btn-sm ps-primary" data-action="editor-mode" data-mode="studio">⇄ Return to Studio View</button></div><div id="ps-native-loom-slot"></div></div>`;
  }
  const b = d.prompt_order[state.selected];
  const categoryBlocks = d.prompt_order.filter((blk: any) => blk.marker === 'category');
  const allCatsCollapsed = categoryBlocks.length > 0 && categoryBlocks.every((c: any) => state.collapsedCategories.includes(c.id));
  const filteredBlocks = getFilteredDraftBlocks(state);

  const macroData = state.macroPreview?.blockId === b?.id ? state.macroPreview : null;
  const varCount = Array.isArray(b?.variables) ? b.variables.length : 0;
  const markerOptions = b && b.marker && !MARKERS.some((m) => m.id === b.marker)
    ? [...MARKERS, { id: b.marker, label: `${b.marker} (Preset Marker)` }]
    : MARKERS;

  const presetVarNames: string[] = [];
  for (const blk of d.prompt_order) {
    if (Array.isArray(blk.variables)) {
      for (const v of blk.variables) {
        if (v?.name && !presetVarNames.includes(v.name)) presetVarNames.push(v.name);
      }
    }
  }

  return `
    <div class="ps-columns ${state.mobileDetailOpen ? 'ps-has-detail' : ''} ${state.showMacroPane ? 'ps-with-xray' : ''}">
      <!-- Left Column: Clean Block Outline -->
      <div class="ps-col-list ps-panel" style="margin:0" data-scroll-id="prompt-order-list">
        <div class="ps-between" style="margin-bottom:8px">
          <div class="ps-row">
            <strong data-block-list-count>Prompt Blocks (${filteredBlocks.length}/${d.prompt_order.length})</strong>
            ${categoryBlocks.length ? `<button type="button" class="ps-btn-sm" data-action="toggle-all-categories" title="Collapse or expand all categories">${allCatsCollapsed ? '▾ Expand' : '▸ Collapse'}</button>` : ''}
          </div>
          <div class="ps-actions">
            <button type="button" class="ps-btn-sm ps-primary" data-action="add-block">＋ Block</button>
            <button type="button" class="ps-btn-sm" data-action="add-category" title="Add category divider">＋ Folder</button>
            <button type="button" class="ps-btn-sm" data-action="import-txt-block" title="Import a .txt or .md file as a new prompt block">📥 .txt</button>
            <button type="button" class="ps-btn-sm" data-action="quick-insert-template" title="Insert from template library">📦</button>
          </div>
        </div>

        <!-- Compact Search + Segmented Filter inside the Left Rail -->
        <div style="display:grid;gap:6px;margin-bottom:8px">
          <div class="ps-row">
            <input style="flex:1;min-height:30px;padding:3px 9px;font-size:0.8rem" placeholder="Search blocks…" data-state="blockSearch" value="${esc(state.blockSearch)}">
            <button type="button" class="ps-btn-sm" data-action="open-find-replace" title="Find & Replace across preset">🔍</button>
          </div>
          <div class="ps-seg-bar" style="width:100%;justify-content:space-between">
            ${[['all', 'All'], ['enabled', 'Active'], ['categories', 'Folders'], ['markers', 'Slots']].map(([id, label]) => `<button type="button" style="flex:1" data-action="filter-blocks" data-filter="${id}" aria-pressed="${state.blockFilter === id}">${label}</button>`).join('')}
          </div>
        </div>

        ${state.selectedDraft.length ? `
          <div class="ps-card ps-between" style="margin-bottom:8px;padding:6px 8px;border-color:var(--ps-accent)">
            <span style="font-size:0.78rem;font-weight:600">${state.selectedDraft.length} selected</span>
            <div class="ps-actions">
              <button type="button" class="ps-btn-sm" data-action="enable-checked-blocks">On</button>
              <button type="button" class="ps-btn-sm" data-action="disable-checked-blocks">Off</button>
              <button type="button" class="ps-btn-sm" data-action="quick-template-from-selected" title="Save checked as template">📦</button>
              <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-checked-blocks">🗑</button>
            </div>
          </div>
        ` : ''}

        <div class="ps-list" id="ps-block-list-slot">
          ${renderBlockListOnlyHtml(state)}
        </div>
      </div>

      <!-- Right Column: Focused Block Inspector + Samplers Drawer -->
      <div class="ps-col-detail" data-scroll-id="inspector-detail">
        ${!b ? '<div class="ps-panel" style="margin:0"><p class="ps-muted">Select or add a block on the left to edit its prompt.</p></div>' : `
          <div class="ps-panel" style="margin:0">
            <div class="ps-between" style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--ps-border)">
              <div class="ps-row">
                <button type="button" class="ps-btn-sm ps-mobile-back" data-action="close-mobile-detail">← List</button>
                <h3>${esc(b.name || 'Untitled')}</h3>
                ${b.marker !== 'category' ? `<button type="button" class="ps-btn-sm ${b.enabled ? 'ps-toggle-on' : ''}" data-action="toggle" data-index="${state.selected}">${b.enabled ? '● Enabled' : '○ Disabled'}</button>` : '<span class="ps-pill ps-pill-accent">Folder Header</span>'}
              </div>
              <div class="ps-actions">
                <button type="button" class="ps-btn-sm ${b.isLocked ? 'ps-primary' : ''}" data-action="toggle-lock" title="Lock or unlock editing">${b.isLocked ? '🔒 Locked' : '🔓 Unlock'}</button>
                <button type="button" class="ps-btn-sm" data-action="view" data-view="variables" title="Edit user variables for this block">🎛 Inputs (${varCount})</button>
                <button type="button" class="ps-btn-sm ${state.showMacroPane ? 'ps-primary' : ''}" data-action="toggle-macro-pane" title="Live preview of resolved {{macros}}">⚡ Preview</button>
                <button type="button" class="ps-btn-sm" data-action="open-text-editor" ${b.isLocked ? 'disabled' : ''} title="Open full-screen editor">⤢ Fullscreen</button>
              </div>
            </div>

            ${b.isLocked ? '<div class="ps-notice" style="margin-bottom:10px;border-left-color:var(--ps-warning)"><span>🔒 This block is locked to prevent accidental changes.</span><button type="button" class="ps-btn-sm" data-action="toggle-lock">Unlock Now</button></div>' : ''}

            <div class="ps-grid" style="margin-bottom:10px">
              <label>Block Title
                <input data-block="name" value="${esc(b.name)}" placeholder="e.g. Narrative Style & Pacing" ${b.isLocked ? 'disabled' : ''}>
              </label>
              <label>Message Role
                <select data-block="role" ${b.isLocked ? 'disabled' : ''}>
                  ${[['system', 'System (Instructions)'], ['user', 'User'], ['assistant', 'Assistant (Prefill / Model)'], ['user_append', 'Append to User'], ['assistant_append', 'Append to Assistant']].map(([val, lbl]) => `<option value="${val}" ${b.role === val ? 'selected' : ''}>${lbl}</option>`).join('')}
                </select>
              </label>
            </div>

            <!-- Streamlined Macro Insertion Bar -->
            <div class="ps-between" style="margin-bottom:6px;gap:6px">
              <div class="ps-chips">
                <span class="ps-muted" style="font-size:0.76rem;font-weight:600">Insert:</span>
                ${['{{char}}', '{{user}}', '{{persona}}', '{{if::...}}', '{{memories}}'].map((chip) => `<button type="button" class="ps-btn-sm ps-mono" data-action="insert-macro-chip" data-snippet="${esc(chip === '{{if::...}}' ? '{{if::{{isGroupChat}}}}\n\n{{/if}}' : chip)}" ${b.isLocked ? 'disabled' : ''}>${esc(chip)}</button>`).join('')}
                ${presetVarNames.slice(0, 3).map((vn) => `<button type="button" class="ps-btn-sm ps-mono" data-action="insert-macro-chip" data-snippet="{{var::${esc(vn)}}}" ${b.isLocked ? 'disabled' : ''}>{{var::${esc(vn)}}}</button>`).join('')}
              </div>
              <div class="ps-row">
                <select style="width:auto;max-width:190px;min-height:28px;padding:2px 6px;font-size:0.78rem" data-state="quickMacroSnippet" ${b.isLocked ? 'disabled' : ''}>
                  ${MACRO_CATALOG.map((m) => `<option value="${esc(m.snippet)}" ${state.quickMacroSnippet === m.snippet ? 'selected' : ''}>${esc(m.label)}</option>`).join('')}
                </select>
                <button type="button" class="ps-btn-sm" data-action="insert-selected-macro" ${b.isLocked ? 'disabled' : ''}>＋ Insert</button>
                <button type="button" class="ps-btn-sm" data-action="copy-active-block-content" title="Copy prompt text">📋 Copy</button>
              </div>
            </div>

            <textarea class="ps-content" data-block="content" placeholder="${b.marker ? `System slot (${b.marker}) — automatically injects ${b.marker} unless you write custom override text here.` : 'Write your prompt instructions here (supports {{macros}})…'}" ${b.isLocked ? 'disabled' : ''}>${esc(b.content)}</textarea>

            ${(() => {
              const lint = lintBlockMacros(b.content || '');
              return `
                <div class="ps-editor-lint" data-block-lint>
                  <span class="ps-muted">${lint.chars.toLocaleString()} chars · ${lint.words.toLocaleString()} words · ~${lint.approxTokens.toLocaleString()}t</span>
                  ${lint.warnings.length
                    ? `<span class="ps-pill ps-pill-warn">⚠ ${esc(lint.warnings.join(' · '))}</span>`
                    : (b.content || '').includes('{{')
                      ? '<span class="ps-pill ps-pill-ok">✓ Macro syntax OK</span>'
                      : ''}
                </div>
              `;
            })()}

            <!-- Collapsible Placement, Slot Marker & Color -->
            <details class="ps-collapsible" data-details-id="block-advanced-options">
              <summary>
                <span>⚙️ Placement, Slot Marker & Triggers</span>
                <span class="ps-muted" style="font-size:0.78rem">${esc(b.position)}${b.position === 'in_history' ? ` @ Depth ${b.depth ?? 0}` : ''} · ${b.marker ? `Slot: ${b.marker}` : 'Custom Block'}</span>
              </summary>
              <div class="ps-grid">
                <label>Position Relative to Chat History
                  <select data-block="position" ${b.isLocked ? 'disabled' : ''}>
                    ${[['pre_history', 'Before Chat History (pre_history)'], ['post_history', 'After Chat History (post_history)'], ['in_history', 'Inside Chat History at Depth (in_history)']].map(([val, lbl]) => `<option value="${val}" ${b.position === val ? 'selected' : ''}>${lbl}</option>`).join('')}
                  </select>
                </label>
                ${b.position === 'in_history' ? `
                  <label>Depth from Latest Message (0 = very end)
                    <input data-block="depth" type="number" min="0" max="100" value="${esc(b.depth ?? 0)}" ${b.isLocked ? 'disabled' : ''}>
                  </label>
                ` : ''}
                <label>Built-In Data Slot (Marker)
                  <select data-block="marker" ${b.isLocked ? 'disabled' : ''}>
                    ${markerOptions.map((m) => `<option value="${esc(m.id)}" ${(b.marker || '') === m.id ? 'selected' : ''}>${esc(m.label)}</option>`).join('')}
                  </select>
                </label>
                ${b.marker === 'category' ? `
                  <label>Folder Toggle Mode
                    <select data-block="categoryMode" ${b.isLocked ? 'disabled' : ''}>
                      <option value="checkbox" ${b.categoryMode === 'checkbox' ? 'selected' : ''}>Checkbox (Allow Multiple Active)</option>
                      <option value="radio" ${b.categoryMode === 'radio' ? 'selected' : ''}>Radio (Only One Active at a Time)</option>
                    </select>
                  </label>
                ` : ''}
              </div>

              <div style="margin-top:10px">
                <label>Only Run on Specific Generation Actions <span class="ps-muted">(Leave all unselected to run on every message)</span>
                  <div class="ps-chips" style="margin-top:4px">
                    ${TRIGGERS.map((tr) => `<button type="button" class="ps-btn-sm ${(b.injectionTrigger || []).includes(tr) ? 'ps-primary' : ''}" data-action="toggle-trigger" data-trigger="${tr}" ${b.isLocked ? 'disabled' : ''}>${tr}</button>`).join('')}
                  </div>
                </label>
              </div>

              <div class="ps-between" style="margin-top:10px">
                <div class="ps-row">
                  <span class="ps-muted">Color Label:</span>
                  <button type="button" class="ps-btn-sm" data-action="set-color" data-color="">None</button>
                  ${SWATCHES.map((c) => `<button type="button" class="ps-swatch-btn" style="background:${c}" data-action="set-color" data-color="${c}" aria-label="Color ${c}" aria-pressed="${b.color === c}"></button>`).join('')}
                </div>
                <div class="ps-actions">
                  ${translationButtons(state, 'translate', b, undefined, Boolean(b.isLocked))}
                  ${ctx.components?.mountLoomBlockEditor ? '<button type="button" class="ps-btn-sm" data-action="editor-mode" data-mode="native">⇄ Native Loom Editor</button>' : ''}
                </div>
              </div>
            </details>

            ${state.translation?.blockId === b.id ? `
              <div class="ps-card" style="margin-top:10px">
                <strong>Translation Preview (${esc(state.translationLanguage)})</strong>
                ${translationPreview(state.translation, 'translation')}
                <div class="ps-actions" style="margin-top:8px">
                  <button type="button" class="ps-primary ps-btn-sm" data-action="apply-translation">Apply Translation</button>
                  <button type="button" class="ps-btn-sm" data-action="discard-translation">Discard</button>
                </div>
              </div>
            ` : ''}

            <div class="ps-between" style="margin-top:12px;padding-top:10px;border-top:1px solid var(--ps-border)">
              <div class="ps-actions">
                <button type="button" class="ps-btn-sm" data-action="duplicate-block">Duplicate Block</button>
              </div>
              <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-block">🗑 Delete Block</button>
            </div>
          </div>
        `}

        ${renderInlineSamplersDrawer(state)}
      </div>

      ${state.showMacroPane && b ? `
        <div class="ps-panel" style="margin:0">
          <div class="ps-between">
            <h4>⚡ Macro Resolution Preview</h4>
            <button type="button" class="ps-btn-sm ps-primary" data-action="refresh-macro">↻ Refresh</button>
          </div>
          <p class="ps-muted" style="margin:4px 0 8px">Dry-evaluated against ${state.chatId ? 'selected chat' : 'global context'}.</p>
          ${macroData?.diagnostics?.length ? `
            <div class="ps-notice" style="border-left-color:var(--ps-warning)">
              <div>
                <strong>${macroData.diagnostics.length} Diagnostic(s):</strong>
                <ul style="margin:4px 0;padding-left:18px">${macroData.diagnostics.map((dg: any) => `<li>${esc(dg.message)}</li>`).join('')}</ul>
              </div>
            </div>
          ` : ''}
          <pre class="ps-result">${esc(state.macroBusy ? 'Resolving macros…' : macroData ? macroData.text || '(Resolved to empty string)' : 'Click Refresh to preview expanded macros.')}</pre>
        </div>
      ` : ''}
    </div>
  `;
}

export function renderVariablesTab(state: any): string {
  const d = state.draft;
  const b = d?.prompt_order?.[state.selected];
  if (!b) {
    return `<div class="ps-panel"><p class="ps-muted">Select a prompt block in Tab 01 first to add or edit user-facing Prompt Variables.</p></div>`;
  }
  const vars: any[] = Array.isArray(b.variables) ? b.variables : [];
  const savedBlockVars = d.metadata?.promptVariables?.[b.id] || {};
  const previewText = resolveBlockVariablesPreview(b, savedBlockVars);
  const diag = buildPresetVariableDiagnostics(d.prompt_order);
  const hasIssues = diag.missing.length > 0 || diag.duplicates.length > 0 || diag.unused.length > 0;

  return `
    <!-- Block Picker + Add Variable Header -->
    <div class="ps-panel" style="padding:12px 14px">
      <div class="ps-between">
        <div class="ps-row">
          <h3 style="margin-right:4px">🎛 User Inputs on Block:</h3>
          <select data-action="select-block-dropdown" style="width:auto;min-width:240px;font-weight:600">
            ${d.prompt_order.map((blk: any, idx: number) => `<option value="${idx}" ${idx === state.selected ? 'selected' : ''}>${esc(blk.name || 'Untitled')}${(blk.variables || []).length ? ` (${blk.variables.length} inputs)` : ''}</option>`).join('')}
          </select>
        </div>
        <div class="ps-actions">
          <button type="button" class="ps-btn-sm ps-primary" data-action="add-variable">＋ Add Blank Variable</button>
        </div>
      </div>

      <!-- Collapsible 1-Click Starter Templates (Open automatically when block has 0 variables) -->
      <details class="ps-collapsible" data-details-id="starter-vars-gallery" ${vars.length === 0 ? 'open' : ''}>
        <summary>
          <span>✨ 1-Click Ready-Made Variable Starters</span>
          <span class="ps-muted">Dropdown, Slider, Switch, Checklist, Text</span>
        </summary>
        <p class="ps-muted" style="margin-bottom:6px">Click any template below to add the user control AND insert its <code>{{var::...}}</code> macro into “${esc(b.name || 'this block')}”.</p>
        <div class="ps-starter-grid">
          ${VARIABLE_STARTER_EXAMPLES.map((ex) => `
            <button type="button" class="ps-starter-card" data-action="apply-starter-variable" data-starter-id="${esc(ex.id)}">
              <div>
                <div class="ps-between" style="width:100%;margin-bottom:4px">
                  <strong style="font-size:0.84rem">${esc(ex.title)}</strong>
                  <span class="ps-pill ps-pill-accent" style="font-size:0.68rem">${esc(ex.badge)}</span>
                </div>
                <p class="ps-muted" style="font-size:0.74rem;line-height:1.3">${esc(ex.summary)}</p>
              </div>
              <div style="font-size:0.74rem;font-weight:700;color:var(--ps-accent);margin-top:8px">＋ Add to Block</div>
            </button>
          `).join('')}
        </div>
      </details>
    </div>

    <!-- Live Interactive Preview (Shown immediately when block has variables) -->
    ${vars.length > 0 ? `
      <div class="ps-panel" style="border-left:3px solid var(--ps-accent)">
        <div class="ps-between">
          <div>
            <h4 style="display:flex;align-items:center;gap:6px"><span>🎮 Live Interactive Preview</span><span class="ps-pill ps-pill-ok">Live</span></h4>
            <p class="ps-muted" style="margin-top:2px">Interact with the controls on the left to see the exact text injected into your prompt on the right.</p>
          </div>
          <button type="button" class="ps-btn-sm" data-action="reset-block-variables">↺ Reset to Defaults</button>
        </div>

        <div class="ps-live-preview-grid">
          <div class="ps-card">
            <strong style="font-size:0.76rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--ps-muted)">User Settings Menu Preview</strong>
            <div id="ps-var-preview-controls-slot" style="margin-top:10px;display:grid;gap:12px"></div>
          </div>
          <div class="ps-card">
            <div class="ps-between">
              <strong style="font-size:0.76rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--ps-accent)">Resolved Block Output</strong>
              <button type="button" class="ps-btn-sm ps-btn-icon" data-action="copy-var-preview-output" title="Copy resolved text">📋</button>
            </div>
            <pre class="ps-result" id="ps-var-preview-output-slot" style="margin-top:8px;max-height:240px">${esc(previewText || '(Block content is empty)')}</pre>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Accurate Prompt Variable Diagnostics (Only shown if true {{var::...}} issues exist) -->
    ${hasIssues ? `
      <details class="ps-panel ps-collapsible" data-details-id="var-health-linter" style="border-left:3px solid var(--ps-warning)">
        <summary>
          <span>🩺 Prompt Variable Diagnostics (${diag.missing.length + diag.duplicates.length + diag.unused.length})</span>
          <span class="ps-pill ps-pill-warn">Click to Review</span>
        </summary>
        <div class="ps-list" style="margin-top:6px">
          ${diag.missing.map((m) => `
            <div class="ps-card ps-between" style="border-left:3px solid var(--ps-warning)">
              <div>
                <strong>Undefined Prompt Variable <code>{{var::${esc(m.name)}}}</code></strong>
                <div class="ps-muted">Referenced in ${esc(m.refs.map((r) => r.blockName).join(', '))}, but not defined on any block.</div>
              </div>
              <button type="button" class="ps-btn-sm" data-action="jump-to-block-id" data-block-id="${esc(m.refs[0].blockId)}">Go to Block →</button>
            </div>
          `).join('')}
          ${diag.duplicates.map((dup) => `
            <div class="ps-card" style="border-left:3px solid var(--ps-danger)">
              <strong>Duplicate Variable ID <code>${esc(dup.name)}</code></strong>
              <div class="ps-muted">Defined in multiple blocks: ${esc(dup.defs.map((df) => df.blockName).join(', '))}</div>
            </div>
          `).join('')}
          ${diag.unused.map((u) => `
            <div class="ps-card ps-between">
              <div>
                <strong>Unreferenced Variable <code>{{var::${esc(u.name)}}}</code></strong>
                <div class="ps-muted">Defined in ${esc(u.defs[0].blockName)}, but <code>{{var::${esc(u.name)}}}</code> is not placed in its prompt text yet.</div>
              </div>
              <button type="button" class="ps-btn-sm ps-primary" data-action="insert-var-into-prompt" data-var-name="${esc(u.name)}">＋ Insert into Prompt</button>
            </div>
          `).join('')}
        </div>
      </details>
    ` : ''}

    <!-- Configured Variables Cards -->
    <div class="ps-list" data-scroll-id="variables-list">
      ${vars.map((v: any, vi: number) => `
        <div class="ps-panel" style="margin:6px 0">
          <div class="ps-between" style="margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--ps-border)">
            <div class="ps-row">
              <span class="ps-step-badge">${vi + 1}</span>
              <strong data-var-card-title="${vi}">${esc(v.label || v.name || 'Variable')}</strong>
              <code class="ps-pill ps-mono" data-var-card-macro="${vi}">{{var::${esc(v.name || 'key')}}}</code>
              <button type="button" class="ps-btn-sm" data-action="insert-var-into-prompt" data-var-insert-btn="${vi}" data-var-name="${esc(v.name || 'key')}">＋ Insert in Prompt</button>
              <button type="button" class="ps-btn-sm ps-btn-icon" data-action="copy-var-macro" data-var-copy-btn="${vi}" data-macro="{{var::${esc(v.name || 'key')}}}" title="Copy macro">📋</button>
            </div>
            <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-variable" data-vindex="${vi}">🗑 Remove</button>
          </div>

          <div class="ps-grid-3">
            <label>Variable ID (used in {{var::ID}})
              <input data-var-index="${vi}" data-var-field="name" value="${esc(v.name || '')}" placeholder="e.g. writing_tone">
            </label>
            <label>Label Shown to User
              <input data-var-index="${vi}" data-var-field="label" value="${esc(v.label || '')}" placeholder="e.g. Writing Tone">
            </label>
            <label>Input Control Type
              <select data-var-index="${vi}" data-var-field="type">
                ${[['text', 'Text Field'], ['textarea', 'Multi-line Text Area'], ['number', 'Number Input'], ['slider', 'Range Slider'], ['select', 'Dropdown Menu'], ['switch', 'On / Off Switch'], ['multiselect', 'Multi-Select Checklist']].map(([tid, tlbl]) => `<option value="${tid}" ${(v.type === 'boolean' ? 'switch' : v.type) === tid ? 'selected' : ''}>${tlbl}</option>`).join('')}
              </select>
            </label>
          </div>

          <div class="ps-grid" style="margin-top:8px">
            <label>Helper Description <span class="ps-muted">(Optional)</span>
              <input data-var-index="${vi}" data-var-field="description" value="${esc(v.description || '')}" placeholder="Explains what this setting controls">
            </label>
            <label>Default Value
              <input data-var-index="${vi}" data-var-field="defaultValue" value="${esc(Array.isArray(v.defaultValue) ? v.defaultValue.join(', ') : v.defaultValue ?? '')}" placeholder="Fallback value">
            </label>
          </div>

          ${v.type === 'textarea' ? `
            <div class="ps-grid" style="margin-top:8px">
              <label>Visible Rows
                <input type="number" min="2" max="20" data-var-index="${vi}" data-var-field="rows" value="${esc(v.rows ?? 4)}">
              </label>
            </div>
          ` : ''}

          ${v.type === 'multiselect' ? `
            <div class="ps-grid" style="margin-top:8px">
              <label>Separator Between Selected Options
                <input data-var-index="${vi}" data-var-field="separator" value="${esc((v.separator ?? '\n\n').replace(/\n/g, '\\n'))}">
              </label>
            </div>
          ` : ''}

          ${['number', 'slider'].includes(v.type) ? `
            <div class="ps-grid-3" style="margin-top:8px">
              <label>Min
                <input type="number" data-var-index="${vi}" data-var-field="min" value="${esc(v.min ?? 0)}">
              </label>
              <label>Max
                <input type="number" data-var-index="${vi}" data-var-field="max" value="${esc(v.max ?? 100)}">
              </label>
              <label>Step
                <input type="number" step="any" data-var-index="${vi}" data-var-field="step" value="${esc(v.step ?? 1)}">
              </label>
            </div>
          ` : ''}

          ${['select', 'multiselect'].includes(v.type) ? `
            <div class="ps-card" style="margin-top:10px">
              <div class="ps-between" style="margin-bottom:6px">
                <strong>Dropdown / Checklist Choices (${(v.options || []).length})</strong>
                <button type="button" class="ps-btn-sm ps-primary" data-action="add-var-option" data-vindex="${vi}">＋ Add Choice</button>
              </div>
              <div class="ps-list">
                ${(v.options || []).map((opt: any, oi: number) => `
                  <div class="ps-row">
                    <input style="flex:0.8" placeholder="ID (e.g. warm)" data-var-index="${vi}" data-opt-index="${oi}" data-opt-field="id" value="${esc(opt.id ?? opt.label ?? '')}">
                    <input style="flex:1" placeholder="Label (e.g. Warm)" data-var-index="${vi}" data-opt-index="${oi}" data-opt-field="label" value="${esc(opt.label || '')}">
                    <input style="flex:2.2" placeholder="Prompt text injected when chosen…" data-var-index="${vi}" data-opt-index="${oi}" data-opt-field="value" value="${esc(opt.value || '')}">
                    <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-var-option" data-vindex="${vi}" data-oindex="${oi}">✕</button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

export function renderRemixAndTranslateTab(state: any): string {
  const subTab = state.remixSubTab || 'mixer';
  const allExpanded = state.importBlocks.length > 0 && state.expandedImports.length >= state.importBlocks.length;
  const allCollapsed = state.expandedImports.length === 0;
  const checkedCount = state.selectedImports.length;
  const perms = state.permissions || {};

  return `
    <!-- Sub-Navigation Bar: Templates & Preset Mixer vs. AI Translator -->
    <div class="ps-panel" style="padding:10px 14px">
      <div class="ps-between">
        <div class="ps-seg-bar">
          <button type="button" data-action="set-remix-subtab" data-subtab="mixer" aria-pressed="${subTab === 'mixer'}">📦 Templates & Preset Mixer</button>
          <button type="button" data-action="set-remix-subtab" data-subtab="translate" aria-pressed="${subTab === 'translate'}">🌐 AI Batch Translator & Status</button>
        </div>
        ${subTab === 'mixer' ? `
          <button type="button" class="ps-btn-sm" data-action="import-template-json">📥 Import Template JSON</button>
        ` : ''}
      </div>
    </div>

    ${subTab === 'mixer' ? `
      <div class="ps-panel">
        <h3>🔀 Copy & Mix Blocks from Another Preset</h3>
        <p class="ps-muted" style="margin-bottom:10px">Pick any preset in your Lumiverse library to preview its blocks and copy them into your active draft.</p>

        <label>Select Source Preset
          <select data-action="import-source">
            <option value="">Choose a preset from your library (${state.presets.length} available)…</option>
            ${selectOptions(state.presets, state.importPreset, (x: any) => x.name)}
          </select>
        </label>

        ${state.importBlocks.length ? `
          <div class="ps-between" style="margin:12px 0 6px">
            <div class="ps-row">
              <strong>Source Blocks (${state.importBlocks.length})</strong>
              ${checkedCount ? `<span class="ps-pill ps-pill-accent">${checkedCount} checked</span>` : ''}
            </div>
            <div class="ps-actions">
              <input style="width:170px;min-height:28px;padding:3px 9px;font-size:0.79rem" placeholder="Filter source blocks…" data-state="remixSearch" value="${esc(state.remixSearch || '')}">
              <button type="button" class="ps-btn-sm ${state.remixEnabledOnly ? 'ps-primary' : ''}" data-action="remix-toggle-enabled-only" aria-pressed="${Boolean(state.remixEnabledOnly)}" title="Show only enabled source blocks">Enabled Only</button>
              <button type="button" class="ps-btn-sm" data-action="collapse-all-imports" ${allCollapsed ? 'disabled' : ''}>▸ Collapse</button>
              <button type="button" class="ps-btn-sm" data-action="expand-all-imports" ${allExpanded ? 'disabled' : ''}>▾ Expand</button>
            </div>
          </div>

          <div class="ps-between" style="margin-bottom:10px;padding:7px 10px;border:1px solid var(--ps-border);border-radius:8px;background:var(--ps-bg)">
            <div class="ps-actions">
              <button type="button" class="ps-btn-sm" data-action="remix-select-all">☑ Select All</button>
              <button type="button" class="ps-btn-sm" data-action="remix-select-enabled" title="Check only enabled non-folder source blocks">✓ Select Enabled</button>
              ${checkedCount ? `<button type="button" class="ps-btn-sm" data-action="remix-select-none">✕ Clear (${checkedCount})</button>` : ''}
              ${checkedCount ? `<button type="button" class="ps-btn-sm ps-primary" data-action="add-checked-imports">＋ Add Checked (${checkedCount})</button>` : ''}
              ${checkedCount ? `<button type="button" class="ps-btn-sm" data-action="collect-blocks">📦 Save Template</button>` : ''}
            </div>
            <div class="ps-actions">
              <button type="button" class="ps-btn-sm" data-action="remix-copy-all" title="Copy all source blocks as formatted text">📋 Copy All</button>
              ${checkedCount ? `<button type="button" class="ps-btn-sm" data-action="remix-copy-checked" title="Copy checked source blocks as text">📋 Copy (${checkedCount})</button>` : ''}
              <button type="button" class="ps-btn-sm" data-action="remix-export-txt" data-scope="all" title="Download full source preset as a .txt file">📄 Export .txt</button>
              ${checkedCount ? `<button type="button" class="ps-btn-sm" data-action="remix-export-txt" data-scope="checked" title="Download checked source blocks as a .txt file">📄 Export (${checkedCount}) .txt</button>` : ''}
            </div>
          </div>

          <details class="ps-collapsible" data-details-id="remix-source-translate" style="margin-bottom:10px" ${state.batchTranslation?.target === 'source' ? 'open' : ''}>
            <summary>
              <span>🌐 Translate Source Blocks Before Copying → ${esc(state.translationLanguage || 'English')}</span>
              <span class="ps-muted" style="font-size:0.76rem">Translates loaded copy only</span>
            </summary>
            <div class="ps-grid" style="margin-bottom:8px">
              <label>Target Language
                <input data-state="translationLanguage" value="${esc(state.translationLanguage)}" placeholder="e.g. English, Japanese, Spanish…">
              </label>
              <label>Translation Model
                <select data-state="translationConnection">
                  <option value="">Active default connection</option>
                  ${selectOptions(state.connections, state.translationConnection, (x: any) => `${x.name} · ${x.model}`)}
                </select>
              </label>
            </div>
            ${bulkControls(state, 'source')}
          </details>

          <div class="ps-list" id="ps-remix-source-slot">
            ${renderRemixSourceListHtml(state)}
          </div>
        ` : ''}
      </div>

      <div class="ps-panel">
        <div class="ps-between">
          <div>
            <h3>📦 Saved Block Templates (${state.templates.length})</h3>
            <p class="ps-muted">Reusable prompt modules you can drop into any preset with one click.</p>
          </div>
          <button type="button" class="ps-btn-sm" data-action="import-template-json">📥 Import JSON</button>
        </div>
        <div class="ps-list" style="margin-top:10px">
          ${state.templates.map((t: any, i: number) => `
            <div class="ps-block">
              <span style="flex:1">
                <strong>${esc(t.name)}</strong>
                <span class="ps-pill ps-pill-accent">${t.entries.length} block${t.entries.length === 1 ? '' : 's'}</span>
              </span>
              <button type="button" class="ps-btn-sm" data-action="copy-template-text" data-index="${i}">📋 Copy</button>
              <button type="button" class="ps-btn-sm ps-primary" data-action="insert-template" data-index="${i}">＋ Insert into Draft</button>
              <button type="button" class="ps-btn-sm" data-action="export-template" data-index="${i}">📤 Export</button>
              <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-template" data-index="${i}">🗑</button>
            </div>
          `).join('') || '<p class="ps-muted">No saved templates yet. Check blocks in Tab 01 or from another preset below and click “📦 Save as Template”.</p>'}
        </div>
      </div>
    ` : `
      <div class="ps-panel">
        <div class="ps-between" style="margin-bottom:8px">
          <div>
            <h3>🌐 AI Preset Translator</h3>
            <p class="ps-muted">Translate block titles and prompts while shielding all <code>{{macros}}</code> from corruption.</p>
          </div>
          <div class="ps-seg-bar">
            <button type="button" data-action="set-translate-target" data-target="draft" aria-pressed="${(state.translateTarget || 'draft') === 'draft'}">📋 Current Draft</button>
            <button type="button" data-action="set-translate-target" data-target="source" aria-pressed="${state.translateTarget === 'source'}">🔀 Source Preset</button>
          </div>
        </div>

        <div class="ps-grid" style="margin-top:10px">
          <label>Target Language
            <input data-state="translationLanguage" value="${esc(state.translationLanguage)}" placeholder="e.g. English, Japanese, Spanish, Korean…">
          </label>
          <label>Translation Model Connection
            <select data-state="translationConnection">
              <option value="">Active default connection</option>
              ${selectOptions(state.connections, state.translationConnection, (x: any) => formatConnectionLabel(x))}
            </select>
          </label>
        </div>

        ${state.translateTarget === 'source' ? `
          <label style="margin-top:10px">Source Preset to Translate
            <select data-action="import-source">
              <option value="">Choose a preset from your library (${state.presets.length} available)…</option>
              ${selectOptions(state.presets, state.importPreset, (x: any) => x.name)}
            </select>
          </label>
        ` : ''}

        <div class="ps-actions" style="margin-top:10px">
          <button type="button" class="ps-primary ps-btn-sm" data-action="save-preferences">Save Language Preference</button>
          ${perms.generation === false ? '<span class="ps-pill ps-pill-warn">⚠ Enable Generation permission to translate</span>' : ''}
        </div>

        ${((state.translateTarget || 'draft') === 'draft' && state.draft) || (state.translateTarget === 'source' && state.importBlocks.length)
          ? bulkControls(state, state.translateTarget || 'draft')
          : state.translateTarget === 'source'
            ? '<p class="ps-muted" style="margin-top:10px">Select a Source Preset above to inspect and translate its blocks.</p>'
            : ''}
      </div>

      ${((state.translateTarget || 'draft') === 'draft' && state.draft) || (state.translateTarget === 'source' && state.importBlocks.length) ? `
        <div class="ps-panel">
          <div class="ps-between" style="margin-bottom:8px">
            <strong>${state.translateTarget === 'source' ? `Source Blocks (${state.importBlocks.length})` : `Draft Blocks (${state.draft.prompt_order.length})`}</strong>
            <div class="ps-actions">
              <input style="width:180px;min-height:28px;padding:3px 9px;font-size:0.79rem" placeholder="Filter blocks…" data-state="translateSearch" value="${esc(state.translateSearch || '')}">
              <button type="button" class="ps-btn-sm" data-action="translate-select-all">Select All</button>
              <button type="button" class="ps-btn-sm" data-action="translate-select-none">Clear</button>
            </div>
          </div>
          <div class="ps-list" id="ps-translate-list-slot" style="max-height:460px;overflow-y:auto" data-scroll-id="translate-list">
            ${renderTranslateBlockListHtml(state)}
          </div>
        </div>
      ` : ''}

      <div class="ps-panel">
        <h4>Extension Permissions Health</h4>
        <div class="ps-chips" style="margin-top:8px">
          ${[['presets', 'Presets CRUD'], ['chats', 'Chats Context'], ['generation', 'LLM Generation & Assembly'], ['app_manipulation', 'Full-Window Mode'], ['regex_scripts', 'Display Regex']].map(([key, label]) => `<span class="ps-pill ${perms[key] ? 'ps-pill-ok' : 'ps-pill-warn'}">${perms[key] ? '✓' : '⚠'} ${label}</span>`).join('')}
        </div>
      </div>
    `}
  `;
}

export function renderTranslateBlockListHtml(state: any): string {
  const target = state.translateTarget === 'source' ? 'source' : 'draft';
  const blocks: any[] = target === 'source' ? state.importBlocks || [] : state.draft?.prompt_order || [];
  const q = (state.translateSearch || '').trim().toLowerCase();

  const rows = blocks
    .map((block: any, idx: number) => ({ block, idx }))
    .filter(({ block }: any) => {
      if (!q) return true;
      return (block.name || '').toLowerCase().includes(q) || (block.content || '').toLowerCase().includes(q);
    });

  if (!rows.length) return '<p class="ps-muted">No blocks match your filter.</p>';

  return rows
    .map(({ block, idx }: any) => {
      const isSource = target === 'source';
      const isLocked = !isSource && Boolean(block.isLocked);
      const isChecked = isSource
        ? (state.selectedImports || []).includes(idx)
        : (state.selectedDraft || []).includes(block.id);
      const pendingSingle = isSource
        ? state.sourceTranslation?.index === idx
          ? state.sourceTranslation
          : null
        : state.translation?.blockId === block.id
          ? state.translation
          : null;
      const previewPrefix = isSource ? 'sourceTranslation' : 'translation';
      const applyAction = isSource ? 'apply-source-translation' : 'apply-translation';
      const discardAction = isSource ? 'discard-source-translation' : 'discard-translation';

      return `
        <article class="ps-card ${block.marker === 'category' ? 'ps-is-cat' : ''}" style="padding:8px 10px">
          <div class="ps-between">
            <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
              ${isSource
                ? `<input style="width:auto;min-height:18px" type="checkbox" data-import-index="${idx}" ${isChecked ? 'checked' : ''}>`
                : `<input style="width:auto;min-height:18px" type="checkbox" data-draft-id="${esc(block.id)}" ${isChecked ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>`}
              <div style="min-width:0;flex:1">
                <div class="ps-row" style="gap:5px">
                  <strong style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(block.name || 'Untitled')}</strong>
                  <span class="ps-pill">${block.marker === 'category' ? 'Folder' : esc(block.marker || block.role)}</span>
                  ${isLocked ? '<span class="ps-pill ps-pill-warn">🔒 Locked</span>' : ''}
                </div>
                ${block.content?.trim() ? `<div class="ps-muted" style="font-size:0.75rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px">${esc(block.content.slice(0, 120))}</div>` : ''}
              </div>
            </div>
            ${translationButtons(state, isSource ? 'translate-source' : 'translate-row', block, idx, isLocked)}
          </div>
          ${pendingSingle ? `
            <div class="ps-card" style="margin-top:8px;border-left:3px solid var(--ps-accent)">
              <strong>Translation Preview (${esc(state.translationLanguage)})</strong>
              ${translationPreview(pendingSingle, previewPrefix)}
              <div class="ps-actions" style="margin-top:8px">
                <button type="button" class="ps-primary ps-btn-sm" data-action="${applyAction}" ${!isSource ? `data-block-id="${esc(block.id)}"` : ''}>${isSource ? 'Apply to Source Block' : 'Apply to Draft'}</button>
                <button type="button" class="ps-btn-sm" data-action="${discardAction}">Discard</button>
              </div>
            </div>
          ` : ''}
        </article>
      `;
    })
    .join('');
}

export function renderRemixSourceListHtml(state: any): string {
  const q = (state.remixSearch || '').trim().toLowerCase();
  const enabledOnly = Boolean(state.remixEnabledOnly);
  const rows = (state.importBlocks || [])
    .map((block: any, i: number) => ({ block, i }))
    .filter(({ block }: any) => {
      if (enabledOnly && (!block.enabled || block.marker === 'category')) return false;
      if (!q) return true;
      return (block.name || '').toLowerCase().includes(q) || (block.content || '').toLowerCase().includes(q);
    });
  if (!rows.length) return '<p class="ps-muted">No source blocks match your search.</p>';
  return rows
    .map(({ block, i }: any) => {
      const isExpanded = state.expandedImports.includes(i);
      const hasSingleTranslation = state.sourceTranslation?.index === i;
      return `
        <article class="ps-card ${block.marker === 'category' ? 'ps-is-cat' : ''}" style="padding:${isExpanded || hasSingleTranslation ? '10px 12px' : '6px 12px'}">
          <div class="ps-between">
            <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
              <input style="width:auto;min-height:18px" type="checkbox" data-import-index="${i}" ${state.selectedImports.includes(i) ? 'checked' : ''}>
              <button type="button" class="ps-btn-sm ps-btn-icon" data-action="toggle-import-expand" data-index="${i}">${isExpanded ? '▾' : '▸'}</button>
              <button type="button" class="ps-block-main" data-action="toggle-import-expand" data-index="${i}">
                <strong>${esc(block.name || 'Untitled')}</strong>
                <span class="ps-pill">${block.marker === 'category' ? 'Folder' : esc(block.marker || block.role)}</span>
              </button>
            </div>
            <div class="ps-actions">
              <button type="button" class="ps-btn-sm" data-action="translate-source" data-scope="${block.content?.trim() ? 'both' : 'name'}" data-index="${i}" ${state.translating || state.permissions?.generation === false ? 'disabled' : ''} title="Translate this source block">🌐</button>
              <button type="button" class="ps-btn-sm" data-action="copy-source-content" data-index="${i}">📋</button>
              <button type="button" class="ps-primary ps-btn-sm" data-action="import-block" data-index="${i}">＋ Add to Draft</button>
            </div>
          </div>
          ${isExpanded ? (block.content ? `<pre class="ps-result" style="margin-top:8px;max-height:170px">${esc(block.content)}</pre>` : '<p class="ps-muted" style="margin-top:6px">Built-in data slot — injects dynamic context.</p>') : ''}
          ${hasSingleTranslation ? `
            <div class="ps-card" style="margin-top:8px;border-left:3px solid var(--ps-accent)">
              <strong>Translated Source Preview (${esc(state.translationLanguage)})</strong>
              ${translationPreview(state.sourceTranslation, 'sourceTranslation')}
              <div class="ps-actions" style="margin-top:8px">
                <button type="button" class="ps-primary ps-btn-sm" data-action="apply-source-translation">Apply to Source Block</button>
                <button type="button" class="ps-btn-sm" data-action="discard-source-translation">Discard</button>
              </div>
            </div>
          ` : ''}
        </article>
      `;
    })
    .join('');
}

export function renderXRayListOnlyHtml(state: any): string {
  const breakdown = Array.isArray(state.assembled?.breakdown) ? state.assembled.breakdown : [];
  const filtered = breakdown
    .map((item: any, origIdx: number) => ({ item, origIdx }))
    .filter(({ item }: any) => {
      if (state.breakdownFilter !== 'all' && item.type !== state.breakdownFilter && item.role !== state.breakdownFilter) return false;
      if ((state.breakdownSearch || '').trim()) {
        const q = state.breakdownSearch.toLowerCase();
        return (item.name || '').toLowerCase().includes(q) || (item.content || '').toLowerCase().includes(q);
      }
      return true;
    });
  return (
    filtered
      .map(
        ({ item, origIdx }: any) => `
          <details class="ps-card" data-details-id="xray-${origIdx}">
            <summary class="ps-between" style="cursor:pointer">
              <span><strong>${esc(item.name || item.type || `Entry ${origIdx + 1}`)}</strong> <span class="ps-pill">${esc(item.role)}</span></span>
              <span class="ps-muted">~${Math.ceil((item.content || '').length / 4)}t</span>
            </summary>
            <div class="ps-between" style="margin-top:6px">
              <span class="ps-muted" style="font-size:0.74rem">Type: ${esc(item.type || 'block')}</span>
              <button type="button" class="ps-btn-sm" data-action="copy-xray-entry" data-xray-idx="${origIdx}">📋 Copy</button>
            </div>
            <pre class="ps-result" style="margin-top:6px">${esc(item.content || '(empty)')}</pre>
          </details>
        `,
      )
      .join('') || '<p class="ps-muted">No items match filter.</p>'
  );
}

export function renderXRayBreakdownInline(state: any): string {
  const a = state.assembled;
  if (!a) {
    return `<div class="ps-empty-state"><div style="font-size:1.5rem;margin-bottom:6px">🔬</div><strong>No Prompt Assembled Yet</strong><p class="ps-muted" style="margin-top:4px">Click <strong>🔬 Inspect Prompt X-Ray</strong> or <strong>▶ Run Test</strong> on the left to inspect every assembled block, World Info entry, and token distribution.</p></div>`;
  }
  const sourceLabel =
    a.source === 'custom'
      ? 'Custom Prompt'
      : a.source === 'preset-standalone'
        ? 'Preset Draft (Standalone)'
        : a.source === 'saved'
          ? 'Saved Preset'
          : 'Preset Draft';
  const d = state.draft;
  const nonCatBlocks = (d?.prompt_order || []).filter((b: any) => b.marker !== 'category');
  const enabledCount = nonCatBlocks.filter((b: any) => b.enabled).length;
  const breakdown = Array.isArray(a.breakdown) ? a.breakdown : [];
  const buckets = { block: 0, chat_history: 0, world_info: 0, memory: 0, authors_note: 0, other: 0 };
  breakdown.forEach((item: any) => {
    const est = Math.ceil((item.content || '').length / 4);
    if (item.type === 'block' || item.type === 'append') buckets.block += est;
    else if (item.type === 'chat_history') buckets.chat_history += est;
    else if (item.type === 'world_info') buckets.world_info += est;
    else if (item.type === 'long_term_memory') buckets.memory += est;
    else if (item.type === 'authors_note') buckets.authors_note += est;
    else buckets.other += est;
  });
  const totalEst = Math.max(1, buckets.block + buckets.chat_history + buckets.world_info + buckets.memory + buckets.authors_note + buckets.other);
  const legendItems = [
    { label: 'Blocks', color: '#a795e8', tokens: buckets.block },
    { label: 'History', color: '#64b5f6', tokens: buckets.chat_history },
    { label: 'Lore', color: '#81c784', tokens: buckets.world_info },
    { label: 'Memory', color: '#ffb74d', tokens: buckets.memory },
    { label: "Author's Note", color: '#f06292', tokens: buckets.authors_note },
  ];

  return `
    <div>
      <div class="ps-between" style="margin-bottom:8px">
        <span class="ps-muted">Source: <strong>${sourceLabel}</strong> (${enabledCount} active blocks · ~${totalEst.toLocaleString()} est. tokens)</span>
        <div class="ps-actions">
          <button type="button" class="ps-btn-sm" data-action="toggle-xray-expand-all">↕ Expand/Collapse</button>
          <button type="button" class="ps-btn-sm" data-action="copy-xray-messages">📋 Copy JSON</button>
        </div>
      </div>

      <div class="ps-bar-stack" title="Token distribution">
        <div class="ps-bar-seg" style="width:${(buckets.block / totalEst) * 100}%;background:#a795e8"></div>
        <div class="ps-bar-seg" style="width:${(buckets.chat_history / totalEst) * 100}%;background:#64b5f6"></div>
        <div class="ps-bar-seg" style="width:${(buckets.world_info / totalEst) * 100}%;background:#81c784"></div>
        <div class="ps-bar-seg" style="width:${(buckets.memory / totalEst) * 100}%;background:#ffb74d"></div>
        <div class="ps-bar-seg" style="width:${(buckets.authors_note / totalEst) * 100}%;background:#f06292"></div>
      </div>

      <div class="ps-xray-legend">
        ${legendItems
          .map(
            (lg) => `<span class="ps-xray-legend-item" style="opacity:${lg.tokens > 0 ? 1 : 0.45}"><span class="ps-dot" style="background:${lg.color}"></span>${esc(lg.label)} <strong>${lg.tokens}t</strong></span>`,
          )
          .join('')}
      </div>

      <div class="ps-between" style="margin:8px 0">
        <div class="ps-chips">
          ${[['all', 'All'], ['block', 'Blocks'], ['chat_history', 'History'], ['world_info', 'Lore'], ['authors_note', "Author's Note"]].map(([id, lbl]) => `<button type="button" class="ps-btn-sm ${state.breakdownFilter === id ? 'ps-primary' : ''}" data-action="filter-breakdown" data-filter="${id}">${lbl}</button>`).join('')}
        </div>
        <input style="width:165px;max-width:100%;min-height:28px;padding:3px 8px;font-size:0.78rem" placeholder="Filter X-Ray…" data-state="breakdownSearch" value="${esc(state.breakdownSearch)}">
      </div>

      <div class="ps-list" id="ps-xray-list-slot" style="max-height:500px;overflow-y:auto" data-scroll-id="xray-list">
        ${renderXRayListOnlyHtml(state)}
      </div>
    </div>
  `;
}

function renderRunPromptsSection(run: any, runIdx: number, detailsId: string): string {
  const s = run?.promptSummary;
  const msgs: any[] = Array.isArray(s?.messages) ? s.messages : [];
  const blockNames: string[] = Array.isArray(s?.activeBlockNames) ? s.activeBlockNames : [];
  const customPrompt = s?.customPrompt || '';
  const presetName = s?.presetName || run?.presetName || 'Draft';
  const chatLabel = s?.chatName || (s?.standalone ? 'Standalone (No Chat)' : '');
  const modelLabel = s?.model || run?.connection || '';
  const hasPromptDetails = msgs.length > 0 || Boolean(customPrompt) || blockNames.length > 0 || Boolean(run?.userPromptPreview);

  return `
    <div class="ps-run-meta-strip">
      <span class="ps-pill ps-pill-accent">${s?.promptSource === 'custom' ? '✍️ Custom Prompt' : `📋 ${esc(presetName)}`}</span>
      ${chatLabel ? `<span class="ps-pill">${s?.standalone ? '⚡ ' : '💬 '}${esc(chatLabel)}</span>` : ''}
      ${modelLabel ? `<span class="ps-pill">${esc(modelLabel)}</span>` : ''}
      ${s?.temperature !== undefined && s?.temperature !== '' ? `<span class="ps-pill">Temp ${esc(s.temperature)}</span>` : ''}
      ${run?.activeBlocksCount !== undefined && s?.promptSource !== 'custom' ? `<span class="ps-pill">${run.activeBlocksCount} blk</span>` : ''}
      ${run?.usage?.prompt_tokens || run?.usage?.completion_tokens ? `<span class="ps-pill ps-pill-ok">P:${run.usage.prompt_tokens || 0}t · C:${run.usage.completion_tokens || 0}t</span>` : ''}
    </div>
    ${hasPromptDetails ? `
      <details class="ps-collapsible" data-details-id="${esc(detailsId)}" style="margin-top:8px;padding:7px 10px">
        <summary>
          <span>🧾 Prompts Used ${msgs.length ? `(${msgs.length} msgs)` : ''}</span>
          <span class="ps-muted" style="font-size:0.74rem">${s?.promptSource === 'custom' ? 'Custom' : `${blockNames.length || run?.activeBlocksCount || 0} active blocks`}</span>
        </summary>
        <div class="ps-between" style="margin-bottom:6px">
          <span class="ps-muted" style="font-size:0.74rem">${s?.generationType ? `Trigger: ${esc(s.generationType)}` : ''}</span>
          ${msgs.length || customPrompt ? `<button type="button" class="ps-btn-sm" data-action="copy-run-prompts" data-run-idx="${runIdx}">📋 Copy Prompts</button>` : ''}
        </div>
        ${blockNames.length ? `
          <div class="ps-chips" style="margin-bottom:8px">
            ${blockNames.map((n) => `<span class="ps-pill">${esc(n)}</span>`).join('')}
          </div>
        ` : ''}
        ${customPrompt && !msgs.length ? `<pre class="ps-result" style="max-height:150px;margin-bottom:6px">${esc(customPrompt)}</pre>` : ''}
        ${msgs.length ? `
          <div class="ps-list" style="max-height:220px;overflow-y:auto">
            ${msgs
              .map(
                (m) => `
                  <div class="ps-ab-prompt-msg">
                    <div class="ps-between" style="margin-bottom:3px">
                      <span class="ps-pill">${esc(String(m.role || 'system').toUpperCase())}</span>
                      <span class="ps-muted" style="font-size:0.72rem">~${Math.ceil(String(m.content || '').length / 4)}t</span>
                    </div>
                    <div style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(m.content || '')}</div>
                  </div>
                `,
              )
              .join('')}
          </div>
        ` : run?.userPromptPreview ? `
          <div class="ps-muted" style="font-size:0.76rem"><strong>Input:</strong> ${esc(run.userPromptPreview)}</div>
        ` : '<p class="ps-muted">Detailed prompt snapshot not recorded for this legacy run.</p>'}
      </details>
    ` : ''}
  `;
}

export function renderTestTab(state: any): string {
  const runs: any[] = Array.isArray(state.runs) ? state.runs : [];
  const activeRunIdx =
    typeof state.viewingRunIndex === 'number' && state.viewingRunIndex >= 0 && state.viewingRunIndex < runs.length
      ? state.viewingRunIndex
      : runs.length - 1;
  const viewedRun = !state.busy && activeRunIdx >= 0 ? runs[activeRunIdx] : null;
  const activeReasoning = state.busy ? state.reasoning : (viewedRun?.reasoning ?? state.reasoning);
  const activeUsage = state.busy ? state.lastUsage : (viewedRun?.usage ?? state.lastUsage);
  const hasReplyContent = Boolean(state.busy ? state.result : (viewedRun?.content || state.result));

  const idxA = Math.max(0, Math.min(Number(state.compareA) || 0, Math.max(0, runs.length - 1)));
  const idxB = Math.max(0, Math.min(Number(state.compareB) || 0, Math.max(0, runs.length - 1)));
  const runA = runs[idxA];
  const runB = runs[idxB];
  const isCustomPromptMode = state.testPromptSource === 'custom';
  const isMultiTurn = state.testTurnMode === 'multi';
  const turns = Array.isArray(state.testTurns) ? state.testTurns : [];
  const an = state.authorsNote || { enabled: false, content: '', depth: 4, role: 'system' };
  const isChatView = (state.testReplyViewMode || 'chat') === 'chat';
  const outTab = state.testOutputTab || 'reply';
  const breakdownCount = Array.isArray(state.assembled?.breakdown) ? state.assembled.breakdown.length : 0;
  const isStandalone = !state.chatId;
  const selectedChatObj = state.chatId ? state.chats.find((c: any) => c.id === state.chatId) : null;
  const selectedConnObj = state.connections.find((c: any) => c.id === state.connectionId);

  return `
    <div class="ps-test-columns">
      <!-- Left Column: Streamlined Test Controls -->
      <div class="ps-test-col-ctrl">
        <div class="ps-panel" style="margin-top:0">
          <div class="ps-between" style="margin-bottom:10px">
            <strong>Prompt Source</strong>
            <div class="ps-seg-bar">
              <button type="button" data-action="set-test-prompt-source" data-source="preset" aria-pressed="${!isCustomPromptMode}">📋 Preset Draft</button>
              <button type="button" data-action="set-test-prompt-source" data-source="custom" aria-pressed="${isCustomPromptMode}">✍️ Custom Prompt</button>
            </div>
          </div>

          ${isCustomPromptMode ? `
            <div class="ps-card" style="margin-bottom:10px">
              <div class="ps-between" style="margin-bottom:6px">
                <label style="display:inline-flex;align-items:center;gap:6px;font-size:0.78rem;cursor:pointer;color:var(--ps-text)">
                  <input type="checkbox" style="width:auto;min-height:16px" data-custom-check="history" ${state.testCustomPromptIncludeHistory ? 'checked' : ''} ${isStandalone ? 'disabled' : ''}>
                  <span>Include Chat History</span>
                </label>
                <div class="ps-actions">
                  <button type="button" class="ps-btn-sm" data-action="copy-custom-test-prompt">📋</button>
                  <button type="button" class="ps-btn-sm" data-action="open-test-custom-prompt-editor">⤢ Fullscreen</button>
                </div>
              </div>
              <textarea data-state="testCustomPrompt" class="ps-content" style="min-height:100px" placeholder="Write custom system instructions to test… (Ctrl+Enter to run)">${esc(state.testCustomPrompt)}</textarea>
            </div>
          ` : ''}

          <div class="ps-grid" style="margin-bottom:8px">
            <label>
              <span class="ps-between" style="width:100%">
                <span>Context Chat ${state.chats.length ? `(${state.chats.length})` : ''}</span>
                ${isStandalone
                  ? '<span class="ps-pill ps-pill-accent" style="font-size:0.68rem">Standalone</span>'
                  : '<button type="button" class="ps-btn-sm" style="min-height:20px !important;padding:1px 6px !important;font-size:0.7rem !important" data-action="use-standalone-chat" title="Run without any context chat">✕ No Chat</button>'}
              </span>
              <select data-state="chatId">
                <option value="" ${isStandalone ? 'selected' : ''}>None — No Context Chat (Standalone)</option>
                ${selectOptions(state.chats, state.chatId, (x: any) => x.name || x.id)}
              </select>
            </label>
            <label>Model Connection
              <select data-state="connectionId">
                <option value="">Active default connection</option>
                ${selectOptions(state.connections, state.connectionId, (x: any) => formatConnectionLabel(x))}
              </select>
            </label>
          </div>

          <div style="margin-bottom:8px">
            <label>
              <span class="ps-between" style="width:100%">
                <span>Model Override <span class="ps-muted" style="font-weight:400">(optional)</span></span>
                ${state.testModelOverride ? '<button type="button" class="ps-btn-sm" data-action="clear-test-model-override" style="min-height:20px !important;padding:1px 6px !important;font-size:0.7rem !important">✕ Reset</button>' : ''}
              </span>
              <input data-state="testModelOverride" value="${esc(state.testModelOverride || '')}" placeholder="Leave blank to use connection's saved model…">
            </label>
          </div>

          ${(() => {
            const permsOk = state.permissions?.generation !== false;
            const resolvedConn = state.connectionId
              ? state.connections.find((c: any) => c.id === state.connectionId)
              : state.connections.find((c: any) => c.is_default) || state.connections[0];
            const warnings: string[] = [];
            if (!permsOk) warnings.push('Enable the "generation" permission in Extensions to load connections and run tests.');
            else if (state.connectionsError) warnings.push(`Could not load connections: ${state.connectionsError}`);
            else if (!state.connections.length) warnings.push('No LLM connections found. Add a connection in Lumiverse Connections first.');
            else if (resolvedConn) {
              if (resolvedConn.has_api_key === false) warnings.push(`Connection "${resolvedConn.name}" has no API key configured.`);
              if (!cleanModelName(resolvedConn.model) && !cleanModelName(state.testModelOverride)) {
                warnings.push(`Connection "${resolvedConn.name}" has no model set — pick one in Model Override above.`);
              }
            }
            return warnings.length
              ? `<div class="ps-notice" style="border-left-color:var(--ps-warning);margin-bottom:8px"><span>⚠ ${esc(warnings.join(' '))}</span></div>`
              : '';
          })()}

          ${isStandalone ? `
            <div class="ps-standalone-hint">
              ⚡ <strong>Standalone mode (no context chat):</strong> Character, lorebook, and chat history slots are omitted. Enabled prompt blocks, variables, test turns, and Author's Note run directly.
            </div>
          ` : ''}

          <!-- Test Message or Multi-Turn Thread -->
          <div style="margin-bottom:10px">
            <div class="ps-between" style="margin-bottom:6px">
              <strong style="font-size:0.84rem">Test User Message <span class="ps-muted" style="font-weight:400;font-size:0.74rem">(Ctrl+Enter to run)</span></strong>
              <div class="ps-seg-bar">
                <button type="button" data-action="set-test-turn-mode" data-mode="single" aria-pressed="${!isMultiTurn}">Single Turn</button>
                <button type="button" data-action="set-test-turn-mode" data-mode="multi" aria-pressed="${isMultiTurn}">Thread (${turns.length})</button>
              </div>
            </div>

            ${!isMultiTurn ? `
              <textarea data-state="custom" style="min-height:74px" placeholder="${isStandalone ? 'Type a user prompt to test your preset or custom prompt standalone…' : 'Optional: type a user message to append to the chat before generating…'}">${esc(state.custom)}</textarea>
            ` : `
              <div class="ps-card" style="padding:8px">
                <div class="ps-between" style="margin-bottom:6px">
                  <div class="ps-actions">
                    <button type="button" class="ps-btn-sm ps-primary" data-action="add-test-turn">＋ Turn</button>
                    <button type="button" class="ps-btn-sm" data-action="fill-dummy-turns">⚡ ＋ 5 Mock Turns</button>
                  </div>
                  <button type="button" class="ps-btn-sm ps-danger-btn" data-action="clear-test-turns" ${!turns.length ? 'disabled' : ''}>Clear</button>
                </div>
                <div class="ps-list" style="max-height:210px;overflow-y:auto">
                  ${turns.map((turn: any, ti: number) => `
                    <div class="ps-card" style="padding:6px 8px">
                      <div class="ps-between" style="margin-bottom:4px">
                        <span class="ps-pill">#${ti + 1}</span>
                        <div class="ps-actions">
                          <select style="min-height:24px;font-size:0.75rem;width:auto" data-turn-idx="${ti}" data-turn-field="role">
                            <option value="user" ${turn.role === 'user' ? 'selected' : ''}>User</option>
                            <option value="assistant" ${turn.role === 'assistant' ? 'selected' : ''}>Assistant</option>
                            <option value="system" ${turn.role === 'system' ? 'selected' : ''}>System</option>
                          </select>
                          <button type="button" class="ps-btn-sm ps-danger-btn ps-btn-icon" data-action="delete-test-turn" data-turn-idx="${ti}">✕</button>
                        </div>
                      </div>
                      <textarea data-turn-idx="${ti}" data-turn-field="content" style="min-height:44px;font-size:0.84rem" placeholder="Turn #${ti + 1} text…">${esc(turn.content)}</textarea>
                    </div>
                  `).join('') || '<p class="ps-muted" style="text-align:center;padding:8px 0">Click “＋ Turn” to build a test thread.</p>'}
                </div>
              </div>
            `}
          </div>

          <!-- Primary Action Buttons -->
          <div class="ps-between" style="margin-top:12px;gap:8px">
            <button type="button" class="ps-btn-sm" data-action="preview" ${state.busy ? 'disabled' : ''}>🔬 Inspect X-Ray</button>
            <div class="ps-actions">
              ${runs.length > 0 ? `<button type="button" class="ps-btn-sm" data-action="run" ${state.busy ? 'disabled' : ''} title="Regenerate with your latest preset/prompt edits (works with or without a context chat)">↻ Regenerate</button>` : ''}
              <button type="button" class="ps-primary" style="min-height:38px;padding:6px 16px" data-action="run" ${state.busy ? 'disabled' : ''}>▶ ${runs.length > 0 ? 'New Run' : 'Generate Reply'}</button>
              <button type="button" class="ps-danger-btn ps-btn-sm ${state.busy ? 'ps-danger-active' : ''}" data-action="stop" ${!state.busy ? 'disabled' : ''}>■ Stop</button>
            </div>
          </div>

          <!-- Optional Author's Note & Trigger Settings -->
          <details class="ps-collapsible" data-details-id="authors-note-collapsible" ${an.enabled ? 'open' : ''}>
            <summary>
              <span>📝 Author's Note & Trigger Options</span>
              <span class="ps-pill ${an.enabled ? 'ps-pill-ok' : ''}">${an.enabled ? `Note On (Depth ${an.depth})` : 'Optional'}</span>
            </summary>
            <div class="ps-between" style="margin-bottom:6px">
              <span class="ps-muted">Inject an in-chat director's note:</span>
              <button type="button" class="ps-btn-sm ${an.enabled ? 'ps-toggle-on' : ''}" data-action="toggle-authors-note">${an.enabled ? '● Enabled' : '○ Off'}</button>
            </div>
            <div class="ps-chips" style="margin-bottom:6px">
              ${AUTHORS_NOTE_PRESETS.map((p, pIdx) => `<button type="button" class="ps-btn-sm" data-action="set-authors-note-preset" data-preset-idx="${pIdx}">${esc(p.label)}</button>`).join('')}
            </div>
            <textarea data-authors-note="content" style="min-height:54px;font-size:0.84rem" placeholder="[Style: vivid sensory descriptions, slow pacing]">${esc(an.content)}</textarea>
            <div class="ps-grid-3" style="margin-top:8px">
              <label>Depth
                <input type="number" min="0" max="40" data-authors-note="depth" value="${esc(an.depth ?? 4)}">
              </label>
              <label>Note Role
                <select data-authors-note="role">
                  <option value="system" ${an.role === 'system' ? 'selected' : ''}>System</option>
                  <option value="user" ${an.role === 'user' ? 'selected' : ''}>User</option>
                  <option value="assistant" ${an.role === 'assistant' ? 'selected' : ''}>Assistant</option>
                </select>
              </label>
              <label>Trigger Mode
                <select data-state="generationType">
                  ${['normal', 'continue', 'regenerate', 'swipe', 'impersonate'].map((x) => `<option ${state.generationType === x ? 'selected' : ''}>${x}</option>`).join('')}
                </select>
              </label>
            </div>
            <div class="ps-actions" style="margin-top:8px">
              <button type="button" class="ps-btn-sm" data-action="profile" ${isStandalone ? 'disabled title="Requires a Context Chat or open native Preset Editor"' : ''}>Sync Active States from Chat</button>
              <button type="button" class="ps-btn-sm" data-action="dry" ${state.busy || !state.draft.id || isStandalone ? 'disabled' : ''} title="${isStandalone ? 'Saved-Preset Dry Run requires a Context Chat; use Inspect X-Ray for standalone mode' : 'Run Lumiverse saved-preset dry run'}">Saved-Preset Dry Run</button>
            </div>
          </details>

          <!-- Multi-Swipe & Model Matrix Runner -->
          <details class="ps-collapsible" data-details-id="test-matrix-collapsible" ${state.matrixRunning ? 'open' : ''}>
            <summary>
              <span>🧪 Multi-Run &amp; Model Matrix</span>
              <span class="ps-muted" style="font-size:0.75rem">${state.matrixRunning ? esc(state.matrixStatus || 'Running…') : 'Swipes &amp; Multi-Model'}</span>
            </summary>
            <div style="display:grid;gap:10px">
              <div class="ps-between">
                <span class="ps-muted" style="font-size:0.78rem">Test consistency with multiple swipes:</span>
                <div class="ps-actions">
                  ${[2, 3, 4].map((n) => `<button type="button" class="ps-btn-sm" data-action="run-multi-swipe" data-count="${n}" ${state.busy ? 'disabled' : ''}>⚡ ×${n} Swipes</button>`).join('')}
                </div>
              </div>
              ${state.connections.length > 1 ? `
                <div class="ps-card" style="padding:8px">
                  <div class="ps-between" style="margin-bottom:6px">
                    <strong style="font-size:0.79rem">Compare Across Connections (${(state.matrixConnections || []).length})</strong>
                    <div class="ps-actions">
                      <button type="button" class="ps-btn-sm" data-action="matrix-select-all">All</button>
                      <button type="button" class="ps-btn-sm" data-action="matrix-select-none">Clear</button>
                    </div>
                  </div>
                  <div class="ps-chips" style="max-height:110px;overflow-y:auto">
                    ${state.connections
                      .map(
                        (c: any) => `
                          <label style="display:inline-flex;align-items:center;gap:5px;flex:0 0 auto;font-size:0.76rem;padding:3px 7px;border:1px solid var(--ps-border);border-radius:6px;cursor:pointer;color:var(--ps-text)">
                            <input type="checkbox" style="width:auto;min-height:14px" data-matrix-conn="${esc(c.id)}" ${(state.matrixConnections || []).includes(c.id) ? 'checked' : ''}>
                            <span>${esc(c.name)}</span>
                          </label>
                        `,
                      )
                      .join('')}
                  </div>
                  <div class="ps-between" style="margin-top:8px">
                    <span class="ps-muted" style="font-size:0.75rem">${state.matrixRunning ? esc(state.matrixStatus || 'Running matrix…') : 'Runs the same prompt on each checked model.'}</span>
                    <button type="button" class="ps-btn-sm ps-primary" data-action="run-matrix" ${state.busy || !(state.matrixConnections || []).length ? 'disabled' : ''}>▶ Run Matrix (${(state.matrixConnections || []).length})</button>
                  </div>
                </div>
              ` : ''}
            </div>
          </details>
        </div>
      </div>

      <!-- Right Column: Tabbed Output Inspector (Reply | Prompt X-Ray | A/B Compare) -->
      <div class="ps-test-col-output">
        <div class="ps-panel" style="margin-top:0">
          <div class="ps-between" style="margin-bottom:10px">
            <div class="ps-seg-bar">
              <button type="button" data-action="set-test-output-tab" data-outtab="reply" aria-pressed="${outTab === 'reply'}">💬 Reply Preview ${state.busy ? '· ●' : ''}</button>
              <button type="button" data-action="set-test-output-tab" data-outtab="xray" aria-pressed="${outTab === 'xray'}">🔬 Prompt X-Ray ${breakdownCount ? `(${breakdownCount})` : ''}</button>
              <button type="button" data-action="set-test-output-tab" data-outtab="compare" aria-pressed="${outTab === 'compare'}">⚖️ A/B Runs (${state.runs.length})</button>
            </div>

            ${outTab === 'reply' ? `
              <div class="ps-actions">
                ${state.busy ? `<span class="ps-pill ps-pill-accent"><span class="ps-live-dot"></span> Streaming · <span data-stream-counter>${state.result.length.toLocaleString()} chars</span></span>` : ''}
                ${!state.busy && activeUsage ? `<span class="ps-pill ps-pill-ok">P: ${activeUsage.prompt_tokens || 0}t · C: ${activeUsage.completion_tokens || 0}t</span>` : ''}
                <button type="button" class="ps-btn-sm ${isChatView ? 'ps-primary' : ''}" data-action="set-reply-view-mode" data-mode="chat">Chat</button>
                <button type="button" class="ps-btn-sm ${!isChatView ? 'ps-primary' : ''}" data-action="set-reply-view-mode" data-mode="raw">Raw</button>
                <button type="button" class="ps-btn-sm" data-action="copy-test-reply" ${!hasReplyContent ? 'disabled' : ''} title="Copy this reply">📋</button>
              </div>
            ` : ''}
          </div>

          ${outTab === 'reply' ? `
            <!-- Live Context / Active Configuration Strip -->
            ${state.busy ? `
              <div class="ps-run-meta-strip" style="margin-bottom:10px">
                <span class="ps-pill ps-pill-accent">${isCustomPromptMode ? '✍️ Custom Prompt' : `📋 ${esc(state.draft?.name || 'Draft')}`}</span>
                <span class="ps-pill">${isStandalone ? '⚡ Standalone (No Chat)' : `💬 ${esc(selectedChatObj?.name || state.chatId)}`}</span>
                <span class="ps-pill">${esc(selectedConnObj ? `${selectedConnObj.name} · ${selectedConnObj.model}` : 'Active default connection')}</span>
              </div>
            ` : ''}

            <!-- Swipe / Run History Deck Bar -->
            ${runs.length > 0 ? `
              <div class="ps-card ps-between" style="margin-bottom:10px;padding:7px 10px;background:var(--ps-bg)">
                <div class="ps-row">
                  <button type="button" class="ps-btn-sm ps-btn-icon" data-action="swipe-run-prev" ${state.busy || activeRunIdx <= 0 ? 'disabled' : ''} title="Previous test run">◀</button>
                  <span style="font-size:0.82rem;font-weight:650">
                    Run #${activeRunIdx + 1} of ${runs.length}
                  </span>
                  <button type="button" class="ps-btn-sm ps-btn-icon" data-action="swipe-run-next" ${state.busy || activeRunIdx >= runs.length - 1 ? 'disabled' : ''} title="Next test run">▶</button>
                  ${viewedRun ? `
                    <span class="ps-pill">${esc(viewedRun.time)}</span>
                    <span class="ps-pill ps-pill-accent" title="Preset / prompt used">${viewedRun.promptSummary?.promptSource === 'custom' ? '✍️ Custom Prompt' : `${esc(viewedRun.promptSummary?.presetName || viewedRun.presetName || 'Draft')} · ${viewedRun.activeBlocksCount ?? '?'} blk`}</span>
                    <span class="ps-pill">${viewedRun.promptSummary?.standalone ? '⚡ Standalone' : viewedRun.promptSummary?.chatName ? `💬 ${esc(viewedRun.promptSummary.chatName)}` : esc(viewedRun.connection || '')}</span>
                    ${viewedRun.promptSummary?.durationMs ? `<span class="ps-pill">${(viewedRun.promptSummary.durationMs / 1000).toFixed(1)}s</span>` : ''}
                  ` : ''}
                </div>
                <div class="ps-actions">
                  <button type="button" class="ps-btn-sm ps-ab-star-btn" data-action="toggle-run-star" data-run-idx="${activeRunIdx}" aria-pressed="${Boolean(viewedRun?.starred)}" title="Star / bookmark this run">★</button>
                  <button type="button" class="ps-btn-sm" data-action="export-runs-txt" data-scope="single" data-run-idx="${activeRunIdx}" title="Export this run as .txt">📄 .txt</button>
                  <button type="button" class="ps-btn-sm" data-action="open-ab-window" title="Open A/B Comparison in full window">⤢ Full A/B</button>
                  <button type="button" class="ps-btn-sm ps-primary" data-action="run" ${state.busy ? 'disabled' : ''} title="Regenerate using your latest preset/prompt edits">↻ Regenerate</button>
                  ${runs.length >= 2 ? `<button type="button" class="ps-btn-sm" data-action="compare-current-swipe" ${state.busy ? 'disabled' : ''} title="Compare this run side-by-side with the previous run">⚖️ Diff</button>` : ''}
                  ${viewedRun?.snapshot ? `<button type="button" class="ps-btn-sm" data-action="restore-run-snapshot" data-run-idx="${activeRunIdx}" ${state.busy ? 'disabled' : ''} title="Restore your preset draft to the exact blocks & samplers used in Run #${activeRunIdx + 1}">↺ Restore Preset</button>` : ''}
                  <button type="button" class="ps-btn-sm ps-danger-btn ps-btn-icon" data-action="delete-run-item" data-run-idx="${activeRunIdx}" ${state.busy ? 'disabled' : ''} title="Delete this run from history">🗑</button>
                </div>
              </div>
              ${viewedRun?.userPromptPreview ? `
                <div class="ps-muted" style="font-size:0.76rem;margin-bottom:8px;padding:0 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                  <strong>Prompted:</strong> “${esc(viewedRun.userPromptPreview)}”
                </div>
              ` : ''}
            ` : ''}

            ${activeReasoning ? `
              <details class="ps-collapsible" style="margin:0 0 10px 0" open>
                <summary class="ps-between">
                  <span>💭 Chain-of-Thought Reasoning</span>
                  <button type="button" class="ps-btn-sm" data-action="copy-test-reasoning">📋 Copy</button>
                </summary>
                <div class="ps-result ps-reasoning-box" style="max-height:160px">${esc(activeReasoning)}</div>
              </details>
            ` : ''}

            <div class="ps-chat-bubble" id="ps-chat-reply-bubble" aria-live="polite"></div>

            ${hasReplyContent && !state.busy ? `
              <div class="ps-between" style="margin-top:10px;padding-top:8px;border-top:1px solid var(--ps-border)">
                <div class="ps-actions">
                  ${runs.length > 1 ? `<button type="button" class="ps-btn-sm ps-danger-btn" data-action="clear-run-history">Clear All ${runs.length} Runs</button>` : ''}
                </div>
                <div class="ps-actions">
                  <button type="button" class="ps-btn-sm" data-action="run">↻ Regenerate Turn</button>
                  <button type="button" class="ps-primary ps-btn-sm" data-action="continue-test-dialogue">💬 Append to Thread &amp; Reply →</button>
                </div>
              </div>
            ` : ''}
          ` : outTab === 'xray' ? `
            ${renderXRayBreakdownInline(state)}
          ` : `
            ${renderAbComparisonView(state, false)}
          `}
        </div>
      </div>
    </div>
  `;
}

export function getNormalizedSelectedRunIndices(state: any): number[] {
  const runs: any[] = Array.isArray(state.runs) ? state.runs : [];
  if (!runs.length) return [];
  const raw: number[] = Array.isArray(state.selectedRuns) ? state.selectedRuns : [];
  const valid = [...new Set(raw.map(Number).filter((i) => Number.isInteger(i) && i >= 0 && i < runs.length))];
  if (valid.length) return valid.sort((a, b) => a - b);
  return runs.length >= 2 ? [runs.length - 2, runs.length - 1] : [0];
}

export function renderAbComparisonView(state: any, isDedicatedFullWindow = false): string {
  const runs: any[] = Array.isArray(state.runs) ? state.runs : [];
  if (!runs.length) {
    return `
      <div class="ps-ab-full-wrap">
        ${isDedicatedFullWindow ? `
          <div class="ps-between">
            <h3>⚖️ A/B Comparison Arena</h3>
            <button type="button" class="ps-btn-sm ps-primary" data-action="close-ab-window">← Back to Test Lab</button>
          </div>
        ` : ''}
        <div class="ps-empty-state">
          <div style="font-size:1.5rem;margin-bottom:6px">⚖️</div>
          <strong>No Test Runs Recorded Yet</strong>
          <p class="ps-muted" style="margin-top:4px">Generate test replies in Test Lab to compare runs side-by-side, inspect prompts, and export results.</p>
        </div>
      </div>
    `;
  }

  const selectedIndices = getNormalizedSelectedRunIndices(state);
  const idxA = Math.max(0, Math.min(Number(state.compareA) || 0, runs.length - 1));
  const idxB = Math.max(0, Math.min(Number(state.compareB) || 0, runs.length - 1));
  const runA = runs[idxA];
  const runB = runs[idxB];
  const baselineRun = runs[selectedIndices[0]];
  const baselineTokens = Number(baselineRun?.usage?.completion_tokens || 0);
  const abViewMode = state.abViewMode === 'chat' ? 'chat' : 'raw';
  const abLayoutMode = state.abLayoutMode === 'scroll' ? 'scroll' : 'grid';
  const q = (state.abSearch || '').trim().toLowerCase();

  const visibleRunItems = runs
    .map((r, idx) => ({ r, idx }))
    .filter(({ r }) => {
      if (state.abStarredOnly && !r.starred) return false;
      if (!q) return true;
      const hay = `${r.note || ''} ${r.presetName || ''} ${r.promptSummary?.presetName || ''} ${r.connection || ''} ${r.promptSummary?.model || ''} ${r.content || ''}`.toLowerCase();
      return hay.includes(q);
    });

  return `
    <div class="ps-ab-full-wrap">
      ${isDedicatedFullWindow ? `
        <div class="ps-panel ps-between" style="margin:0;padding:10px 14px">
          <div class="ps-row">
            <h3>⚖️ A/B Comparison Arena</h3>
            <span class="ps-pill ps-pill-accent">${runs.length} total run(s) · ${selectedIndices.length} in view</span>
          </div>
          <div class="ps-actions">
            <button type="button" class="ps-btn-sm ps-primary" data-action="close-ab-window">← Back to Test Lab</button>
          </div>
        </div>
      ` : ''}

      <!-- Toolbar: View Mode, Layout, Filter & Full Window Launch -->
      <div class="ps-between" style="gap:8px">
        <div class="ps-actions">
          <div class="ps-seg-bar">
            <button type="button" data-action="set-compare-mode" data-mode="side" aria-pressed="${state.compareMode !== 'diff'}">Side-by-Side (${selectedIndices.length})</button>
            <button type="button" data-action="set-compare-mode" data-mode="diff" aria-pressed="${state.compareMode === 'diff'}">Line Diff (2)</button>
          </div>
          ${state.compareMode !== 'diff' ? `
            <div class="ps-seg-bar">
              <button type="button" data-action="set-ab-view-mode" data-mode="raw" aria-pressed="${abViewMode === 'raw'}">Raw</button>
              <button type="button" data-action="set-ab-view-mode" data-mode="chat" aria-pressed="${abViewMode === 'chat'}">Chat</button>
            </div>
            <div class="ps-seg-bar">
              <button type="button" data-action="set-ab-layout-mode" data-mode="grid" aria-pressed="${abLayoutMode === 'grid'}" title="Wrap run columns into a responsive grid">Grid</button>
              <button type="button" data-action="set-ab-layout-mode" data-mode="scroll" aria-pressed="${abLayoutMode === 'scroll'}" title="Keep all run columns in one horizontally scrollable row">1 Row</button>
            </div>
          ` : ''}
        </div>
        <div class="ps-actions">
          <input style="width:140px;min-height:28px;padding:3px 8px;font-size:0.78rem" placeholder="Filter runs…" data-state="abSearch" value="${esc(state.abSearch || '')}">
          <button type="button" class="ps-btn-sm ps-ab-star-btn" data-action="toggle-ab-starred-only" aria-pressed="${Boolean(state.abStarredOnly)}" title="Show only starred runs">★ Starred</button>
          ${!isDedicatedFullWindow ? `<button type="button" class="ps-btn-sm ps-primary" data-action="open-ab-window" title="Expand A/B Comparison into a dedicated full window">⤢ Full A/B Window</button>` : ''}
        </div>
      </div>

      <!-- Selection & Export Action Strip -->
      <div class="ps-card ps-between" style="padding:8px 10px">
        <div class="ps-actions">
          <span class="ps-muted" style="font-size:0.76rem">Show:</span>
          ${[2, 3, 4].filter((n) => runs.length >= n).map((n) => `<button type="button" class="ps-btn-sm" data-action="ab-select-preset" data-count="${n}">Last ${n}</button>`).join('')}
          <button type="button" class="ps-btn-sm" data-action="ab-select-all">All (${visibleRunItems.length})</button>
          <button type="button" class="ps-btn-sm" data-action="ab-select-starred">★ Starred</button>
          <button type="button" class="ps-btn-sm" data-action="ab-select-none">Clear</button>
        </div>
        <div class="ps-actions">
          <button type="button" class="ps-btn-sm" data-action="copy-runs-txt" data-scope="selected" ${!selectedIndices.length ? 'disabled' : ''}>📋 Copy Selected (${selectedIndices.length})</button>
          <button type="button" class="ps-btn-sm" data-action="export-runs-txt" data-scope="selected" ${!selectedIndices.length ? 'disabled' : ''}>📄 Export Selected .txt</button>
          <button type="button" class="ps-btn-sm" data-action="copy-runs-txt" data-scope="all">📋 Copy All (${runs.length})</button>
          <button type="button" class="ps-btn-sm" data-action="export-runs-txt" data-scope="all">📄 Export All .txt</button>
          <button type="button" class="ps-btn-sm ps-danger-btn" data-action="clear-run-history" title="Clear all run history">🗑 Clear</button>
        </div>
      </div>

      <!-- Run Picker Strip -->
      <div class="ps-ab-run-strip">
        ${visibleRunItems
          .map(({ r, idx }) => {
            const isSel = selectedIndices.includes(idx);
            const label = r.note?.trim() || r.promptSummary?.presetName || r.presetName || 'Draft';
            const model = r.promptSummary?.model || r.connection || '';
            return `
              <button type="button" class="ps-ab-chip" data-action="toggle-run-select" data-run-idx="${idx}" aria-pressed="${isSel}" title="${esc(`${label} · ${model} · ${r.time}`)}">
                <span>${isSel ? '☑' : '☐'} #${idx + 1}</span>
                ${r.starred ? '<span style="color:var(--ps-warning)">★</span>' : ''}
                <span style="max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(label)}</span>
                ${r.usage?.completion_tokens ? `<span class="ps-muted">${r.usage.completion_tokens}t</span>` : ''}
              </button>
            `;
          })
          .join('') || '<span class="ps-muted" style="font-size:0.78rem">No runs match your filter.</span>'}
      </div>

      ${state.compareMode === 'diff' ? `
        ${runs.length >= 2 && runA && runB ? `
          <div class="ps-between" style="margin-bottom:4px">
            <div class="ps-row" style="flex:1">
              <label>Left Run (A)
                <select data-state="compareA">
                  ${runs.map((r: any, idx: number) => `<option value="${idx}" ${idxA === idx ? 'selected' : ''}>Run #${idx + 1} · ${esc(r.note || r.promptSummary?.presetName || r.presetName || 'Draft')} (${esc(r.time)})</option>`).join('')}
                </select>
              </label>
              <button type="button" class="ps-btn-sm" style="margin-top:18px" data-action="swap-compare-runs" title="Swap Run A and Run B">⇄</button>
              <label>Right Run (B)
                <select data-state="compareB">
                  ${runs.map((r: any, idx: number) => `<option value="${idx}" ${idxB === idx ? 'selected' : ''}>Run #${idx + 1} · ${esc(r.note || r.promptSummary?.presetName || r.presetName || 'Draft')} (${esc(r.time)})</option>`).join('')}
                </select>
              </label>
            </div>
            ${runA.usage?.completion_tokens && runB.usage?.completion_tokens ? (() => {
              const delta = Number(runB.usage.completion_tokens) - Number(runA.usage.completion_tokens);
              return `<span class="ps-pill">Δ ${delta > 0 ? `+${delta}` : delta}t</span>`;
            })() : ''}
          </div>
          <div class="ps-grid">
            <div class="ps-card">
              <div class="ps-between" style="margin-bottom:6px">
                <strong>Run #${idxA + 1} (A)</strong>
                <span class="ps-muted" style="font-size:0.75rem">${esc(runA.time)}</span>
              </div>
              ${renderRunPromptsSection(runA, idxA, 'ab-diff-prompts-a')}
            </div>
            <div class="ps-card">
              <div class="ps-between" style="margin-bottom:6px">
                <strong>Run #${idxB + 1} (B)</strong>
                <span class="ps-muted" style="font-size:0.75rem">${esc(runB.time)}</span>
              </div>
              ${renderRunPromptsSection(runB, idxB, 'ab-diff-prompts-b')}
            </div>
          </div>
          <div class="ps-diff-box">
            ${computeLineDiff(runA.content || '', runB.content || '')
              .map((line) => `<div class="ps-diff-line ps-diff-${line.kind}">${line.kind === 'add' ? '+ ' : line.kind === 'rem' ? '- ' : '  '}${esc(line.text || ' ')}</div>`)
              .join('')}
          </div>
        ` : '<div class="ps-empty-state"><p class="ps-muted">Generate at least 2 runs to use Line Diff.</p></div>'}
      ` : `
        <div class="${abLayoutMode === 'scroll' ? 'ps-ab-grid-scroll' : 'ps-ab-grid'}">
          ${selectedIndices
            .map((runIdx, colPos) => {
              const r = runs[runIdx];
              if (!r) return '';
              const m = computeRunMetrics(r);
              const delta = colPos > 0 && baselineTokens > 0 && m.completionTokens > 0 ? m.completionTokens - baselineTokens : null;
              return `
                <article class="ps-ab-run-card ${r.starred ? 'ps-ab-starred' : ''}">
                  <div class="ps-between">
                    <div class="ps-row" style="gap:5px">
                      <strong>Run #${runIdx + 1}</strong>
                      <span class="ps-muted" style="font-size:0.74rem">${esc(r.time)}</span>
                      ${m.durationSec !== null ? `<span class="ps-pill">${m.durationSec.toFixed(1)}s${m.tokPerSec !== null ? ` · ${m.tokPerSec.toFixed(0)}t/s` : ''}</span>` : ''}
                      ${delta !== null ? `<span class="ps-pill">${delta > 0 ? `+${delta}` : delta}t vs #${selectedIndices[0] + 1}</span>` : ''}
                    </div>
                    <div class="ps-actions">
                      <button type="button" class="ps-btn-sm ps-ab-star-btn" data-action="toggle-run-star" data-run-idx="${runIdx}" aria-pressed="${Boolean(r.starred)}" title="Star / mark as winner">★</button>
                      <button type="button" class="ps-btn-sm ps-btn-icon" data-action="toggle-run-select" data-run-idx="${runIdx}" title="Hide from side-by-side view">✕</button>
                    </div>
                  </div>

                  <input class="ps-ab-note-input" data-run-note-idx="${runIdx}" value="${esc(r.note || '')}" placeholder="Add run note (e.g. Temp 0.7, No Jailbreak)…">

                  <div class="ps-muted" style="font-size:0.74rem">${m.words.toLocaleString()} words · ${m.chars.toLocaleString()} chars${m.completionTokens ? ` · ${m.completionTokens} completion tok` : ''}</div>

                  ${renderRunPromptsSection(r, runIdx, `ab-prompts-${runIdx}`)}

                  ${r.reasoning ? `
                    <details class="ps-collapsible" style="margin:0;padding:6px 9px" data-details-id="ab-reason-${runIdx}">
                      <summary><span style="font-size:0.78rem">💭 Reasoning</span></summary>
                      <pre class="ps-result" style="max-height:140px;margin-top:6px">${esc(r.reasoning)}</pre>
                    </details>
                  ` : ''}

                  ${abViewMode === 'chat'
                    ? `<div class="ps-chat-bubble ps-ab-chat-slot" data-ab-chat-idx="${runIdx}" style="min-height:160px;max-height:${isDedicatedFullWindow ? '520px' : '380px'}"></div>`
                    : `<pre class="ps-result" style="margin:0;max-height:${isDedicatedFullWindow ? '520px' : '380px'}">${esc(r.content || '(empty)')}</pre>`}

                  <div class="ps-between" style="padding-top:6px;border-top:1px solid var(--ps-border)">
                    <div class="ps-actions">
                      <button type="button" class="ps-btn-sm" data-action="copy-single-run-reply" data-run-idx="${runIdx}" title="Copy only the reply text">📋 Reply</button>
                      <button type="button" class="ps-btn-sm" data-action="copy-runs-txt" data-scope="single" data-run-idx="${runIdx}" title="Copy full run report (prompts + reply)">📋 Full</button>
                      <button type="button" class="ps-btn-sm" data-action="export-runs-txt" data-scope="single" data-run-idx="${runIdx}" title="Download this run as .txt">📄 .txt</button>
                    </div>
                    <div class="ps-actions">
                      <button type="button" class="ps-btn-sm" data-action="load-run-inputs" data-run-idx="${runIdx}" title="Load this run's connection and test input back into Test Lab">↺ Inputs</button>
                      ${r.snapshot ? `<button type="button" class="ps-btn-sm" data-action="restore-run-snapshot" data-run-idx="${runIdx}" title="Restore preset draft from this run">↺ Preset</button>` : ''}
                      <button type="button" class="ps-btn-sm ps-danger-btn ps-btn-icon" data-action="delete-run-item" data-run-idx="${runIdx}" title="Delete run">🗑</button>
                    </div>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>
      `}
    </div>
  `;
}