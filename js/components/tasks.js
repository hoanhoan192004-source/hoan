/**
 * Task Card Rendering v4.0 – Ultra Premium
 * Glassmorphism cards with gradient accents & micro-animations
 */

import { getPriorityStyle, getPriorityText, formatDate, escapeHTML, normalizeStatus, sortTasksByPriority } from '../helpers/utils.js';
import { STATUS } from '../config.js';

// ─── Priority colors (light / dark safe) ──────────
const PRIORITY_COLORS = {
  cao:        { bg: 'rgba(254,226,226,0.7)', text: '#dc2626', darkBg: 'rgba(239,68,68,0.12)', darkText: '#f87171', dot: '#ef4444', gradient: 'from-red-500 to-rose-400', emoji: '🔴' },
  trung_binh: { bg: 'rgba(254,243,199,0.7)', text: '#d97706', darkBg: 'rgba(245,158,11,0.12)', darkText: '#fbbf24', dot: '#f59e0b', gradient: 'from-amber-500 to-yellow-400', emoji: '🟡' },
  thap:       { bg: 'rgba(219,234,254,0.7)', text: '#2563eb', darkBg: 'rgba(59,130,246,0.12)', darkText: '#60a5fa', dot: '#3b82f6', gradient: 'from-blue-500 to-indigo-400', emoji: '🔵' },
};

function getPriorityColor(priority) {
  return PRIORITY_COLORS[priority] || PRIORITY_COLORS.trung_binh;
}

// ─── Card Template ────────────────────────────────
export function createTaskCard(task) {
  if (!task?.id) return '';

  const pc = getPriorityColor(task.priority);
  const pt = getPriorityText(task.priority);
  const title = escapeHTML(task.title || 'Không có tiêu đề');
  const isDone = normalizeStatus(task.status) === STATUS.DONE;
  const isDoing = normalizeStatus(task.status) === STATUS.IN_PROGRESS;

  // Description
  const desc = task.description
    ? `<p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">${escapeHTML(task.description)}</p>` : '';

  // Progress bar (enhanced)
  const progress = task.progress != null ? `
    <div class="mb-3">
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Tiến độ</span>
        <span class="text-[10px] font-black text-brand-600 dark:text-brand-400">${task.progress}%</span>
      </div>
      <div class="progress-track bg-slate-100 dark:bg-slate-700/50 rounded-full">
        <div class="progress-fill" style="width:${task.progress}%;"></div>
      </div>
    </div>
  ` : '';

  // Attachments
  const atch = task.attachments ? `
    <span class="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-700/30 px-2 py-0.5 rounded-lg">
      <span class="material-symbols-outlined text-[11px]" style="font-variation-settings:'FILL' 1;">attach_file</span>${task.attachments}
    </span>
  ` : '';

  // Date
  const date = formatDate(task.created_at);

  // Done check (enhanced with gradient)
  const doneCheck = isDone ? `
    <div class="absolute top-3.5 right-3.5 done-check">
      <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-500/30">
        <span class="material-symbols-outlined text-[14px] text-white" style="font-variation-settings:'FILL' 1;">check</span>
      </div>
    </div>
  ` : '';

  // Doing indicator (pulse)
  const doingIndicator = isDoing ? `
    <div class="absolute top-3.5 right-3.5">
      <div class="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/40 animate-pulse"></div>
    </div>
  ` : '';

  // Done label
  const doneLabel = (isDone && task.updated_at) ? `
    <span class="inline-flex items-center gap-1 text-[10px] text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg font-semibold">
      <span class="material-symbols-outlined text-[11px]" style="font-variation-settings:'FILL' 1;">schedule</span>${formatRelativeDate(task.updated_at)}
    </span>
  ` : '';

  // Status for doing
  const doingLabel = isDoing ? `
    <span class="inline-flex items-center gap-1 text-[10px] text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg font-semibold">
      <span class="material-symbols-outlined text-[11px] animate-spin-slow" style="font-variation-settings:'FILL' 1;">sync</span>Đang xử lý
    </span>
  ` : '';

  return `
    <div class="group relative p-4 rounded-2xl task-card ${isDone ? 'opacity-75' : ''}" data-task-id="${task.id}" data-priority="${task.priority}" draggable="true">
      ${doneCheck}
      ${doingIndicator}

      <!-- Priority badge -->
      <div class="flex items-center justify-between mb-2.5">
        <span class="priority-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider"
          style="background:${pc.bg}; color:${pc.text};">
          <span class="w-1.5 h-1.5 rounded-full" style="background:${pc.dot};"></span>
          ${pt}
        </span>
        <div class="relative">
          <button class="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center justify-center transition-all duration-200 task-menu-btn" data-task-id="${task.id}">
            <span class="material-symbols-outlined text-[14px] text-slate-400">more_vert</span>
          </button>
          <div class="task-popover absolute right-0 top-full mt-1.5 w-44 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl hidden z-50 border border-slate-100/80 dark:border-slate-700/50 overflow-hidden py-1.5">
            ${!isDoing && !isDone ? `
            <button class="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs font-semibold transition-all flex items-center gap-2.5 task-action" data-action="move-doing" data-task-id="${task.id}">
              <span class="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-[14px] text-amber-500">autorenew</span>
              </span>
              Đang làm
            </button>
            <div class="border-t border-slate-100 dark:border-slate-700/50 my-1 mx-3"></div>
            ` : ''}
            ${!isDone ? `
            <button class="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs font-semibold transition-all flex items-center gap-2.5 task-action" data-action="move-done" data-task-id="${task.id}">
              <span class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-[14px] text-emerald-500">task_alt</span>
              </span>
              Hoàn thành
            </button>
            <div class="border-t border-slate-100 dark:border-slate-700/50 my-1 mx-3"></div>
            ` : ''}
            <button class="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs font-semibold transition-all flex items-center gap-2.5 task-action" data-action="edit" data-task-id="${task.id}">
              <span class="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-[14px] text-brand-500">edit</span>
              </span>
              Sửa thông tin
            </button>
            <div class="border-t border-slate-100 dark:border-slate-700/50 my-1 mx-3"></div>
            <button class="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/10 text-xs font-semibold text-red-500 transition-all flex items-center gap-2.5 task-action" data-action="delete" data-task-id="${task.id}">
              <span class="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-[14px]">delete</span>
              </span>
              Xóa nhiệm vụ
            </button>
          </div>
        </div>
      </div>

      <!-- Title -->
      <h4 class="text-[13px] font-bold leading-snug mb-1.5 text-slate-800 dark:text-slate-100 ${isDone ? 'line-through opacity-60' : ''}">${title}</h4>

      ${desc}
      ${progress}

      <!-- Footer -->
      <div class="flex items-center gap-2 mt-2.5 flex-wrap">
        <span class="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-700/30 px-2 py-0.5 rounded-lg">
          <span class="material-symbols-outlined text-[11px]">calendar_today</span>${date}
        </span>
        ${atch}
        ${doneLabel}
        ${doingLabel}
      </div>
    </div>
  `;
}

function formatRelativeDate(dateString) {
  if (!dateString) return '';
  try {
    const diff = Math.floor((Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hôm nay';
    if (diff === 1) return '1 ngày trước';
    if (diff < 30) return `${diff} ngày trước`;
    return `${Math.floor(diff / 30)} tháng trước`;
  } catch { return ''; }
}

// ─── Column Rendering ─────────────────────────────
export function renderTasksToColumn(columnId, tasks = []) {
  const col = document.getElementById(columnId);
  if (!col) return;

  if (!tasks.length) {
    col.innerHTML = `
      <div class="empty-state flex flex-col items-center justify-center py-12 text-center">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center mb-3">
          <span class="material-symbols-outlined text-2xl text-slate-300 dark:text-slate-600">inbox</span>
        </div>
        <p class="text-xs text-slate-400 dark:text-slate-500 font-semibold">Chưa có nhiệm vụ</p>
        <p class="text-[10px] text-slate-300 dark:text-slate-600 mt-0.5">Kéo thả hoặc thêm mới</p>
      </div>
    `;
    return;
  }

  col.innerHTML = sortTasksByPriority(tasks).map(t => createTaskCard(t)).join('');
}

export function updateColumnCounter(id, count) {
  const el = document.getElementById(id);
  if (el) el.textContent = count;
}

export function displayAllTasks(tasks) {
  if (!Array.isArray(tasks)) return;

  const todo  = tasks.filter(t => normalizeStatus(t.status) === STATUS.TODO);
  const doing = tasks.filter(t => normalizeStatus(t.status) === STATUS.IN_PROGRESS);
  const done  = tasks.filter(t => normalizeStatus(t.status) === STATUS.DONE);

  renderTasksToColumn('column-todo',  todo);
  renderTasksToColumn('column-doing', doing);
  renderTasksToColumn('column-done',  done);

  updateColumnCounter('count-todo',  todo.length);
  updateColumnCounter('count-doing', doing.length);
  updateColumnCounter('count-done',  done.length);

  // Update stat cards
  animateCounter('stat-todo', todo.length);
  animateCounter('stat-doing', doing.length);
  animateCounter('stat-done', done.length);
}

// Animated counter for stat cards
function animateCounter(elementId, target) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const current = parseInt(el.textContent) || 0;
  if (current === target) return;

  const duration = 400;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(current + (target - current) * eased);
    el.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

export function removeTaskFromColumn(taskId) {
  const card = document.querySelector(`[data-task-id="${taskId}"]`);
  if (!card) return;
  const col = card.closest('.kanban-dropzone');
  card.remove();
  if (col && col.children.length === 0) {
    col.innerHTML = `<div class="empty-state flex flex-col items-center justify-center py-12 text-center"><div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center mb-3"><span class="material-symbols-outlined text-2xl text-slate-300 dark:text-slate-600">inbox</span></div><p class="text-xs text-slate-400 dark:text-slate-500 font-semibold">Chưa có nhiệm vụ</p></div>`;
  }
}

export function addTaskToColumn(task) {
  if (!task?.id) return;
  const status = normalizeStatus(task.status);
  const map = { [STATUS.TODO]: 'column-todo', [STATUS.IN_PROGRESS]: 'column-doing', [STATUS.DONE]: 'column-done' };
  const col = document.getElementById(map[status]);
  if (!col) return;
  if (col.querySelector('.empty-state')) col.innerHTML = '';
  col.insertAdjacentHTML('afterbegin', createTaskCard(task));
}

export function updateTaskInColumn(task) {
  const card = document.querySelector(`[data-task-id="${task.id}"]`);
  if (card) card.outerHTML = createTaskCard(task);
}
