/**
 * Main Application v5.0 - Modular Structure with Tabs
 */

import { initSupabase } from './services/supabase.js';
import { initAuthUI } from './user/ui.js';
import { displayAllTasks } from './components/tasks.js';
import { renderTaskListView } from './components/taskListView.js';
import { renderChartView } from './components/chartView.js';
import { initModalUI, closeTaskModal, openEditModal } from './ui/modal.js';
import { initPopoverUI, closeAllPopovers } from './ui/popover.js';
import { initDragAndDrop } from './features/dragDrop.js';
import { initTabRouter, getCurrentTab } from './features/tabRouter.js';
import { startRealtime, stopRealtime } from './features/realtimeSync.js';
import { showToast } from './ui/toast.js';
import { 
  allTasks, 
  loadTasks, 
  resetTasks, 
  initTaskManagerEvents, 
  submitTaskForm, 
  handleMoveTask, 
  handleDeleteTask,
  handleArchiveTask,
  applyFilters,
  STATUS_NAMES 
} from './features/taskManager.js';
import { STATUS } from './config.js';

let currentSession = null;

export async function initApp() {
  console.log('🚀 Kanban v5.0 (Tabs + Archive)');
  try {
    initSupabase();
    
    // Khởi tạo các module con (DOM Events, UI, logic)
    initModalUI();
    initPopoverUI();
    initTaskManagerEvents();
    initDragAndDrop();
    setupActionListeners();

    // Khởi tạo Tab Router
    initTabRouter((tabName, prevTab) => {
      refreshCurrentView();
    });

    // Khởi tạo Auth & quản lý phiên bản
    initAuthUI({
      onLogin: (session) => {
        currentSession = session;
        loadTasks().then(() => refreshCurrentView());
        startRealtime();
      },
      onLogout: () => {
        currentSession = null;
        stopRealtime();
        resetTasks();
        displayAllTasks([]);
        refreshCurrentView();
      }
    });
  } catch (err) {
    console.error('✗ Init failed:', err);
    showToast('Lỗi khởi tạo ứng dụng', 'error');
  }
}

// ─── Refresh the active tab view ────────────────────
function refreshCurrentView() {
  const tab = getCurrentTab();
  if (tab === 'tasks') {
    renderTaskListView(allTasks);
  } else if (tab === 'chart') {
    renderChartView(allTasks);
  }
}

// ─── Event Dispatcher ───────────────────────────
function setupActionListeners() {
  // Bắt sự kiện form lưu nhiệm vụ mới hoặc sửa nhiệm vụ
  document.getElementById('task-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = document.getElementById('task-edit-id').value;
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;
    let priorityEl = document.querySelector('input[name="task-priority"]:checked');
    const priority = priorityEl ? priorityEl.value : 'trung_binh';
    const deadline = document.getElementById('task-deadline')?.value || null;
    
    await submitTaskForm(title, description, priority, editId, deadline);
    closeTaskModal();
    refreshCurrentView();
  });

  // Lắng nghe tùy chọn action cho task (Edit, Move, Delete, Archive, Restore)
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.task-action');
    if (!btn) return;
    
    e.preventDefault(); 
    e.stopPropagation();
    closeAllPopovers();

    const action = btn.dataset.action;
    const task = allTasks.find(t => String(t.id) === String(btn.dataset.taskId));
    if (!task) return;

    if (action === 'edit') openEditModal(task);
    if (action === 'move-doing') { await handleMoveTask(task, STATUS.IN_PROGRESS); refreshCurrentView(); }
    if (action === 'move-done') { await handleMoveTask(task, STATUS.DONE); refreshCurrentView(); }
    if (action === 'delete') { await handleDeleteTask(task); refreshCurrentView(); }
    if (action === 'archive') { await handleArchiveTask(task); refreshCurrentView(); }
    if (action === 'restore') { await handleRestoreTask(task); refreshCurrentView(); }
  });

  // Checkbox completion in task list view
  document.addEventListener('change', async (e) => {
    if (!e.target.classList.contains('task-list-checkbox')) return;
    const taskId = e.target.dataset.taskId;
    const task = allTasks.find(t => String(t.id) === String(taskId));
    if (!task) return;

    if (e.target.checked) {
      await handleMoveTask(task, STATUS.DONE);
    } else {
      await handleMoveTask(task, STATUS.TODO);
    }
    refreshCurrentView();
  });
}

// ─── Khởi động ứng dụng ─────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
