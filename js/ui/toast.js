export function showToast(message, type = 'info') {
  document.querySelectorAll('.toast').forEach(t => {
    t.classList.add('toast-out');
    setTimeout(() => t.remove(), 300);
  });

  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'sync' // Hoặc 'info' tùy chọn
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[16px]" style="font-variation-settings:'FILL' 1; vertical-align: middle; margin-right: 6px;">
      ${icons[type] || 'info'}
    </span>
    ${message}
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}
