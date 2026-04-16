/**
 * Utility Functions
 * Helpers for formatting, styling, and data normalization
 */

import { PRIORITY } from '../config.js';

// ─── Priority Colors ──────────────────────────────
const PRIORITY_COLORS = {
  'cao':        { bg: '#ffdada', text: '#ba1a1a' },
  'trung_binh': { bg: '#fff4cf', text: '#705a00' },
  'thap':       { bg: '#d3e4fe', text: '#38485d' }
};

export function getPriorityStyle(priority) {
  return PRIORITY_COLORS[normalizePriority(priority)] || PRIORITY_COLORS['trung_binh'];
}

export function getPriorityText(priority) {
  const p = normalizePriority(priority);
  if (p === 'cao') return 'CAO';
  if (p === 'thap') return 'THẤP';
  return 'TRUNG BÌNH';
}

export function normalizePriority(priority) {
  const p = (priority?.toLowerCase().trim() || 'trung_binh').replace(/\s+/g, '_');
  return PRIORITY.ALIASES[p] || 'trung_binh';
}

// ─── Status ───────────────────────────────────────
export function normalizeStatus(status) {
  if (!status) return 'todo';
  const s = status.toLowerCase().trim();
  const aliases = {
    'cần làm': 'todo', 'đang làm': 'in_progress', 'hoàn thành': 'done',
    'doing': 'in_progress', 'completed': 'done'
  };
  return aliases[s] || s;
}

// ─── Formatting ───────────────────────────────────
export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    const months = ['Thg 1','Thg 2','Thg 3','Thg 4','Thg 5','Thg 6',
                    'Thg 7','Thg 8','Thg 9','Thg 10','Thg 11','Thg 12'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  } catch { return ''; }
}

export function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── Sorting ──────────────────────────────────────
export function sortTasksByPriority(tasks) {
  if (!tasks?.length) return [];
  const order = { 'cao': 0, 'trung_binh': 1, 'thap': 2 };
  return [...tasks].sort((a, b) =>
    (order[normalizePriority(a.priority)] ?? 1) - (order[normalizePriority(b.priority)] ?? 1)
  );
}

// ─── Deadline ─────────────────────────────────────
/**
 * Returns deadline status: 'overdue', 'today', 'soon' (within 2 days), or 'normal'
 */
export function getDeadlineStatus(deadline) {
  if (!deadline) return null;
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dl = new Date(deadline);
    dl.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays <= 2) return 'soon';
    return 'normal';
  } catch { return null; }
}

/**
 * Format deadline for display, e.g. "17 Thg 4" or "Quá hạn 3 ngày"
 */
export function formatDeadline(deadline) {
  if (!deadline) return '';
  try {
    const d = new Date(deadline);
    const months = ['Thg 1','Thg 2','Thg 3','Thg 4','Thg 5','Thg 6',
                    'Thg 7','Thg 8','Thg 9','Thg 10','Thg 11','Thg 12'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  } catch { return ''; }
}

export function formatDeadlineRelative(deadline) {
  if (!deadline) return '';
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dl = new Date(deadline);
    dl.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `Quá hạn ${Math.abs(diffDays)} ngày`;
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Ngày mai';
    if (diffDays <= 7) return `Còn ${diffDays} ngày`;
    return formatDeadline(deadline);
  } catch { return ''; }
}
