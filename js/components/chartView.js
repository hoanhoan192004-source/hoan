/**
 * Chart View – Premium Statistics Dashboard
 * Renders beautiful charts using Canvas API (no external libs)
 */

import { STATUS } from '../config.js';
import { normalizeStatus, normalizePriority, getDeadlineStatus } from '../helpers/utils.js';

export function renderChartView(tasks = []) {
  const container = document.getElementById('chart-view');
  if (!container) return;

  // Filter out archived
  const active = tasks.filter(t => normalizeStatus(t.status) !== STATUS.ARCHIVED);

  // Stats
  const todo = active.filter(t => normalizeStatus(t.status) === STATUS.TODO).length;
  const doing = active.filter(t => normalizeStatus(t.status) === STATUS.IN_PROGRESS).length;
  const done = active.filter(t => normalizeStatus(t.status) === STATUS.DONE).length;
  const total = active.length;

  // Priority stats
  const highP = active.filter(t => normalizePriority(t.priority) === 'cao').length;
  const medP = active.filter(t => normalizePriority(t.priority) === 'trung_binh').length;
  const lowP = active.filter(t => normalizePriority(t.priority) === 'thap').length;

  // Deadline stats
  const withDeadline = active.filter(t => t.deadline);
  const overdue = withDeadline.filter(t => getDeadlineStatus(t.deadline) === 'overdue' && normalizeStatus(t.status) !== STATUS.DONE).length;
  const dueToday = withDeadline.filter(t => getDeadlineStatus(t.deadline) === 'today' && normalizeStatus(t.status) !== STATUS.DONE).length;
  const dueSoon = withDeadline.filter(t => getDeadlineStatus(t.deadline) === 'soon' && normalizeStatus(t.status) !== STATUS.DONE).length;

  // Completion rate
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  container.innerHTML = `
    <!-- Overview Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      ${renderMiniStat('Tổng nhiệm vụ', total, 'assignment', 'from-brand-500 to-violet-500', 'brand')}
      ${renderMiniStat('Hoàn thành', done, 'task_alt', 'from-emerald-500 to-teal-500', 'emerald')}
      ${renderMiniStat('Quá hạn', overdue, 'warning', 'from-red-500 to-rose-500', 'red')}
      ${renderMiniStat('Tỷ lệ', completionRate + '%', 'trending_up', 'from-cyan-500 to-blue-500', 'cyan')}
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
      <!-- Donut Chart: Status -->
      <div class="kanban-column-wrapper p-5 sm:p-6">
        <div class="flex items-center gap-2.5 mb-5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-[16px]" style="font-variation-settings:'FILL' 1;">donut_large</span>
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-white">Phân bổ trạng thái</h3>
            <p class="text-[10px] text-slate-400">Tổng quan nhiệm vụ theo trạng thái</p>
          </div>
        </div>
        <div class="flex items-center justify-center gap-6 flex-wrap">
          <canvas id="chart-status-donut" width="180" height="180"></canvas>
          <div class="flex flex-col gap-2.5">
            ${renderLegendItem('Cần làm', todo, total, '#6366f1')}
            ${renderLegendItem('Đang làm', doing, total, '#f59e0b')}
            ${renderLegendItem('Hoàn thành', done, total, '#10b981')}
          </div>
        </div>
      </div>

      <!-- Bar Chart: Priority -->
      <div class="kanban-column-wrapper p-5 sm:p-6">
        <div class="flex items-center gap-2.5 mb-5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-[16px]" style="font-variation-settings:'FILL' 1;">bar_chart</span>
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-white">Phân bổ ưu tiên</h3>
            <p class="text-[10px] text-slate-400">Số lượng nhiệm vụ theo mức ưu tiên</p>
          </div>
        </div>
        <div class="space-y-4 mt-2">
          ${renderBarItem('🔴 Cao', highP, total, '#ef4444', '#fca5a5')}
          ${renderBarItem('🟡 Trung bình', medP, total, '#f59e0b', '#fcd34d')}
          ${renderBarItem('🔵 Thấp', lowP, total, '#3b82f6', '#93c5fd')}
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Deadline Overview -->
      <div class="kanban-column-wrapper p-5 sm:p-6">
        <div class="flex items-center gap-2.5 mb-5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-[16px]" style="font-variation-settings:'FILL' 1;">schedule</span>
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-white">Tình trạng deadline</h3>
            <p class="text-[10px] text-slate-400">Theo dõi các nhiệm vụ sắp đến hạn</p>
          </div>
        </div>
        <div class="space-y-3">
          ${renderDeadlineStat('Quá hạn', overdue, 'warning', 'text-red-600 dark:text-red-400', 'bg-red-50 dark:bg-red-900/20', 'ring-red-200 dark:ring-red-800/50')}
          ${renderDeadlineStat('Hôm nay', dueToday, 'alarm', 'text-orange-600 dark:text-orange-400', 'bg-orange-50 dark:bg-orange-900/20', 'ring-orange-200 dark:ring-orange-800/50')}
          ${renderDeadlineStat('Sắp đến hạn', dueSoon, 'schedule', 'text-amber-600 dark:text-amber-400', 'bg-amber-50 dark:bg-amber-900/20', '')}
          ${renderDeadlineStat('Có deadline', withDeadline.length, 'event', 'text-slate-600 dark:text-slate-400', 'bg-slate-50 dark:bg-slate-700/30', '')}
        </div>
      </div>

      <!-- Completion Ring -->
      <div class="kanban-column-wrapper p-5 sm:p-6">
        <div class="flex items-center gap-2.5 mb-5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-[16px]" style="font-variation-settings:'FILL' 1;">emoji_events</span>
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-white">Tỷ lệ hoàn thành</h3>
            <p class="text-[10px] text-slate-400">Tiến độ tổng thể dự án</p>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <canvas id="chart-completion-ring" width="200" height="200"></canvas>
        </div>
        <div class="grid grid-cols-3 gap-3 mt-4">
          <div class="text-center p-2.5 rounded-xl bg-brand-50/50 dark:bg-brand-900/10">
            <div class="text-lg font-black text-brand-600 dark:text-brand-400">${todo}</div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Chờ</div>
          </div>
          <div class="text-center p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-900/10">
            <div class="text-lg font-black text-amber-600 dark:text-amber-400">${doing}</div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Đang</div>
          </div>
          <div class="text-center p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10">
            <div class="text-lg font-black text-emerald-600 dark:text-emerald-400">${done}</div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Xong</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Draw charts after DOM is ready
  requestAnimationFrame(() => {
    drawDonutChart('chart-status-donut', [
      { value: todo, color: '#6366f1', label: 'Cần làm' },
      { value: doing, color: '#f59e0b', label: 'Đang làm' },
      { value: done, color: '#10b981', label: 'Hoàn thành' },
    ]);
    drawCompletionRing('chart-completion-ring', completionRate);
  });
}

// ─── Mini Stat Card ─────────────────────────────────
function renderMiniStat(label, value, icon, gradient, color) {
  return `
    <div class="group relative p-4 rounded-2xl bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div class="flex items-center justify-between mb-2">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm">
          <span class="material-symbols-outlined text-white text-[16px]" style="font-variation-settings:'FILL' 1;">${icon}</span>
        </div>
      </div>
      <div class="text-2xl font-black text-slate-800 dark:text-white">${value}</div>
      <p class="text-[10px] text-slate-400 font-semibold mt-0.5">${label}</p>
    </div>
  `;
}

// ─── Legend Item ─────────────────────────────────────
function renderLegendItem(label, count, total, color) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return `
    <div class="flex items-center gap-3">
      <div class="w-3 h-3 rounded-full" style="background:${color};"></div>
      <div>
        <span class="text-xs font-bold text-slate-700 dark:text-slate-200">${label}</span>
        <span class="text-[10px] text-slate-400 ml-1">${count} (${pct}%)</span>
      </div>
    </div>
  `;
}

// ─── Bar Item ───────────────────────────────────────
function renderBarItem(label, count, total, color, lightColor) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return `
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-xs font-bold text-slate-700 dark:text-slate-200">${label}</span>
        <span class="text-xs font-black" style="color:${color};">${count} <span class="text-slate-400 font-medium">(${pct}%)</span></span>
      </div>
      <div class="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700/50 overflow-hidden">
        <div class="h-full rounded-full transition-all duration-700 ease-out" style="width:${pct}%;background:linear-gradient(to right,${color},${lightColor});"></div>
      </div>
    </div>
  `;
}

// ─── Deadline Stat ──────────────────────────────────
function renderDeadlineStat(label, count, icon, textColor, bgColor, ringColor) {
  return `
    <div class="flex items-center justify-between p-3 rounded-xl ${bgColor} ${ringColor ? 'ring-1 ' + ringColor : ''} transition-all">
      <div class="flex items-center gap-2.5">
        <span class="material-symbols-outlined text-[18px] ${textColor}" style="font-variation-settings:'FILL' 1;">${icon}</span>
        <span class="text-xs font-bold ${textColor}">${label}</span>
      </div>
      <span class="text-sm font-black ${textColor}">${count}</span>
    </div>
  `;
}

// ─── Canvas: Donut Chart ────────────────────────────
function drawDonutChart(canvasId, segments) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 180;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const cx = size / 2, cy = size / 2, radius = 70, lineWidth = 22;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  if (total === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 14px Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Chưa có dữ liệu', cx, cy);
    return;
  }

  let startAngle = -Math.PI / 2;
  const gap = 0.04;

  // Animate
  let progress = 0;
  function animate() {
    progress = Math.min(progress + 0.03, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    ctx.clearRect(0, 0, size, size);

    // Background ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    let angle = -Math.PI / 2;
    segments.forEach(seg => {
      const sliceAngle = (seg.value / total) * Math.PI * 2 * eased;
      if (sliceAngle > gap) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, angle + gap / 2, angle + sliceAngle - gap / 2);
        ctx.strokeStyle = seg.color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      angle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b';
    ctx.font = 'bold 28px Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, cx, cy - 6);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px Inter, system-ui';
    ctx.fillText('NHIỆM VỤ', cx, cy + 14);

    if (progress < 1) requestAnimationFrame(animate);
  }
  animate();
}

// ─── Canvas: Completion Ring ────────────────────────
function drawCompletionRing(canvasId, percentage) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 200;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const cx = size / 2, cy = size / 2, radius = 80, lineWidth = 16;

  let progress = 0;
  function animate() {
    progress = Math.min(progress + 0.02, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    ctx.clearRect(0, 0, size, size);

    // Background
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Progress arc
    const endAngle = -Math.PI / 2 + (percentage / 100) * Math.PI * 2 * eased;
    if (percentage > 0) {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(0.5, '#06b6d4');
      gradient.addColorStop(1, '#6366f1');

      ctx.beginPath();
      ctx.arc(cx, cy, radius, -Math.PI / 2, endAngle);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Center text
    const displayPct = Math.round(percentage * eased);
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b';
    ctx.font = 'bold 36px Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayPct + '%', cx, cy - 4);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px Inter, system-ui';
    ctx.fillText('HOÀN THÀNH', cx, cy + 18);

    if (progress < 1) requestAnimationFrame(animate);
  }
  animate();
}
