import { allTasks, handleMoveTask } from './taskManager.js';

export function initDragAndDrop() {
  let draggedId = null;
  let draggedEl = null;

  document.addEventListener('dragstart', e => {
    const card = e.target.closest('.task-card');
    if (!card) return;
    draggedId = card.dataset.taskId;
    draggedEl = card;
    requestAnimationFrame(() => card.classList.add('dragging'));
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
  });

  document.addEventListener('dragend', () => {
    if (draggedEl) {
      draggedEl.classList.remove('dragging');
      draggedEl.classList.add('just-dropped');
      draggedEl.addEventListener('animationend', () => {
        if(draggedEl) draggedEl.classList.remove('just-dropped');
      }, { once: true });
    }
    document.querySelectorAll('.kanban-dropzone').forEach(z => z.classList.remove('drag-over'));
    draggedId = null;
    draggedEl = null;
  });

  document.querySelectorAll('.kanban-dropzone').forEach(zone => {
    let dragCount = 0;

    zone.addEventListener('dragenter', e => {
      e.preventDefault();
      dragCount++;
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    zone.addEventListener('dragleave', () => {
      dragCount--;
      if (dragCount <= 0) { dragCount = 0; zone.classList.remove('drag-over'); }
    });

    zone.addEventListener('drop', async e => {
      e.preventDefault();
      dragCount = 0;
      zone.classList.remove('drag-over');
      if (!draggedId) return;
      const newStatus = zone.dataset.status;
      
      const task = allTasks.find(t => String(t.id) === String(draggedId));
      if (task && task.status !== newStatus) {
        await handleMoveTask(task, newStatus);
      }
    });
  });
}
