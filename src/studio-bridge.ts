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
      provider: fullState.preset.provider || 'loom',
      engine: fullState.preset.engine || 'classic',
      ...(typeof fullState.preset.cache_revision === 'number'
        ? { cache_revision: fullState.preset.cache_revision }
        : {}),
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

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s.`)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

export async function syncSaveWithNativePresetEditor(
  ctx: any,
  request: (action: string, payload?: any) => Promise<any>,
  draftToSave: any,
  isCopy: boolean,
): Promise<any> {
  const pe = ctx.ui?.presetEditor;
  if (!isCopy && draftToSave.id && pe?.getState && pe?.updatePreset) {
    try {
      const peState = pe.getState();
      if (peState?.open && peState?.preset && peState.preset.id === draftToSave.id) {
        const cleanBlocks = cloneBlocksForHost(draftToSave.prompt_order || []);
        pe.updatePreset((latest: any) => ({
          ...latest,
          name: draftToSave.name || latest.name,
          blocks: cleanBlocks,
          parameters: structuredClone(draftToSave.parameters || latest.parameters || {}),
          prompts: structuredClone(draftToSave.prompts || latest.prompts || {}),
          metadata: {
            ...structuredClone(latest.metadata || {}),
            ...structuredClone(draftToSave.metadata || {}),
          },
        }));
        if (typeof pe.flush === 'function') {
          await withTimeout(pe.flush(), 12_000, 'Native Preset Editor save');
          const synced = await request('get', { id: draftToSave.id });
          if (synced) {
            await request('toast', { kind: 'success', title: 'Preset Studio', message: `Saved "${synced.name}"` }).catch(() => {});
            return synced;
          }
        }
      }
    } catch (_) {}
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
  refresh: () => Promise<void>,
  render: () => void,
): () => void {
  let toolbarHandle: { root: HTMLElement; destroy?: () => void } | null = null;
  let toolbarRoot: HTMLElement | null = null;
  let unsubPresetEditor: (() => void) | null = null;

  try {
    if (typeof ctx.ui?.registerPresetEditorToolbarItem === 'function') {
      toolbarHandle = ctx.ui.registerPresetEditorToolbarItem({
        id: 'preset-studio-launcher',
        ariaLabel: 'Open in Preset Studio',
      });
      toolbarRoot = toolbarHandle?.root ?? null;
    } else if (typeof ctx.ui?.mount === 'function') {
      toolbarRoot = ctx.ui.mount('preset_editor_toolbar');
    }

    if (toolbarRoot) {
      toolbarRoot.setAttribute('data-ps-launcher-root', 'true');
      toolbarRoot.style.cssText =
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
        }
        // Always refresh presets, chats, and connections when launching from the native editor
        refresh()
          .catch(() => {})
          .finally(() => {
            scheduleTokenCount();
          });
        if (hasFullMount) {
          setFull(true);
        } else {
          tab.activate?.();
          render();
        }
      });
      toolbarRoot.replaceChildren(launcher);
    }

    if (ctx.ui?.presetEditor?.onChange) {
      unsubPresetEditor = ctx.ui.presetEditor.onChange((peState: any) => {
        if (!peState?.preset || state.dirty || state.busy) return;
        if (!state.draft || state.draft.id === peState.preset.id) {
          const hostDraft = readHostPresetEditorDraft(ctx);
          if (hostDraft) {
            state.draft = hostDraft;
            state.savedFingerprint = computeDraftFingerprint(hostDraft);
            scheduleTokenCount();
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

export function bindDragAndDropListeners(
  root: HTMLElement,
  state: any,
  moveBlock: (from: number, to: number) => void,
  clearLongPress: () => void,
): () => void {
  let dragFromIndex: number | null = null;
  let touchDragIndex: number | null = null;

  function clearDragIndicators() {
    root.querySelectorAll('.ps-dragging, .ps-drag-over-top, .ps-drag-over-bottom').forEach((el) => {
      el.classList.remove('ps-dragging', 'ps-drag-over-top', 'ps-drag-over-bottom');
    });
  }

  function resetDragState() {
    dragFromIndex = null;
    touchDragIndex = null;
    clearDragIndicators();
  }

  const onWindowBlur = () => resetDragState();
  window.addEventListener('blur', onWindowBlur);

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
    resetDragState();
  });

  return () => {
    resetDragState();
    window.removeEventListener('blur', onWindowBlur);
  };
}
