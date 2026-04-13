import { subscribeToTaskChanges, unsubscribeFromTaskChanges } from '../services/supabase.js';
import { allTasks, applyFilters, pushTask, updateTaskState, removeTaskState } from './taskManager.js';
import { showToast } from '../ui/toast.js';

let realtimeSub = null;

export async function startRealtime() {
  if (realtimeSub) return;
  realtimeSub = await subscribeToTaskChanges(handleRealtimeUpdate);
}

export function stopRealtime() {
  if (realtimeSub) {
    unsubscribeFromTaskChanges();
    realtimeSub = null;
  }
}

function handleRealtimeUpdate(payload) {
  const { eventType } = payload;

  switch (eventType) {
    case 'INSERT': {
      const newTask = payload.new;
      if (!allTasks.some(t => t.id === newTask.id)) {
        pushTask(newTask);
        applyFilters();
        showToast(`Nhiệm vụ mới: "${newTask.title}"`, 'info');
      }
      break;
    }
    case 'UPDATE': {
      const updated = payload.new;
      const idx = allTasks.findIndex(t => t.id === updated.id);
      if (idx !== -1) {
        const oldStatus = allTasks[idx].status;
        updateTaskState(idx, updated);
        applyFilters();
        if (oldStatus !== updated.status) {
          const statusNames = { todo: 'Cần làm', in_progress: 'Đang làm', done: 'Hoàn thành' };
          showToast(`"${updated.title}" → ${statusNames[updated.status] || updated.status}`, 'info');
        }
      } else {
        pushTask(updated);
        applyFilters();
      }
      break;
    }
    case 'DELETE': {
      const deletedId = payload.old?.id;
      if (deletedId) {
        const deleted = allTasks.find(t => t.id === deletedId);
        removeTaskState(deletedId);
        applyFilters();
        if (deleted) {
          showToast(`Đã xóa: "${deleted.title}"`, 'info');
        }
      }
      break;
    }
  }
}
