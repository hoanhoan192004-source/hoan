/**
 * Task List View – Tabular view of all tasks
 * Features: checkbox completion, status filter, sort, actions
 */

import { STATUS } from '../config.js';
import { normalizeStatus, formatDate, escapeHTML, normalizePriority, getDeadlineStatus, formatDeadlineRelative } from '../helpers/utils.js';

const STATUS_BADGE = {
  todo:        { label: 'Cần làm',    icon: 'pending_actions', colorClass: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30' },
  in_progress: { label: 'Đang làm',   icon: 'autorenew',       colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' },
  done:        { label: 'Hoàn thành',  icon: 'task_alt',        colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' },
};

const PRIORITY_BADGE = {
  cao:        { label: '🔴 Cao',    colorClass: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' },
  trung_binh: { label: '🟡 TB',     colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' },
  thap:       { label: '🔵 Thấp',   colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
};

let currentStatusFilter = 'all';
let currentSort = { key: 'created_at', dir: 'desc' };

export function renderTaskListView(tasks = []) {
  const container = document.getElementById('task-list-view');
  if (!container) return;

  // Filter out archived tasks
  const activeTasks = tasks.filter(t => normalizeStatus(t.status) !== STATUS.ARCHIVED);

  // Apply status filter
  const filtered = currentStatusFilter === 'all'
    ? activeTasks
    : activeTasks.filter(t => normalizeStatus(t.status) === currentStatusFilter);

  // Sort
  const sorted = sortTasks(filtered, currentSort.key, currentSort.dir);

  // Stats
  const totalActive = activeTasks.length;
  const doneCount = activeTasks.filter(t => normalizeStatus(t.status) === STATUS.DONE).length;
  const progressPct = totalActive > 0 ? Math.round((doneCount / totalActive) * 100) : 0;

  container.innerHTML = `
    <!-- Progress Overview -->
    <div class="task-list-progress mb-6">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-brand-500" style="font-variation-settings:'FILL' 1;">analytics</span>
          <span class="text-sm font-bold text-slate-700 dark:text-slate-200">Tiến độ tổng thể</span>
        </div>
        <span class="text-sm font-black text-brand-600 dark:text-brand-400">${progressPct}%</span>
      </div>
      <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
        <div class="h-full rounded-full bg-gradient-to-r from-brand-500 via-violet-500 to-cyan-400 transition-all duration-700 ease-out" style="width: ${progressPct}%"></div>
      </div>
      <div class="flex items-center gap-4 mt-2 text-[10px] font-semibold text-slate-400">
        <span>${doneCount} hoàn thành</span>
        <span>·</span>
        <span>${totalActive - doneCount} còn lại</span>
        <span>·</span>
        <span>${totalActive} tổng cộng</span>
      </div>
    </div>

    <!-- Status Filter Pills -->
    <div class="flex items-center gap-2 mb-5 flex-wrap">
      <button class="task-list-filter-btn ${currentStatusFilter === 'all' ? 'active' : ''}" data-filter="all">
        Tất cả <span class="ml-1 opacity-60">${activeTasks.length}</span>
      </button>
      <button class="task-list-filter-btn ${currentStatusFilter === 'todo' ? 'active' : ''}" data-filter="todo">
        Cần làm <span class="ml-1 opacity-60">${activeTasks.filter(t => normalizeStatus(t.status) === STATUS.TODO).length}</span>
      </button>
      <button class="task-list-filter-btn ${currentStatusFilter === 'in_progress' ? 'active' : ''}" data-filter="in_progress">
        Đang làm <span class="ml-1 opacity-60">${activeTasks.filter(t => normalizeStatus(t.status) === STATUS.IN_PROGRESS).length}</span>
      </button>
      <button class="task-list-filter-btn ${currentStatusFilter === 'done' ? 'active' : ''}" data-filter="done">
        Hoàn thành <span class="ml-1 opacity-60">${activeTasks.filter(t => normalizeStatus(t.status) === STATUS.DONE).length}</span>
      </button>
    </div>

    <!-- Task Table -->
    ${sorted.length > 0 ? `
    <div class="task-list-table-wrapper">
      <table class="task-list-table w-full">
        <thead>
          <tr>
            <th class="w-10"></th>
            <th class="task-list-sortable text-left" data-sort="title">
              Nhiệm vụ ${getSortIcon('title')}
            </th>
            <th class="task-list-sortable text-left hidden sm:table-cell" data-sort="priority">
              Ưu tiên ${getSortIcon('priority')}
            </th>
            <th class="task-list-sortable text-left hidden md:table-cell" data-sort="status">
              Trạng thái ${getSortIcon('status')}
            </th>
            <th class="task-list-sortable text-left hidden lg:table-cell" data-sort="created_at">
              Ngày tạo ${getSortIcon('created_at')}
            </th>
            <th class="task-list-sortable text-left hidden lg:table-cell" data-sort="deadline">
              Deadline ${getSortIcon('deadline')}
            </th>
            <th class="w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map((task, i) => renderTaskRow(task, i)).join('')}
        </tbody>
      </table>
    </div>
    ` : `
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">filter_list_off</span>
      </div>
      <p class="text-sm text-slate-400 dark:text-slate-500 font-semibold">Không có nhiệm vụ nào</p>
      <p class="text-xs text-slate-300 dark:text-slate-600 mt-1">${currentStatusFilter !== 'all' ? 'Thử đổi bộ lọc khác' : 'Thêm nhiệm vụ mới để bắt đầu'}</p>
    </div>
    `}
  `;

  // Bind filter events
  container.querySelectorAll('.task-list-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentStatusFilter = btn.dataset.filter;
      renderTaskListView(tasks);
    });
  });

  // Bind sort events
  container.querySelectorAll('.task-list-sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (currentSort.key === key) {
        currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort = { key, dir: 'asc' };
      }
      renderTaskListView(tasks);
    });
  });
}

function renderTaskRow(task, index) {
  const status = normalizeStatus(task.status);
  const isDone = status === STATUS.DONE;
  const priority = normalizePriority(task.priority);
  const sb = STATUS_BADGE[status] || STATUS_BADGE.todo;
  const pb = PRIORITY_BADGE[priority] || PRIORITY_BADGE.trung_binh;

  return `
    <tr class="task-list-row ${isDone ? 'task-list-row-done' : ''}" style="animation-delay: ${index * 30}ms" data-task-id="${task.id}">
      <td>
        <label class="task-list-checkbox-wrapper">
          <input type="checkbox" class="task-list-checkbox sr-only" data-task-id="${task.id}" ${isDone ? 'checked' : ''}>
          <div class="task-list-check-visual ${isDone ? 'checked' : ''}">
            ${isDone ? '<span class="material-symbols-outlined text-[12px] text-white" style="font-variation-settings:\'FILL\' 1;">check</span>' : ''}
          </div>
        </label>
      </td>
      <td>
        <div class="flex flex-col">
          <span class="text-[13px] font-semibold text-slate-800 dark:text-slate-100 ${isDone ? 'line-through opacity-50' : ''}">${escapeHTML(task.title || 'Không có tiêu đề')}</span>
          ${task.description ? `<span class="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[200px] sm:max-w-[300px] ${isDone ? 'opacity-40' : ''}">${escapeHTML(task.description)}</span>` : ''}
        </div>
      </td>
      <td class="hidden sm:table-cell">
        <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold ${pb.colorClass}">${pb.label}</span>
      </td>
      <td class="hidden md:table-cell">
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${sb.colorClass}">
          <span class="material-symbols-outlined text-[11px]" style="font-variation-settings:'FILL' 1;">${sb.icon}</span>${sb.label}
        </span>
      </td>
      <td class="hidden lg:table-cell">
        <span class="text-[11px] text-slate-400">${formatDate(task.created_at)}</span>
      </td>
      <td class="hidden lg:table-cell">
        ${renderDeadlineBadge(task)}
      </td>
      <td>
        <div class="flex items-center justify-end gap-1">
          <button class="task-list-action-btn task-action" data-action="edit" data-task-id="${task.id}" title="Sửa">
            <span class="material-symbols-outlined text-[14px] text-brand-500">edit</span>
          </button>
          ${isDone ? `
          <button class="task-list-action-btn task-action" data-action="archive" data-task-id="${task.id}" title="Lưu trữ">
            <span class="material-symbols-outlined text-[14px] text-violet-500">inventory_2</span>
          </button>
          ` : ''}
          <button class="task-list-action-btn task-action" data-action="delete" data-task-id="${task.id}" title="Xóa">
            <span class="material-symbols-outlined text-[14px] text-red-400">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function renderDeadlineBadge(task) {
  if (!task.deadline) return '<span class="text-[11px] text-slate-300 dark:text-slate-600">—</span>';
  const status = getDeadlineStatus(task.deadline);
  const isDone = normalizeStatus(task.status) === STATUS.DONE;
  const text = formatDeadlineRelative(task.deadline);
  
  if (isDone) {
    return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 line-through opacity-50">
      <span class="material-symbols-outlined text-[11px]">event_available</span>${text}
    </span>`;
  }
  
  const styles = {
    overdue: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    today:   'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
    soon:    'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
    normal:  'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/30',
  };
  const icons = { overdue: 'warning', today: 'alarm', soon: 'schedule', normal: 'event' };
  
  return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${styles[status] || styles.normal}">
    <span class="material-symbols-outlined text-[11px]" style="font-variation-settings:'FILL' 1;">${icons[status] || 'event'}</span>${text}
  </span>`;
}

function getSortIcon(key) {
  if (currentSort.key !== key) return '<span class="material-symbols-outlined text-[12px] text-slate-300 ml-0.5" style="vertical-align: -1px;">unfold_more</span>';
  const icon = currentSort.dir === 'asc' ? 'arrow_upward' : 'arrow_downward';
  return `<span class="material-symbols-outlined text-[12px] text-brand-500 ml-0.5" style="vertical-align: -1px;">${icon}</span>`;
}

function sortTasks(tasks, key, dir) {
  const priorityOrder = { 'cao': 0, 'trung_binh': 1, 'thap': 2 };
  const statusOrder = { 'todo': 0, 'in_progress': 1, 'done': 2 };

  return [...tasks].sort((a, b) => {
    let va, vb;
    switch(key) {
      case 'title':
        va = (a.title || '').toLowerCase();
        vb = (b.title || '').toLowerCase();
        break;
      case 'priority':
        va = priorityOrder[normalizePriority(a.priority)] ?? 1;
        vb = priorityOrder[normalizePriority(b.priority)] ?? 1;
        break;
      case 'status':
        va = statusOrder[normalizeStatus(a.status)] ?? 0;
        vb = statusOrder[normalizeStatus(b.status)] ?? 0;
        break;
      case 'created_at':
        va = new Date(a.created_at || 0).getTime();
        vb = new Date(b.created_at || 0).getTime();
        break;
      case 'deadline':
        va = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        vb = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        break;
      default:
        return 0;
    }
    if (va < vb) return dir === 'asc' ? -1 : 1;
    if (va > vb) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

export function resetTaskListFilters() {
  currentStatusFilter = 'all';
  currentSort = { key: 'created_at', dir: 'desc' };
}
