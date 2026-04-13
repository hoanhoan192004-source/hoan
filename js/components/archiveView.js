/**
 * Archive View – Displays archived tasks
 * Features: search, restore, permanent delete, clear all
 */

import { STATUS } from '../config.js';
import { normalizeStatus, formatDate, escapeHTML, normalizePriority } from '../helpers/utils.js';

const PRIORITY_LABELS = {
  cao:        { label: '🔴 Cao',   colorClass: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' },
  trung_binh: { label: '🟡 TB',    colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' },
  thap:       { label: '🔵 Thấp',  colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
};

let archiveSearchQuery = '';

export function renderArchiveView(tasks = []) {
  const container = document.getElementById('archive-view');
  if (!container) return;

  const archivedTasks = tasks.filter(t => normalizeStatus(t.status) === STATUS.ARCHIVED);
  
  // Apply search filter
  const filtered = archiveSearchQuery
    ? archivedTasks.filter(t => (t.title || '').toLowerCase().includes(archiveSearchQuery.toLowerCase()))
    : archivedTasks;

  container.innerHTML = `
    <!-- Archive Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20" style="background: linear-gradient(to bottom right, #8b5cf6, #9333ea);">
          <span class="material-symbols-outlined text-white text-lg" style="font-variation-settings:'FILL' 1;">inventory_2</span>
        </div>
        <div>
          <h3 class="text-sm font-black text-slate-800 dark:text-white">Kho lưu trữ</h3>
          <p class="text-[10px] text-slate-400 font-semibold">${archivedTasks.length} nhiệm vụ đã lưu trữ</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <!-- Search -->
        <div class="relative group">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[14px] group-focus-within:text-violet-500 transition-colors">search</span>
          <input id="archive-search" type="text" value="${escapeHTML(archiveSearchQuery)}" placeholder="Tìm trong lưu trữ..."
            class="bg-white/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 rounded-xl py-2 pl-8 pr-3 text-xs w-40 sm:w-48 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400/40 placeholder:text-slate-400 transition-all backdrop-blur-sm" />
        </div>
        ${archivedTasks.length > 0 ? `
        <button id="btn-clear-archive" class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
          <span class="material-symbols-outlined text-[14px]">delete_sweep</span>
          Xóa tất cả
        </button>
        ` : ''}
      </div>
    </div>

    <!-- Archived Tasks -->
    ${filtered.length > 0 ? `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      ${filtered.map((task, i) => renderArchiveCard(task, i)).join('')}
    </div>
    ` : `
    <div class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center mb-4 relative">
        <span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">inventory_2</span>
        <div class="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md">
          <span class="material-symbols-outlined text-[14px] text-slate-300 dark:text-slate-600" style="font-variation-settings:'FILL' 1;">check</span>
        </div>
      </div>
      <p class="text-sm text-slate-400 dark:text-slate-500 font-bold mb-1">${archiveSearchQuery ? 'Không tìm thấy kết quả' : 'Không có gì ở đây'}</p>
      <p class="text-xs text-slate-300 dark:text-slate-600 max-w-[240px]">${archiveSearchQuery ? 'Thử tìm kiếm bằng từ khóa khác' : 'Nhiệm vụ đã hoàn thành có thể được chuyển vào đây để giữ bảng Kanban gọn gàng'}</p>
    </div>
    `}
  `;

  // Bind search event
  const searchInput = container.querySelector('#archive-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      archiveSearchQuery = e.target.value;
      renderArchiveView(tasks);
      // Restore focus and cursor position after re-rendering
      const newSearchInput = document.getElementById('archive-search');
      if (newSearchInput) {
        newSearchInput.focus();
        const len = newSearchInput.value.length;
        newSearchInput.setSelectionRange(len, len);
      }
    });
  }

  // Bind clear all
  const clearBtn = container.querySelector('#btn-clear-archive');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm(`Xác nhận xóa tất cả ${archivedTasks.length} nhiệm vụ đã lưu trữ?\nHành động này không thể hoàn tác.`)) {
        document.dispatchEvent(new CustomEvent('archive:clear-all'));
      }
    });
  }
}

function renderArchiveCard(task, index) {
  const priority = normalizePriority(task.priority);
  const pb = PRIORITY_LABELS[priority] || PRIORITY_LABELS.trung_binh;

  return `
    <div class="archive-card group relative p-4 rounded-2xl" style="animation-delay: ${index * 40}ms" data-task-id="${task.id}">
      <!-- Priority badge -->
      <div class="flex items-center justify-between mb-2.5">
        <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${pb.colorClass}">${pb.label}</span>
        <span class="text-[10px] text-slate-300 dark:text-slate-600">${formatDate(task.created_at)}</span>
      </div>

      <!-- Title & Description -->
      <h4 class="text-[13px] font-bold text-slate-600 dark:text-slate-300 mb-1 line-through opacity-70">${escapeHTML(task.title || 'Không có tiêu đề')}</h4>
      ${task.description ? `<p class="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 mb-3 opacity-60">${escapeHTML(task.description)}</p>` : '<div class="mb-3"></div>'}

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-all task-action" data-action="restore" data-task-id="${task.id}">
          <span class="material-symbols-outlined text-[13px]">restore</span>
          Khôi phục
        </button>
        <button class="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all task-action" data-action="delete" data-task-id="${task.id}" title="Xóa vĩnh viễn">
          <span class="material-symbols-outlined text-[15px]">delete_forever</span>
        </button>
      </div>
    </div>
  `;
}

export function resetArchiveSearch() {
  archiveSearchQuery = '';
}
