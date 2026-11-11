import {
  SWATCHES,
  TRIGGERS,
  MACRO_CATALOG,
  MARKERS,
  VARIABLE_STARTER_EXAMPLES,
  AUTHORS_NOTE_PRESETS,
  esc,
  selectOptions,
  buildPresetVariableDiagnostics,
  resolveBlockVariablesPreview,
} from './studio-core.js';

export function translationButtons(state: any, action: string, block: any, index?: number): string {
  const id = index === undefined ? '' : ` data-index="${index}"`;
  const disabled = state.translating ? 'disabled' : '';
  return `<div class="ps-actions"><button type="button" class="ps-btn-sm" data-action="${action}" data-scope="name"${id} ${disabled}>🌐 Title</button>${block.content?.trim() ? `<button type="button" class="ps-btn-sm" data-action="${action}" data-scope="content"${id} ${disabled}>🌐 Prompt</button><button type="button" class="ps-btn-sm" data-action="${action}" data-scope="both"${id} ${disabled}>🌐 Both</button>` : ''}</div>`;
}

export function translationPreview(t: any, prefix: string): string {
  return `<div class="ps-grid" style="margin-top:8px">${t.name !== undefined ? `<label>Translated title<input data-state="${prefix}Name" value="${esc(t.name)}"></label>` : ''}${t.content !== undefined ? `<label>Translated prompt<textarea data-state="${prefix}Text">${esc(t.content)}</textarea></label>` : ''}</div>`;
}

export function batchPreview(state: any, target: string): string {
  const batch = state.batchTranslation;
  if (!batch || batch.target !== target) return '';
  return `<div class="ps-panel"><h4>Review ${batch.entries.length} translated blocks</h4><p class="ps-muted">Compare original vs. translated text before applying.</p>${batch.entries.map((e: any) => `<details style="margin:6px 0"><summary>${esc(e.original.name || 'Untitled')} ${e.name !== undefined ? `→ <strong>${esc(e.name)}</strong>` : ''}</summary>${e.content !== undefined ? `<div class="ps-grid" style="margin-top:6px"><div><span class="ps-muted">Original</span><pre class="ps-result">${esc(e.original.content)}</pre></div><div><span class="ps-muted">Translated</span><pre class="ps-result">${esc(e.content)}</pre></div></div>` : ''}</details>`).join('')}<div class="ps-actions" style="margin-top:8px"><button type="button" class="ps-primary ps-btn-sm" data-action="apply-batch" data-target="${target}">Apply Batch</button><button type="button" class="ps-btn-sm" data-action="discard-batch">Discard</button></div></div>`;
}

export function bulkControls(state: any, target: string): string {
  const disabled = state.translating ? 'disabled' : '';
  return `<div class="ps-card" style="margin:8px 0"><div class="ps-between"><strong>Batch Translate (${target === 'source' ? 'Source Preset' : 'Current Draft'}) → ${esc(state.translationLanguage)}</strong><span class="ps-muted" data-batch-progress aria-live="polite"></span></div><div class="ps-row" style="margin-top:6px">${['selected', 'all'].map((group) => `<div class="ps-actions"><span class="ps-muted">${group === 'selected' ? 'Checked:' : 'All:'}</span>${[['name', 'Titles'], ['content', 'Prompts'], ['both', 'Both']].map(([scope, label]) => `<button type="button" class="ps-btn-sm" data-action="translate-batch" data-target="${target}" data-group="${group}" data-scope="${scope}" ${disabled}>${label}</button>`).join('')}</div>`).join(' · ')}</div>${batchPreview(state, target)}</div>`;
}

export function renderArchitectTab(ctx: any, state: any): string {
  const d = state.draft;
  if (state.editorMode === 'native') {
    return `<div class="ps-panel"><div class="ps-between" style="margin-bottom:10px"><div><h3>Native Loom Block Editor</h3><p class="ps-muted">Drag-and-drop blocks, configure placement selectors, and insert macros using Lumiverse's built-in component.</p></div><button type="button" class="ps-btn-sm ps-primary" data-action="editor-mode" data-mode="studio">⇄ Switch to Studio Inspector</button></div><div id="ps-native-loom-slot"></div></div>`;
  }
  const b = d.prompt_order[state.selected];
  const varDiag = buildPresetVariableDiagnostics(d.prompt_order);
  const categoryBlocks = d.prompt_order.filter((blk: any) => blk.marker === 'category');
  const allCatsCollapsed = categoryBlocks.length > 0 && categoryBlocks.every((c: any) => state.collapsedCategories.includes(c.id));
  let currentCatId: string | null = null;
  const hasSearchOrFilter = Boolean(state.blockSearch.trim()) || state.blockFilter !== 'all';

  const filteredBlocks = d.prompt_order
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
      if (state.blockSearch.trim()) {
        const q = state.blockSearch.toLowerCase();
        return (block.name || '').toLowerCase().includes(q) || (block.content || '').toLowerCase().includes(q);
      }
      return true;
    });

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
    <div class="ps-panel" style="padding:10px 14px">
      <div class="ps-between">
        <div class="ps-chips">
          ${[['all', 'All'], ['enabled', 'Active'], ['categories', 'Categories'], ['markers', 'Markers']].map(([id, label]) => `<button type="button" class="ps-btn-sm ${state.blockFilter === id ? 'ps-primary' : ''}" data-action="filter-blocks" data-filter="${id}">${label}</button>`).join('')}
          <input style="width:160px;max-width:100%;min-height:31px;padding:3px 8px" placeholder="Filter blocks…" data-state="blockSearch" value="${esc(state.blockSearch)}">
        </div>
        <div class="ps-actions">
          <button type="button" class="ps-btn-sm" data-action="open-find-replace" title="Find & replace across all unlocked blocks">🔍 Find & Replace</button>
          <button type="button" class="ps-btn-sm ps-primary" data-action="add-block">＋ Add Prompt</button>
          <button type="button" class="ps-btn-sm" data-action="add-category">＋ Add Category</button>
          <button type="button" class="ps-btn-sm" data-action="quick-insert-template">📦 ＋ Add Template</button>
          ${state.selectedDraft.length ? `
            <button type="button" class="ps-btn-sm" data-action="quick-template-from-selected">📦 Save Checked (${state.selectedDraft.length}) as Template…</button>
            <button type="button" class="ps-btn-sm" data-action="enable-checked-blocks">✓ Enable (${state.selectedDraft.length})</button>
            <button type="button" class="ps-btn-sm" data-action="disable-checked-blocks">○ Disable (${state.selectedDraft.length})</button>
            <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-checked-blocks">🗑 Delete (${state.selectedDraft.length})</button>
          ` : ''}
          ${ctx.components?.mountLoomBlockEditor ? '<button type="button" class="ps-btn-sm" data-action="editor-mode" data-mode="native">⇄ Native Loom Editor</button>' : ''}
        </div>
      </div>
    </div>

    <div class="ps-columns ${state.mobileDetailOpen ? 'ps-has-detail' : ''} ${state.showMacroPane ? 'ps-with-xray' : ''}">
      <div class="ps-col-list ps-panel" data-scroll-id="prompt-order-list">
        <div class="ps-between" style="margin-bottom:8px">
          <strong>Prompt Order (${filteredBlocks.length}/${d.prompt_order.length})</strong>
          ${categoryBlocks.length ? `<button type="button" class="ps-btn-sm" data-action="toggle-all-categories">${allCatsCollapsed ? '▾ Expand Categories' : '▸ Collapse Categories'}</button>` : '<span class="ps-muted">Drag ⠿ to reorder</span>'}
        </div>
        <div class="ps-list">
          ${filteredBlocks.map(({ block, index, isChild }: any) => {
            const tok = state.tokenCounts[block.id];
            const defCnt = varDiag.defCountByBlock.get(block.id) || 0;
            const refCnt = varDiag.refCountByBlock.get(block.id) || 0;
            const isCat = block.marker === 'category';
            const isCatCollapsed = isCat && state.collapsedCategories.includes(block.id);
            return `
              <div class="ps-block ${isCat ? 'ps-is-cat' : isChild ? 'ps-is-child' : ''} ${!block.enabled ? 'ps-is-off' : ''} ${index === state.selected ? 'ps-active-row' : ''}" draggable="true" data-context-index="${index}">
                <span class="ps-drag-handle" data-drag-handle="${index}" title="Drag to reorder">⠿</span>
                ${isCat ? `<button type="button" class="ps-row-btn" data-action="toggle-category-collapse" data-cat-id="${esc(block.id)}" aria-expanded="${!isCatCollapsed}" title="${isCatCollapsed ? 'Expand category' : 'Collapse category'}">${isCatCollapsed ? '▸' : '▾'}</button>` : `<input type="checkbox" style="width:auto;min-height:18px;flex:none" data-draft-id="${esc(block.id)}" aria-label="Select ${esc(block.name)}" ${state.selectedDraft.includes(block.id) ? 'checked' : ''}>`}
                <button type="button" class="ps-block-main" data-action="select-block" data-index="${index}" aria-current="${index === state.selected}" title="${esc(block.name || 'Untitled')}">
                  <div class="ps-block-title-row">
                    ${block.color ? `<span class="ps-dot" style="background:${esc(block.color)}"></span>` : ''}
                    ${block.isLocked ? '<span title="Locked" style="font-size:0.75rem;flex:none">🔒</span>' : ''}
                    <span class="ps-block-title">${esc(block.name || 'Untitled')}</span>
                  </div>
                  <div class="ps-block-sub">
                    <span>${esc(block.marker || block.role)}</span>
                    ${block.content?.trim() && tok ? `<span data-token-id="${esc(block.id)}">· ${tok}t</span>` : `<span data-token-id="${esc(block.id)}"></span>`}
                    ${defCnt ? `<span class="ps-mini-badge ps-def" title="Defines ${defCnt} variable(s)">D${defCnt}</span>` : ''}
                    ${refCnt ? `<span class="ps-mini-badge ps-ref" title="References ${refCnt} variable(s)">V${refCnt}</span>` : ''}
                  </div>
                </button>
                <div class="ps-row-actions">
                  <button type="button" class="ps-row-btn ps-row-step" data-action="move-row-up" data-index="${index}" ${index === 0 ? 'disabled' : ''} title="Move up">↑</button>
                  <button type="button" class="ps-row-btn ps-row-step" data-action="move-row-down" data-index="${index}" ${index >= d.prompt_order.length - 1 ? 'disabled' : ''} title="Move down">↓</button>
                  ${!isCat ? `<button type="button" class="ps-row-btn ${block.enabled ? 'ps-toggle-on' : ''}" data-action="toggle" data-index="${index}" aria-pressed="${!!block.enabled}">${block.enabled ? 'On' : 'Off'}</button>` : ''}
                  <button type="button" class="ps-row-btn ps-danger-btn ps-row-step" data-action="delete-row" data-index="${index}" title="Delete block">🗑</button>
                  <button type="button" class="ps-row-btn" data-action="block-menu" data-index="${index}" title="More actions">⋯</button>
                </div>
              </div>`;
          }).join('') || '<p class="ps-muted">No matching blocks.</p>'}
        </div>
      </div>

      <div class="ps-col-detail" data-scroll-id="inspector-detail">
        ${!b ? '<div class="ps-panel"><p class="ps-muted">Select or add a block to inspect.</p></div>' : `
          <div class="ps-panel">
            <div class="ps-between" style="margin-bottom:12px">
              <div class="ps-row">
                <button type="button" class="ps-btn-sm ps-mobile-back" data-action="close-mobile-detail">← Back</button>
                <h3>${esc(b.name || 'Untitled')}</h3>
                <span class="ps-pill ps-pill-accent">${esc(b.marker || b.role)}</span>
                <button type="button" class="ps-btn-sm ${b.enabled ? 'ps-toggle-on' : ''}" data-action="toggle" data-index="${state.selected}">${b.enabled ? '● Active in Prompt' : '○ Disabled (Skipped)'}</button>
              </div>
              <div class="ps-actions">
                <button type="button" class="ps-btn-sm ${b.isLocked ? 'ps-primary' : ''}" data-action="toggle-lock">${b.isLocked ? '🔒 Locked' : '🔓 Unlocked'}</button>
                <button type="button" class="ps-btn-sm" data-action="view" data-view="variables">🎛 Variables (${varCount})</button>
                <button type="button" class="ps-btn-sm ${state.showMacroPane ? 'ps-primary' : ''}" data-action="toggle-macro-pane">⚡ Macro Preview</button>
                <button type="button" class="ps-btn-sm ps-primary" data-action="open-text-editor" ${b.isLocked ? 'disabled' : ''}>⤢ Expand Editor</button>
              </div>
            </div>

            ${b.isLocked ? '<div class="ps-notice" style="margin-bottom:12px;border-left-color:var(--ps-warning)">🔒 This block is locked against accidental text edits. Click <strong>🔒 Locked</strong> above to unlock.</div>' : ''}

            <!-- Primary 80/20 Fields Front & Center -->
            <div class="ps-grid" style="margin-bottom:10px">
              <label>Block Title
                <input data-block="name" value="${esc(b.name)}" placeholder="e.g. Tone & World Rules" ${b.isLocked ? 'disabled' : ''}>
              </label>
              <label>Role
                <select data-block="role" ${b.isLocked ? 'disabled' : ''}>
                  ${['system', 'user', 'assistant', 'user_append', 'assistant_append'].map((x) => `<option value="${x}" ${b.role === x ? 'selected' : ''}>${x}</option>`).join('')}
                </select>
              </label>
            </div>

            <!-- Quick Macro Toolbar -->
            <div class="ps-card" style="margin-bottom:10px;padding:8px 10px">
              <div class="ps-between" style="gap:6px">
                <div class="ps-row" style="flex:1">
                  <span class="ps-muted" style="font-weight:600">Quick Insert:</span>
                  <div class="ps-chips">
                    ${['{{char}}', '{{user}}', '{{persona}}', '{{if::...}}', '{{memories}}'].map((chip) => `<button type="button" class="ps-btn-sm ps-mono" data-action="insert-macro-chip" data-snippet="${esc(chip === '{{if::...}}' ? '{{if::{{isGroupChat}}}}\n\n{{/if}}' : chip)}" ${b.isLocked ? 'disabled' : ''}>${esc(chip)}</button>`).join('')}
                    ${presetVarNames.slice(0, 3).map((vn) => `<button type="button" class="ps-btn-sm ps-mono" data-action="insert-macro-chip" data-snippet="{{var::${esc(vn)}}}" ${b.isLocked ? 'disabled' : ''}>{{var::${esc(vn)}}}</button>`).join('')}
                  </div>
                </div>
                <div class="ps-row">
                  <select style="width:auto;max-width:200px;min-height:30px;padding:2px 6px;font-size:0.8rem" data-state="quickMacroSnippet" ${b.isLocked ? 'disabled' : ''}>
                    ${MACRO_CATALOG.map((m) => `<option value="${esc(m.snippet)}" ${state.quickMacroSnippet === m.snippet ? 'selected' : ''}>${esc(m.group)}: ${esc(m.label)}</option>`).join('')}
                  </select>
                  <button type="button" class="ps-btn-sm ps-primary" data-action="insert-selected-macro" ${b.isLocked ? 'disabled' : ''}>＋ Insert</button>
                </div>
              </div>
            </div>

            <!-- Prompt Content Editor -->
            <label style="margin-bottom:12px">
              <div class="ps-between" style="margin-bottom:4px">
                <span>Prompt Content <span class="ps-muted">(supports {{macros}} and variables)</span></span>
                <button type="button" class="ps-btn-sm" data-action="copy-active-block-content" title="Copy to clipboard">📋 Copy</button>
              </div>
              <textarea class="ps-content" data-block="content" placeholder="${b.marker ? `Structural marker (${b.marker}) — leave empty unless overriding.` : 'Write your prompt instructions here…'}" ${b.isLocked ? 'disabled' : ''}>${esc(b.content)}</textarea>
            </label>

            <!-- Collapsible: Advanced Placement, Depth & Triggers -->
            <details class="ps-collapsible" data-details-id="block-advanced-options">
              <summary>
                <span>⚙️ Placement, Depth & Injection Triggers</span>
                <span class="ps-muted" style="font-size:0.8rem">${esc(b.position)} · Depth ${esc(b.depth ?? 0)} · ${b.marker || 'Normal'}</span>
              </summary>
              <div class="ps-grid">
                <label>Position in Prompt
                  <select data-block="position" ${b.isLocked ? 'disabled' : ''}>
                    ${[['pre_history', 'Before Chat History (pre_history)'], ['post_history', 'After Chat History (post_history)'], ['in_history', 'At Depth in History (in_history)']].map(([val, lbl]) => `<option value="${val}" ${b.position === val ? 'selected' : ''}>${lbl}</option>`).join('')}
                  </select>
                </label>
                ${b.position === 'in_history' ? `
                  <label>In-History Depth (messages from the end)
                    <div id="ps-depth-stepper-slot">
                      <input data-block="depth" type="number" min="0" max="100" value="${esc(b.depth ?? 0)}" ${b.isLocked ? 'disabled' : ''}>
                    </div>
                  </label>
                ` : ''}
                <label>Structural Marker
                  <select data-block="marker" ${b.isLocked ? 'disabled' : ''}>
                    ${markerOptions.map((m) => `<option value="${esc(m.id)}" ${(b.marker || '') === m.id ? 'selected' : ''}>${esc(m.label)}</option>`).join('')}
                  </select>
                </label>
                ${b.marker === 'category' ? `
                  <label>Category Selection Mode
                    <select data-block="categoryMode" ${b.isLocked ? 'disabled' : ''}>
                      <option value="">None</option>
                      <option value="checkbox" ${b.categoryMode === 'checkbox' ? 'selected' : ''}>Checkbox (Multi)</option>
                      <option value="radio" ${b.categoryMode === 'radio' ? 'selected' : ''}>Radio (Single)</option>
                    </select>
                  </label>
                ` : ''}
                <label>Block Group <span class="ps-muted">(Optional mutual-exclusion group ID)</span>
                  <input data-block="group" value="${esc(b.group || '')}" placeholder="e.g. style_group" ${b.isLocked ? 'disabled' : ''}>
                </label>
              </div>

              <div style="margin-top:10px">
                <label>Injection Triggers <span class="ps-muted">(Empty = active on all generations)</span>
                  <div class="ps-chips" style="margin-top:4px">
                    ${TRIGGERS.map((tr) => `<button type="button" class="ps-btn-sm ${(b.injectionTrigger || []).includes(tr) ? 'ps-primary' : ''}" data-action="toggle-trigger" data-trigger="${tr}" ${b.isLocked ? 'disabled' : ''}>${tr}</button>`).join('')}
                  </div>
                </label>
              </div>

              <div class="ps-between" style="margin-top:12px">
                <div class="ps-row">
                  <span class="ps-muted">Color Tag:</span>
                  <button type="button" class="ps-btn-sm" data-action="set-color" data-color="">None</button>
                  ${SWATCHES.map((c) => `<button type="button" class="ps-swatch-btn" style="background:${c}" data-action="set-color" data-color="${c}" aria-label="Color ${c}" aria-pressed="${b.color === c}"></button>`).join('')}
                </div>
                ${translationButtons(state, 'translate', b)}
              </div>
            </details>

            <!-- Translation preview if active on this block -->
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

            <!-- Bottom action row -->
            <div class="ps-between" style="margin-top:14px;padding-top:12px;border-top:1px solid var(--ps-border)">
              <div class="ps-actions">
                <button type="button" class="ps-btn-sm ps-primary" data-action="save" ${state.busy ? 'disabled' : ''}>💾 Save Changes</button>
                <button type="button" class="ps-btn-sm" data-action="duplicate-block">Duplicate</button>
              </div>
              <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-block">🗑 Delete Block</button>
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
          <p class="ps-muted" style="margin:4px 0 8px">Evaluated non-committing against ${state.chatId ? 'selected chat' : 'global context'}.</p>
          ${macroData?.diagnostics?.length ? `
            <div class="ps-notice" style="border-left-color:var(--ps-warning)">
              <strong>${macroData.diagnostics.length} Diagnostic(s):</strong>
              <ul style="margin:4px 0;padding-left:18px">${macroData.diagnostics.map((dg: any) => `<li>${esc(dg.message)}</li>`).join('')}</ul>
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
    return `<div class="ps-panel"><p class="ps-muted">Select a block in Tab 01 first to configure its Prompt Variables.</p></div>`;
  }
  const vars: any[] = Array.isArray(b.variables) ? b.variables : [];
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
          <p class="ps-muted" style="margin-top:2px">Click any example below to instantly add a working variable and its prompt macro to “${esc(b.name || 'this block')}”.</p>
        </div>
        <div class="ps-actions">
          <select data-action="select-block-dropdown" style="max-width:240px">
            ${d.prompt_order.map((blk: any, idx: number) => `<option value="${idx}" ${idx === state.selected ? 'selected' : ''}>${esc(blk.name || 'Untitled')} (${(blk.variables || []).length} vars)</option>`).join('')}
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
        `).join('')}
      </div>
    </div>

    <!-- Live Interactive Preview Panel -->
    ${vars.length > 0 ? `
      <div class="ps-panel" style="border-left:3px solid var(--ps-accent)">
        <div class="ps-between">
          <div>
            <h4 style="display:flex;align-items:center;gap:6px"><span>🎮 Live Interactive Preview</span><span class="ps-pill ps-pill-ok">Active</span></h4>
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
              <button type="button" class="ps-btn-sm ps-btn-icon" data-action="copy-var-preview-output" title="Copy resolved text">📋</button>
            </div>
            <pre class="ps-result" id="ps-var-preview-output-slot" style="margin-top:8px;max-height:260px;font-size:0.85rem">${esc(previewText || '(Block content is empty)')}</pre>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Linter / Diagnostics if there are issues -->
    ${hasIssues ? `
      <details class="ps-panel ps-collapsible" data-details-id="var-health-linter" open style="border-left-color:var(--ps-warning)">
        <summary>
          <span>🩺 Variable Diagnostics (${diag.missing.length + diag.duplicates.length + diag.unused.length})</span>
          <span class="ps-pill ps-pill-warn">Review Warnings</span>
        </summary>
        <div class="ps-list" style="margin-top:8px">
          ${diag.missing.map((m) => `
            <div class="ps-card ps-between" style="border-left:3px solid var(--ps-warning)">
              <div>
                <strong>Unknown <code>{{var::${esc(m.name)}}}</code></strong>
                <div class="ps-muted">Used in ${esc(m.refs.map((r) => r.blockName).join(', '))} — but no block defines it.</div>
              </div>
              <button type="button" class="ps-btn-sm" data-action="jump-to-block-id" data-block-id="${esc(m.refs[0].blockId)}">Fix in Block →</button>
            </div>
          `).join('')}
          ${diag.duplicates.map((dup) => `
            <div class="ps-card" style="border-left:3px solid var(--ps-danger)">
              <strong>Duplicate <code>{{var::${esc(dup.name)}}}</code></strong>
              <div class="ps-muted">Defined in multiple blocks: ${esc(dup.defs.map((df) => df.blockName).join(', '))}</div>
            </div>
          `).join('')}
          ${diag.unused.map((u) => `
            <div class="ps-card ps-between">
              <div>
                <strong>Unused <code>{{var::${esc(u.name)}}}</code></strong>
                <div class="ps-muted">Defined in ${esc(u.defs[0].blockName)}, but never referenced in any prompt block.</div>
              </div>
              <button type="button" class="ps-btn-sm" data-action="jump-to-block-id" data-block-id="${esc(u.defs[0].blockId)}">Inspect →</button>
            </div>
          `).join('')}
        </div>
      </details>
    ` : ''}

    <!-- Configured Variables List -->
    <div class="ps-panel">
      <div class="ps-between">
        <div>
          <h3>Configured Variables for “${esc(b.name || 'Untitled')}” (${vars.length})</h3>
          <p class="ps-muted">Define the options, min/max values, or defaults for each variable on this block.</p>
        </div>
      </div>
    </div>

    <div class="ps-list" data-scroll-id="variables-list">
      ${vars.map((v: any, vi: number) => {
        return `
          <div class="ps-panel">
            <div class="ps-between" style="margin-bottom:8px">
              <div class="ps-row">
                <span class="ps-step-badge">${vi + 1}</span>
                <strong>${esc(v.label || v.name || 'Variable')}</strong>
                <code class="ps-pill ps-mono">{{var::${esc(v.name || 'key')}}}</code>
                <button type="button" class="ps-btn-sm" data-action="insert-var-into-prompt" data-var-name="${esc(v.name || 'key')}" title="Insert {{var::${esc(v.name || 'key')}}} into prompt">＋ Insert into Prompt</button>
                <button type="button" class="ps-btn-sm ps-btn-icon" data-action="copy-var-macro" data-macro="{{var::${esc(v.name || 'key')}}}" title="Copy macro">📋</button>
              </div>
              <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-variable" data-vindex="${vi}">Remove</button>
            </div>

            <div class="ps-grid-3">
              <label>Internal ID (alphanumeric/underscore)
                <input data-var-index="${vi}" data-var-field="name" value="${esc(v.name || '')}" placeholder="e.g. tone">
              </label>
              <label>Display Label shown to User
                <input data-var-index="${vi}" data-var-field="label" value="${esc(v.label || '')}" placeholder="e.g. Tone of Voice">
              </label>
              <label>Control Type
                <select data-var-index="${vi}" data-var-field="type">
                  ${[['text', 'Text Field'], ['textarea', 'Text Area'], ['number', 'Number Box'], ['slider', 'Visual Slider'], ['select', 'Dropdown Menu'], ['switch', 'On / Off Toggle'], ['multiselect', 'Multi-Select Checklist']].map(([tid, tlbl]) => `<option value="${tid}" ${(v.type === 'boolean' ? 'switch' : v.type) === tid ? 'selected' : ''}>${tlbl}</option>`).join('')}
                </select>
              </label>
            </div>

            <div class="ps-grid" style="margin-top:8px">
              <label>Helper Description <span class="ps-muted">(optional tooltip for users)</span>
                <input data-var-index="${vi}" data-var-field="description" value="${esc(v.description || '')}" placeholder="Short explanation of what this variable changes">
              </label>
              <label>Default Value
                <input data-var-index="${vi}" data-var-field="defaultValue" value="${esc(Array.isArray(v.defaultValue) ? v.defaultValue.join(', ') : v.defaultValue ?? '')}" placeholder="Fallback value">
              </label>
            </div>

            ${v.type === 'textarea' ? `
              <div class="ps-grid" style="margin-top:8px">
                <label>Text Area Rows (Height)
                  <input type="number" min="2" max="20" data-var-index="${vi}" data-var-field="rows" value="${esc(v.rows ?? 4)}">
                </label>
              </div>
            ` : ''}

            ${v.type === 'multiselect' ? `
              <div class="ps-grid" style="margin-top:8px">
                <label>Join Separator <span class="ps-muted">(Default is \\n\\n for paragraphs)</span>
                  <input data-var-index="${vi}" data-var-field="separator" value="${esc((v.separator ?? '\n\n').replace(/\n/g, '\\n'))}">
                </label>
              </div>
            ` : ''}

            ${['number', 'slider'].includes(v.type) ? `
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
            ` : ''}

            ${['select', 'multiselect'].includes(v.type) ? `
              <div class="ps-card" style="margin-top:8px">
                <div class="ps-between">
                  <strong>Options List (${(v.options || []).length})</strong>
                  <button type="button" class="ps-btn-sm ps-primary" data-action="add-var-option" data-vindex="${vi}">＋ Add Option</button>
                </div>
                <div class="ps-list" style="margin-top:6px">
                  ${(v.options || []).map((opt: any, oi: number) => `
                    <div class="ps-row">
                      <input style="flex:1" placeholder="ID/Key" data-var-index="${vi}" data-opt-index="${oi}" data-opt-field="id" value="${esc(opt.id ?? opt.label ?? '')}">
                      <input style="flex:1" placeholder="User-Friendly Label" data-var-index="${vi}" data-opt-index="${oi}" data-opt-field="label" value="${esc(opt.label || '')}">
                      <input style="flex:2" placeholder="Text substituted into prompt" data-var-index="${vi}" data-opt-index="${oi}" data-opt-field="value" value="${esc(opt.value || '')}">
                      <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-var-option" data-vindex="${vi}" data-oindex="${oi}">✕</button>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('') || '<div class="ps-panel"><p class="ps-muted">No variables on this block yet. Click one of the <strong>✨ 1-Click Starter Examples</strong> above or “＋ Custom Variable” to get started.</p></div>'}
    </div>

    <!-- Hidden by default: Raw Variables JSON -->
    <details class="ps-panel ps-collapsible" data-details-id="raw-vars-json">
      <summary><span>⚙️ Advanced: Raw Block Variables JSON</span><span class="ps-muted">Inspect raw schema</span></summary>
      <textarea data-json="variables">${esc(JSON.stringify(b.variables || [], null, 2))}</textarea>
      <button type="button" class="ps-btn-sm" style="margin-top:6px" data-action="apply-json" data-target="variables">Apply Variables JSON</button>
    </details>
  `;
}

export function renderSamplersTab(state: any): string {
  const d = state.draft;
  const p = d.parameters || {};
  return `
    <div class="ps-panel">
      <div class="ps-between">
        <div>
          <h3>Core Preset Settings</h3>
          <p class="ps-muted">Set the preset name and the core sampling parameters that determine creativity and response length.</p>
        </div>
        <button type="button" class="ps-btn-sm" data-action="copy-parameters-json">📋 Copy Parameters JSON</button>
      </div>

      <div class="ps-grid" style="margin-top:10px">
        <label>Preset Name
          <input data-preset="name" value="${esc(d.name)}" placeholder="My Custom Preset">
        </label>
        <label>Max Response Tokens <span class="ps-muted">(Length ceiling: ~300 = short, ~800 = medium, 2000+ = novel)</span>
          <input type="number" min="1" max="128000" data-param-num="max_tokens" value="${esc(p.max_tokens ?? '')}" placeholder="Provider default (usually 4096)">
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
          <input type="number" min="0" max="1000" data-param-num="top_k" value="${esc(p.top_k ?? '')}" placeholder="0">
        </label>
        <label>Fixed Seed <span class="ps-muted">(empty = random)</span>
          <input type="number" data-param-num="seed" value="${esc(p.seed ?? '')}" placeholder="Random">
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
      ${[['parameters', 'Parameters (parameters)'], ['prompts', 'Completion Prompts (prompts)'], ['metadata', 'Metadata & Variables (metadata)']].map(([k, l]) => `
        <details style="margin:8px 0" data-details-id="json-${k}">
          <summary>${l}</summary>
          <textarea data-json="${k}">${esc(JSON.stringify(d[k] || {}, null, 2))}</textarea>
          <button type="button" class="ps-btn-sm" style="margin-top:6px" data-action="apply-json" data-target="${k}">Apply ${l}</button>
        </details>
      `).join('')}
    </details>
  `;
}

export function renderRemixTab(state: any): string {
  const allExpanded = state.importBlocks.length > 0 && state.expandedImports.length >= state.importBlocks.length;
  const allCollapsed = state.expandedImports.length === 0;
  const checkedCount = state.selectedImports.length;

  return `
    <!-- Saved Templates first -->
    <div class="ps-panel">
      <div class="ps-between">
        <div>
          <h3>📦 Saved Template Library (${state.templates.length})</h3>
          <p class="ps-muted">Quickly insert pre-built modules of blocks into your draft, or export templates as JSON.</p>
        </div>
        <div class="ps-actions">
          <button type="button" class="ps-btn-sm" data-action="import-template-json">📥 Import Template JSON</button>
        </div>
      </div>

      <div class="ps-list" style="margin-top:10px">
        ${state.templates.map((t: any, i: number) => `
          <div class="ps-block">
            <span style="flex:1">
              <strong>${esc(t.name)}</strong>
              <span class="ps-pill ps-pill-accent">${t.entries.length} blocks</span>
            </span>
            <button type="button" class="ps-btn-sm" data-action="copy-template-text" data-index="${i}" title="Copy all prompt text in this template">📋 Copy</button>
            <button type="button" class="ps-btn-sm ps-primary" data-action="insert-template" data-index="${i}">＋ Insert into Preset</button>
            <button type="button" class="ps-btn-sm" data-action="export-template" data-index="${i}">📤 Export</button>
            <button type="button" class="ps-btn-sm ps-danger-btn" data-action="delete-template" data-index="${i}">🗑</button>
          </div>
        `).join('') || '<p class="ps-muted">No saved templates yet. Check any blocks in Tab 01 or below and click “📦 Save Checked as Template…”.</p>'}
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
            ${checkedCount ? `
              <button type="button" class="ps-btn-sm ps-primary" data-action="add-checked-imports">＋ Add Checked (${checkedCount}) to Draft</button>
              <button type="button" class="ps-btn-sm" data-action="collect-blocks">📦 Save Checked (${checkedCount}) as Template…</button>
            ` : ''}
            <button type="button" class="ps-btn-sm" data-action="collapse-all-imports" ${allCollapsed ? 'disabled' : ''}>▸ Collapse All</button>
            <button type="button" class="ps-btn-sm" data-action="expand-all-imports" ${allExpanded ? 'disabled' : ''}>▾ Expand All</button>
          </div>
        </div>

        <div class="ps-list" style="margin-top:8px">
          ${state.importBlocks.map((block: any, i: number) => {
            const isExpanded = state.expandedImports.includes(i);
            const hasTranslation = state.sourceTranslation?.presetId === state.importPreset && state.sourceTranslation?.index === i;
            return `
              <article class="ps-card ${block.marker === 'category' ? 'ps-is-cat' : ''}" style="padding:${isExpanded ? '12px' : '7px 12px'}">
                <div class="ps-between">
                  <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
                    <input style="width:auto;min-height:20px" type="checkbox" data-import-index="${i}" aria-label="Select ${esc(block.name || 'Untitled')}" ${state.selectedImports.includes(i) ? 'checked' : ''}>
                    <button type="button" class="ps-btn-sm ps-btn-icon" data-action="toggle-import-expand" data-index="${i}" aria-expanded="${isExpanded}">${isExpanded ? '▾' : '▸'}</button>
                    <button type="button" class="ps-block-main" data-action="toggle-import-expand" data-index="${i}">
                      <strong>${esc(block.name || 'Untitled')}</strong>
                      <span class="ps-pill">${block.marker === 'category' ? 'Category' : esc(block.marker || block.role)}</span>
                    </button>
                  </div>
                  <div class="ps-actions">
                    <button type="button" class="ps-btn-sm" data-action="copy-source-content" data-index="${i}" title="Copy source text">📋</button>
                    <button type="button" class="ps-primary ps-btn-sm" data-action="import-block" data-index="${i}">＋ Add to Draft</button>
                  </div>
                </div>
                ${isExpanded ? (block.content ? `<pre class="ps-result" style="margin-top:8px;max-height:180px">${esc(block.content)}</pre>` : '<p class="ps-muted" style="margin-top:6px">Structural marker — injects dynamic context.</p>') : ''}
              </article>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

export function renderXRayBreakdown(state: any): string {
  const a = state.assembled;
  if (!a) return '';
  const isCustom = a.source === 'custom';
  const d = state.draft;
  const nonCatBlocks = (d?.prompt_order || []).filter((b: any) => b.marker !== 'category');
  const enabledCount = nonCatBlocks.filter((b: any) => b.enabled).length;
  const breakdown = Array.isArray(a.breakdown) ? a.breakdown : [];
  const messages = Array.isArray(a.messages) ? a.messages : [];
  const buckets = { block: 0, chat_history: 0, world_info: 0, memory: 0, authors_note: 0, other: 0 };
  breakdown.forEach((item: any) => {
    const est = Math.ceil((item.content || '').length / 4);
    if (item.type === 'block') buckets.block += est;
    else if (item.type === 'chat_history') buckets.chat_history += est;
    else if (item.type === 'world_info') buckets.world_info += est;
    else if (item.type === 'long_term_memory') buckets.memory += est;
    else if (item.type === 'authors_note') buckets.authors_note += est;
    else buckets.other += est;
  });
  const totalEst = Math.max(1, buckets.block + buckets.chat_history + buckets.world_info + buckets.memory + buckets.authors_note + buckets.other);
  const filtered = breakdown.filter((item: any) => {
    if (state.breakdownFilter !== 'all' && item.type !== state.breakdownFilter && item.role !== state.breakdownFilter) return false;
    if (state.breakdownSearch.trim()) {
      const q = state.breakdownSearch.toLowerCase();
      return (item.name || '').toLowerCase().includes(q) || (item.content || '').toLowerCase().includes(q);
    }
    return true;
  });

  return `
    <details class="ps-panel ps-collapsible" data-details-id="xray-main-details" ${state.xrayExpanded ? 'open' : ''}>
      <summary>
        <span>🔬 Assembled Prompt X-Ray (${breakdown.length} blocks · ${messages.length} messages)</span>
        <span class="ps-pill ps-pill-accent">~${totalEst.toLocaleString()} est. tokens</span>
      </summary>

      <div class="ps-between" style="margin-bottom:8px">
        <p class="ps-muted">Source: <strong>${isCustom ? 'Custom Prompt' : 'Preset Blocks'}</strong> · ${enabledCount} blocks active.</p>
        <div class="ps-actions">
          <button type="button" class="ps-btn-sm" data-action="copy-xray-messages">📋 Copy Messages JSON</button>
        </div>
      </div>

      <div class="ps-bar-stack" title="Token distribution">
        <div class="ps-bar-seg" style="width:${(buckets.block / totalEst) * 100}%;background:#a795e8"></div>
        <div class="ps-bar-seg" style="width:${(buckets.chat_history / totalEst) * 100}%;background:#64b5f6"></div>
        <div class="ps-bar-seg" style="width:${(buckets.world_info / totalEst) * 100}%;background:#81c784"></div>
        <div class="ps-bar-seg" style="width:${(buckets.memory / totalEst) * 100}%;background:#ffb74d"></div>
        <div class="ps-bar-seg" style="width:${(buckets.authors_note / totalEst) * 100}%;background:#f06292"></div>
      </div>

      <div class="ps-between" style="margin:8px 0">
        <div class="ps-chips">
          ${[['all', 'All'], ['block', 'Preset Blocks'], ['chat_history', 'History'], ['world_info', 'Lore'], ['authors_note', "Author's Note"], ['system', 'System']].map(([id, lbl]) => `<button type="button" class="ps-btn-sm ${state.breakdownFilter === id ? 'ps-primary' : ''}" data-action="filter-breakdown" data-filter="${id}">${lbl}</button>`).join('')}
        </div>
        <input style="width:180px;max-width:100%;min-height:30px;padding:3px 8px" placeholder="Search assembled blocks…" data-state="breakdownSearch" value="${esc(state.breakdownSearch)}">
      </div>

      <div class="ps-list" data-scroll-id="xray-list">
        ${filtered.map((item: any, idx: number) => `
          <details class="ps-card" data-details-id="xray-${idx}">
            <summary class="ps-between">
              <span><strong>${esc(item.name || item.type || `Entry ${idx + 1}`)}</strong> <span class="ps-pill">${esc(item.role)}</span> <span class="ps-pill">${esc(item.type)}</span></span>
              <span class="ps-muted">~${Math.ceil((item.content || '').length / 4)}t</span>
            </summary>
            <pre class="ps-result" style="margin-top:8px">${esc(item.content || '(empty)')}</pre>
          </details>
        `).join('') || '<p class="ps-muted">No items match filter.</p>'}
      </div>
    </details>
  `;
}

export function renderTestTab(state: any): string {
  const runA = state.runs[state.compareA];
  const runB = state.runs[state.compareB];
  const isCustomPromptMode = state.testPromptSource === 'custom';
  const isMultiTurn = state.testTurnMode === 'multi';
  const turns = Array.isArray(state.testTurns) ? state.testTurns : [];
  const an = state.authorsNote || { enabled: false, content: '', depth: 4, role: 'system' };
  const isChatView = (state.testReplyViewMode || 'chat') === 'chat';

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
                  ${selectOptions(state.chats, state.chatId, (x: any) => x.name || x.id)}
                </select>
              </label>
              <label>AI Model Connection
                <select data-state="connectionId">
                  <option value="">Active default connection</option>
                  ${selectOptions(state.connections, state.connectionId, (x: any) => `${x.name} · ${x.model}`)}
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
                <button type="button" class="ps-btn-sm ${!isMultiTurn ? 'ps-primary' : ''}" data-action="set-test-turn-mode" data-mode="single">Single Turn</button>
                <button type="button" class="ps-btn-sm ${isMultiTurn ? 'ps-primary' : ''}" data-action="set-test-turn-mode" data-mode="multi">💬 Thread (${turns.length})</button>
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
                    <button type="button" class="ps-btn-sm ps-danger-btn" data-action="clear-test-turns" ${!turns.length ? 'disabled' : ''}>Clear</button>
                  </div>
                </div>
                <div class="ps-list" style="max-height:220px;overflow-y:auto">
                  ${turns.map((turn: any, ti: number) => `
                    <div class="ps-card" style="padding:6px 8px">
                      <div class="ps-between" style="margin-bottom:3px">
                        <span class="ps-pill">#${ti + 1}</span>
                        <div class="ps-actions">
                          <select style="min-height:24px;font-size:0.75rem" data-turn-idx="${ti}" data-turn-field="role">
                            <option value="user" ${turn.role === 'user' ? 'selected' : ''}>User</option>
                            <option value="assistant" ${turn.role === 'assistant' ? 'selected' : ''}>Assistant</option>
                            <option value="system" ${turn.role === 'system' ? 'selected' : ''}>System</option>
                          </select>
                          <button type="button" class="ps-btn-sm ps-danger-btn ps-btn-icon" data-action="delete-test-turn" data-turn-idx="${ti}">✕</button>
                        </div>
                      </div>
                      <textarea data-turn-idx="${ti}" data-turn-field="content" style="min-height:46px;font-size:0.85rem" placeholder="Turn #${ti + 1} content…">${esc(turn.content)}</textarea>
                    </div>
                  `).join('') || '<p class="ps-muted" style="text-align:center;padding:8px 0">Click “＋ Add Turn” to stage conversation history.</p>'}
                </div>
              </div>
            `}
          </div>

          <!-- Step 3: Author's Note Card -->
          <div class="ps-card" style="margin-bottom:12px;border-left:3px solid var(--ps-accent)">
            <div class="ps-between" style="margin-bottom:6px">
              <div style="display:flex;align-items:center;gap:6px">
                <span class="ps-step-badge">3</span>
                <strong>📝 Author's Note</strong>
              </div>
              <button type="button" class="ps-btn-sm ${an.enabled ? 'ps-toggle-on' : ''}" data-action="toggle-authors-note">${an.enabled ? '● Active' : '○ Off'}</button>
            </div>
            <p class="ps-muted" style="font-size:0.78rem;margin-bottom:6px">Whisper instructions directly into the conversation context at a specific depth.</p>

            <div class="ps-chips" style="margin-bottom:8px">
              <span class="ps-muted" style="font-size:0.75rem">Presets:</span>
              ${AUTHORS_NOTE_PRESETS.map((p, pIdx) => `<button type="button" class="ps-btn-sm" data-action="set-authors-note-preset" data-preset-idx="${pIdx}">${esc(p.label)}</button>`).join('')}
            </div>

            <textarea data-authors-note="content" style="min-height:60px;font-size:0.86rem" placeholder="[Style: vivid descriptions, slow pacing] (supports {{macros}})">${esc(an.content)}</textarea>

            <div class="ps-grid" style="margin-top:8px">
              <label>Depth from latest message (default 4)
                <input type="number" min="0" max="40" data-authors-note="depth" value="${esc(an.depth ?? 4)}">
              </label>
              <label>Message Role
                <select data-authors-note="role">
                  <option value="system" ${an.role === 'system' ? 'selected' : ''}>System</option>
                  <option value="user" ${an.role === 'user' ? 'selected' : ''}>User</option>
                  <option value="assistant" ${an.role === 'assistant' ? 'selected' : ''}>Assistant</option>
                </select>
              </label>
            </div>
          </div>

          <!-- Main Generation Action Bar -->
          <div class="ps-between" style="margin-top:14px;gap:8px">
            <button type="button" class="ps-btn-sm" data-action="preview" ${state.busy ? 'disabled' : ''}>🔬 Inspect Prompt</button>
            <div class="ps-actions">
              <button type="button" class="ps-primary" style="min-height:40px;padding:8px 18px" data-action="run" ${state.busy ? 'disabled' : ''}>▶ Generate Reply</button>
              <button type="button" class="ps-danger-btn ps-btn-sm" data-action="stop" ${!state.busy ? 'disabled' : ''}>■ Stop</button>
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
                  ${['normal', 'continue', 'regenerate', 'swipe', 'impersonate'].map((x) => `<option ${state.generationType === x ? 'selected' : ''}>${x}</option>`).join('')}
                </select>
              </label>
              <label>Test Prompt Source
                <select data-state="testPromptSource" data-action="change-test-prompt-source">
                  <option value="preset" ${!isCustomPromptMode ? 'selected' : ''}>Preset Blocks (Tab 01)</option>
                  <option value="custom" ${isCustomPromptMode ? 'selected' : ''}>Custom Text Override</option>
                </select>
              </label>
            </div>

            ${isCustomPromptMode ? `
              <div style="margin-top:10px">
                <div class="ps-between" style="margin-bottom:4px">
                  <span class="ps-muted">Custom System Prompt (bypasses Tab 01 blocks):</span>
                  <label style="display:inline-flex;align-items:center;gap:6px;font-size:0.78rem">
                    <input type="checkbox" style="width:auto;min-height:16px" data-custom-check="history" ${state.testCustomPromptIncludeHistory ? 'checked' : ''}>
                    <span>Include Chat History</span>
                  </label>
                </div>
                <textarea data-state="testCustomPrompt" class="ps-content" style="min-height:100px" placeholder="Write custom prompt instructions to test…">${esc(state.testCustomPrompt)}</textarea>
              </div>
            ` : ''}

            <div class="ps-actions" style="margin-top:10px">
              <button type="button" class="ps-btn-sm" data-action="profile">Sync States from Active Chat</button>
              <button type="button" class="ps-btn-sm" data-action="dry" ${state.busy || !state.draft.id ? 'disabled' : ''}>Database Dry Run</button>
            </div>
          </details>
        </div>
      </div>

      <!-- Right Column: Main-Chat-Faithful Reply Bubble -->
      <div class="ps-test-col-output">
        ${state.reasoning ? `
          <details class="ps-panel" style="margin-top:0" open>
            <summary class="ps-between">
              <span><strong>💭 Extended Reasoning / CoT</strong></span>
              <button type="button" class="ps-btn-sm" data-action="copy-test-reasoning">📋 Copy</button>
            </summary>
            <div class="ps-result ps-reasoning-box" style="margin-top:8px;max-height:180px">${esc(state.reasoning)}</div>
          </details>
        ` : ''}

        <div class="ps-panel" style="${state.reasoning ? '' : 'margin-top:0'}">
          <div class="ps-between">
            <div class="ps-row">
              <h3>Reply Preview ${state.busy ? '· Generating…' : ''}</h3>
              ${state.lastUsage ? `<span class="ps-pill ps-pill-ok">P: ${state.lastUsage.prompt_tokens || 0}t · C: ${state.lastUsage.completion_tokens || 0}t</span>` : ''}
            </div>
            <div class="ps-chips">
              <button type="button" class="ps-btn-sm ${isChatView ? 'ps-primary' : ''}" data-action="set-reply-view-mode" data-mode="chat">👁️ Chat View</button>
              <button type="button" class="ps-btn-sm ${!isChatView ? 'ps-primary' : ''}" data-action="set-reply-view-mode" data-mode="raw">&lt;/&gt; Raw Text</button>
              <button type="button" class="ps-btn-sm" data-action="copy-test-reply" ${!state.result ? 'disabled' : ''}>📋 Copy</button>
            </div>
          </div>

          <!-- The Live Chat Bubble Preview Container -->
          <div class="ps-chat-bubble" id="ps-chat-reply-bubble" style="margin-top:10px" aria-live="polite">
            <!-- Populated by renderChatPreviewInto() in frontend.ts -->
          </div>

          ${state.result && !state.busy ? `
            <div class="ps-between" style="margin-top:10px;padding-top:8px;border-top:1px solid var(--ps-border)">
              <span class="ps-muted" style="font-size:0.82rem">Like this response? Add it to the thread to test follow-ups:</span>
              <button type="button" class="ps-primary ps-btn-sm" data-action="continue-test-dialogue">💬 Reply to This Turn →</button>
            </div>
          ` : ''}
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
              ${state.runs.map((r: any, idx: number) => `<option value="${idx}" ${Number(state.compareA) === idx ? 'selected' : ''}>#${idx + 1} (${esc(r.time)})</option>`).join('')}
            </select>
          </label>
          <label style="flex:initial">Run B
            <select data-state="compareB">
              ${state.runs.map((r: any, idx: number) => `<option value="${idx}" ${Number(state.compareB) === idx ? 'selected' : ''}>#${idx + 1} (${esc(r.time)})</option>`).join('')}
            </select>
          </label>
        </div>
      ` : ''}

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
          ${state.runs.map((r: any, i: number) => `
            <details class="ps-card">
              <summary>Run #${i + 1} · ${esc(r.time)} · ${esc(r.connection)}</summary>
              <pre class="ps-result" style="margin-top:8px">${esc(r.content)}</pre>
            </details>
          `).join('') || '<p class="ps-muted">Generate 2 or more test replies to compare them side-by-side.</p>'}
        </div>
      `}
    </details>
  `;
}

export function renderStudioSettingsTab(state: any): string {
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
            ${selectOptions(state.connections, state.translationConnection, (x: any) => `${x.name} · ${x.model}`)}
          </select>
        </label>
      </div>
      <div class="ps-actions" style="margin-top:12px">
        <button type="button" class="ps-primary" data-action="save-preferences">Save Preferences</button>
      </div>
    </div>

    ${state.draft ? bulkControls(state, 'draft') : ''}

    <div class="ps-panel">
      <h3>Extension Permissions Status</h3>
      <p class="ps-muted">These permissions enable full preset editing, dry runs, and overlay windows.</p>
      <div class="ps-chips" style="margin-top:8px">
        ${[['presets', 'Presets CRUD'], ['chats', 'Chats Context'], ['generation', 'LLM Generation & Assembly'], ['app_manipulation', 'Full-Window Overlay'], ['regex_scripts', 'Display Regex Support']].map(([key, label]) => `<span class="ps-pill ${perms[key] ? 'ps-pill-ok' : 'ps-pill-warn'}">${perms[key] ? '✓' : '⚠'} ${label}</span>`).join('')}
      </div>
    </div>
  `;
}
