import { fetchAllTasks, updateTask, deleteTask, createTask } from '../services/supabase.js';
import { displayAllTasks } from '../components/tasks.js';
import { showToast } from '../ui/toast.js';
import { STATUS } from '../config.js';
import { normalizeStatus } from '../helpers/utils.js';

export let allTasks = [];

const SAMPLE_TASKS = [
  { id: 'sample-1', title: 'Hoàn thiện giao diện web Sneaker Store', description: '', priority: 'cao', status: 'todo', created_at: '2025-10-12T00:00:00Z', updated_at: null, progress: null, attachments: null, deadline: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0] },
  { id: 'sample-2', title: 'Viết báo cáo bộ chỉnh lưu', description: 'Chi tiết các thông số linh kiện và biểu đồ sóng ngõ ra...', priority: 'trung_binh', status: 'todo', created_at: '2025-10-08T00:00:00Z', updated_at: null, progress: null, attachments: 2, deadline: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0] },
  { id: 'sample-3', title: 'Thiết kế sơ đồ nguyên lý mạch nguồn', description: '', priority: 'thap', status: 'todo', created_at: '2025-10-05T00:00:00Z', updated_at: null, progress: null, attachments: null, deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] },
  { id: 'sample-4', title: 'Mô phỏng mạch điều khiển động cơ trên Matlab', description: '', priority: 'cao', status: 'in_progress', created_at: '2025-09-28T00:00:00Z', updated_at: null, progress: 65, attachments: null, deadline: new Date(Date.now()).toISOString().split('T')[0] },
  { id: 'sample-5', title: 'Lập trình giao tiếp UART cho STM32', description: '', priority: 'trung_binh', status: 'in_progress', created_at: '2025-09-20T00:00:00Z', updated_at: null, progress: 40, attachments: null, deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0] },
  { id: 'sample-6', title: 'Code ESP32 hệ thống rèm thông minh', description: '', priority: 'thap', status: 'done', created_at: '2025-09-15T00:00:00Z', updated_at: new Date(Date.now() - 2 * 86400000).toISOString(), progress: null, attachments: null, deadline: null },
  { id: 'sample-7', title: 'Xem lại kết quả tài liệu hệ thống thông minh', description: '', priority: 'trung_binh', status: 'done', created_at: '2025-09-10T00:00:00Z', updated_at: new Date(Date.now() - 5 * 86400000).toISOString(), progress: null, attachments: null, deadline: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0] },
  { id: 'sample-8', title: 'Hoàn thành bài tập lớn vi xử lý', description: '', priority: 'cao', status: 'done', created_at: '2025-09-05T00:00:00Z', updated_at: new Date(Date.now() - 7 * 86400000).toISOString(), progress: null, attachments: null, deadline: null },
  { id: 'sample-9', title: 'Nộp báo cáo thực tập', description: '', priority: 'cao', status: 'done', created_at: '2025-08-28T00:00:00Z', updated_at: new Date(Date.now() - 10 * 86400000).toISOString(), progress: null, attachments: 1, deadline: null },
  { id: 'sample-10', title: 'Kiểm tra mạch PCB phiên bản 2', description: '', priority: 'thap', status: 'done', created_at: '2025-08-20T00:00:00Z', updated_at: new Date(Date.now() - 14 * 86400000).toISOString(), progress: null, attachments: null, deadline: null }
];

export function isSampleTask(task) {
  return String(task.id).startsWith('sample-');
}

export function applyFilters() {
  const q = (document.getElementById('search-task')?.value || '').toLowerCase();
  const p = document.getElementById('filter-priority')?.value || 'all';

  // Exclude archived tasks from board view
  const filtered = allTasks.filter(t => {
    if (normalizeStatus(t.status) === STATUS.ARCHIVED) return false;
    const matchTitle = (t.title || '').toLowerCase().includes(q);
    const matchPri = p === 'all' || t.priority === p;
    return matchTitle && matchPri;
  });

  displayAllTasks(filtered);
}

export async function loadTasks() {
  try {
    const dbTasks = await fetchAllTasks();
    if (dbTasks === null) {
      allTasks = SAMPLE_TASKS;
    } else {
      allTasks = dbTasks;
    }
    applyFilters();
  } catch (err) {
    console.error('Load tasks failed, using sample data:', err);
    allTasks = SAMPLE_TASKS;
    applyFilters();
  }
}

export function pushTask(newTask) {
  allTasks.unshift(newTask);
}
export function updateTaskState(idx, updated) {
  if(idx !== -1) allTasks[idx] = { ...allTasks[idx], ...updated };
}
export function removeTaskState(deletedId) {
  allTasks = allTasks.filter(t => t.id !== deletedId);
}
export function resetTasks() {
  allTasks = [];
}

export async function submitTaskForm(title, description, priority, editId, deadline) {
  if (editId) {
    await handleEditTask(editId, { title, description, priority, deadline });
  } else {
    try {
      const taskData = { 
        title, 
        description, 
        priority, 
        status: STATUS.TODO,
        deadline: deadline || null
      };
      const newTask = await createTask(taskData);
      if (newTask) {
        pushTask(newTask);
        applyFilters();
      }
      showToast('Thêm nhiệm vụ thành công!', 'success');
    } catch (err) {
      console.error('Create task error:', err);
      showToast(err.message || 'Lỗi khi thêm nhiệm vụ', 'error');
    }
  }
}

export const STATUS_NAMES = { todo: 'Cần làm', in_progress: 'Đang làm', done: 'Hoàn thành', archived: 'Lưu trữ' };

export async function handleEditTask(taskId, updates) {
  const task = allTasks.find(t => String(t.id) === String(taskId));
  if (!task) return;
  try {
    task.title = updates.title;
    task.description = updates.description;
    task.priority = updates.priority;
    task.deadline = updates.deadline !== undefined ? (updates.deadline || null) : task.deadline;
    task.updated_at = new Date().toISOString();
    applyFilters();

    if (!isSampleTask(task)) {
      const dbUpdates = {
        title: updates.title,
        description: updates.description,
        priority: updates.priority
      };
      if (updates.deadline !== undefined) {
        dbUpdates.deadline = updates.deadline || null;
      }
      await updateTask(task.id, dbUpdates);
    }
    showToast('Đã cập nhật nhiệm vụ', 'success');
  } catch (err) {
    showToast('Lỗi cập nhật nhiệm vụ', 'error');
  }
}

export async function handleMoveTask(task, newStatus) {
  const oldStatus = task.status;
  try {
    task.status = newStatus;
    task.updated_at = new Date().toISOString();
    applyFilters();

    if (!isSampleTask(task)) {
      await updateTask(task.id, { status: newStatus });
    }
    showToast(`Đã chuyển sang "${STATUS_NAMES[newStatus]}"`, 'success');
  } catch (err) {
    task.status = oldStatus;
    applyFilters();
    showToast('Lỗi chuyển nhiệm vụ', 'error');
  }
}

export async function handleDeleteTask(task) {
  if (!confirm(`Xác nhận xóa: "${task.title}"?`)) return;
  try {
    if (!isSampleTask(task)) {
      await deleteTask(task.id);
    }
    removeTaskState(task.id);
    applyFilters();
    showToast('Đã xóa nhiệm vụ', 'success');
  } catch {
    showToast('Lỗi xóa nhiệm vụ', 'error');
  }
}

export async function handleArchiveTask(task) {
  const oldStatus = task.status;
  try {
    task.status = STATUS.ARCHIVED;
    task.updated_at = new Date().toISOString();
    applyFilters();

    if (!isSampleTask(task)) {
      await updateTask(task.id, { status: STATUS.ARCHIVED });
    }
    showToast('Đã lưu trữ nhiệm vụ', 'success');
  } catch (err) {
    task.status = oldStatus;
    applyFilters();
    showToast('Lỗi lưu trữ nhiệm vụ', 'error');
  }
}

export async function handleRestoreTask(task) {
  const oldStatus = task.status;
  try {
    task.status = STATUS.TODO;
    task.updated_at = new Date().toISOString();
    applyFilters();

    if (!isSampleTask(task)) {
      await updateTask(task.id, { status: STATUS.TODO });
    }
    showToast('Đã khôi phục nhiệm vụ về "Cần làm"', 'success');
  } catch (err) {
    task.status = oldStatus;
    applyFilters();
    showToast('Lỗi khôi phục nhiệm vụ', 'error');
  }
}

export async function handleClearAllArchived() {
  const archived = allTasks.filter(t => normalizeStatus(t.status) === STATUS.ARCHIVED);
  try {
    for (const task of archived) {
      if (!isSampleTask(task)) {
        await deleteTask(task.id);
      }
    }
    allTasks = allTasks.filter(t => normalizeStatus(t.status) !== STATUS.ARCHIVED);
    applyFilters();
    showToast(`Đã xóa ${archived.length} nhiệm vụ lưu trữ`, 'success');
  } catch (err) {
    showToast('Lỗi xóa lưu trữ', 'error');
  }
}

export function getArchivedTasks() {
  return allTasks.filter(t => normalizeStatus(t.status) === STATUS.ARCHIVED);
}

export function initTaskManagerEvents() {
  document.getElementById('search-task')?.addEventListener('input', applyFilters);
  document.getElementById('filter-priority')?.addEventListener('change', applyFilters);
}
