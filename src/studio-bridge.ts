import { cloneBlocksForHost, computeDraftFingerprint, ensureUniqueBlockIds } from './studio-core.js';

export function readHostPresetEditorDraft(ctx: any): any | null {
  try {
    const fullState = ctx.ui?.presetEditor?.getState?.();
    if (!fullState?.open || !fullState?.preset || !fullState?.presetId) return null;
    const scoped = ctx.ui?.presetEditor?.extension?.getState?.();
    const blocks =
      scoped?.presetId === fullState.presetId && Array.isArray(scoped.blocks)
        ? cloneBlocksForHost(scoped.blocks)
        : cloneBlocksForHost(fullState.preset.blocks || []);
    const promptVariables =
      scoped?.presetId === fullState.presetId && scoped.promptVariableValues
        ? structuredClone(scoped.promptVariableValues)
        : structuredClone(fullState.preset.metadata?.promptVariables || {});
    return ensureUniqueBlockIds({
      id: fullState.preset.id,
      name: fullState.preset.name,
      provider: 'loom',
      engine: 'classic',
      parameters: structuredClone(fullState.preset.parameters || {}),
      prompts: structuredClone(fullState.preset.prompts || {}),
      metadata: {
        ...structuredClone(fullState.preset.metadata || {}),
        promptVariables,
      },
      prompt_order: blocks,
    });
  } catch (_) {
    return null;
  }
}

export async function syncSaveWithNativePresetEditor(
  ctx: any,
  request: (action: string, payload?: any) => Promise<any>,
  draftToSave: any,
  isCopy: boolean,
): Promise<any> {
  const pe = ctx.ui?.presetEditor;
  if (!isCopy && draftToSave.id && pe?.getState && pe?.updatePreset) {
    let peState = pe.getState();
    if (!peState?.open) {
      await request('open-native-presets-tab').catch(() => {});
      for (let attempt = 0; attempt < 12; attempt++) {
        await new Promise((r) => setTimeout(r, 35));
        peState = pe.getState();
        if (peState?.open && peState?.preset) break;
      }
    }
    if (peState?.open && peState?.preset && peState.preset.id === draftToSave.id) {
      const cleanBlocks = cloneBlocksForHost(draftToSave.prompt_order || []);
      let applied = false;
      pe.updatePreset((latest: any) => {
        applied = true;
        return {
          ...latest,
          name: draftToSave.name || latest.name,
          blocks: cleanBlocks,
          parameters: structuredClone(draftToSave.parameters || latest.parameters || {}),
          prompts: structuredClone(draftToSave.prompts || latest.prompts || {}),
          metadata: {
            ...structuredClone(latest.metadata || {}),
            ...structuredClone(draftToSave.metadata || {}),
          },
        };
      });
      if (applied) {
        if (typeof pe.flush === 'function') await pe.flush();
        const freshSaved = await request('get', { id: draftToSave.id });
        await request('toast', {
          kind: 'success',
          title: 'Preset Studio',
          message: `Applied "${draftToSave.name}" live to Lumiverse`,
        });
        return freshSaved || { ...draftToSave, prompt_order: cleanBlocks };
      }
    }
  }
  return await request('save', {
    preset: { ...draftToSave, prompt_order: cloneBlocksForHost(draftToSave.prompt_order || []) },
    copy: isCopy,
  });
}

export function mountPresetEditorLauncher(
  ctx: any,
  state: any,
  setFull: (val: boolean) => void,
  hasFullMount: boolean,
  tab: any,
  scheduleTokenCount: () => void,
  render: () => void,
): () => void {
  let toolbarRoot: HTMLElement | null = null;
  let unsubPresetEditor: (() => void) | null = null;

  // 1. Immediately purge any duplicate or stale launchers from prior reloads
  document.querySelectorAll('[data-ps-launcher-root], [data-ps-launcher]').forEach((el) => {
    try { el.remove(); } catch (_) {}
  });
  document.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent?.includes('Open in Preset Studio') && !btn.closest('.ps-root')) {
      const parent = btn.parentElement;
      try {
        btn.remove();
        if (parent && parent.children.length === 0 && parent.tagName === 'DIV') parent.remove();
      } catch (_) {}
    }
  });

  try {
    if (ctx.ui?.mount) {
      toolbarRoot = ctx.ui.mount('preset_editor_toolbar');
      toolbarRoot!.setAttribute('data-ps-launcher-root', 'true');
      toolbarRoot!.style.cssText =
        'display:flex;align-items:center;width:100%;padding:6px 14px;border-bottom:1px solid var(--lumiverse-border, rgba(255,255,255,0.08))';
      const launcher = document.createElement('button');
      launcher.type = 'button';
      launcher.setAttribute('data-ps-launcher', 'true');
      launcher.style.cssText =
        'display:flex;align-items:center;justify-content:center;width:100%;gap:7px;min-height:36px;padding:0 12px;border:1px solid var(--lumiverse-border);border-radius:8px;background:var(--lumiverse-fill-subtle, rgba(255,255,255,0.04));color:var(--lumiverse-text);font:inherit;font-size:12px;font-weight:700;cursor:pointer';
      launcher.innerHTML = '<span>✳ Open in Preset Studio</span>';
      launcher.addEventListener('click', () => {
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
        if (hasFullMount) setFull(true);
        else {
          tab.activate?.();
          render();
        }
      });
      toolbarRoot!.replaceChildren(launcher);
    }
    if (ctx.ui?.presetEditor?.onChange) {
      unsubPresetEditor = ctx.ui.presetEditor.onChange((peState: any) => {
        if (!peState?.preset || state.dirty || state.busy) return;
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
    if (toolbarRoot) {
      toolbarRoot.replaceChildren();
      try { toolbarRoot.remove(); } catch (_) {}
      toolbarRoot = null;
    }
    document.querySelectorAll('[data-ps-launcher-root], [data-ps-launcher]').forEach((el) => {
      try { el.remove(); } catch (_) {}
    });
  };
}

export function bindDragAndDropListeners(
  root: HTMLElement,
  state: any,
  moveBlock: (from: number, to: number) => void,
  clearLongPress: () => void,
): void {
  let dragFromIndex: number | null = null;
  let touchDragIndex: number | null = null;

  function clearDragIndicators() {
    root.querySelectorAll('.ps-dragging, .ps-drag-over-top, .ps-drag-over-bottom').forEach((el) => {
      el.classList.remove('ps-dragging', 'ps-drag-over-top', 'ps-drag-over-bottom');
    });
  }

  root.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement;
    const row = target.closest<HTMLElement>('[data-context-index]');
    if (!row || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
    dragFromIndex = Number(row.dataset.contextIndex);
    row.classList.add('ps-dragging');
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(dragFromIndex));
    }
  });

  root.addEventListener('dragover', (e) => {
    if (dragFromIndex === null) return;
    const row = (e.target as HTMLElement).closest<HTMLElement>('[data-context-index]');
    if (!row) return;
    e.preventDefault();
    const targetIndex = Number(row.dataset.contextIndex);
    if (targetIndex === dragFromIndex) return;
    const rect = row.getBoundingClientRect();
    const isAfter = e.clientY > rect.top + rect.height / 2;
    row.classList.toggle('ps-drag-over-top', !isAfter);
    row.classList.toggle('ps-drag-over-bottom', isAfter);
  });

  root.addEventListener('dragleave', (e) => {
    const row = (e.target as HTMLElement).closest<HTMLElement>('[data-context-index]');
    if (row) row.classList.remove('ps-drag-over-top', 'ps-drag-over-bottom');
  });

  root.addEventListener('drop', (e) => {
    if (dragFromIndex === null) return;
    e.preventDefault();
    const row = (e.target as HTMLElement).closest<HTMLElement>('[data-context-index]');
    const from = dragFromIndex;
    dragFromIndex = null;
    clearDragIndicators();
    if (!row) return;
    let to = Number(row.dataset.contextIndex);
    if (from === to) return;
    const rect = row.getBoundingClientRect();
    const isAfter = e.clientY > rect.top + rect.height / 2;
    if (isAfter && from > to) to = Math.min(state.draft.prompt_order.length - 1, to + 1);
    else if (!isAfter && from < to) to = Math.max(0, to - 1);
    moveBlock(from, to);
  });

  root.addEventListener('dragend', () => {
    dragFromIndex = null;
    clearDragIndicators();
  });

  root.addEventListener('pointerdown', (e) => {
    const handle = (e.target as HTMLElement).closest<HTMLElement>('[data-drag-handle]');
    if (!handle || e.pointerType === 'mouse') return;
    clearLongPress();
    touchDragIndex = Number(handle.dataset.dragHandle);
    handle.closest('[data-context-index]')?.classList.add('ps-dragging');
    handle.setPointerCapture?.(e.pointerId);
  });

  root.addEventListener('pointermove', (e) => {
    if (touchDragIndex === null) return;
    e.preventDefault();
    clearDragIndicators();
    root.querySelector(`[data-context-index="${touchDragIndex}"]`)?.classList.add('ps-dragging');
    const elUnder = document.elementFromPoint(e.clientX, e.clientY);
    const overRow = elUnder?.closest?.('[data-context-index]') as HTMLElement | null;
    if (overRow && Number(overRow.dataset.contextIndex) !== touchDragIndex) {
      const rect = overRow.getBoundingClientRect();
      const isAfter = e.clientY > rect.top + rect.height / 2;
      overRow.classList.toggle('ps-drag-over-top', !isAfter);
      overRow.classList.toggle('ps-drag-over-bottom', isAfter);
    }
  });

  root.addEventListener('pointerup', (e) => {
    if (touchDragIndex === null) return;
    const from = touchDragIndex;
    touchDragIndex = null;
    const elUnder = document.elementFromPoint(e.clientX, e.clientY);
    const overRow = elUnder?.closest?.('[data-context-index]') as HTMLElement | null;
    clearDragIndicators();
    if (!overRow) return;
    const to = Number(overRow.dataset.contextIndex);
    if (from !== to) moveBlock(from, to);
  });

  root.addEventListener('pointercancel', () => {
    touchDragIndex = null;
    clearDragIndicators();
  });
}
