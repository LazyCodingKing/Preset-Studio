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
  return `<div class="ps-card" style="margin:10px 0"><div class="ps-between"><strong>Batch Translate (${target === 'source' ? 'Source Preset' : 'Current Draft'}) → ${esc(state.translationLanguage)}</strong><span class="ps-muted" data-batch-progress aria-live="polite"></span></div><div class="ps-row" style="margin-top:8px">${['selected', 'all'].map((group) => `<div class="ps-actions"><span class="ps-muted">${group === 'selected' ? 'Checked Blocks:' : 'All Blocks:'}</span>${[['name', 'Titles'], ['content', 'Prompts'], ['both', 'Both']].map(([scope, label]) => `<button type="button" class="ps-btn-sm" data-action="translate-batch" data-target="${target}" data-group="${group}" data-scope="${scope}" ${disabled}>${label}</button>`).join('')}</div>`).join(' · ')}</div>${batchPreview(state, target)}</div>`;
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

export function renderArchitectTab(ctx: any, state: any): string {
  const d = state.draft;
  if (state.editorMode === 'native') {
    return `<div class="ps-panel"><div class="ps-between" style="margin-bottom:10px"><div><h3>Native Loom Block Editor</h3><p class="ps-muted">Drag-and-drop blocks, configure placement selectors, and insert macros using Lumiverse's built-in component.</p></div><button type="button" class="ps-btn-sm ps-primary" data-action="editor-mode" data-mode="studio">⇄ Return to Studio View</button></div><div id="ps-native-loom-slot"></div></div>`;
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
    <div class="ps-columns ${state.mobileDetailOpen ? 'ps-has-detail' : ''} ${state.showMacroPane ? 'ps-with-xray' : ''}">
      <!-- Left Column: Clean Block Outline -->
      <div class="ps-col-list ps-panel" style="margin:0" data-scroll-id="prompt-order-list">
        <div class="ps-between" style="margin-bottom:8px">
          <div class="ps-row">
            <strong>Prompt Blocks (${filteredBlocks.length}/${d.prompt_order.length})</strong>
            ${categoryBlocks.length ? `<button type="button" class="ps-btn-sm" data-action="toggle-all-categories" title="Collapse or expand all categories">${allCatsCollapsed ? '▾ Expand' : '▸ Collapse'}</button>` : ''}
          </div>
          <div class="ps-actions">
            <button type="button" class="ps-btn-sm ps-primary" data-action="add-block">＋ Block</button>
            <button type="button" class="ps-btn-sm" data-action="add-category" title="Add category divider">＋ Folder</button>
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

        <div class="ps-list">
          ${filteredBlocks.map(({ block, index, isChild }: any) => {
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
          }).join('') || '<div class="ps-empty-state"><p>No blocks match your filter.</p></div>'}
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
                  ${translationButtons(state, 'translate', b)}
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
              <strong>${esc(v.label || v.name || 'Variable')}</strong>
              <code class="ps-pill ps-mono">{{var::${esc(v.name || 'key')}}}</code>
              <button type="button" class="ps-btn-sm" data-action="insert-var-into-prompt" data-var-name="${esc(v.name || 'key')}">＋ Insert in Prompt</button>
              <button type="button" class="ps-btn-sm ps-btn-icon" data-action="copy-var-macro" data-macro="{{var::${esc(v.name || 'key')}}}" title="Copy macro">📋</button>
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
        <div class="ps-between">
          <div>
            <h3>📦 Saved Block Templates (${state.templates.length})</h3>
            <p class="ps-muted">Reusable prompt modules you can drop into any preset with one click.</p>
          </div>
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
          <div class="ps-between" style="margin:12px 0 8px">
            <div class="ps-row">
              <strong>Source Blocks (${state.importBlocks.length})</strong>
              ${checkedCount ? `<span class="ps-pill ps-pill-accent">${checkedCount} checked</span>` : ''}
            </div>
            <div class="ps-actions">
              ${checkedCount ? `
                <button type="button" class="ps-btn-sm ps-primary" data-action="add-checked-imports">＋ Add Checked (${checkedCount}) to Draft</button>
                <button type="button" class="ps-btn-sm" data-action="collect-blocks">📦 Save Checked as Template…</button>
              ` : ''}
              <button type="button" class="ps-btn-sm" data-action="collapse-all-imports" ${allCollapsed ? 'disabled' : ''}>▸ Collapse All</button>
              <button type="button" class="ps-btn-sm" data-action="expand-all-imports" ${allExpanded ? 'disabled' : ''}>▾ Expand All</button>
            </div>
          </div>

          <div class="ps-list">
            ${state.importBlocks.map((block: any, i: number) => {
              const isExpanded = state.expandedImports.includes(i);
              return `
                <article class="ps-card ${block.marker === 'category' ? 'ps-is-cat' : ''}" style="padding:${isExpanded ? '10px 12px' : '6px 12px'}">
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
                      <button type="button" class="ps-btn-sm" data-action="copy-source-content" data-index="${i}">📋</button>
                      <button type="button" class="ps-primary ps-btn-sm" data-action="import-block" data-index="${i}">＋ Add to Draft</button>
                    </div>
                  </div>
                  ${isExpanded ? (block.content ? `<pre class="ps-result" style="margin-top:8px;max-height:170px">${esc(block.content)}</pre>` : '<p class="ps-muted" style="margin-top:6px">Built-in data slot — injects dynamic context.</p>') : ''}
                </article>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>
    ` : `
      <div class="ps-panel">
        <h3>🌐 AI Preset Translator</h3>
        <p class="ps-muted">Translate block titles and prompts while automatically shielding all <code>{{macros}}</code> from corruption.</p>
        <div class="ps-grid" style="margin-top:10px">
          <label>Target Language
            <input data-state="translationLanguage" value="${esc(state.translationLanguage)}" placeholder="e.g. English, Japanese, Spanish, Korean…">
          </label>
          <label>Translation Model Connection
            <select data-state="translationConnection">
              <option value="">Active default connection</option>
              ${selectOptions(state.connections, state.translationConnection, (x: any) => `${x.name} · ${x.model}`)}
            </select>
          </label>
        </div>
        <div class="ps-actions" style="margin-top:10px">
          <button type="button" class="ps-primary ps-btn-sm" data-action="save-preferences">Save Language Preference</button>
        </div>

        ${state.draft ? bulkControls(state, 'draft') : ''}
      </div>

      <div class="ps-panel">
        <h4>Extension Permissions Health</h4>
        <div class="ps-chips" style="margin-top:8px">
          ${[['presets', 'Presets CRUD'], ['chats', 'Chats Context'], ['generation', 'LLM Generation & Assembly'], ['app_manipulation', 'Full-Window Mode'], ['regex_scripts', 'Display Regex']].map(([key, label]) => `<span class="ps-pill ${perms[key] ? 'ps-pill-ok' : 'ps-pill-warn'}">${perms[key] ? '✓' : '⚠'} ${label}</span>`).join('')}
        </div>
      </div>
    `}
  `;
}

export function renderXRayBreakdownInline(state: any): string {
  const a = state.assembled;
  if (!a) {
    return `<div class="ps-empty-state"><div style="font-size:1.5rem;margin-bottom:6px">🔬</div><strong>No Prompt Assembled Yet</strong><p class="ps-muted" style="margin-top:4px">Click <strong>🔬 Inspect Prompt</strong> or <strong>▶ Generate Reply</strong> on the left to inspect every assembled block, World Info entry, and token distribution.</p></div>`;
  }
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
    <div>
      <div class="ps-between" style="margin-bottom:8px">
        <span class="ps-muted">Source: <strong>${isCustom ? 'Custom Prompt' : 'Preset Draft'}</strong> (${enabledCount} active blocks · ~${totalEst.toLocaleString()} est. tokens)</span>
        <button type="button" class="ps-btn-sm" data-action="copy-xray-messages">📋 Copy Messages JSON</button>
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
          ${[['all', 'All'], ['block', 'Blocks'], ['chat_history', 'History'], ['world_info', 'Lore'], ['authors_note', "Author's Note"]].map(([id, lbl]) => `<button type="button" class="ps-btn-sm ${state.breakdownFilter === id ? 'ps-primary' : ''}" data-action="filter-breakdown" data-filter="${id}">${lbl}</button>`).join('')}
        </div>
        <input style="width:165px;max-width:100%;min-height:28px;padding:3px 8px;font-size:0.78rem" placeholder="Filter X-Ray…" data-state="breakdownSearch" value="${esc(state.breakdownSearch)}">
      </div>

      <div class="ps-list" style="max-height:500px;overflow-y:auto" data-scroll-id="xray-list">
        ${filtered.map((item: any, idx: number) => `
          <details class="ps-card" data-details-id="xray-${idx}">
            <summary class="ps-between" style="cursor:pointer">
              <span><strong>${esc(item.name || item.type || `Entry ${idx + 1}`)}</strong> <span class="ps-pill">${esc(item.role)}</span></span>
              <span class="ps-muted">~${Math.ceil((item.content || '').length / 4)}t</span>
            </summary>
            <pre class="ps-result" style="margin-top:8px">${esc(item.content || '(empty)')}</pre>
          </details>
        `).join('') || '<p class="ps-muted">No items match filter.</p>'}
      </div>
    </div>
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

  const runA = runs[state.compareA];
  const runB = runs[state.compareB];
  const isCustomPromptMode = state.testPromptSource === 'custom';
  const isMultiTurn = state.testTurnMode === 'multi';
  const turns = Array.isArray(state.testTurns) ? state.testTurns : [];
  const an = state.authorsNote || { enabled: false, content: '', depth: 4, role: 'system' };
  const isChatView = (state.testReplyViewMode || 'chat') === 'chat';
  const outTab = state.testOutputTab || 'reply';
  const breakdownCount = Array.isArray(state.assembled?.breakdown) ? state.assembled.breakdown.length : 0;

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
                  <input type="checkbox" style="width:auto;min-height:16px" data-custom-check="history" ${state.testCustomPromptIncludeHistory ? 'checked' : ''}>
                  <span>Include Chat History</span>
                </label>
                <div class="ps-actions">
                  <button type="button" class="ps-btn-sm" data-action="copy-custom-test-prompt">📋</button>
                  <button type="button" class="ps-btn-sm" data-action="open-test-custom-prompt-editor">⤢ Fullscreen</button>
                </div>
              </div>
              <textarea data-state="testCustomPrompt" class="ps-content" style="min-height:100px" placeholder="Write custom system instructions to test…">${esc(state.testCustomPrompt)}</textarea>
            </div>
          ` : ''}

          <div class="ps-grid" style="margin-bottom:10px">
            <label>Context Chat ${!state.chats.length ? '<span class="ps-pill ps-pill-warn">No chats found</span>' : `(${state.chats.length})`}
              <select data-state="chatId">
                <option value="">${isCustomPromptMode ? 'None (Standalone prompt)' : 'Select a chat for character & lore…'}</option>
                ${selectOptions(state.chats, state.chatId, (x: any) => x.name || x.id)}
              </select>
            </label>
            <label>Model Connection
              <select data-state="connectionId">
                <option value="">Active default connection</option>
                ${selectOptions(state.connections, state.connectionId, (x: any) => `${x.name} · ${x.model}`)}
              </select>
            </label>
          </div>

          <!-- Test Message or Multi-Turn Thread -->
          <div style="margin-bottom:10px">
            <div class="ps-between" style="margin-bottom:6px">
              <strong style="font-size:0.84rem">Test User Message</strong>
              <div class="ps-seg-bar">
                <button type="button" data-action="set-test-turn-mode" data-mode="single" aria-pressed="${!isMultiTurn}">Single Turn</button>
                <button type="button" data-action="set-test-turn-mode" data-mode="multi" aria-pressed="${isMultiTurn}">Thread (${turns.length})</button>
              </div>
            </div>

            ${!isMultiTurn ? `
              <textarea data-state="custom" style="min-height:74px" placeholder="Optional: type a user message to append to the chat before generating…">${esc(state.custom)}</textarea>
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
            <button type="button" class="ps-btn-sm" data-action="preview" ${state.busy ? 'disabled' : ''}>🔬 Inspect Prompt X-Ray</button>
            <div class="ps-actions">
              ${runs.length > 0 ? `<button type="button" class="ps-btn-sm" data-action="run" ${state.busy ? 'disabled' : ''} title="Re-run with your latest preset/prompt edits and add a new swipe to history">↻ Regenerate</button>` : ''}
              <button type="button" class="ps-primary" style="min-height:38px;padding:6px 16px" data-action="run" ${state.busy ? 'disabled' : ''}>▶ ${runs.length > 0 ? 'New Run' : 'Generate Reply'}</button>
              <button type="button" class="ps-danger-btn ps-btn-sm" data-action="stop" ${!state.busy ? 'disabled' : ''}>■ Stop</button>
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
              <button type="button" class="ps-btn-sm" data-action="profile">Sync Active States from Chat</button>
              <button type="button" class="ps-btn-sm" data-action="dry" ${state.busy || !state.draft.id ? 'disabled' : ''}>Saved-Preset Dry Run</button>
            </div>
          </details>
        </div>
      </div>

      <!-- Right Column: Tabbed Output Inspector (Reply | Prompt X-Ray | A/B Compare) -->
      <div class="ps-test-col-output">
        <div class="ps-panel" style="margin-top:0">
          <div class="ps-between" style="margin-bottom:10px">
            <div class="ps-seg-bar">
              <button type="button" data-action="set-test-output-tab" data-outtab="reply" aria-pressed="${outTab === 'reply'}">💬 Reply Preview ${state.busy ? '· …' : ''}</button>
              <button type="button" data-action="set-test-output-tab" data-outtab="xray" aria-pressed="${outTab === 'xray'}">🔬 Prompt X-Ray ${breakdownCount ? `(${breakdownCount})` : ''}</button>
              <button type="button" data-action="set-test-output-tab" data-outtab="compare" aria-pressed="${outTab === 'compare'}">⚖️ A/B Runs (${state.runs.length})</button>
            </div>

            ${outTab === 'reply' ? `
              <div class="ps-actions">
                ${activeUsage ? `<span class="ps-pill ps-pill-ok">P: ${activeUsage.prompt_tokens || 0}t · C: ${activeUsage.completion_tokens || 0}t</span>` : ''}
                <button type="button" class="ps-btn-sm ${isChatView ? 'ps-primary' : ''}" data-action="set-reply-view-mode" data-mode="chat">Chat</button>
                <button type="button" class="ps-btn-sm ${!isChatView ? 'ps-primary' : ''}" data-action="set-reply-view-mode" data-mode="raw">Raw</button>
                <button type="button" class="ps-btn-sm" data-action="copy-test-reply" ${!hasReplyContent ? 'disabled' : ''} title="Copy this reply">📋</button>
              </div>
            ` : ''}
          </div>

          ${outTab === 'reply' ? `
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
                    <span class="ps-pill ps-pill-accent" title="Preset & active blocks used for this run">${esc(viewedRun.presetName || viewedRun.snapshot?.name || 'Draft')} · ${viewedRun.activeBlocksCount ?? '?'} blk</span>
                  ` : ''}
                </div>
                <div class="ps-actions">
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
                  <button type="button" class="ps-primary ps-btn-sm" data-action="continue-test-dialogue">💬 Append to Thread & Reply →</button>
                </div>
              </div>
            ` : ''}
          ` : outTab === 'xray' ? `
            ${renderXRayBreakdownInline(state)}
          ` : `
            ${state.runs.length >= 2 && runA && runB ? `
              <div class="ps-row" style="margin-bottom:10px">
                <label>Left Run (A)
                  <select data-state="compareA">
                    ${state.runs.map((r: any, idx: number) => `<option value="${idx}" ${Number(state.compareA) === idx ? 'selected' : ''}>Run #${idx + 1} (${esc(r.time)})</option>`).join('')}
                  </select>
                </label>
                <label>Right Run (B)
                  <select data-state="compareB">
                    ${state.runs.map((r: any, idx: number) => `<option value="${idx}" ${Number(state.compareB) === idx ? 'selected' : ''}>Run #${idx + 1} (${esc(r.time)})</option>`).join('')}
                  </select>
                </label>
              </div>
              <div class="ps-grid">
                <div class="ps-card">
                  <div class="ps-between"><strong>Run #${Number(state.compareA) + 1}</strong><span class="ps-pill">${esc(runA.connection)}</span></div>
                  <pre class="ps-result" style="margin-top:8px">${esc(runA.content)}</pre>
                </div>
                <div class="ps-card">
                  <div class="ps-between"><strong>Run #${Number(state.compareB) + 1}</strong><span class="ps-pill">${esc(runB.connection)}</span></div>
                  <pre class="ps-result" style="margin-top:8px">${esc(runB.content)}</pre>
                </div>
              </div>
            ` : `
              <div class="ps-empty-state">
                <div style="font-size:1.5rem;margin-bottom:6px">⚖️</div>
                <strong>A/B Run Comparator (${state.runs.length}/2 runs)</strong>
                <p class="ps-muted" style="margin-top:4px">Generate at least 2 test replies in this session to compare different prompts, temperatures, or models side-by-side.</p>
              </div>
            `}
          `}
        </div>
      </div>
    </div>
  `;
}
