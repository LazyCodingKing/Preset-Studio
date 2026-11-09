import { esc, uid } from './studio-core.js';

export interface ModalRef {
  current: any;
}

export function closeModalRef(modalRef: ModalRef): void {
  if (modalRef.current) {
    try {
      modalRef.current.close?.();
      modalRef.current.remove?.();
      modalRef.current.dismiss?.();
    } catch (_) {}
    modalRef.current = null;
  }
}

export function askConfirm(
  root: HTMLElement,
  modalRef: ModalRef,
  title: string,
  message: string,
  variant: 'warning' | 'danger' | 'info' = 'warning',
  confirmLabel = 'Confirm',
): Promise<boolean> {
  closeModalRef(modalRef);
  const returnFocus = document.activeElement as HTMLElement | null;
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'ps-native-dialog';
    const isDanger = variant === 'danger';
    dialog.innerHTML = `<h3 style="margin-bottom:8px">${esc(title)}</h3><p class="ps-muted" style="margin-bottom:16px;color:var(--ps-text)">${esc(message)}</p><div class="ps-actions" style="justify-content:flex-end"><button type="button" data-confirm-result="cancel">Cancel</button><button type="button" class="${isDanger ? 'ps-danger-btn' : 'ps-primary'}" style="${isDanger ? 'background:var(--ps-danger);color:#14111c;font-weight:700' : ''}" data-confirm-result="ok">${esc(confirmLabel)}</button></div>`;
    const finish = (val: boolean) => {
      if (modalRef.current === dialog) modalRef.current = null;
      try { dialog.close(); } catch (_) {}
      dialog.remove();
      returnFocus?.focus?.({ preventScroll: true });
      resolve(val);
    };
    dialog.addEventListener('cancel', (ev) => { ev.preventDefault(); finish(false); });
    dialog.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') ev.stopPropagation(); });
    dialog.addEventListener('click', (ev) => {
      if (ev.target === dialog) finish(false);
      const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('button[data-confirm-result]');
      if (btn) finish(btn.dataset.confirmResult === 'ok');
    });
    root.appendChild(dialog);
    modalRef.current = dialog;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    dialog.querySelector<HTMLElement>('[data-confirm-result="ok"]')?.focus({ preventScroll: true });
  });
}

export function openFindReplaceDialog(
  root: HTMLElement,
  modalRef: ModalRef,
  state: any,
  persist: () => void,
  render: () => void,
): void {
  const d = state.draft;
  if (!d) return;
  closeModalRef(modalRef);
  const returnFocus = document.activeElement as HTMLElement | null;
  const dialog = document.createElement('dialog');
  dialog.className = 'ps-native-dialog';
  dialog.innerHTML = `<div class="ps-between" style="margin-bottom:8px"><h3>🔍 Find & Replace Across Preset</h3><button type="button" class="ps-btn-sm ps-btn-icon" data-fr="close" aria-label="Close">✕</button></div><p class="ps-muted" style="margin-bottom:10px">Search and replace literal text across all unlocked blocks in your draft. Locked blocks are skipped unless unlocked first.</p><div class="ps-grid"><label>Find Text<textarea data-fr="find" rows="2" style="min-height:64px" spellcheck="false" placeholder="Text or {{macro}} to find…"></textarea></label><label>Replace With<textarea data-fr="replace" rows="2" style="min-height:64px" spellcheck="false" placeholder="Replacement text (leave empty to delete)…"></textarea></label></div><p class="ps-muted" style="margin:8px 0" data-fr="status" role="status">Enter text above to preview matching blocks.</p><div class="ps-list" style="max-height:280px;overflow:auto" data-fr="results"></div><div class="ps-between" style="margin-top:12px;padding-top:10px;border-top:1px solid var(--ps-border)"><button type="button" class="ps-btn-sm" data-fr="close">Cancel</button><button type="button" class="ps-btn-sm ps-primary" data-fr="apply" disabled>Replace Matches</button></div>`;
  const findInput = dialog.querySelector<HTMLTextAreaElement>('[data-fr="find"]')!;
  const replaceInput = dialog.querySelector<HTMLTextAreaElement>('[data-fr="replace"]')!;
  const statusEl = dialog.querySelector<HTMLElement>('[data-fr="status"]')!;
  const resultsEl = dialog.querySelector<HTMLElement>('[data-fr="results"]')!;
  const applyBtn = dialog.querySelector<HTMLButtonElement>('[data-fr="apply"]')!;
  const selectedIds = new Set<string>();
  let matches: Array<{ blk: any; count: number; parts: string[] }> = [];

  const close = () => {
    if (modalRef.current === dialog) modalRef.current = null;
    try { dialog.close(); } catch (_) {}
    dialog.remove();
    returnFocus?.focus?.({ preventScroll: true });
  };

  const updatePreview = () => {
    const needle = findInput.value;
    const rep = replaceInput.value;
    matches = [];
    if (needle && needle !== rep) {
      for (const blk of d.prompt_order) {
        if (blk.isLocked || blk.marker === 'category') continue;
        const parts = (blk.content || '').split(needle);
        if (parts.length > 1) {
          matches.push({ blk, count: parts.length - 1, parts });
          if (!selectedIds.size) selectedIds.add(blk.id);
        }
      }
    }
    const totalCount = matches.reduce((acc, m) => acc + (selectedIds.has(m.blk.id) ? m.count : 0), 0);
    statusEl.textContent = !needle
      ? 'Enter text above to preview matching blocks.'
      : needle === rep
        ? 'Find and Replace strings are identical.'
        : `${matches.length} matching unlocked block(s) · ${totalCount} replacement(s) selected.`;
    applyBtn.disabled = totalCount === 0;
    applyBtn.textContent = totalCount ? `Replace ${totalCount} Match(es)` : 'Replace Matches';
    resultsEl.innerHTML = matches
      .map(({ blk, count, parts }) => {
        const previewHtml = parts
          .map((p) => esc(p))
          .join(`<mark class="ps-mark-del">${esc(needle)}</mark><mark class="ps-mark-ins">${esc(rep)}</mark>`);
        return `<details class="ps-card" style="padding:8px"><summary class="ps-between"><label style="display:inline-flex;align-items:center;gap:8px;flex:1"><input type="checkbox" style="width:auto;min-height:18px" data-fr-id="${esc(blk.id)}" ${selectedIds.has(blk.id) ? 'checked' : ''}><strong>${esc(blk.name || 'Untitled')}</strong></label><span class="ps-pill">${count} match${count === 1 ? '' : 'es'}</span></summary><pre class="ps-result" style="margin-top:6px;max-height:140px">${previewHtml}</pre></details>`;
      })
      .join('');
  };

  findInput.addEventListener('input', () => { selectedIds.clear(); updatePreview(); });
  replaceInput.addEventListener('input', updatePreview);
  resultsEl.addEventListener('change', (ev) => {
    const cb = (ev.target as HTMLElement).closest<HTMLInputElement>('input[data-fr-id]');
    if (!cb) return;
    if (cb.checked) selectedIds.add(cb.dataset.frId!);
    else selectedIds.delete(cb.dataset.frId!);
    updatePreview();
  });
  dialog.addEventListener('cancel', (ev) => { ev.preventDefault(); close(); });
  dialog.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') ev.stopPropagation(); });
  dialog.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement;
    if (target === dialog || target.closest('[data-fr="close"]')) { close(); return; }
    if (target.closest('[data-fr="apply"]')) {
      const needle = findInput.value;
      const rep = replaceInput.value;
      let changedBlocks = 0;
      for (const { blk } of matches) {
        if (!selectedIds.has(blk.id)) continue;
        blk.content = (blk.content || '').split(needle).join(rep);
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
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  findInput.focus({ preventScroll: true });
}

export function openTemplatePickerModal(
  root: HTMLElement,
  modalRef: ModalRef,
  state: any,
  insertEntries: (entries: any[]) => void,
  importJsonFile: (mode: 'preset' | 'template') => Promise<void>,
  render: () => void,
): void {
  const d = state.draft;
  if (!d) return;
  closeModalRef(modalRef);
  const returnFocus = document.activeElement as HTMLElement | null;
  const afterName = d.prompt_order[state.selected]?.name || 'selected block';
  const dialog = document.createElement('dialog');
  dialog.className = 'ps-native-dialog';
  dialog.innerHTML = `<div class="ps-between" style="margin-bottom:8px"><h3>Choose a Template to Add</h3><button type="button" class="ps-btn-sm ps-btn-icon" data-modal-action="close" aria-label="Close">✕</button></div><p class="ps-muted" style="margin-bottom:12px">Blocks will be inserted right after <strong>${esc(afterName)}</strong>.</p>${
    state.templates.length
      ? `<div class="ps-list">${state.templates
          .map((t: any, idx: number) => {
            const blockNames = (t.entries || []).map((e: any) => e.block?.name || 'Untitled').join(' · ');
            return `<div class="ps-card ps-between"><div style="min-width:0;flex:1"><div><strong>${esc(t.name)}</strong> <span class="ps-pill">${t.entries.length} block${t.entries.length === 1 ? '' : 's'}</span></div><div class="ps-muted" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px">${esc(blockNames)}</div></div><button type="button" class="ps-btn-sm ps-primary" data-modal-insert="${idx}">＋ Insert</button></div>`;
          })
          .join('')}</div>`
      : `<div class="ps-card" style="text-align:center;padding:18px 12px"><p class="ps-muted">No saved templates yet. Import a template JSON or build one in Remix & Templates.</p></div>`
  }<div class="ps-between" style="margin-top:14px;padding-top:10px;border-top:1px solid var(--ps-border)"><button type="button" class="ps-btn-sm" data-modal-action="import">📥 Import Template JSON</button><button type="button" class="ps-btn-sm" data-modal-action="remix">Manage in Remix Tab →</button></div>`;

  const close = () => {
    if (modalRef.current === dialog) modalRef.current = null;
    try { dialog.close(); } catch (_) {}
    dialog.remove();
    returnFocus?.focus?.({ preventScroll: true });
  };
  dialog.addEventListener('cancel', (ev) => { ev.preventDefault(); close(); });
  dialog.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') ev.stopPropagation(); });
  dialog.addEventListener('click', async (ev) => {
    const target = ev.target as HTMLElement;
    if (target === dialog) { close(); return; }
    const insBtn = target.closest<HTMLButtonElement>('button[data-modal-insert]');
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
    const actBtn = target.closest<HTMLButtonElement>('button[data-modal-action]');
    if (!actBtn) return;
    const act = actBtn.dataset.modalAction;
    close();
    if (act === 'remix') {
      state.view = 'remix';
      render();
    } else if (act === 'import') {
      try {
        await importJsonFile('template');
        render();
        openTemplatePickerModal(root, modalRef, state, insertEntries, importJsonFile, render);
      } catch (err: any) {
        state.notice = err.message;
        render();
      }
    }
  });
  root.appendChild(dialog);
  modalRef.current = dialog;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

export function openBlockContextMenu(
  root: HTMLElement,
  modalRef: ModalRef,
  state: any,
  index: number,
  x: number,
  y: number,
  callbacks: {
    openFullTextEditorForBlock: (b: any) => Promise<void>;
    runMacroPreview: (b: any) => Promise<void>;
    moveBlock: (from: number, to: number) => void;
    deleteBlockAtIndex: (idx: number) => Promise<void>;
    persist: () => void;
    render: () => void;
  },
): void {
  const d = state.draft;
  const b = d?.prompt_order?.[index];
  if (!b) return;
  closeModalRef(modalRef);
  state.selected = index;
  const menu = document.createElement('div');
  menu.className = 'ps-ctx-menu';
  const left = Math.max(8, Math.min(x, window.innerWidth - 230));
  const top = Math.max(8, Math.min(y, window.innerHeight - 310));
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.innerHTML = `
    <button type="button" data-ctx-key="edit-macro" ${b.isLocked ? 'disabled' : ''}>⤢ Full-Screen Macro Editor</button>
    <button type="button" data-ctx-key="preview-macro">⚡ Preview Resolved Macros</button>
    <button type="button" data-ctx-key="toggle">${b.enabled ? 'Disable Block' : 'Enable Block'}</button>
    <button type="button" data-ctx-key="lock">${b.isLocked ? '🔓 Unlock Block' : '🔒 Lock Block'}</button>
    <hr style="border:0;border-top:1px solid var(--ps-border);margin:3px 0">
    <button type="button" data-ctx-key="dup">Duplicate Block</button>
    <button type="button" data-ctx-key="basket">＋ Add to Template Basket</button>
    <button type="button" data-ctx-key="top" ${index === 0 ? 'disabled' : ''}>⇈ Move to Top</button>
    <button type="button" data-ctx-key="bottom" ${index >= d.prompt_order.length - 1 ? 'disabled' : ''}>⇊ Move to Bottom</button>
    <hr style="border:0;border-top:1px solid var(--ps-border);margin:3px 0">
    <button type="button" class="ps-danger-btn" data-ctx-key="delete">🗑 Delete Block</button>
  `;
  const dismiss = () => {
    if (modalRef.current === menu) modalRef.current = null;
    menu.remove();
    document.removeEventListener('pointerdown', onOutside, true);
  };
  const onOutside = (ev: Event) => {
    if (!menu.contains(ev.target as Node)) dismiss();
  };
  setTimeout(() => document.addEventListener('pointerdown', onOutside, true), 0);
  menu.addEventListener('click', async (ev) => {
    const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('button[data-ctx-key]');
    if (!btn) return;
    const selectedKey = btn.dataset.ctxKey;
    dismiss();
    if (selectedKey === 'edit-macro') await callbacks.openFullTextEditorForBlock(b);
    else if (selectedKey === 'preview-macro') { state.showMacroPane = true; await callbacks.runMacroPreview(b); }
    else if (selectedKey === 'toggle') { b.enabled = !b.enabled; callbacks.persist(); callbacks.render(); }
    else if (selectedKey === 'lock') { b.isLocked = !b.isLocked; callbacks.persist(); callbacks.render(); }
    else if (selectedKey === 'dup') {
      d.prompt_order.splice(index + 1, 0, { ...structuredClone(b), id: uid(), name: (b.name || 'Block') + ' copy', isLocked: false });
      state.selected = index + 1;
      callbacks.persist();
      callbacks.render();
    } else if (selectedKey === 'basket') {
      state.basket.push({ block: structuredClone(b), values: structuredClone(d.metadata?.promptVariables?.[b.id] || {}), source: d.name || 'Draft' });
      state.notice = `Added “${b.name}” to template basket.`;
      callbacks.render();
    } else if (selectedKey === 'top' && index > 0) callbacks.moveBlock(index, 0);
    else if (selectedKey === 'bottom' && index < d.prompt_order.length - 1) callbacks.moveBlock(index, d.prompt_order.length - 1);
    else if (selectedKey === 'delete') await callbacks.deleteBlockAtIndex(index);
  });
  root.appendChild(menu);
  modalRef.current = menu;
}
